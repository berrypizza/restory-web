# Visual system

All values live in `app/components/landing/premium/premium.module.css`. Later blocks in that file intentionally override earlier ones — the "SPACING SYSTEM" block near the end is the source of truth for spacing.

## Tokens

```
--bg #f4f4f2   --paper #fff   --ink #141414   --sub rgba(20,20,20,.62)   --faint rgba(20,20,20,.38)
--line rgba(20,20,20,.12)   --blue #2a66f0   --ghost #e3e3df   --ease cubic-bezier(.19,1,.22,1)
```

Brand blue is the only accent. Kakao yellow is no longer used on these pages (photo CTAs go to `/request`).

## Spacing (8pt) — mobile / ≥768px

| Token | Value | Used for |
|---|---|---|
| `--gutter` | 20 / 40 | page side padding |
| `--pad` | 24 / 40 | every glass card, all four sides |
| `--gap` | 12 / 16 | between cards, split columns |
| `--section` | 56 / 104 | section top & bottom |
| `--radius` | 20 / 24 | cards |

Inside a card: 16 between blocks, 12 title→body. Image cards: 8 around the image, 16–20 around text. `.wrap` max-width 1160. Split layout on ≥900px: `5fr 7fr`, left column sticky at `top: 88px`.

## Type

- Korean: Wanted Sans (already loaded globally). Titles 800, tracking -0.025 ~ -0.045em. Section title `clamp(22px, 2.6vw, 34px)`, body 15/16px, line-height 1.75.
- English: Montserrat (next/font, `--font-sofa-display`). Card titles 700 `clamp(32px, 4.6vw, 64px)`; kicker = 8px blue dot + 13px bold blue Korean label.
- Hero h1: 800, `clamp(46px, min(8vw, 11.5vh), 112px)`, line-height 1.1.
- `word-break: keep-all` on `.page`.

## Glass (careers.resilire.jp, measured)

```css
background: rgba(255,255,255,.5);
backdrop-filter: blur(40px);      /* no -webkit- twin — the build drops the blur if both exist */
border: 1px solid #fff;
border-radius: 24px;
box-shadow: 0 4px 10px rgba(0,0,0,.05);
```

Mobile: TitleCards render without glass (plain header); desktop: glass, `min-height: 220px`, content bottom-aligned.

## Ambient orbs behind the glass

`.glassZone` (isolation) → `.ambient` (absolute, z -1) → `.ambientSticky` (sticky, 100svh) → three `.ambientOrb` radial gradients (blur 48px) that cross the screen as `--p` (zone scroll progress) goes 0→1, plus `.grain`.

## Navigation

The nav is frosted site-wide (`.header` in `navigation.module.css`: white 50%, blur 40px). A premium hero carries `data-premium-hero`; `body:has([data-premium-hero]) .header` adds `margin-bottom: -65px` so the hero slides under the nav, and a white bottom border. The hero then needs `.heroTrail { padding-top: 65px }` around `LandingTrail`.

## Buttons

- `.btnPrimary` brand blue + camera icon → photo request.
- `.btnDark` (#141a2a) or `.btnGhost` (on blue) → phone.
- `.btnOnBlue` white → photo request inside the blue CONTACT band.
- Full width on mobile, auto on ≥640px. `RollText` for the character-roll hover.
