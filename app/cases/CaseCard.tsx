import Image from "next/image";
import Link from "next/link";
import type { CaseItem } from "@/lib/case-data";
import { caseDate, formatCaseDate, publicRegion } from "./case-browser";
import s from "./cases.module.css";

export default function CaseCard({ item, context, anchor = false }: { item: CaseItem; context?: string; anchor?: boolean }) {
  const region = publicRegion(item);
  return (
    <article className={s.card} id={anchor ? item.id : undefined}>
      <Link href={`/cases/${item.id}${context ? `?${context}` : ""}`} aria-label={item.title} className={s.cardLink}>
        <div className={s.cover}>
          <Image src={item.afterImg} alt={`${item.category} 작업 후`} fill sizes="(max-width: 600px) 94vw, (max-width: 920px) 46vw, 360px" />
        </div>
        <div className={s.cardBody}>
          <div className={s.cardMeta}><span>{item.category}</span>{region && <span>{region}</span>}</div>
          <h3>{item.title}</h3>
          <time dateTime={caseDate(item.date)}>{formatCaseDate(item.date)}</time>
        </div>
      </Link>
    </article>
  );
}
