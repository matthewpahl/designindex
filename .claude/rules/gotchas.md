---
description: Known pitfalls, workarounds, and non-obvious behaviors in this codebase
alwaysApply: true
---

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

## Infinite scroll loops: use `margin-bottom` not `gap`

For seamless CSS infinite scroll (e.g. `.testi-track`), never use `gap` on the track container. CSS `gap` creates N-1 gaps for N items — the last item has no gap after it — so when the `translateY(-50%)` loop wraps, there's a visible 1-gap jump at the seam.

**Fix:** Use `margin-bottom` on each card instead. This creates N gaps (one per card including the last), so the total height divides perfectly in half and the loop is seamless.
