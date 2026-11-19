import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function load(file, imports = {}, globals = {}) {
  const js = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX,
  } }).outputText;
  const context = { exports: {}, URL, URLSearchParams, ...globals, require: id => {
    if (!(id in imports)) throw new Error(`Unexpected dependency/network boundary: ${id}`);
    return imports[id];
  } };
  vm.runInNewContext(js, context, { filename: file });
  return context.exports;
}
const logic = load("lib/service-analytics.ts");
const plain = value => JSON.parse(JSON.stringify(value));

test("strict contact allowlist accepts existing redirects/direct links, not lookalike domains", () => {
  const origin = "https://www.restorystudio.co.kr";
  for (const [url, channel] of [["/go/kakao?cta=hero", "kakao"], ["/go/phone", "phone"], ["tel:1688-2957", "phone"], ["http://pf.kakao.com/channel/chat", "kakao"]]) {
    assert.equal(logic.contactChannel(url, origin), channel);
  }
  for (const url of ["https://evil.test/go/kakao", "https://pf.kakao.com.evil.test/x", "/go/kakao-fake", "javascript:alert(1)", "https://blog.naver.com/photo"]) assert.equal(logic.contactChannel(url, origin), null);
});

test("canonical names are allowlisted and no query or hash is retained", () => {
  assert.equal(logic.serviceForSlug("sofa-sagging"), "sofa-sag");
  assert.equal(logic.serviceId("01012345678"), null);
  assert.equal(logic.sectionId("customer name"), null);
  assert.equal(logic.cleanPagePath("/kitchen/sink-door?phone=01012345678#name"), "/kitchen/sink-door");
  assert.equal(logic.cleanPagePath("/kitchen/" + encodeURIComponent("서울-싱크대-문짝-교체")), "/kitchen/서울-싱크대-문짝-교체");
});

test("production, QA, local and preview are distinct", () => {
  assert.equal(logic.trafficClass("www.restorystudio.co.kr", false), "production");
  assert.equal(logic.trafficClass("restorystudio.co.kr", true), "qa");
  assert.equal(logic.trafficClass("localhost", false), "local");
  assert.equal(logic.trafficClass("branch.vercel.app", false), "preview");
  assert.equal(logic.trafficClass("www.restorystudio.co.kr.evil.test", false), "preview");
});

test("section progression is once per viewed section; skipped sections are never invented", () => {
  const visit = logic.createVisit("/kitchen/sink-door"), events = [];
  const send = (name, p) => events.push([name, plain(p)]);
  logic.recordSection(visit, { id: "hero", order: 1 }, send);
  logic.recordSection(visit, { id: "faq", order: 9 }, send);
  logic.recordSection(visit, { id: "hero", order: 1 }, send);
  logic.recordContact(visit, "kakao", "fixed", null, 1, send);
  logic.recordContact(visit, "kakao", "fixed", null, 2, send);
  assert.equal(events.filter(e => e[0] === "service_section_view").length, 2);
  assert.deepEqual(events.filter(e => e[0] === "service_section_progress").map(e => [e[1].section_id,e[1].progress_type,e[1].next_section_id]), [["hero","later_section","faq"],["faq","contact_click","contact_click"]]);
  assert.equal(events.filter(e => e[0] === "service_contact_click").length, 1);
  logic.recordContact(visit, "kakao", "fixed", null, 1002, send);
  assert.equal(events.filter(e => e[0] === "service_contact_click").length, 2);
});

