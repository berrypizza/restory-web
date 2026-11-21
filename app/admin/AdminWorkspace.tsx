"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { Job } from "./lib/types";
import type { Tech } from "./lib/constants";
import { formatFullDate, thisYearMonth, today } from "./lib/utils";
import { inQueue, workQueues, workStatus, type QueueField, type VisitPhase, type WorkStatus } from "./lib/schedule";
import { getJobTechs, getVisibleMemo, jobHasTech } from "./lib/jobTechs";
import { useJobs, emptyForm, formFromJob } from "./hooks/useJobs";
import AdminNavigation, { destinations } from "./components/AdminNavigation";
import AdminIcon from "./components/AdminIcon";
import JobForm from "./components/JobForm";
import HomeTab from "./tabs/HomeTab";
import CalendarTab from "./tabs/CalendarTab";
import loadComponent from "next/dynamic";
import type { ReportView } from "./tabs/StatsTab";
import ListTab from "./tabs/ListTab";
import s from "./workspace.module.css";

const StatsTab = loadComponent(() => import("./tabs/StatsTab"), {
  loading: () => <p role="status" className={s.loading}>집계를 불러오는 중…</p>,
});

function subscribeTab(notify: () => void) {
  window.addEventListener("hashchange", notify);
  return () => window.removeEventListener("hashchange", notify);
}
const readTab = () => window.location.hash.slice(1);
const defaultTab = () => "home";
function subscribeDay(notify: () => void) {
  const timer = window.setInterval(notify, 60_000);
  document.addEventListener("visibilitychange", notify);
  return () => {
    window.clearInterval(timer);
    document.removeEventListener("visibilitychange", notify);
  };
}
const normalize = (value: unknown) =>
  String(value ?? "")
    .replace(/[\s-]/g, "")
    .toLowerCase();

