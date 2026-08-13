"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Image from "next/image";

import type { Job } from "./lib/types";
import type { Status, Tech } from "./lib/constants";
import { TECH_COLOR, TECH_PHOTO, USERS } from "./lib/constants";
import { nowKST, thisYearMonth } from "./lib/utils";
import { jobHasTech } from "./lib/jobTechs";

import { useJobs, emptyForm, formFromJob } from "./hooks/useJobs";
import JobForm from "./components/JobForm";
import CalendarTab from "./tabs/CalendarTab";
import StatsTab from "./tabs/StatsTab";
import ListTab from "./tabs/ListTab";
import MaterialTab from "./tabs/MaterialTab";
import ExpenseTab from "./tabs/ExpenseTab";

// ── 메인 ─────────────────────────────────────────────────────
export default function AdminDashboard() {
  // 로그인 - useEffect로 localStorage 읽기 (SSR 안전)
  const [loggedUser, setLoggedUser] = useState<string | null>(null);
  const [idInput, setIdInput] = useState("");
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const [techFilter, setTechFilter] = useState<Tech | "전체">("전체");
  const [calTechFilter, setCalTechFilter] = useState<Tech | "전체">("전체");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const expiry = localStorage.getItem("restory_admin_expiry");
        const name = localStorage.getItem("restory_logged_name");
        if (expiry && Date.now() < parseInt(expiry) && name) {
          setLoggedUser(name);
          const savedUser = USERS.find((u) => u.name === name);
          if (savedUser?.role !== "admin") {
            setTechFilter(name as Tech);
            setCalTechFilter(name as Tech);
          }
        }
      } catch {}
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const currentUser = USERS.find((u) => u.name === loggedUser);
  const isAdmin = currentUser?.role === "admin";

  // 데이터
  const { jobs, loading, load, update, remove, save, reviewPending } =
    useJobs(loggedUser);

  // 탭/필터
  const [tab, setTab] = useState<"비용" | "전체" | "달력" | "통계" | "자재">(
    "달력",
  );
  const [statusFilter, setStatusFilter] = useState<Status | "전체">("전체");
  const [monthFilter, setMonthFilter] = useState(thisYearMonth());
  const [calYear, setCalYear] = useState(nowKST().getFullYear());
  const [calMonth, setCalMonth] = useState(nowKST().getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 폼
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  // 로그인 처리
  const handleLogin = () => {
    if (!idInput.trim() || !pwInput.trim()) {
      setPwError(true);
      return;
    }
    const user = USERS.find(
      (u) => u.id === idInput.trim() && u.password === pwInput,
    );
    if (!user) {
      setPwError(true);
      setPwInput("");
      return;
    }
    try {
      localStorage.setItem(
        "restory_admin_expiry",
        String(Date.now() + 24 * 60 * 60 * 1000),
      );
      localStorage.setItem("restory_logged_name", user.name);
    } catch {}
    setLoggedUser(user.name);
    setPwError(false);
    if (user.role !== "admin") {
      setTechFilter(user.name);
      setCalTechFilter(user.name);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("restory_admin_expiry");
      localStorage.removeItem("restory_logged_name");
    } catch {}
    setLoggedUser(null);
    setIdInput("");
    setPwInput("");
  };

  // 폼 열기
  const startEdit = (job: Job) => {
    setForm(formFromJob(job));
    setEditId(job.id);
    setShowForm(true);
  };
  const openNew = (date?: string) => {
    setForm(date ? { ...emptyForm(), visit_date: date } : emptyForm());
    setEditId(null);
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
  };

  const handleSave = async () => {
    setSaving(true);
    await save(form, editId, closeForm);
    setSaving(false);
  };

  // 검색/필터
  const normalizeSearchText = (value: unknown) =>
    String(value ?? "")
      .replace(/[\s-]/g, "")
      .toLowerCase();
  const normalizedSearchQuery = normalizeSearchText(searchQuery.trim());
  const hasSearchQuery = normalizedSearchQuery.length > 0;

  const matchSearch = (j: Job) => {
    if (!hasSearchQuery) return true;
    return [
      j.name,
      j.phone,
      j.region,
      j.symptom,
      j.memo,
      j.tech,
      j.visit_date,
      j.install_date,
    ].some((value) =>
      normalizeSearchText(value).includes(normalizedSearchQuery),
    );
  };

  const filtered = jobs.filter((j) => {
    if (
      tab === "전체" &&
      !hasSearchQuery &&
      !j.visit_date?.startsWith(monthFilter)
    )
      return false;
    if (statusFilter !== "전체" && j.status !== statusFilter) return false;
    if (techFilter !== "전체" && !jobHasTech(j, techFilter)) return false;
    if (!matchSearch(j)) return false;
    return true;
  });

  const monthJobs = jobs.filter((j) => j.visit_date?.startsWith(monthFilter));
  const doneMonth = monthJobs.filter(
    (j) => j.status === "완료" && (!j.is_measurement || j.install_completed),
  );
  const revenue = doneMonth.reduce((s, j) => s + (j.price || 0), 0);

  // 날짜별 job 맵
  const jobsByDate: Record<string, Job[]> = {};
  jobs.forEach((j) => {
    if (!jobsByDate[j.visit_date]) jobsByDate[j.visit_date] = [];
    jobsByDate[j.visit_date].push(j);
    if (j.install_date && j.install_date !== j.visit_date) {
      if (!jobsByDate[j.install_date]) jobsByDate[j.install_date] = [];
      if (!jobsByDate[j.install_date].find((x) => x.id === j.id))
        jobsByDate[j.install_date].push(j);
    }
  });

  // ── 로그인 화면 ───────────────────────────────────────────
  if (!loggedUser) {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-6"
        style={{
          background: "linear-gradient(180deg,#1f66ff 0%, #4f8fff 100%)",
        }}>
        <div
          className="w-full max-w-xs flex flex-col items-center gap-6 rounded-[28px] px-5 py-8"
          style={{
            backgroundColor: "rgba(255,255,255,0.94)",
            border: "1px solid rgba(255,255,255,0.55)",
            boxShadow: "0 20px 50px rgba(15,23,42,0.18)",
            backdropFilter: "blur(12px)",
          }}>
          <div className="text-center relative pt-[140px]">
            <Image
              src="/images/logo-cc.png"
              alt="Re'Story"
              width={116}
              height={116}
              className="w-[116px] object-contain absolute left-1/2 -translate-x-1/2 top-[10px]"
              priority
            />
            <p className="text-3xl mb-2">🛠</p>
            <h1 className="text-xl font-black" style={{ color: "#1f66ff" }}>
              리스토리 관리자
            </h1>
            <p className="text-sm mt-1" style={{ color: "#1f66ff" }}>
              아이디와 비밀번호를 입력하세요
            </p>
          </div>
          <div className="w-full flex flex-col gap-3">
            <input
              type="text"
              value={idInput}
              onChange={(e) => {
                setIdInput(e.target.value);
                setPwError(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="아이디"
              className="w-full rounded-2xl px-4 py-3.5 text-base"
              style={{
                backgroundColor: "#ffffff",
                border: `1px solid ${pwError ? "#ef4444" : "#e5e7eb"}`,
                color: "#1f66ff",
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={pwInput}
                onChange={(e) => {
                  setPwInput(e.target.value);
                  setPwError(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="비밀번호"
                className="w-full rounded-2xl px-4 py-3.5 text-base pr-12"
                style={{
                  backgroundColor: "#ffffff",
                  border: `1px solid ${pwError ? "#ef4444" : "#e5e7eb"}`,
                  color: "#1f66ff",
                  outline: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base"
                style={{ color: "#94a3b8" }}>
                {showPw ? "🙈" : "👁"}
              </button>
            </div>
            {pwError && (
              <p
                className="text-sm text-center font-medium"
                style={{ color: "#ef4444" }}>
                아이디 또는 비밀번호가 틀렸습니다
              </p>
            )}
            <button
              onClick={handleLogin}
              disabled={!idInput.trim() || !pwInput.trim()}
              className="w-full rounded-2xl py-3.5 text-base font-bold text-white"
              style={{
                backgroundColor:
                  idInput.trim() && pwInput.trim() ? "#1f66ff" : "#dbe3f0",
                opacity: idInput.trim() && pwInput.trim() ? 1 : 0.65,
              }}>
              입장
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── 메인 화면 ─────────────────────────────────────────────
  return (
    <main
      className="min-h-screen px-2 py-5"
      style={{ backgroundColor: "#f5f7fb", color: "#111827" }}>
      <div className="w-full max-w-5xl mx-auto">
        {/* 헤더 */}
        <div
          className="flex items-center justify-between mb-6 pb-4"
          style={{ borderBottom: "1px solid #e5e7eb" }}>
          <div className="w-full">
            <div className="w-full flex text-2xl font-bold mb-[16px] items-center border-2 border-transparent rounded-xl px-3 py-2 bg-gradient-to-r from-[#1f66ff] to-[#4f8fff]">
              <Image
                src="/images/logo-cc.png"
                alt="Re'Story"
                width={70}
                height={70}
                className="inline-block object-contain mr-2"
              />
              <div>
                <span className="text-[#ffffff]">리스토리</span>
                <br />
                <span style={{ color: "#2e3947" }}>관리 페이지</span>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-2">
              {TECH_PHOTO[loggedUser] && (
                <Image
                  src={TECH_PHOTO[loggedUser]}
                  alt={`${loggedUser} 프로필`}
                  width={70}
                  height={70}
                  className="rounded-xl object-cover flex-shrink-0"
                  style={{
                    width: 70,
                    height: 70,
                    objectFit: "cover",
                    objectPosition: "top center",
                    boxShadow: `0 12px 12px ${TECH_COLOR[loggedUser] || "#1f66ff"}33`,
                  }}
                />
              )}
              <div className="flex flex-col leading-tight">
                <span
                  className="text-2xl font-bold"
                  style={{ color: TECH_COLOR[loggedUser] || "#1f66ff" }}>
                  {loggedUser} {isAdmin ? "🏅" : ""}
                </span>
                {isAdmin ? (
                  <span
                    className="text-xl font-semibold"
                    style={{ color: "#415672" }}>
                    전체 관리 권한
                  </span>
                ) : (
                  <span className="text-xl" style={{ color: "#94a3b8" }}>
                    내 일정만 표시
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center justify-end gap-2 mb-4">
          <button
            onClick={() => load()}
            className="rounded-xl px-3 py-2.5 text-sm font-bold"
            style={{
              backgroundColor: "#ffffff",
              color: "#6b7280",
              border: "1px solid #e5e7eb",
            }}>
            ↻
          </button>
          <button
            onClick={handleLogout}
            className="rounded-xl px-3 py-2.5 text-sm font-bold"
            style={{
              backgroundColor: "#ffffff",
              color: "#64748b",
              border: "1px solid #e5e7eb",
            }}>
            🔒
          </button>
          {isAdmin && (
            <button
              onClick={() => openNew()}
              className="border-2 border-transparent rounded-xl px-3 py-2 bg-gradient-to-r from-[#1f66ff] to-[#4f8fff] text-sm font-bold text-white">
              + 접수
            </button>
          )}
        </div>

        {/* 탭 */}
        <div
          className="flex gap-1 mb-5 rounded-xl p-1"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 10px rgba(15,23,42,0.04)",
          }}>
          {(["달력", "비용", "전체", "자재", "통계"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 border-2 border-transparent rounded-xl px-3 py-2 text-m font-semibold transition-all"
              style={{
                background:
                  tab === t
                    ? "linear-gradient(to right, #1f66ff, #4f8fff)"
                    : "transparent",
                color: tab === t ? "white" : "#6b7280",
              }}>
              {t}
              {t === "통계" && reviewPending.length > 0 && (
                <span
                  className="ml-1 text-xs px-0.5 py-0.5 rounded-full"
                  style={{ backgroundColor: "#ef4444", color: "white" }}>
                  {reviewPending.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 검색 */}
        <div className="relative mb-4">
          <span
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none"
            style={{ color: "#94a3b8" }}>
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="이름, 전화번호, 지역, 증상으로 검색"
            style={{
              width: "100%",
              backgroundColor: "#ffffff",
              border: `1px solid ${searchQuery ? "#a9c4ff" : "#f3f4f6"}`,
              borderRadius: 12,
              padding: "10px 36px 10px 38px",
              color: "#1f66ff",
              fontSize: 14,
              outline: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold"
              style={{ backgroundColor: "#dbe3f0", color: "#6b7280" }}>
              ✕
            </button>
          )}
        </div>

        {loading && (
          <div className="text-center py-20" style={{ color: "#94a3b8" }}>
            불러오는 중...
          </div>
        )}

        {/* 탭별 컴포넌트 */}
        {!loading && tab === "달력" && (
          <CalendarTab
            jobs={jobs}
            calYear={calYear}
            calMonth={calMonth}
            setCalYear={setCalYear}
            setCalMonth={setCalMonth}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            calTechFilter={calTechFilter}
            setCalTechFilter={setCalTechFilter}
            isAdmin={isAdmin}
            loggedUser={loggedUser}
            jobsByDate={jobsByDate}
            onUpdate={update}
            onEdit={startEdit}
            onDelete={remove}
            onAddJob={openNew}
            matchSearch={matchSearch}
            searchQuery={searchQuery}
            hasSearchQuery={hasSearchQuery}
          />
        )}

        {!loading && tab === "통계" && (
          <StatsTab
            monthFilter={monthFilter}
            setMonthFilter={setMonthFilter}
            doneMonth={doneMonth}
            revenue={revenue}
            reviewPending={reviewPending}
            isAdmin={isAdmin}
            loggedUser={loggedUser}
            onUpdate={update}
          />
        )}

        {!loading && tab === "비용" && (
          <ExpenseTab
            monthFilter={monthFilter}
            setMonthFilter={setMonthFilter}
            doneMonth={doneMonth}
            revenue={revenue}
            isAdmin={isAdmin}
          />
        )}

        {!loading && tab === "전체" && (
          <ListTab
            filtered={filtered}
            monthFilter={monthFilter}
            setMonthFilter={setMonthFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            techFilter={techFilter}
            setTechFilter={setTechFilter}
            isAdmin={isAdmin}
            loggedUser={loggedUser}
            onUpdate={update}
            onEdit={startEdit}
            onDelete={remove}
          />
        )}

        {!loading && tab === "자재" && (
          <MaterialTab jobs={jobs} isAdmin={isAdmin} />
        )}
      </div>

      {/* 폼 모달 */}
      {showForm && (
        <JobForm
          form={form}
          setForm={setForm}
          editId={editId}
          saving={saving}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}
    </main>
  );
}
