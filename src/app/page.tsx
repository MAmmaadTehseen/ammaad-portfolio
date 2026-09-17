import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Marquee from "@/components/Marquee";
import Reel from "@/components/Reel";
import StackPanel from "@/components/StackPanel";
import Contact from "@/components/Contact";
import { capabilities, meta, profile } from "@/content/site";

/**
 * Google requires a ProfilePage to name its mainEntity. The person's full node
 * is in the layout's graph; name and sameAs are repeated here so the required
 * field never depends on an @id reference resolving across two script blocks.
 */
const PROFILE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${profile.site}/#profile`,
  url: profile.site,
  name: meta.title,
  inLanguage: "en",
  isPartOf: { "@id": `${profile.site}/#website` },
  mainEntity: {
    "@type": "Person",
    "@id": `${profile.site}/#person`,
    name: profile.name,
    url: profile.site,
    image: `${profile.site}${profile.photo.src}`,
    sameAs: profile.socials.map((social) => social.href),
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PROFILE_SCHEMA) }}
      />
      <Hero />
      <Intro />
      <Marquee items={capabilities} />
      <Reel />
      <StackPanel />
      <Contact />
    </>
  );
}
