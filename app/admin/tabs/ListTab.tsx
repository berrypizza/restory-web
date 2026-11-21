"use client";

import { useState } from "react";
import type { Job } from "../lib/types";
import type { FollowUpKind } from "../lib/followUp";
import type { Tech } from "../lib/constants";
import { formatDate, formatTime, formatYearMonth, thisYearMonth, pad } from "../lib/utils";
import { getJobTechs } from "../lib/jobTechs";
import { canScheduleInstall, visitLabel, visitsForJob, workQueues, workStatus, type QueueField, type VisitPhase, type WorkQueue, type WorkStatus } from "../lib/schedule";
import AdminIcon from "../components/AdminIcon";
import list from "./workList.module.css";

import {
  MonthControls,
  TechnicianFilter,
} from "../components/ScheduleControls";
import s from "../operations.module.css";

interface ListTabProps {
  filtered: Job[];
  hasSearchQuery?: boolean;
  monthFilter: string;
  setMonthFilter: (v: string) => void;
  statusFilter: WorkStatus;
  setStatusFilter: (v: WorkStatus) => void;
  techFilter: Tech | "전체";
  setTechFilter: (v: Tech | "전체") => void;
  isAdmin: boolean;
  loggedUser: string | null;
  queue?: WorkQueue;
  onReset: () => void;
  onEdit: (job: Job, phase?: VisitPhase, field?: QueueField) => void;
  onShowSchedule: (id: string, date: string, phase: VisitPhase) => void;
  onFollowUp: (job: Job, kind: FollowUpKind) => void;
}

export default function ListTab({
  filtered,
  hasSearchQuery = false,
  monthFilter,
  setMonthFilter,
  statusFilter,
  setStatusFilter,
  techFilter,
  setTechFilter,
  isAdmin,
  loggedUser,
  queue,
  onReset,
  onEdit,
  onShowSchedule,
  onFollowUp,
}: ListTabProps) {
  const [limit, setLimit] = useState(20);
  const queueInfo = queue && workQueues[queue];
  const editLabel = queueInfo?.action ?? "일정 수정";
  function latestDate(job: Job) {
    return [job.visit_date, job.install_date].filter(
      (date): date is string => Boolean(date && (queue || hasSearchQuery || date.startsWith(monthFilter)))
    ).sort().at(-1) || "";
  }
  const ordered = [...filtered].sort((a, b) =>
    latestDate(b).localeCompare(latestDate(a)) || (a.name || "").localeCompare(b.name || "", "ko") || a.id.localeCompare(b.id)
  );
  const moveMonth = (offset: number) => {
    const [year, month] = monthFilter.split("-").map(Number);
    const next = new Date(year, month - 1 + offset, 1);
    setMonthFilter(`${next.getFullYear()}-${pad(next.getMonth() + 1)}`);
  };
  const hasFilters = !queue && (statusFilter !== "전체" || (isAdmin && techFilter !== "전체"));

  return (
    <div className={s.stack}>
      {queueInfo ? (
        <section className={list.queueHead} aria-label="선택한 작업 목록">
          <div><span>전체 기간</span><h2>{queueInfo.label}</h2></div>
          <a href="#jobs" onClick={onReset}>전체 작업 보기 <AdminIcon name="arrow" size={14} /></a>
        </section>
      ) : <section className={s.panel} aria-label="작업 목록 필터">
        <div className={s.toolbar}>
          {hasSearchQuery ? (
            <h2 className={s.title}>전체 기간 검색 결과</h2>
          ) : (
            <MonthControls
              label={formatYearMonth(monthFilter)}
              onPrevious={() => moveMonth(-1)}
              onNext={() => moveMonth(1)}
              onToday={() => setMonthFilter(thisYearMonth())}
              todayLabel="이번 달"
            />
          )}
          <TechnicianFilter
            value={techFilter}
            onChange={setTechFilter}
            isAdmin={isAdmin}
            loggedUser={loggedUser}
          />
        </div>
        <div className={s.filterGroup} role="group" aria-label="작업 상태">
          {(["전체", "대기", "배정", "시공 대기", "완료", "취소"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              aria-pressed={statusFilter === status}
            >
              {status}
            </button>
          ))}
        </div>
      </section>}

      <div className={s.resultLine} aria-live="polite">
        <strong>작업 {filtered.length}건</strong>
        {filtered.length > 1 && <span>최근 일정순</span>}
      </div>
      {ordered.length > 0 ? (
        <>
          <ul className={list.rows}>
            {ordered.slice(0, limit).map(job => {
              const crew = getJobTechs(job).join(" · ") || "담당 미정";
              const schedule = visitsForJob(job);
              const status = workStatus(job);
              return <li key={job.id}>
                <div className={list.detail}>
                  <div className={list.meta}><span className={s.status} data-status={status}>{status}</span><span>{crew}</span></div>
                  <h3>{job.name || "이름 미입력"}</h3>
                  <p>{[job.symptom, job.region].filter(Boolean).join(" · ")}</p>
                </div>
                <div className={list.actions}>
                  {schedule.map(visit => <button key={visit.phase} type="button"
                    aria-label={`${job.name} ${visit.date} ${visitLabel(visit)} 일정 보기`}
                    onClick={() => onShowSchedule(job.id, visit.date, visit.phase)}>
                    {visitLabel(visit)} {formatDate(visit.date)} · {visit.time ? formatTime(visit.time) : "시간 미정"} <AdminIcon name="arrow" size={14} />
                  </button>)}
                  {isAdmin && <button className={queue ? list.queueAction : list.edit} type="button"
                    aria-label={`${job.name} ${editLabel}`}
                    onClick={() => onEdit(job, queueInfo?.phase, queueInfo?.field)}>
                    {editLabel}
                  </button>}
                  {isAdmin && !queue && canScheduleInstall(job) && <button type="button" className={list.queueAction}
                    onClick={() => onFollowUp(job, "install")}>{job.install_date ? "시공 일정 변경" : "시공일 정하기"}</button>}
                  {isAdmin && !queue && job.status !== "취소" && <button type="button" className={list.edit}
                    aria-label={`${job.name} A/S 접수`} onClick={() => onFollowUp(job, "aftercare")}>A/S 접수</button>}
                </div>
              </li>;
            })}
          </ul>
          {limit < ordered.length && <button className={s.neutral} type="button" onClick={() => setLimit(previous => previous + 20)}>작업 더 보기 ({Math.min(limit, ordered.length)}/{ordered.length})</button>}
        </>
      ) : (
        <div className={s.empty}>
          <strong>
            {hasFilters || hasSearchQuery
              ? "조건에 맞는 작업이 없어요"
              : queueInfo?.empty ?? "이달에 접수된 작업이 없어요"}
          </strong>
          {(hasFilters || hasSearchQuery) && (
            <button
              type="button"
              className={s.linkButton}
              onClick={onReset}
            >
              {hasSearchQuery ? "검색 조건 지우기" : "필터 초기화"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
