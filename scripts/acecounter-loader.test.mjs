import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const moduleContext = { exports: {} };
vm.runInNewContext(ts.transpileModule(readFileSync("lib/analytics/acecounter.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, moduleContext);
const { aceCounterLoader } = moduleContext.exports;

function browser(existing = {}) {
  const scripts = [], timers = [], warnings = [];
  let now = 1000;
  const context = {
    ...existing,
    m_id: "existing-member", dataLayer: [],
    Date: { now: () => now },
    console: { warn: message => warnings.push(message) },
    document: {
      createElement: () => ({ dataset: {}, remove() { this.removed = true; } }),
      head: { appendChild: script => scripts.push(script) },
    },
    setTimeout: (callback, delay) => timers.push({ callback, delay }),
  };
  context.window = context;
  vm.createContext(context);
  const run = () => vm.runInContext(aceCounterLoader, context);
  function tick(delay) {
    const timer = timers.shift();
    assert.equal(timer?.delay, delay);
    now += delay;
    timer.callback();
  }
  run();
  return { context, scripts, timers, warnings, run, tick, state: context.__restoryAceCounter };
}

test("successful load runs once across repeated initialization", () => {
  const b = browser();
  b.run();
  assert.equal(b.scripts.length, 1);
  const script = b.scripts[0];
  const url = new URL(script.src);
  assert.equal(url.origin + url.pathname, "https://cr.acecounter.com/ac.js");
  assert.equal(url.searchParams.get("gc"), "AZ1A106207");
  assert.equal(url.searchParams.get("py"), "www.restorystudio.co.kr,restorystudio.co.kr,m.restorystudio.co.kr");
  assert.equal(url.searchParams.get("up"), "NaPm_Ncisy");
  assert.equal(script.async, true);
  script.onload();
  b.run();
  assert.equal(b.state.status, "loaded");
  assert.equal(b.scripts.length, 1);
  assert.equal(b.context._AceGID.val.length, 1);
  assert.equal(b.timers.length, 0);
});

test("a failed request is removed and retried once before successful recovery", () => {
  const b = browser();
  b.scripts[0].onerror();
  assert.equal(b.scripts[0].removed, true);
  assert.equal(b.scripts[0].onerror, null);
  assert.equal(b.state.status, "retrying");
  b.run();
  b.tick(1000);
  assert.notEqual(b.scripts[0].src, b.scripts[1].src);
  b.scripts[1].onload();
  b.run();
  assert.equal(b.state.attempts, 2);
  assert.equal(b.state.status, "loaded");
  assert.equal(b.scripts.length, 2);
  assert.equal(b.context._AceGID.val.length, 1);
  assert.equal(b.timers.length, 0);
});

test("two network failures can recover on the final attempt", () => {
  const b = browser();
  b.scripts[0].onerror(); b.tick(1000);
  b.scripts[1].onerror(); b.tick(3000);
  b.scripts[2].onload();
  assert.equal(b.state.status, "loaded");
  assert.equal(b.state.attempts, 3);
  assert.equal(b.timers.length, 0);
  assert.equal(b.warnings.length, 0);
});

test("persistent failure stops after three attempts without affecting analytics globals", () => {
  const b = browser();
  const dataLayer = b.context.dataLayer;
  b.scripts[0].onerror(); b.tick(1000);
  b.scripts[1].onerror(); b.tick(3000);
  b.scripts[2].onerror(); b.run();
  assert.equal(b.state.status, "failed");
  assert.equal(b.scripts.length, 3);
  assert.ok(b.scripts.every(script => script.removed));
  assert.equal(b.timers.length, 0);
  assert.equal(b.warnings.length, 1);
  assert.equal(b.context.dataLayer, dataLayer);
  dataLayer.push(["event", "academy_consult_submit_success", { source_plan: "setup" }]);
  assert.equal(dataLayer.length, 1);
  assert.equal(b.context.m_id, "existing-member");
});

test("a slow request is never raced by a timeout retry", () => {
  const b = browser();
  b.run(); b.run();
  assert.equal(b.state.status, "loading");
  assert.equal(b.scripts.length, 1);
  assert.equal(b.timers.length, 0);
});

test("an already registered account is not initialized again", () => {
  const group = ["restorystudio.co.kr", "", "AZ1A106207"];
  const existing = { o: 1, val: [group] };
  const b = browser({ _AceGID: existing });
  assert.equal(b.state.status, "existing");
  assert.equal(b.context._AceGID, existing);
  assert.equal(b.scripts.length, 0);
});

test("other vendor account registrations are preserved", () => {
  const other = ["another.example", "", "OTHER"];
  const b = browser({ _AceGID: { o: 1, val: [other] } });
  assert.equal(b.context._AceGID.val[0], other);
  assert.equal(b.context._AceGID.val.length, 2);
  assert.equal(b.context._AceGID.o, 2);
  assert.equal(b.scripts.length, 1);
});
