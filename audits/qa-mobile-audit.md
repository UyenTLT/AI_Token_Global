# AI Token Global — QA & Mobile Display Audit
**Date:** 2026-05-08 | **Scope:** Responsive behavior, mobile navigation, touch targets, CLAUDE.md drift, accessibility, interactive states
**Prior audit:** FIRST RUN — this specialist fills a gap not covered by the May 7 audit.
**Audit method:** Code analysis via file reads and grep; no live browser testing (site not deployed).

---

## 1. Headline

- **Mobile navigation is completely broken:** A CSS `!important` rule in `global.css` overrides the JavaScript that tries to show the nav menu — tapping the hamburger button does nothing on any phone or tablet.
- **All CSS is desktop-first, violating CLAUDE.md's declared "mobile-first" principle** — every `@media` query across all files uses `max-width` (override-down), not `min-width` (enhance-up).
- **Four conflicting breakpoint values** (480px, 640px, 768px, 900px, 1023px) are scattered across five files with no shared constants — Task #5 standardization is urgent.
- **Two animations violate the `transform`/`opacity`-only rule:** `transition: width` on the blog reading bar, `transition: max-height` on the FAQ accordion — both will cause janky paint on mobile.
- **The AI Trends FAQ accordion is also broken:** the JS adds class `.open` but the CSS only styles `display: none → block`; the `max-height` transition never fires and the panel never opens.

---

## 2. Pre-Launch Blocking Checklist

| # | Item | Severity | Location | Status | Fix |
|---|------|----------|----------|--------|-----|
| Q-01 | Mobile menu button opens the nav | **Blocker** | `src/styles/global.css` line 277; `src/components/Nav.astro` lines 118–130 | **FAIL** | Remove `!important` from `.desktop-nav { display: none !important }` or switch to a class-toggle approach instead of `style.display` |
| Q-02 | Mobile nav panel has a proper drawer layout | **Blocker** | `src/components/Nav.astro` (no mobile-layout styles) | **FAIL** | Add mobile nav drawer styles (full-width, stacked links, visible panel) separate from the desktop flex row |
| Q-03 | FAQ accordion opens on click | **Blocker** | `src/pages/[lang]/ai-trends.astro` lines 293–297; `toggleFaq()` function | **FAIL** | Align JS and CSS: either use `.open` class with a `max-height` CSS rule, or toggle `display: none/block` without `max-height` transition |
| Q-04 | No horizontal scroll on any viewport | **Blocker** | Footer + global layout | **Needs verification** | Audit `overflow-x` after fixing nav; add `overflow-x: hidden` to `body` if any child overflows |
| Q-05 | Hamburger button hit area ≥ 44×44px | **High** | `src/components/Nav.astro` (button ~38px) | **FAIL** | Add `min-width: 44px; min-height: 44px` to `#mobile-menu-btn` |
| Q-06 | No `transition-all` anywhere | **High** | All `.astro` and `.css` files | **PASS** (0 matches found) | — |
| Q-07 | Only `transform`/`opacity` animated | **High** | `src/pages/[lang]/blog/[slug].astro` line ~62; `src/pages/[lang]/ai-trends.astro` line ~295 | **FAIL** | Blog bar: replace `transition: width` with `transform: scaleX()`; FAQ: remove `max-height` transition, use JS height animation or `details/summary` |
| Q-08 | Mobile-first CSS (`min-width` queries) | **High** | All files — 12 `@media (max-width:...)`, zero `@media (min-width:...)` | **FAIL** | Refactor to mobile-first in `global.css` as part of standardization (see Section 6) |
| Q-09 | Every clickable element has `:active` state | **High** | `global.css` `.dropdown-item` (no `:active`); `ai-trends.astro` `.faq-question` (no `:active`) | **FAIL** | Add `:active` state to all interactive elements — see below |
| Q-10 | Body text ≥ 14px on mobile | **High** | `src/styles/global.css` — body font-size | **Pass** (16px base) | — |
| Q-11 | Headings scale down for mobile | **Medium** | `src/components/Nav.astro`, page templates | **Needs verification** | Verify Kanit heading reduces from ~48px desktop to ~32px at 390px |
| Q-12 | Footer WCAG AA color contrast | **High** | `src/components/Footer.astro` — `#666` text on `#1C1C1C` background | **FAIL** | `#666` on `#1C1C1C` ≈ 3.0:1; needs ≥4.5:1. Use `#999` or lighter for footer secondary text |
| Q-13 | Blog images have `width`/`height` or `aspect-ratio` | **High** | `src/pages/[lang]/blog/[slug].astro` — raw `<img>` without sizing | **FAIL** | Add `width` and `height` attrs or `aspect-ratio` CSS to prevent CLS |
| Q-14 | Google Fonts non-blocking | **High** | `src/styles/global.css` — `@import url('https://fonts.googleapis.com/...')` | **FAIL** | Move to `<link rel="preconnect">` + `<link rel="stylesheet">` in `BaseLayout.astro` `<head>` |
| Q-15 | Tailwind CDN script is not render-blocking | **Medium** | `src/layouts/BaseLayout.astro` — `<script src="https://cdn.tailwindcss.com">` without `defer` | **FAIL** | Add `defer` or move to bottom of `<body>`; note that CDN Tailwind is not production-appropriate |
| Q-16 | `prefers-reduced-motion` respected | **Medium** | `src/styles/global.css` — no `@media (prefers-reduced-motion)` block | **FAIL** | Wrap blob and scroll animations in `@media (prefers-reduced-motion: no-preference)` |
| Q-17 | Footer two-column → one-column collapse | **Medium** | `global.css` 640px rule vs. `Footer.astro` scoped `!important` at 768px | **FAIL** | Consolidate: remove scoped `!important` from Footer; centralize breakpoint in `global.css` |
| Q-18 | ARIA labels on icon-only buttons | **Medium** | `src/components/Nav.astro` `#mobile-menu-btn` | **Pass** (`aria-label="Toggle mobile menu"`) | — |
| Q-19 | Visible focus indicators (no bare `outline: none`) | **Medium** | `src/styles/global.css` | **Pass** (no bare suppression found) | — |
| Q-20 | Input `font-size` ≥ 16px (prevents iOS zoom) | **Low** | No form inputs exist yet | **N/A** | Enforce when newsletter/contact forms are added |

