"use client";

import { useState } from "react";
import Image from "next/image";
import PhotoCapture from "./PhotoCapture";
import MaterialSection from "./MaterialSection";
import type { Job } from "../lib/types";
import type { Status, Tech } from "../lib/constants";
import { TECHS, STATUSES, TECH_COLOR, STATUS_STYLE } from "../lib/constants";
import {
  nowKST,
  formatFullDate,
  formatDate,
  formatTime,
  formatPrice,
  naverMapUrl,
  addOneYear,
} from "../lib/utils";
import {
  getExtraTechsFromMemo,
  getJobTechs,
  getVisibleMemo,
  setExtraTechsInMemo,
} from "../lib/jobTechs";

interface JobCardProps {
  job: Job;
  onUpdate: (id: string, patch: Partial<Job>) => void;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  isAdmin?: boolean;
}

const TECH_GRADIENT: Record<string, string> = {
  고관호: "linear-gradient(135deg, #e32e40 0%, #ff6b6b 100%)",
  고현호: "linear-gradient(135deg, #1f66ff 0%, #60a5fa 100%)",
  이주형: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
  강영훈: "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
  "": "linear-gradient(135deg, #64748b 0%, #94a3b8 100%)",
};

const TECH_BG: Record<string, string> = {
  고관호: "linear-gradient(160deg, #fff5f5 0%, #ffffff 60%)",
  고현호: "linear-gradient(160deg, #eff6ff 0%, #ffffff 60%)",
  이주형: "linear-gradient(160deg, #fffbeb 0%, #ffffff 60%)",
  강영훈: "linear-gradient(160deg, #fdf2f8 0%, #ffffff 60%)",
  "": "linear-gradient(160deg, #f8fafc 0%, #ffffff 60%)",
};

