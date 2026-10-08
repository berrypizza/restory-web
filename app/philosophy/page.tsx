import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/app/components/JsonLd";
import { withLandingSeo } from "@/lib/landing-seo";

const PAGE_URL = "https://www.restorystudio.co.kr/philosophy";
const HERO_IMAGE = "/images/philosophy/representative-kitchen-field.png";

export const metadata: Metadata = withLandingSeo({
  title: "사업 철학 | 리스토리 스튜디오",
  description:
    "리스토리 스튜디오가 어떤 생각으로 가구 수리와 리폼을 하는지, 대표의 경험과 사업 원칙을 솔직하게 전합니다.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "사업 철학 | 리스토리 스튜디오",
    description:
      "작은 마감 하나에도 정성을 넣는 곳. 리스토리 스튜디오의 솔직한 소통과 시공 신념을 전합니다.",
    url: PAGE_URL,
    images: [
      {
        url: HERO_IMAGE,
        width: 1536,
        height: 1152,
        alt: "리스토리 스튜디오 대표 현장 상담",
      },
    ],
  },
});

const problemCards = [
  {
    label: "고객이 모르는 영역",
    title: "자재와 시공 방식은 밖에서 잘 보이지 않습니다.",
    body: "겉으로는 비슷해 보여도 어떤 자재를 쓰는지, 어디까지 철거하는지, 어떤 방식으로 고정하는지에 따라 결과는 달라집니다.",
  },
  {
    label: "업자가 숨기기 쉬운 영역",
    title: "모르는 부분에는 비용이 쉽게 붙습니다.",
    body: "자재비, 시공비, 철거비처럼 고객이 바로 비교하기 어려운 곳에 마진을 넣는 구조를 현장에서 많이 봤습니다.",
  },
];

const principles = [
  {
    number: "01",
    title: "솔직하게 소통하자.",
    body: "가능한 일과 어려운 일을 먼저 나누고, 필요한 작업과 필요하지 않은 작업을 구분해서 설명합니다.",
  },
  {
    number: "02",
    title: "고객이 모르면, 알려준 다음에 소통하자.",
    body: "고객이 판단할 수 있도록 사진, 원인, 자재, 작업 범위를 먼저 설명합니다. 설명 없는 견적은 리스토리의 방식이 아닙니다.",
  },
];

const beliefLines = [
  "작은 일도 무시하지 않고 최선을 다해야 한다.",
  "작은 일에도 최선을 다하면 정성스럽게 된다.",
  "정성스럽게 되면, 겉에 배어 나오고,",
  "겉에 배어 나오면, 겉으로 드러나게 된다.",
  "겉으로 드러나게 되면, 이내 밝아지고",
  "밝아지면, 남을 감동시키게 된다.",
  "남을 감동시키면 변화하고",
  "변화하면, 좋은 시공자가 된다.",
];

function SectionNumber({ value }: { value: string }) {
  return (
    <p className="text-sm font-black tracking-[0.28em] text-[#67a3ff]">
      {value}
    </p>
  );
}

