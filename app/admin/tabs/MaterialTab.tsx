"use client";

import { useState, useEffect } from "react";
import type { Job, Material } from "../lib/types";
import type { MaterialStatus } from "../lib/constants";
import { MATERIAL_SUPPLIER_STYLE } from "../lib/constants";
import { getSupabase } from "../lib/utils";
import {
  getCalendarDays,
  pad,
  today as getToday,
  formatDate,
} from "../lib/utils";
import MaterialLabelModal, {
  materialCode,
} from "../components/MaterialLabelModal";
import type { MaterialLabelData } from "../components/MaterialLabelModal";
import MaterialStatusStepper from "../components/MaterialStatusStepper";

type MaterialWithJob = Material & {
  job: {
    id: string;
    name: string;
    region: string;
    visit_date: string;
    tech: string;
    symptom: string;
    status?: string;
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
  const [labelData, setLabelData] = useState<MaterialLabelData | null>(null);

  // 날짜 상관없이 "발주필요" 전체 — 까먹지 않도록 탭 열자마자 바로 보임
  const [pendingOrders, setPendingOrders] = useState<MaterialWithJob[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);

  // "발주완료"인데 아직 준비완료 확인이 안 된 것들 — 도착했는지 체크 필요
  const [needsConfirm, setNeedsConfirm] = useState<MaterialWithJob[]>([]);
  const [loadingConfirm, setLoadingConfirm] = useState(false);

  // 달력에 점 표시용: 이달 자재 있는 날짜 목록
  const [markedDates, setMarkedDates] = useState<
    Record<string, { total: number; ready: number; issue: boolean }>
  >({});

  const calDays = getCalendarDays(calYear, calMonth);

  // 방문일까지 D-day 계산
  const dDay = (visitDate?: string): number | null => {
    if (!visitDate) return null;
    const diff = Math.round(
      (new Date(visitDate).getTime() - new Date(todayStr).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return diff;
  };

  const dDayLabel = (visitDate?: string) => {
    const d = dDay(visitDate);
    if (d === null) return { text: "날짜 미정", color: "#94a3b8" };
    if (d < 0) return { text: "방문일 지남", color: "#ef4444" };
    if (d === 0) return { text: "오늘 방문", color: "#ef4444" };
    if (d <= 2) return { text: `D-${d}`, color: "#f59e0b" };
    return { text: `D-${d}`, color: "#94a3b8" };
  };

  // 이달 자재 마킹 로드
  const loadMonthMarks = async () => {
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

  useEffect(() => {
    loadMonthMarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calYear, calMonth]);

  // 상태별 전체 로드 (날짜/달력 선택과 무관) — 공용 헬퍼
  const loadByStatus = async (
    status: MaterialStatus,
  ): Promise<MaterialWithJob[]> => {
    const { data } = await getSupabase()
      .from("materials")
      .select("*, jobs(id, name, region, visit_date, tech, symptom, status)")
      .eq("status", status)
      .order("created_at", { ascending: true });

    return (data ?? [])
      .map((m: any) => ({ ...m, job: m.jobs }))
      .filter((m: any) => m.job && m.job.status !== "취소")
      .sort((a: any, b: any) =>
        (a.job?.visit_date || "").localeCompare(b.job?.visit_date || ""),
      ) as MaterialWithJob[];
  };

  const loadPendingOrders = async () => {
    setLoadingPending(true);
    setPendingOrders(await loadByStatus("발주필요"));
    setLoadingPending(false);
  };

  const loadNeedsConfirm = async () => {
    setLoadingConfirm(true);
    setNeedsConfirm(await loadByStatus("발주완료"));
    setLoadingConfirm(false);
  };

  useEffect(() => {
    loadPendingOrders();
    loadNeedsConfirm();
  }, []);

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
    // 발주필요/발주완료 요약과 달력 마킹 전부 이 상태에 영향받으므로
    // 변경 후엔 한꺼번에 다시 불러와서 정확하게 맞춘다
    loadMonthMarks();
    loadPendingOrders();
    loadNeedsConfirm();
  };

  const jumpToDate = (visitDate?: string) => {
    if (!visitDate) return;
    const [y, mo] = visitDate.split("-").map(Number);
    if (!y || !mo) return;
    setCalYear(y);
    setCalMonth(mo - 1);
    setSelectedDay(visitDate);
  };

  const openLabel = (m: MaterialWithJob) => {
    setLabelData({
      code: materialCode(m.job?.visit_date || "", m.job?.name || "", m.id),
      customerName: m.job?.name || "",
      visitDate: m.job?.visit_date ? formatDate(m.job.visit_date) : "",
      materialName: m.name,
      supplier: m.supplier,
      memo: m.memo,
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
      {/* 발주필요 전체 요약 — 날짜 안 들어가봐도 까먹지 않도록 항상 맨 위 */}
      <div
        className="rounded-2xl overflow-hidden mb-3"
        style={{
          border: `1px solid ${pendingOrders.length > 0 ? "#fecaca" : "#bbf7d0"}`,
        }}>
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{
            backgroundColor: pendingOrders.length > 0 ? "#fef2f2" : "#f0fdf4",
          }}>
          <span
            className="text-sm font-bold"
            style={{
              color: pendingOrders.length > 0 ? "#ef4444" : "#16a34a",
            }}>
            {loadingPending
              ? "불러오는 중..."
              : pendingOrders.length > 0
                ? `🔴 발주 필요 ${pendingOrders.length}건`
                : "✅ 발주 필요한 자재 없음"}
          </span>
        </div>

        {pendingOrders.length > 0 && (
          <div
            className="flex flex-col divide-y"
            style={{ backgroundColor: "#ffffff", borderColor: "#f3f4f6" }}>
            {pendingOrders.map((m) => (
              <div key={m.id} className="flex items-center gap-2 px-3 py-2.5">
                <button
                  type="button"
                  onClick={() => jumpToDate(m.job?.visit_date)}
                  className="flex-1 min-w-0 text-left">
                  <p
                    className="text-sm font-bold truncate"
                    style={{ color: "#111827" }}>
                    {m.job?.name} 고객님 · {m.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
                    {m.job?.visit_date
                      ? formatDate(m.job.visit_date)
                      : "날짜 미정"}
                    {" 방문"}
                    {m.supplier ? ` · ${m.supplier}` : ""}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => openLabel(m)}
                  className="flex-shrink-0 text-xs font-bold px-2 py-1.5 rounded-lg"
                  style={{
                    backgroundColor: "#f8fafc",
                    color: "#64748b",
                    border: "1px solid #e5e7eb",
                  }}>
                  🏷
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(m.id, "발주완료")}
                  className="flex-shrink-0 text-xs font-bold px-2.5 py-1.5 rounded-lg text-white"
                  style={{ backgroundColor: "#1f66ff" }}>
                  발주완료
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 준비 확인 필요 — 발주는 했지만 도착/준비 확인이 안 된 것들, 방문일 임박 순 */}
      <div
        className="rounded-2xl overflow-hidden mb-4"
        style={{
          border: `1px solid ${needsConfirm.length > 0 ? "#fed7aa" : "#bbf7d0"}`,
        }}>
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{
            backgroundColor: needsConfirm.length > 0 ? "#fff7ed" : "#f0fdf4",
          }}>
          <span
            className="text-sm font-bold"
            style={{
              color: needsConfirm.length > 0 ? "#f59e0b" : "#16a34a",
            }}>
            {loadingConfirm
              ? "불러오는 중..."
              : needsConfirm.length > 0
                ? `🟠 준비 확인 필요 ${needsConfirm.length}건`
                : "✅ 확인 필요한 자재 없음"}
          </span>
        </div>

        {needsConfirm.length > 0 && (
          <div
            className="flex flex-col divide-y"
            style={{ backgroundColor: "#ffffff", borderColor: "#f3f4f6" }}>
            {needsConfirm.map((m) => {
              const d = dDayLabel(m.job?.visit_date);
              return (
                <div key={m.id} className="flex items-center gap-2 px-3 py-2.5">
                  <button
                    type="button"
                    onClick={() => jumpToDate(m.job?.visit_date)}
                    className="flex-1 min-w-0 text-left">
                    <p
                      className="text-sm font-bold truncate"
                      style={{ color: "#111827" }}>
                      {m.job?.name} 고객님 · {m.name}
                    </p>
                    <p
                      className="text-xs mt-0.5 flex items-center gap-1.5"
                      style={{ color: "#94a3b8" }}>
                      <span
                        className="font-bold px-1.5 py-0.5 rounded-md"
                        style={{
                          color: d.color,
                          backgroundColor: `${d.color}18`,
                        }}>
                        {d.text}
                      </span>
                      {m.supplier ? `${m.supplier}` : ""}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => openLabel(m)}
                    className="flex-shrink-0 text-xs font-bold px-2 py-1.5 rounded-lg"
                    style={{
                      backgroundColor: "#f8fafc",
                      color: "#64748b",
                      border: "1px solid #e5e7eb",
                    }}>
                    🏷
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(m.id, "준비완료")}
                    className="flex-shrink-0 text-xs font-bold px-2.5 py-1.5 rounded-lg text-white"
                    style={{ backgroundColor: "#1f66ff" }}>
                    준비완료
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
                        className="flex flex-col divide-y"
                        style={{ borderColor: "#f3f4f6" }}>
                        {materials.map((m) => {
                          const supplierStyle = m.supplier
                            ? MATERIAL_SUPPLIER_STYLE[m.supplier]
                            : null;
                          return (
                            <div
                              key={m.id}
                              className="flex flex-col gap-2 px-3 py-2.5">
                              <div className="flex items-center gap-2">
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

                                {/* 라벨 */}
                                <button
                                  onClick={() => openLabel(m)}
                                  className="flex-shrink-0 text-xs font-bold px-2 py-1.5 rounded-lg"
                                  style={{
                                    backgroundColor: "#f8fafc",
                                    color: "#64748b",
                                    border: "1px solid #e5e7eb",
                                  }}>
                                  🏷
                                </button>
                              </div>

                              {/* 상태 스텝퍼 (관리자만) */}
                              {isAdmin && (
                                <MaterialStatusStepper
                                  status={m.status}
                                  onChange={(status) =>
                                    handleStatusChange(m.id, status)
                                  }
                                />
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

      {labelData && (
        <MaterialLabelModal
          data={labelData}
          onClose={() => setLabelData(null)}
        />
      )}
    </div>
  );
}
