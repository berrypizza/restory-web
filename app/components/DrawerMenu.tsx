"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const menuItems = [
  { label: "수리 문의", href: "/request", badge: "1분 답변", highlight: true },
  { label: "수리 사례", href: "/reviews", badge: null, highlight: false },
  { label: "비용 확인", href: "/estimate", badge: "즉시 조회", highlight: false },
  { label: "왜 Re'Story", href: "/why", badge: null, highlight: false },
];

export default function DrawerMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!mounted) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="메뉴 열기"
        className="flex flex-col justify-center items-center gap-[5px] w-9 h-9 rounded-lg transition-all"
        style={{ backgroundColor: "#f5f5f5", border: "1px solid #e5e5e5" }}>
        <span className="block rounded-full" style={{ width: 16, height: 1.5, backgroundColor: "#1a1a1a" }} />
        <span className="block rounded-full" style={{ width: 10, height: 1.5, backgroundColor: "#888" }} />
        <span className="block rounded-full" style={{ width: 16, height: 1.5, backgroundColor: "#1a1a1a" }} />
      </button>

      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-[60] transition-all duration-300"
        style={{
          backgroundColor: "rgba(0,0,0,0.3)",
          backdropFilter: open ? "blur(4px)" : "none",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      <div
        className="fixed top-0 right-0 z-[70] h-full flex flex-col"
        style={{
          width: "min(340px, 88vw)",
          backgroundColor: "#fff",
          borderLeft: "1px solid #eee",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.32, 0, 0.15, 1)",
          boxShadow: open ? "-12px 0 40px rgba(0,0,0,0.08)" : "none",
        }}>
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: "1px solid #eee" }}>
          <Link href="/" onClick={() => setOpen(false)}>
            <Image src="/images/logo.png" alt="Re'Story" width={100} height={30} className="h-7 w-auto object-contain" />
          </Link>
          <button onClick={() => setOpen(false)} aria-label="메뉴 닫기"
            className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ backgroundColor: "#f5f5f5", color: "#888", fontSize: 14 }}>✕</button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <div className="flex flex-col gap-1.5">
            {menuItems.map((item, i) => (
              <Link key={i} href={item.href} onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3.5 transition-all"
                style={{
                  backgroundColor: item.highlight ? "#1a1a1a" : "#fafafa",
                  border: `1px solid ${item.highlight ? "transparent" : "#eee"}`,
                }}>
                <span className="text-sm font-bold" style={{ color: item.highlight ? "white" : "#1a1a1a" }}>{item.label}</span>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: item.highlight ? "rgba(255,255,255,0.2)" : "#f0f0f0",
                        color: item.highlight ? "white" : "#666",
                      }}>{item.badge}</span>
                  )}
                  <span style={{ color: item.highlight ? "rgba(255,255,255,0.5)" : "#ccc", fontSize: 12 }}>→</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="my-5" style={{ height: 1, backgroundColor: "#eee" }} />

          <div className="rounded-2xl p-4" style={{ backgroundColor: "#fafafa", border: "1px solid #eee" }}>
            <p className="text-xs font-bold mb-3" style={{ color: "#aaa" }}>운영 정보</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "서비스 지역", value: "TODO: 지역 입력" },
                { label: "답변 시간", value: "오전 9시 ~ 오후 9시" },
                { label: "방문 가능일", value: "월 ~ 토요일" },
              ].map((info, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#aaa" }}>{info.label}</span>
                  <span className="text-xs font-semibold" style={{ color: "#444" }}>{info.value}</span>
                </div>
              ))}
            </div>
          </div>
        </nav>

        <div className="flex-shrink-0 px-4 py-4" style={{ borderTop: "1px solid #eee" }}>
          <a href="tel:01000000000"
            className="flex items-center justify-center gap-2 w-full rounded-xl py-3.5 mb-3 font-bold text-sm"
            style={{ backgroundColor: "#fafafa", border: "1px solid #e5e5e5", color: "#1a1a1a" }}>
            📞 010-0000-0000
          </a>
        </div>
      </div>
    </>
  );
}
