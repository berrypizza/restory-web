import Image from "next/image";
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
      style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #eee" }}>
      <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Image
            src="/images/logo.png"
            alt="Re'Story 로고"
            width={120}
            height={36}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        <div className="flex items-center gap-2">
          <a
            href={KAKAO_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#FEE500", color: "#1a1a1a" }}>
            <KakaoIcon />
            <span className="hidden sm:inline">카카오 상담</span>
            <span className="sm:hidden">상담</span>
          </a>

          <a
            href="tel:01000000000"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#f5f5f5", border: "1px solid #e5e5e5", color: "#1a1a1a" }}>
            📞 전화 문의
          </a>

          <DrawerMenu />
        </div>
      </div>
    </header>
  );
}
