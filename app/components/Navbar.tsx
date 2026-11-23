"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buildTrackedContactPath } from "@/lib/attribution";
import { businessLines } from "@/lib/site-config";
import { primaryPages, sinkDoorGuide } from "@/lib/public-navigation";
import DrawerMenu from "./DrawerMenu";
import s from "./navigation.module.css";

export default function Navbar() {
  const pathname = usePathname();
  const sinkDoor = sinkDoorGuide(pathname);
  const currentField = businessLines.some(line => pathname === line.href || pathname.startsWith(line.href + "/"));
  return (
    <header className={s.header} data-site-sticky-nav>
      <a className={s.skip} href="#public-content">본문 바로가기</a>
      <div className={s.bar}>
        <Link href="/" className={s.brand} aria-label="리스토리 홈">
          <Image src="/images/logo-v3.png" alt="" width={112} height={112} />
        </Link>
        <nav className={s.primary} aria-label="주요 메뉴">
          <Link href="/#services" aria-current={currentField ? "location" : undefined}>수리 분야</Link>
          {primaryPages.map(({ href, label }) => (
            <Link key={href} href={href} aria-current={pathname === href || pathname.startsWith(href + "/") ? "location" : undefined}>{label}</Link>
          ))}
        </nav>
        <div className={s.actions}>
          {sinkDoor ? <a className={s.contact} data-cta="sink_door_nav_kakao" href={buildTrackedContactPath("kakao", "sink_door")}>문짝 사진 상담</a>
            : <Link className={s.contact} href="/request">상담 접수</Link>}
          <DrawerMenu key={pathname} pathname={pathname} sinkDoor={sinkDoor} />
        </div>
      </div>
    </header>
  );
}
