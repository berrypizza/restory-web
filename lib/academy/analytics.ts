"use client";

import { track } from "@vercel/analytics";
import { sendGAEvent } from "@next/third-parties/google";
import type { AcademyAttribution, AcademyCtaLocation } from "./attribution";

export type { AcademyCtaLocation } from "./attribution";
type AcademyEvent = "academy_landing_view" | "academy_hero_cta_click" | "academy_cta_click" | "academy_field_section_view" | "academy_proof_click" | "academy_business_proof_click" | "academy_plan_cta_click" | "academy_consult_start" | "academy_consult_step_view" | "academy_consult_submit_attempt" | "academy_consult_submit_error" | "academy_consult_submit_success";
type AcademyProperties = Partial<AcademyAttribution> & { location?: AcademyCtaLocation; plan?: "basic" | "premium"; consultation_type?: "online" | "offline"; step?: number; case_id?: string; business_step?: "record" | "browse" | "inquiry"; reason?: "rate_limit" | "invalid_input" | "server" | "network" };

/** Only controlled, non-PII properties. Analytics failures must never block a lead. */
export function trackAcademy(event: AcademyEvent, properties: AcademyProperties = {}) {
  try { sendGAEvent("event", event, properties); } catch { /* Best effort. */ }
  try { track(event, properties); } catch { /* Best effort. */ }
}
