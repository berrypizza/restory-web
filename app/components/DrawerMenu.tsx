"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { businessLines } from "@/lib/site-config";

/* ── 서비스 아이콘 매핑 ── */
const serviceIcons: Record<
  string,
  { icon: string; label: string; href: string }[]
> = {
  repair: [
    {
      icon: "/images/icon/icon-upper.png",
      label: "상부장 수리",
      href: "/repair/sangbujang",
    },
    {
      icon: "/images/icon/icon-down.png",
      label: "하부장 밑판",
      href: "/repair/habujang",
    },
    {
      icon: "/images/icon/icon-door-drop.png",
      label: "문짝 떨어짐",
      href: "/repair/door-fall",
    },
    {
      icon: "/images/icon/icon-door-gear.png",
      label: "경첩 교체",
      href: "/repair/hinge",
    },
    {
      icon: "/images/icon/icon-rail.png",
      label: "서랍 레일",
      href: "/repair/drawer-rail",
    },
    {
      icon: "/images/icon/icon-bed.png",
      label: "침대 프레임",
      href: "/repair/bed-frame",
    },
    {
      icon: "/images/icon/icon-table.png",
      label: "식탁 다리",
      href: "/repair/table-leg",
    },
  ],
  kitchen: [
    {
      icon: "/images/icon/icon-door-reform.png",
      label: "싱크대 문짝",
      href: "/kitchen/sink-door",
    },
    {
      icon: "/images/icon/icon-refre.png",
      label: "냉장고장",
      href: "/kitchen/fridge-cabinet",
    },
    {
      icon: "/images/icon/icon-robo.png",
      label: "로청장",
      href: "/kitchen/rocheong",
    },
  ],
  leather: [
    {
      icon: "/images/icon/icon-chair-reform.png",
      label: "식당 의자",
      href: "/leather/restaurant-chair",
    },
    {
      icon: "/images/icon/icon-chair-reform.png",
      label: "기타 가죽",
      href: "/leather/custom",
    },
  ],
  sofa: [
    {
      icon: "/images/icon/icon-sofa-sag.png",
      label: "소파 꺼짐 복원",
      href: "/sofa",
    },
  ],
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

  const drawerContent = (
    <>
      {/* 배경 오버레이 */}
      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-[99998] transition-all duration-300"
        style={{
          backgroundColor: "rgba(0,0,0,0.35)",
          backdropFilter: open ? "blur(4px)" : "none",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      {/* 드로어 패널 */}
      <div
        className="fixed top-0 right-0 z-[99999] h-full flex flex-col"
        style={{
          width: "min(100vw, 380px)",
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
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={48}
                      height={48}
                      className="w-[48px] h-[48px] object-contain"
                    />

                    <span className="text-[13px] font-semibold text-neutral-700 text-center leading-tight whitespace-nowrap">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* 하단 CTA */}
        <div
          className="flex-shrink-0 px-5 py-4"
          style={{
            borderTop: "1px solid #eee",
            backgroundColor: "#fff",
          }}>
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

  return (
    <>
      {/* 햄버거 버튼 */}
      <button
        onClick={() => setOpen(true)}
        aria-label="전체 서비스 메뉴 열기"
        className="relative z-[9999] flex flex-col justify-center items-center gap-[5px] w-9 h-9 rounded-lg transition-all hover:bg-neutral-100"
        style={{ border: "1px solid #e5e5e5" }}>
        <span
          className="block rounded-full"
          style={{
            width: 16,
            height: 2,
            backgroundColor: "#1a1a1a",
          }}
        />

        <span
          className="block rounded-full"
          style={{
            width: 12,
            height: 2,
            backgroundColor: "#999",
          }}
        />

        <span
          className="block rounded-full"
          style={{
            width: 16,
            height: 2,
            backgroundColor: "#1a1a1a",
          }}
        />
      </button>

      {createPortal(drawerContent, document.body)}
    </>
  );
}
