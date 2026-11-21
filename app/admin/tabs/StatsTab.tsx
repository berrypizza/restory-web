"use client";

import { useState } from "react";
import type { Job } from "../lib/types";
import type { Tech } from "../lib/constants";
import { jobHasTech } from "../lib/jobTechs";
import { formatDate, reviewSms } from "../lib/utils";
import {
  categories,
  expenseAmount,
  expenseGroups,
  expenseNames,
  finishedInMonth,
  isFinishedJob,
  jobAmount,
  won,
  type ExpenseGroup,
  type ExpenseRow,
} from "../lib/settlement";
import { useExpenseLedger } from "../hooks/useExpenseLedger";
import ReportMonth from "../components/ReportMonth";
import AnalysisTab, { CompletedRows } from "./AnalysisTab";
import ExpenseTab, { ExpenseEditor, type ExpenseFilter } from "./ExpenseTab";
import s from "./reporting.module.css";
import f from "./settlement.module.css";

export type ReportView = "stats" | "expenses" | "analysis" | "reviews";

interface StatsTabProps {
  monthFilter: string;
  setMonthFilter: (value: string) => void;
  jobs: Job[];
  reviewPending: Job[];
  isAdmin: boolean;
  loggedUser: string | null;
  onUpdate: (id: string, patch: Partial<Job>) => Promise<boolean>;
  view: ReportView;
}

