import type { Status } from "./constants";
import { isFinishedJob } from "./settlement";
import type { Job } from "./types";

export type VisitPhase = "visit" | "install";
export type Visit = {
  job: Job;
  phase: VisitPhase;
  date: string;
  time?: string | null;
};

export function visitsForJob(job: Job): Visit[] {
  const visits: Visit[] = [];
  if (job.visit_date) {
    visits.push({ job, phase: "visit", date: job.visit_date, time: job.visit_time });
  }
  if (job.install_date && (job.is_measurement || job.install_date !== job.visit_date)) {
    visits.push({ job, phase: "install", date: job.install_date, time: job.install_time });
  }
  return visits;
}

export function indexVisits(jobs: Job[]) {
  const days = new Map<string, Visit[]>();
  for (const job of jobs) {
    for (const visit of visitsForJob(job)) {
      const day = days.get(visit.date);
      if (day) day.push(visit);
      else days.set(visit.date, [visit]);
    }
  }
  for (const day of days.values()) {
    day.sort((a, b) =>
      (a.time || "99:99").localeCompare(b.time || "99:99") ||
      (a.phase === b.phase ? a.job.id.localeCompare(b.job.id) : a.phase === "visit" ? -1 : 1),
    );
  }
  return days;
}

export function visitDone({ job, phase }: Visit) {
  return job.is_measurement && phase === "visit" ? job.status === "완료" : isFinishedJob(job);
}

export function visitLabel({ job, phase }: Visit) {
  if (phase === "install") return "시공";
  return job.is_measurement ? "실측" : "방문";
}

export function visitStatus(job: Job, phase?: VisitPhase) {
  if (!job.is_measurement || job.status === "취소") return job.status;
  if (job.status === "완료") {
    if (phase === "visit") return "실측 완료";
    return isFinishedJob(job) ? "시공 완료" : "시공 대기";
  }
  return phase === "install" ? "실측 전" : job.status;
}

export function shiftDay(date: string, offset: number) {
  const value = new Date(date + "T00:00:00Z");
  value.setUTCDate(value.getUTCDate() + offset);
  return value.toISOString().slice(0, 10);
}

export type WorkStatus = Status | "시공 대기" | "전체";
export function workStatus(job: Job): Exclude<WorkStatus, "전체"> {
  return job.status === "완료" && !isFinishedJob(job) ? "시공 대기" : job.status;
}

export const workQueues = {
  unassigned: { label: "주담당 미배정", action: "기사 배정", field: "tech", phase: "visit", empty: "주담당을 배정할 작업이 없어요" },
  unscheduled: { label: "시공일 미정", action: "시공일 입력", field: "install_date", phase: "install", empty: "시공일을 정할 작업이 없어요" },
} as const;
export type WorkQueue = keyof typeof workQueues;
export type QueueField = (typeof workQueues)[WorkQueue]["field"];

export function inQueue(job: Job, queue: WorkQueue) {
  if (queue === "unscheduled") return workStatus(job) === "시공 대기" && !job.install_date;
  return !job.tech?.trim() && job.status !== "취소" && !isFinishedJob(job);
}
