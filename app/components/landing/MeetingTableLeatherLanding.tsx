"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/app/components/FadeIn";
import LeatherSampleSection from "./Leathersamplesection";
import FloatingCTA from "@/app/components/landing/shared/FloatingCTA";
import { FAQJsonLd, ServiceJsonLd } from "@/app/components/JsonLd";
import { cases } from "@/lib/case-data";
import { REGIONS } from "@/lib/seo-regions";

const PHONE = "tel:010-6855-0957";
const KAKAO_URL = "http://pf.kakao.com/_hQExjX/chat";

const FAQ_ITEMS = [
  {
    q: "회의실 테이블 상판 가죽만 교체 가능한가요?",
    a: "네. 상판 구조가 살아있다면 기존 인조가죽을 제거하고 새 원단으로 교체할 수 있습니다. 사진으로 먼저 가능 여부를 확인해드립니다.",
  },
  {
    q: "중역 테이블도 현장에서 작업하나요?",
    a: "대부분 현장 작업으로 진행합니다. 테이블 크기와 마감 방식에 따라 분해가 필요한 경우에는 방문 견적 때 안내드립니다.",
  },
  {
    q: "색상이나 질감 변경도 가능한가요?",
    a: "가능합니다. 블랙, 브라운, 그레이 계열부터 사무실 분위기에 맞는 인조가죽 샘플을 비교해 선택하실 수 있습니다.",
  },
  {
    q: "업무 시간 외 작업도 가능한가요?",
    a: "가능합니다. 회의실 사용 일정에 맞춰 퇴근 후, 주말, 휴무일 작업 일정을 조율합니다.",
  },
  {
    q: "A/S는 어떻게 되나요?",
    a: "시공 후 들뜸이나 마감 미흡이 있으면 무상으로 재방문해 보완합니다.",
  },
];

function parseKeyword(keyword?: string) {
  const kw = keyword ? keyword.replace(/-/g, " ") : "";
  const region = REGIONS.find((r) => kw.includes(r)) ?? "";

  const tableWord = kw.includes("중역")
    ? "중역 테이블"
    : kw.includes("책상")
      ? "회의실 책상"
      : kw.includes("회의테이블")
        ? "회의테이블"
        : "회의실 테이블";

  const materialWord = kw.includes("인조가죽") || kw.includes("인조 가죽")
    ? "인조가죽"
    : "가죽";

  return { region, tableWord, materialWord };
}