---

## 3. Detailed Finding Notes

### Q-01 / Q-02 — Mobile navigation completely broken

**Root cause:** `src/styles/global.css` line ~277:
```css
.desktop-nav {
  display: none !important;  /* hides nav at mobile widths */
}
```

`Nav.astro` script (lines ~118–130) does:
```js
nav.style.display = 'flex';  /* inline style — NOT !important */
```

Per the CSS cascade: stylesheet `!important` beats inline non-`!important`. The menu can never open.

**Fix option A (minimal — recommended for now):**
```css
/* global.css — remove !important */
.desktop-nav {
  display: none;
}
/* Add: */
.desktop-nav.is-open {
  display: flex;
  flex-direction: column;
  /* mobile drawer styles */
}
```
```js
// Nav.astro script
btn.addEventListener('click', () => nav.classList.toggle('is-open'));
```

**Fix option B (proper mobile drawer — recommended before launch):**
Replace `.desktop-nav` show/hide with a dedicated `<nav class="mobile-nav">` overlay with position: fixed, z-index above header, full-width stacked links.

---

### Q-07 — Illegal CSS transitions

**Blog reading progress bar** (`src/pages/[lang]/blog/[slug].astro` line ~62):
```css
transition: width 0.1s linear;
```
`width` transitions trigger layout, causing paint on every scroll event. On mobile, this visibly lags.

**Fix:**
```css
transform-origin: left center;
transition: transform 0.1s linear;
/* Update JS to use: el.style.transform = `scaleX(${progress})` */
```

