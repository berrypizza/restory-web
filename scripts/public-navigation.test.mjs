import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const { parse } = createRequire(import.meta.url)("next/dist/compiled/node-html-parser");
const base = process.env.PUBLIC_UX_BASE_URL;
const cache = new Map();

function read(path) {
  if (!cache.has(path)) {
    cache.set(path, (async () => {
      const response = await fetch(new URL(path, base));
      assert.equal(response.status, 200, path);
      return parse(await response.text());
    })());
  }
  return cache.get(path);
}

function selectedIntakeItem(doc) {
  const option = doc.querySelector('select[name="item"] option[selected]');
  const value = option?.getAttribute("value") ?? option?.textContent;
  return value === "custom" ? doc.querySelector('input[name="customItem"]')?.getAttribute("value") : value;
}

test("every internal full-menu link opens its advertised public page or anchor", { skip: !base }, async () => {
  const root = await read("/");
  const dialog = root.querySelector("dialog");
  assert.ok(dialog?.querySelector('nav[aria-label="전체 메뉴 항목"]'));
  const pages = new Set(dialog.querySelectorAll("a[href]").map(a => a.getAttribute("href")).filter(href => href.startsWith("/") && !href.startsWith("/go/")));
  for (const required of ["/repair", "/kitchen", "/leather", "/sofa", "/cases", "/tips", "/events", "/community", "/philosophy", "/academy", "/request"]) {
    assert.ok(pages.has(required), required);
  }
  await Promise.all([...pages].map(async href => {
    const url = new URL(href, base);
    const doc = await read(url.pathname + url.search);
    assert.ok(doc.querySelector("h1"), href);
    if (url.hash) assert.ok(doc.getElementById(url.hash.slice(1)), href);
  }));
  assert.ok(root.querySelector('#services a[href="/repair"]'));
  assert.equal(root.querySelectorAll("main h1").length, 1);
});

test("each campaign connects a specific field job, real case and preselected intake form", { skip: !base }, async () => {
  for (const slug of ["sangbujang", "cheongali", ...[2,3,4,5,6].map(n => "cheongali-" + n)]) {
    const path = "/landing/" + slug;
    const doc = await read(path);
    assert.ok(doc.querySelector('[data-service-section="budget"]'), path);
    assert.ok(doc.querySelector('[data-service-section="photo_guide"]'), path);
    assert.ok(doc.querySelector('main img[alt]'), path);
    const href = doc.querySelector('main a[href^="/request?service="]').getAttribute("href");
    const form = await read(href);
    assert.ok(selectedIntakeItem(form), href);
    const job = doc.querySelector('main a[href^="/cases/case-"]').getAttribute("href");
    assert.ok((await read(job)).querySelector('[data-service-keyword]'), job);
    assert.match(doc.querySelector('meta[name="robots"]').getAttribute("content"), /noindex/);
  }
});

test("specialist pages expose working section links and contextual consultation routes", { skip: !base }, async () => {
  const specialists = ["/sofa", "/repair/sangbujang", "/repair/habujang", "/repair/sink-top-crack", "/kitchen/sink-door", "/kitchen/fridge-cabinet", "/leather/restaurant-chair", "/leather/meeting-table"];
  for (const path of specialists) {
    const doc = await read(path);
    assert.ok(doc.querySelector('nav[aria-label="현재 위치"]'), path);
    const handoff = doc.querySelector("[data-service-handoff]");
    assert.ok(handoff?.querySelector('a[href^="/cases?cat="]'), path);
    const intake = handoff.querySelector('a[href^="/request?"]').getAttribute("href");
    assert.ok(selectedIntakeItem(await read(intake)), intake);
    const jump = doc.querySelector('nav[aria-label="서비스 안내 바로가기"]');
    if (jump) {
      for (const a of jump.querySelectorAll('a[href^="#"]')) assert.ok(doc.getElementById(a.getAttribute("href").slice(1)), path);
    } else {
      assert.ok(doc.querySelector('[data-public-detail-tabs] button[aria-pressed="true"]'), path);
    }
  }
});
