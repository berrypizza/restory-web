"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { businessLines } from "@/lib/site-config";

/* ── 서비스 아이콘 매핑 ── */
const serviceIcons: Record<
  string,
  { icon: string; label: string; href: string }[]
> = {
  repair: [
    { icon: "🔧", label: "상부장 수리", href: "/repair/sangbujang" },
    { icon: "💧", label: "하부장 밑판", href: "/repair/habujang" },
    { icon: "🚪", label: "문짝 떨어짐", href: "/repair/door-fall" },
    { icon: "🔩", label: "경첩 교체", href: "/repair/hinge" },
    { icon: "📦", label: "서랍 레일", href: "/repair/drawer-rail" },
    { icon: "🛏️", label: "침대 프레임", href: "/repair/bed-frame" },
    { icon: "🍽️", label: "식탁 다리", href: "/repair/table-leg" },
  ],
  kitchen: [
    { icon: "🪵", label: "싱크대 문짝", href: "/kitchen/sink-door" },
    { icon: "❄️", label: "냉장고장", href: "/kitchen/fridge-cabinet" },
    { icon: "🗄️", label: "로청장", href: "/kitchen/rocheong" },
  ],
  leather: [
    { icon: "🪑", label: "식당 의자", href: "/leather/restaurant-chair" },
    { icon: "✂️", label: "기타 가죽", href: "/leather/custom" },
  ],
  sofa: [{ icon: "🛋️", label: "소파 꺼짐 복원", href: "/sofa" }],
};

const PHONE = "tel:010-9127-3024";
const KAKAO_URL = "https://pf.kakao.com/_aHYsX/chat";
const PHOTO_URL = "https://blog.naver.com/sofaresq/224129090889";