function TableCaseStrip({ region }: { region?: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const tableCases = cases
    .filter(
      (c) =>
        c.parentCategory === "가죽 리폼" &&
        c.category === "회의실 테이블 가죽 교체",
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const matched = region
    ? tableCases.filter((c) => c.region.includes(region))
    : [];
  const rest = tableCases.filter((c) => !matched.includes(c));
  const caseItems = [...matched, ...rest].slice(0, 6);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 12
      : 0;
    if (cardWidth > 0) setActiveIdx(Math.round(el.scrollLeft / cardWidth));
  };

  const scrollTo = (i: number) => {
    const el = scrollRef.current;
    if (!el || !el.firstElementChild) return;
    el.scrollTo({
      left: i * ((el.firstElementChild as HTMLElement).offsetWidth + 12),
      behavior: "smooth",
    });
  };

  if (caseItems.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4 px-5">
        <p className="text-[15px] font-bold text-neutral-900">
          테이블 가죽 교체 사례
        </p>
        <Link
          href="/cases?cat=회의실 테이블 가죽 교체"
          className="text-[12px] font-bold"
          style={{ color: "#1a5cff", textDecoration: "none" }}>
          전체 보기 →
        </Link>
      </div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          paddingLeft: 20,
          paddingRight: 20,
        }}>
        {caseItems.map((item) => (
          <div
            key={item.id}
            style={{
              scrollSnapAlign: "start",
              flexShrink: 0,
              width: "72%",
              maxWidth: 300,
            }}>
            <Link
              href={`/cases/${item.id}`}
              draggable={false}
              className="block overflow-hidden rounded-2xl"
              style={{ border: "1px solid #e5e7eb", textDecoration: "none" }}>
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                <Image
                  src={item.afterImg}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="72vw"
                  draggable={false}
                />
                <div
                  className="absolute top-2 left-2 rounded-full px-2.5 py-0.5 text-[10px] font-black text-white"
                  style={{ background: "#1a5cff" }}>
                  AFTER
                </div>
              </div>
              <div className="p-3 bg-white">
                <p className="text-[13px] font-extrabold text-neutral-900 truncate">
                  {item.title}
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  {item.region}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-1.5 mt-4">
        {caseItems.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className="rounded-full transition-all"
            style={{
              width: i === activeIdx ? 20 : 6,
              height: 6,
              background: i === activeIdx ? "#1a5cff" : "#d1d5db",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function YouTubeFacade({ videoId }: { videoId: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="relative aspect-video overflow-hidden rounded-2xl cursor-pointer"
      style={{ background: "#000" }}
      onClick={() => setLoaded(true)}>
      {loaded ? (
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="리스토리 가죽 교체 시공 영상"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt="리스토리 가죽 교체 시공 영상 썸네일"
            className="h-full w-full object-cover"
            style={{ opacity: 0.74 }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: "rgba(255,0,0,0.92)" }}>
              <div
                style={{
                  width: 0,
                  height: 0,
                  marginLeft: 4,
                  borderTop: "11px solid transparent",
                  borderBottom: "11px solid transparent",
                  borderLeft: "18px solid white",
                }}
              />
            </div>
            <p className="text-[13px] font-bold text-white/80">
              실제 가죽 교체 시공 영상 보기
            </p>
          </div>
        </>
      )}
    </div>
  );
}

interface Props {
  keyword?: string;
}

export default function MeetingTableLeatherLanding({ keyword }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { region, tableWord, materialWord } = parseKeyword(keyword);

  const pageTitle = region
    ? `${region} ${tableWord}\n${materialWord} 교체`
    : "회의실 테이블\n인조가죽 교체";

  const pageSub = region
    ? `${region} 사무실 방문 시공 · 상판 가죽 벗겨짐·오염·갈라짐 교체`
    : "중역 테이블 상판 가죽, 새로 사지 말고 교체하세요";

  const targetUrl = keyword
    ? `https://www.restorystudio.co.kr/leather/${keyword}`
    : "https://www.restorystudio.co.kr/leather/회의실-테이블-인조가죽-교체";

  return (
    <main
      className="bg-white"
      style={{
        fontFamily:
          "'Wanted Sans Variable','Wanted Sans',-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif",
      }}>
      <ServiceJsonLd
        name={
          region
            ? `${region} ${tableWord} ${materialWord} 교체`
            : "회의실 테이블 인조가죽 교체"
        }
        description="회의실 테이블·중역 테이블 상판 인조가죽 교체 전문. 가죽 벗겨짐, 오염, 갈라짐을 새 인조가죽으로 교체합니다."
        url={targetUrl}
      />
      <FAQJsonLd faqs={FAQ_ITEMS} />

      <section
        className="relative overflow-hidden"
        style={{ background: "#0a1628", minHeight: "100svh" }}>
        <div className="absolute inset-0 md:hidden">
          <Image
            src="/images/cases/case-014-after.jpg"
            alt=""
            fill
            className="object-cover"
            style={{ opacity: 0.48 }}
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(10,22,40,0.1) 20%, #0a1628 100%)",
            }}
          />
        </div>

        <div
          className="relative z-10 mx-auto max-w-7xl flex flex-col md:flex-row"
          style={{ minHeight: "100svh" }}>
          <div className="flex-1 flex flex-col justify-end pb-10 pt-20 px-6 md:flex-none md:w-[54%] md:justify-center md:px-16 md:py-24 md:flex-shrink-0">
            <FadeIn>
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-5"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}>
                <Image
                  src="/images/logo.png"
                  alt="리스토리"
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <span className="text-[12px] font-bold text-white/70">
                  {region
                    ? `${region} 회의실 테이블 가죽 교체`
                    : "리스토리 테이블 가죽 교체"}
                </span>
              </div>

              <h1
                className="font-black text-white leading-[1.15] mb-3 whitespace-pre-line"
                style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}>
                {pageTitle}
              </h1>
              <p
                className="font-medium text-white/60 mb-4"
                style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)" }}>
                {pageSub}
              </p>

              <div
                className="inline-flex items-baseline gap-2 rounded-2xl px-4 py-2.5 mb-8"
                style={{
                  background: "rgba(26,92,255,0.25)",
                  border: "1px solid rgba(26,92,255,0.4)",
                }}>
                <span className="text-[22px] font-black text-white">
                  새 테이블 구매 전
                </span>
                <span className="text-[13px] font-medium text-white/50">
                  상판 가죽만 먼저 확인
                </span>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:gap-3">
                <a
                  href={KAKAO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 rounded-2xl font-black text-[16px]"
                  style={{
                    background: "#FEE500",
                    color: "#1a1a1a",
                    padding: "18px 28px",
                  }}>
                  카카오로 사진 보내기
                </a>
                <a
                  href={PHONE}
                  className="flex items-center justify-center gap-2 rounded-2xl font-bold text-white text-[15px]"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    padding: "14px 24px",
                  }}>
                  전화 문의
                </a>
              </div>

              <div className="mt-8 flex items-center gap-6">
                {[
                  { n: "상판만", l: "부분 교체" },
                  { n: "현장", l: "방문 시공" },
                  { n: "무상", l: "마감 A/S" },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="text-[15px] font-black text-white">{s.n}</p>
                    <p className="text-[11px] text-white/40">{s.l}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          <div className="hidden md:block md:w-[46%] relative flex-shrink-0">
            <Image
              src="/images/cases/case-014-after.jpg"
              alt="회의실 테이블 인조가죽 교체"
              fill
              className="object-cover"
              style={{ opacity: 0.82 }}
              priority
              sizes="46vw"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, #0a1628 0%, transparent 42%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, #0a1628 0%, transparent 22%)",
              }}
            />
          </div>
        </div>
      </section>

      {region && (
        <section className="px-5 py-4" style={{ background: "#1a5cff" }}>
          <div className="mx-auto max-w-lg text-center">
            <p className="text-[14px] font-black text-white">
              {region} 사무실 방문 가능 · 회의 일정에 맞춰 작업 조율
            </p>
          </div>
        </section>
      )}

      {region && (
        <section className="px-5 py-10" style={{ background: "#ffffff" }}>
          <div className="mx-auto max-w-lg">
            <h2
              className="text-[20px] font-black mb-3"
              style={{ color: "#111827" }}>
              {region} {tableWord} {materialWord} 교체
            </h2>
            <p className="text-[14px] leading-[1.8] text-neutral-600">
              {region} 지역 회의실·중역 테이블 상판 가죽 교체는 리스토리가
              방문 작업으로 해결합니다. 새 테이블 구매보다 부담을 낮추고, 회의
              일정과 업무 시간에 맞춰 작업 시간을 조율합니다. 사진 3장만
              보내주시면 {region} 방문 가능 여부와 교체 범위를 바로
              안내해드립니다.
            </p>
          </div>
        </section>
      )}

      <section className="px-5 py-14 md:py-20" style={{ background: "#f8f9fb" }}>
        <div className="mx-auto max-w-lg">
          <FadeIn>
            <p className="text-[12px] font-bold tracking-widest text-[#1a5cff] mb-2">
              BEFORE / AFTER
            </p>
            <h2
              className="font-black leading-[1.2] mb-8"
              style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)" }}>
              상판 가죽만 바꿔도
              <br />
              회의실 분위기가 달라집니다
            </h2>
          </FadeIn>

          <FadeIn delay={80}>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                {
                  img: "/images/cases/case-014-before.jpg",
                  label: "BEFORE",
                  dark: true,
                },
                {
                  img: "/images/cases/case-014-after.jpg",
                  label: "AFTER",
                  dark: false,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="relative overflow-hidden rounded-2xl aspect-[3/4]">
                  <Image
                    src={item.img}
                    alt={"회의실 테이블 가죽 교체 " + item.label}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 px-3 py-2.5"
                    style={{
                      background: item.dark
                        ? "linear-gradient(to top, rgba(0,0,0,0.72), transparent)"
                        : "linear-gradient(to top, rgba(26,92,255,0.72), transparent)",
                    }}>
                    <span className="text-[13px] font-black text-white tracking-widest">
                      {item.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div
              className="rounded-2xl px-5 py-4 text-center"
              style={{ background: "#1a5cff" }}>
              <p className="text-[15px] font-black text-white">
                같은 테이블입니다
              </p>
              <p className="text-[12px] text-white/60 mt-0.5">
                상판 인조가죽만 교체했습니다
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={150}>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div
                className="rounded-2xl p-4 text-center"
                style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
                <p className="text-[11px] font-semibold text-neutral-400 mb-1">
                  새 회의 테이블 구매
                </p>
                <p
                  className="text-[22px] font-black"
                  style={{ color: "#ef4444" }}>
                  수십~수백만원
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  + 운반·폐기 부담
                </p>
              </div>
              <div
                className="rounded-2xl p-4 text-center"
                style={{ background: "#eef4ff", border: "1px solid #c7d7ff" }}>
                <p className="text-[11px] font-semibold text-[#1a5cff] mb-1">
                  리스토리 상판 교체
                </p>
                <p
                  className="text-[22px] font-black"
                  style={{ color: "#1a5cff" }}>
                  부분 리폼
                </p>
                <p className="text-[11px] text-[#1a5cff]/60 mt-1">
                  + 일정 맞춤 작업
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={180}>
            <div
              className="mt-4 overflow-hidden rounded-2xl"
              style={{ border: "1px solid #e5e7eb" }}>
              <div className="p-5" style={{ background: "#fff" }}>
                <p className="text-[11px] font-bold tracking-widest text-neutral-400 mb-3">
                  QUALITY PROOF
                </p>
                <h3 className="text-[18px] font-black text-neutral-900 leading-[1.3] mb-1">
                  넓은 상판이라 더 두꺼운 자재가 필요합니다
                </h3>
                <p className="text-[13px] leading-[1.7] text-neutral-500 mb-5">
                  회의실 테이블은 손, 노트북, 문서가 계속 닿는 면적이 넓습니다.
                  <br />
                  리스토리는 <strong className="text-neutral-800">국내산 인조가죽</strong>
                  을 기준으로 샘플을 비교해 안내합니다.
                </p>
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] font-semibold text-neutral-400">
                        기존 저가형 가죽
                      </span>
                      <span className="text-[13px] font-black text-neutral-400">
                        얇은 마감
                      </span>
                    </div>
                    <div
                      className="h-3 rounded-full overflow-hidden"
                      style={{ background: "#f3f4f6" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: "28%", background: "#d1d5db" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="text-[12px] font-bold"
                        style={{ color: "#1a5cff" }}>
                        리스토리 국내산
                      </span>
                      <span
                        className="text-[13px] font-black"
                        style={{ color: "#1a5cff" }}>
                        두꺼운 마감
                      </span>
                    </div>
                    <div
                      className="h-3 rounded-full overflow-hidden"
                      style={{ background: "#eef4ff" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: "82%", background: "#1a5cff" }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl py-3"
                  style={{ background: "#eef4ff" }}>
                  <span
                    className="text-[16px] font-black"
                    style={{ color: "#1a5cff" }}>
                    두께감 있는 자재
                  </span>
                  <span
                    className="text-[14px] font-bold"
                    style={{ color: "rgba(26,92,255,0.5)" }}>
                    상판에 맞게 선택
                  </span>
                </div>
              </div>
              <div
                className="grid grid-cols-2 border-t"
                style={{ borderColor: "#f3f4f6" }}>
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: "4/3" }}>
                  <Image
                    src="/images/chair/leather-china.jpg"
                    alt="기존 저가형 가죽 두께 비교"
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                  <div
                    className="absolute inset-0 flex flex-col justify-end p-3"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.65), transparent)",
                    }}>
                    <p className="text-[10px] font-semibold text-white/70">
                      기존 저가형
                    </p>
                    <p className="text-[14px] font-black text-white">
                      얇은 마감
                    </p>
                  </div>
                </div>
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: "4/3" }}>
                  <Image
                    src="/images/chair/leather-korea.jpg"
                    alt="리스토리 국내산 가죽 두께 비교"
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                  <div
                    className="absolute inset-0 flex flex-col justify-end p-3"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(26,92,255,0.7), transparent)",
                    }}>
                    <p className="text-[10px] font-semibold text-white/70">
                      리스토리 국내산
                    </p>
                    <p className="text-[14px] font-black text-white">
                      두꺼운 마감
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={220}>
            <div
              className="mt-4 overflow-hidden rounded-2xl"
              style={{ border: "1px solid #e5e7eb" }}>
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: "16/9" }}>
                <Image
                  src="/images/chair/factory-1.jpg"
                  alt="리스토리 가죽 직매입 창고"
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[11px] font-bold tracking-widest text-white/50 mb-1">
                    WHY SO AFFORDABLE
                  </p>
                  <h3 className="text-[22px] font-black text-white leading-[1.2] mb-1">
                    이 창고에서 직접 가져옵니다
                  </h3>
                  <p className="text-[13px] text-white/60">
                    국내산 인조가죽 샘플 · 중간 유통 최소화
                  </p>
                </div>
              </div>
              <div className="p-5" style={{ background: "#fff" }}>
                <p className="text-[13px] leading-[1.7] text-neutral-500">
                  도매상·유통사를 거치지 않고 가죽 공장에서 직접 가져오는
                  구조라 넓은 테이블 상판도 품질을 낮추지 않고 합리적인
                  견적으로 안내할 수 있습니다.
                </p>
                <div
                  className="mt-4 flex items-center justify-center gap-3 rounded-xl py-3.5"
                  style={{ background: "#0a1628" }}>
                  <span className="text-[17px] font-black text-white">
                    공장가에 가까운 견적
                  </span>
                  <span className="text-[12px] text-white/40">
                    품질 타협 없이
                  </span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <LeatherSampleSection />

      <section className="px-5 py-14 md:py-20" style={{ background: "#fff" }}>
        <div className="mx-auto max-w-2xl">
          <FadeIn>
            <div className="flex items-end gap-3 mb-8">
              <div>
                <p className="text-[12px] font-bold tracking-widest text-[#1a5cff] mb-1">
                  REVIEWS
                </p>
                <h2
                  className="font-black leading-[1.2]"
                  style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)" }}>
                  직접 맡긴 사무실들
                </h2>
              </div>
              <div className="ml-auto text-right pb-1 flex-shrink-0">
                <p
                  className="text-[28px] font-black"
                  style={{ color: "#1a5cff" }}>
                  4.9★
                </p>
                <p className="text-[11px] text-neutral-400">시공 만족도</p>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                img: "/images/cases/case-014-after.jpg",
                count: "회의실",
                unit: "상판 가죽 교체",
                area: "서울 강남구",
                name: "법인 고객",
                quote:
                  "테이블을 새로 사야 하나 고민했는데 상판만 바꾸니 회의실 분위기가 바로 달라졌습니다.",
                tag: "업무 전 작업",
              },
              {
                img: "/images/cases/case-012-after.jpg",
                count: "중역실",
                unit: "인조가죽 마감",
                area: "인천 송도",
                name: "사무실 고객",
                quote:
                  "가죽 샘플 보고 고를 수 있어서 좋았고, 일정 맞춰 방문해주셔서 업무 지장 없이 끝났습니다.",
                tag: "일정 조율",
              },
            ].map((r, i) => (
              <FadeIn key={r.name} delay={i * 80}>
                <div
                  className="overflow-hidden rounded-2xl h-full"
                  style={{ border: "1px solid #e5e7eb" }}>
                  <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
                    <Image
                      src={r.img}
                      alt={r.name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                    <div
                      className="absolute inset-0 flex flex-col justify-end p-4"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)",
                      }}>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-[11px] font-semibold text-white/60">
                            {r.unit}
                          </p>
                          <p
                            className="font-black text-white leading-none"
                            style={{ fontSize: "clamp(2rem, 6vw, 2.8rem)" }}>
                            {r.count}
                          </p>
                        </div>
                        <span
                          className="rounded-full px-3 py-1.5 text-[11px] font-black"
                          style={{ background: "#eef4ff", color: "#1a5cff" }}>
                          {r.tag}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-[12px] text-neutral-400 mb-2">
                      {r.name} · {r.area}
                    </p>
                    <p className="text-[14px] leading-[1.7] text-neutral-700">
                      <span
                        style={{
                          color: "#1a5cff",
                          fontWeight: 900,
                          fontSize: 16,
                        }}>
                        "
                      </span>
                      {r.quote}
                      <span
                        style={{
                          color: "#1a5cff",
                          fontWeight: 900,
                          fontSize: 16,
                        }}>
                        "
                      </span>
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={100}>
            <TableCaseStrip region={region} />
          </FadeIn>
        </div>
      </section>

      <section
        className="px-5 py-14 md:py-20"
        style={{ background: "#f8f9fb" }}>
        <div className="mx-auto max-w-lg">
          <FadeIn>
            <p className="text-[12px] font-bold tracking-widest text-[#1a5cff] mb-2">
              HOW IT WORKS
            </p>
            <h2
              className="font-black leading-[1.2] mb-2"
              style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)" }}>
              사진 한 장이면
              <br />
              나머지는 저희가 합니다
            </h2>
            <p className="text-[14px] text-neutral-400 mb-10">
              회의 전·후, 업무 시간에 맞춰 조율 가능합니다
            </p>
          </FadeIn>
          <div className="flex flex-col gap-3">
            {[
              {
                step: "01",
                icon: "📷",
                title: "사진 보내기",
                desc: "테이블 전체 사진과 상판 손상 부위 사진을 카카오로 보내주세요. 교체 가능 여부를 먼저 확인해드립니다.",
                time: "30초",
              },
              {
                step: "02",
                icon: "🔍",
                title: "방문 견적",
                desc: "원하는 날짜·시간에 방문해서 상판 크기, 모서리 마감, 가죽 샘플을 확인하고 정확한 금액을 안내드립니다.",
                time: "무료",
              },
              {
                step: "03",
                icon: "✅",
                title: "일정 맞춤 시공",
                desc: "회의 일정과 업무 시간을 피해 기존 가죽 제거, 표면 정리, 새 인조가죽 마감까지 진행합니다.",
                time: "일정 조율",
              },
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div
                  className="flex gap-4 rounded-2xl p-5"
                  style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-[18px]"
                      style={{ background: "#eef4ff" }}>
                      {s.icon}
                    </div>
                    {i < 2 && (
                      <div
                        className="w-px flex-1 mt-2"
                        style={{ background: "#e5e7eb", minHeight: 24 }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-black text-neutral-300">
                        {s.step}
                      </span>
                      <span className="text-[15px] font-black text-neutral-900">
                        {s.title}
                      </span>
                      <span
                        className="ml-auto rounded-full px-2.5 py-1 text-[11px] font-bold flex-shrink-0"
                        style={{ background: "#eef4ff", color: "#1a5cff" }}>
                        {s.time}
                      </span>
                    </div>
                    <p className="text-[13px] leading-[1.6] text-neutral-500">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={200}>
            <a
              href={KAKAO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2.5 rounded-2xl text-[15px] font-black"
              style={{
                background: "#FEE500",
                color: "#1a1a1a",
                padding: "18px 24px",
              }}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.62 6.1 4.077 6.569l-1.04 3.847a.3.3 0 0 0 .461.324l4.666-3.1A11.66 11.66 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
              </svg>
              사진 보내고 견적 받기
            </a>
          </FadeIn>
        </div>
      </section>

      <section className="px-5 py-14 md:py-20" style={{ background: "#fff" }}>
        <div className="mx-auto max-w-lg">
          <FadeIn>
            <p className="text-[12px] font-bold tracking-widest text-[#1a5cff] mb-2">
              TRUST
            </p>
            <h2
              className="font-black leading-[1.2] mb-8"
              style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)" }}>
              사무실 작업이라도
              <br />
              걱정 없게 준비합니다
            </h2>
          </FadeIn>
          <div className="flex flex-col gap-3 mb-10">
            {[
              {
                icon: "A/S",
                title: "마감 불량 무상 보완",
                desc: "시공 후 들뜸이나 마감 미흡이 확인되면 무상으로 다시 방문해 보완합니다.",
              },
              {
                icon: "보험",
                title: "생산물 배상책임보험 가입",
                desc: "현장 작업 중 예상치 못한 문제가 생겨도 보험 기준에 따라 책임 있게 대응합니다.",
              },
              {
                icon: "견적",
                title: "방문 전 견적 범위 안내",
                desc: "사진으로 상판 상태를 먼저 확인하고, 방문 전 교체 가능 여부와 비용 범위를 안내합니다.",
              },
            ].map((t, i) => (
              <FadeIn key={t.title} delay={i * 60}>
                <div
                  className="flex gap-4 rounded-2xl p-5"
                  style={{
                    background: "#f8f9fb",
                    border: "1px solid #e5e7eb",
                  }}>
                  <span
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-black"
                    style={{ background: "#eef4ff", color: "#1a5cff" }}>
                    {t.icon}
                  </span>
                  <div>
                    <p className="text-[15px] font-black text-neutral-900 mb-1">
                      {t.title}
                    </p>
                    <p className="text-[13px] leading-[1.6] text-neutral-500">
                      {t.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={150}>
            <div className="grid grid-cols-2 gap-3">
              {[
                { src: "/images/cert-5.png", alt: "생산물 배상책임보험" },
                { src: "/images/cert-4.png", alt: "리스토리 A/S 보증" },
              ].map((c) => (
                <div
                  key={c.src}
                  className="overflow-hidden rounded-2xl"
                  style={{ border: "1px solid #e5e7eb" }}>
                  <div className="aspect-[3/4] bg-neutral-50 p-3">
                    <Image
                      src={c.src}
                      alt={c.alt}
                      width={300}
                      height={400}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <p className="text-center py-3 text-[12px] font-bold text-neutral-500 bg-neutral-50">
                    {c.alt}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="px-5 py-14 md:py-20" style={{ background: "#0a1628" }}>
        <div className="mx-auto max-w-lg">
          <FadeIn>
            <p className="text-[12px] font-bold tracking-widest text-white/30 mb-2">
              REAL VIDEO
            </p>
            <h2
              className="font-black leading-[1.2] mb-8 text-white"
              style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)" }}>
              실제 가죽 교체 작업은
              <br />
              이렇게 진행됩니다
            </h2>
          </FadeIn>
          <FadeIn delay={80}>
            <YouTubeFacade videoId="mvMybNNafKk" />
          </FadeIn>
        </div>
      </section>

      <section className="px-5 py-14 md:py-20" style={{ background: "#f8f9fb" }}>
        <div className="mx-auto max-w-lg">
          <FadeIn>
            <p className="text-[12px] font-bold tracking-widest text-[#1a5cff] mb-2">
              FAQ
            </p>
            <h2
              className="font-black leading-[1.2] mb-8"
              style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)" }}>
              자주 묻는 질문
            </h2>
          </FadeIn>
          <div className="flex flex-col gap-2">
            {FAQ_ITEMS.map((f, i) => (
              <FadeIn key={f.q} delay={i * 50}>
                <div
                  className="overflow-hidden rounded-2xl bg-white"
                  style={{ border: "1px solid #e5e7eb" }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}>
                    <span className="pr-4 text-[14px] font-bold text-neutral-900 md:text-[15px]">
                      {f.q}
                    </span>
                    <span
                      className="flex-shrink-0 text-[14px] font-bold transition-transform duration-200"
                      style={{
                        color: "#1a5cff",
                        transform: openFaq === i ? "rotate(180deg)" : "none",
                      }}>
                      ▾
                    </span>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: openFaq === i ? 180 : 0 }}>
                    <p className="px-5 pb-4 pt-1 text-[13px] leading-[1.75] text-neutral-500 border-t border-neutral-100">
                      {f.a}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:py-24" style={{ background: "#0a1628" }}>
        <div className="mx-auto max-w-lg text-center">
          <FadeIn>
            <p
              className="text-[13px] font-bold tracking-widest mb-4"
              style={{ color: "rgba(255,255,255,0.3)" }}>
              사진으로 먼저 확인하세요
            </p>
            <h2
              className="font-black text-white leading-[1.2] mb-3 whitespace-pre-line"
              style={{ fontSize: "clamp(1.8rem, 6vw, 3rem)" }}>
              {region
                ? `${region} 테이블 사진 한 장이면\n가능 여부를 안내드립니다`
                : "테이블 사진 한 장이면\n가능 여부를 안내드립니다"}
            </h2>
            <p
              className="text-[14px] mb-8"
              style={{ color: "rgba(255,255,255,0.4)" }}>
              전체 사진 + 손상 부위 사진 + 지역만 보내주세요
            </p>
            <div className="flex flex-col gap-3 max-w-sm mx-auto">
              <a
                href={KAKAO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 rounded-2xl text-[16px] font-black"
                style={{
                  background: "#FEE500",
                  color: "#1a1a1a",
                  padding: "20px 24px",
                }}>
                카카오로 사진 보내기
              </a>
              <a
                href={PHONE}
                className="flex items-center justify-center gap-2 rounded-2xl text-[15px] font-bold text-white"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  padding: "16px 24px",
                }}>
                010-6855-0957
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <FloatingCTA />
    </main>
  );
}
