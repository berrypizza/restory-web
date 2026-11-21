"use client";

import { useId, useState } from "react";
import JobDialog from "./JobDialog";
import JobPhotoEditor from "./JobPhotoEditor";
import s from "./jobPhotos.module.css";

export type PhotoMode = "complete" | "install" | "aftercare" | "manage";

interface PhotoCaptureProps {
  jobId: string;
  customer: string;
  price: number;
  mode: PhotoMode;
  photos: string[];
  onDone: (urls: string[], original: string[], finish: boolean) => Promise<boolean>;
  onCancel: () => void;
}

export default function PhotoCapture({
  jobId,
  customer,
  price,
  mode,
  photos,
  onDone,
  onCancel,
}: PhotoCaptureProps) {
  const [original] = useState(() => photos);
  const [list, setList] = useState(original);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [unresolved, setUnresolved] = useState(false);
  const [failed, setFailed] = useState(false);
  const titleId = useId();
  const busy = saving || uploading;
  const dirty = original.length !== list.length || list.some((url, i) => url !== original[i]);
  const completing = mode !== "manage";
  const title = mode === "aftercare" ? "A/S 방문 완료" : mode === "install" ? "시공 완료" : mode === "complete" ? "작업 완료" : "완료 사진 관리";

  function close() {
    if (!busy && ((!dirty && !unresolved) || window.confirm("사진 변경 사항을 저장하지 않고 닫을까요?")))
      onCancel();
  }
  async function save(finish: boolean) {
    if (busy || unresolved || (finish && mode === "complete" && !list.length)) return;
    setSaving(true);
    setFailed(false);
    try {
      if (!(await onDone(list, original, finish))) setFailed(true);
    } catch {
      setFailed(true);
    } finally {
      setSaving(false);
    }
  }
  return (
    <JobDialog labelledBy={titleId} onClose={close} busy={busy}>
      <header className={s.head}>
        <div>
          <p>{customer} 고객님</p>
          <h2 id={titleId}>{title}</h2>
        </div>
        <button type="button" className={s.secondary} onClick={close} disabled={busy}>
          닫기
        </button>
      </header>
      <div className={s.body}>
        <JobPhotoEditor
          label="완료 사진"
          storagePrefix={jobId}
          photos={list}
          onChange={setList}
          onBusyChange={setUploading}
          onUnresolvedChange={setUnresolved}
          disabled={saving}
        />
        {mode === "complete" && !list.length && (
          <p className={s.instructions}>완료 사진을 1장 이상 추가해 주세요.</p>
        )}
        {mode === "install" && !list.length && (
          <p className={s.instructions}>시공 사진은 선택 사항이에요.</p>
        )}
        {mode === "aftercare" && <p className={s.instructions}>필요하면 사진을 추가해 주세요. A/S 방문은 매출에서 제외돼요.</p>}
        {completing && (
          <dl className={s.amount}>
            <dt>완료 시 매출 반영액</dt>
            <dd>{price.toLocaleString("ko-KR")}원</dd>
          </dl>
        )}
        {failed && (
          <p className={s.failure} role="alert">
            변경 사항을 저장하지 못했어요. 선택한 사진은 유지됩니다.
          </p>
        )}
      </div>
      <footer className={s.actions}>
        {completing && dirty && (
          <button
            type="button"
            className={s.secondary}
            disabled={busy || unresolved}
            onClick={() => void save(false)}
          >
            사진만 저장
          </button>
        )}
        <button
          type="button"
          className={s.primary}
          disabled={
            busy || unresolved || (mode === "complete" && !list.length) || (mode === "manage" && !dirty)
          }
          onClick={() => void save(completing)}
        >
          {saving
            ? "저장 중…"
            : mode === "complete"
              ? "사진 저장하고 작업 완료"
              : mode === "install"
                ? "시공 완료 확정"
                : mode === "aftercare" ? "A/S 완료 확정" : "사진 저장"}
        </button>
      </footer>
    </JobDialog>
  );
}
