"use client";

import { useCallback, useState } from "react";
import type { Job } from "../lib/types";
import type { Tech } from "../lib/constants";
import { TECH_COLOR, TECH_HOME } from "../lib/constants";
import {
  formatTime,
  formatPrice,
  getCalendarDays,
  pad,
  today as getToday,
  makeDateTime,
  toIsoLocal,
  displayTime,
  diffMinutes,
} from "../lib/utils";

interface RouteTabProps {
  jobs: Job[];
  dateFilter: string;
  setDateFilter: (v: string) => void;
  techFilter: Tech | "전체";
  setTechFilter: (v: Tech | "전체") => void;
  isAdmin: boolean;
  loggedUser: string | null;
  jobsByDate: Record<string, Job[]>;
  TechFilterSelect: React.ComponentType<{
    value: Tech | "전체";
    onChange: (v: Tech | "전체") => void;
  }>;
}

type RouteResult = {
  duration: number;
  distance: number;
  departAt?: string;
  arriveAt?: string;
  targetAt?: string;
  gapMin?: number;
  workMin?: number;
};

export default function RouteTab({
  jobs,
  dateFilter,
  setDateFilter,
  techFilter,
  setTechFilter,
  isAdmin,
  loggedUser,
  jobsByDate,
  TechFilterSelect,
}: RouteTabProps) {
  const [routeResults, setRouteResults] = useState<Record<string, RouteResult>>(
    {},
  );
  const [routeLoading, setRouteLoading] = useState(false);
  const todayStr = getToday();

  const df = new Date(dateFilter);
  const miniYear = df.getFullYear();
  const miniMonth = df.getMonth();
  const miniDays = getCalendarDays(miniYear, miniMonth);

  const TECH_COLOR_LOCAL = TECH_COLOR;

  const geocode = useCallback(async (addr: string): Promise<string | null> => {
    try {
      const res = await fetch(`/api/geocode?query=${encodeURIComponent(addr)}`);
      const data = await res.json();
      if (data.addresses?.length > 0)
        return `${data.addresses[0].x},${data.addresses[0].y}`;
    } catch {}
    return null;
  }, []);

  const loadRoutes = useCallback(
    async (routeJobs: Job[], techName?: string) => {
      if (routeJobs.length < 1) return;
      setRouteLoading(true);
      setRouteResults({});

      const callDirection = async (
        start: string,
        goal: string,
        departureDate: Date,
      ) => {
        const res = await fetch(
          `/api/directions?start=${start}&goal=${goal}&departure_time=${toIsoLocal(departureDate)}`,
        );
        const data = await res.json();
        const summary = data.route?.traoptimal?.[0]?.summary;
        if (!summary) return null;
        return {
          duration: Math.round(summary.duration / 60000),
          distance: Math.round(summary.distance / 1000),
        };
      };

      try {
        const homeAddr = techName ? TECH_HOME[techName] : null;

        if (homeAddr && routeJobs.length > 0) {
          const firstJob = routeJobs[0];
          const key = `home-${firstJob.id}`;
          const start = await geocode(homeAddr);
          const goal = await geocode(firstJob.region);
          if (start && goal && firstJob.visit_date && firstJob.visit_time) {
            const targetAt = makeDateTime(
              firstJob.visit_date,
              firstJob.visit_time,
            );
            const baseDepartAt = new Date(targetAt);
            baseDepartAt.setHours(baseDepartAt.getHours() - 1);
            const firstResult = await callDirection(start, goal, baseDepartAt);
            if (firstResult) {
              const recommendDepartAt = new Date(targetAt);
              recommendDepartAt.setMinutes(
                recommendDepartAt.getMinutes() - firstResult.duration,
              );
              const finalResult =
                (await callDirection(start, goal, recommendDepartAt)) ||
                firstResult;
              const finalDepartAt = new Date(targetAt);
              finalDepartAt.setMinutes(
                finalDepartAt.getMinutes() - finalResult.duration,
              );
              const arriveAt = new Date(finalDepartAt);
              arriveAt.setMinutes(arriveAt.getMinutes() + finalResult.duration);
              setRouteResults((prev) => ({
                ...prev,
                [key]: {
                  ...finalResult,
                  departAt: displayTime(finalDepartAt),
                  arriveAt: displayTime(arriveAt),
                  targetAt: displayTime(targetAt),
                  gapMin: diffMinutes(targetAt, arriveAt),
                },
              }));
            }
          }
        }

        for (let i = 0; i < routeJobs.length - 1; i++) {
          const a = routeJobs[i];
          const b = routeJobs[i + 1];
          const key = `${a.id}-${b.id}`;
          const start = await geocode(a.region);
          const goal = await geocode(b.region);
          if (
            !start ||
            !goal ||
            !a.visit_date ||
            !a.visit_time ||
            !b.visit_date ||
            !b.visit_time
          )
            continue;
          const currentStartAt = makeDateTime(a.visit_date, a.visit_time);
          const nextTargetAt = makeDateTime(b.visit_date, b.visit_time);
          const baseDepartAt = new Date(nextTargetAt);
          baseDepartAt.setHours(baseDepartAt.getHours() - 1);
          const firstResult = await callDirection(start, goal, baseDepartAt);
          if (firstResult) {
            const recommendDepartAt = new Date(nextTargetAt);
            recommendDepartAt.setMinutes(
              recommendDepartAt.getMinutes() - firstResult.duration,
            );
            const finalResult =
              (await callDirection(start, goal, recommendDepartAt)) ||
              firstResult;
            const finalDepartAt = new Date(nextTargetAt);
            finalDepartAt.setMinutes(
              finalDepartAt.getMinutes() - finalResult.duration,
            );
            const arriveAt = new Date(finalDepartAt);
            arriveAt.setMinutes(arriveAt.getMinutes() + finalResult.duration);
            const workMin = Math.max(
              0,
              Math.round(
                (finalDepartAt.getTime() - currentStartAt.getTime()) / 60000,
              ),
            );
            setRouteResults((prev) => ({
              ...prev,
              [key]: {
                ...finalResult,
                departAt: displayTime(finalDepartAt),
                arriveAt: displayTime(arriveAt),
                targetAt: displayTime(nextTargetAt),
                gapMin: diffMinutes(nextTargetAt, arriveAt),
                workMin,
              },
            }));
          }
        }
      } finally {
        setRouteLoading(false);
      }
    },
    [geocode],
  );

  const dayJobs = jobs
    .filter((j) => j.visit_date === dateFilter && j.status !== "취소")
    .filter((j) => techFilter === "전체" || j.tech === techFilter)
    .sort((a, b) =>
      (a.visit_time || "99:99").localeCompare(b.visit_time || "99:99"),
    );

  const techGroups: Record<string, Job[]> = {};
  dayJobs.forEach((j) => {
    const key = j.tech || "미배정";
    if (!techGroups[key]) techGroups[key] = [];
    techGroups[key].push(j);
  });

  return (
    <div>
      {/* 미니 달력 */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => {
              const d = new Date(miniYear, miniMonth - 1);
              setDateFilter(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-01`);
            }}
            className="px-3 py-1.5 rounded-lg text-lg font-bold"
            style={{
              backgroundColor: "#ffffff",
              color: "#111827",
              border: "1px solid #e5e7eb",
            }}>
            ‹
          </button>
          <span
            className="flex-1 text-center text-sm font-bold"
            style={{ color: "#111827" }}>
            {miniYear}년 {miniMonth + 1}월
          </span>
          <button
            onClick={() => {
              const d = new Date(miniYear, miniMonth + 1);
              setDateFilter(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-01`);
            }}
            className="px-3 py-1.5 rounded-lg text-lg font-bold"
            style={{
              backgroundColor: "#ffffff",
              color: "#111827",
              border: "1px solid #e5e7eb",
            }}>
            ›
          </button>
          {isAdmin ? (
            <TechFilterSelect value={techFilter} onChange={setTechFilter} />
          ) : (
            <span
              className="text-xs font-bold px-3 py-2 rounded-xl"
              style={{
                backgroundColor: TECH_COLOR_LOCAL[loggedUser!] + "22",
                color: TECH_COLOR_LOCAL[loggedUser!],
                border: `1px solid ${TECH_COLOR_LOCAL[loggedUser!]}44`,
              }}>
              {loggedUser}
            </span>
          )}
        </div>
        <div className="grid grid-cols-7 mb-0.5">
          {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
            <div
              key={d}
              className="text-center text-[10px] py-1 font-bold"
              style={{
                color: i === 0 ? "#ef6666" : i === 6 ? "#60a5fa" : "#94a3b8",
              }}>
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0">
          {miniDays.map((day, i) => {
            if (!day) return <div key={`me-${i}`} />;
            const ds = `${miniYear}-${pad(miniMonth + 1)}-${pad(day)}`;
            const allDJ = jobsByDate[ds] ?? [];
            const dayJ =
              techFilter === "전체"
                ? allDJ
                : allDJ.filter((j) => j.tech === techFilter);
            const isSel = ds === dateFilter;
            const isT = ds === todayStr;
            const dow = i % 7;
            return (
              <button
                key={ds}
                onClick={() => setDateFilter(ds)}
                className="rounded-lg p-0.5 min-h-[48px] flex flex-col items-center"
                style={{
                  backgroundColor: isSel ? "#1f66ff" : "#ffffff",
                  border:
                    isT && !isSel ? "1px solid #a9c4ff" : "1px solid #f3f4f6",
                }}>
                <span
                  className="text-[10px] font-bold"
                  style={{
                    color: isSel
                      ? "#ffffff"
                      : dow === 0
                        ? "#ef6666"
                        : dow === 6
                          ? "#60a5fa"
                          : "#111827",
                  }}>
                  {day}
                </span>
                {dayJ.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-px mt-0.5">
                    {(() => {
                      const c: Record<string, number> = {};
                      dayJ.forEach((j) => {
                        const k = j.tech || "";
                        c[k] = (c[k] || 0) + 1;
                      });
                      return Object.entries(c).map(([t, n]) => (
                        <span
                          key={t}
                          className="rounded-full text-center"
                          style={{
                            width: 12,
                            height: 12,
                            fontSize: 7,
                            fontWeight: 800,
                            lineHeight: "12px",
                            color: isSel
                              ? TECH_COLOR_LOCAL[t] || TECH_COLOR_LOCAL[""]
                              : "#fff",
                            backgroundColor: isSel
                              ? "#ffffff"
                              : TECH_COLOR_LOCAL[t] || TECH_COLOR_LOCAL[""],
                          }}>
                          {n}
                        </span>
                      ));
                    })()}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 동선 */}
      {Object.keys(techGroups).length === 0 ? (
        <div
          className="text-center py-16 rounded-2xl"
          style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}>
          <p className="text-3xl mb-2">🗺</p>
          <p className="text-sm" style={{ color: "#94a3b8" }}>
            이 날 일정이 없어요
          </p>
        </div>
      ) : (
        Object.entries(techGroups).map(([tech, techJobs]) => {
          const color = TECH_COLOR_LOCAL[tech] || TECH_COLOR_LOCAL[""];
          const relevantKeys = Object.keys(routeResults).filter(
            (k) =>
              k === `home-${techJobs[0]?.id}` ||
              techJobs.some(
                (j, i) =>
                  i < techJobs.length - 1 &&
                  k === `${j.id}-${techJobs[i + 1].id}`,
              ),
          );

          return (
            <div
              key={tech}
              className="mb-4 rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${color}33` }}>
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{
                  backgroundColor: color + "12",
                  borderBottom: `1px solid ${color}22`,
                }}>
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm font-black" style={{ color }}>
                    {tech} 기사님
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ backgroundColor: color + "22", color }}>
                    {techJobs.length}건
                  </span>
                </div>
                <button
                  onClick={() => loadRoutes(techJobs, tech)}
                  disabled={routeLoading}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl"
                  style={{
                    backgroundColor: routeLoading ? "#f3f4f6" : color,
                    color: routeLoading ? "#94a3b8" : "white",
                  }}>
                  {routeLoading ? "계산중..." : "🗺 동선 계산"}
                </button>
              </div>

              <div style={{ backgroundColor: "#f5f7fb" }}>
                {TECH_HOME[tech] && (
                  <>
                    <div
                      className="px-4 py-3"
                      style={{ borderBottom: "1px solid #ffffff" }}>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                          style={{
                            backgroundColor: "#94a3b8",
                            color: "white",
                          }}>
                          🏠
                        </span>
                        <span
                          className="text-sm font-bold"
                          style={{ color: "#64748b" }}>
                          출발지
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 pl-8">
                        <span style={{ fontSize: 10 }}>📍</span>
                        <span className="text-xs" style={{ color: "#94a3b8" }}>
                          {TECH_HOME[tech]}
                        </span>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-2 px-4 py-2"
                      style={{ backgroundColor: "#ffffff" }}>
                      <div
                        className="flex flex-col items-center gap-0.5 pl-2"
                        style={{ color: "#cbd5e1" }}>
                        <span style={{ fontSize: 8 }}>●</span>
                        <span style={{ fontSize: 10, lineHeight: 1 }}>│</span>
                        <span style={{ fontSize: 10, lineHeight: 1 }}>│</span>
                        <span style={{ fontSize: 8 }}>●</span>
                      </div>
                      {routeResults[`home-${techJobs[0]?.id}`] ? (
                        <div className="flex flex-col gap-1">
                          <span
                            className="text-xs font-black px-2.5 py-1 rounded-lg"
                            style={{
                              backgroundColor: "#94a3b8",
                              color: "white",
                            }}>
                            🚗 {routeResults[`home-${techJobs[0].id}`].duration}
                            분
                          </span>
                          <span
                            className="text-xs"
                            style={{ color: "#94a3b8" }}>
                            {routeResults[`home-${techJobs[0].id}`].distance}km
                          </span>
                          <div
                            className="text-xs font-bold"
                            style={{ color: "#64748b" }}>
                            추천 출발{" "}
                            {routeResults[`home-${techJobs[0].id}`].departAt} ·
                            도착{" "}
                            {routeResults[`home-${techJobs[0].id}`].arriveAt}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs" style={{ color: "#cbd5e1" }}>
                          ↕ 출발
                        </span>
                      )}
                    </div>
                  </>
                )}

                {techJobs.map((job, idx) => (
                  <div key={job.id}>
                    <div
                      className="px-4 py-3"
                      style={{ borderBottom: "1px solid #ffffff" }}>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                          style={{ backgroundColor: color, color: "white" }}>
                          {idx + 1}
                        </span>
                        <span
                          className="text-sm font-bold"
                          style={{ color: "#111827" }}>
                          {job.name} 고객님
                        </span>
                        {job.visit_time && (
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: "#eaf1ff",
                              color: "#1f66ff",
                            }}>
                            {formatTime(job.visit_time)}
                          </span>
                        )}
                        {job.price > 0 && (
                          <span
                            className="text-xs font-bold ml-auto"
                            style={{ color: "#1f66ff" }}>
                            {formatPrice(job.price)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 pl-8">
                        <span style={{ fontSize: 10 }}>📍</span>
                        <span className="text-xs" style={{ color: "#64748b" }}>
                          {job.region}
                        </span>
                      </div>
                      {job.symptom && (
                        <div className="pl-8 mt-1">
                          <span
                            className="text-xs font-medium"
                            style={{ color: "#475569" }}>
                            {job.symptom}
                          </span>
                        </div>
                      )}
                    </div>

                    {idx < techJobs.length - 1 && (
                      <div
                        className="flex items-center gap-2 px-4 py-2"
                        style={{ backgroundColor: "#ffffff" }}>
                        <div
                          className="flex flex-col items-center gap-0.5 pl-2"
                          style={{ color: "#cbd5e1" }}>
                          <span style={{ fontSize: 8 }}>●</span>
                          <span style={{ fontSize: 10, lineHeight: 1 }}>│</span>
                          <span style={{ fontSize: 10, lineHeight: 1 }}>│</span>
                          <span style={{ fontSize: 8 }}>●</span>
                        </div>
                        {routeResults[`${job.id}-${techJobs[idx + 1].id}`] ? (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span
                                className="text-xs font-black px-2.5 py-1 rounded-lg"
                                style={{
                                  backgroundColor: "#1f66ff",
                                  color: "white",
                                }}>
                                🚗{" "}
                                {
                                  routeResults[
                                    `${job.id}-${techJobs[idx + 1].id}`
                                  ].duration
                                }
                                분
                              </span>
                              <span
                                className="text-xs"
                                style={{ color: "#94a3b8" }}>
                                {
                                  routeResults[
                                    `${job.id}-${techJobs[idx + 1].id}`
                                  ].distance
                                }
                                km
                              </span>
                            </div>
                            {routeResults[`${job.id}-${techJobs[idx + 1].id}`]
                              .workMin !== undefined && (
                              <div
                                className="text-xs font-bold"
                                style={{ color: "#1f66ff" }}>
                                추천 작업시간{" "}
                                {Math.floor(
                                  routeResults[
                                    `${job.id}-${techJobs[idx + 1].id}`
                                  ].workMin! / 60,
                                )}
                                시간{" "}
                                {routeResults[
                                  `${job.id}-${techJobs[idx + 1].id}`
                                ].workMin! % 60}
                                분
                              </div>
                            )}
                            {routeResults[`${job.id}-${techJobs[idx + 1].id}`]
                              .departAt && (
                              <div
                                className="text-xs font-bold"
                                style={{ color: "#64748b" }}>
                                추천 출발{" "}
                                {
                                  routeResults[
                                    `${job.id}-${techJobs[idx + 1].id}`
                                  ].departAt
                                }{" "}
                                · 도착{" "}
                                {
                                  routeResults[
                                    `${job.id}-${techJobs[idx + 1].id}`
                                  ].arriveAt
                                }
                              </div>
                            )}
                          </div>
                        ) : (
                          <span
                            className="text-xs"
                            style={{ color: "#cbd5e1" }}>
                            ↕ 이동
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {relevantKeys.length > 0 && (
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{
                    backgroundColor: "#ffffff",
                    borderTop: `1px solid ${color}22`,
                  }}>
                  <span
                    className="text-xs font-bold"
                    style={{ color: "#64748b" }}>
                    총 이동
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black" style={{ color }}>
                      🚗{" "}
                      {relevantKeys.reduce(
                        (s, k) => s + (routeResults[k]?.duration || 0),
                        0,
                      )}
                      분
                    </span>
                    <span className="text-xs" style={{ color: "#94a3b8" }}>
                      {relevantKeys.reduce(
                        (s, k) => s + (routeResults[k]?.distance || 0),
                        0,
                      )}
                      km
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
