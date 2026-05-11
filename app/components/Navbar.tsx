import Link from "next/link";
import DrawerMenu from "./DrawerMenu";

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_CHANGE_ME/chat";

function KakaoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.62 5.1 4.077 6.569l-1.04 3.847a.3.3 0 0 0 .461.324l4.666-3.1A11.66 11.66 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
    </svg>
  );
}

export default function Navbar() {
  return (
    <header
      className="sticky top-0 z-50"
      style={{ backgroundColor: "#1e1e1e", borderBottom: "1px solid #2a2a2a" }}>
      <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          {/* TODO: 로고 이미지로 교체 */}
          <span className="text-lg font-black" style={{ color: "white" }}>
            리스토리
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: "#2fae8a22",
              color: "#2fae8a",
              border: "1px solid #2fae8a44",
            }}>
            가구수리
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* 카카오 CTA */}
          <a
            href={KAKAO_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-black transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#FEE500", color: "#191919" }}>
            <KakaoIcon />
            <span className="hidden sm:inline">카카오 상담</span>
            <span className="sm:hidden">상담</span>
          </a>

          {/* 전화 — 데스크탑만 */}
          <a
            href="tel:01000000000"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "#2a2a2a",
              border: "1px solid #333",
              color: "#e5e5e5",
            }}>
            📞 전화 문의
          </a>

          <DrawerMenu />
        </div>
      </div>
    </header>
  );
}
