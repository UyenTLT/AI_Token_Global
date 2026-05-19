# AI Token King — Project Session Summary

## Current Project State (May 2026)

**Done**
- HTML prototype complete and archived in `archive/`
- Repo on GitHub (`antonioduran-insight/AI_Token_Global`), Astro project at repo root
- Sanity CMS connected (project `mq3wxr8n`, dataset `production`)
- Dynamic `[lang]` routing — `/en/` and `/es/` for all pages
- Language switcher in Nav — dynamically loops `SUPPORTED_LANGS`
- Blog routes working: `/en/blog`, `/es/blog`, `/en/blog/[slug]`; three EN posts live in Sanity
- All 11 content pages built in Astro and **fully populated in Sanity — EN + ES live for every page**
- i18n complete — ~60+ keys across all namespaces, all hardcoded UI strings replaced with `t()` calls
- Sanity schema deployed to `aitokenglobal.sanity.studio`
- Translation pipeline working via `scripts/translate-page.mjs` using AI Token King API key
- All pre-flight tasks complete (SEO, canonical/hreflang, sitemap, robots.txt, mobile nav, a11y)
- Deployed to AWS Amplify — auto-rebuilds on every push to `main`

**Sanity content status — all pages EN + ES live**

| Page | EN | ES |
|---|---|---|
| homePage | ✅ | ✅ |
| aiTrendsPage | ✅ | ✅ |
| apiComparePage | ✅ | ✅ |
| beginnersGuidePage | ✅ | ✅ |
| chatgptApiPage | ✅ | ✅ |
| claudeApiPage | ✅ | ✅ |
| geminiApiPage | ✅ | ✅ |
| compliancePage | ✅ | ✅ |
| tokenCalculatorPage | ✅ | ✅ |
| useCasesPage | ✅ | ✅ |
| userGuidePage | ✅ | ✅ |

**Remaining gaps**
- `aiTrendsPage` — `downloadUrl` is blank on both EN + ES (null guard hides the card until a real PDF URL is added)
- Blog posts — only 3 EN posts live; no ES blog posts yet
- No language 3+ yet (blocked until translation pipeline is validated at scale)

**Next, in order**
1. Add real `downloadUrl` to aiTrendsPage in Sanity Studio (EN), then re-run translate pipeline for ES
2. Enter ES blog post translations (or run translate pipeline on blog post ndjson files)
3. Task #8 remainder — Sanity webhook for Amplify (auto-rebuild on content publish), budget alarm
4. Task #9 polish — Astro `<Image>` migration, Tailwind CDN → build-step, font preconnect, JSON-LD, Lighthouse mobile baseline
5. Task #11 — Operations safety net: weekly Sanity backup, pre-commit secret block
6. Task #10 — Scale to languages 3–15

---

## Repo Structure (current)

```
aitokenglobal/              ← repo root = Astro project
  src/
    components/
      Nav.astro             ← dynamic lang switcher, mobile nav panel, hamburger toggle
      Footer.astro          ← lang-aware, contrast-fixed (#999 on dark bg), no scoped <style>
      ApiModelPage.astro    ← shared template for chatgpt-api / claude-api / gemini-api
    i18n/
      en.json               ← all EN UI strings (~60+ keys across all namespaces)
      es.json               ← all ES UI strings (mirrors en.json)
      index.ts              ← useTranslations(), SUPPORTED_LANGS, LANG_META, isValidLang()
    layouts/
      BaseLayout.astro      ← canonical, hreflang, OG tags, Google Fonts <link>
    lib/
      sanity.ts             ← Sanity client, all GROQ fetchers + TypeScript interfaces
    pages/
      index.astro           ← / → 301 redirect to /en/
      [lang]/
        index.astro         ← homepage — 8 sections, Sanity-powered with i18n fallback
        ai-trends.astro     ← Sanity-powered, EN + ES live
        api-compare.astro
        chatgpt-api.astro
        claude-api.astro
        gemini-api.astro
        beginners-guide.astro
        user-guide.astro
        use-cases.astro
        token-calculator.astro  ← calc widget hardcoded JS; FAQ/CTA from Sanity
        compliance.astro
        blog/
          index.astro
          [slug].astro
    styles/
      global.css            ← full design system (vars, buttons, cards, animations, prose,
                               mobile nav panel, faqReveal keyframe, prefers-reduced-motion)
  studio/
    schemas/
      post.ts
      aiTrendsPage.ts       ← includes downloadTitle, downloadMeta, downloadUrl fields
      faqItem.ts
      imageMeta.ts
      apiModelPage.ts
      apiComparePage.ts
      beginnersGuidePage.ts
      userGuidePage.ts
      useCasesPage.ts
      tokenCalculatorPage.ts
      compliancePage.ts
      homePage.ts           ← includes tokenBody2 (portable text) field
    sanity.config.ts        ← registers all 12 schema types
    sanity.cli.ts
  scripts/
    import-home.mjs         ← generates homePage-en.ndjson (includes tokenBody2)
    import-ai-trends.mjs    ← generates aiTrendsPage-en.ndjson (includes download card fields)
    translate-page.mjs      ← translates any *-en.ndjson → target lang via AI Token King API
    data/                   ← all EN + ES ndjson files for every page
  public/
    AI_Token_logoPNG.avif
    robots.txt
  audits/
    hardcoded-content-audit.md  ← all items resolved as of 2026-05-18
  archive/                  ← all 14 HTML prototypes + scripts + brand images
  astro.config.mjs          ← site URL set, @astrojs/sitemap integration
  go-live-guide.md
  summary.md
```

