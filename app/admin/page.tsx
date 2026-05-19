"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

type Status = "대기" | "배정" | "완료" | "취소";
type Tech = "" | "고관호" | "고현호" | "이주형" | "강영훈";

interface Job {
  id: string;
  created_at: string;
  visit_date: string;
  visit_time: string;
  name: string;
  phone: string;
  region: string;
  symptom: string;
  price: number;
  status: Status;
  tech: Tech;
  memo: string;
  review_requested: boolean;
  completion_photo?: string;
  as_until?: string;
  intake_photos?: string;
  is_measurement?: boolean;
  install_date?: string | null;
  install_time?: string | null;
  install_completed?: boolean;
}

const TECHS: Tech[] = ["고관호", "고현호", "이주형", "강영훈"];
const STATUSES: Status[] = ["대기", "배정", "완료", "취소"];

const TECH_COLOR: Record<string, string> = {
  고관호: "#e32e40",
  고현호: "#60a5fa",
  이주형: "#f59e0b",
  강영훈: "#f472b6",
  "": "#64748b",
};

const TECH_PHOTO: Record<string, string> = {
  고관호: "/images/knight/knights-1.png",
  고현호: "/images/knight/knights-2.png",
  이주형: "/images/knight/knights-3.png",
  강영훈: "/images/knight/knights-4.png",
};

const STATUS_STYLE: Record<
  Status,
  { bg: string; color: string; border: string }
> = {
  대기: { bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb" },
  배정: { bg: "#eaf1ff", color: "#1f66ff", border: "#a9c4ff" },
  완료: { bg: "#eff6ff", color: "#1f66ff", border: "#bfd3ff" },
  취소: { bg: "#fef2f2", color: "#ef4444", border: "#ef444433" },
};

function nowKST() {
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000);
}
function today() {
  return nowKST().toISOString().slice(0, 10);
}
function thisYearMonth() {
  return nowKST().toISOString().slice(0, 7);
}
function formatDate(d: string) {
  if (!d) return "-";
  const [, m, day] = d.split("-");
  return `${parseInt(m)}/${parseInt(day)}`;
}
function formatFullDate(d: string) {
  if (!d) return "-";
  const [y, m, day] = d.split("-");
  const dow = ["일", "월", "화", "수", "목", "금", "토"][new Date(d).getDay()];
  return `${y}년 ${parseInt(m)}월 ${parseInt(day)}일 (${dow})`;
}
function formatYearMonth(ym: string) {
  const [y, m] = ym.split("-");
  return `${y}년 ${parseInt(m)}월`;
}
function formatTime(t: string) {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  const min = parseInt(m || "0");
  const ampm = hour < 12 ? "AM" : "PM";
  const h12 = hour % 12 || 12;
  return min > 0 ? `${ampm} ${h12}시 ${min}분` : `${ampm} ${h12}시`;
}
function formatPrice(p: number) {
  return p >= 10000
    ? `${Math.round(p / 10000)}만원`
    : `${p.toLocaleString()}원`;
}
function reviewSms(job: Job) {
  return encodeURIComponent(
    `안녕하세요 ${job.name}님, 리스토리입니다 😊\n지난번 가구 수리 잘 쓰고 계신가요?\n\n네이버 지도에 후기 남겨주시면 정말 큰 힘이 됩니다.\nhttps://naver.me/XXXXXXXX\n\n감사합니다 🙏`,
  );
}
function naverMapUrl(region: string) {
  return `https://map.naver.com/v5/search/${encodeURIComponent(region)}`;
}
function addOneYear(dateStr: string) {
  const d = new Date(dateStr);
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
}
function adjTime(t: string, delta: number) {
  const [h, m] = (t || "00:00").split(":").map(Number);
  const safe = (((h * 60 + m + delta) % 1440) + 1440) % 1440;
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}

const emptyForm = () => ({
  visit_date: today(),
  visit_time: "00:00",
  name: "",
  phone: "",
  region: "",
  symptom: "",
  price: 0,
  status: "대기" as Status,
  tech: "" as Tech,
  memo: "",
  as_until: addOneYear(today()),
  intake_photos: "" as string,
  is_measurement: false,
  install_date: null as string | null,
  install_time: null as string | null,
  install_completed: false,
});

function getCalendarDays(year: number, month: number) {
  const first = new Date(year, month, 1).getDay();
  const last = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = Array(first).fill(null);
  for (let d = 1; d <= last; d++) days.push(d);
  while (days.length % 7 !== 0) days.push(null);
  return days;
}
function pad(n: number) {
  return String(n).padStart(2, "0");
}

function compressImage(
  file: File,
  maxWidth = 1280,
  quality = 0.75,
): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => resolve(blob!), "image/jpeg", quality);
    };
    img.src = url;
  });
}

