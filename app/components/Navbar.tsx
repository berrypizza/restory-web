"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { businessLines } from "@/lib/site-config";
import DrawerMenu from "@/app/components/DrawerMenu";

const quickLinks = [
  { label: "작업사례", href: "/cases" },
  { label: "이벤트", href: "/events" },
  { label: "꿀팁 계시판", href: "/tips" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* 스크롤 시 접히는 영역 — sticky 밖 */}
      <div
        className={`bg-white overflow-hidden transition-transform duration-300 ${
          scrolled ? "-translate-y-full" : "translate-y-0"
        }`}>
        {/* 파란 배너 */}
        <div className="bg-[#1f66ff] text-white">
          <div className="mx-auto flex h-9 max-w-6xl items-center justify-center px-4 text-xs font-bold md:text-sm">
            사진 한 장으로 수리·리폼 가능 여부 먼저 확인
          </div>
        </div>

        {/* 로고 + 퀵링크 + 버튼 */}
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.png"
                alt="Re'Story"
                width={76}
                height={76}
                className="h-19 w-auto object-contain"
                priority
              />{" "}
              <h1 className="pl-[6px] text-[17px] font-black text-[#1f66ff]">
                리스토리
              </h1>
            </Link>

            <nav className="hidden items-center gap-7 text-sm font-extrabold text-neutral-900 md:flex">
              {quickLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="transition hover:text-[#1f66ff]">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* 모바일: 햄버거만 */}
            <div className="md:hidden">
              <DrawerMenu />
            </div>
            {/* 데스크탑: 전화문의 + 사진접수 버튼 */}
            <a
              href="tel:010-6855-0957"
              className="hidden md:inline-flex rounded-xl bg-neutral-100 px-4 py-2 text-xs font-black text-neutral-800">
              전화문의
            </a>
            <a
              href="https://blog.naver.com/sofaresq/224129090889"
              className="hidden md:inline-flex rounded-xl bg-[#1f66ff] px-4 py-2 text-xs font-black text-white">
              사진접수
            </a>
          </div>
        </div>
      </div>

      {/* 카테고리 nav — sticky 고정 */}
      <header className="sticky top-0 z-50 border-b border-neutral-100 bg-white shadow-[0_1px_0_rgba(0,0,0,0.08)]">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-4">
          <nav
            className="nav-scroll flex-1 flex h-full items-center gap-0.5 overflow-x-auto overflow-y-hidden"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-x",
            }}>
            <style>{`.nav-scroll::-webkit-scrollbar{display:none}`}</style>

            {/* 홈 */}
            <div className="relative flex h-full shrink-0 items-center">
              <Link
                href="/"
                className={`relative flex h-full items-center px-2 font-bold transition ${
                  pathname === "/"
                    ? "text-[#1f66ff]"
                    : "text-neutral-400 md:text-neutral-950 hover:text-[#1f66ff]"
                }`}>
                홈
                {pathname === "/" && (
                  <span
                    className="absolute bottom-0 left-1/2 h-[3px] -translate-x-1/2 rounded-full bg-[#1f66ff]"
                    style={{ width: "calc(100%)" }}
                  />
                )}
              </Link>
            </div>

            {businessLines.map((line) => {
              const isActive = pathname.startsWith(`/${line.id}`);
              return (
                <div
                  key={line.id}
                  className="group relative flex h-full shrink-0 items-center">
                  <Link
                    href={line.href}
                    className={`relative flex h-full items-center px-2 text-black font-bold transition ${
                      isActive
                        ? "text-[#1f66ff]"
                        : "text-neutral-400 md:text-neutral-950 hover:text-[#1f66ff]"
                    }`}>
                    {line.title}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-1/2 h-[3px] -translate-x-1/2 rounded-full bg-[#1f66ff]"
                        style={{ width: "calc(100%)" }}
                      />
                    )}
                  </Link>

                  {/* 드롭다운 — 데스크탑만 */}
                  <div className="hidden md:block invisible absolute left-0 top-full z-50 w-[760px] translate-y-2 rounded-b-3xl border border-t-0 border-neutral-200 bg-white opacity-0 shadow-2xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="grid grid-cols-[190px_1fr]">
                      <div className="bg-[#edf3ff] p-6">
                        <p className="text-lg font-black text-neutral-950">
                          {line.title}
                        </p>
                        <p className="mt-3 text-sm font-medium leading-relaxed text-neutral-600">
                          {line.subtitle}
                        </p>
                        <Link
                          href={line.href}
                          className="mt-6 inline-flex rounded-xl bg-[#1f66ff] px-4 py-3 text-xs font-black text-white">
                          전체 보기
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 gap-x-8 gap-y-4 p-6 lg:grid-cols-3">
                        {line.services.map((service) => (
                          <Link
                            key={service.slug}
                            href={`/${line.id}/${service.slug}`}
                            className="rounded-2xl p-3 transition hover:bg-neutral-50">
                            <p className="text-sm font-black text-neutral-950">
                              {service.shortTitle}
                            </p>
                            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-500">
                              {service.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
          <div className="hidden md:flex flex-shrink-0 h-full items-center pl-3">
            <DrawerMenu />
          </div>
        </div>
      </header>
    </>
  );
}
