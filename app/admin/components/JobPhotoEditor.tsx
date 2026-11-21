"use client";

import { useId, useRef, useState } from "react";
import { compressImage, getSupabase } from "../lib/utils";
import JobPhotoViewer from "./JobPhotoViewer";
import s from "./jobPhotos.module.css";

type Upload = { file: File; path: string };
type Props = {
  label: string;
  storagePrefix: string;
  photos: string[];
  onChange: (urls: string[]) => void;
  onBusyChange: (busy: boolean) => void;
  onUnresolvedChange?: (failed: boolean) => void;
  disabled?: boolean;
};

export default function JobPhotoEditor({
  label,
  storagePrefix,
  photos,
  onChange,
  onBusyChange,
  onUnresolvedChange,
  disabled = false,
}: Props) {
  const headingId = useId();
  const camera = useRef<HTMLInputElement>(null);
  const album = useRef<HTMLInputElement>(null);
  const uploading = useRef(false);
  const [failures, setFailures] = useState<Upload[]>([]);
  const [progress, setProgress] = useState("");
  const [preview, setPreview] = useState<number | null>(null);
  const [organizing, setOrganizing] = useState(false);
  const [removed, setRemoved] = useState<{ url: string; index: number } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const locked = disabled || Boolean(progress);

  function reportFailures(items: Upload[]) {
    setFailures(items);
    onUnresolvedChange?.(items.length > 0);
  }

  async function upload(items: Upload[], previousFailures: Upload[]) {
    if (disabled || uploading.current || !items.length) return;
    uploading.current = true;
    onBusyChange(true);
    const successful: string[] = [];
    const remaining = [...previousFailures];
    try {
      for (const [i, item] of items.entries()) {
        setProgress(`사진 올리는 중 · ${i + 1}/${items.length}`);
        try {
          const blob = await compressImage(item.file);
          const bucket = getSupabase().storage.from("completion-photos");
          const { error } = await bucket.upload(item.path, blob, { contentType: "image/jpeg" });
          // A retry can find the UUID from its own previous upload if only the reply was lost.
          if (error && String(error.statusCode) !== "409") throw error;
          successful.push(bucket.getPublicUrl(item.path).data.publicUrl);
        } catch {
          remaining.push(item);
        }
      }
      if (successful.length) onChange([...photos, ...successful]);
      reportFailures(remaining);
    } finally {
      uploading.current = false;
      setProgress("");
      onBusyChange(false);
    }
  }

  function choose(files: File[]) {
    void upload(
      files.map((file) => ({ file, path: `${storagePrefix}-${crypto.randomUUID()}.jpg` })),
      failures,
    );
  }

  return (
    <section className={s.editor} aria-labelledby={headingId}>
      <div className={s.editorTitle}>
        <h3 id={headingId}>
          {label} <span>{photos.length}장</span>
        </h3>
        {photos.length > 0 && (
          <button
            type="button"
            className={s.textBtn}
            disabled={locked}
            aria-pressed={organizing}
            onClick={() => setOrganizing(!organizing)}
          >
            {organizing ? "정리 마침" : "사진 정리"}
          </button>
        )}
      </div>
      <div
        className={s.dropzone}
        data-over={dragOver || undefined}
        onDragOver={(e) => {
          e.preventDefault();
          if (!locked) setDragOver(true);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!locked) choose(Array.from(e.dataTransfer.files));
        }}
      >
        <div className={s.pickButtons}>
          <button
            className={s.pick}
            type="button"
            disabled={locked}
            onClick={() => camera.current?.click()}
          >
            카메라 촬영
          </button>
          <button
            className={s.pick}
            type="button"
            disabled={locked}
            onClick={() => album.current?.click()}
          >
            앨범 선택
          </button>
        </div>
        <p className={s.dropHint}>여러 장을 선택하거나 이곳에 끌어다 놓으세요.</p>
        <input
          ref={camera}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          aria-label={`${label} 촬영 파일`}
          onChange={(e) => {
            choose(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
        <input
          ref={album}
          type="file"
          accept="image/*"
          multiple
          hidden
          aria-label={`${label} 앨범 파일`}
          onChange={(e) => {
            choose(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
      </div>
      <div role="status" className={s.progress}>
        {progress}
      </div>
      {failures.length > 0 && (
        <div className={s.failure}>
          <p role="alert">추가하지 못한 사진 {failures.length}장</p>
          <ul>
            {failures.map((item) => (
              <li key={item.path}>
                <span>{item.file.name}</span>
                <button
                  type="button"
                  className={s.textBtn}
                  disabled={locked}
                  aria-label={`${item.file.name} 제외`}
                  onClick={() => reportFailures(failures.filter((other) => other !== item))}
                >
                  제외
                </button>
              </li>
            ))}
          </ul>
          <button
            className={s.secondary}
            type="button"
            disabled={locked}
            onClick={() => void upload(failures, [])}
          >
            실패한 사진 다시 올리기
          </button>
        </div>
      )}
      {photos.length > 0 && (
        <ul className={s.grid}>
          {photos.map((url, i) => (
            <li key={`${url}-${i}`}>
              <button
                type="button"
                className={s.thumb}
                aria-label={`${label} ${i + 1} 크게 보기`}
                onClick={() => setPreview(i)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" loading="lazy" />
                <span>{i + 1}</span>
              </button>
              {organizing && (
                <button
                  type="button"
                  className={s.remove}
                  disabled={locked}
                  aria-label={`${label} ${i + 1} 제외`}
                  onClick={() => {
                    setRemoved({ url, index: i });
                    onChange(photos.filter((_, index) => index !== i));
                  }}
                >
                  목록에서 제외
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {removed && (
        <div className={s.undo}>
          <span role="status">사진 1장을 제외했어요.</span>
          <button
            className={s.textBtn}
            disabled={locked}
            type="button"
            onClick={() => {
              const restored = [...photos];
              restored.splice(removed.index, 0, removed.url);
              onChange(restored);
              setRemoved(null);
            }}
          >
            되돌리기
          </button>
        </div>
      )}
      {preview !== null && (
        <JobPhotoViewer
          photos={photos.map((url, i) => ({ url, label: `${label} ${i + 1}` }))}
          start={preview}
          onClose={() => setPreview(null)}
        />
      )}
    </section>
  );
}
