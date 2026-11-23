"use client";

import { LandingTrail, LandingIntake, LandingSections } from "./shared/LandingNavigation";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/app/components/FadeIn";
import FloatingCTA from "@/app/components/landing/shared/FloatingCTA";
import { ServiceJsonLd, FAQJsonLd } from "@/app/components/JsonLd";
import { buildTrackedContactPath } from "@/lib/attribution";
import { cases } from "@/lib/case-data";
import { REGIONS } from "@/lib/seo-regions";

const PHONE = buildTrackedContactPath("phone", "countertop_crack");
const KAKAO_URL = buildTrackedContactPath("kakao", "countertop_crack");
const SITE_URL = "https://www.restorystudio.co.kr";
const HERO_IMAGE = "/images/cases/case-111-after.png";
type CrackCase = (typeof cases)[number];

const FAQ_ITEMS = [
  {
    q: "갈라진 상판은 전체를 교체해야 하나요?",
    a: "크랙이 생겼다고 모두 전체 교체가 필요한 것은 아닙니다. 재질과 균열 위치·깊이, 하부 지지 상태를 확인해 기존 상판을 보수할 수 있는지 먼저 살핍니다.\n\n균열이 여러 방향으로 넓게 퍼졌거나 상판이 처지고 하부 손상이 큰 경우에는 보강이나 교체를 함께 검토해야 합니다. 사진으로 예상 범위를 안내하고, 가려진 내부 상태는 현장에서 확인합니다.",
  },
  {
    q: "상판 크랙 수리 비용은 어떻게 정해지나요?",
    a: "상판 크랙 수리 비용은 30~50만 원 범위로 안내하며, 부가세는 별도입니다. 상판 재질, 크랙 길이와 깊이, 싱크볼·이음부·모서리 등 파손 위치, 하부 보강 필요 여부에 따라 상담이 필요합니다.\n\n상판 전체와 크랙 가까운 사진, 작업 지역을 보내주세요. 최종 금액과 필요한 작업 범위는 상태를 보고 상담 후 안내합니다. 출장비 포함 여부와 수리 불가 시 비용 등 세부 조건도 상담에서 확인해주세요.",
  },
  {
    q: "수리 후 흔적이 전혀 남지 않나요?",
    a: "크랙 수리는 기존 상판을 다시 사용할 수 있도록 정리하고 마감하는 작업입니다. 새 상판으로 바꾸는 것과 같지는 않습니다.\n\n상판의 색상·무늬·입자, 균열 깊이와 빛이 비치는 방향에 따라 보수선이나 색상 차이가 남을 수 있습니다. 수리 가능 여부와 함께 예상되는 마감 범위를 먼저 안내드립니다.",
  },
  {
    q: "사진은 어떻게 보내면 되나요?",
    a: "상판 전체가 보이는 사진 1장과 크랙이 가까이 보이는 사진 1장을 보내주세요. 싱크볼·이음부·모서리 중 어느 위치인지 알 수 있게 찍으면 도움이 됩니다.\n\n작업 지역과 균열이 생긴 시점, 현재 물이 새는지 또는 상판이 처졌는지도 함께 알려주세요. 재질 이름이나 정확한 치수를 몰라도 보이는 상태부터 상담할 수 있습니다. 사진으로 확인하기 어려운 깊이와 하부 지지 상태는 현장 점검이 필요할 수 있습니다.",
  },
  {
    q: "작업 시간과 수리 후 사용 시점은 어떻게 되나요?",
    a: "작업 시간은 상판 재질과 손상 범위, 보강·마감 방식에 따라 달라집니다. 방문 가능한 일정과 예상 작업 시간을 상담에서 안내합니다.\n\n작업이 끝나는 시점과 물 사용이나 하중을 가해도 되는 시점은 다를 수 있습니다. 수리한 상판을 언제부터 사용할 수 있는지와 관리 방법은 작업 방법에 맞춰 안내받아주세요.",
  },
  {
    q: "3년 무상 A/S는 어떤 범위인가요?",
    a: "상판 크랙 수리 시공 부위는 작업일 기준 3년 무상 A/S를 안내합니다. 문제가 생기면 수리한 부위 사진과 증상을 보내주세요.\n\n정확한 적용 부위와 조건, 기존 하부 지지 문제나 새로운 충격 등으로 다시 손상된 경우의 처리 기준은 상담에서 확인해주세요. 재질과 색상에 따라 남을 수 있는 보수 흔적도 작업 전에 함께 안내합니다.",
  },
  {
    q: "물이 닿거나 하부장이 처져 있다면 함께 수리하나요?",
    a: "상판 크랙과 누수, 하부장 처짐은 필요한 작업이 다를 수 있습니다. 표면의 틈만 보고 작업 범위를 정하지 않고, 현재 물이 새는지와 상판을 받치는 상태를 함께 확인합니다.\n\n배관 수리나 하부장 보강 등 별도 작업이 필요하다면 상판 보수와 구분해 범위·비용·작업 순서를 상담합니다. 함께 불편한 부분도 사진으로 알려주세요.",
  },
];

