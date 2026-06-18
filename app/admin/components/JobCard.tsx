"use client";

import { useState } from "react";
import Image from "next/image";
import PhotoCapture from "./PhotoCapture";
import MaterialSection from "./MaterialSection";
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
  const [expanded, setExpanded] = useState(false);
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
  const techIdx = job.tech ? TECHS.indexOf(job.tech) + 1 : 0;

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
          boxShadow: expanded
            ? `0 8px 32px ${techColor}22`
            : `0 2px 12px ${techColor}18`,
          transition: "box-shadow 0.2s",
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
          className="flex items-center justify-between px-4 py-2.5"
          style={{ background: techGradient }}>
          <div className="flex items-center gap-2">
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
            className="flex items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}>
            {job.tech && techIdx > 0 && (
              <Image
                src={`/images/knight/knights-${techIdx}.png`}
                alt={job.tech}
                width={32}
                height={36}
                className="rounded-lg"
                style={{
                  width: 32,
                  height: 36,
                  objectFit: "cover",
                  objectPosition: "top center",
                  border: "2px solid rgba(255,255,255,0.5)",
                }}
              />
            )}
            <select
              value={job.tech}
              onChange={(e) => {
                e.stopPropagation();
                onUpdate(job.id, { tech: e.target.value as any });
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
          </div>
        </div>

        {/* ── 항상 보이는 핵심 정보 ── */}
        <div className="px-4 pt-3 pb-2">
          {/* 고객명 + 전화 */}
          <div className="flex items-center justify-between mb-3">
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

          {/* 수리 내용 */}
          {job.symptom && (
            <div
              className="mb-2.5 px-3 py-2 rounded-xl"
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
              className="mb-2.5 flex items-center justify-between px-3 py-2.5 rounded-xl"
              style={{ background: techGradient }}>
              <span className="text-xs font-medium text-white opacity-80">
                견적금액
              </span>
              <span className="text-xl font-black text-white">
                {formatPrice(job.price)}
              </span>
            </div>
          )}

          {/* 자재 */}
          <MaterialSection jobId={job.id} isAdmin={isAdmin} />
        </div>

        {/* ── 자세히 보기 버튼 ── */}
        <div className="px-[16px] ">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="w-full flex items-center justify-center gap-2 py-3 font-bold text-sm transition-all"
            style={{
              background: expanded ? `${techColor}18` : `${techColor}0d`,
              color: techColor,
              border: `1px solid  ${techColor}`,
              borderRadius: "13px",
            }}>
            <span>{expanded ? "접기" : "자세히 보기"}</span>
            <span
              style={{
                transition: "transform 0.25s",
                display: "inline-block",
                transform: expanded ? "rotate(180deg)" : "none",
              }}>
              ▾
            </span>
          </button>
        </div>

        {/* ── 펼쳐지는 상세 정보 ── */}
        {expanded && (
          <div className="px-4 pt-3 pb-1 flex flex-col gap-3">
            {/* 지역 */}
            {job.region && (
              <div>
                <p
                  className="text-xs font-bold mb-1.5"
                  style={{ color: "#94a3b8" }}>
                  방문 지역
                </p>
                <a
                  href={naverMapUrl(job.region)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.8)",
                    color: techColor,
                    border: `1px solid ${techColor}44`,
                    textDecoration: "none",
                  }}>
                  <span style={{ fontSize: 12 }}>📍</span>
                  {job.region}
                </a>
              </div>
            )}

            {/* AS 만료 */}
            {asInfo && (
              <div
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl"
                style={{
                  backgroundColor: asInfo.expired
                    ? "#fef2f2"
                    : asInfo.daysLeft <= 30
                      ? "#fff7ed"
                      : "rgba(255,255,255,0.8)",
                  border: `1px solid ${asInfo.expired ? "#fecaca" : asInfo.daysLeft <= 30 ? "#fed7aa" : "#bbf7d0"}`,
                  width: "fit-content",
                }}>
                <span>🛡</span>
                <span
                  className="text-sm font-medium"
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

            {/* 메모 */}
            {job.memo && (
              <div
                className="rounded-xl px-3 py-2.5"
                style={{
                  backgroundColor: "#fffbeb",
                  border: "1px solid #fde68a",
                }}>
                <p
                  className="text-xs font-bold mb-1"
                  style={{ color: "#92400e" }}>
                  메모
                </p>
                <p
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ color: "#1f2937" }}>
                  {job.memo}
                </p>
              </div>
            )}

            {/* 접수사진 */}
            {intakePhotos.length > 0 && (
              <div>
                <p
                  className="text-xs font-bold mb-2"
                  style={{ color: "#94a3b8" }}>
                  접수사진
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {intakePhotos.map((url, idx) => (
                    <div
                      key={url}
                      className="relative rounded-xl overflow-hidden"
                      style={{ aspectRatio: "1" }}>
                      <img
                        src={url}
                        alt=""
                        onClick={() => {
                          setLightboxList(intakePhotos);
                          setLightboxUrl(url);
                        }}
                        className="w-full h-full object-cover cursor-pointer"
                      />
                      {idx === 2 && intakePhotos.length > 3 && (
                        <div
                          className="absolute inset-0 flex items-center justify-center rounded-xl"
                          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}>
                          <span className="text-white text-sm font-black">
                            +{intakePhotos.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 완료사진 */}
            {photos.length > 0 && (
              <div>
                <p
                  className="text-xs font-bold mb-2"
                  style={{ color: "#1f66ff" }}>
                  완료사진
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {photos.map((url, idx) => (
                    <div
                      key={url}
                      className="relative rounded-xl overflow-hidden"
                      style={{ aspectRatio: "1" }}>
                      <img
                        src={url}
                        alt=""
                        onClick={() => {
                          setLightboxList(photos);
                          setLightboxUrl(url);
                        }}
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
              </div>
            )}

            {/* 기사 카드 */}
            {job.tech && (
              <div
                className="relative overflow-hidden rounded-2xl p-4"
                style={{
                  background:
                    "linear-gradient(135deg,#ffffff 0%,#eef4ff 55%,#e6dcff 100%)",
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
                    <div className="text-xs mb-1" style={{ color: "#475569" }}>
                      서울 인천 경기
                    </div>
                    <div
                      className="text-medium font-black mb-1"
                      style={{ color: "#111827" }}>
                      {job.tech} 기사님
                    </div>
                    <div className="text-xs mb-2" style={{ color: "#64748b" }}>
                      가구수리
                    </div>
                    <div className="flex items-center gap-1 text-xs mb-3">
                      <span style={{ color: "#f59e0b" }}>⭐</span>
                      <span className="font-bold" style={{ color: "#111827" }}>
                        4.9
                      </span>
                      <span style={{ color: "#94a3b8" }}>(296)</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                      <span style={{ color: "#64748b" }}>🟣 우수인증</span>
                      <span style={{ color: "#64748b" }}>💗 친절상담</span>
                      <span style={{ color: "#64748b" }}>🔵 안심기사</span>
                    </div>
                  </div>
                  <Image
                    src={`/images/knight/knights-${techIdx}.png`}
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

            {/* 수정/삭제 */}
            {isAdmin && (
              <div className="flex gap-2">
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

            <div className="h-1" />
          </div>
        )}

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
