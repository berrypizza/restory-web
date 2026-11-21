"use client";

import { useId, useState, type ReactNode } from "react";
import Link from "next/link";
import s from "../cases.module.css";

export default function RelatedCases({ similar, other }: { similar: ReactNode; other: ReactNode }) {
  const [group, setGroup] = useState<"similar" | "other">(similar ? "similar" : "other");
  const id = useId();
  if (!similar && !other) return null;
  return <section className={s.related} data-service-section="related">
    <div className={s.relatedHead}><h2>다른 작업도 살펴보세요</h2><Link href="/cases">전체 사례</Link></div>
    {similar && other && <div className={s.relatedSwitch} role="group" aria-label="관련 사례 선택">
      <button type="button" aria-pressed={group === "similar"} aria-controls={id} onClick={() => setGroup("similar")}>비슷한 작업</button>
      <button type="button" aria-pressed={group === "other"} aria-controls={id} onClick={() => setGroup("other")}>다른 분야</button>
    </div>}
    <div className={s.grid} id={id}>{group === "similar" ? similar : other}</div>
  </section>;
}