export default function DrawerMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!mounted) return null;

  return (
    <>
      {/* 햄버거 버튼 */}
      <button
        onClick={() => setOpen(true)}
        aria-label="전체 서비스 메뉴 열기"
        className="flex flex-col justify-center items-center gap-[5px] w-9 h-9 rounded-lg transition-all hover:bg-neutral-100"
        style={{ border: "1px solid #e5e5e5" }}>
        <span
          className="block rounded-full"
          style={{ width: 16, height: 2, backgroundColor: "#1a1a1a" }}
        />
        <span
          className="block rounded-full"
          style={{ width: 12, height: 2, backgroundColor: "#999" }}
        />
        <span
          className="block rounded-full"
          style={{ width: 16, height: 2, backgroundColor: "#1a1a1a" }}
        />
      </button>

      {/* 배경 오버레이 */}
      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-[60] transition-all duration-300"
        style={{
          backgroundColor: "rgba(0,0,0,0.35)",
          backdropFilter: open ? "blur(4px)" : "none",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      {/* 드로어 패널 */}
      <div
        className="fixed top-0 right-0 z-[70] h-full flex flex-col"
        style={{
          width: "min(380px, 90vw)",
          backgroundColor: "#fff",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.32, 0, 0.15, 1)",
          boxShadow: open ? "-12px 0 40px rgba(0,0,0,0.1)" : "none",
        }}>
        {/* 헤더 */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid #eee" }}>
          <div className="flex items-center gap-2">
            <Link href="/" onClick={() => setOpen(false)}>
              <Image
                src="/images/logo.png"
                alt="Re'Story"
                width={100}
                height={30}
                className="h-7 w-auto object-contain"
              />
            </Link>
            <span className="text-[13px] font-bold text-[#1f66ff]">
              전체 서비스
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="메뉴 닫기"
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-neutral-100"
            style={{ color: "#999", fontSize: 16 }}>
            ✕
          </button>
        </div>

        {/* 스크롤 영역 */}
        <nav className="flex-1 overflow-y-auto">
          {/* ── 서비스 카테고리 그리드 ── */}
          {businessLines.map((line) => (
            <div key={line.id} className="px-5 pt-6 pb-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-black text-neutral-900">
                  {line.title}
                </h3>
                <Link
                  href={line.href}
                  onClick={() => setOpen(false)}
                  className="text-[12px] font-bold text-[#1f66ff] hover:underline">
                  전체보기 →
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(serviceIcons[line.id] || []).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex flex-col items-center gap-1.5 rounded-xl py-3 px-1 transition-colors hover:bg-[#f0f4ff]">
                    <span className="text-[24px]">{item.icon}</span>
                    <span className="text-[11px] font-semibold text-neutral-700 text-center leading-tight whitespace-nowrap">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div
            className="mx-5 my-3"
            style={{ height: 1, backgroundColor: "#eee" }}
          />

          {/* ── 바로가기 ── */}
          <div className="px-5 pt-3 pb-2">
            <p className="text-[11px] font-bold text-neutral-400 tracking-wider mb-3">
              바로가기
            </p>
            <div className="flex flex-col gap-1.5">
              {[
                {
                  label: "📷 사진으로 견적 받기",
                  href: PHOTO_URL,
                  external: true,
                  highlight: true,
                },
                {
                  label: "🔍 작업 사례 보기",
                  href: "/reviews",
                  external: false,
                  highlight: false,
                },
                {
                  label: "⭐ 고객 후기",
                  href: "/reviews",
                  external: false,
                  highlight: false,
                },
                {
                  label: "❓ 자주 묻는 질문",
                  href: "/faq",
                  external: false,
                  highlight: false,
                },
              ].map((item, i) =>
                item.external ? (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3.5 transition-all"
                    style={{
                      backgroundColor: item.highlight ? "#1f66ff" : "#fafafa",
                      border: `1px solid ${item.highlight ? "transparent" : "#eee"}`,
                    }}>
                    <span
                      className="text-[14px] font-bold"
                      style={{ color: item.highlight ? "white" : "#1a1a1a" }}>
                      {item.label}
                    </span>
                    <span
                      style={{
                        color: item.highlight
                          ? "rgba(255,255,255,0.5)"
                          : "#ccc",
                        fontSize: 12,
                      }}>
                      →
                    </span>
                  </a>
                ) : (
                  <Link
                    key={i}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3.5 transition-all hover:bg-neutral-50"
                    style={{
                      backgroundColor: "#fafafa",
                      border: "1px solid #eee",
                    }}>
                    <span className="text-[14px] font-bold text-neutral-900">
                      {item.label}
                    </span>
                    <span style={{ color: "#ccc", fontSize: 12 }}>→</span>
                  </Link>
                ),
              )}
            </div>
          </div>

          <div
            className="mx-5 my-3"
            style={{ height: 1, backgroundColor: "#eee" }}
          />

          {/* ── 상담하기 ── */}
          <div className="px-5 pt-3 pb-2">
            <p className="text-[11px] font-bold text-neutral-400 tracking-wider mb-3">
              상담하기
            </p>
            <div className="flex flex-col gap-1.5">
              <a
                href={KAKAO_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all hover:opacity-90"
                style={{ backgroundColor: "#FEE500" }}>
                <Image
                  src="/images/kakao-logo.png"
                  alt="카카오톡"
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                />
                <span className="text-[14px] font-bold text-neutral-900">
                  실시간 카톡 상담
                </span>
                <span className="ml-auto text-[11px] font-bold text-neutral-500 bg-white/60 px-2 py-0.5 rounded-full">
                  빠른 답변
                </span>
              </a>
              <a
                href={PHONE}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all hover:bg-neutral-50"
                style={{
                  backgroundColor: "#fafafa",
                  border: "1px solid #eee",
                }}>
                <Image
                  src="/images/phone-icon.png"
                  alt="전화"
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                />
                <span className="text-[14px] font-bold text-neutral-900">
                  전화 상담
                </span>
                <span className="ml-auto text-[13px] font-semibold text-[#1f66ff]">
                  010-9127-3024
                </span>
              </a>
            </div>
          </div>

          <div
            className="mx-5 my-3"
            style={{ height: 1, backgroundColor: "#eee" }}
          />

          {/* ── 운영 정보 ── */}
          <div className="px-5 pt-3 pb-6">
            <p className="text-[11px] font-bold text-neutral-400 tracking-wider mb-3">
              운영 정보
            </p>
            <div
              className="rounded-2xl p-4"
              style={{ backgroundColor: "#fafafa", border: "1px solid #eee" }}>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: "서비스 지역", value: "서울 · 경기 · 인천 전 지역" },
                  { label: "상담 시간", value: "매일 09:00 ~ 22:00" },
                  { label: "방문 가능일", value: "월 ~ 토요일" },
                  { label: "긴급 시공", value: "상부장 추락 등 우선 배정" },
                ].map((info, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-[12px] text-neutral-400">
                      {info.label}
                    </span>
                    <span className="text-[12px] font-semibold text-neutral-700">
                      {info.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* 하단 고정 — CTA */}
        <div
          className="flex-shrink-0 px-5 py-4"
          style={{ borderTop: "1px solid #eee", backgroundColor: "#fff" }}>
          <a
            href={PHOTO_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 w-full rounded-xl py-3.5 font-bold text-[15px] text-white transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #3672ff 0%, #1a5cff 100%)",
            }}>
            📷 사진 보내고 무료 견적 받기
          </a>
          <p className="mt-2 text-center text-[11px] text-neutral-400">
            사진 한 장이면 수리·리폼 가능 여부 바로 안내
          </p>
        </div>
      </div>
    </>
  );
}