export default function PhilosophyPage() {
  return (
    <main className="bg-black text-white">
      <WebPageJsonLd
        name="리스토리 스튜디오 사업 철학"
        description="작은 마감 하나에도 정성을 넣는 곳. 리스토리 스튜디오의 솔직한 소통과 시공 신념."
        url={PAGE_URL}
        image={HERO_IMAGE}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "홈", url: "https://www.restorystudio.co.kr" },
          { name: "사업 철학", url: PAGE_URL },
        ]}
      />

      <section className="relative min-h-[86vh] overflow-hidden border-b border-white/10 bg-black">
        <Image
          src={HERO_IMAGE}
          alt="리스토리 대표가 주방 현장에서 고객에게 설명하는 모습"
          fill
          priority
          sizes="100vw"
          className="translate-x-[24%] scale-[1.24] object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,0.93)_30%,rgba(0,0,0,0.58)_66%,rgba(0,0,0,0.12)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[86vh] max-w-6xl items-center px-5 py-24 md:px-6">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-black tracking-[0.3em] text-[#67a3ff]">
              RESTORY PHILOSOPHY
            </p>
            <h1 className="text-[44px] font-black leading-[1.04] text-white md:text-[80px]">
              리스토리
              <br />
              스튜디오
            </h1>
            <p className="mt-8 max-w-2xl text-2xl font-black leading-snug text-white md:text-4xl">
              작은 마감 하나에도 정성을 넣는 곳,
              <br />
              솔직한 소통.
            </p>
            <p className="mt-7 max-w-xl text-base font-medium leading-8 text-white/72 md:text-lg">
              누가, 어떤 생각으로 이 회사를 운영하는지 솔직하게
              말씀드리겠습니다.
            </p>
            <div className="mt-12 flex items-center gap-3 text-xs font-black tracking-[0.24em] text-white/42">
              <span className="h-px w-12 bg-white/25" />
              SCROLL
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-black px-5 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionNumber value="01" />
          <div className="mt-5 max-w-3xl">
            <h2 className="text-3xl font-black leading-tight text-white md:text-5xl">
              저는 국내 대형
              <br />
              가구 회사에서
              <br />
              시공자로 일했습니다.
            </h2>
            <p className="mt-9 text-base font-medium leading-8 text-white/66 md:text-lg">
              안녕하세요. 리스토리 대표 고관호입니다. 저는 가구 회사의
              시공자로 일하며 현장의 구조를 가까이에서 봤습니다.
            </p>
          </div>

          <div className="mt-12 border-l-4 border-[#ff6a2a] pl-6 md:mt-16 md:pl-8">
            <p className="text-2xl font-black italic leading-snug text-white md:text-4xl">
              나는 지금, 무엇을 위해 일하고 있는 걸까?
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] md:mt-16">
            <Image
              src="/images/philosophy/hanssem-truck.png"
              alt="대형 가구 회사 시공자로 일하던 시절의 현장 차량 사진"
              width={1240}
              height={660}
              className="h-auto w-full object-cover"
            />
          </div>

          <div className="mt-12 max-w-4xl space-y-7 text-lg font-medium leading-9 text-white/72">
            <p className="text-2xl font-black leading-snug text-white md:text-3xl">
              그리고 저는 화가 났습니다.
              <br />이 업계 전반의 마음가짐이 마음에 들지 않았습니다.
            </p>
            <p>
              사실 소비자는 잘 모릅니다. 어떤 자재가 쓰였는지, 꼭 필요한
              작업인지, 교체가 맞는지 수리가 맞는지 판단하기 어렵습니다.
            </p>
            <p>
              문제는 그 점을 이용하는 업자들이 있다는 것입니다. 그래서
              리스토리는 먼저 설명하고, 고객이 이해한 다음에 선택할 수 있게 돕는
              방향을 택했습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#050505] px-5 py-20 text-white md:px-6 md:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionNumber value="02" />
          <div className="mt-5 grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-end">
            <h2 className="text-3xl font-black leading-tight text-white md:text-5xl">
              정보의 비대칭을
              <br />
              그냥 두지 않겠습니다.
            </h2>
            <p className="max-w-2xl text-base font-medium leading-8 text-white/68 md:text-lg">
              자재, 시공비, 철거비처럼 고객이 바로 확인하기 어려운 곳일수록
              더 솔직해야 한다고 믿습니다. 리스토리가 먼저 설명하는 이유는
              고객이 더 좋은 선택을 해야 하기 때문입니다.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {problemCards.map((item) => (
              <article
                key={item.label}
                className="rounded-lg border border-white/10 bg-white/[0.045] p-6 md:p-8">
                <p className="text-xs font-black tracking-[0.22em] text-[#8fb4ff]">
                  {item.label}
                </p>
                <h3 className="mt-5 text-2xl font-black leading-snug text-white">
                  {item.title}
                </h3>
                <p className="mt-5 text-base font-medium leading-8 text-white/66">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-black px-5 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionNumber value="03" />
          <h2 className="mt-5 max-w-4xl text-3xl font-black leading-tight text-white md:text-5xl">
            리스토리 스튜디오의 사업 원칙은 단순합니다.
          </h2>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {principles.map((item) => (
              <article
                key={item.number}
                className="rounded-lg border border-white/10 bg-white/[0.045] p-6 md:p-8">
                <p className="text-sm font-black text-[#67a3ff]">
                  PRINCIPLE {item.number}
                </p>
                <h3 className="mt-5 text-2xl font-black leading-snug text-white md:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-5 text-base font-medium leading-8 text-white/66">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#050505] px-5 py-20 md:px-6 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          <div>
            <SectionNumber value="04" />
            <h2 className="mt-5 text-3xl font-black leading-tight text-white md:text-5xl">
              리스토리의
              <br />
              시공 신념.
            </h2>
          </div>

          <div className="space-y-8">
            <div className="rounded-lg border border-white/10 bg-black p-6 md:p-10">
              <div className="space-y-4">
                {beliefLines.map((line) => (
                  <p
                    key={line}
                    className="text-xl font-black leading-relaxed text-white md:text-3xl">
                    {line}
                  </p>
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-[#171717] px-5 py-10 text-center md:px-10 md:py-12">
              <p className="text-xl font-black leading-relaxed text-white md:text-3xl">
                "현장에서{" "}
                <span className="text-[#ff6a2a]">
                  지극히 정성을 다하는 시공자
                </span>
                만이
              </p>
              <p className="mt-4 text-xl font-black leading-relaxed text-white md:text-3xl">
                리스토리 스튜디오와 함께{" "}
                <span className="text-[#ff6a2a]">
                  업계를 바꿀 수 있습니다.
                </span>
                "
              </p>
              <div className="mx-auto mt-10 h-0.5 w-10 bg-[#ff6a2a]" />
            </div>
            <div className="overflow-hidden rounded-lg border border-white/10 bg-white">
              <Image
                src="/images/philosophy/operation-philosophy-handwriting.jpg"
                alt="리스토리 시공 신념 손글씨"
                width={1152}
                height={1536}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black px-5 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-6xl border-t border-white/10 pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-base font-medium leading-8 text-white/66 md:text-lg">
              리스토리에 부동산 매매업자들이 많이 오는 이유가 그 증거입니다.
            </p>
            <p className="mt-8 text-2xl font-black leading-relaxed text-white md:text-4xl">
              시공을 단순한 돈벌이가 아닌,
              <br />
              <span className="text-[#ff6a2a]">
                신념을 가지고 작은 일에도 최선을 다하는 업체
              </span>
              <br />
              "리스토리"입니다.
            </p>
          </div>

          <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center gap-8 md:flex-row md:justify-center">
            <Image
              src="/images/bro.webp"
              alt="리스토리 대표"
              width={420}
              height={420}
              className="h-auto w-full max-w-[240px] object-contain"
            />
            <Link
              href="/cases"
              className="flex w-full max-w-[320px] items-center justify-center rounded-lg bg-[#ff6a2a] px-8 py-4 text-sm font-black text-white transition hover:bg-[#ef5d1f] md:w-auto">
              작업 사례 보기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
