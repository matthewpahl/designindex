---
description: Known pitfalls, workarounds, and non-obvious behaviors in this codebase
alwaysApply: true
---

## Twemoji intercepts Unicode emoji characters

Any Unicode emoji (including arrows like `↗` U+2197, stars like `✦`, etc.) inside an element that `twemoji.parse()` has processed will be replaced with `<img>` tags pointing to CDN SVGs. This often produces unexpected results — blue emoji squares for arrow characters, off-brand icons, wrong sizes.

**Rule:** Never use raw Unicode emoji characters inside card templates or any HTML rendered by JS. Use inline SVG for icons and arrows. Only use Unicode emoji in CATEGORIES data (they render correctly in section headings via the intentional `parseEmoji()` call).

## Chrome headless screenshots: always use `--force-device-scale-factor=1`

On macOS with a Retina display, Chrome headless defaults to the system's 2× DPR. A `--window-size=1280,900` screenshot will behave as if the viewport is 640×450, causing text to wrap, layouts to stack, and the page to look broken.

**Fix:** Always include `--force-device-scale-factor=1` in headless screenshot commands:
```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --force-device-scale-factor=1 --screenshot="screenshot.png" --window-size=1280,900 "file://$(pwd)/index.html"
```

## Image filenames must be lowercase

The `cardHTML()` function looks for `images/{resource.id}.jpg`. Resource IDs are lowercase kebab-case. On macOS (case-insensitive filesystem) `ARTVEE.jpg` and `artvee.jpg` are the same file — but on Linux servers (Vercel, Netlify) they are different. Always name image files with **lowercase** matching the resource `id`.

## IntersectionObserver doesn't fire in headless screenshots

Cards start at `opacity: 0` and are animated in by `observeCards()` via IntersectionObserver. In headless Chrome (static screenshots), the IO never fires, so all cards appear invisible. This is **expected behavior** — not a bug. The cards display correctly in real browsers. Do not "fix" this by changing the default opacity.

## CSS `animation` overrides `transition` for the same property

Cards use `@keyframes cardIn` for the entrance animation (opacity, translateY). On `.rcard:hover`, a separate CSS transition handles the lift. These work together because hover applies `transition` to `transform` and `box-shadow`, while `animation` drives opacity/translateY only during entrance. If you add `animation` to any property that also has a hover `transition`, the animation will win and the hover effect will be suppressed.

## `parseEmoji()` must be called after every dynamic render

`twemoji.parse()` only processes the DOM nodes present at call time. If you render new HTML into the DOM after `parseEmoji()` runs, the new nodes won't have emoji replaced. Always call `parseEmoji(container)` on the container element immediately after writing new innerHTML that may contain emoji.

## `img.emoji` requires `display: inline-block`

Twemoji replaces emoji characters with `<img class="emoji">` tags. These images must have `display: inline-block` to sit inline with adjacent text in all browsers — without it, pills and headings will stack the emoji above the label text. Do not remove this property during refactors even though `<img>` is technically an inline replaced element by default.

## Nav and footer logo icons are `<img>` tags, not emoji characters

The nav logo icon and footer logo icon are `<img>` elements pointing directly to the Twemoji CDN SVG (`https://twemoji.maxcdn.com/v/latest/svg/1f5c2.svg`). They are **not** Unicode emoji characters and are **not** processed through `twemoji.parse()`. Do not replace them with the `🗂️` Unicode character — it would render as the OS native emoji (inconsistent across platforms) or as a Twemoji `<img>` only if `parseEmoji()` is explicitly called on the nav, which it isn't. The favicon uses the same SVG inlined as a data URL in `<link rel="icon">`.
