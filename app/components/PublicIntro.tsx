import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import s from "./customer.module.css";

type Crumb = { label: string; href: string };

export function Breadcrumb({ parents = [], current }: { parents?: Crumb[]; current: string }) {
  return <nav className={s.breadcrumb} aria-label="현재 위치">
    {[{ href: "/", label: "홈" }, ...parents].map(item => <span key={item.href} className={s.crumbLink}>
      <Link href={item.href}>{item.label}</Link><span aria-hidden="true">/</span>
    </span>)}
    <span aria-current="page">{current}</span>
  </nav>;
}

export default function PublicIntro({ title, description, parents, photo, children }: {
  title: string; description: string; parents?: Crumb[];
  photo?: { src: string; alt: string; position?: string }; children?: ReactNode;
}) {
  return <header data-service-section="hero" className={s.pageIntro}>
    <div className={photo ? s.heroGrid : s.wrap}>
      <div className={s.heroText}>
        <Breadcrumb parents={parents} current={title} />
        <h1 className={s.pageTitle}>{title}</h1>
        <p className={s.lead}>{description}</p>
        {children && <div className={s.actions}>{children}</div>}
      </div>
      {photo && <div className={s.categoryPhoto}><Image src={photo.src} fill preload alt={photo.alt}
        sizes="(max-width: 760px) 92vw, 520px" style={{ objectPosition: photo.position }} /></div>}
    </div>
  </header>;
}
