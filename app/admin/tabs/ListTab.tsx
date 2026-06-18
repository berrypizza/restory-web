"use client";

import type { Job } from "../lib/types";
import type { Status, Tech } from "../lib/constants";
import { TECHS, STATUSES, TECH_COLOR } from "../lib/constants";
import { formatPrice, formatYearMonth } from "../lib/utils";
import JobCard from "../components/JobCard";

interface ListTabProps {
  filtered: Job[];
  monthFilter: string;
  setMonthFilter: (v: string) => void;
  statusFilter: Status | "전체";
  setStatusFilter: (v: Status | "전체") => void;
  techFilter: Tech | "전체";
  setTechFilter: (v: Tech | "전체") => void;
  isAdmin: boolean;
  loggedUser: string | null;
  onUpdate: (id: string, patch: Partial<Job>) => void;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

function TechFilterSelect({
  value,
  onChange,
}: {
  value: Tech | "전체";
  onChange: (v: Tech | "전체") => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Tech | "전체")}
      className="rounded-xl px-3 py-2 text-xs font-bold cursor-pointer"
      style={{
        backgroundColor:
          value !== "전체" ? TECH_COLOR[value] + "22" : "#ffffff",
        color: value !== "전체" ? TECH_COLOR[value] : "#475569",
        border: `1px solid ${value !== "전체" ? TECH_COLOR[value] + "44" : "#e5e7eb"}`,
        outline: "none",
      }}>
      <option value="전체">전체 기사</option>
      {TECHS.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  );
}

export default function ListTab({
  filtered,
  monthFilter,
  setMonthFilter,
  statusFilter,
  setStatusFilter,
  techFilter,
  setTechFilter,
  isAdmin,
  loggedUser,
  onUpdate,
  onEdit,
  onDelete,
}: ListTabProps) {
  const doneRevenue = filtered
    .filter(
      (j) => j.status === "완료" && (!j.is_measurement || j.install_completed),
    )
    .reduce((s, j) => s + (j.price || 0), 0);

  return (
    <>
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

      {/* 필터 */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex flex-wrap gap-1">
          {(["전체", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s as Status | "전체")}
              className="rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{
                backgroundColor: statusFilter === s ? "#1f66ff" : "#ffffff",
                color: statusFilter === s ? "white" : "#6b7280",
                border: "1px solid #e5e7eb",
              }}>
              {s}
            </button>
          ))}
        </div>
        {isAdmin ? (
          <TechFilterSelect value={techFilter} onChange={setTechFilter} />
        ) : (
          <span
            className="text-xs font-bold px-3 py-2 rounded-xl"
            style={{
              backgroundColor: TECH_COLOR[loggedUser!] + "22",
              color: TECH_COLOR[loggedUser!],
              border: `1px solid ${TECH_COLOR[loggedUser!]}44`,
            }}>
            {loggedUser}
          </span>
        )}
      </div>

      {/* 요약 */}
      <div
        className="flex gap-3 mb-4 text-xs font-medium"
        style={{ color: "#64748b" }}>
        <span>{filtered.length}건</span>
        <span>·</span>
        <span style={{ color: "#1f66ff" }}>
          완료 {filtered.filter((j) => j.status === "완료").length}건
        </span>
        <span>·</span>
        <span>{formatPrice(doneRevenue)}</span>
      </div>

      {/* 목록 */}
      {filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: "#94a3b8" }}>
          <p className="text-4xl mb-3">📋</p>
          <p className="text-sm">접수된 작업이 없어요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onUpdate={onUpdate}
              onEdit={onEdit}
              onDelete={onDelete}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </>
  );
}
