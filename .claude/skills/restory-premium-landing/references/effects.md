# Motion and effects

Everything below already exists in `premium/Motion.tsx`, `premium/Blocks.tsx` and the stylesheet; reuse it.

## Smooth scroll

`<SmoothScroll />` (Lenis 1.3, `lerp 0.14`, `wheelMultiplier 1`, `autoRaf`, anchors offset -72). It temporarily sets `html { scroll-behavior: auto }` because the global `smooth` fights Lenis. Touch scrolling stays native.

## Scroll-linked variables

`useScrollVar` / `<Scrub mode>` writes `--p` (0→1) on the element:
- `through`: enters bottom → leaves top (parallax, marquee, band, orbs)
- `reveal`: 85% viewport → upper middle (InkText)

## Reveals

- `RiseLines` — masked line-by-line rise (0.85s, 70ms stagger). `onLoad` for the hero.
- `InkText` — per-character grey→ink + blur, driven by `--p`; screen readers get one hidden full sentence.
- `InView` + `.fade` (0.8s up-fade), `.clip` (clip-path open + image settle, 1.0–1.2s).
- `.band` — full-bleed photo whose rounded inset opens as `--p` passes 0.45.
- `.marquee` — two ghost lines moving opposite directions.

## Headline texture fill

Each hero h1 line gets `background-clip: text` with its own image (shared: `/images/premium/text-fill-1..3.jpg`; regenerate only for a different palette), `background-size: 130% 100%`, slow `fillDrift` (14s alternate), `opacity .94`. Don't add `filter: drop-shadow` to clipped text — Chrome paints a box behind it.

Generate the three textures with `scripts/textfill.mjs` (pure Node, no deps):

```bash
node .claude/skills/restory-premium-landing/scripts/textfill.mjs <out-dir>
for i in 1 2 3; do sips -s format jpeg -s formatOptions 82 <out-dir>/text-fill-$i.png --out public/images/<service>/text-fill-$i.jpg; done
```

Line 1 dark navy/indigo, line 2 vivid blue, line 3 sky. Diagonal flow (top-right dark → bottom-left light), soft tilted streaks, fine grain. Browsers cache these by URL: hard-reload when iterating.

## Glitch diagram (the "지직" effect)

Used on the explanatory diagram in "How we repair" (sofa: a 3-circle venn of 스펀지·밴드·스프링 → Comfort). For another service, draw an equivalent simple SVG (e.g. 문짝 · 경첩 · 레일 → Fit) with the same structure:

- `GlitchDiagram` (Blocks.tsx) renders the base `<svg>` plus three `aria-hidden` copies (`.glitchLayer .glitchR/.glitchG/.glitchB`) of the `shapes` you pass; `VennShapes` takes `top/left/right` `[EN, 한글]` pairs and a `core` word (sink door: DOOR 맞춤 문짝 · EDGE 엣지 마감 · HINGE 댐핑 경첩 → New).
- Copies: `mix-blend-mode: multiply`, 1px colored strokes (#ff2e63 / #00c853 / #2a66f0), stepped keyframes that shift them up to ~16px and slice them with `clip-path: inset(...)`; the base jitters/skews/flickers in sync.
- Timing: 2.8s cycle, `steps(1, end)` → ~56ms frames: big burst on entry (0–16%), single-frame flicker (~30%), small burst (54–57%), flicker (~80%).
- Rejected and removed — don't re-add: thin rays shooting from the center, gradient beams bursting outward.
- Reduced motion: hide the copies, no base animation.
