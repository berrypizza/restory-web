"use client";

import { useState } from "react";
import Image from "next/image";
import PhotoCapture from "./PhotoCapture";
import type { Job } from "../lib/types";
import type { Status } from "../lib/constants";
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

interface JobCardProps {
  job: Job;
  onUpdate: (id: string, patch: Partial<Job>) => void;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  isAdmin?: boolean;
}

export default function JobCard({
  job,
  onUpdate,
  onEdit,
  onDelete,
  isAdmin = true,
}: JobCardProps) {
  const techColor = TECH_COLOR[job.tech || ""];
  const [showPhoto, setShowPhoto] = useState(false);
  const [prevStatus, setPrevStatus] = useState<Status>(job.status);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxList, setLightboxList] = useState<string[]>([]);
  const [memoOpen, setMemoOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

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
    if (job.status === "완료") {
      onUpdate(job.id, { status: "대기", install_completed: false });
    } else {
      onUpdate(job.id, {
        status: "완료",
        as_until: addOneYear(nowKST().toISOString().slice(0, 10)),
      });
    }
  };

  const handlePhotoDone = (urls: string[]) => {
    if (urls.length === 0 && prevStatus !== "완료") {
      onUpdate(job.id, { status: prevStatus, completion_photo: "" });
    } else {
      onUpdate(job.id, {
        completion_photo: urls.length > 0 ? JSON.stringify(urls) : "",
      });
    }
    setShowPhoto(false);
  };

  const photos = getPhotos();

  return (
    <>
      {/* 완료 축하 애니메이션 */}
      {showCelebration && (
        <div
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center pointer-events-none"
          style={{ backgroundColor: "rgba(15,23,42,0.72)" }}>
          <style>{`
            @keyframes confetti-fall { 0% { transform: translateY(-20px) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
            @keyframes pop-in { 0% { transform: scale(0.3); opacity: 0; } 60% { transform: scale(1.15); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
            @keyframes fade-up { 0% { transform: translateY(16px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
            .confetti-piece { position: fixed; width: 10px; height: 10px; animation: confetti-fall linear forwards; }
          `}</style>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece rounded-sm"
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
            <p
              className="text-base text-center mt-1 font-medium"
              style={{ color: "#1f66ff" }}>
              ✨ 고마워요 ✨
            </p>
          </div>
        </div>
      )}

      {/* 라이트박스 */}
      {lightboxUrl &&
        (() => {
          const currentList = lightboxList;
          const currentIdx = currentList.indexOf(lightboxUrl);
          return (
            <div
              className="fixed inset-0 z-[70] flex flex-col select-none"
              style={{ backgroundColor: "rgba(15,23,42,0.82)" }}
              onClick={() => setLightboxUrl(null)}
              onTouchStart={(e) => {
                (e.currentTarget as any)._touchStartX = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                const diff =
                  ((e.currentTarget as any)._touchStartX ?? 0) -
                  e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) {
                  if (diff > 0 && currentIdx < currentList.length - 1)
                    setLightboxUrl(currentList[currentIdx + 1]);
                  else if (diff < 0 && currentIdx > 0)
                    setLightboxUrl(currentList[currentIdx - 1]);
                }
              }}>
              <div
                className="flex items-center justify-between px-4 py-3 flex-shrink-0"
                onClick={(e) => e.stopPropagation()}>
                <span
                  className="text-sm font-bold px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    color: "#475569",
                  }}>
                  {currentIdx + 1} / {currentList.length}
                </span>
                <button
                  onClick={() => setLightboxUrl(null)}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-base font-bold"
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
                {currentIdx > 0 && (
                  <button
                    onClick={() => setLightboxUrl(currentList[currentIdx - 1])}
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
                  alt="사진 크게 보기"
                  className="rounded-2xl"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "76vh",
                    objectFit: "contain",
                  }}
                />
                {currentIdx < currentList.length - 1 && (
                  <button
                    onClick={() => setLightboxUrl(currentList[currentIdx + 1])}
                    className="absolute right-2 w-10 h-10 flex items-center justify-center rounded-full text-xl font-bold"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.12)",
                      color: "white",
                    }}>
                    ›
                  </button>
                )}
              </div>
              {currentList.length > 1 && (
                <div
                  className="flex justify-center gap-1.5 py-4 flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}>
                  {currentList.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxUrl(currentList[i])}
                      className="rounded-full transition-all"
                      style={{
                        width: i === currentIdx ? 20 : 6,
                        height: 6,
                        backgroundColor:
                          i === currentIdx ? "#1f66ff" : "#94a3b8",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })()}

      {/* 사진 관리 모달 */}
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

      {/* 카드 본체 */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "#ffffff",
          border: job.is_measurement
            ? "1px solid #a855f755"
            : "1px solid #e5e7eb",
          boxShadow: "0 2px 12px rgba(15,23,42,0.05)",
          borderLeft: `7px solid ${techColor}`,
        }}>
        {/* 실측 배너 */}
        {job.is_measurement && (
          <div
            className="flex items-center gap-2 px-4 py-2.5"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
            }}>
            <span className="text-base">📐</span>
            <span className="text-sm font-black text-white tracking-wide">
              실측 방문
            </span>
            <span
              className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
              }}>
              {job.install_completed
                ? "시공 완료"
                : job.install_date
                  ? `시공 ${formatDate(job.install_date)}`
                  : "시공일 미정"}
            </span>
          </div>
        )}

        {/* 상태/날짜/기사 행 */}
        <div
          className="flex items-center gap-2 px-3 pt-3 pb-2 flex-wrap"
          style={{ borderBottom: "1px solid #f8fafc" }}>
          <select
            value={job.status}
            onChange={(e) =>
              onUpdate(job.id, { status: e.target.value as Status })
            }
            className="text-xs font-bold rounded-full px-3 py-1 border cursor-pointer"
            style={{ ...STATUS_STYLE[job.status], outline: "none" }}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span className="text-xs font-medium" style={{ color: "#475569" }}>
            {formatFullDate(job.visit_date)}
          </span>
          {job.visit_time && (
            <span
              className="text-medium font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "#f8fafc", color: "#1f66ff" }}>
              {formatTime(job.visit_time)}
            </span>
          )}
          {job.is_measurement && (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: "#a855f722",
                color: "#a855f7",
                border: "1px solid #a855f744",
              }}>
              📐 실측
            </span>
          )}
          {job.is_measurement && job.install_completed && (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: "#eaf1ff",
                color: "#1f66ff",
                border: "1px solid #bfd3ff",
              }}>
              🔨 시공완료
            </span>
          )}
          {job.is_measurement && !job.install_completed && job.install_date && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: "#f59e0b18",
                color: "#f59e0b",
                border: "1px solid #f59e0b33",
              }}>
              🔨 시공 {formatDate(job.install_date)}
              {job.install_time ? " " + formatTime(job.install_time) : ""}
            </span>
          )}
          {job.is_measurement &&
            !job.install_completed &&
            !job.install_date && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: "#f59e0b18",
                  color: "#f59e0b",
                  border: "1px solid #f59e0b33",
                }}>
                시공일 미정
              </span>
            )}
          <select
            value={job.tech}
            onChange={(e) => onUpdate(job.id, { tech: e.target.value as any })}
            className="text-xs rounded-full px-3 py-1 border cursor-pointer font-bold ml-auto"
            style={{
              backgroundColor: techColor + "18",
              border: `1px solid ${techColor}55`,
              color: techColor,
              outline: "none",
            }}>
            <option value="">미배정</option>
            {TECHS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* 본문 */}
        <div className="flex items-start gap-3 px-3 py-3">
          <div className="flex-1 min-w-0">
            {/* 이름 + 전화 */}
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className="text-base font-bold"
                style={{ color: "#111827" }}>
                {job.name || "?"}{" "}
                <span className="text-neutral-500">고객님</span>
              </span>
              {job.phone && (
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-xs font-medium px-2 py-2 rounded-xl"
                    style={{
                      backgroundColor: "#ef444418",
                      color: "#e32e40",
                      border: "1px solid #ef444430",
                    }}>
                    {job.phone}
                  </span>
                  <a
                    href={`tel:${job.phone}`}
                    className="flex items-center justify-center border-2 border-transparent rounded-xl bg-gradient-to-r from-[#e32e40] to-[#ff707e]"
                    style={{
                      width: 36,
                      height: 36,
                      color: "white",
                      fontSize: 18,
                      textDecoration: "none",
                      flexShrink: 0,
                    }}>
                    <Image
                      src="/images/phone-icon.png"
                      alt="전화기 아이콘"
                      width={48}
                      height={48}
                      className="h-[48px] w-[48px] object-contain md:h-[56px] md:w-[56px]"
                    />
                  </a>
                </div>
              )}
            </div>

            {/* 지역 + 증상 + 금액 */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {job.region && (
                <a
                  href={naverMapUrl(job.region)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium px-2 py-0.5 rounded-xl inline-flex items-center gap-1"
                  style={{
                    backgroundColor: "#eff6ff",
                    color: "#1f66ff",
                    border: "1px solid #bfd3ff",
                    textDecoration: "none",
                  }}>
                  <span style={{ fontSize: 10 }}>📍</span>
                  {job.region}
                </a>
              )}
              {job.symptom && (
                <span className="text-xl font-bold text-[#1f66ff]">
                  {job.symptom}
                </span>
              )}
              <div className="flex flex-wrap border-2 border-r-[#e32e40] border-b-[#e32e40] border-t-transparent border-l-transparent rounded-xl px-2 py-0.5 bg-gradient-to-r from-[#1f66ff] to-[#4f8fff] items-center gap-3">
                {job.price > 0 && (
                  <span
                    className="text-lg font-bold"
                    style={{ color: "#ffffff" }}>
                    {formatPrice(job.price)}
                  </span>
                )}
              </div>
            </div>

            {/* 기사 카드 */}
            {job.tech && (
              <div
                className="mt-3 relative overflow-hidden rounded-2xl p-4"
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #eef4ff 55%, #e6dcff 100%)",
                  border: "1px solid #bfd3ff",
                  boxShadow: "0 10px 28px rgba(31,102,255,0.12)",
                }}>
                <div
                  className="absolute right-3 top-0 w-8 h-10 flex items-start justify-center pt-1"
                  style={{
                    background: "linear-gradient(180deg,#4169ff,#6b7cff)",
                    clipPath: "polygon(0 0,100% 0,100% 100%,50% 75%,0 100%)",
                    color: "white",
                  }}>
                  ♛
                </div>
                <div className="flex items-start justify-between gap-0.5">
                  <div className="min-w-0 flex-1 pr-1">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="text-[11px] font-black px-2 py-1 rounded-md bg-[#6d4cff] text-white">
                        👑 베스트
                      </span>
                      <span className="text-[11px] font-black px-2 py-1 rounded-md bg-[#eaf1ff] text-[#1f66ff]">
                        🛡 안심케어
                      </span>
                    </div>
                    <div className="text-xs mb-2" style={{ color: "#475569" }}>
                      서울 인천 경기
                    </div>
                    <div
                      className="text-medium font-black mb-2"
                      style={{ color: "#111827" }}>
                      {job.tech} 기사님
                    </div>
                    <div className="text-xs mb-3" style={{ color: "#64748b" }}>
                      가구수리
                    </div>
                    <div className="flex items-center gap-1 text-xs mb-4">
                      <span style={{ color: "#f59e0b" }}>⭐</span>
                      <span className="font-bold" style={{ color: "#111827" }}>
                        4.9
                      </span>
                      <span style={{ color: "#94a3b8" }}>(296)</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                      <span
                        className="flex items-center gap-1"
                        style={{ color: "#64748b" }}>
                        🟣 우수인증
                      </span>
                      <span
                        className="flex items-center gap-1"
                        style={{ color: "#64748b" }}>
                        💗 친절상담
                      </span>
                      <span
                        className="flex items-center gap-1"
                        style={{ color: "#64748b" }}>
                        🔵 안심기사
                      </span>
                    </div>
                  </div>
                  <Image
                    src={`/images/knight/knights-${TECHS.indexOf(job.tech) + 1}.png`}
                    alt={`${job.tech} 기사님`}
                    width={96}
                    height={112}
                    className="object-cover flex-shrink-0 rounded-2xl"
                    style={{
                      width: 96,
                      height: 112,
                      objectFit: "cover",
                      objectPosition: "top center",
                      boxShadow: "0 12px 26px rgba(31,102,255,0.22)",
                    }}
                  />
                </div>
              </div>
            )}

            {/* 메모 */}
            {job.memo && (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setMemoOpen((v) => !v)}
                  className="w-full flex items-center justify-between rounded-xl px-3 py-3 text-left"
                  style={{
                    backgroundColor: memoOpen ? "#c8e0ff" : "#f8fbff",
                    border: `1px solid ${memoOpen ? "#bfd3ff" : "#bfd3ff"}`,
                    boxShadow: memoOpen ? "none" : "0 0 0 1px #eaf1ff",
                  }}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span style={{ fontSize: 15, flexShrink: 0 }}>💬</span>
                    <div className="min-w-0">
                      <p
                        className="text-medium font-black mb-0.5"
                        style={{ color: "#1f66ff" }}>
                        메모 보기
                      </p>
                      <p
                        className="text-xs truncate"
                        style={{ color: "#6b7280" }}>
                        {job.memo}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    {!memoOpen && (
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full animate-pulse"
                        style={{
                          backgroundColor: "#eaf1ff",
                          color: "#1f66ff",
                          border: "1px solid #bfd3ff",
                        }}>
                        탭
                      </span>
                    )}
                    <span
                      style={{
                        color: "#1f66ff",
                        fontSize: 16,
                        display: "inline-block",
                        transition: "transform 0.2s",
                        transform: memoOpen ? "rotate(180deg)" : "none",
                      }}>
                      ▾
                    </span>
                  </div>
                </button>
                {memoOpen && (
                  <div
                    className="rounded-xl px-4 py-3 -mt-0.5 shadow-2xl"
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #bfd3ff",
                      borderTop: "none",
                    }}>
                    <p
                      className="text-sm leading-relaxed whitespace-pre-wrap"
                      style={{ color: "#1f2937" }}>
                      {job.memo}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* AS 만료 */}
            {job.status === "완료" &&
              job.as_until &&
              (() => {
                const t = nowKST().toISOString().slice(0, 10);
                const expired = job.as_until < t;
                const daysLeft = Math.ceil(
                  (new Date(job.as_until).getTime() - new Date(t).getTime()) /
                    (1000 * 60 * 60 * 24),
                );
                return (
                  <div
                    className="flex items-center gap-1.5 mt-1 px-2 py-1 rounded-lg"
                    style={{
                      backgroundColor: expired
                        ? "#fef2f2"
                        : daysLeft <= 30
                          ? "#f59e0b18"
                          : "#f4f8ff",
                      border: `1px solid ${expired ? "#ef444433" : daysLeft <= 30 ? "#f59e0b33" : "#d6e4ff"}`,
                      display: "inline-flex",
                      width: "fit-content",
                    }}>
                    <span style={{ fontSize: 11 }}>🛡</span>
                    <span
                      className="text-xs font-medium"
                      style={{
                        color: expired
                          ? "#ef4444"
                          : daysLeft <= 30
                            ? "#f59e0b"
                            : "#1f66ff",
                      }}>
                      AS {expired ? "만료" : `${job.as_until} 까지`}
                      {!expired && daysLeft <= 30 && ` (${daysLeft}일 남음)`}
                    </span>
                  </div>
                );
              })()}

            {/* 사진 목록 */}
            {(getIntakePhotos().length > 0 || photos.length > 0) && (
              <div className="mt-2.5 flex flex-col gap-2.5">
                {getIntakePhotos().length > 0 && (
                  <div>
                    <span
                      className="text-medium font-bold mb-1.5 inline-block"
                      style={{ color: "#1f66ff" }}>
                      📷 접수사진
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                      {getIntakePhotos()
                        .slice(0, 4)
                        .map((url, idx) => {
                          const list = getIntakePhotos();
                          return (
                            <div key={url} className="relative">
                              <img
                                src={url}
                                alt={`접수 ${idx + 1}`}
                                onClick={() => {
                                  setLightboxList(list);
                                  setLightboxUrl(url);
                                }}
                                className="rounded-xl cursor-pointer"
                                style={{
                                  width: "max(100%, 500px)",
                                  objectFit: "cover",
                                  border: "1px solid #1f66ff",
                                }}
                              />
                              {idx === 3 && list.length > 4 && (
                                <div
                                  className="absolute inset-0 rounded-xl flex items-center justify-center"
                                  style={{
                                    backgroundColor: "rgba(0,0,0,0.6)",
                                  }}>
                                  <span
                                    className="text-xs font-bold"
                                    style={{ color: "white" }}>
                                    +{list.length - 4}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
                {photos.length > 0 && (
                  <div>
                    <span
                      className="text-xs font-bold mb-1.5 inline-block"
                      style={{ color: "#1f66ff" }}>
                      ✓ 완료사진
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                      {photos.slice(0, 4).map((url, idx) => (
                        <div key={url} className="relative">
                          <img
                            src={url}
                            alt={`완료 ${idx + 1}`}
                            onClick={() => {
                              setLightboxList(photos);
                              setLightboxUrl(url);
                            }}
                            className="rounded-xl cursor-pointer"
                            style={{
                              height: 64,
                              width: 64,
                              objectFit: "cover",
                              border: "1px solid #bfd3ff",
                            }}
                          />
                          {idx === 3 && photos.length > 4 && (
                            <div
                              className="absolute inset-0 rounded-xl flex items-center justify-center"
                              style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
                              <span
                                className="text-xs font-bold"
                                style={{ color: "white" }}>
                                +{photos.length - 4}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 수정/삭제 버튼 */}
          {isAdmin && (
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <button
                onClick={() => onEdit(job)}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold"
                style={{
                  backgroundColor: "#f3f4f6",
                  color: "#334155",
                  border: "1px solid #e5e7eb",
                }}>
                수정
              </button>
              <button
                onClick={() => onDelete(job.id)}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold"
                style={{
                  backgroundColor: "#ef444418",
                  color: "#ef4444",
                  border: "1px solid #ef444430",
                }}>
                삭제
              </button>
            </div>
          )}
        </div>

        {/* 하단 액션 버튼 */}
        <div
          className="flex gap-2 px-3 pb-3"
          style={{ borderTop: "1px solid #f8fafc", paddingTop: 10 }}>
          {job.is_measurement ? (
            <div className="flex gap-2 flex-1">
              <button
                onClick={handleToggleMeasurement}
                className="flex-1 rounded-xl py-2.5 text-sm font-bold"
                style={{
                  backgroundColor:
                    job.status === "완료" ? "#a855f722" : "#a855f7",
                  color: job.status === "완료" ? "#a855f7" : "white",
                  border:
                    job.status === "완료" ? "1px solid #a855f744" : "none",
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
                  className="rounded-xl px-3 py-2.5 text-xs font-bold flex items-center flex-shrink-0"
                  style={{
                    backgroundColor: "#eff6ff",
                    color: "#1f66ff",
                    border: "1px solid #d6e4ff",
                  }}>
                  ✓ 시공완료
                </span>
              )}
            </div>
          ) : job.status !== "완료" ? (
            <button
              onClick={handleComplete}
              className="flex-1 border-2 border-transparent rounded-xl px-3 py-2 bg-gradient-to-r from-[#1f66ff] to-[#4f8fff] text-sm font-bold text-white">
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
                backgroundColor: photos.length > 0 ? "#eaf1ff" : "#f8fafc",
                color: photos.length > 0 ? "#1f66ff" : "#64748b",
                border: `1px solid ${photos.length > 0 ? "#bfd3ff" : "#dbe3f0"}`,
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
