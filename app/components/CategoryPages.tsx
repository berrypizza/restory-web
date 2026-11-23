import Link from "next/link";
import { businessLines, type BusinessLineConfig, type ServicePageConfig } from "@/lib/site-config";
import { fieldCases, fieldInfo, serviceHref } from "@/lib/public-navigation";
import { serviceForSlug } from "@/lib/service-analytics";
import { buildTrackedContactPath } from "@/lib/attribution";
import PublicIntro from "./PublicIntro";
import BottomCTA from "./BottomCTA";
import s from "./customer.module.css";

export function BusinessLinePage({ line }: { line: BusinessLineConfig }) {
  const field = fieldInfo[line.id];
  return <main data-service-id={line.id} className={s.publicPage}>
    <PublicIntro title={field.label} description={line.description.replaceAll("\n", " ")}
      photo={{ src: field.image, alt: `${field.label} 시공 현장`, position: field.position }}>
      <a className={s.mainButton} href="#work-types">수리 항목 보기</a>
      <Link className={s.lightButton} href={fieldCases(line.id)}>관련 작업 사례</Link>
    </PublicIntro>
    <section id="work-types" data-service-section="services" className={s.section}>
      <div className={s.wrap}>
        <div className={s.sectionHead}><h2>어떤 작업이 필요한가요?</h2></div>
        <div className={s.serviceGrid}>{line.services.map(service =>
          <Link key={service.slug} href={serviceHref(line.id, service.slug)} className={s.serviceCard}>
            <h3>{service.shortTitle}</h3><p>{service.description}</p>
          </Link>
        )}</div>
      </div>
    </section>
    <BottomCTA />
  </main>;
}

export function ServiceLandingPage({ service }: { service: ServicePageConfig }) {
  const line = businessLines.find(group => group.services.some(entry => entry.slug === service.slug));
  const field = line && fieldInfo[line.id];
  return <main data-service-id={serviceForSlug(service.slug)} className={s.publicPage}>
    <PublicIntro title={service.title} description={service.description}
      parents={line && field ? [{ href: line.href, label: field.label }] : undefined}>
      <Link href="/request" className={s.mainButton}>사진으로 상담 접수</Link>
      <a className={s.lightButton} href={buildTrackedContactPath("kakao",service.slug)}>카카오톡 상담</a>
      <a className={s.textLink} href={buildTrackedContactPath("phone",service.slug)}>전화 문의</a>
    </PublicIntro>
    <div className={s.section}><div className={s.wrap}><div className={s.columns}>
      <section data-service-section="problems"><h2 className={s.subHeading}>이런 증상이 있나요?</h2><ul className={s.points}>{service.painPoints.map(point => <li key={point}>{point}</li>)}</ul></section>
      <section data-service-section="process"><h2 className={s.subHeading}>작업은 이렇게 진행해요</h2><ol className={s.points}>{service.process.map(step => <li key={step}>{step}</li>)}</ol>
        {line && <Link className={s.textLink} href={fieldCases(line.id)}>같은 분야 작업 사례 보기</Link>}
      </section>
    </div></div></div>
  </main>;
}
