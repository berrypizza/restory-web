"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminIcon from "./AdminIcon";
import TechnicianAvatar from "./TechnicianAvatar";
import s from "../workspace.module.css";

export const destinations = [
  { id: "home", label: "업무 홈", short: "홈", icon: "home" },
  { id: "calendar", label: "현장 일정", short: "일정", icon: "calendar" },
  { id: "jobs", label: "작업 목록", short: "작업", icon: "list" },
  { id: "stats", label: "월간 집계", short: "집계", icon: "chart" },
] as const;
export type Destination = (typeof destinations)[number]["id"] | "intake";

export function AdminBrand() {
  return (
    <div className={s.brand}>
      <Image src="/images/logo-cc.png" alt="" width={38} height={38} />
      <span>리스토리 스튜디오</span>
    </div>
  );
}

function Account({ name, isAdmin }: { name: string; isAdmin: boolean }) {
  return (
    <div className={s.account}>
      <TechnicianAvatar name={name} />
      <div>
        <strong>{name}</strong>
        <small>{isAdmin ? "관리자" : "현장 기사"}</small>
      </div>
    </div>
  );
}

export default function AdminNavigation({
  active,
  name,
  isAdmin,
  onLogout,
  onRefresh,
  refreshing,
}: {
  active: Destination;
  name: string;
  isAdmin: boolean;
  onLogout: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  const menu = useRef<HTMLDialogElement>(null);
  const closeMenu = () => menu.current?.close();
  const navLink = (item: (typeof destinations)[number], compact = false) => (
    <a
      key={item.id}
      href={`#${item.id}`}
      aria-current={item.id === active ? "page" : undefined}
      onClick={closeMenu}
    >
      <AdminIcon name={item.icon} />
      <span>{item.id === "stats" && !isAdmin ? "내 실적" : compact ? item.short : item.label}</span>
    </a>
  );
  const links = (
    <>
      <div className={s.navGroup}>
        <p>현장 업무</p>
        {destinations.filter(item => item.id !== "stats").map(item => navLink(item))}
        {isAdmin && <a href="#intake" aria-current={active === "intake" ? "page" : undefined} onClick={closeMenu}><AdminIcon name="inbox" />고객 접수함</a>}
      </div>
      <div className={s.navGroup}>
        <p>운영 관리</p>
        {destinations.filter(item => item.id === "stats").map(item => navLink(item))}
        {isAdmin && (
          <Link href="/admin/consultations" onClick={closeMenu}>
            <AdminIcon name="review" />
            기살 상담
          </Link>
        )}
      </div>
    </>
  );
  const refresh = <button type="button" className={s.logout} disabled={refreshing} onClick={() => { closeMenu(); onRefresh(); }}><AdminIcon name="refresh" size={17} />{refreshing ? "일정 불러오는 중" : "일정 새로고침"}</button>;
  const logout = (
    <button
      type="button"
      className={s.logout}
      onClick={() => {
        closeMenu();
        onLogout();
      }}
    >
      <AdminIcon name="logout" size={17} />
      로그아웃
    </button>
  );
  return (
    <>
      <aside className={s.rail}>
        <a className={s.brandHome} href="#home" aria-label="리스토리 스튜디오 업무 홈"><AdminBrand /></a>
        <nav aria-label="관리 업무" className={s.nav}>
          {links}
        </nav>
        <div className={s.railFoot}>
          <Account name={name} isAdmin={isAdmin} />
          {refresh}
          {logout}
        </div>
      </aside>
      <header className={s.mobileHeader}>
        <a href="#home" aria-label="리스토리 스튜디오 업무 홈"><AdminBrand /></a>
        <Account name={name} isAdmin={isAdmin} />
      </header>
      <nav className={s.bottomNav} aria-label="모바일 관리 업무">
        {destinations.map((item) => navLink(item, true))}
        <button
          type="button"
          aria-haspopup="dialog"
          aria-label="메뉴 더 보기"
          onClick={() => menu.current?.showModal()}
        >
          <AdminIcon name="more" />더 보기
        </button>
      </nav>
      <dialog
        ref={menu}
        className={s.menu}
        aria-labelledby="admin-menu-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeMenu();
        }}
      >
        <div className={s.sheetContent}>
          <div className={s.sheetTitle}>
            <h2 id="admin-menu-title">전체 메뉴</h2>
            <button type="button" className={s.square} aria-label="메뉴 닫기" onClick={closeMenu}>
              <AdminIcon name="close" />
            </button>
          </div>
          <nav className={s.nav} aria-label="전체 관리 업무">
            {links}
          </nav>
          {refresh}
          {logout}
        </div>
      </dialog>
    </>
  );
}
