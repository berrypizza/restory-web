# Porting the premium system to another site or brand

Proven on 하루인테리어 (haru-kitchen.vercel.app): a separate Next.js 16 site in plain JSX with `output: 'export'`, a yellow theme, and the owner as the mascot. Every public page was ported: home, 5 service landings, case list, category and detail pages, photo guide and 404.

## Files

Copy the primitives into the other project, not the Restory pages:
- `Motion.tsx` → `Motion.jsx`: strip the types and keep the logic. Pass `id` through `RiseLines` so headings keep their `aria-labelledby` targets.
- `Blocks.tsx` → `Blocks.jsx`: use plain `<img>` instead of `next/image` when the site exports statically, and point `PhotoCtaCard` at the other site's mascot path.
- `premium.module.css`: copy lines up to the extra-blocks section, then recolor with a script (below).
- Add a small `Shell.jsx` for non-landing pages:
  - `PremiumHero`: a compact hero with photo, orbs, textured title, crumb and a glass child.
  - `GlassZone`: the ambient orbs behind the body.
  - `ContactBand`: the dark closing band with the waving mascot.
  - `CaseTile` and `ServiceTile`: glass cards.

## Recoloring (blue → another accent)

Replace every blue literal through a single mapping table: accent, hover, tints, orb gradient stops, `rgba(42,102,240,…)`, the hero fog `rgba(238,242,248,…)` and shadow tints. Skip `.glitchB`, whose blue is an RGB channel and not the brand color. For yellow:
- **Text accent** (`--blue`): dark amber `#9a6a00`. Pure yellow fails contrast on white.
- **Primary button**: yellow `#f5c400` background with dark text `#1d1a12`, not white text.
- **CONTACT band**: dark warm `#2b2420`, with a yellow `.contactBig` and a yellow button.
- **Fog and background**: warm `#faf6ec` / `#f7f4ec` instead of cool grey-blue.
- **Headline textures**: regenerate in the new palette (dark → mid → light per line).
- **Site-wide**: also recolor the global `.primary`, links and focus outline so no blue leftovers remain.

## Mascot of a real person

To base the mascot on a real person, upload their photo to Higgsfield and generate a base clay figure that resembles them, then pass the base job id as the reference for every pose so the character stays consistent.
- Make the same 3 poses: diagnose (kneeling with a flashlight at the service's problem), phone (phone with a thumbs-up), and wave (waving with a toolbox).
- Downscale the poses to about 640px for the web; the originals are 1–1.5MB.
- Write alt text that names the person: "… 박근호 대표 캐릭터".
- On the home page, put the diagnose pose in the services intro with an open question ("어디가 불편하세요?").

## Header

If the site's header isn't the Restory nav, make it float over every page (negative margin equal to its height), give it the glass spec, and pad `.heroTrail` by the header height (`calc(var(--header) + 12px)`).

## Long titles

`.contactBig` at `clamp(56px, 13vw, 190px)` overflows with long words ("PHOTO GUIDE"). Lower it, for example to `clamp(44px, 10vw, 150px)`.

## Logo

When the brand asks for a matching logo, draw it as an SVG (a 64px viewBox, rounded square in the accent color, one simple pictogram tied to the name or trade). Rasterize it with `qlmanage -t -s 512 -o <dir> logo.svg` for `app/icon.png`, and keep the old files as `*-old.png`.
