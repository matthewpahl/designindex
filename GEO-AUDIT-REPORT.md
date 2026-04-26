# GEO Audit Report: Design Index

**Audit Date:** 2026-04-26
**URL:** https://designindex.app
**Business Type:** Publisher / Curated Directory
**Pages Analyzed:** 3 (index.html, about.html, newsletter.html)

---

## Executive Summary

**Overall GEO Score: 50/100 (Poor)**

Design Index has excellent technical infrastructure — the robots.txt is best-in-class for AI crawler access, llms.txt is in place, and HTTPS + Vercel edge delivery are solid. The critical gap is structural: the entire product (120+ resources across 13 categories) is rendered by JavaScript at runtime, making it completely invisible to AI crawlers that do not execute JS. This single issue suppresses every category score. Brand authority is the second major gap — no press coverage, no Wikipedia entry, no external citations. Fix the JS rendering problem and the composite score could jump to 65+ overnight.

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 48/100 | 25% | 12.0 |
| Brand Authority | 28/100 | 20% | 5.6 |
| Content E-E-A-T | 58/100 | 20% | 11.6 |
| Technical GEO | 74/100 | 15% | 11.1 |
| Schema & Structured Data | 52/100 | 10% | 5.2 |
| Platform Optimization | 48/100 | 10% | 4.8 |
| **Overall GEO Score** | | | **50.3/100** |

---

## Critical Issues (Fix Immediately)

### 1. JavaScript-rendered resource grid is invisible to AI crawlers

**Affects:** All category scores — Citability, Technical, Platform, Schema

The entire value proposition of the site — 120+ curated design resources across 13 categories — lives in `resources.js` and is injected into two empty `<div>` containers (`#featured-grid`, `#cat-container`) at runtime by `renderFeatured()` and `renderCategories()`. The raw HTML served to AI crawlers contains no resource names, no descriptions, no category headings, no URLs. Only the hero tagline and newsletter form are visible.

A `<noscript>` fallback exists at the bottom of the file but covers only a fraction of resources with no structured markup.

**Fix options (in order of impact):**
- **Best:** Add a Node build script that reads `resources.js` and pre-renders full static HTML into `index.html` at deploy time. Vercel supports pre-build scripts.
- **Good:** Generate a static `/directory.html` page listing all resources as plain HTML. Link to it from the footer. No JS required.
- **Minimum:** Expand the existing `<noscript>` block to include all 120 resources in a simple `<ul>` list with names and URLs.

---

### 2. Organization logo points to a landscape social image

**Affects:** Schema score, Google Knowledge Panel eligibility

`index.html` Organization schema: `"logo": "https://designindex.app/og-image.jpg"` — this is the 1200×630 OG social card. Google's logo spec requires a square or near-square image (aspect ratio ≤ 1:1, minimum 112×112px). This will fail Google's Rich Results Test for Organization validation and may suppress the entity from knowledge panels.

**Fix:** Create a `logo-square.png` (512×512px, the card-file emoji or a wordmark) in the site root, then update the Organization schema:
```json
"logo": {
  "@type": "ImageObject",
  "url": "https://designindex.app/logo-square.png",
  "width": 512,
  "height": 512
}
```

---

### 3. SearchAction target is a hash fragment — invalid for rich results

**Affects:** Schema score, Sitelinks Search Box eligibility

The WebSite schema includes a `potentialAction` SearchAction targeting `https://designindex.app/#{search_term_string}`. Hash-fragment URLs are client-side navigation — Google cannot generate a Sitelinks Search Box for a target that requires JavaScript to resolve. The `EntryPoint` wrapper format is also deprecated in favor of a plain string URL.

**Fix:** Remove `potentialAction` entirely until a real `/search?q=` server endpoint exists. Keeping a non-functional SearchAction is worse than omitting it — Google will test the endpoint and find it non-functional.

---

## High Priority Issues

### 4. No `@id` cross-linking between Person instances

The `founder` nested in the Organization schema (index.html) and the `about` nested in the AboutPage schema (about.html) are both Matthew Pahl — but neither has an `@id`. AI models cannot confirm they are the same entity. This breaks entity graph resolution across pages.

**Fix:** Add `"@id": "https://designindex.app/about.html#matthew-pahl"` to both Person objects.

### 5. Organization `sameAs` has only one entry (Instagram)

