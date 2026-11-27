"use client";

import { useState, useEffect } from "react";
import s from "./floating.module.css";
import { buildTrackedContactPath } from "@/lib/attribution";

interface FloatingCTAProps {
  phone?: string;
  kakaoUrl?: string;
  onReviewClick?: () => void;
  label?: string;
  compactMobile?: boolean;
  avoidOverlapSelector?: string;
  /** false면 같은 탭에서 열기 (예: 자체 접수 양식) */
  newTab?: boolean;
}

export default function FloatingCTA({
  phone = buildTrackedContactPath("phone", "floating_cta"),
  kakaoUrl = buildTrackedContactPath("kakao", "floating_cta"),
  onReviewClick,
  compactMobile = false,
  avoidOverlapSelector,
  label = "카카오톡 사진 상담",
  newTab = true,
}: FloatingCTAProps) {
  const [showSticky, setShowSticky] = useState(false);
  const [inlineContactVisible, setInlineContactVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const contacts = Array.from(document.querySelectorAll(
      [avoidOverlapSelector, "[data-service-handoff]", "body > footer"].filter(Boolean).join(",")
    ));
    const desktop = window.matchMedia("(min-width: 48rem)");
    const header = document.querySelector<HTMLElement>("[data-site-sticky-nav]");
    let observer: IntersectionObserver;

    function observeContacts() {
      observer?.disconnect();
      const top = desktop.matches ? -64 : (header?.offsetHeight ?? 0);
      const bottom = desktop.matches ? 64 : 0;

      // Initialize from this layout before the observer delivers its first entries.
      const isVisible = (contact: Element) => {
        const rect = contact.getBoundingClientRect();
        return rect.height > 0 && rect.bottom > top && rect.top < innerHeight + bottom;
      };
      const visibleContacts = new Set(contacts.filter(isVisible));
      setInlineContactVisible(visibleContacts.size > 0);

      observer = new IntersectionObserver((entries, source) => {
        if (source !== observer) return;
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRect.height > 0) visibleContacts.add(entry.target);
          else visibleContacts.delete(entry.target);
        }
        setInlineContactVisible(visibleContacts.size > 0);
      }, {
        rootMargin: `${-top}px 0px ${bottom}px 0px`,
        // A zero-area edge contact must also notify us when the first pixels become visible.
        threshold: [0, 0.000001],
      });
      contacts.forEach(contact => observer.observe(contact));
    }

    observeContacts();
    desktop.addEventListener("change", observeContacts);
    const resize = header && new ResizeObserver(observeContacts);
    if (header) resize?.observe(header);
    return () => {
      observer.disconnect();
      desktop.removeEventListener("change", observeContacts);
      resize?.disconnect();
    };
  }, [avoidOverlapSelector]);

  const visible = showSticky && !inlineContactVisible;

  return (
    <>
      <div className={s.dock} role="group" aria-label="빠른 상담" hidden={!visible}>
        <button type="button" className={s.top} aria-label="맨 위로" onClick={() => window.scrollTo({
          top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"
        })}>맨 위로</button>
        {onReviewClick && <button type="button" className={compactMobile ? s.desktopOnly : s.review} onClick={onReviewClick}>리뷰 보기</button>}
        <a href={phone} className={s.phone} data-service-cta-location="fixed" data-cta="floating_phone">전화 문의</a>
        <a href={kakaoUrl} className={s.kakao} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})} data-service-cta-location="fixed" data-cta="floating_kakao_bar">{label}</a>
      </div>
    </>
  );
}
