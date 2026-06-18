import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ── Supabase 싱글톤 ──────────────────────────────────────────
let _supabase: SupabaseClient | null = null;
export function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return _supabase;
}

// ── 날짜/시간 ────────────────────────────────────────────────
export function nowKST() {
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000);
}

export function today() {
  return nowKST().toISOString().slice(0, 10);
}

export function thisYearMonth() {
  return nowKST().toISOString().slice(0, 7);
}

export function formatDate(d: string) {
  if (!d) return "-";
  const [, m, day] = d.split("-");
  return `${parseInt(m)}/${parseInt(day)}`;
}

export function formatFullDate(d: string) {
  if (!d) return "-";
  const [y, m, day] = d.split("-");
  const dow = ["일", "월", "화", "수", "목", "금", "토"][new Date(d).getDay()];
  return `${y}년 ${parseInt(m)}월 ${parseInt(day)}일 (${dow})`;
}

export function formatYearMonth(ym: string) {
  const [y, m] = ym.split("-");
  return `${y}년 ${parseInt(m)}월`;
}

export function formatTime(t: string) {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  const min = parseInt(m || "0");
  const ampm = hour < 12 ? "AM" : "PM";
  const h12 = hour % 12 || 12;
  return min > 0 ? `${ampm} ${h12}시 ${min}분` : `${ampm} ${h12}시`;
}

export function addOneYear(dateStr: string) {
  const d = new Date(dateStr);
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
}

export function adjTime(t: string, delta: number) {
  const [h, m] = (t || "00:00").split(":").map(Number);
  const safe = (((h * 60 + m + delta) % 1440) + 1440) % 1440;
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}

export function pad(n: number) {
  return String(n).padStart(2, "0");
}

// ── 가격 ─────────────────────────────────────────────────────
export function formatPrice(p: number) {
  if (p >= 10000) {
    const man = Math.floor(p / 10000);
    const cheon = Math.floor((p % 10000) / 1000);
    return cheon > 0 ? `${man}만 ${cheon}천원` : `${man}만원`;
  }
  return `${p.toLocaleString()}원`;
}

// ── 캘린더 ───────────────────────────────────────────────────
export function getCalendarDays(year: number, month: number) {
  const first = new Date(year, month, 1).getDay();
  const last = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = Array(first).fill(null);
  for (let d = 1; d <= last; d++) days.push(d);
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

// ── 이미지 ───────────────────────────────────────────────────
export function compressImage(
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

// ── 기타 ─────────────────────────────────────────────────────
export function reviewSms(job: { name: string; phone: string }) {
  return encodeURIComponent(
    `안녕하세요 ${job.name}님, 리스토리입니다 😊\n지난번 가구 수리 잘 쓰고 계신가요?\n\n네이버 지도에 후기 남겨주시면 정말 큰 힘이 됩니다.\nhttps://naver.me/XXXXXXXX\n\n감사합니다 🙏`,
  );
}

export function naverMapUrl(region: string) {
  return `https://map.naver.com/v5/search/${encodeURIComponent(region)}`;
}

// ── 경로 계산용 ──────────────────────────────────────────────
export function makeDateTime(date: string, time: string) {
  const [h, m] = (time || "00:00").split(":").map(Number);
  return new Date(
    `${date}T${String(h).padStart(2, "0")}:${String(m || 0).padStart(2, "0")}:00`,
  );
}

export function toIsoLocal(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:00`;
}

export function displayTime(d: Date) {
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h % 12 || 12;
  return m > 0 ? `${ampm} ${h12}시 ${m}분` : `${ampm} ${h12}시`;
}

export function diffMinutes(a: Date, b: Date) {
  return Math.round((a.getTime() - b.getTime()) / 60000);
}
