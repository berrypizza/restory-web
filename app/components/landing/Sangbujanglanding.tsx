"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/app/components/FadeIn";
import FloatingCTA from "@/app/components/landing/shared/FloatingCTA";
import { ServiceJsonLd, FAQJsonLd } from "@/app/components/JsonLd";
import { buildTrackedContactPath } from "@/lib/attribution";
import { cases } from "@/lib/case-data";
import { REGIONS } from "@/lib/seo-regions";

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const PHONE = buildTrackedContactPath("phone", "sangbujang");
const KAKAO_URL = buildTrackedContactPath("kakao", "sangbujang");
const SITE_URL = "https://www.restorystudio.co.kr";
type SangbujangCase = (typeof cases)[number];

const PRICE_EXAMPLES = [
  { condition: "일반적인 처짐", price: "25만 원" },
  { condition: "처짐·손상이 심한 경우", price: "30만 원" },
  { condition: "추락한 상부장 수리", price: "35만 원" },
];

const CASE_COMPARISONS: Record<string, { before: string; after: string; summary: string }> = {
  "case-128": {
    before: "왼쪽 장이 처지고 상단이 벌어진 상태",
    after: "보강·재설치 후 장 높이와 문짝 라인을 맞춘 상태",
    summary: "뒤쪽 시공목의 상태를 확인하고, 문제 부위를 보강해 다시 설치했습니다.",
  },
  "case-125": {
    before: "오른쪽 끝 상부장과 천장 사이에 생긴 틈",
    after: "재고정 후 벌어진 상단과 문짝 라인을 맞춘 상태",
    summary: "기존 장을 다시 사용할 수 있는지 확인한 뒤 고정 상태와 상단 라인을 정리했습니다.",
  },
};

const FAQ_ITEMS = [
  {
    q: "상부장이 처졌는데 전체를 교체해야 하나요?",
    a: "꼭 전체를 교체해야 하는 것은 아닙니다.\n\n상부장 몸통의 파손이 심하지 않고 다시 힘을 받을 수 있는 상태라면, 기존 장을 내린 뒤 벽 고정 상태와 시공목을 확인하고 약해진 부분을 보강해 다시 설치할 수 있습니다.\n\n다만 판재가 넓게 터졌거나 물에 불어 강도가 떨어진 경우에는 기존 장을 살리기보다 새 상부장 제작이 필요할 수 있습니다. 사진으로 예상 범위를 먼저 확인하고, 정확한 상태는 현장에서 판단합니다.",
  },
  {
    q: "나사만 다시 박는 수리와 시공목 보강은 뭐가 다른가요?",
    a: "상부장이 처진 원인이 벽 뒤의 시공목이나 장 고정부 약화라면, 빠진 나사를 같은 자리에 다시 박는 것만으로는 충분한 고정력을 얻기 어려울 수 있습니다.\n\n리스토리 스튜디오는 상부장을 내려 실제 고정 상태를 확인하고, 필요한 경우 합판·각재·칼블럭·앙카 등을 사용해 힘을 받는 부분을 보강합니다.\n\n이후 상부장을 다시 설치하고 레이저로 수평과 문짝 닫힘 상태를 맞춥니다. 사용 자재와 고정 방식은 벽과 장의 구조에 따라 달라집니다.",
  },
  {
    q: "사진만 보내도 수리 가능 여부를 확인할 수 있나요?",
    a: "안전하게 찍을 수 있는 상부장 전체 사진부터 보내주세요. 가능하면 벌어지거나 처진 부분이 보이는 사진도 함께 보내주시면 예상 범위를 살피는 데 도움이 됩니다. 사진을 찍으려고 장을 움직이거나 무리하게 올라가지 마세요.\n\n사진과 함께 작업 지역, 문 걸림·틈 벌어짐·기울어짐 같은 현재 증상을 적어주세요.\n\n사진으로는 예상 범위를 먼저 안내합니다. 내부 파손 정도와 정확한 작업 범위는 현장 점검이나 상부장 분리 후 확인합니다.",
  },
  {
    q: "상부장 수리 비용과 작업 시간은 어떻게 되나요?",
    a: "상태별 비용 예시는 일반적인 처짐 25만 원, 처짐·손상이 심한 경우 30만 원, 추락한 상부장 수리 35만 원이며, 모두 부가세 별도입니다. 정액이나 최대 금액이 아닌 예시로, 상태와 파손 범위에 따라 달라질 수 있습니다. 필요한 작업과 최종 금액은 상담에서 확정하며, 확정한 금액은 이후 달라지지 않습니다.\n\n작업에는 상부장을 내린 뒤 고정 상태를 확인하고, 시공목과 약해진 부분을 보강한 후 재설치와 수평 조절을 진행하는 과정이 포함됩니다.\n\n일반적인 현장 작업 시간은 약 2시간으로, 상태와 작업 범위에 따라 달라질 수 있습니다. 방문일은 상담 후 조율합니다.",
  },
  {
    q: "상담 후 추가금이 생기거나, 수리가 불가능하면요?",
    a: "상담에서 확정한 수리 금액은 이후 달라지지 않습니다. 추락으로 파손된 부위에 추가 작업이 필요하다면, 그에 따른 추가금도 상담 시 미리 안내합니다.\n\n수리 불가로 판단된 경우에는 비용을 받지 않습니다.",
  },
  {
    q: "작업 전에 고객이 준비할 것은 무엇인가요?",
    a: "처짐이 심하거나 벽과의 틈이 벌어지는 상태라면 장을 당기거나 직접 분리하지 말고, 아래 공간의 사용을 피한 채 먼저 상담해주세요. 사진도 무리하게 올라가거나 장을 움직이지 않고 찍을 수 있는 위치에서 보내주세요.\n\n상부장 안의 물건을 비우거나 주변 물건을 옮기는 준비는 상태를 확인한 뒤 안내드립니다. 방문 전 준비 범위를 함께 확인해주세요.",
  },
  {
    q: "A/S 3년은 어떤 범위인가요?",
    a: "작업일 기준 3년 동안 리스토리 스튜디오가 보강하고 다시 고정한 시공 부위에 무상 A/S를 적용합니다.\n\n수리한 고정부위의 이탈이나 설치 상태, 수평 조절처럼 이번 시공과 직접 관련된 문제가 발생하면 사진을 먼저 확인한 뒤 필요한 조치를 안내합니다.\n\n외부 충격, 누수와 물먹음, 기존 상부장 판재의 추가 노후화, 고객 또는 다른 작업자가 임의로 분해·변경한 경우처럼 시공과 직접 관련이 없는 문제는 무상 A/S 범위에서 제외될 수 있습니다.",
  },
];

