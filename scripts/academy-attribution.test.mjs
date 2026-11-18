import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const plain = value => JSON.parse(JSON.stringify(value));
function load(file, imports = {}, globals = {}) {
  const source = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const context = { exports: {}, require: name => name in imports ? imports[name] : require(name), URLSearchParams, ...globals };
  vm.runInNewContext(source, context, { filename: file });
  return context.exports;
}
const offer = load("lib/academy/offer.ts");
const attribution = load("lib/academy/attribution.ts", { "./offer": offer });
const consultation = load("lib/academy/consultation.ts");
const videoAttribution = load("lib/academy/video-attribution.ts");
const sources = [
  ["basic", "basic"], ["premium", "setup"], ["hero", "undecided"],
  ["nav", "undecided"], ["curriculum", "undecided"], ["mobile", "undecided"],
  ["video", "undecided"],
];
const parse = query => attribution.readAcademyAttribution(new URLSearchParams(query));
function nodes(node, predicate) {
  if (!node || typeof node !== "object") return [];
  return [...(predicate(node) ? [node] : []), ...[node.props?.children].flat(Infinity).flatMap(child => nodes(child, predicate))];
}
function courseContext(tree) {
  const note = nodes(tree, n => n.props?.role === "note" && n.props["aria-label"] === "관심 과정")[0];
  return nodes(note, n => n.type === "strong")[0]?.props.children ?? null;
}

function cta(location, events, video = null) {
  return load("app/academy/EnrollmentDialog.tsx", {
    "next/link": { default: () => null }, "@/lib/academy/offer": offer,
    "@/lib/academy/attribution": attribution,
    "@/lib/academy/video-attribution": videoAttribution,
    "@/lib/academy/video-store": { useAcademyVideoRecord: () => video },
    "@/lib/academy/analytics": { trackAcademy: (...args) => events.push(args) },
    "./gisal.module.css": { default: {} },
  }).EnrollButton({ location });
}

