"use client";

import { useEffect, useRef } from "react";
import { trackAcademy } from "@/lib/academy/analytics";

export default function AcademyTracking() {
  const visited = useRef(false);
  const fieldViewed = useRef(false);
  useEffect(() => {
    if (!visited.current) { trackAcademy("academy_landing_view"); visited.current = true; }
    const section = document.getElementById("field-method");
    const observer = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting) && !fieldViewed.current) {
        fieldViewed.current = true;
        trackAcademy("academy_field_section_view");
        observer?.disconnect();
      }
    }, { threshold: 0.15 }) : null;
    if (section) observer?.observe(section);
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[data-academy-proof]") : null;
      if (link) trackAcademy("academy_proof_click", { case_id: link.dataset.academyProof });
    };
    document.addEventListener("click", onClick);
    return () => { observer?.disconnect(); document.removeEventListener("click", onClick); };
  }, []);
  return null;
}
