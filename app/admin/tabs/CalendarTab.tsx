"use client";

import type { Job, JobFormState } from "../lib/types";
import type { Tech } from "../lib/constants";
import { TECHS, TECH_COLOR } from "../lib/constants";
import {
  formatDate,
  formatFullDate,
  formatTime,
  formatPrice,
  getCalendarDays,
  pad,
  today as getToday,
} from "../lib/utils";
import { getJobTechs, jobHasTech } from "../lib/jobTechs";
import JobCard from "../components/JobCard";

interface CalendarTabProps {
  jobs: Job[];
  calYear: number;
  calMonth: number;
  setCalYear: (v: number) => void;
  setCalMonth: (v: number) => void;
  selectedDay: string | null;
  setSelectedDay: (v: string | null) => void;
  calTechFilter: Tech | "전체";
  setCalTechFilter: (v: Tech | "전체") => void;
  isAdmin: boolean;
  loggedUser: string | null;
  jobsByDate: Record<string, Job[]>;
  onUpdate: (id: string, patch: Partial<Job>) => void;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  onAddJob: (date: string) => void;
  matchSearch: (j: Job) => boolean;
  searchQuery: string;
  hasSearchQuery: boolean;
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

export default function CalendarTab({
  jobs,
  calYear,
  calMonth,
  setCalYear,
  setCalMonth,
  selectedDay,
  setSelectedDay,
  calTechFilter,
  setCalTechFilter,
  isAdmin,
  loggedUser,
  jobsByDate,
  onUpdate,
  onEdit,
  onDelete,
  onAddJob,
  matchSearch,
  searchQuery,
  hasSearchQuery,
}: CalendarTabProps) {
  const calDays = getCalendarDays(calYear, calMonth);
  const todayStr = getToday();
  const getVisibleJobs = (date: string) =>
    (jobsByDate[date] ?? []).filter(
      (j) =>
        jobHasTech(j, calTechFilter) &&
        matchSearch(j),
    );

  const selectedJobs = selectedDay ? getVisibleJobs(selectedDay) : [];
  const allMonthSearchResults = hasSearchQuery
    ? jobs
        .filter((j) => jobHasTech(j, calTechFilter) && matchSearch(j))
        .sort((a, b) => {
          const dateCompare = (a.visit_date || "").localeCompare(
            b.visit_date || "",
          );
          if (dateCompare !== 0) return dateCompare;
          return (a.visit_time || "99:99").localeCompare(
            b.visit_time || "99:99",
          );
        })
    : [];
  const jumpToJobDate = (date: string) => {
    const [year, month] = date.split("-").map(Number);
    if (!year || !month) return;
    setCalYear(year);
    setCalMonth(month - 1);
    setSelectedDay(date);
  };

  return (
    <div>
      {/* 월 이동 + 기사 필터 */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => {
            const d = new Date(calYear, calMonth - 1);
            setCalYear(d.getFullYear());
            setCalMonth(d.getMonth());
            setSelectedDay(null);
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
            setSelectedDay(null);
          }}
          className="px-3 py-2 rounded-lg text-lg font-bold"
          style={{
            backgroundColor: "#ffffff",
            color: "#111827",
            border: "1px solid #e5e7eb",
          }}>
          ›
        </button>
        {isAdmin ? (
          <TechFilterSelect value={calTechFilter} onChange={setCalTechFilter} />
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

      {/* 기사 범례 */}
      <div className="flex items-center gap-4 mb-3 px-1">
        {TECHS.map((t) => (
          <div key={t} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: TECH_COLOR[t] }}
            />
            <span
              className="text-xs font-medium"
              style={{ color: TECH_COLOR[t] }}>
              {t}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: "#94a3b8" }}
          />
          <span className="text-xs font-medium" style={{ color: "#64748b" }}>
            미배정
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
      <div className="grid grid-cols-7 gap-0">
        {calDays.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const dateStr = `${calYear}-${pad(calMonth + 1)}-${pad(day)}`;
          const dayJobs = getVisibleJobs(dateStr);
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDay;
          const dow = i % 7;
          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDay(isSelected ? null : dateStr)}
              className="rounded-xl p-0.5 min-h-[72px] flex flex-col items-start text-left"
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
              <div className="flex flex-col gap-px w-full mt-0.5">
                {(() => {
                  const counts: Record<string, number> = {};
                  dayJobs.forEach((j) => {
                    const keys = getJobTechs(j);
                    (keys.length ? keys : ["미배정"]).forEach((key) => {
                      counts[key] = (counts[key] || 0) + 1;
                    });
                  });
                  return Object.entries(counts).map(([tech, count]) => (
                    <div
                      key={tech}
                      className="flex items-center gap-0.5 truncate"
                      style={{ lineHeight: 1.4 }}>
                      <span
                        className="flex-shrink-0 rounded-full text-center"
                        style={{
                          width: 13,
                          height: 13,
                          fontSize: 8,
                          fontWeight: 800,
                          color: "#fff",
                          backgroundColor: TECH_COLOR[tech] || TECH_COLOR[""],
                          lineHeight: "13px",
                        }}>
                        {count}
                      </span>
                      <span
                        className="truncate"
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: TECH_COLOR[tech] || TECH_COLOR[""],
                        }}>
                        {tech === "미배정" ? "미정" : tech}
                      </span>
                    </div>
                  ));
                })()}
              </div>
            </button>
          );
        })}
      </div>

      {hasSearchQuery && (
        <div
          className="mt-4 rounded-2xl overflow-hidden"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #d8e4ff",
            boxShadow: "0 8px 22px rgba(31,102,255,0.08)",
          }}>
          <div
            className="flex items-center justify-between gap-3 px-4 py-3"
            style={{ borderBottom: "1px solid #e5e7eb" }}>
            <div>
              <p className="text-sm font-bold" style={{ color: "#111827" }}>
                전체 달 검색 결과
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                {searchQuery.trim()} · {allMonthSearchResults.length}건
              </p>
            </div>
            <span
              className="text-xs font-bold px-2 py-1 rounded-full"
              style={{ backgroundColor: "#eaf1ff", color: "#1f66ff" }}>
              날짜 누르면 이동
            </span>
          </div>

          {allMonthSearchResults.length === 0 ? (
            <div className="text-center py-8" style={{ color: "#94a3b8" }}>
              <p className="text-sm">전체 일정에서 검색 결과가 없습니다</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {allMonthSearchResults.slice(0, 80).map((job) => (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => jumpToJobDate(job.visit_date)}
                  className="w-full text-left px-4 py-3"
                  style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="text-xs font-bold"
                      style={{ color: "#1f66ff" }}>
                      {formatDate(job.visit_date)}
                      {job.visit_time ? ` ${formatTime(job.visit_time)}` : ""}
                    </span>
                    <span
                      className="text-xs font-semibold flex-shrink-0"
                      style={{ color: TECH_COLOR[job.tech] || "#64748b" }}>
                      {job.tech || "미배정"}
                    </span>
                  </div>
                  <p
                    className="text-sm font-bold mt-1 truncate"
                    style={{ color: "#111827" }}>
                    {job.name || "이름 없음"} · {job.region || "지역 미입력"}
                  </p>
                  <p
                    className="text-xs mt-0.5 truncate"
                    style={{ color: "#64748b" }}>
                    {job.symptom || "증상 미입력"}
                  </p>
                </button>
              ))}
              {allMonthSearchResults.length > 80 && (
                <div
                  className="px-4 py-3 text-xs text-center"
                  style={{ color: "#64748b" }}>
                  검색 결과가 많아 80건까지만 표시됩니다
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 선택된 날 일정 */}
      {selectedDay && (
        <div
          className="mt-4 rounded-2xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #ffffff 0%, #eef4ff 55%, #e6dcff 100%)",
            border: "1px solid #bfd3ff",
            boxShadow: "0 10px 28px rgba(31,102,255,0.12)",
          }}>
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid #e5e7eb" }}>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold" style={{ color: "#111827" }}>
                {formatDate(selectedDay)}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: "#f3f4f6", color: "#475569" }}>
                {selectedJobs.length}건
              </span>
              {isAdmin &&
                (() => {
                  const total = selectedJobs
                    .filter((j) => !j.is_measurement && j.status !== "취소")
                    .reduce((s, j) => s + (j.price || 0), 0);
                  return (
                    <p
                      className="text-xl font-bold w-full"
                      style={{ color: "#1f66ff" }}>
                      예상 매출: {formatPrice(total)}
                    </p>
                  );
                })()}
              {calTechFilter !== "전체" && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-bold"
                  style={{
                    backgroundColor: TECH_COLOR[calTechFilter] + "22",
                    color: TECH_COLOR[calTechFilter],
                  }}>
                  {calTechFilter}
                </span>
              )}
            </div>
            {isAdmin && (
              <button
                onClick={() => onAddJob(selectedDay)}
                className="text-[20px] border-2 border-transparent rounded-xl px-3 py-2 bg-gradient-to-r from-[#1f66ff] to-[#4f8fff] font-bold shadow-xl"
                style={{ color: "white" }}>
                + 추가
              </button>
            )}
          </div>

          {selectedJobs.length === 0 ? (
            <div
              className="text-center py-10"
              style={{ backgroundColor: "#f5f7fb", color: "#94a3b8" }}>
              <p className="text-2xl mb-2">📋</p>
              <p className="text-sm">일정 없음</p>
            </div>
          ) : (
            <div
              className="flex flex-col gap-0"
              style={{ backgroundColor: "#f5f7fb" }}>
              {[...selectedJobs]
                .sort((a, b) => {
                  if (!a.visit_time && !b.visit_time) return 0;
                  if (!a.visit_time) return 1;
                  if (!b.visit_time) return -1;
                  return a.visit_time.localeCompare(b.visit_time);
                })
                .map((job, idx, arr) => (
                  <div key={job.id}>
                    {job.visit_time &&
                      (idx === 0 ||
                        !arr[idx - 1].visit_time ||
                        arr[idx - 1].visit_time?.slice(0, 2) !==
                          job.visit_time.slice(0, 2)) && (
                        <div
                          className="flex items-center gap-2 px-4 py-2"
                          style={{ borderBottom: "1px solid #ffffff" }}>
                          <span
                            className="text-xs font-bold"
                            style={{ color: "#94a3b8" }}>
                            {formatTime(job.visit_time)}
                          </span>
                          <div
                            className="flex-1 h-px"
                            style={{ backgroundColor: "#ffffff" }}
                          />
                        </div>
                      )}
                    {!job.visit_time &&
                      (idx === 0 || arr[idx - 1].visit_time) && (
                        <div
                          className="px-4 py-2"
                          style={{ borderBottom: "1px solid #ffffff" }}>
                          <span
                            className="text-xs font-bold"
                            style={{ color: "#94a3b8" }}>
                            시간 미정
                          </span>
                        </div>
                      )}
                    <div className="px-3 py-2">
                      <JobCard
                        job={job}
                        onUpdate={onUpdate}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        isAdmin={isAdmin}
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
