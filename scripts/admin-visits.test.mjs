import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);
const modules = new Map();
function adminModule(name) {
  if (!modules.has(name)) {
    const source = readFileSync(new URL(`../app/admin/lib/${name}.ts`, import.meta.url), "utf8");
    const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
    const exports = {};
    new Function("exports", "require", outputText)(exports, id => id.startsWith("./") ? adminModule(id.slice(2)) : require(id));
    modules.set(name, exports);
  }
  return modules.get(name);
}

const { dailyRevenue, finishedInMonth, jobAmount, technicianBreakdown, productBreakdown } = adminModule("settlement");
const { visitsForJob, visitDone, inQueue } = adminModule("schedule");
const { aftercareVisit } = adminModule("followUp");
const { setExtraTechsInMemo, getVisibleMemo, getJobTechs } = adminModule("jobTechs");
const regular = { id: "one", name: "테스트", phone: "000", region: "현장", symptom: "소파 수리", price: 320000,
  tech: "주담당", memo: setExtraTechsInMemo("출입 메모", ["동행"]), visit_date: "2026-11-30", status: "완료" };
const measured = { ...regular, is_measurement: true, install_completed: false };

test("일간 예상 매출은 오늘 예정과 완료를 합산하고, 완료 매출은 그중 완료한 작업만 잡는다", () => {
  const day = regular.visit_date;
  const tomorrow = "2026-12-01";
  const jobs = [
    { ...regular, status: "배정", price: 180000 },
    { ...regular, price: 100000 },
    { ...measured, visit_date: "2026-11-28", install_date: day, price: 45000 },
    { ...measured, install_date: day, install_completed: true, price: 250000 },
    { ...measured, install_date: null, install_completed: true, install_completed_on: day, price: 12000 },
    { ...regular, status: "대기", price: 0 },
    { ...measured, install_date: tomorrow, price: 66000 },
    { ...regular, visit_date: tomorrow, price: 4000 },
    measured,
    { ...regular, status: "취소" },
    { ...regular, is_aftercare: true },
  ];
  assert.deepEqual(dailyRevenue(jobs, day), { expected: 587000, completed: 362000, expectedCount: 6, completedCount: 3 });
  assert.deepEqual(dailyRevenue(jobs, tomorrow), { expected: 70000, completed: 4000, expectedCount: 2, completedCount: 1 });
  assert.deepEqual(dailyRevenue(jobs, "2026-11-28"), { expected: 0, completed: 0, expectedCount: 0, completedCount: 0 });
  jobs[0].status = "완료";
  assert.deepEqual(dailyRevenue(jobs, day), { expected: 587000, completed: 542000, expectedCount: 6, completedCount: 4 });
});

test("실측 완료와 시공일 저장은 매출을 만들지 않고 시공 완료는 시공월에 한 번 반영된다", () => {
  assert(inQueue(measured, "unscheduled"));
  const planned = { ...measured, install_date: "2026-12-02" };
  assert.equal(inQueue(planned, "unscheduled"), false);
  assert.deepEqual(visitsForJob(planned).map(visitDone), [true, false]);
  for (const job of [measured, planned, { ...planned, install_date: "2026-12-08" }]) {
    for (const month of ["2026-11", "2026-12"]) assert.deepEqual(finishedInMonth([job], month), []);
  }
  const done = { ...planned, install_completed: true };
  assert.equal(finishedInMonth([done], "2026-11").length, 0);
  assert.deepEqual(finishedInMonth([done], "2026-12"), [done]);
  const sameDay = { ...done, install_date: done.visit_date };
  assert.equal(visitsForJob(sameDay).length, 2);
  assert.equal(jobAmount(finishedInMonth([sameDay], "2026-11")), regular.price);
  assert.equal(finishedInMonth([{ ...done, status: "배정" }], "2026-12").length, 0);
  assert.equal(finishedInMonth([regular], "2026-11").length, 1);
});

test("A/S 방문은 완료 일정에 남고 기존 견적이 있어도 매출·품목·기사별 실적에서 제외된다", () => {
  const aftercare = { ...regular, id: "two", is_aftercare: true };
  assert(visitDone(visitsForJob(aftercare)[0]));
  const rows = finishedInMonth([regular, aftercare], "2026-11");
  assert.deepEqual(rows, [regular]);
  assert.equal(jobAmount([regular, aftercare]), regular.price);
  assert.equal(productBreakdown(rows, null)[0].jobs.length, 1);
  const crew = technicianBreakdown(rows);
  assert.equal(crew.find(person => person.name === "주담당").revenue, regular.price);
  assert.equal(crew.find(person => person.name === "동행").revenue, 0);
});

test("시공 일정을 지우면 같은 날 실측도 달력에 남고 실측을 마친 작업만 시공일 미정에 들어간다", () => {
  for (const date of [measured.visit_date, "2026-12-02"]) {
    const planned = { ...measured, visit_time: "09:00", install_date: date, install_time: "14:00" };
    assert.deepEqual(visitsForJob(planned).map(visit => visit.phase), ["visit", "install"]);
    const cleared = { ...planned, install_date: null, install_time: null };
    assert.deepEqual(visitsForJob(cleared), [{ job: cleared, phase: "visit", date: measured.visit_date, time: "09:00" }]);
    assert(inQueue(cleared, "unscheduled"));
    assert.equal(inQueue({ ...cleared, status: "배정" }, "unscheduled"), false);
    assert.equal(finishedInMonth([cleared], date.slice(0, 7)).length, 0);
  }
});

test("완료된 시공 일정을 지워도 원래 시공월 매출에 한 번만 남는다", () => {
  const completed = { ...measured, install_date: null, install_completed: true, install_completed_on: "2026-12-02" };
  assert.deepEqual(visitsForJob(completed).map(visit => visit.phase), ["visit"]);
  assert.equal(inQueue(completed, "unscheduled"), false);
  assert.equal(finishedInMonth([completed], "2026-11").length, 0);
  assert.deepEqual(finishedInMonth([completed], "2026-12"), [completed]);
  assert.equal(jobAmount(finishedInMonth([completed], "2026-12")), measured.price);
  assert.equal(finishedInMonth([{ ...completed, install_completed: false }], "2026-12").length, 0);
});

test("복사한 A/S는 독립된 방문이며 재방문도 최초 작업에 연결된다", () => {
  const source = { ...measured, as_until: "2027-12-02", completion_photo: "before", install_completed: true, install_date: "2026-12-02" };
  const draft = { id: "two", date: "2026-12-16", time: "", tech: source.tech, memo: "요청 내용" };
  const visit = aftercareVisit(source, draft);
  assert.equal(visit.id, draft.id);
  for (const field of ["name", "phone", "region", "symptom", "tech"]) assert.equal(visit[field], source[field]);
  assert.deepEqual(getJobTechs(visit), getJobTechs(source));
  assert.equal(getVisibleMemo(visit.memo), draft.memo);
  assert.equal(visit.aftercare_source_id, source.id);
  assert.equal(visit.price, 0);
  assert.equal(visit.is_aftercare, true);
  assert.equal(visit.visit_time, null);
  assert.equal(visit.status, "배정");
  for (const field of ["completion_photo", "install_date", "install_completed", "as_until"]) assert.equal(visit[field], undefined);
  assert.equal(aftercareVisit(visit, { ...draft, id: "three" }).aftercare_source_id, source.id);
  assert.equal(source.price, 320000);
});
