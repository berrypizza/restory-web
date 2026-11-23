import Link from "next/link";
import { fieldCases, fieldInfo } from "@/lib/public-navigation";
import type { BusinessLineId } from "@/lib/site-config";
import type { ProductOption } from "@/app/admin/lib/products";
import type { Service } from "@/lib/consultation-services";
import { Breadcrumb } from "../../PublicIntro";
import s from "../../customer.module.css";

export function LandingTrail({ field, title }: { field: BusinessLineId; title: string }) {
  return <div className={s.trail}><div className={s.wrap}>
    <Breadcrumb parents={title === fieldInfo[field].label ? [] : [{ href: "/" + field, label: fieldInfo[field].label }]} current={title} />
  </div></div>;
}

export function LandingSections({ sections }: { sections: [string, string][] }) {
  return <nav className={s.sectionNav} aria-label="서비스 안내 바로가기">
    <div className={s.wrap}>{sections.map(([id,label]) => <a key={id} href={"#" + id}>{label}</a>)}</div>
  </nav>;
}

export function LandingIntake({ field, service, item }: { field: BusinessLineId; service?: Service; item?: ProductOption }) {
  const query = new URLSearchParams();
  if (service) query.set("service", service);
  if (item) query.set("item", item);
  return <div className={s.intakeRow} data-service-handoff><div className={s.wrap}>
    <div><strong>사진으로 상담 접수</strong><p>담당자가 내용을 확인하고 연락드려요.</p></div>
    <div className={s.actions}><Link href={fieldCases(field)} className={s.lightButton}>관련 작업 사례</Link>
      <Link href={query.size ? "/request?" + query : "/request"} className={s.mainButton}>접수 양식 열기</Link></div>
  </div></div>;
}
