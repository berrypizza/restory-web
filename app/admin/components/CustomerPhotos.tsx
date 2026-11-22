"use client";

import { useEffect, useId, useState } from "react";
import { getSupabase } from "../lib/utils";
import JobPhotoViewer, { type FieldPhoto } from "./JobPhotoViewer";
import JobDialog from "./JobDialog";
import s from "./jobPhotos.module.css";

type Parent = { requestId?: string; jobId?: string };
type PhotoRow = { photo_number: number; jpeg: string };
function usePhotoFiles({ requestId, jobId }: Parent, previews: boolean) {
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState<{ key: string; photos: FieldPhoto[] | null } | null>(null);
  const key = `${requestId || jobId}:${previews}:${version}`;
  useEffect(() => {
    const controller = new AbortController();
    const urls: string[] = [];
    async function read() {
      try {
        const { data, error } = await getSupabase().rpc("read_customer_photos", {
          p_request: requestId ?? null, p_job: jobId ?? null, p_previews: previews,
        }).abortSignal(controller.signal);
        if (controller.signal.aborted) return;
        if (error || !data?.length) throw new Error();
        const photos = (data as PhotoRow[]).map(row => {
          const bytes = Uint8Array.from(atob(row.jpeg), char => char.charCodeAt(0));
          const url = URL.createObjectURL(new Blob([bytes], { type: "image/jpeg" }));
          urls.push(url);
          return { url, label: `고객 사진 ${row.photo_number}`, group: "고객" };
        });
        setResult({ key, photos });
      } catch {
        if (!controller.signal.aborted) setResult({ key, photos: null });
      }
    }
    void read();
    return () => { controller.abort(); urls.forEach(url => URL.revokeObjectURL(url)); };
  }, [key, requestId, jobId, previews]);
  return { photos: result?.key === key ? result.photos : undefined, retry: () => setVersion(n => n + 1) };
}

export function CustomerPhotoViewer({ requestId, jobId, start, extra = [], onClose, onManage }: Parent & {
  start?: number; extra?: FieldPhoto[]; onClose: () => void; onManage?: () => void;
}) {
  const { photos, retry } = usePhotoFiles({ requestId, jobId }, false);
  const title = useId();
  if (photos) return <JobPhotoViewer photos={[...photos, ...extra]} start={start} onClose={onClose} onManage={onManage} />;
  return <JobDialog labelledBy={title} onClose={onClose}><div className={s.photoFeedback}>
    <h2 id={title}>고객 사진</h2>
    <p role="status">{photos === null ? "사진을 불러오지 못했어요." : "사진을 불러오는 중…"}</p>
    {photos === null && <button type="button" className={s.primary} onClick={retry}>다시 불러오기</button>}
    <button type="button" className={s.secondary} onClick={onClose}>닫기</button>
  </div></JobDialog>;
}

export function CustomerPhotoStrip({ requestId, count }: { requestId: string; count: number }) {
  const { photos, retry } = usePhotoFiles({ requestId }, true);
  const [start, setStart] = useState<number | null>(null);
  return <section className={s.customerStrip} aria-label="고객이 보낸 현장 사진">
    <h3>현장 사진 <small>{count}장</small></h3>
    {photos ? <div className={s.customerThumbs}>{photos.map((photo, i) =>
      <button type="button" key={photo.url} aria-label={`${photo.label} 크게 보기`} onClick={() => setStart(i)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.url} alt="" />
      </button>)}</div> : photos === null ? <button type="button" className={s.secondary} onClick={retry}>사진 다시 불러오기</button> : <span role="status">사진을 불러오는 중…</span>}
    {start !== null && <CustomerPhotoViewer requestId={requestId} start={start} onClose={() => setStart(null)} />}
  </section>;
}