export default function JobCard({
  job,
  onUpdate,
  onEdit,
  onDelete,
  isAdmin = true,
}: JobCardProps) {
  const techColor = TECH_COLOR[job.tech || ""];
  const techGradient = TECH_GRADIENT[job.tech || ""];
  const techBg = TECH_BG[job.tech || ""];
  const [showPhoto, setShowPhoto] = useState(false);
  const [prevStatus, setPrevStatus] = useState<Status>(job.status);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxList, setLightboxList] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [completionOpen, setCompletionOpen] = useState(false);

  const getPhotos = (): string[] => {
    if (!job.completion_photo) return [];
    try {
      return JSON.parse(job.completion_photo);
    } catch {
      return [job.completion_photo];
    }
  };
  const getIntakePhotos = (): string[] => {
    if (!job.intake_photos) return [];
    try {
      return JSON.parse(job.intake_photos);
    } catch {
      return [job.intake_photos];
    }
  };

  const handleComplete = () => {
    setPrevStatus(job.status);
    onUpdate(job.id, {
      status: "완료",
      as_until: addOneYear(nowKST().toISOString().slice(0, 10)),
    });
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
      setShowPhoto(true);
    }, 2200);
  };

  const handleToggleMeasurement = () => {
    if (job.status === "완료")
      onUpdate(job.id, { status: "대기", install_completed: false });
    else
      onUpdate(job.id, {
        status: "완료",
        as_until: addOneYear(nowKST().toISOString().slice(0, 10)),
      });
  };

  const handlePhotoDone = (urls: string[]) => {
    if (urls.length === 0 && prevStatus !== "완료")
      onUpdate(job.id, { status: prevStatus, completion_photo: "" });
    else
      onUpdate(job.id, {
        completion_photo: urls.length > 0 ? JSON.stringify(urls) : "",
      });
    setShowPhoto(false);
  };

  const photos = getPhotos();
  const intakePhotos = getIntakePhotos();
  const jobTechs = getJobTechs(job);
  const extraTechs = getExtraTechsFromMemo(job.memo);
  const visibleMemo = getVisibleMemo(job.memo);
  const teamColors = jobTechs
    .map((tech) => TECH_COLOR[tech])
    .filter(Boolean);
  const teamGradient =
    teamColors.length > 1
      ? `linear-gradient(135deg, ${teamColors
          .map((color, idx) => {
            const start = Math.round((idx / teamColors.length) * 100);
            const end = Math.round(((idx + 1) / teamColors.length) * 100);
            return `${color} ${start}%, ${color} ${end}%`;
          })
          .join(", ")})`
      : techGradient;

  const asInfo = (() => {
    if (job.status !== "완료" || !job.as_until) return null;
    const t = nowKST().toISOString().slice(0, 10);
    const expired = job.as_until < t;
    const daysLeft = Math.ceil(
      (new Date(job.as_until).getTime() - new Date(t).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return { expired, daysLeft };
  })();

  return (
    <>
      {/* 완료 축하 */}
      {showCelebration && (
        <div
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center pointer-events-none"
          style={{ backgroundColor: "rgba(15,23,42,0.72)" }}>
          <style>{`
            @keyframes confetti-fall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
            @keyframes pop-in{0%{transform:scale(0.3);opacity:0}60%{transform:scale(1.15);opacity:1}100%{transform:scale(1);opacity:1}}
            @keyframes fade-up{0%{transform:translateY(16px);opacity:0}100%{transform:translateY(0);opacity:1}}
            .cp{position:fixed;animation:confetti-fall linear forwards}
          `}</style>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="cp rounded-sm"
              style={{
                left: `${5 + ((i * 4.5) % 95)}%`,
                top: `-10px`,
                backgroundColor: [
                  "#1f66ff",
                  "#60a5fa",
                  "#f59e0b",
                  "#f472b6",
                  "#a78bfa",
                  "#93c5fd",
                ][i % 6],
                width: i % 3 === 0 ? 8 : 12,
                height: i % 3 === 0 ? 12 : 8,
                animationDuration: `${1.2 + (i % 5) * 0.2}s`,
                animationDelay: `${(i % 4) * 0.08}s`,
              }}
            />
          ))}
          <div style={{ animation: "pop-in 0.4s ease-out forwards" }}>
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center mb-6"
              style={{
                backgroundColor: "#1f66ff",
                boxShadow: "0 0 60px #00ffa288",
              }}>
              <span style={{ fontSize: 56, color: "#ffffff" }}>✓</span>
            </div>
          </div>
          <div style={{ animation: "fade-up 0.4s ease-out 0.3s both" }}>
            <p className="text-3xl font-black text-white mb-2">
              🎉 수고했어요! 🎉
            </p>
            <p
              className="text-xl font-semibold text-center mb-1"
              style={{ color: "#ffffff" }}>
              {job.name}님 완료
            </p>
            <p className="text-sm text-center" style={{ color: "#ffffff" }}>
              당신이 있어서 리스토리입니다
            </p>
          </div>
        </div>
      )}

      {/* 라이트박스 */}
      {lightboxUrl &&
        (() => {
          const idx = lightboxList.indexOf(lightboxUrl);
          return (
            <div
              className="fixed inset-0 z-[70] flex flex-col select-none"
              style={{ backgroundColor: "rgba(15,23,42,0.92)" }}
              onClick={() => setLightboxUrl(null)}
              onTouchStart={(e) => {
                (e.currentTarget as any)._tx = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                const diff =
                  ((e.currentTarget as any)._tx ?? 0) -
                  e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) {
                  if (diff > 0 && idx < lightboxList.length - 1)
                    setLightboxUrl(lightboxList[idx + 1]);
                  else if (diff < 0 && idx > 0)
                    setLightboxUrl(lightboxList[idx - 1]);
                }
              }}>
              <div
                className="flex items-center justify-between px-4 py-3"
                onClick={(e) => e.stopPropagation()}>
                <span
                  className="text-sm font-bold px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    color: "#94a3b8",
                  }}>
                  {idx + 1}/{lightboxList.length}
                </span>
                <button
                  onClick={() => setLightboxUrl(null)}
                  className="w-9 h-9 flex items-center justify-center rounded-full"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.12)",
                    color: "white",
                  }}>
                  ✕
                </button>
              </div>
              <div
                className="flex-1 flex items-center justify-center px-10 relative"
                onClick={(e) => e.stopPropagation()}>
                {idx > 0 && (
                  <button
                    onClick={() => setLightboxUrl(lightboxList[idx - 1])}
                    className="absolute left-2 w-10 h-10 flex items-center justify-center rounded-full text-xl font-bold"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.12)",
                      color: "white",
                    }}>
                    ‹
                  </button>
                )}
                <img
                  src={lightboxUrl}
                  alt=""
                  className="rounded-2xl"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "76vh",
                    objectFit: "contain",
                  }}
                />
                {idx < lightboxList.length - 1 && (
                  <button
                    onClick={() => setLightboxUrl(lightboxList[idx + 1])}
                    className="absolute right-2 w-10 h-10 flex items-center justify-center rounded-full text-xl font-bold"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.12)",
                      color: "white",
                    }}>
                    ›
                  </button>
                )}
              </div>
              {lightboxList.length > 1 && (
                <div
                  className="flex justify-center gap-1.5 py-4"
                  onClick={(e) => e.stopPropagation()}>
                  {lightboxList.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxUrl(lightboxList[i])}
                      className="rounded-full transition-all"
                      style={{
                        width: i === idx ? 20 : 6,
                        height: 6,
                        backgroundColor: i === idx ? "#1f66ff" : "#94a3b8",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })()}

      {/* 사진 모달 */}
      {showPhoto && (
        <PhotoCapture
          jobId={job.id}
          photos={photos}
          onDone={handlePhotoDone}
          onCancel={() => {
            if (prevStatus !== "완료")
              onUpdate(job.id, { status: prevStatus, completion_photo: "" });
            setShowPhoto(false);
          }}
          revertStatus={prevStatus !== "완료" ? prevStatus : undefined}
        />
      )}

      {/* ══ 카드 ══ */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: techBg,
          border: `1.5px solid ${techColor}33`,
          boxShadow: `0 2px 14px ${techColor}1c`,
        }}>
        {/* 실측 배너 */}
        {job.is_measurement && (
          <div
            className="flex items-center gap-2 px-4 py-2"
            style={{ background: "linear-gradient(90deg,#7c3aed,#a855f7)" }}>
            <span className="text-sm">📐</span>
            <span className="text-xs font-black text-white">실측 방문</span>
            <span
              className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
              }}>
              {job.install_completed
                ? "시공완료"
                : job.install_date
                  ? `시공 ${formatDate(job.install_date)}`
                  : "시공일 미정"}
            </span>
          </div>
        )}

        {/* 컬러 헤더 바 */}
        <div
          className="flex flex-col gap-2 px-4 py-2.5"
          style={{ background: teamGradient }}>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={job.status}
              onChange={(e) => {
                e.stopPropagation();
                onUpdate(job.id, { status: e.target.value as Status });
              }}
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-bold rounded-full px-2.5 py-1 cursor-pointer"
              style={{
                backgroundColor: "rgba(255,255,255,0.25)",
                color: "white",
                border: "1.5px solid rgba(255,255,255,0.4)",
                outline: "none",
              }}>
              {STATUSES.map((s) => (
                <option
                  key={s}
                  value={s}
                  style={{ color: "#111827", backgroundColor: "white" }}>
                  {s}
                </option>
              ))}
            </select>
            <span className="text-xs font-medium text-white opacity-90">
              {formatFullDate(job.visit_date)}
            </span>
            {job.visit_time && (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: "rgba(255,255,255,0.25)",
                  color: "white",
                }}>
                {formatTime(job.visit_time)}
              </span>
            )}
          </div>
          <div
            className="flex items-center justify-between gap-2 rounded-xl px-2 py-2"
            style={{
              backgroundColor: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.28)",
            }}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              {jobTechs.length > 0 ? (
                jobTechs.map((tech, idx) => {
                  const idxInTechs = TECHS.indexOf(tech) + 1;
                  if (idxInTechs <= 0) return null;
                  const role = idx === 0 ? "\uC8FC\uB2F4\uB2F9" : "\uB3D9\uD589";
                  return (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 rounded-full pl-1 pr-2 py-1"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.92)",
                        border: `1.5px solid ${TECH_COLOR[tech]}`,
                        boxShadow: "0 4px 10px rgba(15,23,42,0.14)",
                      }}>
                      <Image
                        src={`/images/knight/knights-${idxInTechs}.png`}
                        alt={tech}
                        title={`${role} ${tech}`}
                        width={24}
                        height={24}
                        className="rounded-full"
                        style={{
                          width: 24,
                          height: 24,
                          objectFit: "cover",
                          objectPosition: "top center",
                          border: `1px solid ${TECH_COLOR[tech]}55`,
                        }}
                      />
                      <span
                        className="text-[10px] font-black leading-none"
                        style={{ color: TECH_COLOR[tech] }}>
                        {role}
                      </span>
                      <span
                        className="text-[11px] font-black leading-none"
                        style={{ color: "#111827" }}>
                        {tech}
                      </span>
                    </span>
                  );
                })
              ) : (
                <span
                  className="text-[11px] font-black rounded-full px-2.5 py-1"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.9)",
                    color: "#64748b",
                  }}>
                  {"\uBBF8\uBC30\uC815"}
                </span>
              )}
            </div>
            <select
              value={job.tech}
              onChange={(e) => {
                e.stopPropagation();
                onUpdate(job.id, {
                  tech: e.target.value as Tech,
                  memo: setExtraTechsInMemo(
                    job.memo,
                    extraTechs.filter((t) => t !== (e.target.value as Tech)),
                  ),
                });
              }}
              onClick={(e) => e.stopPropagation()}
              className="text-xs rounded-full px-2.5 py-1 cursor-pointer font-bold flex-shrink-0"
              style={{
                backgroundColor: "rgba(255,255,255,0.25)",
                color: "white",
                border: "1.5px solid rgba(255,255,255,0.4)",
                outline: "none",
              }}>
              <option
                value=""
                style={{ color: "#111827", backgroundColor: "white" }}>
                {"\uBBF8\uBC30\uC815"}
              </option>
              {TECHS.map((t) => (
                <option
                  key={t}
                  value={t}
                  style={{ color: "#111827", backgroundColor: "white" }}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div
            className="hidden"
            onClick={(e) => e.stopPropagation()}>
            {jobTechs.length > 0 && (
              <div className="flex items-center gap-1">
                {jobTechs.map((tech, idx) => {
                  const idxInTechs = TECHS.indexOf(tech) + 1;
                  if (idxInTechs <= 0) return null;
                  return (
                    <Image
                      key={tech}
                      src={`/images/knight/knights-${idxInTechs}.png`}
                      alt={tech}
                      title={idx === 0 ? `주담당 ${tech}` : `동행 ${tech}`}
                      width={32}
                      height={36}
                      className="rounded-lg"
                      style={{
                        width: 28,
                        height: 32,
                        objectFit: "cover",
                        objectPosition: "top center",
                        border: "1.5px solid rgba(255,255,255,0.75)",
                        boxShadow: "0 4px 10px rgba(15,23,42,0.18)",
                      }}
                    />
                  );
                })}
              </div>
            )}
            <select
              value={job.tech}
              onChange={(e) => {
                e.stopPropagation();
                onUpdate(job.id, {
                  tech: e.target.value as Tech,
                  memo: setExtraTechsInMemo(
                    job.memo,
                    extraTechs.filter((t) => t !== (e.target.value as Tech)),
                  ),
                });
              }}
              onClick={(e) => e.stopPropagation()}
              className="text-xs rounded-full px-2.5 py-1 cursor-pointer font-bold"
              style={{
                backgroundColor: "rgba(255,255,255,0.25)",
                color: "white",
                border: "1.5px solid rgba(255,255,255,0.4)",
                outline: "none",
              }}>
              <option
                value=""
                style={{ color: "#111827", backgroundColor: "white" }}>
                미배정
              </option>
              {TECHS.map((t) => (
                <option
                  key={t}
                  value={t}
                  style={{ color: "#111827", backgroundColor: "white" }}>
                  {t}
                </option>
              ))}
            </select>
            {jobTechs.length > 1 && (
              <span
                className="text-[11px] font-black px-2 py-1 rounded-full"
                style={{
                  backgroundColor: "rgba(255,255,255,0.25)",
                  color: "white",
                  border: "1.5px solid rgba(255,255,255,0.4)",
                }}>
                {"\uC678 "}{jobTechs.length - 1}{"\uBA85"}
              </span>
            )}
          </div>
        </div>

        {/* ── 본문: 더 이상 접히지 않음. 현장 동선 순서(누구→어디→무엇→얼마)로 배치 ── */}
        <div className="px-4 pt-3 pb-3 flex flex-col gap-2.5">
          {isAdmin && (
            <div
              className="rounded-xl px-3 py-2 flex flex-col gap-2"
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "rgba(255,255,255,0.72)",
                border: `1px solid ${techColor}33`,
              }}>
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-[11px] font-bold"
                  style={{ color: techColor }}>
                  {"\uB2F4\uB2F9 \uAE30\uC0AC"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const nextTech = TECHS.find(
                      (t) => t !== job.tech && !extraTechs.includes(t),
                    );
                    if (!nextTech) return;
                    onUpdate(job.id, {
                      memo: setExtraTechsInMemo(job.memo, [...extraTechs, nextTech]),
                    });
                  }}
                  disabled={!TECHS.some((t) => t !== job.tech && !extraTechs.includes(t))}
                  className="rounded-lg px-2.5 py-1.5 text-[11px] font-black"
                  style={{
                    backgroundColor: "#eff6ff",
                    color: "#1f66ff",
                    border: "1px solid #bfd3ff",
                    opacity: TECHS.some((t) => t !== job.tech && !extraTechs.includes(t))
                      ? 1
                      : 0.45,
                  }}>
                  + {"\uAE30\uC0AC \uCD94\uAC00"}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {job.tech && (
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-black"
                    style={{
                      backgroundColor: `${TECH_COLOR[job.tech]}22`,
                      color: TECH_COLOR[job.tech],
                    }}>
                    {"\uC8FC\uB2F4\uB2F9 "}{job.tech}
                  </span>
                )}
                {extraTechs.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black"
                    style={{
                      backgroundColor: `${TECH_COLOR[tech]}22`,
                      color: TECH_COLOR[tech],
                    }}>
                    {"\uB3D9\uD589 "}{tech}
                    <button
                      type="button"
                      onClick={() =>
                        onUpdate(job.id, {
                          memo: setExtraTechsInMemo(
                            job.memo,
                            extraTechs.filter((t) => t !== tech),
                          ),
                        })
                      }
                      className="font-black"
                      style={{ color: TECH_COLOR[tech] }}>
                      x
                    </button>
                  </span>
                ))}
                {!job.tech && extraTechs.length === 0 && (
                  <span
                    className="text-[11px] font-bold"
                    style={{ color: "#94a3b8" }}>
                    {"\uBBF8\uBC30\uC815"}
                  </span>
                )}
              </div>
            </div>
          )}
          {/* 고객명 + 전화 */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-lg font-black" style={{ color: "#111827" }}>
              {job.name || "?"}
              <span
                className="text-sm font-normal ml-1"
                style={{ color: "#94a3b8" }}>
                고객님
              </span>
            </span>
            {job.phone && (
              <a
                href={`tel:${job.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-3 rounded-xl flex-shrink-0"
                style={{
                  height: 38,
                  background: "linear-gradient(135deg,#e32e40,#ff707e)",
                  textDecoration: "none",
                }}>
                <Image
                  src="/images/phone-icon.png"
                  alt="전화"
                  width={28}
                  height={28}
                  style={{ width: 22, height: 22, objectFit: "contain" }}
                />
                <span className="text-sm font-bold text-white">
                  {job.phone}
                </span>
              </a>
            )}
          </div>

          {/* 방문 지역 — 늘 보이고, 바로 길찾기 가능 (출발 전 필수 정보) */}
          {job.region && (
            <a
              href={naverMapUrl(job.region)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-start justify-between gap-2 px-3 py-2 rounded-xl"
              style={{
                backgroundColor: "rgba(255,255,255,0.7)",
                border: `1px solid ${techColor}33`,
                textDecoration: "none",
              }}>
              <div className="min-w-0">
                <p
                  className="text-[11px] font-medium mb-0.5"
                  style={{ color: techColor }}>
                  📍 방문 지역
                </p>
                <p
                  className="text-sm font-black leading-snug"
                  style={{ color: "#111827" }}>
                  {job.region}
                </p>
              </div>
              <span
                className="text-xs font-bold flex-shrink-0 px-2.5 py-1.5 rounded-lg text-white"
                style={{ backgroundColor: techColor }}>
                길찾기
              </span>
            </a>
          )}

          {/* 수리 내용 */}
          {job.symptom && (
            <div
              className="px-3 py-2 rounded-xl"
              style={{
                backgroundColor: "rgba(255,255,255,0.7)",
                border: `1px solid ${techColor}33`,
              }}>
              <p
                className="text-[11px] font-medium mb-0.5"
                style={{ color: techColor }}>
                수리 내용
              </p>
              <p className="text-base font-black" style={{ color: "#111827" }}>
                {job.symptom}
              </p>
            </div>
          )}

          {/* 금액 */}
          {job.price > 0 && (
            <div
              className="flex items-center justify-between px-3 py-2.5 rounded-xl"
              style={{ background: techGradient }}>
              <span className="text-xs font-medium text-white opacity-80">
                견적금액
              </span>
              <span className="text-xl font-black text-white">
                {formatPrice(job.price)}
              </span>
            </div>
          )}

          {/* AS 만료 — 완료 건만, 작은 배지로 항상 노출 */}
          {asInfo && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl self-start"
              style={{
                backgroundColor: asInfo.expired
                  ? "#fef2f2"
                  : asInfo.daysLeft <= 30
                    ? "#fff7ed"
                    : "rgba(255,255,255,0.8)",
                border: `1px solid ${asInfo.expired ? "#fecaca" : asInfo.daysLeft <= 30 ? "#fed7aa" : "#bbf7d0"}`,
              }}>
              <span>🛡</span>
              <span
                className="text-xs font-bold"
                style={{
                  color: asInfo.expired
                    ? "#ef4444"
                    : asInfo.daysLeft <= 30
                      ? "#f59e0b"
                      : "#16a34a",
                }}>
                AS {asInfo.expired ? "만료" : `${job.as_until} 까지`}
                {!asInfo.expired &&
                  asInfo.daysLeft <= 30 &&
                  ` (${asInfo.daysLeft}일 남음)`}
              </span>
            </div>
          )}

          {/* 메모 — 현장 특이사항이라 항상 노출 */}
          {visibleMemo && (
            <div
              className="rounded-xl px-3 py-2.5"
              style={{
                backgroundColor: "#fffbeb",
                border: "1px solid #fde68a",
              }}>
              <p
                className="text-xs font-bold mb-1"
                style={{ color: "#92400e" }}>
                ⚠️ 메모
              </p>
              <p
                className="text-sm leading-relaxed whitespace-pre-wrap"
                style={{ color: "#1f2937" }}>
                {visibleMemo}
              </p>
            </div>
          )}

          {/* 자재 — 필요할 때만 펼치는 정보라 토글 유지 */}
          <MaterialSection jobId={job.id} isAdmin={isAdmin} />

          {/* 접수사진 — 토글 유지, 자재 토글과 동일한 패턴 */}
          {intakePhotos.length > 0 && (
            <PhotoDisclosure
              label="접수사진"
              photos={intakePhotos}
              open={intakeOpen}
              accentColor="#f59e0b"
              onToggle={() => setIntakeOpen((v) => !v)}
              onPhotoClick={(url) => {
                setLightboxList(intakePhotos);
                setLightboxUrl(url);
              }}
            />
          )}

          {/* 완료사진 */}
          {photos.length > 0 && (
            <PhotoDisclosure
              label="완료사진"
              photos={photos}
              open={completionOpen}
              accentColor="#1f66ff"
              onToggle={() => setCompletionOpen((v) => !v)}
              onPhotoClick={(url) => {
                setLightboxList(photos);
                setLightboxUrl(url);
              }}
            />
          )}

          {/* 수정/삭제 — 토글 없이 항상 노출 */}
          {isAdmin && (
            <div className="flex gap-2 pt-0.5">
              <button
                onClick={() => onEdit(job)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                style={{
                  backgroundColor: "rgba(255,255,255,0.8)",
                  color: "#334155",
                  border: "1px solid #e5e7eb",
                }}>
                수정
              </button>
              <button
                onClick={() => onDelete(job.id)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                style={{
                  backgroundColor: "#fef2f2",
                  color: "#ef4444",
                  border: "1px solid #fecaca",
                }}>
                삭제
              </button>
            </div>
          )}
        </div>

        {/* ── 하단 액션 버튼 ── */}
        <div
          className="flex gap-2 px-3 py-3"
          style={{ borderTop: `1px solid ${techColor}22` }}>
          {job.is_measurement ? (
            <div className="flex gap-2 flex-1">
              <button
                onClick={handleToggleMeasurement}
                className="flex-1 rounded-xl py-2.5 text-sm font-bold"
                style={{
                  backgroundColor:
                    job.status === "완료" ? "#f3e8ff" : "#a855f7",
                  color: job.status === "완료" ? "#a855f7" : "white",
                  border: job.status === "완료" ? "1px solid #d8b4fe" : "none",
                }}>
                {job.status === "완료" ? "📐 실측완료 ✓" : "📐 실측 완료"}
              </button>
              {job.status === "완료" && !job.install_completed && (
                <button
                  onClick={() => {
                    if (!confirm("시공 완료 처리할까요? 매출에 반영됩니다."))
                      return;
                    onUpdate(job.id, {
                      install_completed: true,
                      install_date:
                        job.install_date || nowKST().toISOString().slice(0, 10),
                      as_until: addOneYear(nowKST().toISOString().slice(0, 10)),
                    });
                  }}
                  className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white"
                  style={{ backgroundColor: "#1f66ff" }}>
                  🔨 시공 완료
                </button>
              )}
              {job.install_completed && (
                <span
                  className="rounded-xl px-3 py-2.5 text-xs font-bold flex items-center"
                  style={{
                    backgroundColor: "#eff6ff",
                    color: "#1f66ff",
                    border: "1px solid #bfdbfe",
                  }}>
                  ✓ 시공완료
                </span>
              )}
            </div>
          ) : job.status !== "완료" ? (
            <button
              onClick={handleComplete}
              className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white"
              style={{ background: techGradient }}>
              ✓ 완료 처리
            </button>
          ) : (
            <button
              onClick={() => {
                setPrevStatus("완료");
                setShowPhoto(true);
              }}
              className="flex-1 rounded-xl py-2.5 text-sm font-bold"
              style={{
                backgroundColor:
                  photos.length > 0 ? "#eaf1ff" : "rgba(255,255,255,0.8)",
                color: photos.length > 0 ? "#1f66ff" : "#64748b",
                border: `1px solid ${photos.length > 0 ? "#bfd3ff" : "#e5e7eb"}`,
              }}>
              {photos.length > 0
                ? `📷 사진 관리 (${photos.length}장)`
                : "📷 사진 추가"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ── 사진 토글 (접수사진 / 완료사진 공용) ───────────────────────
// 자재 섹션과 동일한 "닫혀있다가 필요할 때만 펼치는" 패턴으로 통일.
// 닫힌 상태에서도 첫 사진 썸네일 + 장수를 보여줘서 안을 안 열어도 감이 오게 함.
function PhotoDisclosure({
  label,
  photos,
  open,
  accentColor,
  onToggle,
  onPhotoClick,
}: {
  label: string;
  photos: string[];
  open: boolean;
  accentColor: string;
  onToggle: () => void;
  onPhotoClick: (url: string) => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left"
        style={{
          backgroundColor: open ? `${accentColor}14` : "#f8fafc",
          border: `1px solid ${open ? `${accentColor}55` : "#e5e7eb"}`,
        }}>
        <div className="flex items-center gap-2.5">
          <div
            className="rounded-lg overflow-hidden flex-shrink-0"
            style={{ width: 30, height: 30 }}>
            <img
              src={photos[0]}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm font-bold" style={{ color: accentColor }}>
            {label}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-bold"
            style={{
              backgroundColor: `${accentColor}18`,
              color: accentColor,
            }}>
            {photos.length}장
          </span>
        </div>
        <span
          style={{
            color: "#94a3b8",
            fontSize: 14,
            transition: "transform 0.2s",
            display: "inline-block",
            transform: open ? "rotate(180deg)" : "none",
          }}>
          ▾
        </span>
      </button>

      {open && (
        <div className="grid grid-cols-3 gap-1.5 mt-1.5">
          {photos.map((url, idx) => (
            <div
              key={url}
              className="relative rounded-xl overflow-hidden"
              style={{ aspectRatio: "1" }}>
              <img
                src={url}
                alt=""
                onClick={() => onPhotoClick(url)}
                className="w-full h-full object-cover cursor-pointer"
              />
              {idx === 2 && photos.length > 3 && (
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-xl"
                  style={{ backgroundColor: "rgba(0,0,0,0.55)" }}>
                  <span className="text-white text-sm font-black">
                    +{photos.length - 3}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
