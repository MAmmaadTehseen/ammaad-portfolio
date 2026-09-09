import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Marquee from "@/components/Marquee";
import Reel from "@/components/Reel";
import StackPanel from "@/components/StackPanel";
import Contact from "@/components/Contact";
import { capabilities } from "@/content/site";

export default function Page() {
  return (
    <>
      <Hero />
      <Intro />
      <Marquee items={capabilities} />
      <Reel />
      <StackPanel />
      <Contact />
    </>
  );
}
