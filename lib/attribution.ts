export const KAKAO_CHAT_URL = "http://pf.kakao.com/_hQExjX/chat";
export const PHONE_HREF = "tel:1688-2957";

export const ATTRIBUTION_COOKIE_NAME = "restory_attribution";
export const ATTRIBUTION_STORAGE_KEY = "restory-attribution";

export const ATTRIBUTION_PARAM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "source",
  "from",
  "ref",
] as const;

export type AttributionParamKey = (typeof ATTRIBUTION_PARAM_KEYS)[number];

export type AttributionData = Partial<Record<AttributionParamKey, string>> & {
  landing_path?: string;
  referrer?: string;
  captured_at?: string;
};

export function hasAttributionParams(searchParams: URLSearchParams) {
  return ATTRIBUTION_PARAM_KEYS.some((key) => searchParams.has(key));
}

export function attributionFromSearchParams(
  searchParams: URLSearchParams,
): AttributionData {
  const data: AttributionData = {};

  ATTRIBUTION_PARAM_KEYS.forEach((key) => {
    const value = searchParams.get(key);
    if (value) data[key] = value.slice(0, 120);
  });

  return data;
}

export function encodeAttributionCookie(data: AttributionData) {
  return encodeURIComponent(JSON.stringify(data));
}

export function decodeAttributionCookie(value?: string): AttributionData {
  if (!value) return {};

  try {
    const parsed = JSON.parse(decodeURIComponent(value));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return parsed as AttributionData;
  } catch {
    return {};
  }
}

export function buildTrackedContactPath(channel: "kakao" | "phone", cta?: string) {
  const params = new URLSearchParams();
  if (cta) params.set("cta", cta);

  const query = params.toString();
  return `/go/${channel}${query ? `?${query}` : ""}`;
}