The Organization schema's `sameAs` is `["https://www.instagram.com/matthewcrtv/"]`. A single platform provides almost no entity signal. AI models use `sameAs` links to resolve whether they already know an entity — one Instagram link won't match anything in their training data.

**Fix:** Add LinkedIn, your Beehiiv newsletter URL, and any platform where Design Index itself (not just Matthew personally) has a profile.

### 6. No privacy policy when collecting email addresses

The newsletter form collects first name and email with no privacy policy linked anywhere. This is a legal gap (GDPR/CCPA) and the most significant trust signal deficiency on the site. AI models assessing trustworthiness flag absent privacy policies for sites that collect data.

**Fix:** Add a minimal `/privacy.html` (one page, 300–400 words explaining data use, Beehiiv as processor, no third-party selling). Link from every page footer.

### 7. Person schema missing `description`, `image`, and `knowsAbout`

The AboutPage Person block identifies Matthew Pahl but provides no bio, no headshot, and no topic expertise signals. AI models cannot build a knowledge profile without these.

**Fix:** Add to the about.html Person schema:
```json
"description": "Matthew Pahl is a graphic designer and the curator of Design Index, a hand-picked directory of design resources. He publishes The Creative Mix newsletter weekly.",
"image": { "@type": "ImageObject", "url": "https://designindex.app/images/matthew-pahl.jpg", "width": 400, "height": 400 },
"knowsAbout": ["Graphic Design", "Typography", "Design Resources", "Type Foundries", "Visual Identity"]
```

### 8. No `llms-full.txt` with actual resource data

`llms.txt` describes the categories correctly but contains no actual resource names, URLs, or descriptions. AI models answering "what are good free font tools?" or "where can I find design inspiration?" cannot cite specific resources from Design Index because they have never seen them — the resources are JS-rendered on the page and absent from `llms.txt`.

**Fix:** Generate `/llms-full.txt` from `resources.js`. Format: one line per resource: `- [Resource Name](url) — short description [Category]`. Reference it from `llms.txt` with a link. This is the single highest-ROI action available without changing the site's frontend.

### 9. No `<lastmod>` dates in sitemap.xml

`sitemap.xml` has `changefreq` signals but no `<lastmod>` dates. Crawlers cannot verify the homepage actually changes weekly. Without `lastmod`, the `changefreq: weekly` claim is unverifiable and likely ignored.

**Fix:** Add `<lastmod>2026-04-26</lastmod>` (or the actual deploy date) to all three sitemap entries. Automate on deploy.

---

## Medium Priority Issues

### 10. Apex domain vs. www canonical mismatch

Canonical tags, OG URLs, sitemap URLs, and robots.txt all reference `https://designindex.app/` (apex), but the apex issues a 307 temporary redirect to `https://www.designindex.app/`. Every crawler hitting the apex domain pays an extra redirect hop. The 307 signals "temporary" — a 301 is the correct signal for a permanent canonical decision.

**Fix:** Decide on one canonical domain (www or apex) and make all references consistent. If keeping www as the served domain, update canonical tags, OG `og:url`, sitemap, and robots.txt sitemap reference to use `https://www.designindex.app/`. Change the redirect type to 301 in Vercel settings.

### 11. Missing `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`

`fonts.googleapis.com` has a preconnect but `fonts.gstatic.com` (where the actual font files live) does not. This adds a full round-trip delay for the Cormorant Garamond font binary fetch, slightly increasing LCP.

**Fix:** Add `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` immediately after the existing `fonts.googleapis.com` preconnect.

### 12. Missing security headers

No `X-Content-Type-Options`, `X-Frame-Options`, or `Referrer-Policy` headers. These are a 10-line `vercel.json` addition and signal technical trustworthiness.

**Fix:** Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

### 13. No BreadcrumbList schema on about.html or newsletter.html

Both secondary pages are missing breadcrumb structured data. Two-item breadcrumbs (Home > Page) are low effort and add structural context for AI models.

### 14. Missing `publisher` cross-reference on about.html and newsletter.html

Neither secondary page links back to the Organization `@id`. AI models cannot confirm the publisher relationship without this.

**Fix:** Add `"publisher": { "@id": "https://designindex.app/#organization" }` to both secondary page schemas.

### 15. About page is thin at 310 words

