import type { Tech } from "./constants";
import { getExtraTechsFromMemo, setExtraTechsInMemo } from "./jobTechs";
import type { Job } from "./types";

export type FollowUpKind = "install" | "aftercare";
export type FollowUpDraft = { id: string; date: string; time: string; tech: Tech; memo: string };

export function aftercareVisit(source: Job, draft: FollowUpDraft) {
  const crew = getExtraTechsFromMemo(source.memo).filter(tech => tech !== draft.tech);
  return {
    id: draft.id,
    aftercare_source_id: source.aftercare_source_id || source.id,
    is_aftercare: true,
    name: source.name,
    phone: source.phone,
    region: source.region,
    symptom: source.symptom,
    tech: draft.tech,
    memo: setExtraTechsInMemo(draft.memo.trim(), crew),
    visit_date: draft.date,
    visit_time: draft.time || null,
    status: draft.tech ? "배정" as const : "대기" as const,
    price: 0,
  };
}
