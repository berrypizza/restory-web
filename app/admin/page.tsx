"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

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
  고관호: "#2fae8a",
  고현호: "#60a5fa",
  이주형: "#f59e0b",
  강영훈: "#f472b6",
  "": "#666",
};

const STATUS_STYLE: Record<
  Status,
  { bg: string; color: string; border: string }
> = {
  대기: { bg: "#2a2a2a", color: "#999", border: "#3a3a3a" },
  배정: { bg: "#2fae8a22", color: "#2fae8a", border: "#2fae8a55" },
  완료: { bg: "#1a3a2a", color: "#4ade80", border: "#2fae8a44" },
  취소: { bg: "#3a202022", color: "#ef4444", border: "#ef444433" },
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
    const img = new Image();
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
        style={{ backgroundColor: "rgba(0,0,0,0.92)" }}>
        <div
          className="w-full max-w-sm rounded-2xl overflow-hidden flex flex-col"
          style={{
            backgroundColor: "#1e1e1e",
            border: "1px solid #333",
            maxHeight: "88vh",
          }}>
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ borderBottom: "1px solid #2a2a2a" }}>
            <div>
              <span className="text-sm font-bold" style={{ color: "white" }}>
                완료 사진
              </span>
              <span className="text-xs ml-2" style={{ color: "#666" }}>
                {list.length}장
              </span>
            </div>
            <button onClick={onCancel} style={{ color: "#666", fontSize: 18 }}>
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {list.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <p className="text-3xl">📷</p>
                <p className="text-sm" style={{ color: "#666" }}>
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
                    style={{ aspectRatio: "1", border: "1px solid #2a2a2a" }}>
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
                        style={{ backgroundColor: "#ffffff18", color: "#ddd" }}>
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
            style={{ borderTop: "1px solid #2a2a2a" }}>
            <label
              className="flex-1 rounded-xl py-2.5 text-xs font-bold text-center cursor-pointer"
              style={{ backgroundColor: "#2a2a2a", color: "#bbb" }}>
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
              style={{ backgroundColor: "#2a2a2a", color: "#bbb" }}>
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
                backgroundColor: "#2fae8a",
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
          style={{ backgroundColor: "rgba(0,0,0,0.97)" }}
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
          style={{ backgroundColor: "rgba(0,0,0,0.85)" }}>
          <style>{`@keyframes confetti-fall { 0% { transform: translateY(-20px) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } } @keyframes pop-in { 0% { transform: scale(0.3); opacity: 0; } 60% { transform: scale(1.15); opacity: 1; } 100% { transform: scale(1); opacity: 1; } } @keyframes fade-up { 0% { transform: translateY(16px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } } .confetti-piece { position: fixed; width: 10px; height: 10px; animation: confetti-fall linear forwards; }`}</style>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece rounded-sm"
              style={{
                left: `${5 + ((i * 4.5) % 95)}%`,
                top: `-10px`,
                backgroundColor: [
                  "#2fae8a",
                  "#60a5fa",
                  "#f59e0b",
                  "#f472b6",
                  "#a78bfa",
                  "#34d399",
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
                backgroundColor: "#00ffa2",
                boxShadow: "0 0 60px #00ffa288",
              }}>
              <span style={{ fontSize: 56, color: "#023120" }}>✓</span>
            </div>
          </div>
          <div style={{ animation: "fade-up 0.4s ease-out 0.3s both" }}>
            <p className="text-3xl font-black text-white mb-2">
              🎉 수고했어요! 🎉
            </p>
            <p
              className="text-xl font-semibold text-center mb-1"
              style={{ color: "#e4e4e4" }}>
              {job.name}님 완료
            </p>
            <p className="text-sm text-center" style={{ color: "#aaa" }}>
              당신이 있어서 리스토리입니다
            </p>
            <p
              className="text-base text-center mt-1 font-medium"
              style={{ color: "#00ffa2" }}>
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
              style={{ backgroundColor: "rgba(0,0,0,0.97)" }}
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
                    color: "#bbb",
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
                        backgroundColor: i === currentIdx ? "#2fae8a" : "#444",
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
          backgroundColor: "#1c1c1c",
          border: "1px solid #2e2e2e",
          borderLeft: `4px solid ${techColor}`,
        }}>
        <div
          className="flex items-center gap-2 px-3 pt-3 pb-2 flex-wrap"
          style={{ borderBottom: "1px solid #252525" }}>
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
          <span className="text-xs font-medium" style={{ color: "#bbb" }}>
            {formatFullDate(job.visit_date)}
          </span>
          {job.visit_time && (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "#252525", color: "#e5e5e5" }}>
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
                backgroundColor: "#2fae8a22",
                color: "#2fae8a",
                border: "1px solid #2fae8a44",
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

        <div className="flex items-start gap-3 px-3 py-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-base font-bold" style={{ color: "white" }}>
                {job.name || "?"}
              </span>
              {job.phone && (
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "#ef444418",
                      color: "#ef9494",
                      border: "1px solid #ef444430",
                    }}>
                    {job.phone}
                  </span>
                  <a
                    href={`tel:${job.phone}`}
                    className="flex items-center justify-center rounded-xl font-bold"
                    style={{
                      width: 36,
                      height: 36,
                      backgroundColor: "#ef4444",
                      color: "white",
                      fontSize: 18,
                      textDecoration: "none",
                      flexShrink: 0,
                    }}>
                    📞
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
                  className="text-xs font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                  style={{
                    backgroundColor: "#1a4a3a",
                    color: "#4ade80",
                    border: "1px solid #2fae8a44",
                    textDecoration: "none",
                  }}>
                  <span style={{ fontSize: 10 }}>📍</span>
                  {job.region}
                </a>
              )}
              {job.symptom && (
                <span className="text-xs" style={{ color: "#aaa" }}>
                  {job.symptom}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {job.price > 0 && (
                <span
                  className="text-sm font-bold"
                  style={{ color: "#2fae8a" }}>
                  {formatPrice(job.price)}
                </span>
              )}
            </div>

            {job.memo && (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setMemoOpen((v) => !v)}
                  className="w-full flex items-center justify-between rounded-xl px-3 py-3 text-left"
                  style={{
                    backgroundColor: memoOpen ? "#1e2a1e" : "#1c2a1c",
                    border: `1px solid ${memoOpen ? "#2fae8a66" : "#2fae8a44"}`,
                    boxShadow: memoOpen ? "none" : "0 0 0 1px #2fae8a22",
                  }}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span style={{ fontSize: 15, flexShrink: 0 }}>💬</span>
                    <div className="min-w-0">
                      <p
                        className="text-xs font-black mb-0.5"
                        style={{ color: "#2fae8a" }}>
                        메모 보기
                      </p>
                      <p className="text-xs truncate" style={{ color: "#888" }}>
                        {job.memo}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    {!memoOpen && (
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full animate-pulse"
                        style={{
                          backgroundColor: "#2fae8a22",
                          color: "#2fae8a",
                          border: "1px solid #2fae8a44",
                        }}>
                        탭
                      </span>
                    )}
                    <span
                      style={{
                        color: "#2fae8a",
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
                    className="rounded-b-xl px-4 py-3 -mt-0.5"
                    style={{
                      backgroundColor: "#162116",
                      border: "1px solid #2fae8a44",
                      borderTop: "none",
                    }}>
                    <p
                      className="text-sm leading-relaxed whitespace-pre-wrap"
                      style={{ color: "#ddd" }}>
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
                        ? "#3a202022"
                        : daysLeft <= 30
                          ? "#f59e0b18"
                          : "#2fae8a12",
                      border: `1px solid ${expired ? "#ef444433" : daysLeft <= 30 ? "#f59e0b33" : "#2fae8a33"}`,
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
                            : "#2fae8a",
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
                      className="text-xs font-bold mb-1.5 inline-block"
                      style={{ color: "#f59e0b" }}>
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
                                  height: 64,
                                  width: 64,
                                  objectFit: "cover",
                                  border: "1px solid #f59e0b44",
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
                      style={{ color: "#2fae8a" }}>
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
                              border: "1px solid #2fae8a44",
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
                  backgroundColor: "#2a2a2a",
                  color: "#ccc",
                  border: "1px solid #3a3a3a",
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
          style={{ borderTop: "1px solid #252525", paddingTop: 10 }}>
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
                  style={{ backgroundColor: "#2fae8a" }}>
                  🔨 시공 완료
                </button>
              )}
              {job.install_completed && (
                <span
                  className="rounded-xl px-3 py-2.5 text-xs font-bold flex items-center flex-shrink-0"
                  style={{
                    backgroundColor: "#2fae8a18",
                    color: "#2fae8a",
                    border: "1px solid #2fae8a33",
                  }}>
                  ✓ 시공완료
                </span>
              )}
            </div>
          ) : job.status !== "완료" ? (
            <button
              onClick={handleComplete}
              className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white"
              style={{ backgroundColor: "#2fae8a" }}>
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
                backgroundColor: photos.length > 0 ? "#2fae8a22" : "#252525",
                color: photos.length > 0 ? "#2fae8a" : "#aaa",
                border: `1px solid ${photos.length > 0 ? "#2fae8a44" : "#333"}`,
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

const ADMIN_NAME = "고관호";

export default function AdminDashboard() {
  const [loggedUser, setLoggedUser] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<Tech | "">("");
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

  const isAdmin = loggedUser === ADMIN_NAME;

  useEffect(() => {
    try {
      const expiry = localStorage.getItem("restory_admin_expiry");
      const name = localStorage.getItem("restory_logged_name");
      if (expiry && Date.now() < parseInt(expiry) && name) {
        setLoggedUser(name);
        if (name !== ADMIN_NAME) {
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
    if (!selectedName) {
      setPwError(true);
      return;
    }
    const adminPw = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "su3024";
    const techPw = process.env.NEXT_PUBLIC_TECH_PASSWORD || "su2000";
    const isAdminLogin = selectedName === ADMIN_NAME && pwInput === adminPw;
    const isTechLogin = selectedName !== ADMIN_NAME && pwInput === techPw;
    if (isAdminLogin || isTechLogin) {
      try {
        localStorage.setItem(
          "restory_admin_expiry",
          String(Date.now() + 24 * 60 * 60 * 1000),
        );
        localStorage.setItem("restory_logged_name", selectedName);
      } catch {}
      setLoggedUser(selectedName);
      setPwError(false);
      if (selectedName !== ADMIN_NAME) {
        setTechFilter(selectedName as Tech);
        setCalTechFilter(selectedName as Tech);
      }
    } else {
      setPwError(true);
      setPwInput("");
    }
  };

  if (!loggedUser) {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-6"
        style={{ backgroundColor: "#111" }}>
        <div className="w-full max-w-xs flex flex-col items-center gap-6">
          <div className="text-center">
            <p className="text-3xl mb-2">🛠</p>
            <h1 className="text-xl font-black" style={{ color: "white" }}>
              리스토리 관리자
            </h1>
            <p className="text-sm mt-1" style={{ color: "#555" }}>
              이름을 선택하고 비밀번호를 입력하세요
            </p>
          </div>
          <div className="w-full flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ADMIN_NAME,
                  ...TECHS.filter((t) => t !== ADMIN_NAME),
                ] as string[]
              ).map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    setSelectedName(name as Tech);
                    setPwError(false);
                  }}
                  className="rounded-2xl py-3.5 text-sm font-bold transition-all"
                  style={{
                    backgroundColor:
                      selectedName === name
                        ? TECH_COLOR[name] || "#2fae8a"
                        : "#1c1c1c",
                    color: selectedName === name ? "white" : "#666",
                    border: `1px solid ${selectedName === name ? TECH_COLOR[name] || "#2fae8a" : "#2e2e2e"}`,
                  }}>
                  {name === ADMIN_NAME ? "🏅 " : ""}
                  {name}
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={pwInput}
                onChange={(e) => {
                  setPwInput(e.target.value);
                  setPwError(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder={
                  selectedName ? "비밀번호 입력" : "이름을 먼저 선택하세요"
                }
                disabled={!selectedName}
                className="w-full rounded-2xl px-4 py-3.5 text-base pr-12"
                style={{
                  backgroundColor: "#1c1c1c",
                  border: `1px solid ${pwError ? "#ef4444" : "#2e2e2e"}`,
                  color: "white",
                  outline: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  opacity: selectedName ? 1 : 0.5,
                }}
              />
              {selectedName && (
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base"
                  style={{ color: "#555" }}>
                  {showPw ? "🙈" : "👁"}
                </button>
              )}
            </div>
            {pwError && (
              <p
                className="text-sm text-center font-medium"
                style={{ color: "#ef4444" }}>
                {!selectedName
                  ? "이름을 선택해주세요"
                  : "비밀번호가 틀렸습니다"}
              </p>
            )}
            <button
              onClick={handleLogin}
              disabled={!selectedName}
              className="w-full rounded-2xl py-3.5 text-base font-bold text-white"
              style={{
                backgroundColor: selectedName
                  ? TECH_COLOR[selectedName] || "#2fae8a"
                  : "#333",
                opacity: selectedName ? 1 : 0.5,
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
    backgroundColor: "#1a1a1a",
    border: "1px solid #383838",
    color: "#e5e5e5",
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
      style={{ backgroundColor: "#1c1c1c", border: "1px solid #2e2e2e" }}>
      <button
        onClick={() => {
          const d = new Date(monthFilter + "-01");
          d.setMonth(d.getMonth() - 1);
          setMonthFilter(d.toISOString().slice(0, 7));
        }}
        className="px-4 py-2 rounded-lg text-xl font-bold"
        style={{ color: "#e5e5e5" }}>
        ‹
      </button>
      <span className="text-sm font-bold" style={{ color: "white" }}>
        {formatYearMonth(monthFilter)}
      </span>
      <button
        onClick={() => {
          const d = new Date(monthFilter + "-01");
          d.setMonth(d.getMonth() + 1);
          setMonthFilter(d.toISOString().slice(0, 7));
        }}
        className="px-4 py-2 rounded-lg text-xl font-bold"
        style={{ color: "#e5e5e5" }}>
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
          value !== "전체" ? TECH_COLOR[value] + "22" : "#1c1c1c",
        color: value !== "전체" ? TECH_COLOR[value] : "#bbb",
        border: `1px solid ${value !== "전체" ? TECH_COLOR[value] + "44" : "#2e2e2e"}`,
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
      className="min-h-screen px-3 py-5"
      style={{ backgroundColor: "#111", color: "#e5e5e5" }}>
      <div className="mx-auto max-w-3xl">
        <div
          className="flex items-center justify-between mb-6 pb-4"
          style={{ borderBottom: "1px solid #222" }}>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "white" }}>
              리스토리 관리
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="h-1.5 w-1.5 rounded-full inline-block"
                style={{ backgroundColor: TECH_COLOR[loggedUser] || "#2fae8a" }}
              />
              <span
                className="text-xs font-bold"
                style={{ color: TECH_COLOR[loggedUser] || "#2fae8a" }}>
                {isAdmin ? "🏅 " : ""}
                {loggedUser}
              </span>
              {isAdmin && (
                <span className="text-xs" style={{ color: "#555" }}>
                  · 전체 관리
                </span>
              )}
              {!isAdmin && (
                <span className="text-xs" style={{ color: "#555" }}>
                  · 내 일정만 표시
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => load()}
              className="rounded-xl px-3 py-2.5 text-sm font-bold"
              style={{
                backgroundColor: "#1c1c1c",
                color: "#888",
                border: "1px solid #2e2e2e",
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
                setSelectedName("");
              }}
              className="rounded-xl px-3 py-2.5 text-sm font-bold"
              style={{
                backgroundColor: "#1c1c1c",
                color: "#666",
                border: "1px solid #2e2e2e",
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
                className="rounded-xl px-5 py-2.5 text-sm font-bold text-white"
                style={{ backgroundColor: "#2fae8a" }}>
                + 접수
              </button>
            )}
          </div>
        </div>

        <div
          className="flex gap-1 mb-5 rounded-xl p-1"
          style={{ backgroundColor: "#1c1c1c", border: "1px solid #2a2a2a" }}>
          {(["달력", "오늘", "전체", "통계"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all"
              style={{
                backgroundColor: tab === t ? "#2fae8a" : "transparent",
                color: tab === t ? "white" : "#777",
              }}>
              {t}
              {t === "통계" && reviewPending.length > 0 && (
                <span
                  className="ml-1 text-xs px-1.5 py-0.5 rounded-full"
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
            style={{ color: "#555" }}>
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="이름 또는 전화번호로 검색"
            style={{
              width: "100%",
              backgroundColor: "#1a1a1a",
              border: `1px solid ${searchQuery ? "#2fae8a55" : "#2a2a2a"}`,
              borderRadius: 12,
              padding: "10px 36px 10px 38px",
              color: "white",
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
              style={{ backgroundColor: "#333", color: "#888" }}>
              ✕
            </button>
          )}
        </div>

        {searchQuery && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold" style={{ color: "#2fae8a" }}>
                검색 결과
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: "#2fae8a22", color: "#2fae8a" }}>
                {jobs.filter(matchSearch).length}건
              </span>
            </div>
            {jobs.filter(matchSearch).length === 0 ? (
              <div
                className="rounded-2xl py-10 text-center"
                style={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #222",
                }}>
                <p className="text-2xl mb-2">🔍</p>
                <p className="text-sm" style={{ color: "#555" }}>
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
          <div className="text-center py-20" style={{ color: "#555" }}>
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
                  backgroundColor: "#1c1c1c",
                  color: "#e5e5e5",
                  border: "1px solid #2e2e2e",
                }}>
                ‹
              </button>
              <span
                className="flex-1 text-center text-base font-bold"
                style={{ color: "white" }}>
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
                  backgroundColor: "#1c1c1c",
                  color: "#e5e5e5",
                  border: "1px solid #2e2e2e",
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
                  style={{ backgroundColor: "#555" }}
                />
                <span className="text-xs font-medium" style={{ color: "#666" }}>
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
                    color: i === 0 ? "#ef6666" : i === 6 ? "#60a5fa" : "#888",
                  }}>
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
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
                      backgroundColor: isSelected ? "#1a3a2e" : "#181818",
                      border: isSelected
                        ? "1px solid #2fae8a"
                        : isToday
                          ? "1px solid #2fae8a55"
                          : "1px solid #242424",
                    }}>
                    <span
                      className="text-xs font-bold mb-1 w-5 h-5 flex items-center justify-center rounded-full"
                      style={{
                        color:
                          dow === 0
                            ? "#ef6666"
                            : dow === 6
                              ? "#60a5fa"
                              : "#e5e5e5",
                        backgroundColor: isToday ? "#2fae8a" : "transparent",
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
                              style={{ color: "#e5e5e5", fontSize: 10 }}>
                              {j.name}
                              {j.symptom ? ` · ${j.symptom}` : ""}
                            </span>
                          </div>
                          {j.visit_time && (
                            <span
                              className="pl-3"
                              style={{ color: "#666", fontSize: 9 }}>
                              {formatTime(j.visit_time)}
                            </span>
                          )}
                        </div>
                      ))}
                      {dayJobs.length > 3 && (
                        <span style={{ color: "#666", fontSize: 10 }}>
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
                style={{ border: "1px solid #2a2a2a" }}>
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{
                    backgroundColor: "#1c1c1c",
                    borderBottom: "1px solid #2a2a2a",
                  }}>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm font-bold"
                      style={{ color: "white" }}>
                      {formatDate(selectedDay)}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: "#2a2a2a", color: "#bbb" }}>
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
                      className="text-xs px-3 py-1.5 rounded-lg font-bold"
                      style={{ backgroundColor: "#2fae8a", color: "white" }}>
                      + 추가
                    </button>
                  )}
                </div>
                {selectedJobs.length === 0 ? (
                  <div
                    className="text-center py-10"
                    style={{ backgroundColor: "#111", color: "#444" }}>
                    <p className="text-2xl mb-2">📋</p>
                    <p className="text-sm">일정 없음</p>
                  </div>
                ) : (
                  <div
                    className="flex flex-col gap-0"
                    style={{ backgroundColor: "#111" }}>
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
                                style={{ borderBottom: "1px solid #1e1e1e" }}>
                                <span
                                  className="text-xs font-bold"
                                  style={{ color: "#555" }}>
                                  {formatTime(job.visit_time)}
                                </span>
                                <div
                                  className="flex-1 h-px"
                                  style={{ backgroundColor: "#1e1e1e" }}
                                />
                              </div>
                            )}
                          {!job.visit_time && idx === 0 && (
                            <div
                              className="px-4 py-2"
                              style={{ borderBottom: "1px solid #1e1e1e" }}>
                              <span
                                className="text-xs font-bold"
                                style={{ color: "#555" }}>
                                시간 미정
                              </span>
                            </div>
                          )}
                          {!job.visit_time &&
                            idx > 0 &&
                            arr[idx - 1].visit_time && (
                              <div
                                className="px-4 py-2"
                                style={{ borderBottom: "1px solid #1e1e1e" }}>
                                <span
                                  className="text-xs font-bold"
                                  style={{ color: "#555" }}>
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
            const myColor = TECH_COLOR[loggedUser!] || "#2fae8a";
            return (
              <div className="flex flex-col gap-4">
                <MonthSelector />
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="rounded-2xl p-5"
                    style={{
                      backgroundColor: "#1c1c1c",
                      border: "1px solid #2e2e2e",
                    }}>
                    <p
                      className="text-xs mb-2 font-medium"
                      style={{ color: "#777" }}>
                      {formatYearMonth(monthFilter)} {isAdmin ? "전체" : "내"}{" "}
                      매출
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: isAdmin ? "white" : myColor }}>
                      {formatPrice(statRevenue)}
                    </p>
                  </div>
                  <div
                    className="rounded-2xl p-5"
                    style={{
                      backgroundColor: "#1c1c1c",
                      border: "1px solid #2e2e2e",
                    }}>
                    <p
                      className="text-xs mb-2 font-medium"
                      style={{ color: "#777" }}>
                      {formatYearMonth(monthFilter)} {isAdmin ? "전체" : "내"}{" "}
                      완료
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: isAdmin ? "white" : myColor }}>
                      {statDone.length}
                      <span
                        className="text-base ml-1"
                        style={{ color: "#888" }}>
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
                        backgroundColor: "#1c1c1c",
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
                          style={{ backgroundColor: "#2a2a2a" }}>
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
                    backgroundColor: "#1c1c1c",
                    border: "1px solid #2e2e2e",
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
                    <p className="text-sm" style={{ color: "#666" }}>
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
                            style={{ color: "#e5e5e5" }}>
                            {job.name}
                          </span>
                          <span
                            className="text-xs ml-2"
                            style={{ color: "#666" }}>
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
                  backgroundColor: "#1c1c1c",
                  color: "#e5e5e5",
                  border: "1px solid #2e2e2e",
                }}>
                ‹
              </button>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="flex-1 text-center text-sm font-bold rounded-xl py-2"
                style={{
                  backgroundColor: "#1c1c1c",
                  color: "white",
                  border: "1px solid #2e2e2e",
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
                  backgroundColor: "#1c1c1c",
                  color: "#e5e5e5",
                  border: "1px solid #2e2e2e",
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
                    backgroundColor: statusFilter === s ? "#2fae8a" : "#1c1c1c",
                    color: statusFilter === s ? "white" : "#777",
                    border: "1px solid #2e2e2e",
                  }}>
                  {s}
                </button>
              ))}
            </div>
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid #2a2a2a" }}>
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{
                  backgroundColor: "#1c1c1c",
                  borderBottom: "1px solid #2a2a2a",
                }}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-sm font-bold"
                    style={{ color: "white" }}>
                    {formatDate(dateFilter)} 일정
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: "#2a2a2a", color: "#bbb" }}>
                    {filtered.length}건
                  </span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: "#2fae8a" }}>
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
                    className="text-xs px-3 py-1.5 rounded-lg font-bold"
                    style={{ backgroundColor: "#2fae8a", color: "white" }}>
                    + 추가
                  </button>
                )}
              </div>
              {filtered.length === 0 ? (
                <div
                  className="text-center py-12"
                  style={{ backgroundColor: "#111", color: "#444" }}>
                  <p className="text-3xl mb-2">📋</p>
                  <p className="text-sm">일정 없음</p>
                </div>
              ) : (
                <div
                  className="flex flex-col gap-0"
                  style={{ backgroundColor: "#111" }}>
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
                              style={{ borderBottom: "1px solid #1e1e1e" }}>
                              <span
                                className="text-xs font-bold"
                                style={{ color: "#555" }}>
                                {formatTime(job.visit_time)}
                              </span>
                              <div
                                className="flex-1 h-px"
                                style={{ backgroundColor: "#1e1e1e" }}
                              />
                            </div>
                          )}
                        {!job.visit_time &&
                          (idx === 0 || arr[idx - 1].visit_time) && (
                            <div
                              className="px-4 py-2"
                              style={{ borderBottom: "1px solid #1e1e1e" }}>
                              <span
                                className="text-xs font-bold"
                                style={{ color: "#555" }}>
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
                        statusFilter === s ? "#2fae8a" : "#1c1c1c",
                      color: statusFilter === s ? "white" : "#777",
                      border: "1px solid #2e2e2e",
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
              style={{ color: "#666" }}>
              <span>{filtered.length}건</span>
              <span>·</span>
              <span style={{ color: "#2fae8a" }}>
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
              <div className="text-center py-16" style={{ color: "#444" }}>
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
              backgroundColor: "#1c1c1c",
              border: "1px solid #383838",
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
                style={{ color: "#666", fontSize: 20 }}>
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
                  style={{ color: "#888" }}>
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
                  style={{ color: "#888" }}>
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
                  style={{ color: "#888" }}>
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
                      backgroundColor: "#252525",
                      color: "#aaa",
                      border: "1px solid #383838",
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
                      backgroundColor: "#252525",
                      color: "#aaa",
                      border: "1px solid #383838",
                    }}>
                    ＋
                  </button>
                </div>
              </label>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold" style={{ color: "#888" }}>
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
                  style={{ color: "#888" }}>
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
                  style={{ color: "#888" }}>
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
              <span className="text-xs font-semibold" style={{ color: "#888" }}>
                🛡 AS 만료일
                <span className="ml-1 font-normal" style={{ color: "#555" }}>
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
                    backgroundColor: "#252525",
                    color: "#aaa",
                    border: "1px solid #383838",
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
                backgroundColor: form.is_measurement ? "#a855f718" : "#1a1a1a",
                border: `1px solid ${form.is_measurement ? "#a855f755" : "#383838"}`,
              }}>
              <div className="flex items-center gap-2.5">
                <span className="text-base">📐</span>
                <div className="text-left">
                  <p
                    className="text-sm font-bold"
                    style={{ color: form.is_measurement ? "#a855f7" : "#ccc" }}>
                    실측 방문
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#555" }}>
                    체크 시 완료해도 매출에 포함 안 됨
                  </p>
                </div>
              </div>
              <div
                className="rounded-full flex-shrink-0"
                style={{
                  width: 44,
                  height: 24,
                  backgroundColor: form.is_measurement ? "#a855f7" : "#333",
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
                  border: "1px solid #2fae8a44",
                }}>
                <p className="text-xs font-bold" style={{ color: "#2fae8a" }}>
                  🔨 시공 날짜 · 시간{" "}
                  <span className="font-normal" style={{ color: "#555" }}>
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
                          backgroundColor: "#252525",
                          color: "#aaa",
                          border: "1px solid #383838",
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
                          backgroundColor: "#252525",
                          color: "#aaa",
                          border: "1px solid #383838",
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
                <span className="font-normal" style={{ color: "#555" }}>
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
                              height: 72,
                              width: 72,
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
                    backgroundColor: "#1a1a1a",
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
              <span className="text-xs font-semibold" style={{ color: "#888" }}>
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
              style={{ backgroundColor: "#2fae8a", opacity: saving ? 0.7 : 1 }}>
              {saving ? "저장 중..." : editId ? "수정 완료" : "접수 저장"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