/* ─────────────────────────────────────────
   keyword → 지역·증상 파싱
───────────────────────────────────────── */
function parseKeyword(keyword: string): { region: string; symptom: string } {
  const kw = keyword.replace(/-/g, " ");
  const region = REGIONS.find((r) => kw.includes(r)) ?? "";
  const symptom = kw.includes("처짐")
    ? "처짐"
    : kw.includes("떨어짐")
      ? "떨어짐"
      : kw.includes("들뜸")
        ? "들뜸"
        : kw.includes("내려앉음")
          ? "내려앉음"
          : kw.includes("수리")
            ? "수리"
            : "처짐";
  return { region, symptom };
}

function YouTubeFacade({ videoId }: { videoId: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
      {loaded ? (
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="리스토리 상부장 수리 시공 영상"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          aria-label="상부장 실제 시공 영상 재생"
          className="relative h-full w-full cursor-pointer focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-[#FEE500]"
        >
          <Image
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            fill
            unoptimized
            className="object-cover opacity-70"
            sizes="(min-width: 768px) 640px, 100vw"
          />
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span
              className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-2xl text-white"
              aria-hidden="true"
            >
              ▶
            </span>
            <span className="text-sm font-bold text-white">
              실제 시공 영상 보기
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

function RegionalCaseItemListJsonLd({
  name,
  items,
}: {
  name: string;
  items: SangbujangCase[];
}) {
  if (items.length === 0) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/cases/${item.id}`,
      item: {
        "@type": "Article",
        headline: item.title,
        description: item.summary,
        image: `${SITE_URL}${item.afterImg}`,
        url: `${SITE_URL}/cases/${item.id}`,
        datePublished: item.date,
        author: {
          "@type": "Organization",
          name: "리스토리 스튜디오",
        },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function ContactButtons({
  dark = false,
  compact = false,
  label = "카카오로 수리 범위·비용 확인",
}: {
  dark?: boolean;
  compact?: boolean;
  label?: string;
}) {
  return (
    <div
      data-upper-contact
      className={`flex flex-col lg:flex-row lg:gap-3 ${compact ? "gap-0" : "gap-3"}`}
    >
      <a
        href={KAKAO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-14 items-center justify-center rounded-2xl bg-[#FEE500] px-5 py-4 text-[15px] font-black text-neutral-900"
      >
        {label}
      </a>
      <a
        href={PHONE}
        className={`flex items-center justify-center font-bold ${compact ? "min-h-11 px-4 py-2 text-[13px] underline underline-offset-4" : "min-h-14 rounded-2xl border px-5 py-4 text-[15px]"} ${dark ? (compact ? "text-white/80" : "border-white/20 bg-white/10 text-white") : "border-neutral-200 bg-white text-neutral-800"}`}
      >
        전화 문의
      </a>
    </div>
  );
}

const latestSangbujangCases = cases
  .filter((item) => item.category === "상부장 처짐")
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export default function SangbujangLanding({ keyword }: { keyword?: string }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { region, symptom } = keyword
    ? parseKeyword(keyword)
    : { region: "", symptom: "처짐" };
  const regionalCases = region
    ? latestSangbujangCases.filter((item) => item.region.includes(region))
    : [];
  const regionalIds = new Set(regionalCases.map((item) => item.id));
  const featuredCases = region
    ? [
        ...regionalCases.slice(0, 3),
        ...latestSangbujangCases
          .filter((item) => !regionalIds.has(item.id))
          .slice(0, Math.max(0, 3 - regionalCases.length)),
      ]
    : latestSangbujangCases.slice(0, 3);

  return (
    <main data-service-id="sangbujang"
      className="break-keep bg-white"
      style={{
        fontFamily:
          "'Wanted Sans Variable','Wanted Sans',-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif",
      }}
    >
      <ServiceJsonLd
        name={region ? `${region} 싱크대 상부장 수리` : "싱크대 상부장 수리"}
        description="처진 상부장의 고정 상태를 확인하고 보강·재설치합니다. 상태별 비용 예시: 일반 처짐 25만 원, 심한 처짐·손상 30만 원, 추락 수리 35만 원. 모두 부가세 별도이며 상태와 파손 범위에 따라 달라질 수 있습니다. 상담에서 최종 금액을 확정하며 이후 금액 변경과 수리 불가 시 비용은 없습니다."
        url={`${SITE_URL}/repair/${keyword || "sangbujang"}`}
        includeAggregateRating={false}
      />
      <FAQJsonLd faqs={FAQ_ITEMS} />
      <RegionalCaseItemListJsonLd
        name={`${region ? `${region} 지역·` : ""}상부장 처짐 실제 수리 사례`}
        items={featuredCases}
      />

      <section data-service-section="hero" className="relative overflow-hidden bg-[#0a1628]">
        <div className="absolute inset-0 md:hidden">
          <Image
            src="/images/upper/hero-im.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a1628]" />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col md:min-h-[760px] md:flex-row">
          <div className="relative z-10 flex flex-col justify-center px-5 pb-8 pt-7 md:w-[54%] md:px-10 md:py-14 lg:px-14">
            <FadeIn>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                <Image
                  src="/images/logo.png"
                  alt="리스토리"
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <span className="text-xs font-bold text-white/80">
                  {region
                    ? `${region} 싱크대 상부장 ${symptom}${symptom === "수리" ? "" : " 수리"}`
                    : "리스토리 싱크대 상부장 처짐 수리"}
                </span>
              </div>
              <h1
                className="mb-3 whitespace-pre-line font-black leading-[1.18] tracking-tight text-white"
                style={{ fontSize: "clamp(2.05rem, 4.5vw, 3.7rem)" }}
              >
                {region
                  ? `${region} 상부장 ${symptom}\n다시 단단하게`
                  : "처진 상부장,\n다시 단단하게"}
              </h1>
              <p className="max-w-md text-[14px] leading-[1.75] text-white/80 md:text-[16px]">
                살릴 수 있는 상부장은 보강·재설치로,
                <br />
                수평과 문짝 닫힘까지 맞춥니다.
              </p>
              <div className="my-4 overflow-hidden rounded-2xl border border-white/20 bg-[#12213b]/90">
                <dl className="grid grid-cols-3 divide-x divide-white/15 py-4 text-center">
                  {[
                    {
                      label: "약해진 부위",
                      value: "고정 보강",
                      note: "",
                    },
                    { label: "현장 작업", value: "약 2시간", note: "" },
                    { label: "보강·고정부 A/S", value: "3년 무상", note: "" },
                  ].map((item) => (
                    <div key={item.label} className="px-1">
                      <dt className="text-[10px] leading-5 text-white/70 sm:text-[11px]">
                        {item.label}
                      </dt>
                      <dd className="mt-1 whitespace-nowrap text-[21px] font-black leading-tight text-white lg:text-[25px]">
                        {item.value}
                        {item.note && (
                          <span className="mt-1 block text-[11px] font-medium text-white/75">
                            {item.note}
                          </span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="border-t border-white/15 px-3 py-3">
                  <p className="text-[12px] font-bold leading-[1.7] text-white/90">
                    분리·고정부 보강·재설치·수평 조절 포함
                  </p>
                  <ul className="mt-2 space-y-1 text-[12px] font-bold leading-[1.7] text-blue-200">
                    <li>
                      <span aria-hidden="true">✓ </span>상담에서 확정한 금액 그대로
                    </li>
                    <li>
                      <span aria-hidden="true">✓ </span>수리 불가 시 비용 없음
                    </li>
                  </ul>
                  <a
                    href="#upper-cases"
                    className="mt-1 inline-flex min-h-11 items-center text-[12px] font-bold text-white/85 underline underline-offset-4"
                  >
                    실제 수리 전후 사진과 과정 보기 →
                  </a>
                </div>
              </div>
              <p className="mb-3 text-center text-[13px] font-bold leading-[1.7] text-white lg:text-left">
                사진으로 수리 범위 · 금액 · 방문일 확인
              </p>
              <ContactButtons dark compact />
              <p className="mt-2 text-center text-[12px] leading-[1.8] text-white/70 lg:text-left">
                전체 사진과 작업 지역부터 보내주세요.
                <br />틈이 보이는 사진은 안전하게 찍을 수 있을 때 함께 보내주세요.
              </p>
              <a
                href="#upper-price-examples"
                className="mt-1 inline-flex min-h-11 w-full items-center justify-center text-[12px] font-bold text-blue-200 underline underline-offset-4 lg:w-auto lg:justify-start"
              >
                상태별 수리 비용 예시 보기 →
              </a>
            </FadeIn>
          </div>
          <div className="relative hidden md:block md:w-[46%]">
            <Image
              src="/images/upper/hero.webp"
              alt="리스토리 싱크대 상부장 수리 현장"
              fill
              priority
              sizes="46vw"
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <section data-service-section="budget"
        id="upper-price-examples"
        aria-labelledby="upper-price-heading"
        className="scroll-mt-24 bg-[#eef4ff] px-5 py-10 md:py-14"
      >
        <div className="mx-auto max-w-3xl">
          <p className="mb-2 text-xs font-bold text-[#1a5cff]">
            비용 예시 · 부가세 별도
          </p>
          <h2
            id="upper-price-heading"
            className="text-[26px] font-black leading-[1.35] tracking-tight md:text-4xl"
          >
            상태별 수리 비용 예시
          </h2>
          <dl className="my-5 grid gap-3 md:grid-cols-3">
            {PRICE_EXAMPLES.map((item) => (
              <div
                key={item.condition}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[#dce6fa] bg-white px-4 py-5 md:block md:p-5"
              >
                <dt className="text-[13px] font-bold leading-[1.7] text-neutral-700">
                  {item.condition}
                </dt>
                <dd className="shrink-0 text-[26px] font-black leading-tight text-[#0a1628] md:mt-3 md:text-3xl">
                  {item.price}
                </dd>
              </div>
            ))}
          </dl>
          <p className="text-[13px] leading-[1.85] text-neutral-600">
            상태와 파손 범위에 따라 예시 금액과 달라질 수 있습니다. 필요한 작업과
            최종 금액은 사진 상담으로 먼저 안내합니다.
          </p>
          <p className="mb-5 mt-3 text-[13px] font-bold leading-[1.85] text-[#0a1628]">
            상담에서 확정한 금액은 이후 변경하지 않습니다.
            <br />
            수리 불가로 판단되면 비용을 받지 않습니다.
          </p>
          <ContactButtons compact label="사진으로 우리 집 수리비 확인" />
        </div>
      </section>

      <nav
        aria-label="상부장 수리 안내"
        className="border-b border-neutral-200 bg-white px-4"
      >
        <div className="mx-auto grid max-w-3xl grid-cols-3 text-center text-[13px] font-bold text-neutral-700">
          <a href="#upper-cases" className="px-2 py-5 hover:text-[#1a5cff]">
            실제 시공 사례
          </a>
          <a href="#upper-cost" className="px-2 py-5 hover:text-[#1a5cff]">
            비용·작업 범위
          </a>
          <a href="#upper-faq" className="px-2 py-5 hover:text-[#1a5cff]">
            자주 묻는 질문
          </a>
        </div>
      </nav>

      <section data-service-section="cases"
        id="upper-cases"
        className="scroll-mt-24 bg-[#f8f9fb] px-5 py-14 md:py-20"
      >
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-3 text-xs font-bold tracking-widest text-[#1a5cff]">
              BEFORE / AFTER
            </p>
            <h2 className="text-[28px] font-black leading-[1.3] tracking-tight md:text-4xl">
              다시 제자리를 찾은 상부장
            </h2>
            <p className="mb-8 mt-4 text-sm leading-[1.85] text-neutral-600">
              {region
                ? regionalCases.length > 0
                  ? `${region} 지역에 공개된 실제 시공 사례 ${regionalCases.length}건 중 최근 작업을 먼저 보여드립니다. 다른 지역의 참고 사례는 별도로 표시했습니다.`
                  : `${region} 지역에 공개된 사례가 아직 없어, 다른 지역의 실제 수리 사례를 참고로 보여드립니다.`
                : "처짐 위치와 원인은 현장마다 다릅니다. 실제 작업 전후 사진과 확인한 내용을 함께 살펴보세요."}
            </p>
          </FadeIn>
          <div className="space-y-6">
            {featuredCases.map((item, index) => (
              <FadeIn key={item.id} delay={index * 50}>
                <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                  <Link href={`/cases/${item.id}`} className="block">
                    <div className={`grid gap-px bg-neutral-200 ${index === 0 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2"}`}>
                      {[
                        { label: "수리 전", src: item.beforeImg },
                        { label: "수리 후", src: item.afterImg },
                      ].map((photo) => (
                        <figure
                          key={photo.label}
                          className="bg-white"
                        >
                          <div className={`relative overflow-hidden bg-neutral-100 ${index === 0 ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
                          <Image
                            src={photo.src}
                            alt={`${item.title} ${photo.label}`}
                            fill
                            className="object-cover"
                            style={index === 0 && item.id === "case-128" ? { transform: "scale(1.25)", transformOrigin: "45% 40%" } : undefined}
                            sizes={index === 0 ? "(min-width: 768px) 384px, (min-width: 640px) 50vw, 100vw" : "(min-width: 768px) 384px, 50vw"}
                          />
                          <span
                            className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-[11px] font-black text-white ${photo.label === "수리 후" ? "bg-[#1a5cff]" : "bg-black/70"}`}
                          >
                            {photo.label}
                          </span>
                          </div>
                          {index === 0 && CASE_COMPARISONS[item.id] && (
                            <figcaption className="px-4 py-3 text-[13px] font-bold leading-[1.7] text-neutral-800">
                              {photo.label === "수리 전" ? CASE_COMPARISONS[item.id].before : CASE_COMPARISONS[item.id].after}
                            </figcaption>
                          )}
                        </figure>
                      ))}
                    </div>
                    <div className="p-5 md:p-7">
                      {index === 0 && (
                        <p className="mb-3 text-[11px] leading-[1.7] text-neutral-500">
                          같은 현장의 실제 전후 사진입니다. 촬영 위치·각도는 서로 다릅니다.
                          {item.id === "case-128" && " 왼쪽 장이 잘 보이도록 확대했습니다."}
                        </p>
                      )}
                      <p className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold text-[#1a5cff]">
                        <span>
                          {item.region} · {item.date.replaceAll("-", ".")}
                        </span>
                        {region && !item.region.includes(region) && (
                          <span className="rounded-full bg-neutral-100 px-2 py-1 text-neutral-500">
                            다른 지역 참고 사례
                          </span>
                        )}
                      </p>
                      <h3 className="text-lg font-black leading-snug text-neutral-950 md:text-xl">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-[1.85] text-neutral-600">
                        {CASE_COMPARISONS[item.id]?.summary ?? item.summary}
                      </p>
                      <p className="mt-4 text-sm font-bold text-[#1a5cff]">
                        원인과 수리 과정 보기 →
                      </p>
                    </div>
                  </Link>
                  {item.review && (
                    <blockquote className="mx-5 mb-5 rounded-xl bg-[#f8f9fb] p-4 md:mx-7 md:mb-7">
                      <p className="mb-2 text-[11px] font-bold text-neutral-500">
                        이 사례에 등록된 고객 후기 · {item.review.author}
                      </p>
                      <p className="text-[13px] leading-[1.8] text-neutral-700">
                        “{item.review.content}”
                      </p>
                    </blockquote>
                  )}
                </article>
              </FadeIn>
            ))}
          </div>
          <Link
            href={`/cases?cat=${encodeURIComponent("상부장 처짐")}`}
            className="mt-6 inline-flex min-h-11 items-center text-sm font-bold text-[#1a5cff]"
          >
            상부장 처짐 사례 전체 보기 →
          </Link>
        </div>
      </section>

      <section data-service-section="scope" className="px-5 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-3 text-xs font-bold tracking-widest text-[#1a5cff]">
              REPAIR SCOPE
            </p>
            <h2 className="text-[28px] font-black leading-[1.3] tracking-tight md:text-4xl">
              겉의 틈부터, 뒤쪽 고정까지
            </h2>
            <p className="mb-8 mt-4 text-sm leading-[1.85] text-neutral-600">
              틈만 가리는 것으로 끝내지 않고, 장이 힘을 받는 부분을 확인합니다.
              벽과 장의 상태에 맞춰 보강 방법을 정합니다.
            </p>
          </FadeIn>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "처짐 원인 확인",
                desc: "장을 내려 시공목, 벽 고정 상태, 장 몸통의 손상을 확인합니다. 문짝·경첩 문제와 장 전체의 처짐을 구분합니다.",
              },
              {
                n: "02",
                title: "필요한 부분 보강",
                desc: "상태에 따라 합판·각재·칼블럭·앙카 등을 사용해 지지부를 보강합니다. 사용 자재와 고정 방식은 현장마다 달라집니다.",
              },
              {
                n: "03",
                title: "재설치와 마무리",
                desc: "상부장을 다시 고정한 뒤 수평과 문짝 닫힘을 맞춥니다. 수리한 부분과 사용 시 살펴볼 부분을 함께 안내합니다.",
              },
            ].map((item) => (
              <div
                key={item.n}
                className="rounded-2xl border border-neutral-200 p-6"
              >
                <p className="mb-5 text-sm font-black text-[#1a5cff]">
                  {item.n}
                </p>
                <h3 className="mb-3 text-lg font-black">{item.title}</h3>
                <p className="text-sm leading-[1.85] text-neutral-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-[#eef4ff] p-5 text-sm leading-[1.85] text-neutral-700">
            <strong className="block text-neutral-900">
              수리와 교체를 나누는 기준은 ‘기존 장의 상태’입니다.
            </strong>
            몸통이 다시 힘을 받을 수 있으면 보강 후 재설치를 검토합니다. 판재가
            넓게 터졌거나 물에 불어 강도가 떨어졌다면 새 제작이 필요할 수
            있습니다.
          </div>
        </div>
      </section>

      <section data-service-section="warranty"
        id="upper-cost"
        className="scroll-mt-24 bg-[#0a1628] px-5 py-14 text-white md:py-20"
      >
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-3 text-xs font-bold tracking-widest text-blue-300">
              COST & AFTERCARE
            </p>
            <h2 className="text-[28px] font-black leading-[1.3] tracking-tight md:text-4xl">
              확정 금액과 시공 후 A/S
            </h2>
            <p className="mt-5 text-sm leading-[1.85] text-white/75">
              일반적인 현장 작업은 약 2시간입니다. 상태와 작업 범위에 따라
              달라지며, 방문일은 상담 후 조율합니다.
            </p>
            <a href="#upper-price-examples" className="mb-5 inline-flex min-h-11 items-center text-sm font-bold text-blue-200 underline underline-offset-4">
              상태별 비용 예시 · 부가세 별도 →
            </a>
          </FadeIn>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
            <h3 className="mb-3 text-base font-black">추락 파손 추가금은 미리 안내합니다</h3>
            <p className="text-sm leading-[1.85] text-white/75">
              추락한 상부장은 파손 부위에 따라 추가금이 있을 수 있습니다. 추가
              작업과 금액은 상담 시 미리 안내하며, 상담 후 금액은 변경되지 않습니다.
            </p>
            <p className="mt-4 text-sm font-black text-blue-200">
              수리 불가로 판단된 경우에는 비용을 받지 않습니다.
            </p>
          </div>
          <div className="mt-8 rounded-2xl bg-white p-6 text-neutral-900">
            <p className="mb-2 text-lg font-black">
              이번에 보강·재고정한 시공 부위, 3년 무상 A/S
            </p>
            <p className="text-sm leading-[1.85] text-neutral-600">
              작업일 기준으로 적용합니다. 수리한 고정부의 이탈, 설치 상태, 수평
              조절 등 이번 시공과 직접 관련된 문제를 확인합니다.
            </p>
            <p className="mt-3 text-xs leading-[1.85] text-neutral-500">
              외부 충격·누수·물먹음·기존 판재의 추가 노후화·임의 분해나 변경처럼
              시공과 직접 관련 없는 문제는 제외될 수 있습니다.
            </p>
            <a
              data-upper-contact
              href={KAKAO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-11 items-center text-[13px] font-bold text-[#1a5cff] underline underline-offset-4"
            >
              수리한 부위 사진으로 A/S 문의 →
            </a>
          </div>
        </div>
      </section>

      <section data-service-section="photo_guide" id="upper-photo-guide" className="scroll-mt-24 bg-[#f8f9fb] px-5 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-3 text-xs font-bold tracking-widest text-[#1a5cff]">
              PHOTO CONSULTATION
            </p>
            <h2 className="text-[28px] font-black leading-[1.3] tracking-tight md:text-4xl">
              사진은 이렇게 보내주세요
            </h2>
            <p className="mb-6 mt-4 text-sm leading-[1.85] text-neutral-600">
              안전하게 찍을 수 있는 전체 사진부터 보내주세요.
              가능하면 틈이 보이는 사진도 함께 보내주시면 상태를 살피는 데 도움이 됩니다.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { src: "/images/cases/case-128-before.jpg", title: "1. 전체 모습", desc: "주변 장과 높이를 비교할 수 있게 찍어주세요.", source: "인천 부평 · 시공 전", href: "/cases/case-128" },
                { src: "/images/cases/case-125-before.jpg", title: "2. 틈이 보이는 부분 · 가능할 때", desc: "벌어진 위치가 보이게 찍어주세요. 가까이 가기 어렵다면 전체 사진부터 보내주세요.", source: "서울 잠실 · 시공 전", href: "/cases/case-125" },
              ].map((photo) => (
                <figure key={photo.src} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                  <div className="relative aspect-[16/10]">
                    <Image src={photo.src} alt={`${photo.source} 사진으로 보여주는 ${photo.title} 촬영 예시`} fill sizes="(min-width: 768px) 384px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                  </div>
                  <figcaption className="p-4">
                    <h3 className="font-black">{photo.title}</h3>
                    <p className="mt-2 text-[13px] leading-[1.8] text-neutral-600">{photo.desc}</p>
                    <Link href={photo.href} className="mt-2 inline-flex min-h-11 items-center text-xs font-bold text-[#1a5cff]">{photo.source} 사례 보기 →</Link>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-3 text-xs leading-[1.8] text-neutral-500">
              서로 다른 실제 시공 전 사진을 촬영 구도 예시로 사용했습니다.
            </p>
            <div className="my-6 rounded-2xl border border-[#dce6fa] bg-[#eef4ff] p-5">
              <h3 className="mb-2 text-sm font-black">사진과 함께 작업 지역·증상을 적어주세요</h3>
              <p className="select-text text-sm leading-[1.85] text-neutral-700">예시: 인천 부평 / 왼쪽 장과 천장 사이에 틈이 있어요 / 어제 발견했어요.</p>
            </div>
            <p className="mb-6 text-xs leading-[1.85] text-neutral-600">
              처짐이 심하다면 장을 당기거나 직접 분리하지 마세요. 아래 공간의
              사용을 피하고, 올라가거나 장을 움직이지 않아도 찍을 수 있는
              사진으로 먼저 상담해주세요.
            </p>
            <ContactButtons />
            <p className="mt-4 text-xs leading-[1.8] text-neutral-500">
              사진으로 예상 범위를 살핀 뒤 수리 금액·방문일을 상담합니다.
              내부 파손과 정확한 작업 범위는 현장 점검 또는 장 분리 후 확인합니다.
            </p>
          </FadeIn>
        </div>
      </section>

      <section data-service-section="video" className="px-5 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-3 text-xs font-bold tracking-widest text-[#1a5cff]">
              ON SITE
            </p>
            <h2 className="mb-4 text-[28px] font-black leading-[1.3] tracking-tight md:text-4xl">
              실제 수리 과정을 확인하세요
            </h2>
            <p className="mb-7 text-sm leading-[1.85] text-neutral-600">
              상부장을 내리고 보강해 다시 설치하는 현장 영상입니다. 작업 방법은
              각 현장의 상태에 따라 달라집니다.
            </p>
            <YouTubeFacade videoId="tDAtB2ClG08" />
          </FadeIn>
        </div>
      </section>

      <section data-service-section="faq"
        id="upper-faq"
        className="scroll-mt-24 bg-[#f8f9fb] px-5 py-14 md:py-20"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-[28px] font-black leading-[1.3] tracking-tight md:text-4xl">
            상담 전에 궁금한 점
          </h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={item.q}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
              >
                <h3>
                  <button
                    type="button"
                    id={`upper-faq-button-${i}`}
                    aria-expanded={openFaq === i}
                    aria-controls={`upper-faq-answer-${i}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-5 text-left text-sm font-bold leading-[1.7] text-neutral-900"
                  >
                    <span>{item.q}</span>
                    <span
                      className="shrink-0 text-lg text-[#1a5cff]"
                      aria-hidden="true"
                    >
                      {openFaq === i ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                <div
                  id={`upper-faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`upper-faq-button-${i}`}
                  hidden={openFaq !== i}
                >
                  <p className="whitespace-pre-line border-t border-neutral-100 px-5 py-5 text-[13px] leading-[1.85] text-neutral-600">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5">
            <h3 className="mb-2 text-sm font-black">
              함께 불편한 싱크대 문제도 알려주세요
            </h3>
            <p className="text-[13px] leading-[1.85] text-neutral-600">
              하부장 밑판 물먹음, 문짝·경첩, 서랍 레일 문제도 사진을 미리
              보내주세요. 같은 날 확인 가능한 범위와 별도 작업이 필요한 범위를
              나눠 안내드립니다.
            </p>
          </div>
        </div>
      </section>

      <section data-service-section="contact" className="bg-[#0a1628] px-5 py-14 text-white md:py-20">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-3 text-xs font-bold tracking-widest text-blue-300">
              {region ? `${region} 상부장 수리 상담` : "상부장 수리 상담"}
            </p>
            <h2 className="text-[28px] font-black leading-[1.3] tracking-tight md:text-4xl">
              교체를 결정하기 전에,
              <br />
              살릴 수 있는 상태인지 확인하세요.
            </h2>
            <p className="mb-7 mt-5 text-sm leading-[1.85] text-white/70">
              전체 사진과 작업 지역부터 보내주세요.
              <br />
              수리 범위를 먼저 살피고, 금액과 방문일을 상담해 확정합니다.
            </p>
            <ContactButtons dark />
          </FadeIn>
        </div>
      </section>
      <FloatingCTA compactMobile avoidOverlapSelector="[data-upper-contact]" label="사진으로 수리 범위·비용 확인" />
    </main>
  );
}
