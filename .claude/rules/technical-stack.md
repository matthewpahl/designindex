---
description: Technical stack and tooling decisions for this project
alwaysApply: true
---

## Stack

- **CSS framework:** Tailwind CSS via CDN — `<script src="https://cdn.tailwindcss.com"></script>`
- **Serif font:** Cormorant Garamond (light 300 + italic) via Google Fonts
- **Emoji:** Native Unicode, browser-rendered — no external emoji library. Category emoji render inline in filter pills and section headings. Arrow icons use inline SVG (not emoji characters) for design control.
- **Placeholder images:** No external placeholder service — missing thumbnails fall back to flat charcoal `#1e2023` via the `onerror` handler on each `<img>` tag
- **Resource data:** Defined in `resources.js` (loaded via `<script src="resources.js">`). Edit that file to add, remove, or feature resources — never hardcode resource data in `index.html`

## File conventions

- `index.html` — main site; `about.html` — about page. Both are self-contained (own `<style>` block, own `<script>`)
- Thumbnail images go in `images/` and are named by resource ID (e.g. `images/artvee.jpg`). The card system auto-resolves by ID and falls back on 404 — no code changes needed to add a thumbnail
- Screenshots use Chrome headless with `--force-device-scale-factor=1` to avoid 2× DPR scaling on macOS

## Theme

- **Light mode by default** — `localStorage.getItem('di-mode') || 'light'`. Dark mode is the toggle option.
- All colors defined as CSS custom properties in `:root` (dark) and `html.light` (light)
- Brand accent: `#f5c31c` (yellow)
- Body background: `radial-gradient(125% 125% at 50% 10%, ...)` — dark uses deep charcoal→navy; light uses warm off-white
