# Clay technician mascot

An original Restory character in the style of matte claymation figurines (inspired by the look of walkcard-style clay figures, not copying any character). Shared images: `public/images/premium/mascot-phone.png`, `mascot-wave.png` (used by `PhotoCtaCard` and the CONTACT band). Service-specific diagnose poses: `public/images/sofa/mascot-diagnose.png`, `public/images/door/mascot-diagnose.png`. Only the diagnose pose needs generating for a new service (base reference job id `0db5d0a6-deec-4b69-9926-aa69ed5f80d6` if still accessible).

## Character spec (keep identical across poses)

Friendly Korean furniture repair technician, early 30s, small head / long legs, gentle smile, short neat black hair, warm light skin. White crew-neck t-shirt, cobalt blue (#2a66f0) canvas work apron with a white tape measure in the chest pocket, light gray work pants, off-white sneakers.

## Generating (Higgsfield, `gpt_image_2_6`)

- Params: `quality: "high"`, `background: "transparent"`, aspect `3:4` (standing) or `4:3` (scene). ≈1.25 credits each — quote first.
- For a new pose, pass the existing base image as `medias: [{ value: <job_id or uploaded media_id>, role: "image_references" }]` and start the prompt with: "Same clay figurine character as the reference (identical face, hair, white t-shirt, cobalt blue apron with tape measure, gray pants, white sneakers), same matte claymation style and soft studio light." If the original job id is unknown, upload `mascot-wave.png` with `media_upload` and use that id.
- End prompts with "Isolated on a fully transparent background, no text, no logo."
- Diagnose pose per service, e.g. sink doors: "kneels in front of a small white clay kitchen base cabinet whose door hangs crooked from a loose hinge, gently lifting the door with one hand and looking at the hinge thoughtfully." Aspect 4:3.
- Download with curl to the scratchpad, inspect, then copy to `public/images/<service>/mascot-*.png` (next/image serves WebP).

## Placement (conversion-driven: 3, never in the hero)

| # | Where | Pose | Copy | Why |
|---|---|---|---|---|
| 1 | Problem section, left sticky column (replaces a generic photo) | Diagnosing the defect | Speech bubble, e.g. "어디가 문제인지부터 볼게요" | Empathy + "an expert will look at it" |
| 2 | After the process steps, as a glass CTA card | Holding a phone showing the furniture + thumbs up | "사진 한 장이면 시작돼요" + one line + photo-request button | Turns the explanation into an action |
| 3 | Final CONTACT band | Waving, toolbox, standing on a white card | – | Friendly close next to the last CTA |

Not in the hero: it slows LCP and pulls attention from the primary CTA. Not in cases/cost/FAQ: real photos and plain copy carry trust there.

## Components

- `Mascot` (src, alt, width, height, bubble?) — pop-in (overshoot easing) + 4.5s gentle bob; bubble follows 0.45s later.
- CTA card grid: mobile `"fig text" / "btn btn"` (84px figure, full-width button); desktop `"fig text" / "fig btn"` (160px figure bleeding 30px below the card).
- Contact mascot: absolute; desktop right column 300px wide, mobile 116px bottom-right with `padding-bottom: 188px` on the band.
- Descriptive Korean `alt` text on every mascot.