---

## What This Site Is

An English-language information hub for anyone learning about AI — tokens, models, APIs, aggregators, costs, etc. The Chinese version of the site (`aitoken.com.tw`) is the content source; we translate and adapt it for a Western audience with a redesigned look. Will eventually support 10–15 languages.

---

## Brand Guidelines

- **Brand name:** AI Token King
- **Mascot/Logo:** Cute corgi with a crown (`AI_Token_logoPNG.avif`) — always use this, never a placeholder
- **Primary color:** `#6155F1` (purple)
- **Secondary accent:** `#3E81E5` (blue)
- **Near black (text):** `#000000` / `#1C1C1C`
- **Medium gray:** `#666666`
- **Lighter gray:** `#999999`
- **Light gray bg:** `#EBF4FF`
- **Gradient:** `#F1F1FF` → `#56F7FD` (for banners/special sections)
- **White:** `#FFFFFF`
- **Lavender bg:** `#F5F2FF` (default page background)
- **Soft purple:** `#E2DFFE` (pills, hover states)
- **Dark purple:** `#3C315B` (subheadings, nav text)
- **Heading font:** `Kanit` (weights 400–800, Google Fonts)
- **Body font:** `Plus Jakarta Sans` (weights 400–700, Google Fonts)
- **Buttons:** Rounded corners (12px), clean minimal, subtle shadows, all interactive states required
- **Icons:** Line-style, rounded, minimal

---

## Design System (from global.css)

- Page background: `#F5F2FF`
- Grain texture overlay via SVG noise filter (body::before, z-index 9999, pointer-events none)
- Layered radial gradient hero backgrounds — never flat colors
- **Cards:** white bg, 16px border-radius, purple-tinted shadow, hover lift (-4px translateY)
- **Elevated cards:** 20px border-radius, slightly stronger shadow, no hover lift
- **Trend cards:** white bg, 16px border-radius, 4px colored left border accent, hover lift
- **Section label pills:** `#E2DFFE` bg, `#6155F1` text, uppercase, 100px border-radius
- **Buttons:** `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-download` — all defined in `global.css`
- **Animations:** `fadeUp` keyframe (page load) + `.reveal` class via IntersectionObserver — only `transform` and `opacity`
- **FAQ accordion:** `.faq-answer` / `.faq-answer.open` — toggled via `window.toggleFaq()`, animated via `faqReveal` keyframe. Never `max-height` transitions.
- **Mobile nav:** `.mobile-nav-panel` + `.is-open` class (opacity/pointer-events toggle). Never toggle `.desktop-nav` via JS.
- **Progress bar:** `transform: scaleX()` + `transform-origin: left` — never `width` transition
- **Typography:** Kanit headings with `-0.03em` to `-0.04em` tracking, Plus Jakarta Sans body at `1.7–1.8` line-height
- **Prose via set:html:** Must use `:global()` CSS selectors — Astro scoping does not apply to `set:html`-injected content

---

## Translation Pipeline

**Script:** `scripts/translate-page.mjs`
- Uses AI Token King API (`https://api.aitokenking.com.tw/api`) with `Authorization: Bearer sk-...`
- Model: `claude-sonnet-4.6` (note: dot not dash — aggregator format)
- Set key via `AI_TOKEN_KING_KEY=sk-...` env prefix
- Batches 80 strings per Claude call, preserves portable text structure, skips URLs/colors/numbers

