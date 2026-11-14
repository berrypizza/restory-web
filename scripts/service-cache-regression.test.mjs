import assert from "node:assert/strict";
import { validateHeaderValue } from "node:http";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { getImplicitTags } = require("next/dist/server/lib/implicit-tags");

// These production paths reproduced ERR_INVALID_CHAR on Next 16.2.6.
const servicePaths = [
  "/sofa/서초-쇼파-탄성저하",
  "/leather/서초-회의테이블-상판-인조가죽-교체",
  "/repair/부천-씽크대-하부장-수리",
  "/kitchen/가산-냉장고장-리폼",
];

for (const pathname of servicePaths) {
  test(`Korean cache tags are header-safe without losing the path: ${pathname}`, async () => {
    const category = pathname.split("/")[1];
    const { tags } = await getImplicitTags(`/${category}/[slug]/page`, pathname, null);
    assert.ok(tags.includes(`_N_T_${encodeURI(pathname)}`));
    assert.doesNotThrow(() => validateHeaderValue("x-next-cache-tags", tags.join(",")));
  });
}

// Build first, then exercise the same header-writing path as Vercel:
// NEXT_PRIVATE_MINIMAL_MODE=1 npm run start -- --hostname 127.0.0.1 --port 5195
// SERVICE_TEST_BASE_URL=http://127.0.0.1:5195 node --test scripts/service-cache-regression.test.mjs
// The HTTP checks also accept a deployed URL. They only perform GET requests.
const base = process.env.SERVICE_TEST_BASE_URL;
const smokePaths = [
  ...servicePaths,
  "/leather/meeting-table",
  "/",
  "/cases/case-115",
  "/academy",
  "/academy/consult",
];

for (const pathname of smokePaths) {
  test(`GET renders successfully and preserves its canonical: ${pathname}`, { skip: !base }, async () => {
    const response = await fetch(new URL(pathname, base), { signal: AbortSignal.timeout(30_000) });
    const html = await response.text();
    assert.equal(response.status, 200, `${pathname}: ${html.slice(0, 150)}`);
    assert.match(html, /<h1[\s>]/);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
    assert.ok(canonical, `Missing canonical on ${pathname}`);
    assert.equal(decodeURIComponent(new URL(canonical[1]).pathname), pathname);

    if (servicePaths.includes(pathname)) {
      const tags = response.headers.get("x-next-cache-tags");
      if (["127.0.0.1", "localhost"].includes(new URL(base).hostname)) {
        assert.ok(tags, "Run the production server with NEXT_PRIVATE_MINIMAL_MODE=1");
      }
      if (tags) {
        assert.ok(tags.includes(`_N_T_${encodeURI(pathname)}`));
        assert.doesNotThrow(() => validateHeaderValue("x-next-cache-tags", tags));
      }
      // A second request must remain healthy after cache access.
      const cached = await fetch(new URL(pathname, base), { signal: AbortSignal.timeout(30_000) });
      await cached.arrayBuffer();
      assert.equal(cached.status, 200);
    }
  });
}
