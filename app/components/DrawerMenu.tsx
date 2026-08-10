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
      label: "상부장 처짐",
      href: "/repair/sangbujang",
    },
    {
      icon: "/images/icon/icon-down.png",
      label: "하부장 밑판",
      href: "/repair/habujang",
    },
    // {
    //   icon: "/images/icon/icon-door-drop.png",
    //   label: "문짝 떨어짐",
    //   href: "/repair/door-fall",
    // },
    // {
    //   icon: "/images/icon/icon-door-gear.png",
    //   label: "경첩 교체",
    //   href: "/repair/hinge",
    // },
    // {
    //   icon: "/images/icon/icon-rail.png",
    //   label: "서랍 레일",
    //   href: "/repair/drawer-rail",
    // },
    // {
    //   icon: "/images/icon/icon-bed.png",
    //   label: "침대 프레임",
    //   href: "/repair/bed-frame",
    // },
    // {
    //   icon: "/images/icon/icon-table.png",
    //   label: "식탁 다리",
    //   href: "/repair/table-leg",
    // },
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
      icon: "/images/icon/icon-table.png",
      label: "회의실 테이블",
      href: "/leather/meeting-table",
    },
    // {
    //   icon: "/images/icon/icon-chair-reform.png",
    //   label: "기타 가죽",
    //   href: "/leather/custom",
    // },
  ],
  sofa: [
    {
      icon: "/images/icon/icon-sofa-sag.png",
      label: "소파 꺼짐 복원",
      href: "/sofa",
    },
  ],
};