// Run the real component handlers and effects with a minimal hook lifecycle.
// No network or database writes: only the existing RPC boundary is replaced.
function form(query, { rpc = async () => ({ error: null }), events = [] } = {}) {
  const source = parse(query);
  const states = [], refs = [], deps = [], effects = [];
  let stateIndex, refIndex, effectIndex, pendingEffects, tree, calls = 0;
  const react = {
    useState(initial) {
      const i = stateIndex++;
      if (!(i in states)) states[i] = typeof initial === "function" ? initial() : initial;
      return [states[i], next => { states[i] = typeof next === "function" ? next(states[i]) : next; }];
    },
    useRef(initial) {
      const i = refIndex++;
      return refs[i] ??= { current: initial };
    },
    useEffect(effect, nextDeps) {
      const i = effectIndex++;
      if (!deps[i] || nextDeps.some((value, j) => !Object.is(value, deps[i][j]))) pendingEffects.push(effect);
      deps[i] = nextDeps; effects[i] = effect;
    },
  };
  const component = load("app/academy/consult/ConsultationForm.tsx", {
    react, "next/link": () => null, "@/lib/academy/offer": offer,
    "@/lib/academy/consultation": consultation,
    "@/lib/academy/video-attribution": videoAttribution,
    "@/lib/academy/analytics": { trackAcademy: (...args) => events.push(args) },
    "@/lib/community/client": { communityClient: () => ({ rpc: async (...args) => { calls++; return rpc(...args); } }) },
    "./consult.module.css": { default: {} },
  }, { crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000001" }, requestAnimationFrame: () => {} }).default;
  function render() {
    stateIndex = refIndex = effectIndex = 0; pendingEffects = [];
    tree = component({ attribution: source, videoContext: videoAttribution.readVideoAttribution(new URLSearchParams(query)) });
    for (const effect of pendingEffects) effect();
    return tree;
  }
  function button(text) { return nodes(tree, n => n.type === "button" && JSON.stringify(n.props.children).includes(text))[0]; }
  function input(name, value) { return nodes(tree, n => n.type === "input" && n.props.name === name && (value === undefined || n.props.value === value))[0]; }
  function choose(name, value) { input(name, value).props.onChange({ target: { value } }); render(); }
  function field(name, value) { input(name).props.onChange({ target: { value } }); render(); }
  function next(text) { button(text).props.onClick(); render(); }
  function ready({ phone = "010-0000-0000", consent = true, kind = "online" } = {}) {
    choose("consultation-type", kind); next("다음");
    choose("situation", "employee"); choose("repair_experience", "beginner"); choose("marketing_experience", "beginner"); next("연락처 입력");
    for (const [key, value] of Object.entries({ name: "자동 테스트", phone, region: "테스트 지역", age_range: "30", available_time: "평일 오후" })) field(key, value);
    input("consent").props.onChange({ target: { checked: consent } }); render();
  }
  render();
  return {
    events, source, render, ready, button, choose, next,
    get tree() { return tree; }, calls: () => calls,
    replayEffects: () => effects.forEach(effect => effect()),
    submit: () => nodes(tree, n => n.type === "form")[0].props.onSubmit({ preventDefault() {} }),
  };
}

for (const [location, plan] of sources) {
  test(`${location}: CTA → start → all three steps → confirmed success retains ${plan}`, async () => {
    const events = [];
    const link = cta(location, events);
    const url = new URL(link.props.href, "https://www.restorystudio.co.kr");
    assert.equal(url.pathname, "/academy/consult");
    link.props.onClick();
    let resolve, submittedPayload;
    const pending = new Promise(r => { resolve = r; });
    const f = form(url.search, { events, rpc: (name, data) => {
      assert.equal(name, "submit_academy_consultation"); submittedPayload = data; return pending;
    } });
    const expectedContext = plan === "basic" ? "기본 과정" : plan === "setup" ? offer.ACADEMY_OFFER.setupName : null;
    assert.equal(courseContext(f.tree), expectedContext);
    f.replayEffects(); // React Strict Mode must not duplicate initial view events.
    f.ready();
    assert.equal(courseContext(f.tree), expectedContext);
    const first = f.submit(); await f.submit();
    assert.equal(f.calls(), 1);
    assert.equal(events.filter(([event]) => event === "academy_consult_start").length, 1);
    assert.deepEqual(events.filter(([event]) => event === "academy_consult_step_view").map(([, props]) => props.step), [1, 2, 3]);
    assert.ok(!events.some(([event]) => event.endsWith("submit_success")));
    resolve({ error: null }); await first; f.render();
    assert.equal(courseContext(f.tree), expectedContext);
    assert.equal(events.filter(([event]) => event.endsWith("submit_success")).length, 1);
    assert.ok(nodes(f.tree, n => n.type === "h1" && n.props.children === "상담 신청이 접수되었습니다.").length);
    for (const [, props] of events) {
      assert.equal(props.source_plan, plan); assert.equal(props.source_cta, location);
      assert.equal(props.intro_video_state, "not_started"); assert.equal(props.brothers_video_state, "not_started");
      assert.ok(Object.keys(props).every(key => ["source_plan", "source_cta", "location", "plan", "step", "consultation_type", "intro_video_state", "brothers_video_state"].includes(key)));
    }
    if (["basic", "premium"].includes(location)) {
      assert.equal(events[0][0], "academy_plan_cta_click"); assert.equal(events[0][1].plan, location);
    }
    assert.deepEqual(Object.keys(submittedPayload.p_data).sort(), ["name", "phone", "email", "region", "age_range", "repair_experience", "marketing_experience", "available_time", "message", "website", "consultation_type", "situation", "consent", "consent_version"].sort());
    assert.equal(submittedPayload.p_data.repair_experience, "beginner");
    assert.equal(submittedPayload.p_data.marketing_experience, "beginner");
  });
}

test("reload/new tabs keep URL attribution; generic/direct visits never inherit a prior plan", () => {
  const query = new URL(attribution.consultationHref("premium"), "https://example.test").search;
  assert.equal(form(query).source.source_plan, "setup");
  assert.equal(form(query).source.source_plan, "setup");
  assert.equal(form("").source.source_plan, "direct");
  assert.equal(form("source_plan=undecided&source_cta=mobile").source.source_plan, "undecided");
});

test("missing, mismatched, duplicate, unknown and arbitrary parameter values are not forwarded", () => {
  for (const query of ["", "source_plan=basic", "source_cta=basic", "source_plan=setup&source_cta=basic", "source_plan=basic&source_cta=unknown", "source_plan=basic&source_cta=basic&source_plan=setup", "source_plan=basic&source_cta=basic&source_cta=basic", "source_plan=person@example.test&source_cta=basic"]) {
    assert.deepEqual(plain(parse(query)), { source_plan: "direct", source_cta: "direct" });
    assert.equal(courseContext(form(query).tree), null);
  }
  assert.deepEqual(plain(parse("source_plan=basic&source_cta=basic&email=person@example.test")), { source_plan: "basic", source_cta: "basic" });
});

test("query changes remount the form only when the validated entry source changes", () => {
  let query = "source_plan=basic&source_cta=basic";
  const entry = load("app/academy/consult/ConsultationEntry.tsx", {
    react: { useMemo: fn => fn() },
    "@/lib/academy/video-attribution": videoAttribution,
    "next/navigation": { useSearchParams: () => new URLSearchParams(query) },
    "@/lib/academy/attribution": attribution, "./ConsultationForm": { default: () => null },
  }).default;
  const basic = entry();
  query += "&utm_source=test";
  assert.equal(entry().key, basic.key);
  query = "source_plan=setup&source_cta=premium";
  assert.notEqual(entry().key, basic.key); assert.equal(entry().props.attribution.source_plan, "setup");
  query = ""; assert.equal(entry().props.attribution.source_plan, "direct");
});

for (const reason of ["rate_limit", "invalid_input", "server", "network"]) {
  test(`${reason}: error carries setup source; retry succeeds with same submission ID`, async () => {
    let calls = 0; const ids = [];
    const f = form("source_plan=setup&source_cta=premium", { rpc: async (_, args) => {
      ids.push(args.p_id); if (calls++ > 0) return { error: null };
      if (reason === "network") throw Error("offline");
      return { error: { message: reason } };
    } });
    f.ready(); await f.submit(); f.render();
    const error = f.events.find(([event]) => event.endsWith("submit_error"))[1];
    assert.deepEqual(plain(error), { source_plan: "setup", source_cta: "premium", reason, intro_video_state: "not_started", brothers_video_state: "not_started" });
    assert.ok(!f.events.some(([event]) => event.endsWith("submit_success")));
    assert.equal(nodes(f.tree, n => n.type === "input" && n.props.name === "phone")[0].props.value, "010-0000-0000");
    await f.submit();
    assert.equal(f.events.filter(([event]) => event.endsWith("submit_success")).length, 1);
    assert.equal(ids[0], ids[1]);
  });
}

test("invalid phone or missing consent never submits or reports conversion", async () => {
  for (const options of [{ phone: "invalid" }, { consent: false }]) {
    const f = form("source_plan=basic&source_cta=basic"); f.ready(options); await f.submit();
    assert.equal(f.calls(), 0); assert.ok(!f.events.some(([event]) => event.includes("submit_")));
  }
});

test("free/paid consultation choice is independent of the source course", async () => {
  const f = form("source_plan=basic&source_cta=basic"); f.ready({ kind: "offline" }); await f.submit();
  const success = f.events.find(([event]) => event.endsWith("submit_success"))[1];
  assert.equal(success.consultation_type, "offline"); assert.equal(success.source_plan, "basic");
});

test("both experience questions remain required before contact entry", () => {
  const f = form(""); f.next("다음"); f.choose("situation", "employee");
  assert.equal(f.button("연락처 입력").props.disabled, true);
  f.choose("repair_experience", "beginner"); assert.equal(f.button("연락처 입력").props.disabled, true);
  f.choose("marketing_experience", "beginner"); assert.equal(f.button("연락처 입력").props.disabled, false);
});

test("middle-click is tracked, right-click alone is not a CTA conversion", () => {
  const events = []; const link = cta("premium", events);
  link.props.onAuxClick({ button: 2 }); assert.equal(events.length, 0);
  link.props.onAuxClick({ button: 1 }); assert.equal(events.length, 1); assert.equal(events[0][1].source_plan, "setup");
});

test("both analytics providers receive the same attribution; adapter failures are isolated", () => {
  const calls = [];
  const analytics = load("lib/academy/analytics.ts", {
    "@next/third-parties/google": { sendGAEvent: (...args) => { calls.push(args); throw Error("GA unavailable"); } },
    "@vercel/analytics": { track: (...args) => { calls.push(args); throw Error("Analytics unavailable"); } },
  });
  const props = { source_plan: "basic", source_cta: "basic", consultation_type: "online" };
  assert.doesNotThrow(() => analytics.trackAcademy("academy_consult_submit_success", props));
  assert.equal(calls.length, 2); assert.deepEqual(calls[0].slice(1), calls[1]); assert.deepEqual(calls[1][1], props);
});

test("community reading is separate from consultation conversion and sends only known content IDs", () => {
  const events = [], handlers = new Map();
  let cleanup;
  class LinkChild {
    constructor(content) { this.content = content; }
    closest(selector) { return selector === "a[data-academy-community]" ? { dataset: { academyCommunity: this.content } } : null; }
  }
  load("app/academy/AcademyTracking.tsx", {
    react: { useRef: current => ({ current }), useEffect: effect => { cleanup = effect(); } },
    "@/lib/academy/analytics": { trackAcademy: (...args) => events.push(args) },
  }, { Element: LinkChild, document: {
    getElementById: () => null,
    addEventListener: (type, handler) => handlers.set(type, handler),
    removeEventListener: (type, handler) => { assert.equal(handlers.get(type), handler); handlers.delete(type); },
  } }).default();
  events.length = 0;
  for (const content of ["home", "business_column", "writing_column"]) {
    handlers.get("click")({ type: "click", button: 0, target: new LinkChild(content) });
  }
  handlers.get("auxclick")({ type: "auxclick", button: 1, target: new LinkChild("home") });
  handlers.get("auxclick")({ type: "auxclick", button: 2, target: new LinkChild("home") });
  handlers.get("click")({ type: "click", button: 0, target: new LinkChild("unknown@example.test") });
  handlers.get("click")({ type: "click", button: 0, target: {} });
  assert.deepEqual(plain(events), ["home", "business_column", "writing_column", "home"].map(community_content => [
    "academy_community_click", { location: "curriculum", community_content },
  ]));
  cleanup(); assert.equal(handlers.size, 0);
});

for (const location of ["basic", "premium", "video", "mobile"]) {
  test(`${location}: both video histories survive CTA, all steps, failure and success`, async () => {
    const history = { version: 1, at: Date.now(), intro: "completed", brothers: "started" };
    const events = [], link = cta(location, events, history);
    link.props.onClick();
    let calls = 0;
    const f = form(new URL(link.props.href, "https://example.test").search, { events, rpc: async () => (++calls === 1 ? { error: { message: "network" } } : { error: null }) });
    f.ready(); await f.submit(); f.render(); await f.submit();
    for (const [, props] of events) {
      assert.equal(props.intro_video_state, "completed"); assert.equal(props.brothers_video_state, "started");
      assert.equal(props.source_plan, location === "basic" ? "basic" : location === "premium" ? "setup" : "undecided");
      assert.equal(props.source_cta, location); assert.ok(!("video_at" in props));
    }
    assert.equal(events.filter(([event]) => event === "academy_consult_submit_success").length, 1);
    assert.deepEqual(events.filter(([event]) => event === "academy_consult_step_view").map(([, props]) => props.step), [1, 2, 3]);
  });
}

test("YouTube ready/cued/buffering do not count; resume/replay never double-count start or end", () => {
  const { createPlaybackObserver } = load("lib/academy/youtube-player.ts");
  const events = [], observe = createPlaybackObserver(stage => events.push(stage));
  for (const state of [-1, 5, 3, 0, 2]) observe(state);
  assert.deepEqual(events, []);
  for (const state of [1, 1, 2, 1, 3, 1, 0, 0, 1, 0]) observe(state);
  assert.deepEqual(events, ["started", "completed"]);
  const separate = createPlaybackObserver(stage => events.push(`brothers:${stage}`));
  separate(1); separate(0);
  assert.deepEqual(events.slice(-2), ["brothers:started", "brothers:completed"]);
});

test("video URL context is allowlisted, expires, and never changes course attribution", () => {
  const now = Date.now(), good = { version: 1, at: now, intro: "completed", brothers: "not_started" };
  const href = videoAttribution.withVideoAttribution(attribution.consultationHref("premium"), good);
  const params = new URL(href, "https://example.test").searchParams;
  assert.deepEqual(plain(videoAttribution.readVideoAttribution(params, now)), good);
  assert.equal(attribution.readAcademyAttribution(params).source_plan, "setup");
  assert.equal(videoAttribution.readVideoAttribution(params, now + videoAttribution.VIDEO_CONTEXT_TTL + 1), null);
  assert.equal(videoAttribution.readVideoAttribution(params, now - 1), null);
  params.append("intro_video_state", "started"); assert.equal(videoAttribution.readVideoAttribution(params, now), null);
  params.delete("intro_video_state"); params.set("intro_video_state", "person@example.test");
  assert.equal(videoAttribution.readVideoAttribution(params, now), null);
  assert.equal(videoAttribution.readVideoAttribution(new URLSearchParams("source_plan=basic&source_cta=basic"), now), null);
  assert.equal(videoAttribution.withVideoAttribution("/academy/consult?source_plan=basic&source_cta=basic", { ...good, version: 2 }), "/academy/consult?source_plan=basic&source_cta=basic");
});

test("session storage loss/failure cannot break video history or mix video roles", () => {
  const values = new Map(); let failWrite = false;
  const store = load("lib/academy/video-store.ts", {
    react: { useSyncExternalStore: (_, get) => get() }, "./video-attribution": videoAttribution,
  }, {
    window: { sessionStorage: {
      getItem: key => values.get(key) ?? null,
      setItem: (key, value) => { if (failWrite) throw Error("storage blocked"); values.set(key, value); },
    } }, setTimeout: () => 1, clearTimeout: () => {},
  });
  assert.equal(store.getVideoRecord(), null);
  store.recordVideoState("intro", "started"); failWrite = true;
  store.recordVideoState("intro", "completed"); store.recordVideoState("intro", "started");
  store.recordVideoState("brothers", "started");
  assert.equal(store.getVideoRecord().intro, "completed"); assert.equal(store.getVideoRecord().brothers, "started");
  assert.equal(store.useAcademyVideoRecord().intro, "completed");
});

test("expired or absent video snapshots never inherit a previous consultation's viewing history", async () => {
  const params = `source_plan=basic&source_cta=basic&intro_video_state=completed&brothers_video_state=completed&video_at=${Date.now() - videoAttribution.VIDEO_CONTEXT_TTL - 1000}`;
  for (const query of [params, "source_plan=setup&source_cta=premium", ""]) {
    const f = form(query); f.ready(); await f.submit();
    assert.ok(f.events.every(([, props]) => props.intro_video_state === "not_started" && props.brothers_video_state === "not_started"));
  }
});
