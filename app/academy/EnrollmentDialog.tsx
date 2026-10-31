"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./gisal.module.css";

const EnrollmentContext = createContext<((trigger: HTMLButtonElement) => void) | null>(null);
const enrollmentSummary = [
  "기술로 살아남기 1기 모집",
  "기술부터 사업까지, 행복하게 사업하는 법.",
  "개강: 2026년 12월 1일 (화)",
  "모집 인원: 4명 소수 정예",
  "사업 과정: 5주",
  "현장 기술 수업: 5주간 주 2회, 실제 현장에서 직접 학습",
  "수료 후 기술 교육: 필요한 기술 요청 → 현장 일정 조율 → 현장에서 계속 교육",
  "1기 수강료: 490만 원 (정가 1,000만 원)",
  "신청 채널과 교육 장소·세부 시간표는 추후 안내됩니다.",
].join("\n");

export function EnrollButton({ children, className }: { children: ReactNode; className?: string }) {
  const open = useContext(EnrollmentContext);
  return <button type="button" className={className} aria-haspopup="dialog" aria-controls="enroll-dialog" onClick={event => open?.(event.currentTarget)}>{children}</button>;
}

export function EnrollmentProvider({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const previousOverflow = useRef<string | null>(null);
  const copyAttempt = useRef(0);
  const [copyStatus, setCopyStatus] = useState("");
  const [showFallback, setShowFallback] = useState(false);

  const restoreScroll = useCallback(() => {
    if (previousOverflow.current !== null) {
      document.body.style.overflow = previousOverflow.current;
      previousOverflow.current = null;
    }
  }, []);
  useEffect(() => () => { restoreScroll(); copyAttempt.current++; }, [restoreScroll]);

  const open = useCallback((button: HTMLButtonElement) => {
    if (!dialog.current || dialog.current.open) return;
    trigger.current = button;
    copyAttempt.current++;
    setCopyStatus("");
    setShowFallback(false);
    previousOverflow.current = document.body.style.overflow;
    dialog.current.showModal();
    document.body.style.overflow = "hidden";
  }, []);

  function onClose() {
    copyAttempt.current++;
    restoreScroll();
    if (trigger.current?.isConnected) trigger.current.focus({ preventScroll: true });
    trigger.current = null;
  }

  async function copyInfo() {
    const attempt = ++copyAttempt.current;
    try {
      await navigator.clipboard.writeText(enrollmentSummary);
      if (attempt !== copyAttempt.current || !dialog.current?.open) return;
      setShowFallback(false);
      setCopyStatus("모집 정보를 복사했어요.");
    } catch {
      if (attempt !== copyAttempt.current || !dialog.current?.open) return;
      setShowFallback(true);
      setCopyStatus("선택된 안내 문구를 직접 복사해 주세요.");
    }
  }
  const selectFallback = useCallback((node: HTMLTextAreaElement | null) => {
    if (node) { node.focus(); node.select(); }
  }, []);

  return (
    <EnrollmentContext.Provider value={open}>
      <div className={styles.page}>
        {children}
        <dialog ref={dialog} id="enroll-dialog" aria-labelledby="dialog-title" aria-describedby="dialog-subtitle" onClose={onClose} onClick={event => {
          if (event.target !== dialog.current || event.detail === 0) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
        }}>
          <div className={styles["dialog-inner"]}>
            <button type="button" className={styles["dialog-close"]} aria-label="신청 안내 닫기" onClick={() => dialog.current?.close()}>×</button>
            <span className={styles.kicker}>FIRST CLASS · 01</span>
            <h2 id="dialog-title">함께 시작할<br />네 사람을 기다립니다.</h2>
            <p id="dialog-subtitle" className={styles["dialog-subtitle"]}>기술로 살아남기 1기 모집 안내</p>
            <dl className={styles["dialog-facts"]}>
              <div><dt>개강</dt><dd>2026. 12. 01 (화)</dd></div>
              <div><dt>정원</dt><dd>4명 소수 정예</dd></div>
              <div><dt>사업 과정</dt><dd>5주</dd></div>
              <div><dt>현장 기술 수업</dt><dd>5주간 주 2회</dd></div>
              <div><dt>수료 후 기술 교육</dt><dd>요청에 따라 계속</dd></div>
              <div><dt>1기 수강료</dt><dd><strong>490만 원</strong> <del>1,000만 원</del></dd></div>
            </dl>
            <div className={styles["application-status"]}>
              <span className={styles["status-dot"]} /><strong>신청 채널 오픈 예정</strong>
              <p>현재 모집 정보를 먼저 안내하고 있습니다.<br />접수 링크와 교육 장소·세부 시간표는 추후 안내됩니다.</p>
            </div>
            <button type="button" className={`${styles.button} ${styles["button-green"]}`} onClick={copyInfo}>모집 정보 복사하기 <span aria-hidden="true">↗</span></button>
            <p className={styles["copy-status"]} role="status">{copyStatus}</p>
            {showFallback && <textarea ref={selectFallback} className={styles.copyFallback} aria-label="복사할 모집 정보" value={enrollmentSummary} readOnly />}
          </div>
        </dialog>
      </div>
    </EnrollmentContext.Provider>
  );
}