function parseKeyword(keyword: string): { region: string; symptom: string } {
  const kw = keyword.replace(/-/g, " ");
  const region = REGIONS.find((r) => kw.includes(r)) ?? "";
  const symptom = kw.includes("갈라짐") ? "갈라짐" : kw.includes("깨짐") ? "깨짐" : kw.includes("크랙") ? "크랙" : "수리";
  return { region, symptom };
}

function RegionalCaseItemListJsonLd({
  name,
  items,
}: {
  name: string;
  items: CrackCase[];
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
        카카오로 수리 범위·견적 확인
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

const latestCrackCases = cases
  .filter((item) => item.category === "상판 크랙")
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export default function CountertopCrackLanding({ keyword }: { keyword?: string }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { region, symptom } = keyword ? parseKeyword(keyword) : { region: "", symptom: "크랙" };
  const regionalCases = region ? latestCrackCases.filter((item) => item.region.includes(region)) : [];
  const regionalIds = new Set(regionalCases.map((item) => item.id));
  const featuredCases = [...regionalCases, ...latestCrackCases.filter((item) => !regionalIds.has(item.id))].slice(0, 3);

  return (
    <main data-service-id="sink-top-crack" data-service-keyword={keyword} className="break-keep bg-white" style={{ fontFamily: "'Wanted Sans Variable','Wanted Sans',-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>
      <ServiceJsonLd
        name={region ? `${region} 싱크대 상판 크랙 수리` : "싱크대 상판 크랙 수리"}
        description="보수 가능한 상판의 크랙을 정리하고 마감합니다. 비용 범위는 30~50만 원이며 부가세 별도입니다. 최종 금액은 상태를 보고 상담 후 안내합니다. 예상 마감과 방문 일정, 시공 부위 3년 무상 A/S 적용 조건도 확인하세요."
        url={`${SITE_URL}/repair/${keyword || "sink-top-crack"}`}
        includeAggregateRating={false}
      />
      <FAQJsonLd faqs={FAQ_ITEMS} />
      <RegionalCaseItemListJsonLd name={`${region ? `${region} 지역·` : ""}상판 크랙 수리 전후 사례`} items={featuredCases} />

      <LandingTrail field="repair" title="상판 크랙 수리" />
      <section data-service-section="hero" className="relative overflow-hidden bg-[#0a1628]">
        <div className="absolute inset-0 md:hidden">
          <Image src={HERO_IMAGE} alt="" fill priority sizes="100vw" className="object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a1628]" />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col md:min-h-[760px] md:flex-row">
          <div className="relative z-10 flex flex-col justify-center px-5 pb-8 pt-7 md:w-[54%] md:px-10 md:py-14 lg:px-14">
            <FadeIn>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                <Image src="/images/logo.png" alt="리스토리" width={20} height={20} className="rounded-full" />
                <span className="text-[11px] font-bold text-white/80">
                  {region ? `${region} 싱크대 상판 ${symptom}${symptom === "수리" ? "" : " 수리"}` : "리스토리 싱크대 상판 크랙 수리"}
                </span>
              </div>
              <h1 className="mb-3 whitespace-pre-line font-black leading-[1.18] tracking-tight text-white" style={{ fontSize: "clamp(2.05rem, 4.5vw, 3.7rem)" }}>
                {region ? `${region} 상판 ${symptom},\n다시 쓰는 주방` : "갈라진 상판,\n다시 쓰는 주방"}
              </h1>
              <p className="max-w-md text-[14px] leading-[1.75] text-white/80 md:text-[16px]">
                보수 가능한 상판은 크랙을 정리하고,<br />다시 사용할 수 있도록 마감합니다.
              </p>
              <div className="my-4 overflow-hidden rounded-2xl border border-white/20 bg-[#12213b]/90">
                <dl className="grid grid-cols-3 divide-x divide-white/15 py-4 text-center">
                  {[
                    { label: "살릴 수 있는 상판", value: "부분 보수", note: "상태별 범위 안내" },
                    { label: "현장별 수리비", value: "상담 견적", note: "재질·손상별 안내" },
                    { label: "시공 부위 A/S", value: "3년 무상", note: "적용 조건 확인" },
                  ].map((item) => (
                    <div key={item.label} className="px-1">
                      <dt className="text-[10px] leading-5 text-white/70 sm:text-[11px]">{item.label}</dt>
                      <dd className="mt-1 whitespace-nowrap text-[21px] font-black leading-tight text-white lg:text-[25px]">
                        {item.value}<span className="mt-1 block text-[10px] font-medium text-white/70">{item.note}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="border-t border-white/15 px-3 py-3">
                  <p className="text-[12px] font-bold leading-[1.7] text-white/90">크랙 정리·필요 부위 보강·표면 마감</p>
                  <p className="mt-2 text-[12px] leading-[1.7] text-blue-200">색상과 빛에 따라 보수 흔적이 남을 수 있습니다.</p>
                  <a href="#crack-cases" className="mt-1 inline-flex min-h-11 items-center text-[12px] font-bold text-white/85 underline underline-offset-4">수리 전후 사진과 과정 보기 →</a>
                </div>
              </div>
              <p className="mb-3 text-center text-[13px] font-bold leading-[1.7] text-white lg:text-left">사진으로 수리 범위 · 견적 · 방문일 확인</p>
              <ContactButtons dark compact />
              <p className="mt-2 text-center text-[12px] leading-[1.8] text-white/70 lg:text-left">전체 사진 + 크랙 가까운 사진 + 작업 지역을 보내주세요.</p>
              <a href="#crack-cost" className="mt-1 inline-flex min-h-11 w-full items-center justify-center text-[12px] font-bold text-blue-200 underline underline-offset-4 lg:w-auto lg:justify-start">비용 범위·견적 기준 보기 →</a>
            </FadeIn>
          </div>
          <div className="relative hidden md:block md:w-[46%]">
            <Image src={HERO_IMAGE} alt="청라 싱크볼 옆 상판 크랙 수리 후 마감 상태" fill priority sizes="46vw" className="object-cover opacity-85" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0a1628] to-transparent p-8 pt-20">
              <Link href="/cases/case-111" className="inline-flex min-h-11 items-center text-sm font-bold text-white underline underline-offset-4">청라 상판 크랙 수리 후 · 작업 과정 보기 →</Link>
            </div>
          </div>
        </div>
      </section>


      <LandingSections sections={[["crack-cases", "수리 전후"], ["crack-cost", "견적 기준"], ["crack-faq", "자주 묻는 질문"]]} />

      <section data-service-section="budget" id="crack-cost" className="scroll-mt-24 border-b border-neutral-200 px-5 py-10 md:py-14">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#dce6fa] bg-[#eef4ff] p-6 md:p-8">
          <h2 className="text-sm font-bold text-[#1a5cff]">상판 크랙 수리 비용 범위</h2>
          <p className="mt-3 text-[34px] font-black leading-tight tracking-tight text-neutral-950 md:text-4xl">30~50만 원</p>
          <p className="mt-2 text-sm font-bold text-neutral-600">부가세 별도 · 최종 금액은 상담 후 안내</p>
          <p className="mt-4 text-sm leading-[1.85] text-neutral-600">재질과 크랙의 길이·깊이·위치, 보강 필요 여부에 따라 상담이 필요합니다. 전체 사진과 크랙 가까운 사진, 작업 지역을 보내주시면 필요한 작업과 견적을 안내합니다.</p>
          <a href="#crack-details" className="mt-3 inline-flex min-h-11 items-center text-[13px] font-bold text-[#1a5cff] underline underline-offset-4">작업 범위·A/S 적용 조건 보기 →</a>
        </div>
      </section>

      <section data-service-section="cases" id="crack-cases" className="scroll-mt-24 bg-[#f8f9fb] px-5 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-3 text-xs font-bold tracking-widest text-[#1a5cff]">BEFORE / AFTER</p>
            <h2 className="text-[28px] font-black leading-[1.3] tracking-tight md:text-4xl">갈라진 라인을 정리한 수리 전후</h2>
            <p className="mt-4 text-sm leading-[1.85] text-neutral-600">
              {region
                ? regionalCases.length > 0
                  ? `${region} 지역에 공개된 실제 시공 사례 ${regionalCases.length}건을 먼저 보여드립니다. 다른 지역의 참고 사례는 별도로 표시했습니다.`
                  : `${region} 지역에 공개된 사례가 아직 없어, 다른 지역의 실제 수리 사례를 참고로 보여드립니다.`
                : "싱크볼 옆 균열과 이음부 크랙을 수리한 사례입니다. 작업 전후 사진과 확인한 범위를 함께 살펴보세요."}
            </p>
            <p className="mb-8 mt-3 text-[13px] leading-[1.85] text-neutral-500">사진은 해당 현장의 결과입니다. 재질·색상·균열 깊이에 따라 보수선과 색상 차이가 남을 수 있습니다.</p>
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
            href={`/cases?cat=${encodeURIComponent("상판 크랙")}`}
            className="mt-6 inline-flex min-h-11 items-center text-sm font-bold text-[#1a5cff]"
          >
            상판 크랙 사례 전체 보기 →
          </Link>
        </div>
      </section>

      <section data-service-section="scope" className="px-5 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-3 text-xs font-bold tracking-widest text-[#1a5cff]">REPAIR SCOPE</p>
            <h2 className="text-[28px] font-black leading-[1.3] tracking-tight md:text-4xl">크랙의 위치부터,<br />상판을 받치는 상태까지</h2>
            <p className="mb-8 mt-4 text-sm leading-[1.85] text-neutral-600">표면의 선만 보고 수리를 결정하지 않습니다. 상판을 다시 사용할 수 있는지와 어느 정도까지 마감할 수 있는지를 함께 확인합니다.</p>
          </FadeIn>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { n: "01", title: "수리 가능 범위 확인", desc: "상판 재질, 균열의 길이·깊이, 싱크볼과의 위치, 하부 지지 상태를 살펴봅니다." },
              { n: "02", title: "크랙 정리와 보강", desc: "수리 가능한 부위를 정리하고 필요한 보강 범위를 정합니다. 하부장이나 배관 작업이 필요하면 별도로 안내합니다." },
              { n: "03", title: "표면 마감과 사용 안내", desc: "재질과 색상에 맞는 범위로 마감합니다. 남을 수 있는 보수 흔적과 작업 후 사용 시점을 안내합니다." },
            ].map((item) => (
              <div key={item.n} className="rounded-2xl border border-neutral-200 p-6">
                <p className="mb-5 text-sm font-black text-[#1a5cff]">{item.n}</p>
                <h3 className="mb-3 text-lg font-black">{item.title}</h3>
                <p className="text-sm leading-[1.85] text-neutral-600">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-[#eef4ff] p-5 text-sm leading-[1.85] text-neutral-700">
            <strong className="mb-1 block text-neutral-900">보수로 정리할 수 있는 범위부터 확인합니다.</strong>
            균열이 넓게 퍼졌거나 상판이 처지고 하부 손상이 크다면 보강이나 교체를 함께 검토해야 합니다. 수리 가능 여부와 예상 마감을 먼저 듣고 결정하세요.
          </div>
        </div>
      </section>

      <section data-service-section="warranty" id="crack-details" className="scroll-mt-24 bg-[#0a1628] px-5 py-14 text-white md:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-bold tracking-widest text-blue-300">COST & AFTERCARE</p>
          <h2 className="text-[28px] font-black leading-[1.3] tracking-tight md:text-4xl">우리 집 상판 상태에 맞춰,<br />작업 범위와 견적을 안내합니다</h2>
          <div className="my-7 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6">
              <p className="text-sm font-bold text-white/70">상판 크랙 수리 비용</p>
              <p className="mt-2 text-3xl font-black">30~50만 원</p>
              <p className="mt-2 text-sm font-bold text-blue-200">부가세 별도 · 상담 필요</p>
              <p className="mt-3 text-[13px] leading-[1.85] text-white/75">최종 금액은 재질과 크랙 길이·깊이·위치, 하부 보강 필요 여부를 보고 상담 후 안내합니다. 가려진 내부 상태는 현장에서 확인합니다.</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <p className="text-sm font-bold text-white/70">방문 일정과 작업 시간</p>
              <p className="mt-2 text-3xl font-black">작업 방법에 맞춰 안내</p>
              <p className="mt-3 text-[13px] leading-[1.85] text-white/75">예상 작업 시간과 수리 후 물 사용·하중을 가해도 되는 시점을 함께 확인하세요. 작업 지역과 상태를 보고 방문 일정을 상담합니다.</p>
            </div>
          </div>
          <div className="grid gap-7 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-base font-black">견적에서 확인할 작업</h3>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-[1.85] text-white/75">
                <li>크랙 부위 정리와 필요한 보강</li>
                <li>표면 마감과 남을 수 있는 보수 흔적</li>
                <li>하부 지지·누수 등 별도 작업 여부</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-base font-black">작업 범위와 비용을 함께 확인하세요</h3>
              <p className="text-sm leading-[1.85] text-white/75">안내 비용은 부가세 별도입니다. 출장비 포함 여부와 수리 불가 시 비용 등 세부 조건, 별도 작업이 필요한 부분은 상담에서 함께 확인합니다.</p>
            </div>
          </div>
          <div className="mt-8 rounded-2xl bg-white p-6 text-neutral-900">
            <h3 className="mb-3 text-lg font-black">시공 부위 3년 무상 A/S 안내</h3>
            <p className="text-[13px] leading-[1.85] text-neutral-600">작업일 기준으로 안내합니다. 수리한 부위 사진과 증상을 보내주세요. 정확한 적용 범위와 재손상 원인에 따른 처리 조건은 상담 시 확인합니다.</p>
            <a href={KAKAO_URL} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center text-[13px] font-bold text-[#1a5cff] underline underline-offset-4">상판 사진으로 견적·A/S 조건 확인 →</a>
          </div>
        </div>
      </section>

      <section data-service-section="photo_guide" id="crack-consult" className="scroll-mt-24 bg-[#f8f9fb] px-5 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-3 text-xs font-bold tracking-widest text-[#1a5cff]">PHOTO CONSULTATION</p>
            <h2 className="text-[28px] font-black leading-[1.3] tracking-tight md:text-4xl">사진을 보내면,<br />세 가지를 안내합니다</h2>
            <dl className="mb-7 mt-6 grid gap-3 md:grid-cols-3">
              {[
                { title: "수리 가능 범위와 마감", desc: "기존 상판을 보수할 수 있는지, 보강·교체 판단이 필요한지와 예상되는 보수 흔적을 안내합니다." },
                { title: "우리 집 상태에 맞는 견적", desc: "재질과 손상, 필요한 작업을 보고 비용을 상담합니다. 포함 항목과 추가 확인이 필요한 부분도 짚어드립니다." },
                { title: "방문 일정과 사용 시점", desc: "작업 지역과 상태를 확인해 일정을 상담하고, 작업 시간과 수리 후 사용 시점을 안내합니다." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-[#dce6fa] bg-[#eef4ff] p-5">
                  <dt className="mb-2 text-[15px] font-black text-[#1a5cff]">{item.title}</dt>
                  <dd className="text-[13px] leading-[1.85] text-neutral-700">{item.desc}</dd>
                </div>
              ))}
            </dl>
            <h3 className="mb-4 text-lg font-black">사진 두 장과 작업 지역을 보내주세요</h3>
            <ol className="mb-6 space-y-3">
              {[
                ["상판 전체 사진", "싱크볼·이음부·모서리 중 어디가 갈라졌는지 보이게 찍어주세요."],
                ["크랙 가까운 사진", "갈라진 선과 벌어진 부분을 보여주세요. 옆면도 보이면 도움이 됩니다."],
                ["작업 지역과 현재 상태", "균열을 발견한 시점, 누수나 처짐 여부, 이전 보수 여부를 알려주세요."],
              ].map(([title, desc], i) => (
                <li key={title} className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-sm font-black text-[#1a5cff]">{i + 1}</span>
                  <div><h4 className="mb-1 text-sm font-black">{title}</h4><p className="text-[13px] leading-[1.85] text-neutral-600">{desc}</p></div>
                </li>
              ))}
            </ol>
            <p className="mb-5 text-[13px] leading-[1.85] text-neutral-600">재질 이름이나 정확한 치수를 몰라도 괜찮습니다. 보이는 상태부터 보내주세요. 균열 깊이와 하부 지지 상태는 현장 확인이 필요할 수 있습니다.</p>
            <ContactButtons />
            <p className="mt-4 text-xs leading-[1.8] text-neutral-500">사진 상담 → 범위·예상 마감·견적·일정 안내 → 현장 확인 → 크랙 보수·마감</p>
          </FadeIn>
        </div>
      </section>

      <section data-service-section="faq"
        id="crack-faq"
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
                    id={`crack-faq-button-${i}`}
                    aria-expanded={openFaq === i}
                    aria-controls={`crack-faq-answer-${i}`}
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
                  id={`crack-faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`crack-faq-button-${i}`}
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
            <p className="mb-4 text-xs font-bold tracking-widest text-blue-300">싱크대 상판 크랙 수리 상담</p>
            <h2 className="text-[28px] font-black leading-[1.3] tracking-tight md:text-4xl">전체 교체를 결정하기 전에,<br />지금 상판을 살릴 수 있는지 확인하세요.</h2>
            <p className="mb-7 mt-5 text-sm leading-[1.85] text-white/75">상판 전체와 크랙 가까운 사진, 작업 지역을 보내주세요.<br />수리 범위와 예상 마감, 견적·방문 일정을 안내합니다.</p>
            <ContactButtons dark />
          </FadeIn>
        </div>
      </section>
      <LandingIntake field="repair" service="counter" />
      <FloatingCTA compactMobile label="사진으로 상판 수리 범위·견적 확인" />
    </main>
  );
}
