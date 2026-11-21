"use client";

import { useState } from "react";
import type { Job } from "../lib/types";
import { formatDate } from "../lib/utils";
import { jobAmount, productBreakdown, technicianBreakdown, won } from "../lib/settlement";
import s from "./reporting.module.css";
import f from "./settlement.module.css";

export function CompletedRows({ jobs }: { jobs: Job[] }) {
  return (
    <ul className={f.completedRows}>
      {jobs.map((job) => (
        <li key={job.id}>
          <div>
            <b>{job.name || "고객명 미입력"}</b>
            <small>
              {formatDate(job.visit_date)} 방문 · {job.symptom || "품목 미지정"}
            </small>
          </div>
          <strong>{won(job.price || 0)}</strong>
        </li>
      ))}
    </ul>
  );
}

export default function AnalysisTab({ jobs, material }: { jobs: Job[]; material: number | null }) {
  const [by, setBy] = useState<"product" | "tech">("product");
  const products = productBreakdown(jobs, material);
  const people = technicianBreakdown(jobs).filter(
    (person) => person.primary.length || person.assisted.length,
  );
  const revenue = jobAmount(jobs);
  let maxAmount = 0;
  for (const row of by === "product" ? products : people) maxAmount = Math.max(maxAmount, row.revenue);
  return (
    <section className={s.panel}>
      <div className={s.panelHeader}>
        <h2>완료 작업 분석</h2>
        <div className={f.segment} role="group" aria-label="분석 기준">
          <button type="button" aria-pressed={by === "product"} onClick={() => setBy("product")}>
            품목별
          </button>
          <button type="button" aria-pressed={by === "tech"} onClick={() => setBy("tech")}>
            기사별
          </button>
        </div>
      </div>
      {!jobs.length ? (
        <p className={s.empty}>선택한 달에 집계할 완료 작업이 없어요.</p>
      ) : by === "product" ? (
        <>
          <p className={f.dim}>
            항목을 열면 고객별 작업과 매출 비중으로 배분한 자재비를 확인할 수 있어요.
          </p>
          {products.map((row) => (
            <details className={f.breakdown} key={row.name}>
              <summary>
                <div>
                  <b>{row.name}</b>
                  <span>
                    완료 {row.jobs.length}건
                    {revenue > 0 && ` · 매출의 ${Math.round((row.revenue / revenue) * 1000) / 10}%`}
                  </span>
                </div>
                <strong>{won(row.revenue)}</strong>
                <i aria-hidden="true">⌄</i>
                <div className={s.track} aria-hidden="true">
                  <span
                    style={{
                      width: `${maxAmount > 0 ? Math.max(0, (row.revenue / maxAmount) * 100) : 0}%`,
                    }}
                  />
                </div>
              </summary>
              <div className={f.breakdownBody}>
                <p className={f.detailMetric}>
                  <span>배분 자재비</span>
                  <b>{row.material === null ? "산정 전" : won(row.material)}</b>
                </p>
                <CompletedRows jobs={row.jobs} />
              </div>
            </details>
          ))}
        </>
      ) : (
        <>
          <p className={f.dim}>
            작업 금액은 주담당에게 한 번만 합산하고, 함께 방문한 기사는 동행 건수로 표시해요.
          </p>
          {people.map((person) => (
            <details className={f.breakdown} key={person.name}>
              <summary>
                <div>
                  <b>{person.name}</b>
                  <span>
                    주담당 {person.primary.length}건 · 동행 {person.assisted.length}건
                  </span>
                </div>
                <strong>{won(person.revenue)}</strong>
                <i aria-hidden="true">⌄</i>
                <div className={s.track} aria-hidden="true">
                  <span
                    style={{
                      width: `${maxAmount ? Math.max(0, (person.revenue / maxAmount) * 100) : 0}%`,
                    }}
                  />
                </div>
              </summary>
              <div className={f.breakdownBody}>
                {person.primary.length > 0 && (
                  <>
                    <h3>주담당 작업</h3>
                    <CompletedRows jobs={person.primary} />
                  </>
                )}
                {person.assisted.length > 0 && (
                  <>
                    <h3>동행 작업</h3>
                    <CompletedRows jobs={person.assisted} />
                  </>
                )}
              </div>
            </details>
          ))}
        </>
      )}
    </section>
  );
}
