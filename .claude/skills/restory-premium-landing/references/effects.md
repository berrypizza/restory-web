# Motion and effects

Everything below already exists in `premium/Motion.tsx`, `premium/Blocks.tsx` and the stylesheet; reuse it.

## Smooth scroll

`<SmoothScroll />` (Lenis 1.3, `lerp 0.14`, `wheelMultiplier 1`, `autoRaf`, anchors offset -72). It temporarily sets `html { scroll-behavior: auto }` because the global `smooth` fights Lenis. It is skipped entirely on touch devices (`(pointer: coarse)`): Lenis doesn't smooth touch scrolling, so there it only cost a per-frame loop.

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

## Phones and touch devices (performance)

The full effect stack made the first ~0.5s stutter on phones (user report). On first paint the hero ran, at the same time:
- three animated orbs with `filter: blur(40px)`;
- a full-screen SVG-noise `.grain` layer with `mix-blend-mode: overlay`, which re-blended every frame because the orbs under it were moving;
- the `fillDrift` background-position animation, which repaints the clipped headline text every frame;
- a fading `heroGlass` card whose backdrop blur is recalculated every frame while it moves.

The stylesheet now ends with a `@media (max-width: 899px), (pointer: coarse)` block that keeps the look but cuts the work:

| Effect | Desktop | Phone / touch |
|---|---|---|
| Hero orbs | blur 40px, `orbFloat` loop | blur 28px, static (a static blurred layer is rasterised once) |
| Ambient orbs | blur 48px | blur 32px, no loop (still move with `--p`) |
| `.grain` | overlay blend | hidden |
| Headline texture | `rise` + `fillDrift` | `rise` only (texture still visible, just not drifting) |
| `.heroGhost` | soft-light blend + stroke + scroll shift | plain translucent text |
| `.heroGlass` | blur 22px + saturate | blur 12px, white 66% |
| `.glass:not(.titleCard)` | blur 40px, white 50% | blur 16px, white 62% |

Rules:
- Don't remove the orb blur on phones altogether: the radial gradients alone show hard circular edges.
- Scope phone overrides of `.glass` with `:not(.titleCard)`. The block sits at the end of the file, so a bare `.glass` rule would beat the earlier mobile rule that strips the glass from title cards.
- Give hero `<img>` backgrounds a `srcSet` with the small variant when one exists (`next/image` with `sizes="100vw"` already does this).
- Any new looping or blended effect needs a phone answer in that block before it ships.
