"use client";

import { useRef, useState } from "react";
import AdminIcon from "../admin/components/AdminIcon";
import { MAX_INTAKE_PHOTOS, prepareIntakePhoto, type IntakePhoto } from "@/lib/intake-photos";
import s from "./request.module.css";

export type SelectedPhoto = IntakePhoto & { id: string };

export default function PhotoPicker({ photos, onChange, onBusy }: {
  photos: SelectedPhoto[]; onChange: (photos: SelectedPhoto[]) => void; onBusy: (busy: boolean) => void;
}) {
  const album = useRef<HTMLInputElement>(null);
  const camera = useRef<HTMLInputElement>(null);
  const locked = useRef(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  async function add(files: File[]) {
    if (locked.current || !files.length) return;
    const capacity = MAX_INTAKE_PHOTOS - photos.length;
    if (files.length > capacity) {
      setError(`사진은 최대 ${MAX_INTAKE_PHOTOS}장이에요. ${capacity}장까지 더 선택할 수 있어요.`);
      return;
    }
    locked.current = true;
    onBusy(true);
    setError("");
    const next = [...photos];
    const failed: string[] = [];
    try {
      for (const [index, file] of files.entries()) {
        setProgress(`사진 준비 중 · ${index + 1}/${files.length}`);
        try { next.push({ id: crypto.randomUUID(), ...await prepareIntakePhoto(file) }); }
        catch (problem) { failed.push(problem instanceof Error ? problem.message : "다른 사진으로 다시 시도해 주세요."); }
      }
      onChange(next);
      if (failed.length) setError(`${failed.length}장을 추가하지 못했어요. ${failed[0]}`);
    } finally { locked.current = false; onBusy(false); setProgress(""); }
  }
  return <div className={s.photos}>
    <div className={s.photoHead}><strong>현장 사진 <small>선택</small></strong><span>{photos.length} / {MAX_INTAKE_PHOTOS}장</span></div>
    {photos.length > 0 && <ul className={s.film}>{photos.map((photo, i) => <li key={photo.id}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`data:image/jpeg;base64,${photo.thumbnail}`} alt={`선택한 현장 사진 ${i + 1}`} />
      <button type="button" aria-label={`${i + 1}번째 사진 삭제`} disabled={!!progress}
        onClick={() => { setError(""); onChange(photos.filter(p => p.id !== photo.id)); }}><AdminIcon name="close" size={16} /></button>
    </li>)}</ul>}
    <div className={s.photoButtons}>
      <button type="button" disabled={!!progress || photos.length >= MAX_INTAKE_PHOTOS} onClick={() => album.current?.click()}><AdminIcon name="plus" size={17} />사진 선택</button>
      <button type="button" disabled={!!progress || photos.length >= MAX_INTAKE_PHOTOS} onClick={() => camera.current?.click()}><AdminIcon name="camera" size={18} />사진 촬영</button>
    </div>
    <input hidden ref={album} type="file" accept="image/*" multiple aria-label="앨범 사진 선택"
      onChange={e => { const files = Array.from(e.target.files ?? []); e.target.value = ""; void add(files); }} />
    <input hidden ref={camera} type="file" accept="image/*" capture="environment" aria-label="카메라 사진 촬영"
      onChange={e => { const files = Array.from(e.target.files ?? []); e.target.value = ""; void add(files); }} />
    {progress && <p role="status">{progress}</p>}
    {error && <p role="alert" className={s.error}>{error}</p>}
  </div>;
}
