"use client";

import { useEffect, useId, useRef, useState } from "react";
import s from "./inbox-controls.module.css";

export type InboxFolder = "pending" | "held";
export type InboxAction = "hold" | "restore" | "delete";
export const folderName = { pending: "확인 대기", held: "보류함" } as const;
export const actionFeedback = { hold: "상담을 보류함으로 옮겼어요.", restore: "상담을 확인 대기로 옮겼어요.", delete: "상담을 삭제했어요." } as const;

export function InboxFolders({ folder, counts, onSelect }: {
  folder: InboxFolder; counts: Record<InboxFolder, number | null>; onSelect: (value: InboxFolder) => void;
}) {
  return <div className={s.folders} role="group" aria-label="상담 보관함">
    {(["pending", "held"] as const).map(value => <button key={value} type="button" aria-pressed={folder === value}
      onClick={() => onSelect(value)}>
      {folderName[value]}{counts[value] != null && <span>{counts[value].toLocaleString("ko-KR")}</span>}
    </button>)}
  </div>;
}

export function InboxActions({ folder, customer, disabled, onChange }: {
  folder: InboxFolder; customer: string; disabled?: boolean; onChange: (action: InboxAction) => Promise<void>;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  const lock = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const titleId = useId();
  const detailId = useId();
  useEffect(() => {
    const el = dialog.current;
    if (!confirming || !el) return;
    el.showModal();
    cancel.current?.focus();
    return () => { el.close(); };
  }, [confirming]);
  async function act(action: InboxAction) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      await onChange(action);
    } catch (e) {
      setError(e instanceof Error ? e.message : "연결을 확인한 뒤 다시 시도해 주세요.");
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  function dismiss() {
    if (lock.current) return;
    setConfirming(false);
    setError("");
  }
  return <>
    <div className={s.actions}>
      <button type="button" className={folder === "held" ? s.restore : s.hold}
        disabled={disabled || busy} onClick={() => void act(folder === "held" ? "restore" : "hold")}>
        {folder === "held" ? "확인 대기로 이동" : "보류하기"}
      </button>
      <button type="button" className={s.remove} disabled={disabled || busy}
        onClick={() => { setError(""); setConfirming(true); }}>상담 삭제</button>
    </div>
    {!confirming && error && <p role="alert" className={s.error}>{error}</p>}
    {confirming && <dialog ref={dialog} className={s.confirm} aria-labelledby={titleId} aria-describedby={detailId}
      onCancel={event => { event.preventDefault(); dismiss(); }}>
      <h2 id={titleId}>{customer} 고객님의 상담을 삭제할까요?</h2>
      <p id={detailId}>상담 내용과 첨부 사진이 함께 삭제돼요. 삭제한 상담은 복구할 수 없어요.</p>
      {error && <p role="alert" className={s.error}>{error}</p>}
      <div className={s.choices}>
        <button type="button" ref={cancel} disabled={busy} onClick={dismiss}>취소</button>
        <button type="button" disabled={busy} onClick={() => void act("delete")}>{busy ? "삭제 중…" : "삭제하기"}</button>
      </div>
    </dialog>}
  </>;
}
