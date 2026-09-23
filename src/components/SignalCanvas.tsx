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
 * 2. Four fBm octaves rather than five. The fifth rode below the amplitude
 *    these traces actually show.
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
uniform vec2 u_mouse;      // framebuffer pixels
uniform float u_influence; // 0 when the pointer is away, 1 when it is over

float hash(float n) { return fract(sin(n) * 43758.5453123); }

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n = i.x + i.y * 57.0;
  return mix(mix(hash(n), hash(n + 1.0), f.x),
             mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
}

// four octaves: five was past the amplitude these traces show, three read as
// too smooth once the field was upscaled
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
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

  vec3 olive = vec3(0.38, 0.52, 0.20);
  vec3 amber = vec3(0.98, 0.58, 0.14);

  // the pointer, in the same space as p
  vec2 mp = (u_mouse - 0.5 * u_res) / u_res.y;

  // ---- antigravity: space itself bulges away from the pointer ----
  // Everything downstream is sampled in the warped space, so the traces, the
  // packets riding them and the grain all bend around the cursor as one field
  // rather than as separate effects layered on top of each other.
  vec2 toM = p - mp;
  float md = length(toM);
  float bulge = u_influence * 0.085 * exp(-md * md * 5.5);
  p += (toM / (md + 0.0001)) * bulge;

  float mdist = length(p - mp);

  for (int i = 0; i < 7; i++) {
    float fi = float(i);
    // biased upward: the lower third of the hero belongs to the type
    float yOff = 0.10 + (fi - 3.0) * 0.105;
    float speed = 0.05 + fi * 0.011;
    float amp = 0.030 + 0.015 * sin(fi * 1.7);
    float w = fbm(vec2(p.x * 1.9 + u_time * speed, fi * 3.7 + u_time * 0.04));
    float y = yOff + (w - 0.5) * amp * 2.2;

    // the traces are repelled by the pointer. Direction is normalised smoothly
    // rather than with sign(), which would tear the line where it crosses the
    // cursor; the falloff is gaussian in x so the bend has shoulders.
    float dx = p.x - mp.x;
    float reach = exp(-dx * dx * 9.0);
    float lift = y - mp.y;
    float dir = lift / (abs(lift) + 0.075);
    float bend = dir * reach * 0.075 * u_influence * exp(-abs(lift) * 2.2);
    y += bend;

    float d = abs(p.y - y);

    float core = 0.0016 / (d + 0.0016);
    float glow = 0.013 / (d + 0.013) * 0.48;

    float energy = smoothstep(0.36, 0.92, fbm(vec2(p.x * 1.1 - u_time * 0.09, fi * 5.1)));
    // the trace runs hot where it is being pushed
    energy = clamp(energy + reach * u_influence * exp(-abs(lift) * 3.0) * 0.55, 0.0, 1.0);

    vec3 tint = mix(olive, amber, energy * 0.8);
    col += (core * 0.55 + glow) * tint * (0.5 + 0.5 * energy);

    // Packets riding the trace — the same motif as the architecture diagrams,
    // at the scale of the whole panel. They cost nothing extra: the trace's y
    // at this pixel's x is already solved above, so a packet is one distance
    // test rather than another noise evaluation.
    for (int j = 0; j < 2; j++) {
      float phase = fract(u_time * (0.055 + fi * 0.009) + float(j) * 0.5 + fi * 0.23);
      float px = mix(-1.10, 1.10, phase);
      float dxp = p.x - px;
      float dyp = p.y - y;
      // squashed vertically so a packet reads as travelling along the line
      float dp2 = dxp * dxp + dyp * dyp * 6.0;
      // fades in and out at the ends instead of popping at the edge
      float ends = smoothstep(0.0, 0.12, phase) * (1.0 - smoothstep(0.88, 1.0, phase));
      col += amber * exp(-dp2 * 6000.0) * 1.35 * ends;
    }
  }

  // a soft bloom around the cursor, so the field acknowledges it even between
  // the traces
  col += vec3(0.98, 0.58, 0.14) * exp(-mdist * mdist * 34.0) * 0.16 * u_influence;

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
const RES_SCALE = 0.7;
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
      // deliberately NOT desynchronized: it buys nothing for an ambient
      // background and can leave the canvas blank on some real GPUs while
      // rendering fine under software rasterisation
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
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uInfluence = gl.getUniformLocation(program, "u_influence");

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

    /**
     * Pointer state lives here rather than in React. The listener only writes
     * a target; the draw loop eases toward it, so the traces lag the cursor
     * slightly and settle instead of snapping to it.
     */
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, influence: 0, target: 0, seen: false };
    let rect = canvas.getBoundingClientRect();

    const draw = (now: number) => {
      const delta = last ? Math.min(now - last, 64) : 16;
      last = now;
      if (!reduced.matches) elapsed += delta / 1000;

      // No pointer on this device (touch, or nobody has moved yet): drift a
      // soft attractor so the field still breathes instead of sitting flat.
      if (!pointer.seen && !reduced.matches) {
        const drift = elapsed * 0.16;
        pointer.tx = canvas.width * (0.5 + 0.3 * Math.sin(drift));
        pointer.ty = canvas.height * (0.62 + 0.16 * Math.sin(drift * 1.37));
        pointer.target = 0.55;
      }

      // frame-rate independent easing, so the feel is the same at 30 and 144Hz
      const ease = 1 - Math.pow(0.0015, delta / 1000);
      pointer.x += (pointer.tx - pointer.x) * ease;
      pointer.y += (pointer.ty - pointer.y) * ease;
      pointer.influence += (pointer.target - pointer.influence) * ease;

      resize();
      // one layout read per frame, so the pointer listener never does its own
      rect = canvas.getBoundingClientRect();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, pointer.x, pointer.y);
      gl.uniform1f(uInfluence, reduced.matches ? 0 : pointer.influence);
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

    // ---- pointer interaction -------------------------------------------
    // Touch is deliberately excluded: a finger on the hero is a scroll, and
    // bending the traces under it would fight the gesture.
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || reduced.matches) return;

      const insideX = event.clientX >= rect.left && event.clientX <= rect.right;
      const insideY = event.clientY >= rect.top && event.clientY <= rect.bottom;

      pointer.tx = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * canvas.width;
      // gl_FragCoord counts up from the bottom
      pointer.ty = (1 - (event.clientY - rect.top) / Math.max(rect.height, 1)) * canvas.height;
      pointer.target = insideX && insideY ? 1 : 0;

      if (!pointer.seen) {
        // arrive at the real position instead of sweeping in from the corner
        pointer.seen = true;
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
      }
    };

    const onPointerOut = () => {
      pointer.target = 0;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerOut);
    window.addEventListener("blur", onPointerOut);

    const onResize = () => {
      rect = canvas.getBoundingClientRect();
      if (!looping) requestAnimationFrame(draw);
    };
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerOut);
      window.removeEventListener("blur", onPointerOut);
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