function Reviews({ jobs, onUpdate }: { jobs: Job[]; onUpdate: StatsTabProps["onUpdate"] }) {
  const [busy, setBusy] = useState("");
  const [limit, setLimit] = useState(20);
  const [message, setMessage] = useState("");
  const sorted = [...jobs].sort((a, b) =>
    (b.install_date || b.visit_date || "").localeCompare(a.install_date || a.visit_date || ""),
  );
  async function finish(job: Job) {
    if (busy) return;
    setBusy(job.id);
    try {
      if (await onUpdate(job.id, { review_requested: true }))
        setMessage(`${job.name} 고객의 후기 요청을 완료했어요.`);
    } finally {
      setBusy("");
    }
  }
  return (
    <section className={s.panel} id="pending-reviews" tabIndex={-1}>
      <div className={s.panelHeader}>
        <h2>후기 요청 대기</h2>
        <span className={s.badge}>전체 기간 · {jobs.length}건</span>
      </div>
      {!jobs.length ? (
        <p className={s.empty}>후기를 요청할 완료 작업이 없어요.</p>
      ) : (
        <>
          <ul className={s.list}>
            {sorted.slice(0, limit).map((job) => (
              <li key={job.id} className={f.reviewRow}>
                <div>
                  <strong>{job.name}</strong>
                  <p className={s.muted}>
                    {formatDate(job.visit_date)} 방문 · {job.region}
                  </p>
                </div>
                <div className={s.reviewActions}>
                  <a
                    className={s.softAction}
                    aria-label={`${job.name}에게 후기 요청 문자 작성`}
                    href={`sms:${job.phone}?&body=${reviewSms(job)}`}
                  >
                    문자 작성
                  </a>
                  <button
                    type="button"
                    className={s.secondaryAction}
                    disabled={Boolean(busy)}
                    aria-label={`${job.name} 후기 요청 완료 처리`}
                    onClick={() => void finish(job)}
                  >
                    {busy === job.id ? "저장 중…" : "요청 완료"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {limit < sorted.length && (
            <button type="button" className={s.secondaryAction} onClick={() => setLimit((n) => n + 20)}>
              더 보기
            </button>
          )}
        </>
      )}
      <p role="status" className={s.success}>
        {message}
      </p>
    </section>
  );
}

function Overview({
  jobs,
  rows,
  isAdmin,
  onFilter,
}: {
  jobs: Job[];
  rows: ExpenseRow[] | null;
  isAdmin: boolean;
  onFilter: (group: ExpenseFilter, category: string) => void;
}) {
  const revenue = jobAmount(jobs);
  const cost = rows ? expenseAmount(rows) : null;
  const balance = cost === null ? null : revenue - cost;
  return (
    <>
      <section className={f.summary} aria-label="월간 집계 요약">
        <div className={f.summaryMain}>
          <h2>{isAdmin ? "비용 차감 후 금액" : "참여한 작업 금액"}</h2>
          <strong className={balance !== null && isAdmin && balance < 0 ? f.negative : undefined}>
            {isAdmin ? (balance === null ? "—" : won(balance)) : won(revenue)}
          </strong>
          <small>
            {isAdmin
              ? "완료 작업 매출에서 입력한 비용을 뺀 금액이에요."
              : "주담당·동행으로 참여한 작업의 견적 합계예요."}
          </small>
        </div>
        {isAdmin && (
          <dl className={f.equation}>
            <div>
              <dt>완료 매출</dt>
              <dd>{won(revenue)}</dd>
            </div>
            <div>
              <dt>입력 비용</dt>
              <dd>
                <a href="#expenses" onClick={() => onFilter("all", "")}>
                  {cost === null ? "—" : won(cost)} <span aria-hidden="true">›</span>
                </a>
              </dd>
            </div>
          </dl>
        )}
      </section>
      {isAdmin && rows && (
        <section className={s.panel}>
          <div className={s.panelHeader}>
            <h2>비용 구성</h2>
            <a className={f.textLink} href="#expenses" onClick={() => onFilter("all", "")}>
              전체 내역 ›
            </a>
          </div>
          <div className={f.costParts}>
            {expenseGroups.map((group) => {
              const groupRows = rows.filter((row) => row.group_key === group);
              const total = expenseAmount(groupRows);
              return (
                <a
                  href="#expenses"
                  onClick={() => onFilter(group, "")}
                  key={group}
                  className={f.costPart}
                >
                  <span className={f.dot} data-group={group} aria-hidden="true" />
                  <span>{expenseNames[group]}</span>
                  <strong>{won(total)}</strong>
                  <span aria-hidden="true" className={f.chevron}>
                    ›
                  </span>
                </a>
              );
            })}
          </div>
        </section>
      )}
      <details className={f.jobsPanel}>
        <summary>
          <span>집계에 포함된 작업</span>
          <strong>{jobs.length}건</strong>
          <i aria-hidden="true">⌄</i>
        </summary>
        {jobs.length ? (
          <CompletedRows jobs={jobs} />
        ) : (
          <p className={s.empty}>이달에 완료한 작업이 없어요.</p>
        )}
      </details>
      <p className={f.basis}>
        방문일이 속한 달로 집계합니다. 실측 작업은 시공까지 완료하면 해당 방문월에 포함됩니다.
      </p>
    </>
  );
}

const views: { id: ReportView; label: string; adminOnly?: boolean }[] = [
  { id: "stats", label: "요약" },
  { id: "expenses", label: "비용 내역", adminOnly: true },
  { id: "analysis", label: "실적 분석", adminOnly: true },
  { id: "reviews", label: "후기 요청" },
];

export default function StatsTab({
  monthFilter,
  setMonthFilter,
  jobs,
  reviewPending,
  isAdmin,
  loggedUser,
  onUpdate,
  view,
}: StatsTabProps) {
  const [group, setGroup] = useState<ExpenseFilter>("all");
  const [category, setCategory] = useState("");
  const [editor, setEditor] = useState(false);
  const [notice, setNotice] = useState<{ month: string; message: string } | null>(null);
  const { rows, failed, reload } = useExpenseLedger(monthFilter, isAdmin);
  const visible = (job: Job) => isAdmin || (loggedUser !== null && jobHasTech(job, loggedUser as Tech));
  const completed = finishedInMonth(jobs.filter(visible), monthFilter);
  const pending = reviewPending.filter((job) => visible(job) && isFinishedJob(job));
  const safeView = !isAdmin && (view === "expenses" || view === "analysis") ? "stats" : view;
  const selectedEntry = rows?.find(
    (row) => row.category === category && (group === "all" || row.group_key === group),
  );
  const fromGroup: ExpenseGroup = group === "all" ? (selectedEntry?.group_key ?? "material") : group;
  const changeFilter = (next: ExpenseFilter, nextCategory: string) => {
    setGroup(next);
    setCategory(nextCategory);
  };
  const changed = (message: string) => {
    setNotice({ month: monthFilter, message });
    reload();
  };
  return (
    <div className={s.report}>
      <nav className={f.nav} aria-label="집계 보기">
        {views
          .filter((item) => isAdmin || !item.adminOnly)
          .map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={safeView === item.id ? "page" : undefined}
            >
              {item.label}
              {item.id === "reviews" && pending.length > 0 && (
                <small>{pending.length.toLocaleString("ko-KR")}</small>
              )}
            </a>
          ))}
      </nav>
      {safeView !== "reviews" && (
        <div className={f.period}>
          <ReportMonth value={monthFilter} onChange={setMonthFilter} />
          {isAdmin && (
            <div className={f.periodActions}>
              <button
                type="button"
                className={s.secondaryAction}
                disabled={!rows && !failed}
                onClick={reload}
              >
                {failed ? "다시 불러오기" : rows ? "비용 새로고침" : "비용 조회 중…"}
              </button>
              <button
                type="button"
                className={s.primaryAction}
                disabled={!rows}
                onClick={() => setEditor(true)}
              >
                + 비용 추가
              </button>
            </div>
          )}
        </div>
      )}
      {isAdmin && safeView !== "reviews" && failed && (
        <div className={s.feedback} role="alert">
          이달 비용을 불러오지 못했어요.
        </div>
      )}
      {safeView === "stats" && (
        <Overview jobs={completed} rows={rows} isAdmin={isAdmin} onFilter={changeFilter} />
      )}
      {safeView === "analysis" && (
        <AnalysisTab
          jobs={completed}
          material={rows ? expenseAmount(rows.filter((row) => row.group_key === "material")) : null}
        />
      )}
      {safeView === "expenses" &&
        (rows ? (
          <ExpenseTab
            rows={rows}
            group={group}
            category={category}
            onFilter={changeFilter}
            onRemoved={changed}
            onStale={() => changed("선택한 내역을 다시 확인해 주세요. 최신 장부를 불러왔어요.")}
          />
        ) : (
          !failed && (
            <p className={s.panel} role="status">
              비용 내역을 불러오는 중…
            </p>
          )
        ))}
      {safeView === "reviews" && <Reviews jobs={pending} onUpdate={onUpdate} />}
      {notice?.month === monthFilter && safeView !== "reviews" && (
        <p className={f.notice} role="status">
          {notice.message}
          <button type="button" onClick={() => setNotice(null)} aria-label="비용 알림 닫기">
            닫기
          </button>
        </p>
      )}
      {isAdmin && (
        <ExpenseEditor
          open={editor}
          onClose={() => setEditor(false)}
          month={monthFilter}
          rows={rows}
          initialGroup={fromGroup}
          initialCategory={selectedEntry?.category ?? categories[fromGroup][0]}
          onSaved={changed}
        />
      )}
    </div>
  );
}
