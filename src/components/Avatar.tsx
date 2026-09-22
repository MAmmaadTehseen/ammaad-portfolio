import { serverImageProps } from "./Portrait";
import photo from "../../public/ammaad-tehseen.jpg";

/**
 * The portrait as a small round crop (nav 32, closing room 40, contact 72).
 * Always beside the name, so it is decorative: alt="". The crop is pulled up
 * to 16% so a 4:5 photo still centres the face in a circle. No `sizes`: at a
 * fixed width next/image emits a 1x/2x srcset, which is all a dot this small needs.
 * A plain server <img> (see serverImageProps), so the nav and the closing
 * room do not ship next/image's client component.
 */
export default function Avatar({ size, className }: { size: number; className?: string }) {
  const props = serverImageProps({ src: photo, alt: "", width: size, height: size });
  return (
    <img
      {...props}
      alt=""
      className={`inline-block shrink-0 rounded-full bg-[oklch(0.42_0.05_55)] object-cover object-[50%_16%] ${
        className ?? ""
      }`}
      style={{ width: size, height: size }}
    />
  );
}
