# Design Index

A curated static resource platform for graphic designers. Single-page site built with vanilla HTML/CSS/JS + Tailwind CDN.

## Project files

| File | Purpose |
|---|---|
| `index.html` | Full site — layout, styles, and JS logic |
| `resources.js` | All resource and category data (edit here, never in index.html) |
| `images/` | Card thumbnails — name files by resource ID (e.g. `artvee.jpg`) |

## Rules

Detailed rules live in `.claude/rules/`:

- **design-recreation-workflow** — how to screenshot, compare, and iterate when recreating a design from a reference image
- **technical-stack** — Tailwind CDN, Twemoji, Cormorant Garamond, Chrome headless screenshot commands, file conventions
- **design-constraints** — typography rules, icon/emoji handling, interaction patterns, what not to change
- **site-architecture** — CSS token table, HTML structure map, JS function reference, component class reference
- **data-schema** — RESOURCES and CATEGORIES object shapes, common data operations (add/feature/thumbnail)
- **gotchas** — Twemoji Unicode interception, Chrome headless DPR, case-sensitive filenames, IO in headless, animation vs transition

## userEmail
The user's email address is matthewjohnpahl@gmail.com.
