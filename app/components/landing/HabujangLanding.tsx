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
const PHONE = buildTrackedContactPath("phone", "habujang");
const KAKAO_URL = buildTrackedContactPath("kakao", "habujang");
const SITE_URL = "https://www.restorystudio.co.kr";
type HabujangCase = (typeof cases)[number];

const FAQ_ITEMS = [
  {
    "q": "밑판만 교체할 수 있는 상태는 어떤 경우인가요?",
    "a": "장 몸통과 옆판을 사용할 수 있고 손상이 밑판에 집중되어 있다면, 손상된 밑판만 교체하는 방법을 검토할 수 있습니다.\n\n옆판이나 지지부까지 물에 불었거나 배관 주변 손상이 넓다면 추가 보강 또는 장 교체가 필요할 수 있습니다. 사진으로 예상 범위를 먼저 살피고, 정확한 상태는 현장에서 확인합니다."
  },
  {
    "q": "하부장 밑판 교체 비용은 얼마인가요?",
    "a": "하부장은 현장마다 상태가 달라 상담 후 개별 견적을 안내합니다. 정해진 단일 가격이나 일괄 가격 범위로 안내하지 않습니다.\n\n밑판 크기와 손상 범위, 배관·지지대 구조, 옆판과 몸통의 상태를 함께 확인합니다. 하부장 내부 전체 사진과 손상 부위 사진, 작업 지역을 보내주세요. 적용 자재와 작업 범위, 금액 및 부가세·출장비 등 포함 항목은 상담에서 확인해주세요."
  },
  {
    "q": "물이 새고 있는데 밑판만 바꾸면 되나요?",
    "a": "밑판 교체와 누수 원인 수리는 서로 다른 작업입니다. 물이 계속 닿는 상태라면 새 밑판도 다시 손상될 수 있으므로, 물이 새는 원인과 처리 여부를 함께 확인해야 합니다.\n\n현재 물이 새는지, 누수 수리를 이미 받았는지 상담할 때 알려주세요. 배관 수리가 필요한 경우 밑판 교체와 별도로 작업 범위와 순서를 확인합니다."
  },
  {
    "q": "작업 시간과 방문 일정은 어떻게 되나요?",
    "a": "일반적인 밑판 교체 현장 작업은 약 1~2시간입니다. 손상 범위와 배관 구조, 추가 작업 여부에 따라 달라질 수 있습니다.\n\n약 1~2시간은 방문을 기다리는 시간이 아닌 현장 작업 시간입니다. 방문 가능한 날짜와 작업 후 수납장을 사용할 시점은 상담과 현장 안내를 통해 확인해주세요."
  },
  {
    "q": "사진은 어떻게 보내면 되나요?",
    "a": "문을 연 상태의 하부장 내부 전체 사진 1장과, 부풀거나 부스러진 밑판을 가까이 찍은 사진 1장을 보내주세요. 배관과 옆판도 보이면 예상 범위를 살피는 데 도움이 됩니다.\n\n작업 지역, 현재 누수 여부, 밑판 크기를 알고 있다면 함께 알려주세요. 정확한 치수를 모르더라도 보이는 상태부터 상담할 수 있습니다."
  },
  {
    "q": "3년 무상 A/S는 어떤 조건인가요?",
    "a": "밑판 교체 시공에 대해 3년 무상 A/S를 안내합니다. 재파손이나 들뜸이 생기면 시공 부위 사진과 증상을 보내주세요.\n\n현재 누수 여부와 손상 원인에 따라 확인할 내용이 달라집니다. 적용 부위, 누수로 다시 손상된 경우 등 세부 조건은 상담 시 확인해주세요. 모든 원인의 손상을 무조건 무상 재시공한다는 의미는 아닙니다."
  },
  {
    "q": "상부장이나 경첩도 함께 수리할 수 있나요?",
    "a": "상부장 처짐, 문짝·경첩, 서랍 레일 등 함께 불편한 부분도 사진을 보내주세요. 같은 방문에서 작업할 수 있는지, 별도 작업이 필요한지와 비용을 상담합니다.\n\n방문 전에는 안내받은 범위에 맞춰 하부장 안의 수납물을 옮기고 작업 공간을 준비해주세요."
  }
];

function parseKeyword(keyword: string): { region: string; symptom: string } {
  const kw = keyword.replace(/-/g, " ");
  const region = REGIONS.find((r) => kw.includes(r)) ?? "";
  const symptom = kw.includes("물먹음") ? "물먹음" : kw.includes("썩음") ? "썩음" : kw.includes("곰팡이") ? "곰팡이" : kw.includes("밑판") ? "밑판 교체" : "수리";
  return { region, symptom };
}