const PHONE = "tel:16882957";
const KAKAO_URL = "http://pf.kakao.com/_hQExjX/chat";
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
        className="flex flex-col justify-center items-center gap-[5px] w-[38px] h-[38px] border-2 border-transparent rounded-xl px-3 py-2 bg-gradient-to-r from-[#1f66ff] to-[#4f8fff] transition-all hover:bg-neutral-100">
        <span
          className="block rounded-full"
          style={{ width: 16, height: 2, backgroundColor: "#ffffff" }}
        />
        <span
          className="block rounded-full"
          style={{ width: 16, height: 2, backgroundColor: "#ffffff" }}
        />
        <span
          className="block rounded-full"
          style={{ width: 16, height: 2, backgroundColor: "#ffffff" }}
        />
      </button>

      {/* Portal로 body에 직접 렌더링 → sticky header의 stacking context 밖으로 탈출 */}
      {createPortal(
        <>
          {/* 배경 오버레이 */}
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 transition-all duration-300"
            style={{
              zIndex: 9998,
              backgroundColor: "rgba(0,0,0,0.35)",
              backdropFilter: open ? "blur(4px)" : "none",
              opacity: open ? 1 : 0,
              pointerEvents: open ? "auto" : "none",
            }}
          />

          {/* 드로어 패널 */}
          <div
            className="fixed top-0 right-0 h-full flex flex-col"
            style={{
              zIndex: 9999,
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
              {/* ── 바로가기 ── */}
              <div className="px-5 pt-3 pb-2">
                <p className="text-[11px] font-bold text-neutral-400 tracking-wider mb-3">
                  바로가기
                </p>
                <div className="flex flex-col gap-1.5">
                  {[
                    {
                      label: "📷 사진으로 견적 받기",
                      href: KAKAO_URL,
                      external: true,
                      highlight: true,
                    },
                    {
                      label: "🔍 작업 사례 보기",
                      href: "/cases",
                      external: false,
                      highlight: false,
                    },
                    {
                      label: "⭐ 이벤트",
                      href: "/events",
                      external: false,
                      highlight: false,
                    },
                    {
                      label: "🍯 꿀팁 게시판",
                      href: "/tips",
                      external: false,
                      highlight: false,
                    },
                    {
                      label: "🤔 고객 문의함",
                      href: "https://cafe.naver.com/f-e/cafes/22748193/menus/85?viewType=L",
                      external: false,
                      highlight: false,
                    },
                    // {
                    //   label: "❓ 자주 묻는 질문",
                    //   href: "/faq",
                    //   external: false,
                    //   highlight: false,
                    // },
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
                          backgroundColor: item.highlight
                            ? "#1f66ff"
                            : "#fafafa",
                          border: `1px solid ${item.highlight ? "transparent" : "#eee"}`,
                        }}>
                        <span
                          className="text-[14px] font-bold"
                          style={{
                            color: item.highlight ? "white" : "#1a1a1a",
                          }}>
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
                        <Image
                          src={item.icon}
                          alt={item.label}
                          width={36}
                          height={36}
                          className="w-9 h-9 object-contain"
                        />
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
                      16882957{" "}
                    </span>
                  </a>
                </div>
              </div>

              <div
                className="mx-5 my-3"
                style={{ height: 1, backgroundColor: "#eee" }}
              />

              <div
                className="mx-5 my-3"
                style={{ height: 1, backgroundColor: "#eee" }}
              />

              {/* ── SNS 바로가기 ── */}
              <div className="px-5 pt-3 pb-2">
                <p className="text-[11px] font-bold text-neutral-400 tracking-wider mb-3">
                  SNS 바로가기
                </p>
                <div className="flex flex-col gap-2">
                  <a
                    href="https://www.instagram.com/restory_studio.kr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:opacity-90"
                    style={{
                      background:
                        "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                    }}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="white">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span className="text-[13px] font-bold text-white">
                      인스타그램
                    </span>
                    <span className="ml-auto text-[11px] text-white/60">
                      @restory_studio.kr
                    </span>
                  </a>
                  <a
                    href="https://blog.naver.com/sofaresq"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:opacity-90"
                    style={{ backgroundColor: "#03C75A" }}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="white">
                      <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
                    </svg>
                    <span className="text-[13px] font-bold text-white">
                      네이버 블로그
                    </span>
                    <span className="ml-auto text-[11px] text-white/60">
                      시공 사례 모음
                    </span>
                  </a>
                  <a
                    href="https://www.youtube.com/@리스토리스튜디오"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:opacity-90"
                    style={{ backgroundColor: "#FF0000" }}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="white">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    <span className="text-[13px] font-bold text-white">
                      유튜브
                    </span>
                    <span className="ml-auto text-[11px] text-white/60">
                      실제 시공 영상
                    </span>
                  </a>
                </div>
              </div>

              {/* ── 운영 정보 ── */}
              <div className="px-5 pt-3 pb-6">
                <p className="text-[11px] font-bold text-neutral-400 tracking-wider mb-3">
                  운영 정보
                </p>
                <div
                  className="rounded-2xl p-4"
                  style={{
                    backgroundColor: "#fafafa",
                    border: "1px solid #eee",
                  }}>
                  <div className="flex flex-col gap-2.5">
                    {[
                      {
                        label: "서비스 지역",
                        value: "서울 · 경기 · 인천 전 지역",
                      },
                      { label: "상담 시간", value: "매일 00:00 ~ 24:00" },
                      { label: "방문 가능일", value: "월 ~ 토요일" },
                      { label: "긴급 시공", value: "상부장 추락 등 우선 배정" },
                    ].map((info, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between">
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
                href={KAKAO_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full rounded-xl py-3.5 font-bold text-[15px] text-white transition-opacity hover:opacity-90"
                style={{
                  background:
                    "linear-gradient(135deg, #3672ff 0%, #1a5cff 100%)",
                }}>
                📷 사진 보내고 무료 견적 받기
              </a>
              <p className="mt-2 text-center text-[11px] text-neutral-400">
                사진 한 장이면 수리·리폼 가능 여부 바로 안내
              </p>
            </div>
          </div>
        </>,
        document.body,
      )}
    </>
  );
}
