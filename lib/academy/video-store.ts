"use client";

import { useSyncExternalStore } from "react";
import { validateVideoRecord, VIDEO_CONTEXT_TTL, type AcademyVideo, type VideoRecord } from "./video-attribution";

const key = "gisal.video.v1";
const listeners = new Set<() => void>();
let memory: VideoRecord | null = null;
let expiry: ReturnType<typeof setTimeout> | undefined;

export function getVideoRecord(): VideoRecord | null {
  if (typeof window === "undefined") return null;
  const fallback = validateVideoRecord(memory);
  try {
    const stored = window.sessionStorage.getItem(key);
    const record = stored ? validateVideoRecord(JSON.parse(stored)) : null;
    return fallback && (!record || fallback.at >= record.at) ? fallback : record;
  } catch { /* Blocked storage must not interrupt playback or consultation. */ }
  return fallback;
}

export function recordVideoState(video: AcademyVideo, state: "started" | "completed"): VideoRecord {
  const previous = getVideoRecord();
  const record: VideoRecord = { version: 1, at: Date.now(), intro: previous?.intro ?? "not_started", brothers: previous?.brothers ?? "not_started" };
  // Replays never downgrade an already completed video.
  record[video] = record[video] === "completed" ? "completed" : state;
  memory = record;
  try { window.sessionStorage.setItem(key, JSON.stringify(record)); } catch { /* In-memory fallback. */ }
  clearTimeout(expiry);
  expiry = setTimeout(() => listeners.forEach(listener => listener()), VIDEO_CONTEXT_TTL + 1);
  listeners.forEach(listener => listener());
  return record;
}

function subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
function snapshot() { const record = getVideoRecord(); return record ? JSON.stringify(record) : ""; }
const serverSnapshot = () => "";

export function useAcademyVideoRecord(): VideoRecord | null {
  const value = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return value ? validateVideoRecord(JSON.parse(value)) : null;
}
