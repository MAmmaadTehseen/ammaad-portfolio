import Image from "next/image";
import { profile } from "@/content/site";

/**
 * The one photograph on the site, mounted like everything else on the panel:
 * a plate with an engraved caption rather than a floating avatar circle.
 */
export default function Portrait({
  sizes,
  priority = false,
  className,
}: {
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure className={`u-panel u-chamfer p-1.5 ${className ?? ""}`}>
      <Image
        src={profile.photo.src}
        alt={profile.photo.alt}
        width={profile.photo.width}
        height={profile.photo.height}
        sizes={sizes}
        priority={priority}
        className="block h-auto w-full"
      />
      <figcaption className="u-mono text-dim flex items-center justify-between gap-3 px-1 pt-2 pb-0.5 text-[10px] tracking-[0.14em] uppercase">
        <span>{profile.short} Tehseen</span>
        <span>{profile.location.split(",")[0]}</span>
      </figcaption>
    </figure>
  );
}
