"use client";

import { useEffect } from "react";

/* Frosted header that overlaps the hero (premium nav):
   - publishes the header's real height as --gisal-hdr so the hero can sit under it
   - marks the header data-solid once the hero has scrolled away, so text stays readable over dark sections */
export default function HeaderGlass() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-gisal-header]");
    const hero = document.querySelector<HTMLElement>('[data-service-section="intro_stage"]');
    if (!header) return;
    const root = document.documentElement;
    let io: IntersectionObserver | undefined;

    const observeHero = (height: number) => {
      io?.disconnect();
      if (!hero) return;
      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) delete header.dataset.solid;
        else header.dataset.solid = "";
      }, { rootMargin: `-${Math.round(height)}px 0px 0px 0px` });
      io.observe(hero);
    };

    const ro = new ResizeObserver(() => {
      const height = header.getBoundingClientRect().height;
      root.style.setProperty("--gisal-hdr", `${Math.round(height)}px`);
      observeHero(height);
    });
    ro.observe(header);

    return () => {
      ro.disconnect();
      io?.disconnect();
      root.style.removeProperty("--gisal-hdr");
    };
  }, []);

  return null;
}