function PhotoCapture({
  jobId,
  photos,
  onDone,
  onCancel,
  revertStatus,
}: {
  jobId: string;
  photos: string[];
  onDone: (urls: string[]) => void;
  onCancel: () => void;
  revertStatus?: Status;
}) {
  const [list, setList] = useState<string[]>(photos);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const newUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(`압축 중... (${i + 1}/${files.length})`);
      const compressed = await compressImage(file);
      const path = `${jobId}-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
      setUploadProgress(`업로드 중... (${i + 1}/${files.length})`);
      const { error } = await getSupabase()
        .storage.from("completion-photos")
        .upload(path, compressed, { upsert: true, contentType: "image/jpeg" });
      if (error) {
        alert("업로드 실패: " + error.message);
        continue;
      }
      const { data } = getSupabase()
        .storage.from("completion-photos")
        .getPublicUrl(path);
      newUrls.push(data.publicUrl);
    }
    setList((prev) => [...prev, ...newUrls]);
    setUploading(false);
    setUploadProgress("");
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        style={{ backgroundColor: "rgba(15,23,42,0.45)" }}>
        <div
          className="w-full max-w-sm rounded-2xl overflow-hidden flex flex-col"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #dbe3f0",
            maxHeight: "88vh",
          }}>
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ borderBottom: "1px solid #f3f4f6" }}>
            <div>
              <span className="text-sm font-bold" style={{ color: "white" }}>
                완료 사진
              </span>
              <span className="text-xs ml-2" style={{ color: "#64748b" }}>
                {list.length}장
              </span>
            </div>
            <button
              onClick={onCancel}
              style={{ color: "#64748b", fontSize: 18 }}>
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {list.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <p className="text-3xl">📷</p>
                <p className="text-sm" style={{ color: "#64748b" }}>
                  사진이 없어요
                </p>
                {revertStatus && (
                  <p className="text-xs" style={{ color: "#ef4444" }}>
                    사진 없이 닫으면 &apos;{revertStatus}&apos;으로 돌아가요
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {list.map((url, idx) => (
                  <div
                    key={url}
                    className="relative rounded-xl overflow-hidden"
                    style={{ aspectRatio: "1", border: "1px solid #f3f4f6" }}>
                    <img
                      src={url}
                      alt={`사진 ${idx + 1}`}
                      onClick={() => setLightbox(url)}
                      className="w-full h-full cursor-pointer"
                      style={{ objectFit: "cover" }}
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 flex gap-1 p-1"
                      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
                      <button
                        onClick={() => {
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `restory-${jobId}-${idx + 1}.jpg`;
                          a.target = "_blank";
                          a.click();
                        }}
                        className="flex-1 rounded-lg py-1 text-xs"
                        style={{
                          backgroundColor: "#ffffff18",
                          color: "#1f2937",
                        }}>
                        ⬇
                      </button>
                      <button
                        onClick={() => {
                          if (!confirm("이 사진을 삭제할까요?")) return;
                          setList((prev) => prev.filter((u) => u !== url));
                        }}
                        className="flex-1 rounded-lg py-1 text-xs"
                        style={{
                          backgroundColor: "#ef444430",
                          color: "#ef4444",
                        }}>
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div
            className="flex gap-2 p-3 flex-shrink-0"
            style={{ borderTop: "1px solid #f3f4f6" }}>
            <label
              className="flex-1 rounded-xl py-2.5 text-xs font-bold text-center cursor-pointer"
              style={{ backgroundColor: "#f3f4f6", color: "#475569" }}>
              📷 카메라
              <input
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                className="hidden"
                onChange={handleFiles}
              />
            </label>
            <label
              className="flex-1 rounded-xl py-2.5 text-xs font-bold text-center cursor-pointer"
              style={{ backgroundColor: "#f3f4f6", color: "#475569" }}>
              🖼 갤러리
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFiles}
              />
            </label>
            <button
              onClick={() => onDone(list)}
              disabled={uploading}
              className="flex-1 rounded-xl py-2.5 text-xs font-bold text-white"
              style={{
                backgroundColor: "#1f66ff",
                opacity: uploading ? 0.7 : 1,
              }}>
              {uploading ? uploadProgress || "저장중..." : "확인 ✓"}
            </button>
          </div>
        </div>
      </div>
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(15,23,42,0.82)" }}
          onClick={() => setLightbox(null)}>
          <img
            src={lightbox}
            alt="사진"
            className="rounded-2xl max-w-full max-h-full"
            style={{ maxHeight: "85vh" }}
          />
        </div>
      )}
    </>
  );
}

function JobCard({
  job,
  onUpdate,
  onEdit,
  onDelete,
  isAdmin = true,
}: {
  job: Job;
  onUpdate: (id: string, patch: Partial<Job>) => void;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  isAdmin?: boolean;
}) {
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
      {showCelebration && (
        <div
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center pointer-events-none"
          style={{ backgroundColor: "rgba(15,23,42,0.72)" }}>
          <style>{`@keyframes confetti-fall { 0% { transform: translateY(-20px) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } } @keyframes pop-in { 0% { transform: scale(0.3); opacity: 0; } 60% { transform: scale(1.15); opacity: 1; } 100% { transform: scale(1); opacity: 1; } } @keyframes fade-up { 0% { transform: translateY(16px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } } .confetti-piece { position: fixed; width: 10px; height: 10px; animation: confetti-fall linear forwards; }`}</style>
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

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          boxShadow: "0 2px 12px rgba(15,23,42,0.05)",
          borderLeft: `7px solid ${techColor}`,
        }}>
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
            onChange={(e) => onUpdate(job.id, { tech: e.target.value as Tech })}
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

        {/* 여기 부터가 밖 카드? */}
        <div className="flex items-start gap-3 px-3 py-3">
          <div className="flex-1 min-w-0">
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
                    className="flex items-center justify-center border-2 border-transparent rounded-xl  bg-gradient-to-r from-[#e32e40] to-[#ff707e]"
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
              )}{" "}
              <div className="flex flex-wrap border-2 border-r-[#e32e40] border-b-[#e32e40] border-t-transparent border-l-transparent rounded-xl px-2 py-0.5 bg-gradient-to-r from-[#1f66ff] to-[#4f8fff] items-center gap-3">
                {job.price > 0 && (
                  <span
                    className="text-lg  font-bold"
                    style={{ color: "#ffffff" }}>
                    {formatPrice(job.price)}
                  </span>
                )}
              </div>
            </div>

            {/* 기사님 정보란 */}
            <div>
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

                      <div
                        className="text-xs mb-2"
                        style={{ color: "#475569" }}>
                        서울 인천 경기
                      </div>

                      <div
                        className="text-medium font-black mb-2"
                        style={{ color: "#111827" }}>
                        {job.tech} 기사님
                      </div>

                      <div
                        className="text-xs mb-3"
                        style={{ color: "#64748b" }}>
                        가구수리
                      </div>

                      <div className="flex items-center gap-1 text-xs mb-4">
                        <span style={{ color: "#f59e0b" }}>⭐</span>
                        <span
                          className="font-bold"
                          style={{ color: "#111827" }}>
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
            </div>

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
                                className="rounded-xl  cursor-pointer"
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
              className="flex-1 border-2 border-transparent rounded-xl px-3 py-2 bg-gradient-to-r from-[#1f66ff] to-[#4f8fff] text-sm font-bold text-white"
              style={{ backgroundColor: "#1f66ff" }}>
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

type UserRole = "admin" | "tech";

const USERS: {
  id: string;
  name: Tech;
  role: UserRole;
  password: string;
}[] = [
  { id: "고관호", name: "고관호", role: "admin", password: "su3024" },
  { id: "kohh1115", name: "고현호", role: "admin", password: "7071" },
  { id: "juhyung", name: "이주형", role: "tech", password: "su2000" },
  { id: "younghun", name: "강영훈", role: "tech", password: "su2000" },
];
export default function AdminDashboard() {
  const [loggedUser, setLoggedUser] = useState<string | null>(null);
  const [idInput, setIdInput] = useState("");
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"오늘" | "전체" | "달력" | "통계">("달력");
  const [statusFilter, setStatusFilter] = useState<Status | "전체">("전체");
  const [techFilter, setTechFilter] = useState<Tech | "전체">("전체");
  const [calTechFilter, setCalTechFilter] = useState<Tech | "전체">("전체");
  const [dateFilter, setDateFilter] = useState(today());
  const [monthFilter, setMonthFilter] = useState(thisYearMonth());
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [calYear, setCalYear] = useState(nowKST().getFullYear());
  const [calMonth, setCalMonth] = useState(nowKST().getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const currentUser = USERS.find((u) => u.name === loggedUser);
  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    try {
      const expiry = localStorage.getItem("restory_admin_expiry");
      const name = localStorage.getItem("restory_logged_name");

      if (expiry && Date.now() < parseInt(expiry) && name) {
        setLoggedUser(name);

        const savedUser = USERS.find((u) => u.name === name);
        if (savedUser?.role !== "admin") {
          setTechFilter(name as Tech);
          setCalTechFilter(name as Tech);
        }
      }
    } catch {}
  }, []);

  const load = useCallback(async () => {
    const { data } = await getSupabase()
      .from("jobs")
      .select("*")
      .order("visit_date", { ascending: true })
      .order("visit_time", { ascending: true });
    setJobs(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loggedUser) return;
    load();
  }, [load, loggedUser]);

  useEffect(() => {
    if (!loggedUser) return;
    const supabase = getSupabase();
    const channel = supabase
      .channel("jobs_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "jobs" },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load, loggedUser]);

  const handleLogin = () => {
    if (!idInput.trim() || !pwInput.trim()) {
      setPwError(true);
      return;
    }

    const user = USERS.find(
      (u) => u.id === idInput.trim() && u.password === pwInput,
    );

    if (!user) {
      setPwError(true);
      setPwInput("");
      return;
    }

    try {
      localStorage.setItem(
        "restory_admin_expiry",
        String(Date.now() + 24 * 60 * 60 * 1000),
      );
      localStorage.setItem("restory_logged_name", user.name);
    } catch {}

    setLoggedUser(user.name);
    setPwError(false);

    if (user.role !== "admin") {
      setTechFilter(user.name);
      setCalTechFilter(user.name);
    }
  };

  if (!loggedUser) {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-6"
        style={{
          background: "linear-gradient(180deg,#1f66ff 0%, #4f8fff 100%)",
        }}>
        <div
          className="w-full max-w-xs flex flex-col items-center gap-6 rounded-[28px] px-5 py-8"
          style={{
            backgroundColor: "rgba(255,255,255,0.94)",
            border: "1px solid rgba(255,255,255,0.55)",
            boxShadow: "0 20px 50px rgba(15,23,42,0.18)",
            backdropFilter: "blur(12px)",
          }}>
          <div className="text-center relative pt-[140px]">
            <Image
              src="/images/logo-circle.png"
              alt="Re'Story"
              width={116}
              height={116}
              className="w-[116px] object-contain absolute left-1/2 -translate-x-1/2 top-[10px]"
              priority
            />

            <p className="text-3xl mb-2">🛠</p>

            <h1 className="text-xl font-black" style={{ color: "#1f66ff" }}>
              리스토리 관리자
            </h1>

            <p className="text-sm mt-1" style={{ color: "#1f66ff" }}>
              아이디와 비밀번호를 입력하세요
            </p>
          </div>

          <div className="w-full flex flex-col gap-3">
            <input
              type="text"
              value={idInput}
              onChange={(e) => {
                setIdInput(e.target.value);
                setPwError(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="아이디"
              className="w-full rounded-2xl px-4 py-3.5 text-base"
              style={{
                backgroundColor: "#ffffff",
                border: `1px solid ${pwError ? "#ef4444" : "#e5e7eb"}`,
                color: "#1f66ff",
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />

            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={pwInput}
                onChange={(e) => {
                  setPwInput(e.target.value);
                  setPwError(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="비밀번호"
                className="w-full rounded-2xl px-4 py-3.5 text-base pr-12"
                style={{
                  backgroundColor: "#ffffff",
                  border: `1px solid ${pwError ? "#ef4444" : "#e5e7eb"}`,
                  color: "#1f66ff",
                  outline: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />

              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base"
                style={{ color: "#94a3b8" }}>
                {showPw ? "🙈" : "👁"}
              </button>
            </div>

            {pwError && (
              <p
                className="text-sm text-center font-medium"
                style={{ color: "#ef4444" }}>
                아이디 또는 비밀번호가 틀렸습니다
              </p>
            )}

            <button
              onClick={handleLogin}
              disabled={!idInput.trim() || !pwInput.trim()}
              className="w-full rounded-2xl py-3.5 text-base font-bold text-white"
              style={{
                backgroundColor:
                  idInput.trim() && pwInput.trim() ? "#1f66ff" : "#dbe3f0",
                opacity: idInput.trim() && pwInput.trim() ? 1 : 0.65,
              }}>
              입장
            </button>
          </div>
        </div>
      </main>
    );
  }

  const save = async () => {
    if (!form.name.trim() || !form.region.trim() || !form.symptom.trim())
      return;
    setSaving(true);
    const payload = {
      ...form,
      install_date: form.install_date || null,
      install_time: form.install_time || null,
    };
    try {
      if (editId) {
        const { error } = await getSupabase()
          .from("jobs")
          .update(payload)
          .eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await getSupabase().from("jobs").insert(payload);
        if (error) throw error;
      }
      setShowForm(false);
      setEditId(null);
      setForm(emptyForm());
    } catch (err: any) {
      alert("저장 실패: " + (err?.message || "알 수 없는 오류"));
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: string, patch: Partial<Job>) => {
    const { error } = await getSupabase()
      .from("jobs")
      .update(patch)
      .eq("id", id);
    if (error) alert("수정 실패: " + error.message);
  };
  const remove = async (id: string) => {
    if (!confirm("삭제할까요?")) return;
    const { error } = await getSupabase().from("jobs").delete().eq("id", id);
    if (error) alert("삭제 실패: " + error.message);
  };

  const startEdit = (job: Job) => {
    setForm({
      visit_date: job.visit_date,
      visit_time: job.visit_time || "",
      name: job.name,
      phone: job.phone,
      region: job.region,
      symptom: job.symptom,
      price: job.price,
      status: job.status,
      tech: job.tech,
      memo: job.memo,
      as_until: job.as_until || addOneYear(job.visit_date || today()),
      intake_photos: job.intake_photos || "",
      is_measurement: job.is_measurement ?? false,
      install_date: job.install_date || null,
      install_time: job.install_time || null,
      install_completed: job.install_completed ?? false,
    });
    setEditId(job.id);
    setShowForm(true);
  };

  const matchSearch = (j: Job) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.replace(/-/g, "").toLowerCase();
    return (
      (j.name ?? "").toLowerCase().includes(q) ||
      (j.phone ?? "").replace(/-/g, "").includes(q)
    );
  };

  const filtered = jobs.filter((j) => {
    if (tab === "오늘" && j.visit_date !== dateFilter) return false;
    if (tab === "전체" && !j.visit_date?.startsWith(monthFilter)) return false;
    if (statusFilter !== "전체" && j.status !== statusFilter) return false;
    if (techFilter !== "전체" && j.tech !== techFilter) return false;
    if (!matchSearch(j)) return false;
    return true;
  });

  const monthJobs = jobs.filter((j) => j.visit_date?.startsWith(monthFilter));
  const doneMonth = monthJobs.filter(
    (j) => j.status === "완료" && (!j.is_measurement || j.install_completed),
  );
  const revenue = doneMonth.reduce((s, j) => s + (j.price || 0), 0);
  const reviewPending = jobs.filter(
    (j) => j.status === "완료" && !j.review_requested && j.phone,
  );

  const inputStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    border: "1px solid #dbe3f0",
    color: "#111827",
    borderRadius: 10,
    padding: "9px 12px",
    fontSize: 14,
    outline: "none",
    width: "100%",
  };

  const calDays = getCalendarDays(calYear, calMonth);
  const jobsByDate: Record<string, Job[]> = {};
  jobs.forEach((j) => {
    if (!jobsByDate[j.visit_date]) jobsByDate[j.visit_date] = [];
    jobsByDate[j.visit_date].push(j);
    if (j.install_date && j.install_date !== j.visit_date) {
      if (!jobsByDate[j.install_date]) jobsByDate[j.install_date] = [];
      if (!jobsByDate[j.install_date].find((x) => x.id === j.id))
        jobsByDate[j.install_date].push(j);
    }
  });
  const selectedJobs = selectedDay
    ? (jobsByDate[selectedDay] ?? []).filter(
        (j) =>
          (calTechFilter === "전체" || j.tech === calTechFilter) &&
          matchSearch(j),
      )
    : [];
  const todayStr = today();

  const MonthSelector = () => (
    <div
      className="flex items-center justify-between mb-4 rounded-xl p-1.5"
      style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}>
      <button
        onClick={() => {
          const d = new Date(monthFilter + "-01");
          d.setMonth(d.getMonth() - 1);
          setMonthFilter(d.toISOString().slice(0, 7));
        }}
        className="px-4 py-2 rounded-lg text-xl font-bold"
        style={{ color: "#111827" }}>
        ‹
      </button>
      <span className="text-sm font-bold" style={{ color: "#111827" }}>
        {formatYearMonth(monthFilter)}
      </span>
      <button
        onClick={() => {
          const d = new Date(monthFilter + "-01");
          d.setMonth(d.getMonth() + 1);
          setMonthFilter(d.toISOString().slice(0, 7));
        }}
        className="px-4 py-2 rounded-lg text-xl font-bold"
        style={{ color: "#111827" }}>
        ›
      </button>
    </div>
  );

  const TechFilterSelect = ({
    value,
    onChange,
  }: {
    value: Tech | "전체";
    onChange: (v: Tech | "전체") => void;
  }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Tech | "전체")}
      className="rounded-xl px-3 py-2 text-xs font-bold cursor-pointer"
      style={{
        backgroundColor:
          value !== "전체" ? TECH_COLOR[value] + "22" : "#ffffff",
        color: value !== "전체" ? TECH_COLOR[value] : "#475569",
        border: `1px solid ${value !== "전체" ? TECH_COLOR[value] + "44" : "#e5e7eb"}`,
        outline: "none",
      }}>
      <option value="전체">전체 기사</option>
      {TECHS.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  );

  // 이 아래부터는 JSX return — 달력/오늘/전체/통계 탭 + 접수폼 모달
  // 수리담과 100% 동일 로직, 브랜드명만 "리스토리"로 변경

  return (
    <main
      className="min-h-screen px-2 py-5"
      style={{ backgroundColor: "#f5f7fb", color: "#111827" }}>
      <div className="w-full max-w-5xl mx-auto">
        <div
          className="flex items-center justify-between mb-6 pb-4"
          style={{ borderBottom: "1px solid #e5e7eb" }}>
          <div className="w-full">
            <div
              className="w-full flex text-2xl font-bold mb-[16px] items-center border-2 border-transparent rounded-xl px-3 py-2 bg-gradient-to-r from-[#1f66ff] to-[#4f8fff]"
              style={{ color: "#111827" }}>
              <Image
                src="/images/logo-circle-sm.png"
                alt="Re'Story"
                width={70}
                height={70}
                className="inline-block object-contain mr-2"
              />
              <div>
                <span className="text-[#ffffff]">리스토리</span> <br />
                <span
                  className="text-[#1f66ff] text-next-sm"
                  style={{ color: "#2e3947" }}>
                  관리 페이지
                </span>{" "}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2">
              {/* ★ 기사 프로필 사진 */}
              {loggedUser && TECH_PHOTO[loggedUser] && (
                <Image
                  src={TECH_PHOTO[loggedUser]}
                  alt={`${loggedUser} 프로필`}
                  width={70}
                  height={70}
                  className="rounded-xl object-cover flex-shrink-0"
                  style={{
                    width: 70,
                    height: 70,
                    objectFit: "cover",
                    objectPosition: "top center",
                    boxShadow: `0 12px 12px ${TECH_COLOR[loggedUser] || "#1f66ff"}33`,
                  }}
                />
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <div className="flex flex-col leading-tight text-left">
                    <span
                      className="text-2xl font-bold"
                      style={{ color: TECH_COLOR[loggedUser] || "#1f66ff" }}>
                      {loggedUser} {isAdmin ? "🏅 " : ""}
                    </span>
                    {isAdmin && (
                      <span
                        className="text-xl font-semibold"
                        style={{ color: "#415672" }}>
                        전체 관리 권한
                      </span>
                    )}
                    {!isAdmin && (
                      <span className="text-xl" style={{ color: "#94a3b8" }}>
                        내 일정만 표시
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 접수 자물쇠 등 */}
        <div className="flex items-center justify-end gap-2 right-0 mb-4">
          <button
            onClick={() => load()}
            className="rounded-xl px-3 py-2.5 text-sm font-bold"
            style={{
              backgroundColor: "#ffffff",
              color: "#6b7280",
              border: "1px solid #e5e7eb",
            }}>
            ↻
          </button>
          <button
            onClick={() => {
              try {
                localStorage.removeItem("restory_admin_expiry");
                localStorage.removeItem("restory_logged_name");
              } catch {}
              setLoggedUser(null);
              setIdInput("");
              setPwInput("");
            }}
            className="rounded-xl px-3 py-2.5 text-sm font-bold"
            style={{
              backgroundColor: "#ffffff",
              color: "#64748b",
              border: "1px solid #e5e7eb",
            }}>
            🔒
          </button>
          {isAdmin && (
            <button
              onClick={() => {
                setForm(emptyForm());
                setEditId(null);
                setShowForm(true);
              }}
              className="border-2 border-transparent rounded-xl px-3 py-2 bg-gradient-to-r from-[#1f66ff] to-[#4f8fff] text-sm font-bold text-white"
              style={{ backgroundColor: "#1f66ff" }}>
              + 접수
            </button>
          )}
        </div>

        <div
          className="flex gap-1 mb-5 rounded-xl p-1"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 10px rgba(15,23,42,0.04)",
          }}>
          {(["달력", "오늘", "전체", "통계"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 border-2 border-transparent rounded-xl px-3 py-2 text-m font-semibold transition-all"
              style={{
                background:
                  tab === t
                    ? "linear-gradient(to right, #1f66ff, #4f8fff)"
                    : "transparent",

                color: tab === t ? "white" : "#6b7280",
              }}>
              {t}
              {t === "통계" && reviewPending.length > 0 && (
                <span
                  className="ml-1 text-xs px-0.5 py-0.5 rounded-full"
                  style={{ backgroundColor: "#ef4444", color: "white" }}>
                  {reviewPending.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative mb-4">
          <span
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none"
            style={{ color: "#94a3b8" }}>
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="이름 또는 전화번호로 검색"
            style={{
              width: "100%",
              backgroundColor: "#ffffff",
              border: `1px solid ${searchQuery ? "#a9c4ff" : "#f3f4f6"}`,
              borderRadius: 12,
              padding: "10px 36px 10px 38px",
              color: "#1f66ff",
              fontSize: 14,
              outline: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold"
              style={{ backgroundColor: "#dbe3f0", color: "#6b7280" }}>
              ✕
            </button>
          )}
        </div>

        {searchQuery && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold" style={{ color: "#1f66ff" }}>
                검색 결과
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: "#eaf1ff", color: "#1f66ff" }}>
                {jobs.filter(matchSearch).length}건
              </span>
            </div>
            {jobs.filter(matchSearch).length === 0 ? (
              <div
                className="rounded-2xl py-10 text-center"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                }}>
                <p className="text-2xl mb-2">🔍</p>
                <p className="text-sm" style={{ color: "#94a3b8" }}>
                  검색 결과 없음
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {jobs
                  .filter(matchSearch)
                  .sort((a, b) => b.visit_date.localeCompare(a.visit_date))
                  .map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onUpdate={update}
                      onEdit={startEdit}
                      onDelete={remove}
                      isAdmin={isAdmin}
                    />
                  ))}
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="text-center py-20" style={{ color: "#94a3b8" }}>
            불러오는 중...
          </div>
        )}

        {!loading && tab === "달력" && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => {
                  const d = new Date(calYear, calMonth - 1);
                  setCalYear(d.getFullYear());
                  setCalMonth(d.getMonth());
                  setSelectedDay(null);
                }}
                className="px-3 py-2 rounded-lg text-lg font-bold"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#111827",
                  border: "1px solid #e5e7eb",
                }}>
                ‹
              </button>
              <span
                className="flex-1 text-center text-base font-bold"
                style={{ color: "#111827" }}>
                {calYear}년 {calMonth + 1}월
              </span>
              <button
                onClick={() => {
                  const d = new Date(calYear, calMonth + 1);
                  setCalYear(d.getFullYear());
                  setCalMonth(d.getMonth());
                  setSelectedDay(null);
                }}
                className="px-3 py-2 rounded-lg text-lg font-bold"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#111827",
                  border: "1px solid #e5e7eb",
                }}>
                ›
              </button>
              {isAdmin ? (
                <TechFilterSelect
                  value={calTechFilter}
                  onChange={setCalTechFilter}
                />
              ) : (
                <span
                  className="text-xs font-bold px-3 py-2 rounded-xl"
                  style={{
                    backgroundColor: TECH_COLOR[loggedUser!] + "22",
                    color: TECH_COLOR[loggedUser!],
                    border: `1px solid ${TECH_COLOR[loggedUser!]}44`,
                  }}>
                  {loggedUser}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mb-3 px-1">
              {TECHS.map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: TECH_COLOR[t] }}
                  />
                  <span
                    className="text-xs font-medium"
                    style={{ color: TECH_COLOR[t] }}>
                    {t}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: "#94a3b8" }}
                />
                <span
                  className="text-xs font-medium"
                  style={{ color: "#64748b" }}>
                  미배정
                </span>
              </div>
            </div>
            <div className="grid grid-cols-7 mb-1">
              {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
                <div
                  key={d}
                  className="text-center text-xs py-2 font-bold"
                  style={{
                    color:
                      i === 0 ? "#ef6666" : i === 6 ? "#60a5fa" : "#6b7280",
                  }}>
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0">
              {calDays.map((day, i) => {
                if (!day) return <div key={`e-${i}`} />;
                const dateStr = `${calYear}-${pad(calMonth + 1)}-${pad(day)}`;
                const allDayJobs = jobsByDate[dateStr] ?? [];
                const dayJobs =
                  calTechFilter === "전체"
                    ? allDayJobs
                    : allDayJobs.filter((j) => j.tech === calTechFilter);
                const isToday = dateStr === todayStr;
                const isSelected = dateStr === selectedDay;
                const dow = i % 7;
                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDay(isSelected ? null : dateStr)}
                    className="rounded-xl p-1.5 min-h-[72px] flex flex-col items-start text-left"
                    style={{
                      backgroundColor: isSelected ? "#eaf1ff" : "#ffffff",
                      border: isSelected
                        ? "1px solid #1f66ff"
                        : isToday
                          ? "1px solid #a9c4ff"
                          : "1px solid #e5e7eb",
                    }}>
                    <span
                      className="text-xs font-bold mb-1 w-5 h-5 flex items-center justify-center rounded-full"
                      style={{
                        color: isToday
                          ? "#ffffff"
                          : dow === 0
                            ? "#ef6666"
                            : dow === 6
                              ? "#60a5fa"
                              : "#111827",
                        backgroundColor: isToday ? "#1f66ff" : "transparent",
                      }}>
                      {day}
                    </span>
                    <div className="flex flex-col gap-0.5 w-full">
                      {dayJobs.slice(0, 3).map((j) => (
                        <div
                          key={j.id}
                          className="flex flex-col overflow-hidden">
                          <div className="flex items-center gap-1">
                            <span
                              className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                              style={{
                                backgroundColor: TECH_COLOR[j.tech || ""],
                              }}
                            />
                            <span
                              className="truncate font-semibold"
                              style={{ color: "#111827", fontSize: 10 }}>
                              {j.name}
                              {j.symptom ? ` · ${j.symptom}` : ""}
                            </span>
                          </div>
                          {j.visit_time && (
                            <span
                              className="pl-3"
                              style={{ color: "#64748b", fontSize: 9 }}>
                              {formatTime(j.visit_time)}
                            </span>
                          )}
                        </div>
                      ))}
                      {dayJobs.length > 3 && (
                        <span style={{ color: "#64748b", fontSize: 10 }}>
                          +{dayJobs.length - 3}건
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedDay && (
              <div
                className="mt-4 rounded-2xl overflow-hidden"
                style={{ border: "1px solid #f3f4f6" }}>
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{
                    backgroundColor: "#ffffff",
                    borderBottom: "1px solid #f3f4f6",
                  }}>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm font-bold"
                      style={{ color: "#111827" }}>
                      {formatDate(selectedDay)}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: "#f3f4f6", color: "#475569" }}>
                      {selectedJobs.length}건
                    </span>
                    {calTechFilter !== "전체" && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{
                          backgroundColor: TECH_COLOR[calTechFilter] + "22",
                          color: TECH_COLOR[calTechFilter],
                        }}>
                        {calTechFilter}
                      </span>
                    )}
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setForm({ ...emptyForm(), visit_date: selectedDay });
                        setEditId(null);
                        setShowForm(true);
                      }}
                      className="text-[20px] border-2 border-transparent rounded-xl px-3 py-2 bg-gradient-to-r from-[#1f66ff] to-[#4f8fff] font-bold"
                      style={{ color: "white" }}>
                      + 추가
                    </button>
                  )}
                </div>
                {selectedJobs.length === 0 ? (
                  <div
                    className="text-center py-10"
                    style={{ backgroundColor: "#f5f7fb", color: "#94a3b8" }}>
                    <p className="text-2xl mb-2">📋</p>
                    <p className="text-sm">일정 없음</p>
                  </div>
                ) : (
                  <div
                    className="flex flex-col gap-0"
                    style={{ backgroundColor: "#f5f7fb" }}>
                    {[...selectedJobs]
                      .sort((a, b) => {
                        if (!a.visit_time && !b.visit_time) return 0;
                        if (!a.visit_time) return 1;
                        if (!b.visit_time) return -1;
                        return a.visit_time.localeCompare(b.visit_time);
                      })
                      .map((job, idx, arr) => (
                        <div key={job.id}>
                          {job.visit_time &&
                            (idx === 0 ||
                              !arr[idx - 1].visit_time ||
                              arr[idx - 1].visit_time?.slice(0, 2) !==
                                job.visit_time.slice(0, 2)) && (
                              <div
                                className="flex items-center gap-2 px-4 py-2"
                                style={{ borderBottom: "1px solid #ffffff" }}>
                                <span
                                  className="text-xs font-bold"
                                  style={{ color: "#94a3b8" }}>
                                  {formatTime(job.visit_time)}
                                </span>
                                <div
                                  className="flex-1 h-px"
                                  style={{ backgroundColor: "#ffffff" }}
                                />
                              </div>
                            )}
                          {!job.visit_time && idx === 0 && (
                            <div
                              className="px-4 py-2"
                              style={{ borderBottom: "1px solid #ffffff" }}>
                              <span
                                className="text-xs font-bold"
                                style={{ color: "#94a3b8" }}>
                                시간 미정
                              </span>
                            </div>
                          )}
                          {!job.visit_time &&
                            idx > 0 &&
                            arr[idx - 1].visit_time && (
                              <div
                                className="px-4 py-2"
                                style={{ borderBottom: "1px solid #ffffff" }}>
                                <span
                                  className="text-xs font-bold"
                                  style={{ color: "#94a3b8" }}>
                                  시간 미정
                                </span>
                              </div>
                            )}
                          <div className="px-3 py-2">
                            <JobCard
                              job={job}
                              onUpdate={update}
                              onEdit={startEdit}
                              onDelete={remove}
                              isAdmin={isAdmin}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!loading &&
          tab === "통계" &&
          (() => {
            const statDone = isAdmin
              ? doneMonth
              : doneMonth.filter((j) => j.tech === loggedUser);
            const statRevenue = statDone.reduce(
              (s, j) => s + (j.price || 0),
              0,
            );
            const statReviewPending = isAdmin
              ? reviewPending
              : reviewPending.filter((j) => j.tech === loggedUser);
            const myColor = TECH_COLOR[loggedUser!] || "#1f66ff";
            return (
              <div className="flex flex-col gap-4">
                <MonthSelector />
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="rounded-2xl p-5"
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                    }}>
                    <p
                      className="text-xs mb-2 font-medium"
                      style={{ color: "#6b7280" }}>
                      {formatYearMonth(monthFilter)} {isAdmin ? "전체" : "내"}{" "}
                      매출
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: isAdmin ? "#1f66ff" : myColor }}>
                      {formatPrice(statRevenue)}
                    </p>
                  </div>
                  <div
                    className="rounded-2xl p-5"
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                    }}>
                    <p
                      className="text-xs mb-2 font-medium"
                      style={{ color: "#6b7280" }}>
                      {formatYearMonth(monthFilter)} {isAdmin ? "전체" : "내"}{" "}
                      완료
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: isAdmin ? "#1f66ff" : myColor }}>
                      {statDone.length}
                      <span
                        className="text-base ml-1"
                        style={{ color: "#6b7280" }}>
                        건
                      </span>
                    </p>
                  </div>
                </div>
                {(isAdmin ? TECHS : [loggedUser as Tech]).map((tech) => {
                  const techJobs = doneMonth.filter((j) => j.tech === tech);
                  const techRevenue = techJobs.reduce(
                    (s, j) => s + (j.price || 0),
                    0,
                  );
                  const color = TECH_COLOR[tech];
                  return (
                    <div
                      key={tech}
                      className="rounded-2xl p-5"
                      style={{
                        backgroundColor: "#ffffff",
                        border: `1px solid ${color}33`,
                      }}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold" style={{ color }}>
                          {tech === loggedUser ? "👤 " : ""}
                          {tech} 기사님
                        </span>
                        <span
                          className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{ backgroundColor: color + "22", color }}>
                          {techJobs.length}건
                        </span>
                      </div>
                      <div className="text-xl font-bold mb-3" style={{ color }}>
                        {formatPrice(techRevenue)}
                      </div>
                      {isAdmin && (
                        <div
                          className="h-2 rounded-full overflow-hidden"
                          style={{ backgroundColor: "#f3f4f6" }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${revenue > 0 ? (techRevenue / revenue) * 100 : 0}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
                <div
                  className="rounded-2xl p-5"
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                  }}>
                  <p
                    className="text-sm font-bold mb-3 flex items-center gap-2"
                    style={{ color: "white" }}>
                    📝 리뷰 요청 안 한 건
                    {statReviewPending.length > 0 && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{ backgroundColor: "#ef4444", color: "white" }}>
                        {statReviewPending.length}건
                      </span>
                    )}
                  </p>
                  {statReviewPending.length === 0 ? (
                    <p className="text-sm" style={{ color: "#64748b" }}>
                      모두 요청 완료! 👍
                    </p>
                  ) : (
                    statReviewPending.map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between py-3"
                        style={{ borderBottom: "1px solid #232323" }}>
                        <div>
                          <span
                            className="text-sm font-medium"
                            style={{ color: "#111827" }}>
                            {job.name}
                          </span>
                          <span
                            className="text-xs ml-2"
                            style={{ color: "#64748b" }}>
                            {job.region} · {formatDate(job.visit_date)}
                          </span>
                        </div>
                        <a
                          href={`sms:${job.phone}?&body=${reviewSms(job)}`}
                          onClick={() =>
                            update(job.id, { review_requested: true })
                          }
                          className="text-xs px-3 py-1.5 rounded-full font-semibold"
                          style={{
                            backgroundColor: "#03C75A22",
                            color: "#03C75A",
                            border: "1px solid #03C75A44",
                          }}>
                          문자 보내기
                        </a>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })()}

        {!loading && tab === "오늘" && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => {
                  const d = new Date(dateFilter);
                  d.setDate(d.getDate() - 1);
                  setDateFilter(d.toISOString().slice(0, 10));
                }}
                className="px-3 py-2 rounded-lg text-lg font-bold"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#111827",
                  border: "1px solid #e5e7eb",
                }}>
                ‹
              </button>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="flex-1 text-center text-sm font-bold rounded-xl py-2"
                style={{
                  backgroundColor: "#ffffff",
                  color: "white",
                  border: "1px solid #e5e7eb",
                  outline: "none",
                }}
              />
              <button
                onClick={() => {
                  const d = new Date(dateFilter);
                  d.setDate(d.getDate() + 1);
                  setDateFilter(d.toISOString().slice(0, 10));
                }}
                className="px-3 py-2 rounded-lg text-lg font-bold"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#111827",
                  border: "1px solid #e5e7eb",
                }}>
                ›
              </button>
              {isAdmin ? (
                <TechFilterSelect value={techFilter} onChange={setTechFilter} />
              ) : (
                <span
                  className="text-xs font-bold px-3 py-2 rounded-xl"
                  style={{
                    backgroundColor: TECH_COLOR[loggedUser!] + "22",
                    color: TECH_COLOR[loggedUser!],
                    border: `1px solid ${TECH_COLOR[loggedUser!]}44`,
                  }}>
                  {loggedUser}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1 mb-4">
              {(["전체", ...STATUSES] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s as Status | "전체")}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold"
                  style={{
                    backgroundColor: statusFilter === s ? "#1f66ff" : "#ffffff",
                    color: statusFilter === s ? "white" : "#6b7280",
                    border: "1px solid #e5e7eb",
                  }}>
                  {s}
                </button>
              ))}
            </div>
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid #f3f4f6" }}>
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{
                  backgroundColor: "#ffffff",
                  borderBottom: "1px solid #f3f4f6",
                }}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-sm font-bold"
                    style={{ color: "white" }}>
                    {formatDate(dateFilter)} 일정
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: "#f3f4f6", color: "#475569" }}>
                    {filtered.length}건
                  </span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: "#1f66ff" }}>
                    완료 {filtered.filter((j) => j.status === "완료").length}건
                    ·{" "}
                    {formatPrice(
                      filtered
                        .filter(
                          (j) =>
                            j.status === "완료" &&
                            (!j.is_measurement || j.install_completed),
                        )
                        .reduce((s, j) => s + (j.price || 0), 0),
                    )}
                  </span>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => {
                      setForm({ ...emptyForm(), visit_date: dateFilter });
                      setEditId(null);
                      setShowForm(true);
                    }}
                    className="text-xs border-2 border-transparent rounded-xl px-3 py-2 bg-gradient-to-r from-[#1f66ff] to-[#4f8fff] font-bold"
                    style={{
                      background: "linear-gradient(to right, #1f66ff, #4f8fff)",
                      color: "white",
                    }}>
                    + 추가
                  </button>
                )}
              </div>
              {filtered.length === 0 ? (
                <div
                  className="text-center py-12"
                  style={{ backgroundColor: "#f5f7fb", color: "#94a3b8" }}>
                  <p className="text-3xl mb-2">📋</p>
                  <p className="text-sm">일정 없음</p>
                </div>
              ) : (
                <div
                  className="flex flex-col gap-0"
                  style={{ backgroundColor: "#f5f7fb" }}>
                  {[...filtered]
                    .sort((a, b) => {
                      if (!a.visit_time && !b.visit_time) return 0;
                      if (!a.visit_time) return 1;
                      if (!b.visit_time) return -1;
                      return a.visit_time.localeCompare(b.visit_time);
                    })
                    .map((job, idx, arr) => (
                      <div key={job.id}>
                        {job.visit_time &&
                          (idx === 0 ||
                            arr[idx - 1].visit_time?.slice(0, 2) !==
                              job.visit_time.slice(0, 2)) && (
                            <div
                              className="flex items-center gap-2 px-4 py-2"
                              style={{ borderBottom: "1px solid #ffffff" }}>
                              <span
                                className="text-xs font-bold"
                                style={{ color: "#94a3b8" }}>
                                {formatTime(job.visit_time)}
                              </span>
                              <div
                                className="flex-1 h-px"
                                style={{ backgroundColor: "#ffffff" }}
                              />
                            </div>
                          )}
                        {!job.visit_time &&
                          (idx === 0 || arr[idx - 1].visit_time) && (
                            <div
                              className="px-4 py-2"
                              style={{ borderBottom: "1px solid #ffffff" }}>
                              <span
                                className="text-xs font-bold"
                                style={{ color: "#94a3b8" }}>
                                시간 미정
                              </span>
                            </div>
                          )}
                        <div className="px-3 py-2">
                          <JobCard
                            job={job}
                            onUpdate={update}
                            onEdit={startEdit}
                            onDelete={remove}
                            isAdmin={isAdmin}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && tab === "전체" && (
          <>
            <MonthSelector />
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="flex flex-wrap gap-1">
                {(["전체", ...STATUSES] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s as Status | "전체")}
                    className="rounded-full px-3 py-1.5 text-xs font-semibold"
                    style={{
                      backgroundColor:
                        statusFilter === s ? "#1f66ff" : "#ffffff",
                      color: statusFilter === s ? "white" : "#6b7280",
                      border: "1px solid #e5e7eb",
                    }}>
                    {s}
                  </button>
                ))}
              </div>
              {isAdmin ? (
                <TechFilterSelect value={techFilter} onChange={setTechFilter} />
              ) : (
                <span
                  className="text-xs font-bold px-3 py-2 rounded-xl"
                  style={{
                    backgroundColor: TECH_COLOR[loggedUser!] + "22",
                    color: TECH_COLOR[loggedUser!],
                    border: `1px solid ${TECH_COLOR[loggedUser!]}44`,
                  }}>
                  {loggedUser}
                </span>
              )}
            </div>
            <div
              className="flex gap-3 mb-4 text-xs font-medium"
              style={{ color: "#64748b" }}>
              <span>{filtered.length}건</span>
              <span>·</span>
              <span style={{ color: "#1f66ff" }}>
                완료 {filtered.filter((j) => j.status === "완료").length}건
              </span>
              <span>·</span>
              <span>
                {formatPrice(
                  filtered
                    .filter(
                      (j) =>
                        j.status === "완료" &&
                        (!j.is_measurement || j.install_completed),
                    )
                    .reduce((s, j) => s + (j.price || 0), 0),
                )}
              </span>
            </div>
            {filtered.length === 0 ? (
              <div className="text-center py-16" style={{ color: "#94a3b8" }}>
                <p className="text-4xl mb-3">📋</p>
                <p className="text-sm">접수된 작업이 없어요</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {filtered.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onUpdate={update}
                    onEdit={startEdit}
                    onDelete={remove}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.88)" }}>
          <div
            className="w-full max-w-md rounded-2xl p-5 flex flex-col gap-3"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #dbe3f0",
              maxHeight: "90vh",
              overflowY: "auto",
            }}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold" style={{ color: "white" }}>
                {editId ? "수정" : "새 접수"}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                }}
                style={{ color: "#64748b", fontSize: 20 }}>
                ✕
              </button>
            </div>
            {(
              [
                { label: "이름 *", key: "name", placeholder: "홍길동" },
                { label: "연락처", key: "phone", placeholder: "010-0000-0000" },
                {
                  label: "지역 *",
                  key: "region",
                  placeholder: "인천 서구 ○○동",
                },
                {
                  label: "증상 *",
                  key: "symptom",
                  placeholder: "싱크대 상부장 처짐",
                },
              ] as const
            ).map((f) => (
              <label key={f.key} className="flex flex-col gap-1.5">
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#6b7280" }}>
                  {f.label}
                </span>
                <input
                  value={form[f.key]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [f.key]: e.target.value }))
                  }
                  placeholder={f.placeholder}
                  style={inputStyle}
                />
              </label>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#6b7280" }}>
                  방문일
                </span>
                <input
                  type="date"
                  value={form.visit_date}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, visit_date: e.target.value }))
                  }
                  style={inputStyle}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#6b7280" }}>
                  도착 시간
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="time"
                    value={form.visit_time}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, visit_time: e.target.value }))
                    }
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        visit_time: adjTime(p.visit_time, -30),
                      }))
                    }
                    className="rounded-xl px-2 py-2 text-sm font-bold flex-shrink-0"
                    style={{
                      backgroundColor: "#f8fafc",
                      color: "#64748b",
                      border: "1px solid #dbe3f0",
                    }}>
                    －
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        visit_time: adjTime(p.visit_time, 30),
                      }))
                    }
                    className="rounded-xl px-2 py-2 text-sm font-bold flex-shrink-0"
                    style={{
                      backgroundColor: "#f8fafc",
                      color: "#64748b",
                      border: "1px solid #dbe3f0",
                    }}>
                    ＋
                  </button>
                </div>
              </label>
            </div>
            <label className="flex flex-col gap-1.5">
              <span
                className="text-xs font-semibold"
                style={{ color: "#6b7280" }}>
                금액 (원)
              </span>
              <input
                type="number"
                value={form.price || ""}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    price: parseInt(e.target.value) || 0,
                  }))
                }
                placeholder="150000"
                style={inputStyle}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#6b7280" }}>
                  기사
                </span>
                <select
                  value={form.tech}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, tech: e.target.value as Tech }))
                  }
                  style={inputStyle}>
                  <option value="">미배정</option>
                  {TECHS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#6b7280" }}>
                  상태
                </span>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, status: e.target.value as Status }))
                  }
                  style={inputStyle}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="flex flex-col gap-1.5">
              <span
                className="text-xs font-semibold"
                style={{ color: "#6b7280" }}>
                🛡 AS 만료일
                <span className="ml-1 font-normal" style={{ color: "#94a3b8" }}>
                  (기본 1년)
                </span>
              </span>
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  value={form.as_until || ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, as_until: e.target.value }))
                  }
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setForm((p) => ({
                      ...p,
                      as_until: addOneYear(p.visit_date || today()),
                    }))
                  }
                  className="rounded-xl px-3 py-2 text-xs font-bold flex-shrink-0"
                  style={{
                    backgroundColor: "#f8fafc",
                    color: "#64748b",
                    border: "1px solid #dbe3f0",
                  }}>
                  1년
                </button>
              </div>
            </label>

            <button
              type="button"
              onClick={() =>
                setForm((p) => ({
                  ...p,
                  is_measurement: !p.is_measurement,
                  install_date: null,
                  install_time: null,
                  install_completed: false,
                }))
              }
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{
                backgroundColor: form.is_measurement ? "#a855f718" : "#ffffff",
                border: `1px solid ${form.is_measurement ? "#a855f755" : "#dbe3f0"}`,
              }}>
              <div className="flex items-center gap-2.5">
                <span className="text-base">📐</span>
                <div className="text-left">
                  <p
                    className="text-sm font-bold"
                    style={{
                      color: form.is_measurement ? "#a855f7" : "#334155",
                    }}>
                    실측 방문
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
                    체크 시 완료해도 매출에 포함 안 됨
                  </p>
                </div>
              </div>
              <div
                className="rounded-full flex-shrink-0"
                style={{
                  width: 44,
                  height: 24,
                  backgroundColor: form.is_measurement ? "#a855f7" : "#dbe3f0",
                  position: "relative",
                }}>
                <div
                  style={{
                    position: "absolute",
                    top: 3,
                    left: form.is_measurement ? 23 : 3,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    backgroundColor: "white",
                    transition: "left 0.2s",
                  }}
                />
              </div>
            </button>

            {form.is_measurement && (
              <div
                className="rounded-xl p-4 flex flex-col gap-3"
                style={{
                  backgroundColor: "#0d2018",
                  border: "1px solid #bfd3ff",
                }}>
                <p className="text-xs font-bold" style={{ color: "#1f66ff" }}>
                  🔨 시공 날짜 · 시간{" "}
                  <span className="font-normal" style={{ color: "#94a3b8" }}>
                    (미정이면 비워두세요)
                  </span>
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1.5">
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "#2fae8a88" }}>
                      시공 날짜
                    </span>
                    <input
                      type="date"
                      value={form.install_date || ""}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          install_date: e.target.value || null,
                        }))
                      }
                      style={inputStyle}
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "#2fae8a88" }}>
                      시공 시간
                    </span>
                    <div className="flex items-center gap-1">
                      <input
                        type="time"
                        value={form.install_time || ""}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            install_time: e.target.value || null,
                          }))
                        }
                        style={{ ...inputStyle, flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setForm((p) => ({
                            ...p,
                            install_time: adjTime(
                              p.install_time || "00:00",
                              -30,
                            ),
                          }))
                        }
                        className="rounded-xl px-2 py-2 text-sm font-bold flex-shrink-0"
                        style={{
                          backgroundColor: "#f8fafc",
                          color: "#64748b",
                          border: "1px solid #dbe3f0",
                        }}>
                        －
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((p) => ({
                            ...p,
                            install_time: adjTime(
                              p.install_time || "00:00",
                              30,
                            ),
                          }))
                        }
                        className="rounded-xl px-2 py-2 text-sm font-bold flex-shrink-0"
                        style={{
                          backgroundColor: "#f8fafc",
                          color: "#64748b",
                          border: "1px solid #dbe3f0",
                        }}>
                        ＋
                      </button>
                    </div>
                  </label>
                </div>
                {form.install_date && (
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        install_date: null,
                        install_time: null,
                      }))
                    }
                    className="text-xs font-bold py-2 rounded-xl"
                    style={{
                      backgroundColor: "#ef444418",
                      color: "#ef4444",
                      border: "1px solid #ef444430",
                    }}>
                    시공 날짜 초기화
                  </button>
                )}
              </div>
            )}

            <label className="flex flex-col gap-1.5">
              <span
                className="text-xs font-semibold"
                style={{ color: "#f59e0b" }}>
                📷 접수 사진{" "}
                <span className="font-normal" style={{ color: "#94a3b8" }}>
                  (고장 상태)
                </span>
              </span>
              <div className="flex flex-col gap-2">
                {(() => {
                  const intakeList: string[] = form.intake_photos
                    ? (() => {
                        try {
                          return JSON.parse(form.intake_photos);
                        } catch {
                          return [];
                        }
                      })()
                    : [];
                  return intakeList.length > 0 ? (
                    <div className="flex gap-2 flex-wrap">
                      {intakeList.map((url, idx) => (
                        <div key={url} className="relative">
                          <img
                            src={url}
                            alt={`접수 ${idx + 1}`}
                            className="rounded-xl"
                            style={{
                              height: 172,
                              width: 172,
                              objectFit: "cover",
                              border: "1px solid #f59e0b44",
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const next = intakeList.filter(
                                (_, i) => i !== idx,
                              );
                              setForm((p) => ({
                                ...p,
                                intake_photos: next.length
                                  ? JSON.stringify(next)
                                  : "",
                              }));
                            }}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{
                              backgroundColor: "#ef4444",
                              color: "white",
                            }}>
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null;
                })()}
                <label
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 cursor-pointer"
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px dashed #f59e0b55",
                    color: "#f59e0b",
                  }}>
                  <span className="text-sm">📷</span>
                  <span className="text-xs font-semibold">
                    사진 추가 (갤러리 / 카메라)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      if (!files.length) return;
                      const existing: string[] = form.intake_photos
                        ? (() => {
                            try {
                              return JSON.parse(form.intake_photos);
                            } catch {
                              return [];
                            }
                          })()
                        : [];
                      const newUrls: string[] = [];
                      for (const file of files) {
                        const compressed = await compressImage(file);
                        const path = `intake-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
                        const { error } = await getSupabase()
                          .storage.from("completion-photos")
                          .upload(path, compressed, {
                            upsert: true,
                            contentType: "image/jpeg",
                          });
                        if (error) {
                          alert("업로드 실패: " + error.message);
                          continue;
                        }
                        const { data } = getSupabase()
                          .storage.from("completion-photos")
                          .getPublicUrl(path);
                        newUrls.push(data.publicUrl);
                      }
                      const all = [...existing, ...newUrls];
                      setForm((p) => ({
                        ...p,
                        intake_photos: all.length ? JSON.stringify(all) : "",
                      }));
                    }}
                  />
                </label>
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span
                className="text-xs font-semibold"
                style={{ color: "#6b7280" }}>
                메모
              </span>
              <textarea
                value={form.memo}
                onChange={(e) =>
                  setForm((p) => ({ ...p, memo: e.target.value }))
                }
                placeholder="특이사항, 요청사항..."
                rows={2}
                style={{ ...inputStyle, resize: "none" }}
              />
            </label>
            <button
              onClick={save}
              disabled={saving}
              className="mt-1 rounded-xl py-3.5 text-sm font-bold text-white"
              style={{ backgroundColor: "#1f66ff", opacity: saving ? 0.7 : 1 }}>
              {saving ? "저장 중..." : editId ? "수정 완료" : "접수 저장"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
