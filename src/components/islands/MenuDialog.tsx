"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

/** The header shows its links inline from here up, so the sheet has no job. */
const WIDE = "(min-width: 48rem)";

/**
 * The mobile menu (effect #11): a "Menu" button and a native modal <dialog>.
 *
 * showModal() gives the focus trap, Esc and the inert page for free, so this
 * island only handles what the platform does not:
 * - Lenis is stopped while the sheet is open, or the wheel would scroll the page behind it.
 * - Touch has no Lenis, so the root's overflow is clipped instead.
 * - Focus goes back to the button on close. Browsers disagree on doing this
 *   themselves, and a link that closes the sheet would otherwise drop it on <body>.
 * - Following a link closes the sheet, and so does widening past 768px, where
 *   the button disappears and would leave an open sheet with no way back.
 *
 * The contents are server-rendered and arrive as children, so nothing from
 * site.ts is bundled here.
 */
export default function MenuDialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const show = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    window.__lenis?.stop();
    document.documentElement.style.overflow = "clip";
    setOpen(true);
  };

  const hide = () => dialogRef.current?.close();

  // Esc, the Close button and link clicks all end here, via the native close event.
  const onClose = () => {
    window.__lenis?.start();
    document.documentElement.style.removeProperty("overflow");
    setOpen(false);
    buttonRef.current?.focus({ preventScroll: true });
  };

  const onClick = (event: MouseEvent<HTMLDialogElement>) => {
    if ((event.target as Element).closest("a[href]")) hide();
  };

  useEffect(() => {
    const wide = window.matchMedia(WIDE);
    const onChange = () => {
      if (wide.matches) hide();
    };
    wide.addEventListener("change", onChange);
    return () => {
      wide.removeEventListener("change", onChange);
      // unmounting while open must not leave the page unscrollable
      if (dialogRef.current?.open) {
        window.__lenis?.start();
        document.documentElement.style.removeProperty("overflow");
      }
    };
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="site-menu"
        className="btn btn-ghost t-ui md:hidden"
      >
        Menu
      </button>
      <dialog
        ref={dialogRef}
        id="site-menu"
        aria-label="Menu"
        onClose={onClose}
        onClick={onClick}
        data-lenis-prevent=""
        className="menu bg-surface text-ink-2 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-0 p-0"
      >
        <div className="frame flex min-h-full flex-col pt-4 pb-10">
          <div className="flex min-h-14 items-center justify-end">
            <button type="button" onClick={hide} className="btn btn-ghost t-ui">
              Close
            </button>
          </div>
          {children}
        </div>
      </dialog>
    </>
  );
}
