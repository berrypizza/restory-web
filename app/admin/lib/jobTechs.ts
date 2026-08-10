import type { Job } from "./types";
import type { Tech } from "./constants";

const EXTRA_TECHS_RE = /\n?<!--RESTORY_EXTRA_TECHS:(.*?)-->\n?/;

export function getExtraTechsFromMemo(memo?: string | null): Tech[] {
  const match = (memo || "").match(EXTRA_TECHS_RE);
  if (!match?.[1]) return [];
  try {
    const parsed = JSON.parse(decodeURIComponent(match[1]));
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function getVisibleMemo(memo?: string | null) {
  return (memo || "").replace(EXTRA_TECHS_RE, "");
}

export function setExtraTechsInMemo(memo: string | null | undefined, techs: Tech[]) {
  const visibleMemo = getVisibleMemo(memo);
  const uniqueTechs = Array.from(new Set(techs.filter(Boolean)));
  if (uniqueTechs.length === 0) return visibleMemo;
  const marker = `<!--RESTORY_EXTRA_TECHS:${encodeURIComponent(JSON.stringify(uniqueTechs))}-->`;
  return visibleMemo.trim() ? `${visibleMemo}\n\n${marker}` : marker;
}

export function getJobTechs(job: Pick<Job, "tech" | "memo">) {
  const primary = job.tech ? [job.tech] : [];
  return Array.from(new Set([...primary, ...getExtraTechsFromMemo(job.memo)]));
}

export function jobHasTech(job: Pick<Job, "tech" | "memo">, tech: Tech | "전체" | "?꾩껜") {
  return tech === "전체" || tech === "?꾩껜" || getJobTechs(job).includes(tech as Tech);
}
