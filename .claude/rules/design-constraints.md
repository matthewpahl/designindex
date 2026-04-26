---
description: Design and code constraints to maintain the premium, curated feel of the site
alwaysApply: true
---

## Matching reference designs

- Do not add features, sections, or content not present in the reference image
- Match the reference exactly — do not "improve" the design unprompted
- If the user provides CSS classes or style tokens, use them verbatim
- Keep code clean but don't over-abstract — inline Tailwind classes are fine

## Typography

- Hero heading uses mixed bold sans-serif (`.bold`, font-weight 900) and light serif (`.serif`, Cormorant Garamond 300)
- Never add positive letter-spacing to headings or card titles — this project uses tight/negative tracking throughout
- The hero subline uses Cormorant Garamond italic 300

## Icons and emoji

- Never use raw Unicode arrow characters (e.g. `↗`) inside card templates — Twemoji will intercept and render them as emoji images. Use inline SVG for arrows and icons
- The visit arrow on cards is an SVG inside `.visit-arrow`, styled as a frosted-glass circle (no box-shadow)

## Images

- All card thumbnails use 16:9 aspect ratio
- When no image file exists for a card, the `onerror` handler adds a flat charcoal `#1e1f28` background class — never a broken image icon
- `.thumb-orange` and `.thumb-blue` are both flat `#1e1f28` charcoal — not gradients. They are named placeholders; real thumbnails replace them entirely

## Interaction

- Cards have a **resting box-shadow** at all times (not just on hover) — this lifts them off the surface and separates the info area from the background
- Card hover: `translateY(-3px)` + deeper box-shadow + brighter border — no other transform effects
- Filter pills are generated from the `CATEGORIES` array in `resources.js` — never hardcoded in HTML
- Category headings are clickable and filter to that category
