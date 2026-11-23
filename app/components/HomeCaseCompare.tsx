"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import s from "./customer.module.css";

export default function HomeCaseCompare({ before, after, href }: { before: string; after: string; href: string }) {
  const [stage, setStage] = useState<"전" | "후">("후");
  return (
    <figure className={s.heroCase}>
      <div className={s.heroPhoto}>
        <Image src={stage === "후" ? after : before} alt={`파주 싱크대 문짝 교체 ${stage} 주방`} fill preload={stage === "후"}
          sizes="(max-width: 760px) 92vw, (max-width: 1200px) 50vw, 555px" style={{ objectPosition: "53% 61%" }} />
      </div>
      <figcaption>
        <Link href={href} className={s.caseTitle}>파주 · 싱크대 문짝 교체</Link>
        <div role="group" aria-label="시공 사진 비교" className={s.switcher}>
          {(["전", "후"] as const).map(value => <button type="button" key={value} aria-pressed={stage === value} onClick={() => setStage(value)}>작업 {value}</button>)}
        </div>
      </figcaption>
    </figure>
  );
}
