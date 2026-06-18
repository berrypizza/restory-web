"use client";

import { useState, useEffect } from "react";
import type { Job, Material } from "../lib/types";
import type { MaterialStatus } from "../lib/constants";
import {
  MATERIAL_STATUS_STYLE,
  MATERIAL_SUPPLIER_STYLE,
  MATERIAL_STATUSES,
} from "../lib/constants";
import { getSupabase } from "../lib/utils";
import {
  getCalendarDays,
  pad,
  today as getToday,
  formatDate,
} from "../lib/utils";

type MaterialWithJob = Material & {
  job: {
    id: string;
    name: string;
    region: string;
    visit_date: string;
    tech: string;
    symptom: string;
  };
};

interface MaterialTabProps {
  jobs: Job[];
  isAdmin: boolean;
}

export default function MaterialTab({ jobs, isAdmin }: MaterialTabProps) {
  const todayStr = getToday();
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(todayStr);
  const [dayMaterials, setDayMaterials] = useState<MaterialWithJob[]>([]);
  const [loading, setLoading] = useState(false);

  // 달력에 점 표시용: 이달 자재 있는 날짜 목록
  const [markedDates, setMarkedDates] = useState<
    Record<string, { total: number; ready: number; issue: boolean }>
  >({});

  const calDays = getCalendarDays(calYear, calMonth);

  // 이달 자재 마킹 로드
  useEffect(() => {
    const loadMonth = async () => {
      const startDate = `${calYear}-${pad(calMonth + 1)}-01`;
      const endDate = `${calYear}-${pad(calMonth + 1)}-${pad(new Date(calYear, calMonth + 1, 0).getDate())}`;

      const { data } = await getSupabase()
        .from("materials")
        .select("status, jobs(visit_date)")
        .gte("jobs.visit_date", startDate)
        .lte("jobs.visit_date", endDate);

      const marks: Record<
        string,
        { total: number; ready: number; issue: boolean }
      > = {};
      (data ?? []).forEach((m: any) => {
        const date = m.jobs?.visit_date;
        if (!date) return;
        if (!marks[date]) marks[date] = { total: 0, ready: 0, issue: false };
        marks[date].total++;
        if (m.status === "준비완료") marks[date].ready++;
        if (m.status === "발주필요") marks[date].issue = true;
      });
      setMarkedDates(marks);
    };
    loadMonth();
  }, [calYear, calMonth]);

  // 선택된 날 자재 로드
  useEffect(() => {
    if (!selectedDay) return;
    const loadDay = async () => {
      setLoading(true);

      // 그날 job id 목록
      const dayJobIds = jobs
        .filter((j) => j.visit_date === selectedDay)
        .map((j) => j.id);
      if (dayJobIds.length === 0) {
        setDayMaterials([]);
        setLoading(false);
        return;
      }

      const { data } = await getSupabase()
        .from("materials")
        .select("*, jobs(id, name, region, visit_date, tech, symptom)")
        .in("job_id", dayJobIds)
        .order("created_at", { ascending: true });

      setDayMaterials((data ?? []).map((m: any) => ({ ...m, job: m.jobs })));
      setLoading(false);
    };
    loadDay();
  }, [selectedDay, jobs]);

  const handleStatusChange = async (id: string, status: MaterialStatus) => {
    await getSupabase().from("materials").update({ status }).eq("id", id);
    setDayMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m)),
    );
    // 마킹 새로고침
    setMarkedDates((prev) => {
      const updated = { ...prev };
      if (selectedDay && updated[selectedDay]) {
        // 간단히 재계산
        const items = dayMaterials.map((m) =>
          m.id === id ? { ...m, status } : m,
        );
        updated[selectedDay] = {
          total: items.length,
          ready: items.filter((m) => m.status === "준비완료").length,
          issue: items.some((m) => m.status === "발주필요"),
        };
      }
      return updated;
    });
  };

  // job별로 그룹핑
  const groupedByJob = dayMaterials.reduce<
    Record<
      string,
      { job: MaterialWithJob["job"]; materials: MaterialWithJob[] }
    >
  >((acc, m) => {
    if (!acc[m.job_id]) acc[m.job_id] = { job: m.job, materials: [] };
    acc[m.job_id].materials.push(m);
    return acc;
  }, {});

  return (
    <div>
      {/* 달력 헤더 */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => {
            const d = new Date(calYear, calMonth - 1);
            setCalYear(d.getFullYear());
            setCalMonth(d.getMonth());
          }}
          className="px-3 py-2 rounded-lg text-lg font-bold"
          style={{
            backgroundColor: "#ffffff",
            color: "#111827",
            border: "1px solid #e5e7eb",
          }}>
          ‹
        </button>
        <span
          className="flex-1 text-center text-base font-bold"
          style={{ color: "#111827" }}>
          {calYear}년 {calMonth + 1}월
        </span>
        <button
          onClick={() => {
            const d = new Date(calYear, calMonth + 1);
            setCalYear(d.getFullYear());
            setCalMonth(d.getMonth());
          }}
          className="px-3 py-2 rounded-lg text-lg font-bold"
          style={{
            backgroundColor: "#ffffff",
            color: "#111827",
            border: "1px solid #e5e7eb",
          }}>
          ›
        </button>
      </div>

      {/* 범례 */}
      <div className="flex items-center gap-4 mb-3 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          <span className="text-xs" style={{ color: "#64748b" }}>
            발주필요
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-xs" style={{ color: "#64748b" }}>
            진행중
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-xs" style={{ color: "#64748b" }}>
            준비완료
          </span>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-1">
        {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
          <div
            key={d}
            className="text-center text-xs py-2 font-bold"
            style={{
              color: i === 0 ? "#ef6666" : i === 6 ? "#60a5fa" : "#6b7280",
            }}>
            {d}
          </div>
        ))}
      </div>

      {/* 달력 그리드 */}
      <div className="grid grid-cols-7 gap-0 mb-4">
        {calDays.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const dateStr = `${calYear}-${pad(calMonth + 1)}-${pad(day)}`;
          const mark = markedDates[dateStr];
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDay;
          const dow = i % 7;
          const allReady = mark && mark.total > 0 && mark.ready === mark.total;

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDay(isSelected ? null : dateStr)}
              className="rounded-xl p-0.5 min-h-[64px] flex flex-col items-center"
              style={{
                backgroundColor: isSelected ? "#eaf1ff" : "#ffffff",
                border: isSelected
                  ? "1px solid #1f66ff"
                  : isToday
                    ? "1px solid #a9c4ff"
                    : "1px solid #e5e7eb",
              }}>
              <span
                className="text-xs font-bold mb-1 w-5 h-5 flex items-center justify-center rounded-full"
                style={{
                  color: isToday
                    ? "#ffffff"
                    : dow === 0
                      ? "#ef6666"
                      : dow === 6
                        ? "#60a5fa"
                        : "#111827",
                  backgroundColor: isToday ? "#1f66ff" : "transparent",
                }}>
                {day}
              </span>
              {mark && mark.total > 0 && (
                <div className="flex flex-col items-center gap-0.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: mark.issue
                        ? "#ef4444"
                        : allReady
                          ? "#1f66ff"
                          : "#f59e0b",
                    }}
                  />
                  <span
                    className="text-[9px] font-bold"
                    style={{
                      color: mark.issue
                        ? "#ef4444"
                        : allReady
                          ? "#1f66ff"
                          : "#f59e0b",
                    }}>
                    {mark.ready}/{mark.total}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 선택된 날 자재 목록 */}
      {selectedDay && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            border: "1px solid #bfd3ff",
            boxShadow: "0 10px 28px rgba(31,102,255,0.08)",
          }}>
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{
              background:
                "linear-gradient(135deg, #ffffff 0%, #eef4ff 55%, #e6dcff 100%)",
              borderBottom: "1px solid #e5e7eb",
            }}>
            <span className="text-sm font-bold" style={{ color: "#111827" }}>
              {formatDate(selectedDay)} 자재 현황
            </span>
            {dayMaterials.length > 0 && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ backgroundColor: "#eaf1ff", color: "#1f66ff" }}>
                {dayMaterials.filter((m) => m.status === "준비완료").length}/
                {dayMaterials.length} 준비
              </span>
            )}
          </div>

          {loading ? (
            <div
              className="py-10 text-center text-sm"
              style={{ color: "#94a3b8" }}>
              불러오는 중...
            </div>
          ) : Object.keys(groupedByJob).length === 0 ? (
            <div
              className="py-10 text-center"
              style={{ backgroundColor: "#f8fafc" }}>
              <p className="text-2xl mb-2">🔩</p>
              <p className="text-sm" style={{ color: "#94a3b8" }}>
                이 날 등록된 자재 없음
              </p>
            </div>
          ) : (
            <div
              className="flex flex-col gap-0"
              style={{ backgroundColor: "#f5f7fb" }}>
              {Object.entries(groupedByJob).map(
                ([jobId, { job, materials }]) => {
                  const allReady = materials.every(
                    (m) => m.status === "준비완료",
                  );
                  const hasIssue = materials.some(
                    (m) => m.status === "발주필요",
                  );
                  return (
                    <div
                      key={jobId}
                      className="mx-3 my-2 rounded-xl overflow-hidden"
                      style={{
                        backgroundColor: "#ffffff",
                        border: `1px solid ${hasIssue ? "#ef444433" : allReady ? "#bfd3ff" : "#f59e0b33"}`,
                      }}>
                      {/* 고객 정보 헤더 */}
                      <div
                        className="flex items-center justify-between px-3 py-2"
                        style={{
                          borderBottom: "1px solid #f3f4f6",
                          backgroundColor: hasIssue
                            ? "#fef2f2"
                            : allReady
                              ? "#eaf1ff"
                              : "#fff7ed",
                        }}>
                        <div>
                          <span
                            className="text-sm font-bold"
                            style={{ color: "#111827" }}>
                            {job?.name} 고객님
                          </span>
                          {job?.region && (
                            <span
                              className="text-xs ml-2"
                              style={{ color: "#64748b" }}>
                              📍{job.region}
                            </span>
                          )}
                          {job?.symptom && (
                            <span
                              className="text-xs ml-2"
                              style={{ color: "#1f66ff" }}>
                              {job.symptom}
                            </span>
                          )}
                        </div>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: hasIssue
                              ? "#fef2f2"
                              : allReady
                                ? "#eaf1ff"
                                : "#fff7ed",
                            color: hasIssue
                              ? "#ef4444"
                              : allReady
                                ? "#1f66ff"
                                : "#f59e0b",
                            border: `1px solid ${hasIssue ? "#ef444433" : allReady ? "#bfd3ff" : "#f59e0b33"}`,
                          }}>
                          {allReady
                            ? "✓ 준비완료"
                            : hasIssue
                              ? "발주필요"
                              : "진행중"}
                        </span>
                      </div>

                      {/* 자재 목록 */}
                      <div
                        className="divide-y"
                        style={{ borderColor: "#f3f4f6" }}>
                        {materials.map((m) => {
                          const statusStyle = MATERIAL_STATUS_STYLE[m.status];
                          const supplierStyle = m.supplier
                            ? MATERIAL_SUPPLIER_STYLE[m.supplier]
                            : null;
                          return (
                            <div
                              key={m.id}
                              className="flex items-center gap-2 px-3 py-2.5">
                              {/* 준비완료 체크 */}
                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    m.id,
                                    m.status === "준비완료"
                                      ? "발주완료"
                                      : "준비완료",
                                  )
                                }
                                className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                                style={{
                                  backgroundColor:
                                    m.status === "준비완료"
                                      ? "#1f66ff"
                                      : "transparent",
                                  borderColor:
                                    m.status === "준비완료"
                                      ? "#1f66ff"
                                      : "#cbd5e1",
                                }}>
                                {m.status === "준비완료" && (
                                  <span
                                    style={{ color: "white", fontSize: 10 }}>
                                    ✓
                                  </span>
                                )}
                              </button>

                              <div className="flex-1 min-w-0">
                                <p
                                  className="text-sm font-medium"
                                  style={{
                                    color:
                                      m.status === "준비완료"
                                        ? "#94a3b8"
                                        : "#111827",
                                    textDecoration:
                                      m.status === "준비완료"
                                        ? "line-through"
                                        : "none",
                                  }}>
                                  {m.name}
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                  {isAdmin && m.supplier && supplierStyle && (
                                    <span
                                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                                      style={{
                                        backgroundColor: supplierStyle.bg,
                                        color: supplierStyle.color,
                                      }}>
                                      {m.supplier}
                                    </span>
                                  )}
                                  {m.memo && (
                                    <span
                                      className="text-[10px]"
                                      style={{ color: "#94a3b8" }}>
                                      {m.memo}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* 상태 변경 (관리자만) */}
                              {isAdmin && (
                                <select
                                  value={m.status}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      m.id,
                                      e.target.value as MaterialStatus,
                                    )
                                  }
                                  className="text-[10px] font-bold rounded-lg px-2 py-1 cursor-pointer flex-shrink-0"
                                  style={{
                                    backgroundColor: statusStyle.bg,
                                    color: statusStyle.color,
                                    border: `1px solid ${statusStyle.border}`,
                                    outline: "none",
                                  }}>
                                  {MATERIAL_STATUSES.map((s) => (
                                    <option key={s} value={s}>
                                      {s}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
