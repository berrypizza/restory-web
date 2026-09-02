"use client";

import { track } from "@vercel/analytics";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
  ATTRIBUTION_COOKIE_NAME,
  ATTRIBUTION_STORAGE_KEY,
  AttributionData,
  attributionFromSearchParams,
  encodeAttributionCookie,
  hasAttributionParams,
} from "@/lib/attribution";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function saveAttribution(data: AttributionData) {
  const encoded = encodeAttributionCookie(data);

  localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(data));
  document.cookie = `${ATTRIBUTION_COOKIE_NAME}=${encoded}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
}

function readAttribution(): AttributionData {
  const saved = localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
  if (!saved) return {};

  try {
    const parsed = JSON.parse(saved);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function eventData(channel: string, cta: string | null) {
  const saved = readAttribution();
  return {
    channel,
    cta: cta || "unknown",
    landing_path: saved.landing_path || "",
    utm_source: saved.utm_source || saved.source || saved.from || saved.ref || "",
    utm_medium: saved.utm_medium || "",
    utm_campaign: saved.utm_campaign || "",
  };
}

export default function AttributionTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const shouldCapture = hasAttributionParams(params);

    if (!shouldCapture) return;

    const data: AttributionData = {
      ...attributionFromSearchParams(params),
      landing_path: `${pathname || "/"}${params.toString() ? `?${params}` : ""}`,
      referrer: document.referrer ? new URL(document.referrer).hostname : "",
      captured_at: new Date().toISOString(),
    };

    saveAttribution(data);
    track("attribution_visit", eventData("visit", "landing"));
  }, [pathname, searchParams]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest("a");
      const href = link?.getAttribute("href") || "";
      const cta = link?.dataset.cta || link?.textContent?.trim().slice(0, 40) || null;

      if (href.startsWith("/go/kakao") || href.includes("pf.kakao.com")) {
        track("contact_click", eventData("kakao", cta));
      }

      if (href.startsWith("/go/phone") || href.startsWith("tel:")) {
        track("contact_click", eventData("phone", cta));
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}

