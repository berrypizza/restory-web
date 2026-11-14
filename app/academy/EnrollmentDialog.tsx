"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ACADEMY_OFFER } from "@/lib/academy/offer";
import { trackAcademy, type AcademyCtaLocation } from "@/lib/academy/analytics";
import { attributionForCta, consultationHref } from "@/lib/academy/attribution";
import styles from "./gisal.module.css";

export function EnrollButton({ className, location = "nav", label = ACADEMY_OFFER.ctaLabel }: { className?: string; location?: AcademyCtaLocation; label?: string }) {
  function onClick() {
    const attribution = attributionForCta(location);
    if (location === "basic" || location === "premium") trackAcademy("academy_plan_cta_click", { location, plan: location, ...attribution });
    else trackAcademy(location === "hero" ? "academy_hero_cta_click" : "academy_cta_click", { location, ...attribution });
  }
  return <Link href={consultationHref(location)} className={className} onClick={onClick} onAuxClick={event => { if (event.button === 1) onClick(); }}>{label} <span aria-hidden="true">↗</span></Link>;
}

export function EnrollmentProvider({ children }: { children: ReactNode }) {
  return <div className={styles.page}>{children}</div>;
}
