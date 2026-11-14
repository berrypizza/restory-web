"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ACADEMY_OFFER } from "@/lib/academy/offer";
import { trackAcademy, type AcademyCtaLocation } from "@/lib/academy/analytics";
import styles from "./gisal.module.css";

export function EnrollButton({ className, location = "nav" }: { className?: string; location?: AcademyCtaLocation }) {
  function onClick() {
    if (location === "basic" || location === "premium") trackAcademy("academy_plan_cta_click", { location, plan: location });
    else trackAcademy(location === "hero" ? "academy_hero_cta_click" : "academy_cta_click", { location });
  }
  return <Link href={ACADEMY_OFFER.consultHref} className={className} onClick={onClick}>{ACADEMY_OFFER.ctaLabel} <span aria-hidden="true">↗</span></Link>;
}

export function EnrollmentProvider({ children }: { children: ReactNode }) {
  return <div className={styles.page}>{children}</div>;
}
