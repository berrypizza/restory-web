"use client";

import { useId, useRef, useState } from "react";
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
  const touch = useRef<{ x: number; y: number } | null>(null);
  const index = Math.min(position, photos.length - 1);
  const current = photos[index];
  function move(step: number) {
    setPosition(Math.max(0, Math.min(index + step, photos.length - 1)));
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
    <JobDialog labelledBy={titleId} onClose={onClose} wide>
      <div
        className={s.viewer}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
        <header className={s.viewerHeader}>
          <div aria-live="polite">
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
                onClick={() => setPosition(photos.findIndex((photo) => photo.group === group))}
              >
                {group} {photos.filter((photo) => photo.group === group).length}
              </button>
            ))}
          </div>
        )}
        <div
          className={s.stage}
          onTouchStart={(event) => {
            touch.current =
              event.touches.length === 1
                ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
                : null;
          }}
          onTouchEnd={(event) => {
            if (!touch.current || event.touches.length) return;
            const dx = event.changedTouches[0].clientX - touch.current.x;
            const dy = event.changedTouches[0].clientY - touch.current.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
            touch.current = null;
          }}
        >
          {/* Field photos may use Supabase storage or a legacy image URL. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={current.url} src={current.url} alt={current.label} />
        </div>
        <footer className={s.viewerFoot}>
          {photos.length > 1 && (
            <button
              type="button"
              className={s.secondary}
              disabled={index === 0}
              onClick={() => move(-1)}
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
              disabled={index === photos.length - 1}
              onClick={() => move(1)}
            >
              다음 사진
            </button>
          )}
        </footer>
      </div>
    </JobDialog>
  );
}
