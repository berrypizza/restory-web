# Page flow and section treatments

The order follows a conversion story: hook → empathy → proof → how → action → objections → close. Keep the target page's existing content; map it onto these slots. Section ids in `data-service-section` must stay as they were on that page (they feed GA4 section-progress funnels). The ones below are the sofa page's.

| # | Slot | `data-service-section` | Treatment |
|---|---|---|---|
| 1 | Hero | `hero` | Light hero (see below). Contains `LandingTrail` inside `.heroTrail`. |
| – | Section nav | – | `LandingSections` (anchors to cases / budget / faq) right after the hero. |
| – | Region band + intro | `regional_intro` | Only when the keyword has a region. Frosted band + split(TitleCard "Area", glass card with the regional h2/paragraph incl. case count). |
| 2 | Problem / empathy | `concern` | split: left sticky column = TitleCard + **mascot #1** (diagnosing pose with speech bubble); right = glass card with `InkText` (4 short lines) + 2 body paragraphs. |
| – | Marquee | – | Two lines of giant ghost English (`.marquee`), moving opposite ways with scroll. |
| 3 | Proof | `cases` (id `guide-cases`) | split(TitleCard "Before / After", glass card with title + "같은 ○○입니다." + disclaimer note) → before/after pair with clip reveal → featured case cards (glass, 8px inset image) → horizontal `CaseStrip`. |
| – | Full-bleed band | – | `.band`: photo whose rounded inset opens to full width while scrolling, big "RESTORE" + "ALL CASES →". |
| 4 | How we repair | `scope` | split(sticky TitleCard, glass card with title + body + **glitch diagram**) → full-width glass `rowsCard` with numbered rows (number │ title+desc │ CASE →). |
| 5 | Process | `process` | split(TitleCard, glass card title+body) → glass rows card (steps with a tag) → note → **mascot #2 CTA card** (phone pose, "사진 한 장이면 시작돼요", photo-request button). |
| 6 | Cost & care | `budget` (id `guide-budget`) | split(sticky TitleCard, column: glass card with title/body/compact rows, then glass checklist card). |
| 7 | Video | `video` | TitleCard "Movie" (5/12 width on desktop) + glass frame (8px) around the YouTube facade. |
| 8 | FAQ | `faq` (id `guide-faq`) | split(sticky TitleCard, glass card accordion; answers aligned to question text, grid-rows height animation, answers stay in DOM for SEO). |
| 9 | Contact | `contact` | Solid brand-blue band: giant "CONTACT" (roll hover, links to request), split(label, title/sub/buttons/chips), **mascot #3** waving on a card; desktop reserves the right third (`grid-template-columns: 3fr 5fr 4fr`), mobile parks it bottom-right with extra bottom padding. |
| – | Intake + floating CTA | – | `LandingIntake` then `FloatingCTA compactMobile label="사진 올리고 …" kakaoUrl={REQUEST_URL} newTab={false}`. |

Sections 2–8 live inside one `<Scrub className={s.glassZone}>` that owns the sticky ambient orbs (see design-system.md). Sections inside it must have transparent backgrounds or the orbs won't show through the glass.

## Hero

- Background: AI-generated, airy, high-key photo of the target furniture (e.g. a bright kitchen with fresh sink doors) with empty space on the left; `opacity .62` mobile / `.78` desktop; white fog gradients (top + left). Slight scroll parallax.
- Three blurred brand-blue orbs (`.orb .orbA/.orbB/.orbC`), slow float, plus `.grain` overlay.
- Eyebrow line (Montserrat, tracked caps) → **h1 in 3 short lines** with grainy diagonal texture fill (one texture per line, dark→light down the lines) → English tagline → glass CTA card (sub copy, primary photo-request button + dark phone button, hint text, 3 facts).
- Giant translucent ghost text along the bottom (`.heroGhost`, e.g. `RE'STORY SINK DOOR`), sliding with scroll.
- h1 wording may be rewritten for impact, but keep the page's core keywords (e.g. 싱크대 문짝, 교체) and tell the user you changed it — it's the SEO h1.

## Copy rules

- Keep claims as cautious as the original copy (사진으로 1차 확인, 현장 확인이 필요할 수 있음, 상담). Don't invent prices, durations, guarantees or review counts.
- Short Korean lines; one idea per line in titles.
- English labels are decorative (Why it sags / How we repair / Process / Cost & Care / Movie / FAQ / CONTACT); adapt nouns to the service (e.g. "Why doors fail").
