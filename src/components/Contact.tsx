import { profile } from "@/content/site";
import Reveal from "./Reveal";
import SplitText from "./SplitText";
import EmailLink from "./EmailLink";
import BookCallLink from "./BookCallLink";
import WhatsAppLink from "./WhatsAppLink";

export default function Contact() {

  return (
    <section
      id="contact"
      className="border-line-soft u-grain scroll-mt-24 border-t px-5 pt-24 pb-10 sm:px-8 sm:pt-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className={`u-led ${profile.available ? "u-led-live" : ""}`} aria-hidden />
            <span className="u-mono text-muted text-[11px] tracking-[0.14em] uppercase">
              {profile.available ? profile.availableNote : "Not taking work right now"}
            </span>
          </div>
        </Reveal>

        <h2 className="u-display text-ink mt-8 text-[clamp(2.25rem,8vw,6rem)]">
          <SplitText text="Let’s build" stagger={0.07} />
          <br />
          <SplitText text="something that lasts." delay={0.12} stagger={0.07} />
        </h2>

        <Reveal delay={0.1}>
          <EmailLink />
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
            <BookCallLink className="text-muted hover:text-signal" />
            <WhatsAppLink className="text-muted hover:text-signal" />
          </div>
        </Reveal>

      </div>
    </section>
  );
}
