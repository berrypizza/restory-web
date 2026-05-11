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
        paddingBottom: "max(16px, env(safe-area-inset-bottom))",
        paddingTop: 12,
        background: "linear-gradient(to top, rgba(13,13,13,0.99) 60%, transparent)",
      }}>
      <div className="flex flex-col gap-2 mx-auto max-w-sm">
        <a
          href={KAKAO_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full rounded-xl py-4 text-sm font-black transition-opacity active:opacity-80"
          style={{ backgroundColor: "#FEE500", color: "#191919" }}>
          <KakaoIcon />
          카카오톡으로 사진 상담하기
        </a>
        <div className="flex gap-2">
          <a href="/request" className="flex-1 rounded-xl py-3 text-center text-sm font-bold transition-opacity active:opacity-80" style={{ backgroundColor: "#2fae8a", color: "white" }}>
            💬 문자 상담
          </a>
          <a href="tel:01000000000" className="flex items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-sm font-bold transition-opacity active:opacity-80" style={{ backgroundColor: "#1e1e1e", border: "1px solid #333", color: "#e5e5e5", whiteSpace: "nowrap" }}>
            📞 010-0000-0000
          </a>
        </div>
      </div>
    </div>
  );
}
