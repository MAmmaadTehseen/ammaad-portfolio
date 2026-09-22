import FeaturedStage from "@/components/home/FeaturedStage";
import Hero from "@/components/home/Hero";
import Horizon from "@/components/home/Horizon";
import Services from "@/components/home/Services";
import ShortVersion from "@/components/home/ShortVersion";
import { meta, profile } from "@/content/site";

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

/**
 * Home, in the order a wary client needs it: who and what (hero), the range
 * (horizon band), what he can build for them (services, each with proof),
 * the work drawn as architecture (featured stage), and the same person told
 * three ways (short version). The closing room comes from the layout.
 *
 * Every section is a server component. The only client code on this page is
 * two small islands, FeaturedTabs and Torch, and neither takes props: they
 * read the server HTML, so no project data is shipped to the browser.
 */
export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PROFILE_SCHEMA) }}
      />
      <Hero />
      <Horizon />
      <Services />
      <FeaturedStage />
      <ShortVersion />
    </>
  );
}
