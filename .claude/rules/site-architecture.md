---
description: CSS token system, JS function map, and component structure for Design Index
alwaysApply: true
---

## CSS custom properties (theme tokens)

All colors are CSS variables defined in `:root` (dark) and `html.light` (light). Never hardcode colors — always use a token.

| Token | Dark value | Purpose |
|---|---|---|
| `--bg` | `#0b0c16` | Page background |
| `--surface` | `#13141f` | Card containers (.card-container) |
| `--card` | `#1b1d2c` | Individual resource cards |
| `--border` | `rgba(255,255,255,0.07)` | Default borders |
| `--border-card` | `rgba(255,255,255,0.06)` | Card borders |
| `--border-hover` | `rgba(255,255,255,0.22)` | Hover / active borders |
| `--text` | `#ffffff` | Primary text |
| `--text-dim` | `rgba(255,255,255,0.65)` | Secondary text |
| `--text-muted` | `rgba(255,255,255,0.45)` | Tertiary / meta text |
| `--text-faint` | `rgba(255,255,255,0.22)` | Dividers, copyright |
| `--pill-bg` | `rgba(255,255,255,0.07)` | Filter pill resting background |
| `--pill-border` | `rgba(255,255,255,0.13)` | Filter pill resting border |
| `--pill-active-bg` | `rgba(255,255,255,0.92)` | Active filter pill background |
| `--pill-active-text` | `#111111` | Active filter pill text |
| `--badge-bg` | `rgba(255,255,255,0.1)` | Category badge background |
| `--badge-text` | `rgba(255,255,255,0.75)` | Category badge text |
| `--mode-btn-bg` | `rgba(255,255,255,0.09)` | Dark/light toggle button background |
| `--mode-btn-border` | `rgba(255,255,255,0.12)` | Dark/light toggle button border |
| `--section-label` | `rgba(255,255,255,0.45)` | "Featured Picks" label and similar |
| `--footer-border` | `rgba(255,255,255,0.07)` | Footer divider lines |
| `--nav-height` | `58px` | Sticky offset for filter bar |
| `--hero-glow-x/y` | `8% / 55%` | Hero parallax glow position (set via JS mousemove) |

Light mode overrides defined in `html.light { }` — same token names, inverted values (dark text on warm off-white).

## Key HTML structure

```
<nav>                         ← sticky, z-index 50
<div class="page">            ← max-width 1200px
  .card-container.hero        ← hero heading + subline
  .card-container.featured    ← 5-col featured picks grid
  #filter-sentinel            ← zero-height IO target for sticky detection
  .card-container.filter-wrap ← sticky filter pills (z-index 40)
  #filter-status              ← "Showing N resources · Category" line
  #cat-container              ← rendered category sections
<footer>                      ← curator note + copyright
<button#back-top>             ← fixed bottom-right, appears after 400px scroll
```

## Key JS functions

| Function | What it does |
|---|---|
| `cardHTML(resource, gradientClass)` | Returns HTML string for one resource card. Auto-resolves `images/{id}.jpg`, falls back to charcoal placeholder on 404. Renders title + description only (no tag pills) |
| `renderFeatured()` | Renders resources where `featured: true` into `#featured-grid` using `thumb-orange` class |
| `renderCategories(filter)` | Renders category sections into `#cat-container`. Attaches heading click → filter. Calls `parseEmoji()` + `observeCards()` |
| `renderFilterPills()` | Builds filter pills from CATEGORIES array. Attaches click listeners |
| `setFilter(filter)` | Updates active pill, status line, URL hash, and calls `renderCategories()` |
| `observeCards()` | IntersectionObserver that adds `.visible` class (triggering `cardIn` animation) with staggered delay per column |
| `parseEmoji(el)` | Calls `twemoji.parse(el, { folder: 'svg', ext: '.svg' })` — must be called after any DOM render containing emoji |
| `applyMode(mode)` | Toggles `html.light`, updates button label/icon, persists to `localStorage` |

## Component classes

| Class | Description |
|---|---|
| `.rcard` | Resource card — starts `opacity:0`, animated in via `cardIn` keyframe when `.visible` is added. Has a resting `box-shadow` for depth; shadow deepens on hover |
| `.rcard-thumb` | 16:9 thumbnail wrapper with `position:relative` (houses `.visit-arrow` and `.new-badge`) |
| `.visit-arrow` | Frosted-glass circle (SVG arrow inside), appears on `.rcard:hover` |
| `.new-badge` | Yellow pill, shown when `resource.added` is within 30 days |
| `.cat-heading` | Category section title — clickable, triggers `setFilter` via `data-filter` attribute |
| `.fpill` | Filter pill — `.active` state uses `--pill-active-bg` / `--pill-active-text` |
| `.filter-wrap.is-stuck` | Added by IO sentinel when filter bar is pinned — enables `backdrop-filter: blur(16px)` |
| `.thumb-orange` | Charcoal `#1e1f28` fallback for featured cards (not a gradient — both thumb classes are flat charcoal, images replace them) |
| `.thumb-blue` | Charcoal `#1e1f28` fallback for regular cards (same as thumb-orange; gradient classes are now just named placeholders) |
