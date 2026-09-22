import type { ReactNode } from "react";
import { preload } from "react-dom";
// The pieces next/image is made of, imported directly. `next/image` itself
// re-exports its client-only <Image> alongside getImageProps, so importing it
// from a server component ships that client component (about 5 KB gz) to
// every page with a portrait or an avatar, even when only getImageProps is
// used. These two modules are plain functions, and the image config they need
// is inlined by Next's define plugin in the server build as well.
import { getImgProps, type ImageProps } from "next/dist/shared/lib/get-img-props";
import type { ImageConfigComplete } from "next/dist/shared/lib/image-config";
import defaultLoader from "next/dist/shared/lib/image-loader";
import Link from "next/link";
import { profile } from "@/content/site";
// A static import rather than profile.photo.src: it is what gives next/image
// the intrinsic size and the blur placeholder, so the frame never paints empty.
import photo from "../../public/ammaad-tehseen.jpg";

type Variant = "hero" | "about";

/**
 * getImageProps without the client component: the same srcset, blur
 * placeholder, fetchpriority and optimiser URLs as <Image>, as a plain <img>.
 */
export function serverImageProps(props: ImageProps) {
  return getImgProps(props, {
    defaultLoader,
    imgConf: process.env.__NEXT_IMAGE_OPTS as unknown as ImageConfigComplete,
  }).props;
}

/**
 * Per placement, from DESIGN.md §7. The hero column is 420px from 1024px up
 * and near full width below; About's column is a little wider.
 */
const SIZES: Record<Variant, string> = {
  hero: "(min-width:1024px) 420px, 92vw",
  about: "(min-width:1024px) 460px, 92vw",
};

/**
 * The one photograph on the site, in colour from the first frame, with the
 * sunset spilling off it onto the page (figure::before in globals.css).
 *
 * `hero` adds .portrait-hero, which is what the CSS keys the window opening,
 * the settle and the spill waking on; those play once per session and only
 * under html.m, so reduced motion and no-JS both get the finished picture.
 * `about` is the same figure, static. Neither variant ever starts at
 * opacity 0.
 */
export default function Portrait({
  variant,
  caption,
  href,
  className,
}: {
  variant: Variant;
  /** Rendered as the figcaption, under the frame. */
  caption?: ReactNode;
  /** Makes the frame a link (the caption stays plain text). */
  href?: string;
  className?: string;
}) {
  const hero = variant === "hero";

  const props = serverImageProps({
    src: photo,
    alt: profile.photo.alt,
    placeholder: "blur",
    priority: true,
    fetchPriority: "high",
    quality: hero ? 80 : undefined,
    sizes: SIZES[variant],
  });
  // <Image priority> did this itself: it is what lets the LCP image start
  // downloading from the <head>, before the parser reaches the figure.
  preload(props.src ?? photo.src, {
    as: "image",
    imageSrcSet: props.srcSet,
    imageSizes: props.sizes,
    fetchPriority: "high",
  });

  const image = (
    <img
      {...props}
      alt={profile.photo.alt}
      // Below 1024px the hero crop sits a touch lower so the face, not the
      // sky above it, holds the narrower frame.
      className={`block h-full w-full object-cover ${
        hero ? "object-[50%_22%] lg:object-center" : ""
      }`}
    />
  );

  return (
    <figure
      className={[
        "portrait",
        hero ? "portrait-hero w-full max-w-[360px] lg:max-w-[420px]" : "w-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {href ? (
        <Link href={href} aria-label={`About ${profile.name}`} className="portrait-frame block">
          {image}
        </Link>
      ) : (
        <div className="portrait-frame">{image}</div>
      )}
      {caption && <figcaption className="t-meta mt-3">{caption}</figcaption>}
    </figure>
  );
}
