"use client";

import { useId, useRef, useState } from "react";
import { revenueDate } from "../lib/settlement";
import type { Job } from "../lib/types";
import { formatFullDate, formatTime } from "../lib/utils";
import JobDialog from "./JobDialog";
import s from "./intake.module.css";
import common from "../operations.module.css";

export type RemovalRequest = { job: Job; scope: "install" | "job" };

type Props = {
  request: RemovalRequest;
  onClose: () => void;
  onConfirm: (onError: (message: string) => void) => Promise<void>;
};

export default function JobRemovalDialog({ request, onClose, onConfirm }: Props) {
  const { job, scope } = request;
  const install = scope === "install";
  const titleId = useId();
  const pending = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const date = install ? job.install_date : job.visit_date;
  const time = install ? job.install_time : job.visit_time;
  const hasRevenue = Boolean(revenueDate(job) && job.price);

  async function confirmRemoval() {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError("");
    try {
      await onConfirm(setError);
    } catch {
      setError("삭제 결과를 확인할 수 없어요. 연결 상태를 확인하고 다시 시도해 주세요.");
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }

  return (
    <JobDialog labelledBy={titleId} onClose={onClose} busy={busy}>
      <header className={common.modalHeader}>
        <h2 id={titleId}>{install ? "시공 일정을 삭제할까요?" : "접수 전체를 삭제할까요?"}</h2>
      </header>
      <div className={s.body}>
        <div className={s.followUpContext}>
          <strong>{job.name} 고객님 · {job.symptom}</strong>
          <span>{date && formatFullDate(date)} {formatTime(time)} · {install ? "시공" : job.is_measurement ? "실측" : "방문"}</span>
        </div>
        <p className={common.removalDescription}>
          {install
            ? `달력에서 이 시공 일정만 지워요. ${job.is_measurement ? "실측" : "방문"} 기록과 접수 내용은 보관돼요.`
            : "이 접수에 등록된 일정, 사진, 메모와 자재 기록을 함께 삭제해요. 삭제한 접수는 복구할 수 없어요."}
          {hasRevenue && (install ? " 완료 매출은 기존 정산월에 남아요." : " 이 작업의 매출도 정산에서 빠져요.")}
        </p>
        {error && <p role="alert" className={s.fieldError}>{error}</p>}
      </div>
      <footer className={common.modalFooter}>
        <button type="button" className={common.neutral} disabled={busy} onClick={onClose}>취소</button>
        <button type="button" className={`${common.primary} ${common.destructive}`} disabled={busy} onClick={confirmRemoval}>
          {busy ? "삭제 중…" : install ? "시공 일정 삭제" : "접수 전체 삭제"}
        </button>
      </footer>
    </JobDialog>
  );
}
