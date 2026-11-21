"use client";

import { useMemo } from "react";
import AdminIcon, { type AdminIconName } from "../components/AdminIcon";
import { formatDate, formatFullDate, formatTime } from "../lib/utils";
import { indexVisits, inQueue, shiftDay, visitDone, visitLabel, visitStatus, workQueues, type VisitPhase } from "../lib/schedule";
import type { Job } from "../lib/types";
import common from "../operations.module.css";
import s from "./home.module.css";

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

function QueueLink({ href, icon, title, count, onClick }: {
  href: string;
  icon: AdminIconName;
  title: string;
  count: number;
  onClick?: () => void;
}) {
  return (
    <a className={s.queueLink} href={href} onClick={onClick}>
      <span className={s.queueIcon} data-icon={icon}><AdminIcon name={icon} size={20} /></span>
      <span>{title}</span>
      <strong>{count.toLocaleString("ko-KR")}<small>건</small></strong>
      <AdminIcon name="arrow" size={16} />
    </a>
  );
}

export default function HomeTab({ jobs, day, isAdmin, reviews, onDay, onVisit, onQueue }: {
  jobs: Job[];
  day: string;
  isAdmin: boolean;
  reviews: number;
  onDay: (day: string) => void;
  onVisit: (id: string, date: string, phase: VisitPhase) => void;
  onQueue: () => void;
}) {
  const byDate = useMemo(() => indexVisits(jobs), [jobs]);
  const visits = byDate.get(day) ?? [];
  const done = visits.filter(visitDone).length;
  const cancelled = visits.filter(({ job }) => job.status === "취소").length;
  const remaining = visits.length - done - cancelled;
  const nextVisit = visits.find(visit => visit.job.status !== "취소" && !visitDone(visit));
  const weekday = new Date(day + "T00:00:00Z").getUTCDay();
  const week = weekdays.map((label, index) => {
    const date = shiftDay(day, index - weekday);
    return { label, date, count: byDate.get(date)?.length ?? 0 };
  });
  const weekTotal = week.reduce((total, entry) => total + entry.count, 0);
  const peak = Math.max(1, ...week.map(entry => entry.count));
  const nextDay = !visits.length && [...byDate.keys()].sort().find(date =>
    date > day && byDate.get(date)?.some(({ job }) => job.status !== "취소"),
  );

  return (
    <div className={s.grid}>
      <button type="button" className={s.summary} onClick={() => {
        if (nextVisit) onVisit(nextVisit.job.id, day, nextVisit.phase);
        else onDay(day);
      }}>
        <span className={s.summaryLabel}><AdminIcon name="calendar" size={18} />오늘 남은 일정</span>
        <span className={s.bigNumber}>{remaining.toLocaleString("ko-KR")}<small>건</small></span>
        <span className={s.dateTile} aria-hidden="true">
          <span>{Number(day.slice(5, 7))}월</span>
          <b>{Number(day.slice(8))}</b>
          <small>{weekdays[weekday]}요일</small>
        </span>
        <span className={s.summaryFoot}>
          <span>전체 {visits.length}건 · 완료 {done}건{cancelled > 0 && ` · 취소 ${cancelled}건`}</span>
          <span className={s.summaryAction}>{nextVisit ? "다음 현장 보기" : "일정 보기"} <AdminIcon name="arrow" size={14} /></span>
        </span>
      </button>

      <section className={s.agenda}>
        <div className={s.panelHead}>
          <h2>오늘 방문 순서</h2>
          {visits.length > 0 && <span className={s.meta}>{visits.length}건</span>}
        </div>
        {visits.length ? (
          <ol className={s.visits}>
            {visits.slice(0, 5).map(visit => {
              const { job, time, phase } = visit;
              const status = visitStatus(job, phase);
              return (
                <li key={job.id + phase}>
                  <button type="button" onClick={() => onVisit(job.id, day, phase)}>
                    <span className={s.time} aria-label={time ? formatTime(time) : "시간 미정"}>
                      {time ? time.slice(0, 5) : "미정"}
                    </span>
                    <span className={s.visitBody}>
                      <strong>{job.name || "이름 미입력"} <small>{visitLabel(visit)}</small></strong>
                      <span>{[job.symptom, job.region].filter(Boolean).join(" · ")}</span>
                    </span>
                    <span className={common.status} data-status={status}>{status}</span>
                    <AdminIcon name="arrow" size={16} />
                  </button>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className={s.empty}>
            <span className={s.emptyIcon}><AdminIcon name="calendar" size={23} /></span>
            <strong>오늘 예정된 현장이 없어요</strong>
            {nextDay && <button type="button" onClick={() => onDay(nextDay)}>
              다음 일정 보기 · {formatDate(nextDay)} <AdminIcon name="arrow" size={14} />
            </button>}
          </div>
        )}
        {visits.length > 5 && (
          <button className={s.allVisits} type="button" onClick={() => onDay(day)}>오늘 일정 {visits.length}건 모두 보기 <AdminIcon name="arrow" size={15} /></button>
        )}
      </section>

      <section className={s.queue}>
        <div className={s.panelHead}><h2>확인할 일</h2><span className={s.meta}>전체 기간</span></div>
        {isAdmin && <QueueLink href="#unassigned" icon="person" title={workQueues.unassigned.label}
          count={jobs.filter(job => inQueue(job, "unassigned")).length} onClick={onQueue} />}
        <QueueLink href="#unscheduled" icon="time" title={workQueues.unscheduled.label}
          count={jobs.filter(job => inQueue(job, "unscheduled")).length} onClick={onQueue} />
        <QueueLink href="#reviews" icon="review" title="후기 요청 대기" count={reviews} />
      </section>

      <section className={s.week} aria-label="이번 주 일정">
        <div className={s.panelHead}>
          <div>
            <h2>이번 주 일정</h2>
            <p>{formatDate(week[0].date)} – {formatDate(week[6].date)}</p>
          </div>
          <strong className={s.weekTotal}>{weekTotal}<small>건</small></strong>
        </div>
        <div className={s.chart}>
          {week.map(({ date, label, count }) => (
            <button
              key={date}
              type="button"
              aria-label={`${formatFullDate(date)}, 일정 ${count}건 보기`}
              aria-current={date === day ? "date" : undefined}
              onClick={() => onDay(date)}
            >
              <span className={s.plot} aria-hidden="true">
                <b>{count}</b>
                <i style={{ height: count ? `${(count / peak) * 43}px` : 2 }} />
              </span>
              <span className={s.axis}>{label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
