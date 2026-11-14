"use client";

import { useSearchParams } from "next/navigation";
import { readAcademyAttribution } from "@/lib/academy/attribution";
import ConsultationForm from "./ConsultationForm";

export default function ConsultationEntry() {
  const attribution = readAcademyAttribution(useSearchParams());
  // A new entry source starts a fresh form; unrelated query parameters do not reset it.
  return <ConsultationForm key={`${attribution.source_plan}:${attribution.source_cta}`} attribution={attribution} />;
}
