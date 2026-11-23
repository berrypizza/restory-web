"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { businessLines } from "@/lib/site-config";
import { buildTrackedContactPath } from "@/lib/attribution";
import { fieldInfo, primaryPages, serviceHref, studioPages } from "@/lib/public-navigation";
import s from "./navigation.module.css";

export default function DrawerMenu({ pathname, sinkDoor }: { pathname: string; sinkDoor: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const dismiss = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const followingLink = useRef(false);
  const id = useId();
  const [open, setOpen] = useState(false);
  const close = () => dialog.current?.close();
  const current = (href: string) => pathname === href ? "page" as const : undefined;

  return (
    <>
      <button type="button" ref={opener} className={s.menuButton} aria-label="전체 메뉴 열기" aria-haspopup="dialog" aria-expanded={open} aria-controls={id}
        onClick={() => { followingLink.current = false; dialog.current?.showModal(); dismiss.current?.focus(); setOpen(true); }}>
        <span className={s.hamburger} aria-hidden="true"><i /><i /><i /></span>
      </button>
      <dialog ref={dialog} id={id} onClose={() => {
        setOpen(false);
        if (!followingLink.current) opener.current?.focus({ preventScroll: true });
      }} className={s.menuDialog} aria-labelledby="site-menu-title"
        onKeyDown={event => {
          if (event.key !== "Tab" || event.altKey || event.ctrlKey || event.metaKey) return;
          const links = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("button, a[href]"));
          const index = links.indexOf(document.activeElement as HTMLElement);
          const next = index < 0 ? (event.shiftKey ? links.length - 1 : 0)
            : (index + (event.shiftKey ? -1 : 1) + links.length) % links.length;
          event.preventDefault();
          links[next]?.focus();
        }}
        onClick={event => {
          if (event.target !== event.currentTarget) return;
          const rect = event.currentTarget.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
        }}>
        <div className={s.dialogHead}>
          <h2 id="site-menu-title">전체 메뉴</h2>
          <button type="button" ref={dismiss} className={s.close} aria-label="메뉴 닫기" onClick={close}><span aria-hidden="true">×</span></button>
        </div>
        <nav className={s.dialogBody} aria-label="전체 메뉴 항목" onClick={event => {
          if (event.target instanceof Element && event.target.closest("a")) {
            followingLink.current = true;
            close();
          }
        }}>
          <section className={s.menuSection}>
            <h3>수리 분야</h3>
            <div className={s.fieldMenu}>
              {businessLines.map(line => (
                <div key={line.id}>
                  <Link className={s.groupTitle} href={line.href} aria-current={current(line.href)}>{fieldInfo[line.id].label}</Link>
                  {line.services.filter(service => serviceHref(line.id, service.slug) !== line.href).map(service => {
                    const href = serviceHref(line.id, service.slug);
                    return <Link key={href} href={href} aria-current={current(href)}>{service.shortTitle}</Link>;
                  })}
                  {line.id === "sofa" && <Link href="/sofa#guide-cases">쿠션 복원 사례</Link>}
                </div>
              ))}
            </div>
          </section>
          <section className={s.menuSection}>
            <h3>리스토리 둘러보기</h3>
            <div className={s.pageLinks}>{[...primaryPages, ...studioPages].map(item =>
              <Link key={item.href} href={item.href} aria-current={current(item.href)}>{item.label}</Link>
            )}</div>
          </section>
          <section className={s.menuSection}>
            <h3>상담</h3>
            {sinkDoor && <p>문짝 가까이 1장 + 주방 전체 1장으로 예상 견적 확인</p>}
            <div className={s.contactLinks}>
              <Link href="/request">사진으로 접수</Link>
              <a href={buildTrackedContactPath("kakao", sinkDoor ? "sink_door" : "menu")}>카카오톡 상담</a>
              <a href={buildTrackedContactPath("phone", "menu")}>전화 문의</a>
            </div>
          </section>
        </nav>
      </dialog>
    </>
  );
}
