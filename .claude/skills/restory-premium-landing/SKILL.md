---
name: restory-premium-landing
description: Redesign or build a Restory service landing page (싱크대 문짝 교체, 상부장, 하부장, 상판 크랙, 의자 천갈이, 가죽, 소파 등) in the "premium" style first shipped on the sofa sag page — Lenis smooth scroll, light hero with translucent photo + blurred blue orbs + grainy gradient headline, frosted-glass cards over drifting orbs, bold Wanted Sans/Montserrat type, an 8pt spacing system, a clay technician mascot placed for conversion, an RGB glitch on the explanatory diagram, and photo CTAs that open /request. Use this whenever the user asks to redo, restyle, "소파처럼", "같은 스타일로", "리디자인", or "랜딩 다시" for any Restory service page, or to add the mascot, glass cards, glitch, or grainy gradient text to one — even if they don't say "premium" or name the sofa page.
---

# Restory premium landing

The sofa sag landing (`/sofa`, `/sofa/[keyword]`) is the reference implementation. This skill turns another service landing into the same experience without re-deriving the dozens of decisions (and user corrections) that went into it.

**Reference files in the repo — read them before writing code; reuse, don't rewrite:**

| What | Where |
|---|---|
| Page composition examples (all sections, copy, CTAs) | `app/components/landing/Sofacushionlanding.tsx`, `app/components/landing/Sinkdoorreformlanding.tsx` |
| Motion primitives (`SmoothScroll`, `Scrub`, `InView`, `InkText`, `RiseLines`, `RollText`) | `app/components/landing/premium/Motion.tsx` |
| Shared blocks (`TitleCard`, `Mascot`, `PhotoCtaCard`, `GlitchDiagram` + `VennShapes`, `FaqList`, `YouTubeFacade`, icons) | `app/components/landing/premium/Blocks.tsx` |
| All styles (tokens, hero, glass, glitch, mascot, spacing system, extra blocks) | `app/components/landing/premium/premium.module.css` |
| Fonts (Montserrat via next/font) | `app/components/landing/premium/fonts.ts` |
| Shared images (headline textures, phone/wave mascots) | `public/images/premium/` |
| Frosted nav (site-wide) + hero overlap | `app/components/navigation.module.css` (`body:has([data-premium-hero])`) |
| Floating CTA (`newTab` prop) | `app/components/landing/shared/FloatingCTA.tsx` |
| Request-click analytics channel | `lib/service-analytics.ts`, `app/components/AttributionTracker.tsx` |

This repo runs a Next.js with breaking changes (see `AGENTS.md`): check `node_modules/next/dist/docs/` before using a Next API you haven't seen in these files.

## Workflow

1. **Read the target landing** (e.g. `app/components/landing/Sinkdoorreformlanding.tsx`) and list what must survive: every SEO string (h1/h2 text, FAQ items, regional `parseKeyword` logic, JSON-LD), every `data-service-section` / `data-service-id` attribute, `LandingTrail` / `LandingSections` / `LandingIntake`, phone links built with `buildTrackedContactPath`. The redesign changes presentation, not content or measurement — the user's GA4 funnels depend on these attributes.
2. **Import the shared primitives** from `app/components/landing/premium/` (Motion, Blocks, fonts, premium.module.css). Don't copy the stylesheet or blocks; if a new page needs a new reusable block or style, add it there. Page-specific bits (copy, hero photo, diagnose mascot pose, diagram labels) stay in the page component and `public/images/<service>/`.
3. **Compose the page** following `references/sections.md` (flow, which section gets which treatment, where the mascot goes).
4. **Apply the visual system** from `references/design-system.md` (tokens, 8pt spacing, type, glass, nav).
5. **Add motion/effects** from `references/effects.md` (Lenis, text reveals, gradient text fill, glitch diagram).
6. **Make the images**: hero background photo, headline fill textures, mascot poses — see `references/mascot.md` and `scripts/textfill.mjs`. Image generation spends the user's Higgsfield credits: quote the cost (`estimate_image_cost`) and say how many images you'll make before generating.
7. **Point photo CTAs at the request form**: `/request?service=<key>` (keys in `lib/consultation-services.ts`: `doors`, `upper`, `lower`, `counter`, `chairs`, `leather`, `sofa`). Same tab, brand-blue button with a camera icon, `data-cta="<page>_request_<spot>"`. Keep the phone button. Pass `kakaoUrl={REQUEST_URL} newTab={false}` to `FloatingCTA`.
8. **Enable the nav overlap** by putting `data-premium-hero` on the hero section (CSS `body:has([data-premium-hero])` slides the header over it — no route list to maintain), and wrap `LandingTrail` inside the hero (`.heroTrail`) so the breadcrumb sits under the frosted nav.
9. **Verify** (see checklist below) in the browser pane at 1440×900 and 375×812, then reset the viewport.

## Hard-won rules (each came from a user correction)

- **Bold sans, not serif.** Korean: Wanted Sans 800 with tight tracking (-0.02 ~ -0.045em). English labels/titles: Montserrat 700–800. The serif/Mincho look was tried and rejected.
- **Fast, not floaty.** Lenis `lerp: 0.14`, `wheelMultiplier: 1`; reveal transitions 0.8–1.2s; hero CTA card visible by ~0.35s. Slow inertia hurt perceived responsiveness and conversion.
- **Frosted means actually blurred.** Glass = `rgba(255,255,255,.5)` + `backdrop-filter: blur(40px)` + `1px solid #fff` + radius 24 + `0 4px 10px rgba(0,0,0,.05)` (measured from careers.resilire.jp). **Never also write `-webkit-backdrop-filter`** in these CSS modules: the build (lightningcss) keeps only the last of the pair and Chrome silently drops the blur. Verify with `getComputedStyle(el).backdropFilter !== "none"`.
- **Headline gradient flows diagonally** (dark top-right → light bottom-left), painted from grainy brush-stroke texture images, slightly translucent. A plain vertical `linear-gradient` was rejected as flat.
- **Glitch = RGB split only.** Fast cycle (2.8s, ~56ms frames), 1px colored strokes. Radiating rays and burst beams were tried and removed — don't add them back.
- **Spacing is one 8pt system** (gutter 20/40, card padding 24/40, card gap 12/16, section 56/104). On mobile, section title cards lose the glass and become plain headers — tall empty cards wasted ~1,300px.
- **Mascot: 3 placements, never in the hero** (empathy in the problem section, an action CTA card mid-page, a wave in the final CONTACT band). See `references/mascot.md`.
- `word-break: keep-all` on the page so Korean never breaks mid-word ("있을까 / 요?").
- Round any computed SVG coordinates (`Math.round(x*100)/100`) — server/client trig differences cause hydration mismatches.
- Respect `prefers-reduced-motion` for every new animation (the existing primitives already do).

## Verification checklist

- `npx tsc --noEmit -p .` and `npx eslint <changed files>` clean.
- Browser pane, 1440×900 and 375×812: hero fits the first screen with the CTA card visible; no horizontal scroll (`document.documentElement.scrollWidth === innerWidth`); mascot doesn't cover text; nav and glass cards report a real `backdropFilter`.
- Console has no hydration errors (check after a fresh navigation; old messages persist).
- Every photo CTA `href` is `/request?service=<key>` with no `target`; phone links still use `/go/phone`.
- Click one CTA and confirm the request form opens with the right item preselected.
- Reset the viewport (`resize_window` preset `desktop`) when done.
