---
description: RESOURCES and CATEGORIES data shapes, and recipes for common data operations
alwaysApply: true
---

## Resource object shape (`resources.js`)

```javascript
{
  id:       'artvee',                  // string — unique, kebab-case, matches images/{id}.jpg
  name:     'Artvee',                  // string — display name
  url:      'https://artvee.com',      // string — full URL
  desc:     'Free public domain art',  // string — one short sentence, no period
  tags:     ['free', 'public domain'], // string[] — 2-4 lowercase tags
  category: 'stock',                   // string — must match a CATEGORIES id
  image:    null,                      // string | null — override URL; null = auto-resolve images/{id}.jpg
  featured: false,                     // boolean — shows in Featured Picks grid (keep ≤ 5 featured at once)
  added:    '2025-01-15',              // string | undefined — ISO date; NEW badge shown if within 30 days of today
}
```

## CATEGORIES array shape

```javascript
{ id: 'stock', label: 'Stock', badge: 'IMG', emoji: '🗂️' }
```

| Field | Type | Notes |
|---|---|---|
| `id` | string | kebab-case; used as URL hash (`#stock`), filter key, and `category` foreign key in resources |
| `label` | string | Display name in filter pills and section headings |
| `badge` | string | Short uppercase label shown on card thumbnail (2–5 chars) |
| `emoji` | string | Unicode emoji rendered via Twemoji in section headings |

## Current categories (13 total)

`design-inspo` · `stock` · `type-tools` · `type-marketplace` · `type-foundry` · `design-news` · `creators` · `books` · `bookstores` · `assets` · `color` · `agency-studio` · `designers`

The old `type` category was replaced by three: `type-tools`, `type-marketplace`, `type-foundry`. `agency-studio` is a new category for studio Instagram accounts.

## Note on `tags` field

The `tags` array is still defined on each resource object and should be maintained, but is **not currently rendered** in the card UI (the tag pills were removed for cleaner cards). Keep the data — it may be used for search/filtering in future.

## Common operations

### Add a new resource
Append to the `RESOURCES` array in `resources.js`. Set `added` to today's ISO date to trigger the NEW badge for 30 days. Set `image: null` unless you need an explicit override URL — the card system auto-resolves `images/{id}.jpg`.

### Feature a resource
Set `featured: true`. The resource will appear in the Featured Picks grid (`.featured` section). Keep the total count ≤ 5 to maintain the grid layout.

### Add a thumbnail image
Drop a `.jpg` file named exactly `{resource.id}.jpg` into the `images/` folder. No code changes needed — the card system auto-resolves it and falls back to a flat charcoal `#1e1f28` placeholder on 404. Filename must be **lowercase** to match on case-sensitive servers.

### Add a new category
1. Add an entry to `CATEGORIES` with `id`, `label`, `badge`, `emoji`
2. Add resources with `category: '{new-id}'`
3. No HTML changes needed — filter pills and sections are generated from `CATEGORIES`