**Workflow for any new page or field:**
```bash
# 1. Generate or update the EN ndjson
node scripts/import-home.mjs   # or import-ai-trends.mjs, or edit scripts/data/*-en.ndjson directly

# 2. Import EN to Sanity
cd studio && npx sanity dataset import ../scripts/data/PAGE-en.ndjson production --replace

# 3. Translate to ES
AI_TOKEN_KING_KEY=sk-... node scripts/translate-page.mjs scripts/data/PAGE-en.ndjson es

# 4. Import ES to Sanity
cd studio && npx sanity dataset import ../scripts/data/PAGE-es.ndjson production --replace
```

---

## Navigation Structure

| Item | Route |
|---|---|
| AI Trends | `/{lang}/ai-trends` |
| AI Token King User Guide | `/{lang}/user-guide` |
| Business AI Compliance | `/{lang}/compliance` |
| Compare Models | `/{lang}/api-compare` |
| Use Cases | `/{lang}/use-cases` |
| Beginners Guide | `/{lang}/beginners-guide` |
| Blog | `/{lang}/blog` |
| Documentation | `https://www.aitokenking.com.tw/docs` (new tab) |
| Get Started | `https://www.aitokenking.com.tw/home` (new tab) |

---

## Dev Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start Astro dev server → `http://localhost:4321` |
| `npm run build` | Build static site (fetches latest from Sanity) |
| `npx astro preview --port 3000` | Preview built `dist/` locally |
| `cd studio && npm run dev` | Start Sanity Studio → `http://localhost:3333` |
| `cd studio && npx sanity deploy` | Deploy schema changes to hosted Studio |

**Build note:** Run `npm run build` from `/Users/antonioduran/Desktop/aitokenglobal` (repo root), never from inside `studio/`.

---

## Task Tracker

| # | Task | Status |
|---|---|---|
| 0a–0f | Pre-flight (env, SEO, canonical, sitemap, i18n, mobile/a11y) | ✅ Done |
| 1 | Restructure repo: Astro to root, archive HTML prototype | ✅ Done |
| 2 | Fix Nav language switcher to be dynamic | ✅ Done |
| 3–4 | Sanity schema POC (AI Trends) + EN/ES content | ✅ Done |
| 5 | Port all 10 remaining pages to Astro | ✅ Done |
| 6 | Enter EN + ES content into Sanity for all pages | ✅ Done |
| 7 | Update `go-live-guide.md` for AWS Amplify | ✅ Done |
| 8 | Deploy to AWS Amplify | ✅ Live — Sanity webhook + budget alarm pending |
| 9 | SEO basics (sitemap, meta, OG, robots.txt) | ✅ Done — Astro Image + JSON-LD polish pending |
| i18n | Replace all hardcoded strings with t() calls | ✅ Done (2026-05-18) |
| schema | Add deferred Sanity fields (tokenBody2, download card) | ✅ Done (2026-05-18) |
| 10 | Scale to languages 3–15 | ⏳ Pending |
| 11 | Operations safety net (weekly backup, pre-commit secret block) | ⏳ Pending |
| 12 | Blog content pipeline — Make scenario + import scripts | ⏳ In progress — scripts done, Make setup in progress |
| 13 | Blog category filter tabs on blog index page (`/[lang]/blog`) | ⏳ Pending — `category` field live in Sanity, frontend wiring needed |

---

## Important Rules (from CLAUDE.md)

- Invoke the `frontend-design` skill before writing any frontend code, every session
- Dev server for Astro: `npm run dev` → `http://localhost:4321`
- Screenshots: `node screenshot.mjs http://localhost:4321/en/page label`
- The VSCode Read tool does NOT render PNG images — audit via Puppeteer `page.evaluate()` instead
- Never use default Tailwind blue/indigo — use brand `#6155F1` purple
- Never `transition-all` — only animate `transform` and `opacity`
- Kanit headings, Plus Jakarta Sans body — never the same font for both
- Mobile nav: `.mobile-nav-panel` + `.is-open` class toggle — never toggle `.desktop-nav` via JS
- FAQ accordion: `window.toggleFaq()` + `.open` class — never `max-height` transitions
- Footer breakpoints in `global.css` only (900px/640px) — no scoped `<style>` in Footer.astro
- `prefers-reduced-motion` block lives in `global.css` — all new animations must be covered there
- Google Fonts loaded via `<link>` in `BaseLayout.astro` only — no `@import` in CSS files
