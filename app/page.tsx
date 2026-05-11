import Link from "next/link";
import { businessLines } from "@/lib/site-config";

export const metadata = {
  title: "Re'Story - 가구수리 · 가죽리폼 · 주방리폼",
  description: "사진 한 장으로 수리와 리폼 가능 여부를 먼저 안내드립니다.",
};

export default function MainPage() {
  return (
    <main className="bg-white">
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-sm font-bold tracking-widest text-neutral-400">RESTORY</p>
          <h1 className="text-4xl md:text-6xl font-black leading-tight text-neutral-950">
            버리기 전,<br />사진 한 장으로 먼저 봅니다.
          </h1>
          <p className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-neutral-500">
            수리담에서 확장한 Re&apos;Story는 가구수리, 가죽 리폼, 주방 리폼을 세 개의 라인으로 나눠 판단합니다.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
          {businessLines.map((line) => (
            <Link key={line.id} href={line.href} className="rounded-3xl border border-neutral-200 bg-neutral-50 p-7 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg">
              <p className="text-sm font-bold text-neutral-400">{line.subtitle}</p>
              <h2 className="mt-4 text-3xl font-black text-neutral-950">{line.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-neutral-500">{line.description}</p>
              <p className="mt-8 text-sm font-black text-neutral-950">항목 보기 →</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
