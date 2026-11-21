import type { Job } from "./types";
import { productBucket, TECHS } from "./constants";
import { getJobTechs } from "./jobTechs";

export const expenseNames = {
  material: "자재비",
  labor: "인건비",
  marketing: "마케팅비",
} as const;

export type ExpenseGroup = keyof typeof expenseNames;
export const expenseGroups = Object.keys(expenseNames) as ExpenseGroup[];
export const categories: Record<ExpenseGroup, readonly string[]> = {
  material: ["지엔", "스폰지", "가죽", "기타"],
  labor: ["팀장", "기사", "외주", "기타"],
  marketing: ["네이버", "메타"],
};

export type ExpenseRow = {
  id: string;
  expense_month: string;
  group_key: ExpenseGroup;
  category: string;
  amount: number;
  memo: string | null;
  created_at: string;
};

export function isFinishedJob(job: Job): boolean {
  return job.status === "완료" && (!job.is_measurement || job.install_completed === true);
}

export const won = (amount: number) => `${amount.toLocaleString("ko-KR")}원`;
export const jobAmount = (jobs: Job[]) =>
  jobs.reduce((sum, job) => sum + (job.is_aftercare ? 0 : job.price || 0), 0);
export const expenseAmount = (rows: ExpenseRow[]) =>
  rows.reduce((sum, row) => sum + (row.amount || 0), 0);

export function revenueDate(job: Job) {
  if (job.is_aftercare || !isFinishedJob(job)) return null;
  return job.is_measurement ? job.install_completed_on || job.install_date || job.visit_date : job.visit_date;
}

export function finishedInMonth(jobs: Job[], month: string) {
  return jobs
    .filter((job) => revenueDate(job)?.startsWith(month))
    .sort(
      (a, b) =>
        revenueDate(b)!.localeCompare(revenueDate(a)!) ||
        ((b.is_measurement ? b.install_time : b.visit_time) || "").localeCompare(
          (a.is_measurement ? a.install_time : a.visit_time) || "",
        ),
    );
}

export function technicianBreakdown(completed: Job[]) {
  const names = new Set<string>(TECHS);
  for (const job of completed) {
    names.add(job.tech || "담당 미지정");
    for (const name of getJobTechs(job)) names.add(name);
  }
  return [...names]
    .map((name) => {
      const primary = completed.filter((job) => (job.tech || "담당 미지정") === name);
      const assisted = completed.filter(
        (job) => job.tech !== name && getJobTechs(job).some((tech) => tech === name),
      );
      return { name, primary, assisted, revenue: jobAmount(primary) };
    })
    .sort(
      (a, b) =>
        b.revenue - a.revenue ||
        b.primary.length - a.primary.length ||
        b.assisted.length - a.assisted.length,
    );
}

export function productBreakdown(jobs: Job[], material: number | null) {
  const products = new Map<string, Job[]>();
  for (const job of jobs) {
    const name = productBucket(job.symptom);
    const group = products.get(name);
    if (group) group.push(job);
    else products.set(name, [job]);
  }
  const rows = [...products]
    .map(([name, items]) => ({
      name,
      jobs: items,
      revenue: jobAmount(items),
      material: null as number | null,
    }))
    .sort((a, b) => b.revenue - a.revenue || a.name.localeCompare(b.name, "ko"));
  const total = jobAmount(jobs);
  if (material === null || total <= 0 || rows.some((row) => row.revenue < 0)) return rows;

  // Round allocations to whole won while keeping their sum equal to the recorded material cost.
  const fractions = rows.map((row) => {
    const exact = material * (row.revenue / total);
    row.material = Math.floor(exact);
    return { row, fraction: exact - row.material };
  });
  const remaining = material - rows.reduce((sum, row) => sum + (row.material ?? 0), 0);
  fractions.sort((a, b) => b.fraction - a.fraction);
  for (const { row } of fractions.slice(0, remaining)) row.material = (row.material ?? 0) + 1;
  return rows;
}