310 words is below the threshold for topical depth. The page is compelling but provides no curation methodology, no explanation of what earns or loses a resource a spot, and no specific examples. AI models asked "who curates Design Index and how?" will find the answer thin.

**Fix:** Expand to 600–900 words. Add a section explaining specific criteria for inclusion and removal. Add concrete examples ("I removed X when they switched to subscription-only pricing"). This is also the page most likely to be cited when AI models answer questions about design resource curation.

### 16. No `twitter:site` in Twitter Card meta tags

`@matthewcrtv` is used across the site and in schema but is absent from the Twitter Card meta tags.

**Fix:** Add `<meta name="twitter:site" content="@matthewcrtv">` to all three pages.

### 17. No `ItemList` schema for the resource directory

Design Index is functionally a curated list. `ItemList` with `ListItem` entries is the schema type designed for this — it communicates the directory's scope even without solving JS rendering.

**Fix:** Add to index.html, populated with the 5 featured resources:
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Curated Graphic Design Resources",
  "numberOfItems": 120,
  "itemListOrder": "https://schema.org/ItemListUnordered",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Resource Name", "url": "https://...", "description": "..." }
  ]
}
```

---

## Low Priority Issues

### 18. No `meta name="theme-color"` for mobile browser chrome
Add `<meta name="theme-color" content="#0b0c16">` (dark) to all pages.

### 19. No `foundingDate` on Organization schema
Add the year Design Index launched to improve entity completeness.

### 20. No Wikipedia or Wikidata entry
No Wikipedia article exists for Design Index. Even a Wikidata entity (`Q` item) would establish machine-readable entity recognition. Low feasibility now, but the path is: get one press mention → use it to establish notability → create Wikidata entry.

### 21. No Product Hunt listing
Product Hunt is a domain AI models heavily reference. A listing creates a permanent, citable external URL from a known-authoritative source.

---

## Category Deep Dives

### AI Citability (48/100)

The llms.txt "About" block is citation-ready (73/100): specific statistics (120+ resources, 13 categories, monthly updates), named curator, and curation philosophy. The category taxonomy block (70/100) is well-formatted for AI extraction. The main page's hero tagline (50/100) is passable but generic.

The fundamental problem: the 120+ resource cards — the content most likely to generate AI citations — do not exist in the crawlable HTML. A query like "what are good free design tools?" cannot be answered by citing Design Index because the tools are invisible.

**If `llms-full.txt` existed with all resource names and descriptions, this score would increase to approximately 68/100.**

### Brand Authority (28/100)

| Platform | Status |
|---|---|
| Wikipedia | Absent |
| Reddit | Unverified |
| YouTube | Absent |
| LinkedIn | Conflicted (unrelated company at designindex.xyz occupies the name) |
| Product Hunt | Absent |
| Press/design media | No coverage found |
| Instagram (@matthewcrtv) | Active — consistent attribution |
| Pinterest | Active — consistent attribution |

The @matthewcrtv Instagram and Pinterest presence provides consistent entity attribution across platforms, which is the primary reason this score is not lower. Everything else is absent. The LinkedIn namespace conflict (an unrelated Mumbai company also named "Design Index") creates entity confusion.

**Path to 50+:** One press mention from a recognized design publication + a Product Hunt listing + a LinkedIn company page for designindex.app.

### Content E-E-A-T (58/100)

| Dimension | Score |
|---|---|
| Experience | 17/25 |
| Expertise | 13/25 |
| Authoritativeness | 12/25 |
| Trustworthiness | 15/25 |

The about page narrative is genuinely authentic — "Going down a rabbit hole of type foundries at 12am on a random Tuesday" scores high for experienced-voice specificity. The AI content assessment rates this highly likely human-written. The self-limitation statement ("I'm also just one person. I know I don't see it all.") is an authenticity signal quality raters weight positively.

The primary trust gaps: no privacy policy for email collection, no editorial standards page, no external validation, and no author photo anywhere on the site.

### Technical GEO (74/100)

The highest single-category score. Robots.txt is near-perfect — 12 AI crawlers explicitly permitted. llms.txt is present and well-formed. HTTPS with Vercel edge delivery is solid. The main drags are the JS rendering issue and the missing security headers.

Standout positive: all JSON-LD is server-rendered static HTML in `<head>`. AI crawlers receive schema immediately without executing JavaScript. This is frequently botched by framework-heavy sites.

### Schema & Structured Data (52/100)

4 schema blocks across 3 pages. Format is exclusively JSON-LD (correct). All blocks are static and crawlable. Primary issues: broken SearchAction, wrong logo type, no cross-page `@id` entity linking, missing `ItemList` for the directory, Person schema missing key fields.

### Platform Optimization (48/100)

| Platform | Score | Key Gap |
|---|---|---|
| Google AI Overviews | 52/100 | JS-rendered content not indexable as structured passages |
| Perplexity | 51/100 | No external citations for Perplexity to surface |
| Gemini | 48/100 | No YouTube presence, thin web footprint |
| ChatGPT | 44/100 | JS-rendered content invisible during training-time crawls |
| Bing Copilot | 43/100 | No IndexNow integration, low Bing index presence |

---

## Quick Wins (Implement This Week)

1. **Generate `llms-full.txt` from `resources.js`** — A Node script (~20 lines) can read `resources.js` and write a markdown file listing all 120 resources. This is the highest-ROI single action: no frontend changes, deploys in minutes, makes all resource data accessible to AI crawlers.

2. **Fix the Organization logo** — Create `logo-square.png` (512×512px), update one line in index.html JSON-LD. Takes 15 minutes.

3. **Remove the broken SearchAction** — Delete the `potentialAction` block from the WebSite schema. One edit, no risk, fixes a validation error.

4. **Add `@id` to both Person objects** — Add `"@id": "https://designindex.app/about.html#matthew-pahl"` to the founder in index.html and the about Person in about.html. Closes the entity linking gap.

5. **Add `<lastmod>` to sitemap.xml** — Add today's date to all three entries. 3-line edit.

6. **Add `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`** — One line, small LCP improvement.

7. **Add `twitter:site` meta tag** — One line on each page.

8. **Add security headers via vercel.json** — 10-line `vercel.json` change, deploys instantly.

---

## 30-Day Action Plan

### Week 1: Data Visibility
- [ ] Write Node script to generate `llms-full.txt` from `resources.js`
- [ ] Deploy `llms-full.txt` and link from `llms.txt`
- [ ] Add static HTML resource listing to `<noscript>` block (expand to all 120 resources)
- [ ] Add `<lastmod>` dates to `sitemap.xml`
- [ ] Fix Organization logo (create `logo-square.png`)

### Week 2: Schema Cleanup
- [ ] Remove broken `SearchAction` from WebSite schema
- [ ] Add `@id` to both Person instances across all pages
- [ ] Add `publisher: { "@id": "#organization" }` to about.html and newsletter.html
- [ ] Expand Organization `sameAs` (add LinkedIn, Beehiiv URL)
- [ ] Add `description`, `image`, `knowsAbout` to Person on about.html
- [ ] Add `ItemList` schema to index.html with 5 featured resources
- [ ] Add BreadcrumbList to about.html and newsletter.html

### Week 3: Trust & Content
- [ ] Create `/privacy.html` (minimal privacy policy), link from all footers
- [ ] Expand about.html to 600–900 words with explicit curation criteria section
- [ ] Add `twitter:site` meta tag to all three pages
- [ ] Add security headers to `vercel.json`
- [ ] Add `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
- [ ] Resolve apex/www canonical conflict (choose one, update all references)

### Week 4: Brand Authority
- [ ] Submit Design Index to Product Hunt
- [ ] Submit to 3–5 design resource directories (Heydesigner, Undesign, Designresourc.es)
- [ ] Create a LinkedIn company page for designindex.app (disambiguates from designindex.xyz conflict)
- [ ] Create Wikidata entity for Design Index (low notability requirements vs. Wikipedia)
- [ ] Pitch one short feature or mention to a design newsletter (Typewolf, Creative Boom, etc.)
- [ ] Post one Twitter/X thread using the resource data (drives indexed citations)

---

## Appendix: Pages Analyzed

| URL | Title | Key GEO Issues |
|---|---|---|
| https://designindex.app/ | Design Index — Curated Graphic Design Resources | JS-rendered content invisible, broken SearchAction, wrong logo, missing ItemList schema |
| https://designindex.app/about.html | About — Design Index | Thin at 310 words, Person missing @id/image/description, no publisher reference |
| https://designindex.app/newsletter.html | The Creative Mix — Newsletter by Design Index | Generic WebPage type, no author/publisher links, no privacy policy |
