"use client";

import type { Job } from "../lib/types";
import type { Tech } from "../lib/constants";
import { TECHS, TECH_COLOR } from "../lib/constants";
import {
  formatDate,
  formatPrice,
  formatYearMonth,
  reviewSms,
} from "../lib/utils";

interface StatsTabProps {
  monthFilter: string;
  setMonthFilter: (v: string) => void;
  doneMonth: Job[];
  revenue: number;
  reviewPending: Job[];
  isAdmin: boolean;
  loggedUser: string | null;
  onUpdate: (id: string, patch: Partial<Job>) => void;
}

export default function StatsTab({
  monthFilter,
  setMonthFilter,
  doneMonth,
  revenue,
  reviewPending,
  isAdmin,
  loggedUser,
  onUpdate,
}: StatsTabProps) {
  const statDone = isAdmin
    ? doneMonth
    : doneMonth.filter((j) => j.tech === loggedUser);
  const statRevenue = statDone.reduce((s, j) => s + (j.price || 0), 0);
  const statReviewPending = isAdmin
    ? reviewPending
    : reviewPending.filter((j) => j.tech === loggedUser);
  const myColor = TECH_COLOR[loggedUser!] || "#1f66ff";

  return (
    <div className="flex flex-col gap-4">
      {/* 월 선택 */}
      <div
        className="flex items-center justify-between mb-4 rounded-xl p-1.5"
        style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}>
        <button
          onClick={() => {
            const d = new Date(monthFilter + "-01");
            d.setMonth(d.getMonth() - 1);
            setMonthFilter(d.toISOString().slice(0, 7));
          }}
          className="px-4 py-2 rounded-lg text-xl font-bold"
          style={{ color: "#111827" }}>
          ‹
        </button>
        <span className="text-sm font-bold" style={{ color: "#111827" }}>
          {formatYearMonth(monthFilter)}
        </span>
        <button
          onClick={() => {
            const d = new Date(monthFilter + "-01");
            d.setMonth(d.getMonth() + 1);
            setMonthFilter(d.toISOString().slice(0, 7));
          }}
          className="px-4 py-2 rounded-lg text-xl font-bold"
          style={{ color: "#111827" }}>
          ›
        </button>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-2xl p-5"
          style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}>
          <p className="text-xs mb-2 font-medium" style={{ color: "#6b7280" }}>
            {formatYearMonth(monthFilter)} {isAdmin ? "전체" : "내"} 매출
          </p>
          <p
            className="text-2xl font-bold"
            style={{ color: isAdmin ? "#1f66ff" : myColor }}>
            {formatPrice(statRevenue)}
          </p>
        </div>
        <div
          className="rounded-2xl p-5"
          style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}>
          <p className="text-xs mb-2 font-medium" style={{ color: "#6b7280" }}>
            {formatYearMonth(monthFilter)} {isAdmin ? "전체" : "내"} 완료
          </p>
          <p
            className="text-2xl font-bold"
            style={{ color: isAdmin ? "#1f66ff" : myColor }}>
            {statDone.length}
            <span className="text-base ml-1" style={{ color: "#6b7280" }}>
              건
            </span>
          </p>
        </div>
      </div>

      {/* 기사별 */}
      {(isAdmin ? TECHS : [loggedUser as Tech]).map((tech) => {
        const techJobs = doneMonth.filter((j) => j.tech === tech);
        const techRevenue = techJobs.reduce((s, j) => s + (j.price || 0), 0);
        const color = TECH_COLOR[tech];
        return (
          <div
            key={tech}
            className="rounded-2xl p-5"
            style={{
              backgroundColor: "#ffffff",
              border: `1px solid ${color}33`,
            }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold" style={{ color }}>
                {tech === loggedUser ? "👤 " : ""}
                {tech} 기사님
              </span>
              <span
                className="text-xs px-2 py-1 rounded-full font-medium"
                style={{ backgroundColor: color + "22", color }}>
                {techJobs.length}건
              </span>
            </div>
            <div className="text-xl font-bold mb-3" style={{ color }}>
              {formatPrice(techRevenue)}
            </div>
            {isAdmin && (
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: "#f3f4f6" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${revenue > 0 ? (techRevenue / revenue) * 100 : 0}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            )}
          </div>
        );
      })}

      {/* 리뷰 미요청 */}
      <div
        className="rounded-2xl p-5"
        style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}>
        <p
          className="text-sm font-bold mb-3 flex items-center gap-2"
          style={{ color: "#111827" }}>
          📝 리뷰 요청 안 한 건
          {statReviewPending.length > 0 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-bold"
              style={{ backgroundColor: "#ef4444", color: "white" }}>
              {statReviewPending.length}건
            </span>
          )}
        </p>
        {statReviewPending.length === 0 ? (
          <p className="text-sm" style={{ color: "#64748b" }}>
            모두 요청 완료! 👍
          </p>
        ) : (
          statReviewPending.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between py-3"
              style={{ borderBottom: "1px solid #f3f4f6" }}>
              <div>
                <span
                  className="text-sm font-medium"
                  style={{ color: "#111827" }}>
                  {job.name}
                </span>
                <span className="text-xs ml-2" style={{ color: "#64748b" }}>
                  {job.region} · {formatDate(job.visit_date)}
                </span>
              </div>
              <a
                href={`sms:${job.phone}?&body=${reviewSms(job)}`}
                onClick={() => onUpdate(job.id, { review_requested: true })}
                className="text-xs px-3 py-1.5 rounded-full font-semibold"
                style={{
                  backgroundColor: "#03C75A22",
                  color: "#03C75A",
                  border: "1px solid #03C75A44",
                }}>
                문자 보내기
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