function RegionalCaseItemListJsonLd({
  name,
  items,
}: {
  name: string;
  items: HabujangCase[];
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
}: {
  dark?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex flex-col lg:flex-row lg:gap-3 ${compact ? "gap-0" : "gap-3"}`}
    >
      <a
        href={KAKAO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-14 items-center justify-center rounded-2xl bg-[#FEE500] px-5 py-4 text-[15px] font-black text-neutral-900"
      >
        카카오로 교체 범위·견적 확인
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

const latestHabujangCases = cases
  .filter((item) => item.category === "하부장 밑판 교체")
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export default function HabujangLanding({ keyword }: { keyword?: string }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { region, symptom } = keyword ? parseKeyword(keyword) : { region: "", symptom: "" };
  const regionalCases = region ? latestHabujangCases.filter((item) => item.region.includes(region)) : [];
  const featuredCases = [...regionalCases, ...latestHabujangCases.filter((item) => !regionalCases.includes(item))].slice(0, 3);
  return (
    <main data-service-id="habujang" className="bg-white" style={{ fontFamily: "'Wanted Sans Variable','Wanted Sans',-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>
      <ServiceJsonLd
        name={region ? `${region} 싱크대 하부장 밑판 교체` : "싱크대 하부장 밑판 교체"}
        description="기존 장의 상태를 확인해 손상된 하부장 밑판을 교체합니다. 비용은 현장별 상담 견적으로 안내하며, 사진으로 교체 가능 범위·견적·방문 일정을 확인합니다."
        url={`${SITE_URL}/repair/${keyword || "habujang"}`}
        includeAggregateRating={false}
      />
      <FAQJsonLd faqs={FAQ_ITEMS} />
      <RegionalCaseItemListJsonLd name={region ? `${region} 하부장 밑판 교체 참고 사례` : "하부장 밑판 교체 실제 사례"} items={featuredCases} />
      <section data-service-section="hero" className="relative overflow-hidden bg-[#0a1628]">
        <div className="absolute inset-0 md:hidden">
          <Image src="/images/hero-habujang.webp" alt="" fill priority sizes="100vw" className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a1628]" />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col md:min-h-[760px] md:flex-row">
          <div className="relative z-10 flex flex-col justify-center px-5 pb-8 pt-7 md:w-[54%] md:px-10 md:py-14 lg:px-14">
            <FadeIn>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                <Image src="/images/logo.png" alt="리스토리" width={20} height={20} className="rounded-full" />
                <span className="text-[11px] font-bold text-white/75">{region ? `${region} 하부장 ${symptom}` : "리스토리 하부장 밑판 교체"}</span>
              </div>
              <h1 className="mb-3 whitespace-pre-line font-black leading-[1.18] tracking-tight text-white" style={{fontSize:"clamp(2.05rem, 4.5vw, 3.7rem)"}}>
                {region ? `${region} 하부장,\n수납 공간을 다시` : "물 먹은 밑판,\n다시 쓰는 수납장"}
              </h1>
              <p className="max-w-md text-[14px] leading-[1.75] text-white/80 md:text-[16px]">
                장 몸통을 살릴 수 있다면,<br />손상된 밑판만 교체해 마감합니다.
              </p>
              <div className="my-4 overflow-hidden rounded-2xl border border-white/20 bg-[#12213b]/90">
                <dl className="grid grid-cols-3 divide-x divide-white/15 py-4 text-center">
                  {[
                    { label: "현장별 수리비", value: "상담 견적", note: "크기·손상별 안내" },
                    { label: "일반 현장 작업", value: "약 1~2시간", note: "범위에 따라 상이" },
                    { label: "시공 A/S", value: "3년 무상", note: "적용 조건 확인" },
                  ].map((item) => (
                    <div key={item.label} className="px-1">
                      <dt className="text-[10px] leading-5 text-white/70 sm:text-[11px]">{item.label}</dt>
                      <dd className="mt-1 whitespace-nowrap text-[18px] font-black leading-tight text-white min-[375px]:text-[21px] lg:text-[25px]">
                        {item.value}<span className="mt-1 block text-[10px] font-medium text-white/70">{item.note}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="border-t border-white/15 px-3 py-3">
                  <p className="text-[12px] font-bold leading-[1.7] text-white/90">손상 밑판 철거·새 밑판 설치·마감·정리</p>
                  <p className="mt-2 text-[12px] font-bold leading-[1.7] text-blue-200">사진으로 교체 가능 범위부터 확인합니다.</p>
                  <p className="mt-2 text-[11px] leading-[1.7] text-white/65">누수·몸통 손상이 있다면 별도 작업도 확인합니다.</p>
                </div>
              </div>
              <p className="mb-3 text-center text-[13px] font-bold leading-[1.7] text-white lg:text-left">사진으로 교체 범위 · 견적 · 방문일 확인</p>
              <ContactButtons dark compact />
              <p className="mt-2 text-center text-[12px] leading-[1.8] text-white/70 lg:text-left">내부 전체 + 손상 부위 사진 + 작업 지역을 보내주세요.</p>
              <a href="#lower-cost" className="mt-1 inline-flex min-h-11 w-full items-center justify-center text-[12px] font-bold text-blue-200 underline underline-offset-4 lg:w-auto lg:justify-start">견적 기준·A/S 안내 자세히 보기 →</a>
            </FadeIn>
          </div>
          <div className="relative hidden md:block md:w-[46%]">
            <Image src="/images/hero-habujang.webp" alt="리스토리 하부장 밑판 교체 현장" fill priority sizes="46vw" className="object-cover opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] via-transparent to-transparent" />
          </div>
        </div>
      </section>
      <nav aria-label="하부장 밑판 교체 안내" className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-3xl justify-center gap-3 px-3 text-[12px] font-bold text-neutral-600 sm:gap-8">
          <a href="#lower-cases" className="px-2 py-5 hover:text-[#1a5cff]">실제 시공 사례</a>
          <a href="#lower-cost" className="px-2 py-5 hover:text-[#1a5cff]">견적·작업 범위</a>
          <a href="#lower-faq" className="px-2 py-5 hover:text-[#1a5cff]">자주 묻는 질문</a>
        </div>
      </nav>
      <section data-service-section="cases"
        id="lower-cases"
        className="scroll-mt-24 bg-[#f8f9fb] px-5 py-14 md:py-20"
      >
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-3 text-xs font-bold tracking-widest text-[#1a5cff]">
              BEFORE / AFTER
            </p>
            <h2 className="text-[28px] font-black leading-[1.3] tracking-tight md:text-4xl">
              다시 사용할 수 있게 된 수납 공간
            </h2>
            <p className="mb-8 mt-4 text-sm leading-[1.85] text-neutral-600">
              {region
                ? regionalCases.length > 0
                  ? `${region} 지역에 공개된 실제 시공 사례 ${regionalCases.length}건 중 최근 작업을 먼저 보여드립니다. 다른 지역의 참고 사례는 별도로 표시했습니다.`
                  : `${region} 지역에 공개된 사례가 아직 없어, 다른 지역의 실제 수리 사례를 참고로 보여드립니다.`
                : "밑판의 손상 범위와 장 구조는 현장마다 다릅니다. 실제 작업 전후 사진과 확인한 내용을 함께 살펴보세요."}
            </p>
          </FadeIn>
          <div className="space-y-6">
            {featuredCases.map((item, index) => (
              <FadeIn key={item.id} delay={index * 50}>
                <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                  <Link href={`/cases/${item.id}`} className="block">
                    <div className="grid grid-cols-2 gap-px bg-neutral-200">
                      {[
                        { label: "수리 전", src: item.beforeImg },
                        { label: "수리 후", src: item.afterImg },
                      ].map((photo) => (
                        <div
                          key={photo.label}
                          className="relative aspect-[4/3] bg-neutral-100"
                        >
                          <Image
                            src={photo.src}
                            alt={`${item.title} ${photo.label}`}
                            fill
                            className="object-cover"
                            sizes="(min-width: 768px) 384px, 50vw"
                          />
                          <span
                            className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-[11px] font-black text-white ${photo.label === "수리 후" ? "bg-[#1a5cff]" : "bg-black/70"}`}
                          >
                            {photo.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="p-5 md:p-7">
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
                        {item.summary}
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
            href={`/cases?cat=${encodeURIComponent("하부장 밑판 교체")}`}
            className="mt-6 inline-flex min-h-11 items-center text-sm font-bold text-[#1a5cff]"
          >
            하부장 밑판 교체 사례 전체 보기 →
          </Link>
        </div>
      </section>

      <section data-service-section="scope" className="px-5 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-3 text-xs font-bold tracking-widest text-[#1a5cff]">REPAIR SCOPE</p>
            <h2 className="text-[28px] font-black leading-[1.3] tracking-tight md:text-4xl">살릴 장은 남기고,<br />손상된 밑판부터 교체합니다</h2>
            <p className="mb-8 mt-4 text-sm leading-[1.85] text-neutral-600">겉을 덮기 전에 밑판과 장 몸통의 상태를 살핍니다. 배관과 지지대 위치에 맞춰 새 밑판을 설치하고 수납 공간을 마감합니다.</p>
          </FadeIn>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { n: "01", title: "손상 범위 확인", desc: "밑판의 물먹음·부풀음과 옆판·지지부 상태를 살핍니다. 현재 누수가 있는지도 함께 확인합니다." },
              { n: "02", title: "철거와 새 밑판 설치", desc: "손상된 밑판을 제거하고 배관·지지대 구조에 맞춰 새 밑판을 설치합니다. 자재와 작업 방법은 현장에 맞춰 안내합니다." },
              { n: "03", title: "마감과 현장 정리", desc: "설치 상태와 마감을 확인하고 작업 공간을 정리합니다. 수납장을 다시 사용할 때 확인할 사항도 안내합니다." },
            ].map((item) => (
              <div key={item.n} className="rounded-2xl border border-neutral-200 p-6">
                <p className="mb-5 text-sm font-black text-[#1a5cff]">{item.n}</p>
                <h3 className="mb-3 text-lg font-black">{item.title}</h3>
                <p className="text-sm leading-[1.85] text-neutral-600">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-[#eef4ff] p-5 text-sm leading-[1.85] text-neutral-700">
            <strong className="mb-1 block text-neutral-900">밑판 교체와 누수 원인 수리는 다릅니다.</strong>
            물이 계속 닿으면 새 밑판도 다시 손상될 수 있습니다. 누수 처리 여부와 장 몸통의 손상을 함께 확인해 작업 범위와 순서를 정합니다.
          </div>
        </div>
      </section>
      <section data-service-section="budget" id="lower-cost" className="scroll-mt-24 bg-[#0a1628] px-5 py-14 text-white md:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-bold tracking-widest text-blue-300">COST & AFTERCARE</p>
          <h2 className="mb-7 text-[28px] font-black leading-[1.3] tracking-tight md:text-4xl">하부장은 상태가 달라,<br />견적도 상담으로 정합니다</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6">
              <p className="text-sm font-bold text-white/70">하부장 밑판 교체 비용</p>
              <p className="mt-2 text-3xl font-black">현장별 상담 견적</p>
              <p className="mt-3 text-[13px] leading-[1.85] text-white/75">밑판 크기·손상 범위·배관 구조를 확인해 안내합니다. 사진으로 예상 범위를 살피고, 현장에서 내부 상태를 확인합니다.</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <p className="text-sm font-bold text-white/70">일반적인 현장 작업 시간</p>
              <p className="mt-2 text-3xl font-black">약 1~2시간</p>
              <p className="mt-3 text-[13px] leading-[1.85] text-white/75">범위와 구조, 추가 작업에 따라 달라집니다. 방문 가능한 날짜는 작업 지역과 함께 상담합니다.</p>
            </div>
          </div>
          <div className="mt-7 grid gap-7 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-base font-black">견적에서 확인할 기본 작업</h3>
              <ul className="space-y-2 text-sm leading-[1.85] text-white/75">
                <li>손상 밑판 철거와 내부 상태 확인</li>
                <li>새 밑판 자재·설치·마감</li>
                <li>작업 공간 정리</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-base font-black">별도 범위를 확인할 부분</h3>
              <p className="text-sm leading-[1.85] text-white/75">배관 누수 수리, 옆판·몸통 보강, 다른 장의 손상은 밑판 교체와 함께 범위를 확인해야 합니다. 부가세·출장비 등 비용에 포함되는 항목도 상담에서 확인해주세요.</p>
            </div>
          </div>
          <div className="mt-8 rounded-2xl bg-white p-6 text-neutral-900">
            <h3 className="mb-3 text-lg font-black">3년 무상 A/S 안내</h3>
            <p className="text-[13px] leading-[1.85] text-neutral-600">교체한 밑판의 재파손·들뜸 등 문제가 생기면 사진과 증상을 보내주세요. 적용 부위와 누수로 다시 손상된 경우 등 세부 조건은 상담 시 확인합니다.</p>
            <a href={KAKAO_URL} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center text-[13px] font-bold text-[#1a5cff] underline underline-offset-4">밑판 사진으로 견적·A/S 조건 확인 →</a>
          </div>
        </div>
      </section>
      <section data-service-section="photo_guide" id="lower-consult" className="scroll-mt-24 bg-[#f8f9fb] px-5 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-3 text-xs font-bold tracking-widest text-[#1a5cff]">PHOTO CONSULTATION</p>
            <h2 className="text-[28px] font-black leading-[1.3] tracking-tight md:text-4xl">사진을 보내면,<br />세 가지를 안내합니다</h2>
            <dl className="mb-7 mt-6 grid gap-3 md:grid-cols-3">
              {[
                {title:"밑판만 교체 가능한지",desc:"장 몸통을 살릴 수 있는지, 옆판이나 배관 주변도 확인해야 하는지 예상 범위를 짚어드립니다."},
                {title:"우리 집 상태에 맞는 견적",desc:"크기와 손상 상태, 필요한 자재·작업을 보고 비용을 상담합니다. 일괄 가격 대신 현장별로 안내합니다."},
                {title:"방문 가능한 일정",desc:"작업 지역과 현재 누수 여부를 보고 방문 가능 일정과 준비할 내용을 안내합니다."},
              ].map((item)=>(
                <div key={item.title} className="rounded-2xl border border-[#dce6fa] bg-[#eef4ff] p-5">
                  <dt className="mb-2 text-[15px] font-black text-[#1a5cff]">{item.title}</dt>
                  <dd className="text-[13px] leading-[1.85] text-neutral-700">{item.desc}</dd>
                </div>
              ))}
            </dl>
            <p className="mb-7 text-[13px] leading-[1.85] text-neutral-600">사진에서는 보이는 상태를 먼저 확인합니다. 가려진 내부 손상과 정확한 교체 범위는 현장 확인이 필요할 수 있습니다.</p>
            <h3 className="mb-4 text-lg font-black">사진 두 장과 작업 지역을 보내주세요</h3>
            <ol className="mb-6 space-y-3">
              {[
                ["문을 연 하부장 전체", "밑판, 옆판, 배관 위치가 함께 보이게 찍어주세요."],
                ["부풀거나 부스러진 부분", "가까이 찍은 사진으로 손상 위치와 범위를 보여주세요."],
                ["작업 지역과 누수 여부", "지금 물이 새는지, 누수 수리를 받았는지도 알려주세요."],
              ].map(([title,desc],i)=>(
                <li key={title} className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-sm font-black text-[#1a5cff]">{i+1}</span>
                  <div><h4 className="mb-1 text-sm font-black">{title}</h4><p className="text-[13px] leading-[1.85] text-neutral-600">{desc}</p></div>
                </li>
              ))}
            </ol>
            <p className="mb-5 text-[13px] leading-[1.85] text-neutral-600">정확한 치수를 몰라도 괜찮습니다. 보이는 상태부터 보내주세요.</p>
            <ContactButtons />
            <p className="mt-4 text-xs leading-[1.8] text-neutral-500">사진 상담 → 작업 범위·견적·방문일 안내 → 현장 확인 → 밑판 교체·마감</p>
          </FadeIn>
        </div>
      </section>
      <section data-service-section="faq"
        id="lower-faq"
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
                    id={`lower-faq-button-${i}`}
                    aria-expanded={openFaq === i}
                    aria-controls={`lower-faq-answer-${i}`}
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
                  id={`lower-faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`lower-faq-button-${i}`}
                  hidden={openFaq !== i}
                >
                  <p className="whitespace-pre-line border-t border-neutral-100 px-5 py-5 text-[13px] leading-[1.85] text-neutral-600">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section data-service-section="contact" className="bg-[#0a1628] px-5 py-16 text-white md:py-24">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-4 text-xs font-bold tracking-widest text-blue-300">하부장 밑판 교체 상담</p>
            <h2 className="text-[28px] font-black leading-[1.3] tracking-tight md:text-4xl">전체 교체를 결정하기 전에,<br />밑판만 교체할 수 있는지 확인하세요.</h2>
            <p className="mb-7 mt-5 text-sm leading-[1.85] text-white/70">내부 전체와 손상 부위 사진, 작업 지역을 보내주세요.<br />우리 집 상태에 맞는 교체 범위와 견적, 방문 일정을 안내합니다.</p>
            <ContactButtons dark />
          </FadeIn>
        </div>
      </section>
      <FloatingCTA compactMobile label="사진으로 교체 범위·견적 확인" />
    </main>
  );
}