**AI Trends FAQ** (`src/pages/[lang]/ai-trends.astro` line ~295):
```css
max-height: 0;
transition: max-height 0.3s ease;
/* .open: max-height: 1000px */
```
The JS adds class `.open` but only `.faq-answer { display: block }` is styled on `.open` — the `max-height` is on `.faq-answer` itself without `.open`. The transition never fires; the panel stays hidden.

**Fix (simplest):**
```js
// Replace max-height approach with direct height animation
btn.addEventListener('click', () => {
  const panel = btn.nextElementSibling;
  const isOpen = panel.style.maxHeight;
  panel.style.maxHeight = isOpen ? '' : panel.scrollHeight + 'px';
});
```
```css
.faq-answer {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s ease;
  /* Remove display:none */
}
```

---

## 4. Post-Launch Optimization Roadmap

| Priority | Item | Effort | Expected Impact |
|----------|------|--------|----------------|
| 1 | Run Lighthouse mobile preset on production after deploy | 1 hr | Baseline CWV scores; identify LCP element |
| 2 | Implement `prefers-reduced-motion` for all animations | M (2–3 hr) | Accessibility compliance; avoids motion sickness issues |
| 3 | Replace raw `<img>` in blog templates with Astro `<Image>` | M (2 hr) | CLS fix; automatic srcset for mobile bandwidth savings |
| 4 | Real-device test: iPhone Safari (latest) and Android Chrome | S (1 hr) | Safari CSS divergence; catch any remaining nav issues |
| 5 | Audit touch target sizes on all CTAs after Task #5 adds new pages | S (1 hr per page) | Prevents mobile UX regressions as page count grows |
| 6 | Add `font-display: swap` verification to Google Fonts link | S (15 min) | Prevents flash of invisible text (FOIT) on slow mobile |
| 7 | Test keyboard navigation across all pages (Tab order) | M (2 hr) | WCAG 2.1 AA compliance; screen reader UX |

---

## 5. CLAUDE.md Drift Report

| Rule (from CLAUDE.md) | Location | Violation | Evidence |
|----------------------|----------|-----------|---------|
| "Never use `transition-all`" | All files | **PASS** — zero matches | `grep -r "transition-all"` returns nothing |
| "Only animate `transform` and `opacity`" | `blog/[slug].astro` line ~62 | **FAIL** — `transition: width` | Reading progress bar |
| "Only animate `transform` and `opacity`" | `ai-trends.astro` line ~295 | **FAIL** — `transition: max-height` | FAQ accordion |
| "Every clickable element needs hover, focus-visible, and active states. No exceptions." | `global.css` `.dropdown-item` | **FAIL** — no `:active` | Missing `:active { background: ... }` |
| "Every clickable element needs hover, focus-visible, and active states. No exceptions." | `ai-trends.astro` `.faq-question` | **FAIL** — no `:active` | Missing `:active` state |
| "Mobile-first responsive" | All files (12 `@media (max-width:...)`, 0 `@media (min-width:...)`) | **FAIL** — all CSS is desktop-first | Entire responsive system is override-down, not enhance-up |
| "Do not use `transition-all`" | (same as first rule) | **PASS** | — |

---

## 6. Responsive Breakpoint Inventory

Current breakpoints found across the codebase:

| Breakpoint | Files That Use It | Purpose | In `global.css`? |
|-----------|------------------|---------|-----------------|
| 480px | `Footer.astro` | Footer single-column collapse | ❌ No |
| 640px | `global.css` | General mobile adjustments | ✅ Yes |
| 768px | `ai-trends.astro`, `Footer.astro` | Grid collapse (AI Trends), footer layout | ❌ No |
| 900px | `global.css` | Tablet adjustments | ✅ Yes |
| 1023px | `global.css`, `Nav.astro` | Desktop nav breakpoint | ✅ Yes |
| 1280px | None currently | (common desktop width — unused) | ❌ No |

