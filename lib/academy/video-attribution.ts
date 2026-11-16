export const ACADEMY_VIDEOS = {
  intro: { id: "4VhMLfsfHks", title: "집수리·가구수리 창업, 기술만 배우면 일이 들어올까? | 기살 교육" },
  brothers: { id: "TcMbB4Skd90", title: "형제끼리 사업하면 매일 싸울까요?" },
} as const;
export type AcademyVideo = keyof typeof ACADEMY_VIDEOS;
export type VideoState = "not_started" | "started" | "completed";
export type VideoRecord = { version: 1; at: number; intro: VideoState; brothers: VideoState };
export type VideoProperties = { intro_video_state: VideoState; brothers_video_state: VideoState };
export const VIDEO_CONTEXT_TTL = 30 * 60 * 1000;
const states: readonly unknown[] = ["not_started", "started", "completed"];

export function validateVideoRecord(value: unknown, now = Date.now()): VideoRecord | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Partial<VideoRecord>;
  if (record.version !== 1 || !Number.isSafeInteger(record.at) || record.at! > now || now - record.at! > VIDEO_CONTEXT_TTL
    || !states.includes(record.intro) || !states.includes(record.brothers)
    || (record.intro === "not_started" && record.brothers === "not_started")) return null;
  return { version: 1, at: record.at!, intro: record.intro!, brothers: record.brothers! };
}

export function videoProperties(record: VideoRecord | null): VideoProperties {
  return { intro_video_state: record?.intro ?? "not_started", brothers_video_state: record?.brothers ?? "not_started" };
}

/** A short-lived, allowlisted snapshot survives reload and opening the CTA in a new tab. */
export function withVideoAttribution(href: string, record: VideoRecord | null): string {
  const valid = validateVideoRecord(record);
  if (!valid) return href;
  const [path, query] = href.split("?");
  const params = new URLSearchParams(query);
  params.set("video_at", String(valid.at));
  for (const [key, value] of Object.entries(videoProperties(valid))) params.set(key, value);
  return `${path}?${params}`;
}

export function readVideoAttribution(params: Pick<URLSearchParams, "getAll">, now = Date.now()): VideoRecord | null {
  const at = params.getAll("video_at"), intro = params.getAll("intro_video_state"), brothers = params.getAll("brothers_video_state");
  if (at.length !== 1 || intro.length !== 1 || brothers.length !== 1 || !/^\d{13}$/.test(at[0])) return null;
  return validateVideoRecord({ version: 1, at: Number(at[0]), intro: intro[0], brothers: brothers[0] }, now);
}
