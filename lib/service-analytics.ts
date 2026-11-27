/** Controlled service vocabulary. Never derive analytics labels from customer text. */
export const SERVICE_IDS = [
  "kitchen", "repair", "leather", "sofa", "sink-door", "sangbujang", "habujang",
  "sink-top-crack", "sofa-sag", "fridge-cabinet", "rocheong", "restaurant-chair",
  "restaurant-sofa", "meeting-table", "dining-chair", "office-chair", "custom",
  "door-fall", "hinge", "drawer-rail", "sofa-frame", "bed-frame", "table-leg", "sliding-door",
] as const;
export type ServiceId = typeof SERVICE_IDS[number];
export const SECTION_IDS = [
  "hero", "service_overview", "regional_intro", "cases", "budget", "scope", "timeline",
  "colors", "materials", "photo_guide", "process", "warranty", "faq", "reviews",
  "video", "contact", "services", "problems",
] as const;
export type SectionId = typeof SECTION_IDS[number];
// request = 자체 사진 접수 양식(/request)으로 가는 클릭
export type ContactChannel = "kakao" | "phone" | "request";
export type CtaLocation = "fixed" | "body" | "header" | "footer";
export type ServiceEvent = "service_landing_view" | "service_section_view" | "service_section_progress" | "service_contact_click";
export type ServiceProperties = Record<string, string | number>;
export const SERVICE_MEASUREMENT_VERSION = "service_v1";
export const SECTION_DWELL_MS = 1000;
export const SECTION_VISIBLE_RATIO = 0.5;
export const QA_STORAGE_KEY = "restory_analytics_qa";

export function serviceId(value: string | null | undefined): ServiceId | null {
  return SERVICE_IDS.includes(value as ServiceId) ? value as ServiceId : null;
}
export function sectionId(value: string | null | undefined): SectionId | null {
  return SECTION_IDS.includes(value as SectionId) ? value as SectionId : null;
}
export function serviceForSlug(slug: string): ServiceId | undefined {
  if (slug === "sofa-sagging") return "sofa-sag";
  return serviceId(slug) ?? undefined;
}
export function cleanPagePath(value: string): string {
  // Only pathname, never query strings, fragments, link labels or form values.
  let path = value.split(/[?#]/, 1)[0];
  try { path = decodeURI(path); } catch { /* Keep malformed encoding as-is. */ }
  // page_location supports 1000 characters; leave room for the site origin.
  return path.slice(0, 900) || "/";
}
export function trafficClass(hostname: string, qa: boolean): "production" | "qa" | "local" | "preview" {
  if (qa) return "qa";
  if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(hostname)) return "local";
  return /^(www\.)?restorystudio\.co\.kr$/.test(hostname) ? "production" : "preview";
}
export function contactChannel(href: string, origin: string): ContactChannel | null {
  try {
    const url = new URL(href, origin);
    if (url.protocol === "tel:") return "phone";
    if (!/^https?:$/.test(url.protocol)) return null;
    if (url.origin === origin && /^\/request\/?$/.test(url.pathname)) return "request";
    if (url.origin === origin && /^\/go\/(kakao|phone)\/?$/.test(url.pathname)) {
      return url.pathname.includes("kakao") ? "kakao" : "phone";
    }
    if (url.hostname === "pf.kakao.com") return "kakao";
  } catch { /* Invalid/unrelated links are not consultation clicks. */ }
  return null;
}

export type Section = { id: SectionId; order: number };
export type VisitState = {
  path: string;
  landingSent: boolean;
  seen: Map<SectionId, Section>;
  progressed: Set<SectionId>;
  lastSection: Section | null;
  clicks: Map<string, number>;
};
export function createVisit(path: string): VisitState {
  return { path, landingSent: false, seen: new Map(), progressed: new Set(), lastSection: null, clicks: new Map() };
}
export type EmitService = (event: ServiceEvent, properties: ServiceProperties) => void;

/** One qualified view per section per navigation; a later view is not proof of reading. */
export function recordSection(visit: VisitState, section: Section, emit: EmitService) {
  if (visit.seen.has(section.id)) return;
  visit.seen.set(section.id, section);
  visit.lastSection = section;
  emit("service_section_view", { section_id: section.id, section_order: section.order, visible_ratio: SECTION_VISIBLE_RATIO, dwell_ms: SECTION_DWELL_MS });
  for (const previous of visit.seen.values()) {
    if (previous.order >= section.order || visit.progressed.has(previous.id)) continue;
    visit.progressed.add(previous.id);
    emit("service_section_progress", { section_id: previous.id, section_order: previous.order, progress_type: "later_section", next_section_id: section.id, next_section_order: section.order });
  }
}

export function recordContact(visit: VisitState, channel: ContactChannel, location: CtaLocation, section: Section | null, now: number, emit: EmitService) {
  const key = `${channel}:${location}:${section?.id ?? "none"}`;
  const last = visit.clicks.get(key);
  if (last !== undefined && now - last < 1000) return;
  visit.clicks.set(key, now);
  emit("service_contact_click", {
    channel, cta_location: location, section_id: section?.id ?? "none", section_order: section?.order ?? 0,
    last_section_id: visit.lastSection?.id ?? "none", last_section_order: visit.lastSection?.order ?? 0,
  });
  for (const previous of visit.seen.values()) {
    if (visit.progressed.has(previous.id)) continue;
    visit.progressed.add(previous.id);
    emit("service_section_progress", { section_id: previous.id, section_order: previous.order, progress_type: "contact_click", next_section_id: "contact_click", channel });
  }
}
