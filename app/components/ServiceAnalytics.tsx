"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { sendGAEvent } from "@next/third-parties/google";
import {
  cleanPagePath, contactChannel, createVisit, QA_STORAGE_KEY, recordContact, recordSection,
  SECTION_DWELL_MS, SECTION_VISIBLE_RATIO, sectionId, serviceId, SERVICE_MEASUREMENT_VERSION, trafficClass,
  type CtaLocation, type EmitService, type Section, type VisitState,
} from "@/lib/service-analytics";

/** No UI, navigation interception, redirect tracking, or customer-entered properties. */
export default function ServiceAnalytics() {
  const pathname = usePathname();
  const state = useRef<VisitState | null>(null);

  useEffect(() => {
    // Leaving for an excluded/non-service route ends the visit too.
    if (state.current?.path !== cleanPagePath(pathname ?? "/")) state.current = null;
    if (!pathname || /\/(academy|admin|go)(\/|$)/.test(pathname)) return;
    const root = document.querySelector<HTMLElement>("main[data-service-id]");
    const service = serviceId(root?.dataset.serviceId);
    if (!root || !service) return;
    const path = cleanPagePath(pathname);
    if (state.current?.path !== path) state.current = createVisit(path);
    const visit = state.current;
    let qa = new URLSearchParams(window.location.search).get("analytics_qa") === "1";
    try {
      if (qa) sessionStorage.setItem(QA_STORAGE_KEY, "1");
      qa ||= sessionStorage.getItem(QA_STORAGE_KEY) === "1";
    } catch { /* A storage restriction must not affect navigation or tracking. */ }
    const traffic = trafficClass(window.location.hostname, qa);
    // QA, localhost, and preview never enter the production measurement stream.
    if (traffic !== "production") return;
    let referrer = "";
    try { referrer = document.referrer ? new URL(document.referrer).origin : ""; } catch { /* No raw referrer. */ }
    const emit: EmitService = (event, properties) => {
      try {
        // The afterInteractive GA script may still be loading at the first effect.
        (window as Window & { dataLayer?: unknown[] }).dataLayer ??= [];
        sendGAEvent("event", event, {
          ...properties, service_id: service, page_path: path.slice(0, 100),
          page_location: `${window.location.origin}${path}`, page_referrer: referrer,
          traffic_class: traffic, measurement_version: SERVICE_MEASUREMENT_VERSION,
        });
      } catch { /* Best effort: never block a consultation. */ }
    };
    if (!visit.landingSent) {
      visit.landingSent = true;
      emit("service_landing_view", {});
    }

    const sections = new Map<Element, Section>();
    const timers = new Map<Element, ReturnType<typeof setTimeout>>();
    const visible = new Set<Element>();
    const cancel = (target: Element) => {
      const timer = timers.get(target);
      if (timer !== undefined) clearTimeout(timer);
      timers.delete(target);
    };
    const enoughVisible = (target: Element) => {
      const r = target.getBoundingClientRect();
      if (!r.width || !r.height || !target.isConnected || document.visibilityState !== "visible") return false;
      const width = Math.max(0, Math.min(r.right, window.innerWidth) - Math.max(r.left, 0));
      const height = Math.max(0, Math.min(r.bottom, window.innerHeight - 88) - Math.max(r.top, 88));
      return (width * height) / (r.width * r.height) >= SECTION_VISIBLE_RATIO;
    };
    const start = (target: Element) => {
      const section = sections.get(target);
      if (!section || visit.seen.has(section.id) || timers.has(target) || !enoughVisible(target)) return;
      timers.set(target, setTimeout(() => {
        timers.delete(target);
        if (visible.has(target) && enoughVisible(target)) recordSection(visit, section, emit);
      }, SECTION_DWELL_MS));
    };
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio >= SECTION_VISIBLE_RATIO) {
          visible.add(entry.target); start(entry.target);
        } else { visible.delete(entry.target); cancel(entry.target); }
      }
    }, { threshold: [0, SECTION_VISIBLE_RATIO, 1], rootMargin: "-88px 0px -88px 0px" });
    const sync = () => {
      const current = new Set<Element>();
      root.querySelectorAll<HTMLElement>("[data-service-section]").forEach((element, index) => {
        const id = sectionId(element.dataset.serviceSection);
        if (!id) return;
        // Observe the heading, not a tall whole section that cannot reach 50% on mobile.
        const anchor = element.querySelector("h1,h2,h3") ?? element.firstElementChild;
        if (!anchor) return;
        current.add(anchor);
        if (!sections.has(anchor)) observer?.observe(anchor);
        sections.set(anchor, { id, order: index + 1 });
      });
      for (const target of sections.keys()) {
        if (current.has(target)) continue;
        observer?.unobserve(target); cancel(target); visible.delete(target); sections.delete(target);
      }
    };
    sync();
    const mutations = new MutationObserver(sync);
    mutations.observe(root, { childList: true, subtree: true });
    const onVisibility = () => {
      if (document.visibilityState !== "visible") timers.forEach((_, target) => cancel(target));
      else visible.forEach(start);
    };
    const onClick = (event: MouseEvent) => {
      if ((event.type === "click" && event.button !== 0) || (event.type === "auxclick" && event.button !== 1)) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link) return;
      const channel = contactChannel(link.getAttribute("href") ?? "", window.location.origin);
      if (!channel) return;
      const location: CtaLocation = link.closest('[data-service-cta-location="fixed"]') ? "fixed"
        : link.closest("header,nav") ? "header" : link.closest("footer") ? "footer" : "body";
      const element = link.closest<HTMLElement>("[data-service-section]");
      const id = sectionId(element?.dataset.serviceSection);
      const section = id ? [...sections.values()].find(value => value.id === id) ?? null : null;
      recordContact(visit, channel, location, section, performance.now(), emit);
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("auxclick", onClick, true);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      mutations.disconnect(); observer?.disconnect(); timers.forEach((_, target) => cancel(target));
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("auxclick", onClick, true);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [pathname]);

  return null;
}
