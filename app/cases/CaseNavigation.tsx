"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useContext, useTransition, type ComponentProps, type FormEvent, type ReactNode } from "react";
import type { CaseFilters } from "./case-browser";
import s from "./cases.module.css";

const Navigation = createContext<{ pending: boolean; navigate: (href: string) => void } | null>(null);

function useCaseNavigation() {
  const navigation = useContext(Navigation);
  if (!navigation) throw new Error("Case navigation requires the catalog.");
  return navigation;
}

export function CaseNavigation({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const navigate = (href: string) => startTransition(() => router.push(href));
  return <Navigation.Provider value={{ pending, navigate }}>{children}</Navigation.Provider>;
}

export function BrowseLink({ href, ...props }: Omit<ComponentProps<typeof Link>, "href" | "onNavigate"> & { href: string }) {
  const { pending, navigate } = useCaseNavigation();
  return <Link {...props} href={href} aria-disabled={pending || undefined} onNavigate={event => {
    event.preventDefault();
    if (!pending) navigate(href);
  }} />;
}

export function CaseSearch({ filters }: { filters: CaseFilters }) {
  const { pending, navigate } = useCaseNavigation();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const params = new URLSearchParams();
    for (const [key, value] of new FormData(event.currentTarget)) {
      if (typeof value === "string" && value.trim()) params.set(key, value.trim());
    }
    navigate(params.size ? `/cases?${params}` : "/cases");
  }
  return (
    <form action="/cases" method="get" onSubmit={submit} role="search" aria-label="작업 사례 검색" className={s.search}>
      {filters.category !== "전체" && <input type="hidden" name="cat" value={filters.category} />}
      {filters.tag && <input type="hidden" name="tag" value={filters.tag} />}
      <label htmlFor="case-search" className="sr-only">지역, 가구 또는 증상</label>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5" strokeLinecap="round"/></svg>
      <input key={filters.query} type="search" id="case-search" name="q" maxLength={80} defaultValue={filters.query} placeholder="지역, 가구, 증상으로 검색" />
      <button type="submit" disabled={pending}>{pending ? "조회 중" : "검색"}</button>
    </form>
  );
}

export function CaseResults({ children }: { children: ReactNode }) {
  const { pending } = useCaseNavigation();
  return <section className={s.results} id="case-results" data-service-section="cases" aria-labelledby="case-results-title">
    <span role="status" className={s.pendingNotice}>{pending ? "사례를 불러오는 중…" : ""}</span>
    <div inert={pending} aria-busy={pending}>{children}</div>
  </section>;
}
