"use client";

import { useEffect, useState } from "react";

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_CHANGE_ME/chat";

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.62 5.1 4.077 6.569l-1.04 3.847a.3.3 0 0 0 .461.324l4.666-3.1A11.66 11.66 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
    </svg>
  );
}

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-4 md:hidden"
      style={{
        paddingBottom: "max(12px, env(safe-area-inset-bottom))",
        paddingTop: 10,
        background: "linear-gradient(to top, rgba(255,255,255,0.98) 60%, transparent)",
      }}>
      <div className="flex gap-2 mx-auto max-w-sm">
        <a href={KAKAO_CHANNEL_URL} target="_blank" rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold"
          style={{ backgroundColor: "#FEE500", color: "#1a1a1a" }}>
          <KakaoIcon /> 카카오 상담
        </a>
        <a href="tel:01000000000"
          className="flex items-center justify-center gap-1 rounded-xl px-4 py-3.5 text-sm font-semibold"
          style={{ backgroundColor: "#fff", border: "1px solid #e5e5e5", color: "#1a1a1a" }}>
          📞 전화
        </a>
      </div>
    </div>
  );
}
