"use client";

import { useEffectEvent, useId, useLayoutEffect, useRef, useState, type UIEvent } from "react";
import JobDialog from "./JobDialog";
import s from "./jobPhotos.module.css";

export type FieldPhoto = { url: string; label: string; group?: string };

export default function JobPhotoViewer({
  photos,
  start = 0,
  onClose,
  onManage,
}: {
  photos: FieldPhoto[];
  start?: number;
  onClose: () => void;
  onManage?: () => void;
}) {
  const [position, setPosition] = useState(start);
  const titleId = useId();
  const stage = useRef<HTMLDivElement>(null);
  const pageWidth = useRef(0);
  const requested = useRef<number | null>(null);
  const hasPhotos = photos.length > 0;
  const index = Math.max(0, Math.min(position, photos.length - 1));
  const current = photos[index];

  const alignPage = useEffectEvent(() => {
    const viewport = stage.current;
    if (!viewport || !viewport.clientWidth || viewport.clientWidth === pageWidth.current) return;
    pageWidth.current = viewport.clientWidth;
    viewport.scrollTo({ left: (requested.current ?? index) * pageWidth.current, behavior: "instant" });
  });

  useLayoutEffect(() => {
    const viewport = stage.current;
    if (!viewport) return;
    alignPage();
    const observer = new ResizeObserver(() => alignPage());
    observer.observe(viewport);
    return () => {
      observer.disconnect();
      pageWidth.current = 0;
    };
  }, [hasPhotos]);

  function goTo(photoIndex: number, behavior: ScrollBehavior = "auto") {
    const viewport = stage.current;
    if (!viewport) return;
    const next = Math.max(0, Math.min(photoIndex, photos.length - 1));
    requested.current = next;
    viewport.scrollTo({ left: next * viewport.clientWidth, behavior });
  }

  function move(step: number) {
    goTo((requested.current ?? index) + step);
  }

  function followScroll(event: UIEvent<HTMLDivElement>) {
    const viewport = event.currentTarget;
    const width = viewport.clientWidth;
    // ResizeObserver realigns the same photo before we read offsets at the new width.
    if (!width || width !== pageWidth.current) return;
    const nearest = Math.round(viewport.scrollLeft / width);
    if (requested.current === nearest && Math.abs(viewport.scrollLeft - nearest * width) < 1) {
      requested.current = null;
    }
    setPosition(nearest);
  }

  function takeOverScroll() {
    requested.current = null;
  }

  if (!current) return null;
  const groups = Array.from(
    new Set(photos.map((photo) => photo.group).filter((group): group is string => Boolean(group))),
  );
  let downloadUrl = current.url;
  try {
    const url = new URL(current.url);
    if (url.pathname.includes("/storage/v1/object/public/")) {
      url.searchParams.set("download", current.label + ".jpg");
      downloadUrl = url.href;
    }
  } catch {
    /* Local and legacy paths can be opened through their original URL. */
  }
  return (
    <JobDialog
      labelledBy={titleId}
      onClose={onClose}
      wide
      onKeyDown={(event) => {
        if (event.altKey || event.metaKey || event.ctrlKey) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          move(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
    >
      <div className={s.viewer}>
        <header className={s.viewerHeader}>
          <div aria-live="polite" aria-atomic="true">
            <h2 id={titleId}>{current.label}</h2>
            <span>
              {index + 1} / {photos.length}
            </span>
          </div>
          <div className={s.viewerTools}>
            {onManage && (
              <button type="button" className={s.secondary} onClick={onManage}>
                완료 사진 관리
              </button>
            )}
            <button type="button" className={s.secondary} onClick={onClose}>
              닫기
            </button>
          </div>
        </header>
        {groups.length > 1 && (
          <div className={s.groups} role="group" aria-label="사진 종류">
            {groups.map((group) => (
              <button
                key={group}
                type="button"
                aria-pressed={group === current.group}
                onClick={() => goTo(photos.findIndex((photo) => photo.group === group), "instant")}
              >
                {group} {photos.filter((photo) => photo.group === group).length}
              </button>
            ))}
          </div>
        )}
        <div
          ref={stage}
          className={s.stage}
          role="region"
          aria-label="현장 사진"
          tabIndex={photos.length > 1 ? 0 : undefined}
          onScroll={followScroll}
          onPointerDown={takeOverScroll}
          onWheel={takeOverScroll}
        >
          {photos.map((photo, i) => (
            <div key={`${i}-${photo.url}`} className={s.slide} aria-hidden={i !== index}>
              {/* Field photos may use Supabase storage or a legacy image URL. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.label}
                loading={Math.abs(i - index) <= 1 ? "eager" : "lazy"}
                draggable={false}
              />
            </div>
          ))}
        </div>
        <footer className={s.viewerFoot}>
          {photos.length > 1 && (
            <button
              type="button"
              className={s.secondary}
              aria-disabled={index === 0}
              tabIndex={index === 0 ? -1 : undefined}
              onClick={index === 0 ? undefined : () => move(-1)}
            >
              이전 사진
            </button>
          )}
          <a
            className={s.open}
            href={downloadUrl}
            download={current.label + ".jpg"}
            target="_blank"
            rel="noreferrer"
          >
            다운로드
          </a>
          {photos.length > 1 && (
            <button
              type="button"
              className={s.secondary}
              aria-disabled={index === photos.length - 1}
              tabIndex={index === photos.length - 1 ? -1 : undefined}
              onClick={index === photos.length - 1 ? undefined : () => move(1)}
            >
              다음 사진
            </button>
          )}
        </footer>
      </div>
    </JobDialog>
  );
}