// Execute the actual React effect against a deterministic DOM/clock. All analytics
// is captured in-memory; no HTTP, DB, redirects, Kakao messages or calls exist here.
function browser({ hostname = "www.restorystudio.co.kr", search = "", storedQa = false, pathname = "/kitchen/sink-door", failStorage = false, throwAnalytics = false } = {}) {
  let time = 0, id = 0, effect, cleanup, observer, mutation;
  const timers = new Map(), events = [], listeners = new Map(), ref = { current: null };
  const storage = new Map(storedQa ? [[logic.QA_STORAGE_KEY, "1"]] : []);
  class Element {
    constructor(dataset = {}) { this.dataset = dataset; this.isConnected = true; this.rect = { left: 0, right: 300, top: 140, bottom: 190, width: 300, height: 50 }; }
    getBoundingClientRect() { return this.rect; }
    querySelector() { return this.heading; }
    closest(selector) {
      if (selector === "a[href]") return this.href ? this : this.link ?? null;
      if (selector === '[data-service-cta-location="fixed"]') return this.fixed ? this : null;
      if (selector === "header,nav") return this.header ? this : null;
      if (selector === "footer") return this.footer ? this : null;
      return this.section ?? null;
    }
    getAttribute(name) { return name === "href" ? this.href : null; }
  }
  const section = name => { const e = new Element({ serviceSection: name }); e.heading = new Element(); return e; };
  let sectionElements = [section("hero"), section("cases"), section("budget"), section("faq")];
  const root = new Element({ serviceId: "sink-door" });
  root.querySelectorAll = () => sectionElements;
  const document = {
    visibilityState: "visible", referrer: "https://example.com/private?email=secret@example.com",
    querySelector: () => root,
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: (name, fn) => { if (listeners.get(name) === fn) listeners.delete(name); },
  };
  const window = { innerWidth: 390, innerHeight: 844, location: { hostname, origin: `https://${hostname}`, search } };
  const globals = {
    window, document, Element, performance: { now: () => time },
    sessionStorage: { getItem: key => { if (failStorage) throw new Error("blocked"); return storage.get(key); }, setItem: (key, value) => { if (failStorage) throw new Error("blocked"); storage.set(key, value); } },
    setTimeout: (fn, delay) => { const key = ++id; timers.set(key, { fn, at: time + delay }); return key; },
    clearTimeout: key => timers.delete(key),
    IntersectionObserver: class { constructor(cb, options) { observer = { cb, options, targets: new Set() }; } observe(e) { observer.targets.add(e); } unobserve(e) { observer.targets.delete(e); } disconnect() { observer.targets.clear(); } },
    MutationObserver: class { constructor(cb) { mutation = cb; } observe() {} disconnect() {} },
  };
  const component = load("app/components/ServiceAnalytics.tsx", {
    react: { useRef: () => ref, useEffect: fn => { effect = fn; } },
    "next/navigation": { usePathname: () => pathname },
    "@next/third-parties/google": { sendGAEvent: (...args) => { if (throwAnalytics) throw new Error("offline"); events.push(plain(args)); } },
    "@/lib/service-analytics": logic,
  }, globals).default;
  component(); cleanup = effect();
  return {
    events, timers, document, window, storage, root, sectionElements,
    advance(ms) { time += ms; for (const [key, timer] of [...timers]) if (timer.at <= time) { timers.delete(key); timer.fn(); } },
    intersect(index, ratio) { const target = sectionElements[index].heading; observer.cb([{ target, isIntersecting: ratio > 0, intersectionRatio: ratio }]); },
    visibility(value) { document.visibilityState = value; listeners.get("visibilitychange")?.(); },
    click({ href = "/go/kakao?cta=private-value", fixed = false, index = 0, type = "click", button = 0 } = {}) {
      const link = new Element(); link.href = href; link.fixed = fixed; link.section = fixed ? null : sectionElements[index];
      const event = { target: link, type, button, preventDefault() { throw new Error("navigation must not be intercepted"); } };
      listeners.get(type)?.(event);
    },
    remount() { cleanup?.(); cleanup = effect(); },
    navigate(path) { cleanup?.(); pathname = path; component(); cleanup = effect(); },
    replaceHeading(index) { sectionElements[index].heading = new Element(); mutation(); },
    cleanup() { cleanup?.(); },
  };
}
const named = (b, name) => b.events.filter(e => e[1] === name);