**Problem:** Four breakpoint values (480, 768) only exist in component-level styles, not in `global.css`. When Task #5 adds 10 more pages, each author will pick arbitrary values. After 11 pages, the codebase will have 20+ different breakpoints with no coherent system.

---

## 7. Standardization Proposal

**Justification:** Task #5 will replicate the AI Trends pattern across 10 pages plus the homepage. Every ad-hoc responsive pattern fixed today is fixed once. After Task #5, the same fix costs 11×. This is a 30-minute change with 11× leverage.

### Proposed addition to `src/styles/global.css`

```css
/* ============================================================
   RESPONSIVE SYSTEM — add at top of global.css, before all rules
   All @media queries across the project must use these values.
   Do not introduce new breakpoint values in component files.
   ============================================================ */

:root {
  /* Breakpoint reference values (for documentation — CSS can't use custom props in @media) */
  /* --bp-mobile:  640px  — single-column, mobile nav, stacked layout  */
  /* --bp-tablet:  1024px — 2-column grids, expanded nav               */
  /* --bp-desktop: 1280px — 3-column grids, max-width containers        */
}

/* ── Grid utilities ─────────────────────────────────────────── */
/* Mobile-first: single column by default, widen at breakpoints  */

.grid-auto-3 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 640px) {
  .grid-auto-3 { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .grid-auto-3 { grid-template-columns: repeat(3, 1fr); }
}

.grid-auto-2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 640px) {
  .grid-auto-2 { grid-template-columns: repeat(2, 1fr); }
}

/* ── Container ───────────────────────────────────────────────── */
.container-page {
  width: 100%;
  max-width: 1280px;
  margin-inline: auto;
  padding-inline: 1rem;
}
@media (min-width: 640px) {
  .container-page { padding-inline: 1.5rem; }
}
@media (min-width: 1024px) {
  .container-page { padding-inline: 2rem; }
}

/* ── Typography scale ────────────────────────────────────────── */
.heading-display {
  font-size: clamp(2rem, 5vw, 3.5rem);   /* 32px → 56px */
  line-height: 1.1;
  letter-spacing: -0.03em;
}
.heading-section {
  font-size: clamp(1.5rem, 3vw, 2.25rem); /* 24px → 36px */
  line-height: 1.2;
}

/* ── Mobile navigation ───────────────────────────────────────── */
/* Desktop nav: hidden on mobile */
.desktop-nav {
  display: none;
}
@media (min-width: 1024px) {
  .desktop-nav { display: flex; }
}

/* Mobile nav: hidden on desktop */
#mobile-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
}
@media (min-width: 1024px) {
  #mobile-menu-btn { display: none; }
}

/* Mobile nav panel */
.mobile-nav-panel {
  display: none;
  position: fixed;
  inset: 0;
  top: 64px; /* header height */
  background: var(--color-surface);
  z-index: 50;
  flex-direction: column;
  padding: 1.5rem;
  gap: 1rem;
}
.mobile-nav-panel.is-open {
  display: flex;
}
@media (min-width: 1024px) {
  .mobile-nav-panel { display: none !important; }
}
```

### How to use in page templates (replaces inline `style="display:grid;..."`)

```astro
<!-- BEFORE (current ai-trends.astro pattern): -->
<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;">

<!-- AFTER (standardized): -->
<div class="grid-auto-3">
```

### Update `CLAUDE.md` (add under "Output Defaults")

```markdown
## Responsive System
- Use the three breakpoints defined in `src/styles/global.css`: 640px (mobile), 1024px (tablet), 1280px (desktop)
- Write `@media (min-width: ...)` queries only (mobile-first). Never `@media (max-width: ...)`.
- Use `.grid-auto-3`, `.grid-auto-2`, `.container-page` utility classes instead of inline grid styles
- Do not introduce new breakpoint pixel values in component files
```
