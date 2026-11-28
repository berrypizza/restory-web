"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./academy-stage.module.css";

import { INTRO_SEEN_KEY as SEEN_KEY } from "./introKey";

/* Opening sequence: handwritten line on blue → brush band paints in with a second line → reveals the hero.
   Plays once per browser session; skipped for reduced motion. */
export default function AcademyIntro({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.dataset.off !== undefined) { setDone(true); return; }
    try { sessionStorage.setItem(SEEN_KEY, "1"); } catch {}
    const onEnd = (event: AnimationEvent) => { if (event.target === el) setDone(true); };
    el.addEventListener("animationend", onEnd);
    return () => el.removeEventListener("animationend", onEnd);
  }, []);

  if (done) return null;
  return (
    <>
      <div ref={ref} id="gisal-intro" className={styles.intro} aria-hidden="true" suppressHydrationWarning>
        {children}
        <button type="button" className={styles.skip} onClick={() => setDone(true)} tabIndex={-1}>SKIP →</button>
      </div>
    </>
  );
}