test("50% visibility requires one continuous second; leaving and tab hiding reset dwell", () => {
  const b = browser();
  b.intersect(0, .49); b.advance(1200); assert.equal(named(b,"service_section_view").length, 0);
  b.intersect(0, .5); b.advance(999); assert.equal(named(b,"service_section_view").length, 0);
  b.intersect(0, 0); b.advance(1); assert.equal(named(b,"service_section_view").length, 0);
  b.intersect(0, .5); b.advance(900); b.visibility("hidden"); b.advance(2000);
  assert.equal(named(b,"service_section_view").length, 0);
  b.visibility("visible"); b.advance(1000); assert.equal(named(b,"service_section_view").length, 1);
  b.intersect(0, 0); b.intersect(0, 1); b.advance(1500); assert.equal(named(b,"service_section_view").length, 1);
});

test("geometry is rechecked at timer expiry and detached nodes cannot qualify", () => {
  const b=browser(); b.intersect(0,1); b.sectionElements[0].heading.isConnected=false; b.advance(1000);
  assert.equal(named(b,"service_section_view").length,0);
});

test("Strict Mode, heading replacement and route rerender do not duplicate one visit", () => {
  const b=browser(); b.intersect(0,1); b.advance(1000); b.remount();
  b.replaceHeading(0); b.intersect(0,1); b.advance(1000);
  assert.equal(named(b,"service_landing_view").length,1);
  assert.equal(named(b,"service_section_view").length,1);
  b.navigate("/kitchen/another-valid-landing");
  assert.equal(named(b,"service_landing_view").length,2);
  b.navigate("/academy");
  b.navigate("/kitchen/another-valid-landing");
  assert.equal(named(b,"service_landing_view").length,3);
});

test("clicks distinguish body/fixed and phone/kakao, preserve navigation and deduplicate", () => {
  const b=browser(); b.intersect(1,1); b.advance(1000);
  b.click(); b.click(); b.click({href:"/go/phone",fixed:true});
  b.click({href:"http://pf.kakao.com/channel/chat",fixed:true,type:"auxclick",button:1});
  const clicks=named(b,"service_contact_click");
  assert.deepEqual(clicks.map(e=>[e[2].channel,e[2].cta_location]),[["kakao","body"],["phone","fixed"],["kakao","fixed"]]);
  assert.equal(clicks[1][2].last_section_id,"cases");
  assert.equal(clicks[0][2].section_id,"hero");
  b.navigate("/go/phone"); b.click({href:"tel:1688-2957"});
  assert.equal(named(b,"service_contact_click").length,3);
});

test("GA4 payloads contain no query, form data, text labels, phone numbers, or full referrers", () => {
  const b=browser({search:"?phone=01012345678&name=secret"}); b.click();
  const serialized=JSON.stringify(b.events);
  for(const value of ["01012345678","secret","private-value","private?","1688"]) assert.equal(serialized.includes(value),false);
  const p=named(b,"service_contact_click")[0][2];
  assert.equal(p.page_location,"https://www.restorystudio.co.kr/kitchen/sink-door");
  assert.equal(p.page_referrer,"https://example.com");
  assert.ok(Object.keys(p).length<=25);
});

for (const options of [{hostname:"localhost"},{hostname:"branch.vercel.app"},{search:"?analytics_qa=1"},{storedQa:true},{pathname:"/academy"},{pathname:"/academy/consult"},{pathname:"/admin"},{pathname:"/go/kakao"}]) {
  test(`no production service events: ${JSON.stringify(options)}`,()=>{const b=browser(options);b.click();assert.equal(b.events.length,0);});
}
test("blocked storage or analytics failures never break a contact",()=>{
  const b=browser({failStorage:true}); b.click(); assert.equal(named(b,"service_contact_click").length,1);
  const offline=browser({throwAnalytics:true}); assert.doesNotThrow(()=>offline.click());
});
test("cleanup removes timers and listeners",()=>{
  const b=browser(); b.intersect(0,1); b.cleanup(); b.advance(1000); b.click();
  assert.equal(named(b,"service_section_view").length,0); assert.equal(named(b,"service_contact_click").length,0);
});
