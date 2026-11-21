"use client";

import Image from "next/image";
import { useId, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import s from "../cases.module.css";

type Phase = "before" | "after";
const phases = ["before", "after"] as const;
const labels = { before: "작업 전", after: "작업 후" };
type Photos = { before: string; after: string; title: string };
type Viewer = { initial: Phase; previews: Record<Phase, string>; opener: HTMLAnchorElement };

function PhotoDialog({ photos, viewer, onClose }: { photos: Photos; viewer: Viewer; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const [phase, setPhase] = useState(viewer.initial);
  const titleId = useId();
  useLayoutEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => {
      element?.close();
      viewer.opener.focus({ preventScroll: true });
    };
  }, [viewer.opener]);
  return (
    <dialog ref={dialog} className={s.lightbox} aria-labelledby={titleId}
      onCancel={event => { event.preventDefault(); onClose(); }}
      onKeyDown={event => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          setPhase(event.key === "ArrowLeft" ? "before" : "after");
        }
      }}>
      <div className={s.lightboxHead}><h2 id={titleId}>전후 사진 확대</h2>
        <button type="button" onClick={onClose}>닫기 <span aria-hidden="true">×</span></button>
      </div>
      <div className={s.lightboxStage} onTouchStart={event => {
        const touch = event.touches[0];
        start.current = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null;
      }} onTouchCancel={() => { start.current = null; }} onTouchEnd={event => {
        const origin = start.current;
        start.current = null;
        if (!origin || event.touches.length) return;
        const dx = event.changedTouches[0].clientX - origin.x;
        const dy = event.changedTouches[0].clientY - origin.y;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) setPhase(dx < 0 ? "after" : "before");
      }}>
        {phases.map(key => <div key={key} className={s.lightboxPhoto} data-active={key === phase} aria-hidden={key !== phase}
          style={{ backgroundImage: viewer.previews[key] ? `url("${viewer.previews[key]}")` : undefined }}>
          <Image src={photos[key]} alt={`${photos.title} ${labels[key]}`} fill sizes="(min-width: 1120px) 1080px, 100vw" loading="eager" />
        </div>)}
      </div>
      <div className={s.lightboxFoot}>
        <div className={s.photoSwitch} role="group" aria-label="확대할 사진">
          {phases.map(key => <button key={key} type="button" aria-pressed={key === phase} onClick={() => setPhase(key)}>{labels[key]}</button>)}
        </div>
        <a href={photos[phase]} target="_blank" rel="noopener noreferrer">원본 열기<span className="sr-only"> (새 창)</span></a>
      </div>
      <span className="sr-only" aria-live="polite">{labels[phase]}</span>
    </dialog>
  );
}

export default function CasePhotos({ photos }: { photos: Photos }) {
  const [viewer, setViewer] = useState<Viewer | null>(null);
  const thumbnails = useRef<Partial<Record<Phase, HTMLImageElement | null>>>({});
  function open(event: MouseEvent<HTMLAnchorElement>, key: Phase) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setViewer({ initial: key, opener: event.currentTarget,
      previews: { before: thumbnails.current.before?.currentSrc || "", after: thumbnails.current.after?.currentSrc || "" } });
  }
  return (
    <section className={s.photos} data-service-section="photo_compare" aria-label="작업 전후 사진">
      <div className={s.photoPair}>{phases.map(key =>
        <a key={key} href={photos[key]} onClick={event => open(event, key)} className={s.photo} aria-label={`${labels[key]} 사진 확대`}>
          <Image src={photos[key]} alt={`${photos.title} ${labels[key]}`} fill sizes="(max-width: 920px) 46vw, 390px" loading="eager"
            ref={element => { thumbnails.current[key] = element; }} />
          <span className={s.photoLabel} data-phase={key}>{labels[key]}</span>
          <span className={s.enlarge} aria-hidden="true"><svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7"><path d="M3 7V3h4M13 3h4v4M17 13v4h-4M7 17H3v-4"/></svg></span>
        </a>)}</div>
      {viewer && <PhotoDialog photos={photos} viewer={viewer} onClose={() => setViewer(null)} />}
    </section>
  );
}
