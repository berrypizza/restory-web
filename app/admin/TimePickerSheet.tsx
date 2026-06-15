"use client";

import { useState } from "react";

const QUICK = [
  { label: "오전 9시", ampm: "AM", h: 9, m: 0 },
  { label: "오전 10시", ampm: "AM", h: 10, m: 0 },
  { label: "오전 11시", ampm: "AM", h: 11, m: 0 },
  { label: "오후 1시", ampm: "PM", h: 1, m: 0 },
  { label: "오후 2시", ampm: "PM", h: 2, m: 0 },
  { label: "오후 3시", ampm: "PM", h: 3, m: 0 },
];

const AM_HOURS = [6, 7, 8, 9, 10, 11, 12];
const PM_HOURS = [1, 2, 3, 4, 5, 6, 7, 8];

interface TimePickerSheetProps {
  value?: string; // "HH:MM" 24시간 포맷
  onConfirm: (value: string) => void; // "HH:MM" 반환
  onClose: () => void;
}

function to24(ampm: "AM" | "PM", h: number): number {
  if (ampm === "AM") return h === 12 ? 0 : h;
  return h === 12 ? 12 : h + 12;
}

function toDisplay(ampm: "AM" | "PM", h: number, m: number): string {
  const minStr = m === 0 ? "" : " 30분";
  return `${ampm === "AM" ? "오전" : "오후"} ${h}시${minStr}`;
}

export default function TimePickerSheet({
  value,
  onConfirm,
  onClose,
}: TimePickerSheetProps) {
  // value가 있으면 초기값 파싱
  const parseInitial = () => {
    if (!value) return { ampm: null, hour: null, min: null };
    const [hStr, mStr] = value.split(":");
    const h24 = parseInt(hStr);
    const m = parseInt(mStr);
    const ampm: "AM" | "PM" = h24 < 12 ? "AM" : "PM";
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;
    return { ampm, hour: h12, min: m };
  };

  const init = parseInitial();
  const [ampm, setAmpmState] = useState<"AM" | "PM" | null>(
    init.ampm as "AM" | "PM" | null,
  );
  const [hour, setHourState] = useState<number | null>(init.hour);
  const [min, setMinState] = useState<number | null>(init.min);

  const hours = ampm === "AM" ? AM_HOURS : ampm === "PM" ? PM_HOURS : [];
  const ready = ampm !== null && hour !== null && min !== null;

  const applyQuick = (q: (typeof QUICK)[0]) => {
    setAmpmState(q.ampm as "AM" | "PM");
    setHourState(q.h);
    setMinState(q.m);
  };

  const handleAmPm = (v: "AM" | "PM") => {
    setAmpmState(v);
    setHourState(null);
    setMinState(null);
  };

  const handleConfirm = () => {
    if (!ready || ampm === null || hour === null || min === null) return;
    const h24 = to24(ampm, hour);
    const hh = String(h24).padStart(2, "0");
    const mm = String(min).padStart(2, "0");
    onConfirm(`${hh}:${mm}`);
    onClose();
  };

  const isQuickActive = (q: (typeof QUICK)[0]) =>
    ampm === q.ampm && hour === q.h && min === q.m;

  return (
    /* 오버레이 */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: "rgba(15,23,42,0.45)" }}
      onClick={onClose}>
      {/* 시트 */}
      <div
        className="w-full max-w-md rounded-t-[20px] overflow-hidden"
        style={{
          backgroundColor: "#ffffff",
          paddingBottom: "env(safe-area-inset-bottom, 16px)",
        }}
        onClick={(e) => e.stopPropagation()}>
        {/* 핸들 */}
        <div className="flex justify-center pt-2.5 pb-1.5">
          <div
            className="rounded-full"
            style={{ width: 36, height: 4, backgroundColor: "#e5e7eb" }}
          />
        </div>

        {/* 헤더 */}
        <div
          className="flex items-center justify-between px-5 pb-3"
          style={{ borderBottom: "0.5px solid #f3f4f6" }}>
          <span className="text-base font-medium" style={{ color: "#111827" }}>
            도착 시간
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-sm"
            style={{ backgroundColor: "#f3f4f6", color: "#6b7280" }}>
            ✕
          </button>
        </div>

        {/* 오전 / 오후 */}
        <div className="grid grid-cols-2 gap-2 px-4 pt-4 pb-3">
          {(["AM", "PM"] as const).map((v) => (
            <button
              key={v}
              onClick={() => handleAmPm(v)}
              className="h-11 rounded-xl text-base font-medium transition-all"
              style={{
                backgroundColor: ampm === v ? "#1f66ff" : "#f3f4f6",
                color: ampm === v ? "#ffffff" : "#6b7280",
                border: "none",
              }}>
              {v === "AM" ? "오전" : "오후"}
            </button>
          ))}
        </div>

        {/* 자주 쓰는 시간 */}
        <p
          className="text-[11px] font-medium px-4 pb-1.5"
          style={{ color: "#94a3b8", letterSpacing: "0.04em" }}>
          자주 쓰는 시간
        </p>
        <div
          className="flex gap-1.5 px-4 pb-3 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}>
          {QUICK.map((q) => (
            <button
              key={q.label}
              onClick={() => applyQuick(q)}
              className="flex-shrink-0 h-8 px-3.5 rounded-full text-xs font-medium transition-all whitespace-nowrap"
              style={{
                backgroundColor: isQuickActive(q) ? "#1f66ff" : "#eaf1ff",
                color: isQuickActive(q) ? "#ffffff" : "#1f66ff",
                border: isQuickActive(q) ? "none" : "1.5px solid #1f66ff22",
              }}>
              {q.label}
            </button>
          ))}
        </div>

        {/* 구분선 */}
        <div
          style={{
            height: "0.5px",
            backgroundColor: "#f3f4f6",
            margin: "0 0 10px",
          }}
        />

        {/* 시간 그리드 */}
        <div className="grid grid-cols-4 gap-1.5 px-4 pb-3">
          {hours.map((h) => (
            <button
              key={h}
              onClick={() => setHourState(h)}
              className="h-11 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: hour === h ? "#1f66ff" : "#f8fafc",
                color: hour === h ? "#ffffff" : "#111827",
                border: hour === h ? "none" : "1.5px solid #e5e7eb",
              }}>
              {h}시
            </button>
          ))}
        </div>

        {/* 분 선택 */}
        <div className="grid grid-cols-2 gap-1.5 px-4 pb-3">
          {[
            { label: "정각", value: 0 },
            { label: "30분", value: 30 },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setMinState(item.value)}
              className="h-10 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: min === item.value ? "#eaf1ff" : "#f8fafc",
                color: min === item.value ? "#1f66ff" : "#6b7280",
                border:
                  min === item.value
                    ? "1.5px solid #1f66ff44"
                    : "1.5px solid #e5e7eb",
              }}>
              {item.label}
            </button>
          ))}
        </div>

        {/* 결과 + 확인 */}
        <div
          className="px-4 pb-4"
          style={{ borderTop: "0.5px solid #f3f4f6", paddingTop: 12 }}>
          <p
            className="text-center pb-2.5 text-2xl font-medium"
            style={{ color: ready ? "#1f66ff" : "#d1d5db" }}>
            {ready && ampm && hour !== null && min !== null
              ? toDisplay(ampm, hour, min)
              : "시간을 선택하세요"}
          </p>
          <button
            onClick={handleConfirm}
            disabled={!ready}
            className="w-full h-12 rounded-xl text-base font-medium text-white transition-opacity"
            style={{
              backgroundColor: "#1f66ff",
              opacity: ready ? 1 : 0.35,
            }}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
