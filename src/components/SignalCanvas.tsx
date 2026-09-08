"use client";

import { useEffect, useRef } from "react";

/**
 * The live trace behind the hero: seven stacked signal lines driven by fBm
 * noise, with an amber energy term that flares where the noise peaks.
 *
 * Raw WebGL on purpose — a shader is a few hundred bytes where a 3D library
 * would be a few hundred kilobytes.
 *
 * Cost control, in order of how much each one saves:
 *
 * 1. The backing store renders at a fraction of CSS pixels. Every feature here
 *    is a soft glow, so there is nothing for the extra resolution to resolve;
 *    it is pure fill-rate. This is the single biggest saving.
 * 2. Three fBm octaves rather than five. The traces are wide and slow, so the
 *    top two octaves were riding below the visible amplitude.
 * 3. The loop stops when the hero leaves the viewport and when the tab is
 *    hidden. Time accumulates only while running, so resuming continues the
 *    animation instead of jumping.
 */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;

float hash(float n) { return fract(sin(n) * 43758.5453123); }

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n = i.x + i.y * 57.0;
  return mix(mix(hash(n), hash(n + 1.0), f.x),
             mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
}

// three octaves: the fourth and fifth sat below the amplitude these traces
// actually show, so they cost fill rate and rendered nothing
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res.xy) / u_res.y;

  vec3 col = vec3(0.0);

  for (int i = 0; i < 7; i++) {
    float fi = float(i);
    // biased upward: the lower third of the hero belongs to the type
    float yOff = 0.10 + (fi - 3.0) * 0.105;
    float speed = 0.05 + fi * 0.011;
    float amp = 0.030 + 0.015 * sin(fi * 1.7);
    float w = fbm(vec2(p.x * 1.9 + u_time * speed, fi * 3.7 + u_time * 0.04));
    float y = yOff + (w - 0.5) * amp * 2.2;
    float d = abs(p.y - y);

    float core = 0.0016 / (d + 0.0016);
    float glow = 0.013 / (d + 0.013) * 0.48;

    float energy = smoothstep(0.36, 0.92, fbm(vec2(p.x * 1.1 - u_time * 0.09, fi * 5.1)));
    vec3 olive = vec3(0.38, 0.52, 0.20);
    vec3 amber = vec3(0.98, 0.58, 0.14);
    vec3 tint = mix(olive, amber, energy * 0.8);

    col += (core * 0.55 + glow) * tint * (0.5 + 0.5 * energy);
  }

  // a soft refresh wash, not a bar: wide and weak, or it reads as a glitch
  float sweep = fract(u_time * 0.055);
  col += (1.0 - smoothstep(0.0, 0.10, abs(uv.x - sweep))) * vec3(0.30, 0.40, 0.16) * 0.10;

  // the type is protected by a scrim in Hero.tsx, so the field only needs a
  // gentle lower falloff rather than a hard cut
  col *= mix(0.45, 1.0, smoothstep(-0.42, -0.05, p.y));

  float vig = smoothstep(1.30, 0.25, length(p * vec2(0.78, 1.25)));
  col *= vig * 1.6;

  float a = clamp(max(col.r, max(col.g, col.b)) * 1.85, 0.0, 1.0);
  gl_FragColor = vec4(col, a);
}
`;

/** Fraction of a CSS pixel actually rendered. Everything on screen is a soft
 *  glow, so this is invisible and roughly quadratic in cost. */
const RES_SCALE = 0.6;
const MAX_DPR = 1.25;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function SignalCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
      desynchronized: true,
    } as WebGLContextAttributes);
    if (!gl) return; // no WebGL: the section simply reads as a plain panel

    const vert = compile(gl, gl.VERTEX_SHADER, VERT);
    const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, MAX_DPR) * RES_SCALE;
      const width = Math.max(1, Math.round(canvas.clientWidth * scale));
      const height = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;
    let elapsed = reduced.matches ? 12 : 0; // reduced motion gets one composed frame
    let last = 0;
    let visible = true;
    let onScreen = true;
    let looping = false;

    const draw = (now: number) => {
      const delta = last ? Math.min(now - last, 64) : 16;
      last = now;
      if (!reduced.matches) elapsed += delta / 1000;

      resize();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (reduced.matches || !visible || !onScreen) {
        looping = false;
        return;
      }
      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (looping) return;
      looping = true;
      last = 0; // never bill the pause to the clock
      frame = requestAnimationFrame(draw);
    };

    const stop = () => {
      looping = false;
      cancelAnimationFrame(frame);
    };

    start();

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible && onScreen) start();
      else stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // the hero is one screen tall; once it is gone there is nothing to draw
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && visible) start();
        else stop();
      },
      { rootMargin: "80px" },
    );
    observer.observe(canvas);

    const onResize = () => {
      if (!looping) requestAnimationFrame(draw);
    };
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      gl.deleteBuffer(buffer);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
