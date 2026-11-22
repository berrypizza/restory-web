"use client";

import { useMemo } from "react";
import type { Job } from "../lib/types";
import type { FollowUpKind } from "../lib/followUp";
import type { Tech } from "../lib/constants";
import { formatFullDate, getCalendarDays, pad, today } from "../lib/utils";
import { jobHasTech } from "../lib/jobTechs";
import { indexVisits, shiftDay, visitDone } from "../lib/schedule";
import JobCard from "../components/JobCard";
import { MonthControls, TechnicianFilter } from "../components/ScheduleControls";
import s from "../operations.module.css";
import schedule from "./schedule.module.css";

interface Props {
  jobs: Job[];
  view: CalendarView;
  onView: (view: CalendarView) => void;
  selectedDay: string;
  onSelectDay: (date: string) => void;
  calTechFilter: Tech | "전체";
  setCalTechFilter: (tech: Tech | "전체") => void;
  isAdmin: boolean;
  loggedUser: string;
  onUpdate: (id: string, patch: Partial<Job>) => Promise<boolean>;
  onEdit: (job: Job, phase: "visit" | "install") => void;
  onFollowUp: (job: Job, kind: FollowUpKind) => void;
  onShowSource: (id: string) => void;
  onRemoveInstall: (job: Job) => void;
  onDeleteJob: (job: Job) => void;
}

export type CalendarView = "month" | "week";

export default function CalendarTab({jobs, view, onView, selectedDay, onSelectDay, calTechFilter, setCalTechFilter, isAdmin, loggedUser, onUpdate, onEdit, onRemoveInstall, onDeleteJob, onFollowUp, onShowSource}: Props) {
  const week = view === "week";
  const todayKey = today();
  const monthKey = selectedDay.slice(0, 7);
  const [year, month] = monthKey.split("-").map(Number);
  const start = shiftDay(selectedDay, -new Date(selectedDay + "T00:00:00Z").getUTCDay());
  const dates = week
    ? Array.from({length: 7}, (_, index) => shiftDay(start, index))
    : getCalendarDays(year, month - 1).map(day => day ? `${monthKey}-${pad(day)}` : null);

  const byDate = useMemo(
    () => indexVisits(jobs.filter(job => jobHasTech(job, calTechFilter))),
    [jobs, calTechFilter],
  );
  const visits = byDate.get(selectedDay) ?? [];
  const finished = visits.filter(visitDone).length;
  const cancelled = visits.filter(v => v.job.status === "취소").length;
  const nextDate = !visits.length && [...byDate.keys()].filter(day => day > selectedDay && byDate.get(day)?.some(v=>v.job.status !== "취소")).sort()[0];
  function move(offset: number) {
    if (week) return onSelectDay(shiftDay(selectedDay, 7 * offset));
    const next = new Date(Date.UTC(year, month - 1 + offset, 1));
    const nextMonth = next.toISOString().slice(0, 7);
    const lastDay = new Date(Date.UTC(next.getUTCFullYear(), next.getUTCMonth()+1,0)).getUTCDate();
    onSelectDay(nextMonth === todayKey.slice(0,7) ? todayKey : `${nextMonth}-${pad(Math.min(Number(selectedDay.slice(8)),lastDay))}`);
  }
  return <div className={schedule.layout}>
    <section className={schedule.calendar} aria-label={week ? "주간 작업 달력" : "월간 작업 달력"}>
      <div className={schedule.calendarHead}>
        <MonthControls label={`${year}년 ${month}월`} onPrevious={()=>move(-1)} onNext={()=>move(1)} onToday={()=>onSelectDay(todayKey)} unit={week ? "주":"달"} />
        <div className={schedule.viewSwitch} role="group" aria-label="달력 보기 방식">
          <button type="button" aria-pressed={!week} onClick={() => onView("month")}>월별</button>
          <button type="button" aria-pressed={week} onClick={() => onView("week")}>주별</button>
        </div>
      </div>
      <div className={schedule.dates}>
        {["일","월","화","수","목","금","토"].map(day=><span key={day} className={schedule.weekday}>{day}</span>)}
        {dates.map((date,i)=>{
          if (!date) return <span className={schedule.blank} key={i} />;
          const events=byDate.get(date) || [];
          return <button className={schedule.day} type="button" key={date}
            aria-label={`${formatFullDate(date)}, 일정 ${events.length}건`}
            aria-pressed={date === selectedDay} aria-current={date === todayKey ? "date":undefined}
            data-outside={date.slice(0,7)!==monthKey || undefined}
            onClick={()=>onSelectDay(date)}>
            <span>{Number(date.slice(8))}</span>
            <small>{events.length > 0 ? `${events.length}건` : "\u00a0"}</small>
          </button>;
        })}
      </div>
      <div className={schedule.calendarFoot}>
        <TechnicianFilter value={calTechFilter} onChange={setCalTechFilter} isAdmin={isAdmin} loggedUser={loggedUser}/>
        <label className={schedule.jump}>
          날짜 이동
          <input aria-label="날짜로 이동" type="date" value={selectedDay}
            onChange={event=>{ const date=event.target.value; if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date)) onSelectDay(date); }}/>
        </label>
      </div>
    </section>
    <section aria-label="선택한 날짜의 일정" className={schedule.agenda} id="day-agenda" tabIndex={-1}>
      <header className={schedule.dayHeading}>
        <div><h2>{selectedDay === todayKey ? "오늘 일정" : "방문 일정"} <span>{visits.length}건</span></h2><p>{formatFullDate(selectedDay)}</p></div>
        {visits.length > 0 && <p className={schedule.progress}>예정 {visits.length-finished-cancelled} · 완료 {finished}{cancelled > 0 && ` · 취소 ${cancelled}`}</p>}
      </header>
      {visits.length ? <div className={s.jobList}>
        {visits.map(({job,phase})=><div className={schedule.visit} key={job.id + phase} id={`schedule-${job.id}-${phase}`} tabIndex={-1}>
          <JobCard job={job} scheduleDate={selectedDay} schedulePhase={phase} isAdmin={isAdmin} onUpdate={onUpdate} onEdit={edited => onEdit(edited, phase)}
            onRemoveInstall={onRemoveInstall} onDeleteJob={onDeleteJob}
            onFollowUp={onFollowUp} onShowSource={onShowSource} />
        </div>)}
      </div> : <div className={s.empty}><strong>이날 예정된 현장이 없어요</strong>
        {nextDate && <button type="button" className={s.linkButton} onClick={()=>onSelectDay(nextDate)}>다음 일정 보기 · {Number(nextDate.slice(5,7))}월 {Number(nextDate.slice(8))}일</button>}
      </div>}
    </section>
  </div>;
}