export default function AdminWorkspace({ user, isAdmin, onLogout }: { user: Tech; isAdmin: boolean; onLogout: () => void }) {
  const requestedTab = useSyncExternalStore(subscribeTab, readTab, defaultTab);
  const currentDay = useSyncExternalStore(subscribeDay, today, today);
  const reportViews: ReportView[] = isAdmin ? ["stats", "expenses", "analysis", "reviews"] : ["stats", "reviews"];
  const reportView = reportViews.find(view => view === requestedTab);
  const queue = requestedTab === "unscheduled" || (isAdmin && requestedTab === "unassigned")
    ? requestedTab : undefined;
  const destinationId = reportView ? "stats" : queue ? "jobs" : requestedTab;
  const destination = destinations.find(item => item.id === destinationId) ?? destinations[0];
  const tab = destination.id;
  const title = tab === "stats" && !isAdmin ? "내 실적" : destination.label;
  const roleFilter = isAdmin ? "전체" : user;
  const [techFilter, setTechFilter] = useState<Tech | "전체">(roleFilter);
  const [calTechFilter, setCalTechFilter] = useState<Tech | "전체">(roleFilter);
  const [statusFilter, setStatusFilter] = useState<WorkStatus>("전체");
  const [listMonth, setListMonth] = useState(thisYearMonth);
  const [reportMonth, setReportMonth] = useState(thisYearMonth);
  const [selectedDay, setSelectedDay] = useState(today);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [original, setOriginal] = useState<Job | null>(null);
  const [editPhase, setEditPhase] = useState<VisitPhase>("visit");
  const [initialField, setInitialField] = useState<QueueField>();
  const [saveError, setSaveError] = useState("");
  const [form, setForm] = useState(() => emptyForm());
  const [focusJob, setFocusJob] = useState<{ id: string; phase: VisitPhase } | null>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const searchRequested = useRef(false);
  const [saving, setSaving] = useState(false);
  const [saveNotice, setSaveNotice] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const pageKey = queue ?? tab;
  const previousTab = useRef<string>(pageKey);
  const { jobs, hasData, loadError, refreshing, load, update, remove, save, reviewPending } = useJobs();

  useEffect(() => {
    if (tab === "jobs" && hasData && searchRequested.current) {
      searchRequested.current = false;
      window.scrollTo({ top: 0, behavior: "instant" });
      searchInput.current?.focus({preventScroll: true});
    } else if (previousTab.current !== pageKey) {
      window.scrollTo({ top: 0, behavior: "instant" });
      heading.current?.focus({ preventScroll: true });
    }
    if (tab !== "jobs") searchRequested.current = false;
    previousTab.current = pageKey;
  }, [hasData, pageKey, tab]);

  useEffect(() => {
    if (tab !== "calendar" || !focusJob) return;
    const target = document.getElementById(`schedule-${focusJob.id}-${focusJob.phase}`);
    if (!target) return;
    const frame = window.requestAnimationFrame(() => {
      target.focus({preventScroll:true});
      target.scrollIntoView({block: "nearest",behavior: "instant"});
      setFocusJob(null);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [focusJob, jobs, tab]);

  useEffect(() => {
    if (!saveNotice) return;
    const timer = window.setTimeout(() => setSaveNotice(""), 4500);
    return () => window.clearTimeout(timer);
  }, [saveNotice]);

  function startEdit(job: Job, phase: VisitPhase = "visit", field?: QueueField) {
    setEditPhase(phase);
    setInitialField(field);
    setSaveError("");
    setSaveNotice("");
    setForm(formFromJob(job));
    setOriginal(job);
    setShowForm(true);
  }
  function openNew() {
    setSaveNotice("");
    setInitialField(undefined);
    setSaveError("");
    setForm(emptyForm(tab === "calendar" ? selectedDay : today()));
    setOriginal(null);
    setShowForm(true);
  }
  function showDay(date: string) {
    setCalTechFilter(roleFilter);
    setSelectedDay(date);
    setFocusJob(null);
    if (tab !== "calendar") window.location.hash = "calendar";
  }
  function showInCalendar(jobId: string, date: string, phase: VisitPhase = "visit") {
    showDay(date);
    setFocusJob({ id: jobId, phase });
  }
  const closeForm = () => {
    setShowForm(false);
    setOriginal(null);
  };
  async function handleSave() {
    if (saving) return;
    setSaving(true);
    setSaveError("");
    try {
      await save(form, original, (id) => {
        closeForm();
        const showInstall = original && editPhase === "install" && form.install_date && (form.is_measurement || form.visit_date !== form.install_date) ? form.install_date : null;
        showInCalendar(id, showInstall || form.visit_date, showInstall ? "install" : "visit");
        setSaveNotice(original ? "일정을 수정했어요." : "일정을 등록했어요.");
      }, setSaveError);
    } finally {
      setSaving(false);
    }
  }
  const query = normalize(searchQuery);
  const matchSearch = (job: Job) =>
    !query ||
    [
      job.name,
      job.phone,
      job.region,
      job.symptom,
      getVisibleMemo(job.memo),
      ...getJobTechs(job),
      job.visit_date,
      job.install_date,
    ].some((value) => normalize(value).includes(query));

  const visibleJobs = useMemo(() => isAdmin ? jobs : jobs.filter(j => jobHasTech(j, user)), [isAdmin, jobs, user]);
  const visibleReviews = isAdmin ? reviewPending : reviewPending.filter((j) => jobHasTech(j, user));
  const filtered = tab === "jobs" ? visibleJobs.filter(j => {
    if (queue) return inQueue(j, queue) && matchSearch(j);
    return (query || j.visit_date?.startsWith(listMonth) || j.install_date?.startsWith(listMonth)) &&
      (statusFilter === "전체" || workStatus(j) === statusFilter) && jobHasTech(j, techFilter) && matchSearch(j);
  }) : [];
  function resetList() {
    setStatusFilter("전체");
    setTechFilter(roleFilter);
    setSearchQuery("");
  }
  function searchJobs() {
    resetList();
    if (tab === "calendar") setTechFilter(calTechFilter);
    searchRequested.current = true;
    window.location.hash = "jobs";
  }

  return (
    <div className={s.workspace}>
      <a
        className={s.skip}
        href="#admin-main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("admin-main")?.focus();
        }}
      >
        본문으로 이동
      </a>
      <AdminNavigation active={tab} name={user} isAdmin={isAdmin} onLogout={onLogout} onRefresh={() => void load()} refreshing={refreshing} />
      <main id="admin-main" tabIndex={-1} className={s.main}>
        <div className={s.inner}>
          <header className={s.pageHead}>
            <div>
              <h1 ref={heading} tabIndex={-1}>
                {title}
              </h1>
              {tab === "home" && <p className={s.date}>{formatFullDate(currentDay)} · {isAdmin ? "전체 기사" : user + " 기사"}</p>}
            </div>
            <div className={s.tools}>
              {(tab === "calendar" || tab === "home") && (
                <button type="button" className={s.searchLink} aria-label="작업 검색" title="작업 검색" onClick={searchJobs}>
                  <AdminIcon name="search" size={18} /><span>작업 검색</span>
                </button>
              )}
              {tab !== "stats" && isAdmin && <button type="button" className={s.primary} onClick={openNew}><AdminIcon name="plus" size={18} />일정 등록</button>}
            </div>
          </header>

          {loadError && (
            <div className={s.error} role="alert">
              <div>
                <strong>일정을 불러오지 못했어요</strong>
                <p>
                  {hasData
                    ? "마지막으로 불러온 일정을 표시하고 있어요."
                    : "연결 상태를 확인하고 다시 시도해 주세요."}
                </p>
              </div>
              <button type="button" onClick={() => void load()} disabled={refreshing}>
                다시 시도
              </button>
            </div>
          )}
          {!hasData && !loadError && (
            <p role="status" className={s.loading}>
              일정을 불러오는 중…
            </p>
          )}
          {hasData && (
            <>
              {tab === "home" && (
                <HomeTab jobs={visibleJobs} day={currentDay} isAdmin={isAdmin} reviews={visibleReviews.length}
                  onVisit={showInCalendar} onDay={showDay} onQueue={resetList} />
              )}
              {tab === "jobs" && (
                <div className={s.search} role="search">
                  <AdminIcon name="search" size={20} />
                  <input
                    ref={searchInput}
                    type="search"
                    aria-label={queue ? workQueues[queue].label + " 작업 검색" : "전체 기간 작업 검색"}
                    placeholder={queue ? "이 목록에서 고객명, 연락처, 주소 검색" : "전체 기간에서 고객명, 연락처, 주소, 품목 검색"}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      className={s.square}
                      type="button"
                      aria-label="검색어 지우기"
                      onClick={() => {
                        setSearchQuery("");
                        searchInput.current?.focus();
                      }}
                    >
                      <AdminIcon name="close" size={16} />
                    </button>
                  )}
                </div>
              )}

              {tab === "calendar" && (
                <CalendarTab
                  jobs={visibleJobs}
                  selectedDay={selectedDay}
                  onSelectDay={setSelectedDay}
                  calTechFilter={calTechFilter}
                  setCalTechFilter={setCalTechFilter}
                  isAdmin={isAdmin}
                  loggedUser={user}
                  onUpdate={update}
                  onEdit={startEdit}
                  onDelete={remove}
                />
              )}
              {tab === "jobs" && (
                <ListTab
                  key={JSON.stringify([queue, query, listMonth, statusFilter, techFilter])}
                  filtered={filtered}
                  monthFilter={listMonth}
                  setMonthFilter={setListMonth}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  techFilter={techFilter}
                  setTechFilter={setTechFilter}
                  isAdmin={isAdmin}
                  loggedUser={user}
                  onEdit={startEdit}
                  queue={queue}
                  onReset={resetList}
                  onShowSchedule={showInCalendar}
                  hasSearchQuery={Boolean(query)}
                />
              )}
              {tab === "stats" && (
                <StatsTab monthFilter={reportMonth} setMonthFilter={setReportMonth} jobs={visibleJobs} isAdmin={isAdmin} loggedUser={user} reviewPending={visibleReviews} onUpdate={update} view={reportView ?? "stats"} />
              )}
            </>
          )}
        </div>
      </main>
      <div role="status" className={s.saveNotice}>
        {saveNotice}
      </div>
      {showForm && (
        <JobForm
          form={form}
          setForm={setForm}
          editId={original?.id ?? null}
          initialField={initialField}
          saveError={saveError}
          saving={saving}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}
    </div>
  );
}
