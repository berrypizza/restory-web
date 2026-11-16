"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { readAcademyAttribution } from "@/lib/academy/attribution";
import { readVideoAttribution } from "@/lib/academy/video-attribution";
import ConsultationForm from "./ConsultationForm";

export default function ConsultationEntry() {
  const params = useSearchParams();
  const attribution = readAcademyAttribution(params);
  const videoQuery = new URLSearchParams(["video_at", "intro_video_state", "brothers_video_state"].flatMap(key => params.getAll(key).map(value => [key, value]))).toString();
  const video = useMemo(() => readVideoAttribution(new URLSearchParams(videoQuery)), [videoQuery]);
  // A new entry source starts a fresh form; unrelated query parameters do not reset it.
  return <ConsultationForm key={`${attribution.source_plan}:${attribution.source_cta}:${video ? `${video.at}:${video.intro}:${video.brothers}` : ""}`} attribution={attribution} videoContext={video} />;
}
