import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

function loadSource(path, dependencies = {}) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const exports = {};
  new Function("exports", "require", outputText)(exports, id => dependencies[id]);
  return exports;
}
const data = loadSource("../lib/case-data.tsx");
const { browseCases, listHref, caseDate, relatedTo } = loadSource("../app/cases/case-browser.ts", {
  "@/lib/case-data": data, "@/lib/public-case-text": loadSource("../lib/public-case-text.ts"),
});

test("기존 사례 주소와 모든 페이지가 실제 작업 날짜순으로 이어진다", () => {
  const all = browseCases({});
  const collected = Array.from({ length: all.totalPages }, (_, idx) => browseCases({ page: String(idx + 1) }).items).flat();
  assert.equal(new Set(collected.map(item => item.id)).size, data.cases.length);
  const dates = collected.map(item => caseDate(item.date));
  assert.deepEqual(dates, [...dates].sort().reverse());
  assert.equal(caseDate("2026-4-16"), "2026-04-16");
  for (const page of ["0", "-2", "1.5", "abc"]) assert.equal(browseCases({ page }).page, 1);
  assert.equal(browseCases({ page: "9999" }).page, all.totalPages);
});

test("지역·증상·분야·태그를 함께 검색하고 같은 목록 주소로 돌아갈 수 있다", () => {
  const sample = data.cases.find(item => item.id === "case-128");
  const params = { q: "  인천   처짐 ", cat: sample.category, tag: sample.tags[0] };
  const { matches, filters } = browseCases(params);
  assert(matches.some(item => item.id === sample.id));
  assert(matches.every(item => item.category === sample.category && item.tags.includes(params.tag)));
  assert.deepEqual(browseCases(Object.fromEntries(new URL(listHref(filters), "https://example.com").searchParams)).matches, matches);
  assert.deepEqual(browseCases({ ...params, cat: "가죽 리폼" }).matches, []);
  assert.deepEqual(browseCases({ q: "인천 쇼파" }).matches, browseCases({ q: "인천 소파" }).matches);
  assert.deepEqual(browseCases({ q: "!!!" }).matches, []);
  assert.deepEqual(browseCases({ tag: "없는 태그" }).matches, []);
});

test("관련 작업에는 현재 사례가 중복되지 않고 같은 세부 작업이 먼저 나온다", () => {
  for (const item of data.cases) {
    const { similar, other } = relatedTo(item);
    assert(similar.every(row => row.id !== item.id && row.parentCategory === item.parentCategory));
    assert(other.every(row => row.parentCategory !== item.parentCategory));
    assert.equal(new Set(other.map(row => row.parentCategory)).size, other.length);
    if (data.cases.some(row => row.id !== item.id && row.category === item.category)) assert.equal(similar[0].category, item.category);
  }
});
