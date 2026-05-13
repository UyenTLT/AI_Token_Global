# AI Token King — Project Session Summary

## Current Project State (May 2026)

**Done**
- HTML prototype complete and archived in `archive/`
- Repo on GitHub (`antonioduran-insight/AI_Token_Global`), Astro project at repo root
- Sanity CMS connected (project `mq3wxr8n`, dataset `production`)
- Dynamic `[lang]` routing — `/en/` and `/es/` for all pages
- Language switcher in Nav — dynamically loops `SUPPORTED_LANGS`; adding a language requires one constant + Sanity content
- Blog routes working: `/en/blog`, `/es/blog`, `/en/blog/[slug]`; three EN posts live in Sanity
- AI Trends page fully built: `/en/ai-trends` and `/es/ai-trends` — Sanity-powered, content-complete
- `go-live-guide.md` updated for AWS Amplify (Phase 6)
- **Pre-flight #0a:** `.env` removed from git, `.gitignore` updated
- **Pre-flight #0b:** `seo` object added to all Sanity schemas (`aiTrendsPage`, `post`, `apiModelPage`, `apiComparePage`)
- **Pre-flight #0c:** `BaseLayout.astro` hardened — canonical, hreflang (EN↔ES), OG tags, noindex flag
- **Pre-flight #0d:** `@astrojs/sitemap` installed, `astro.config.mjs` updated with `site:` URL, `public/robots.txt` created
- **Pre-flight #0e:** EN/ES delocalization — `LANG_META` with `locale` field, dynamic `language` list in `post.ts`
- **Pre-flight #0f:** Visual/Mobile/A11y system — mobile nav rebuilt (opacity/pointer-events toggle), FAQ accordion fixed (`window.toggleFaq`, `faqReveal` keyframe), progress bar switched to `transform: scaleX()`, Footer contrast fixed (`#666` → `#999`), `prefers-reduced-motion` block added to `global.css`, `CLAUDE.md` responsive rules documented
- **Task #5 Batch A (code complete):** All 4 API pages ported to Astro — `api-compare`, `chatgpt-api`, `claude-api`, `gemini-api`; schemas built (`apiModelPage`, `apiComparePage`); shared `ApiModelPage.astro` template; thin page wrappers; GROQ fetchers in `sanity.ts`
- **chatgpt-api EN content:** Sanity document published and verified — page builds to 43 KB with 7 article sections, 4 FAQs, sidebar with TOC + compare card
- **Task #5 Batch B (code complete):** All 5 guide pages ported to Astro — `beginners-guide`, `user-guide`, `use-cases`, `token-calculator`, `compliance`; 5 Sanity schemas created and registered; GROQ fetchers + TypeScript interfaces added to `sanity.ts`; `common.onThisPage` i18n key added to EN + ES; `npm run build` passes (28 pages, 0 errors)
- **Task #5 Batch C (code complete):** Homepage (`/en/`, `/es/`) fully ported — 8 sections (Hero with animated blobs, Token Explainer, 8 Topics grid, API Chooser, Comparison Table, 3 Steps, Blog Placeholders, FAQ accordion); `homePageSchema` added to Sanity (`studio/schemas/homePage.ts`); `getHomePage()` GROQ fetcher + `HomePageData` interface added to `sanity.ts`; `home` i18n namespace (~60 keys) added to `en.json` + `es.json`; Sanity fallback to i18n strings so page renders without a CMS document; `noindex: false` default; `npm run build` passes (28 pages, 0 errors); DOM audit passes all 12 checks for both EN + ES

**In progress / remaining for Task #5**
- Enter EN content for `claude-api`, `gemini-api`, `api-compare` in Sanity (Batch A)
- Enter EN content for all 5 Batch B pages in Sanity
- Enter EN + ES homepage content in Sanity (Batch C)
- Enter ES content for all Batch A + Batch B pages
- Phone review of `/en/chatgpt-api/` (pending — user to review before continuing)

**Next, in order** *(updated 2026-05-13)*
1. **Task #5 Batch A content** — enter claude/gemini/api-compare EN content → ES content for all 4
2. **Task #5 Batch B content** — enter EN + ES content for all 5 Batch B pages in Sanity
3. **Task #5 Batch C content** — enter EN + ES homepage content in Sanity
4. **Task #6** — Bulk migration scripts (`upload-images.js`, `convert-articles.js`) plus EN + ES content entry. Parallel to #5. Compresses ~80–120 hr of manual entry into ~10–13 hr.
5. **Task #8** — Deploy to AWS Amplify, env vars, Sanity webhook, debounce + alerts + budget alarm.
6. **Task #9 (remainder)** — Astro `<Image>` migration, Tailwind CDN → build-step, font preconnect, JSON-LD, Lighthouse mobile baseline. Post-deploy polish.
7. **Task #11 (new)** — Operations safety net: weekly Sanity backup, pre-commit secret block.
8. **Task #12 (new)** — AI ops pipeline: translation drafting + alt-text generation *before* language 3.
9. **Task #10** — Scale to languages 3–15. Blocked until Task #0e and Task #12 priority 1 complete.

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
      en.json               ← all EN UI strings
      es.json               ← all ES UI strings
      index.ts              ← useTranslations(), SUPPORTED_LANGS, LANG_META (with locale), isValidLang()
    layouts/
      BaseLayout.astro      ← wraps every page; canonical, hreflang, OG tags, Google Fonts <link>
    lib/
      sanity.ts             ← Sanity client (useCdn: false), getAllPosts, getPostBySlug,
                               getAiTrendsPage, getApiModelPage, getApiComparePage,
                               getBeginnersGuidePage, getUserGuidePage, getUseCasesPage,
                               getTokenCalculatorPage, getCompliancePage, all TS interfaces
    pages/
      index.astro           ← / → 301 redirect to /en/
      [lang]/
        index.astro         ← /en/ and /es/ homepages (DONE — 8 sections, Sanity-powered with i18n fallback)
        ai-trends.astro     ← /en/ai-trends and /es/ai-trends (DONE — Sanity-powered)
        api-compare.astro     ← /en/api-compare (code done, awaiting Sanity content)
        chatgpt-api.astro     ← /en/chatgpt-api (DONE — EN content live)
        claude-api.astro      ← /en/claude-api (code done, awaiting Sanity content)
        gemini-api.astro      ← /en/gemini-api (code done, awaiting Sanity content)
        beginners-guide.astro ← /en/beginners-guide (code done, awaiting Sanity content)
        user-guide.astro      ← /en/user-guide (code done, awaiting Sanity content)
        use-cases.astro       ← /en/use-cases (code done, awaiting Sanity content)
        token-calculator.astro← /en/token-calculator (code done, calc widget hardcoded in Astro)
        compliance.astro      ← /en/compliance (code done, awaiting Sanity content)
        blog/
          index.astro       ← /en/blog and /es/blog
          [slug].astro      ← /en/blog/[slug] and /es/blog/[slug]
    styles/
      global.css            ← full design system (vars, buttons, cards, animations, prose,
                               mobile nav panel, faqReveal keyframe, prefers-reduced-motion)
  studio/
    schemas/
      post.ts               ← blog post schema (title, slug, language, body, etc.)
      aiTrendsPage.ts       ← AI Trends singleton schema (hero, trends, audience, sources, faq)
      faqItem.ts            ← reusable FAQ object type (question + portableText answer)
      imageMeta.ts          ← image asset extension (articleNumber field)
      apiModelPage.ts       ← shared schema for chatgpt/claude/gemini guide pages
      apiComparePage.ts      ← schema for api-compare overview page
      beginnersGuidePage.ts  ← schema for beginners-guide (reading steps, stuck callouts, next reads)
      userGuidePage.ts       ← schema for user-guide (features, models, audience, steps)
      useCasesPage.ts        ← schema for use-cases (9 use-case cards + footer note)
      tokenCalculatorPage.ts ← schema for token-calculator (hero + FAQ + CTA; JS widget is hardcoded)
      compliancePage.ts      ← schema for compliance (blockers, proposal CTA, solutions, audience, roles)
      homePage.ts            ← schema for homepage (hero, stats, FAQ, SEO)
    sanity.config.ts         ← registers all 12 schema types
    sanity.cli.ts
  public/
    AI_Token_logoPNG.avif
    robots.txt              ← Allow: /, Sitemap: .../sitemap-index.xml
  archive/                  ← all 14 HTML prototypes + scripts + brand images
  go-live-guide.md
  summary.md
  astro.config.mjs          ← site URL set, @astrojs/sitemap integration
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

## Design System (from global.css + established in AI Trends page)

- Page background: `#F5F2FF`
- Grain texture overlay via SVG noise filter (body::before, z-index 9999, pointer-events none)
- Layered radial gradient hero backgrounds — never flat colors
- **Cards:** white bg, 16px border-radius, purple-tinted shadow, hover lift (-4px translateY)
- **Elevated cards:** 20px border-radius, slightly stronger shadow, no hover lift
- **Trend cards:** white bg, 16px border-radius, 4px colored left border accent, hover lift
- **Section label pills:** `#E2DFFE` bg, `#6155F1` text, uppercase, 100px border-radius
- **Buttons:**
  - `.btn-primary` — `#6155F1` bg, white text, shadow, hover lift
  - `.btn-secondary` — transparent, `#6155F1` border + text
  - `.btn-ghost` — transparent, `#6155F1` text, no border
  - `.btn-download` — `#F5F2FF` bg, `#E2DFFE` border, hover turns purple
- **Animations:** `fadeUp` keyframe (page load, staggered) + `.reveal` class via IntersectionObserver (scroll-triggered) — only `transform` and `opacity`
- **FAQ accordion:** `.faq-answer` / `.faq-answer.open` — toggled via `window.toggleFaq()` in `<script is:inline>`, animated via `faqReveal` keyframe. Never use `max-height` transitions.
- **Mobile nav:** `.mobile-nav-panel` + `.is-open` class (opacity/pointer-events toggle). Always `display: block` on mobile via media query; `.is-open` makes it visible. Never toggle `.desktop-nav` via JS.
- **Progress bar:** `transform: scaleX()` + `transform-origin: left` — never `width` transition
- **Typography:** Kanit headings with `-0.03em` to `-0.04em` tracking, Plus Jakarta Sans body at `1.7–1.8` line-height
- **Prose via set:html:** Must use `:global()` CSS selectors — Astro scoping does not apply to `set:html`-injected content

---

## Navigation Structure (all pages)

The logo (`AI_Token_logoPNG.avif` + "AI Token King" text) is the home button — links to `/{lang}/`.

| Item | Type | Route |
|---|---|---|
| AI Resources | Dropdown | — |
| └ AI Trends | Sub-item | `/{lang}/ai-trends` ✅ |
| └ AI Token King User Guide | Sub-item | `/{lang}/user-guide` (not yet built) |
| └ Business AI Compliance | Sub-item | `/{lang}/compliance` (not yet built) |
| Compare Models | Top-level | `/{lang}/api-compare` ⏳ code done, no content |
| Use Cases | Top-level | `/{lang}/use-cases` (not yet built) |
| Beginners Guide | Top-level | `/{lang}/beginners-guide` (not yet built) |
| Blog | Top-level | `/{lang}/blog` ✅ |
| Documentation | Top-level | `https://www.aitokenking.com.tw/docs` (new tab) |
| Get Started | CTA button | `https://www.aitokenking.com.tw/home` (new tab) |

---

## Pages Built in Astro

| Route | Status | Notes |
|---|---|---|
| `/` | ✅ | 301 → `/en/` |
| `/en/` and `/es/` | ⚠️ Placeholder | "Coming Soon" — homepage not yet built |
| `/en/ai-trends` and `/es/ai-trends` | ✅ Done | Sanity-powered, full content EN + ES |
| `/en/blog` and `/es/blog` | ✅ Done | Filtered by language from Sanity |
| `/en/blog/[slug]` | ✅ Done | 3 EN posts live |
| `/en/chatgpt-api` | ✅ Done | EN content live in Sanity, 43 KB, 7 sections + FAQ |
| `/es/chatgpt-api` | ⏳ | Code ready, awaiting ES Sanity content |
| `/en/claude-api` | ⏳ | Code ready, awaiting EN Sanity content |
| `/en/gemini-api` | ⏳ | Code ready, awaiting EN Sanity content |
| `/en/api-compare` | ⏳ | Code ready, awaiting EN Sanity content |
| `/en/beginners-guide` | ⏳ | Code ready, awaiting EN Sanity content |
| `/en/user-guide` | ⏳ | Code ready, awaiting EN Sanity content |
| `/en/use-cases` | ⏳ | Code ready, awaiting EN Sanity content |
| `/en/token-calculator` | ⏳ | Code ready; calc widget is live (hardcoded JS), awaiting FAQ/CTA in Sanity |
| `/en/compliance` | ⏳ | Code ready, awaiting EN Sanity content |
| `/en/` and `/es/` | ⚠️ Placeholder | Batch C — homepage not yet built |

---

## Pages Still to Port (Batch Plan)

**Batch A** — API model pages (share a schema) — *code complete, content in progress*
- `api-compare` — AI Model Type Overview
- `chatgpt-api` — ChatGPT API Guide ✅ EN content live
- `claude-api` — Claude API Guide
- `gemini-api` — Gemini API Guide

**Batch B** — Guide pages ✅ Code complete (all 5):
- `beginners-guide` — sidebar layout, reading steps, stuck callouts, FAQ, next reads
- `user-guide` — sidebar layout, 8 content sections, numbered steps, audience grid
- `use-cases` — full-width 3-column card grid (no sidebar)
- `token-calculator` — hardcoded JS calculator widget + Sanity FAQ/CTA (no sidebar)
- `compliance` — sidebar layout, blockers bullets, proposal CTA, solution cards, audience, roles

**Batch C** — Homepage (most complex, save for last) ❌ Not started

---

## Sanity Schema Patterns Established

### `faqItem` (reusable object)
- `question` (string) + `answer` (portableText)
- Used as `{ type: 'faqItem' }` in any page schema's FAQ array

### `aiTrendsPage` (singleton, POC pattern for all pages)
- `language` radio (en/es, required) — one document per language
- Hero: `heroHeadline`, `heroSubtitle`, `heroSubtitle2` (portableText)
- Intro: `introTitle`, `introParagraphs` (portableText), `summaryTitle`, `summaryPoints` (string[])
- Trends: `trendsSectionLabel`, `trendsSectionTitle`, `trendCards` (array: tag, title, body [portableText], pullQuote, accentColor)
- Audience: `audienceSectionTitle`, `audienceIntro`, `audienceCards` (array: audience, body [portableText])
- Sources: `sourcesTitle`, `sourcesNote`
- FAQ: `faqItem[]`
- SEO: `seo` object (seoTitle, seoDescription, ogImage, noindex)

### `apiModelPage` (shared singleton for chatgpt / claude / gemini)
- `modelSlug` radio (chatgpt/claude/gemini) + `language` radio — one document per (modelSlug × language)
- Hero: `heroHeadline`, `heroSubtitle`, `heroAccent` (purple/teal/blue)
- Article sections: `overviewBody`, `whatIsTitle/Body`, `useCasesTitle/Body`, `pricingTitle/Body`, `pricingReference` (portableText), `uniqueSectionTitle/Body`, `comparingTitle/Body`
- `furtherReading` (array of `{label, url}`)
- FAQ: `faqTitle`, `faq[]` (faqItem)
- SEO: `seo` object

### `apiComparePage` (singleton)
- `language` radio — one document per language
- Hero: `heroHeadline`, `heroSubtitle`, `heroNote`
- `typeCards` array (icon: text/image/video, title, subtitle, description, ctaLabel, anchorId)
- `pricingCalloutTitle/Body/Cta`
- `textModels`, `imageModels`, `videoModels` (each: array of `{modelName, description}`)
- FAQ: `faqTitle`, `faq[]`
- CTA: `ctaHeadline`, `ctaBody`
- SEO: `seo` object

### Key decisions
- **Portable Text everywhere** for body fields — translators need inline bold/links across 15+ languages
- **One document per language** (not one document with translated fields) — simpler GROQ queries
- **`accentColor` uses named options** — editor sees "Purple/Blue/Teal/Amber/Rose", not hex values
- **`useCdn: false`** in `getClient()` — static builds must fetch fresh data, not CDN-cached responses

---

## Astro Patterns Established

### Fetching a page singleton
```ts
// src/lib/sanity.ts
export async function getAiTrendsPage(lang: Lang): Promise<AiTrendsPageData | null> {
  return client.fetch(`*[_type == "aiTrendsPage" && language == $lang][0]{...}`, { lang });
}
```

### Fetching a model-keyed singleton (apiModelPage)
```ts
export async function getApiModelPage(modelSlug: string, lang: string): Promise<ApiModelPageData | null> {
  return client.fetch(
    `*[_type == "apiModelPage" && modelSlug == $modelSlug && language == $lang][0]{...}`,
    { modelSlug, lang }
  );
}
```

### Thin page wrappers (shared template pattern)
```astro
---
// src/pages/[lang]/chatgpt-api.astro
const page = await getApiModelPage('chatgpt', lang as Lang);
if (!page) return Astro.redirect(`/${lang}/`);
---
<ApiModelPage page={page} lang={lang as Lang} modelSlug="chatgpt" />
```

### Dynamic routes
```ts
// getStaticPaths() in every [lang]/ page
export async function getStaticPaths() {
  return SUPPORTED_LANGS.map(lang => ({ params: { lang } }));
}
```

### Portable Text rendering
```ts
import { toHTML } from '@portabletext/to-html';
// custom mark renderers for bold → brand purple, em → italic
```

### Prose styles via set:html
```css
/* Must use :global() — Astro scoping doesn't reach set:html content */
:global(.hero-subtitle2 p) { color: rgba(255,255,255,0.7); }
```

---

## Dev Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start Astro dev server → `http://localhost:4321` |
| `npm run build` | Build static site (fetches latest from Sanity) |
| `npx astro preview --port 3000` | Preview built `dist/` locally |
| `cd studio && npm run dev` | Start Sanity Studio → `http://localhost:3333` |

**Shell note:** Always prefix node commands with `source ~/.nvm/nvm.sh 2>/dev/null;` in Bash tool calls — Node.js is installed via nvm.

**Build note:** Run `npm run build` from `/Users/antonioduran/Desktop/aitokenglobal` (repo root), never from inside `studio/`.

---

## Task Tracker

| # | Task | Status |
|---|---|---|
| 0a | Remove `.env` from git | ✅ Done |
| 0b | Add `seo` object to Sanity schemas | ✅ Done |
| 0c | Canonical / hreflang / OG tags in `BaseLayout.astro` | ✅ Done |
| 0d | Sitemap integration + `robots.txt` | ✅ Done |
| 0e | EN/ES delocalization (`LANG_META` locale, dynamic language list) | ✅ Done |
| 0f | Visual/Mobile/A11y system — mobile nav, FAQ, progress bar, contrast, motion | ✅ Done |
| 1 | Restructure repo: Astro to root, archive HTML prototype | ✅ Done |
| 2 | Fix Nav language switcher to be dynamic | ✅ Done |
| 3 | Design Sanity schema POC for one page (AI Trends) | ✅ Done |
| 4 | Implement Sanity POC: schema + Astro fetch + EN/ES content | ✅ Done |
| 5 | Port remaining 10 pages using Sanity singleton pattern | ⏳ Batch A + B code done; Batch C (homepage) next; content entry pending all pages |
| 6 | Enter EN + ES content into Sanity for all pages | ⏳ Parallel to #5 |
| 7 | Update `go-live-guide.md` for AWS Amplify | ✅ Done |
| 8 | Deploy to AWS Amplify with Sanity webhook | ⏳ Pending |
| 9 | Add SEO basics (sitemap, meta tags, OG images, robots.txt) | ✅ Done (pre-flight #0b–#0d) |
| 10 | Scale to languages 3–15 | ⏳ Pending |
| 11 | Operations safety net (weekly backup, pre-commit secret block) | ⏳ Pending |
| 12 | AI ops pipeline (translation drafting, alt-text) | ⏳ Pending |

---

## Content Source

All copy comes from the Chinese site (`aitoken.com.tw`) screenshots + web fetches. Translation: direct + light Western English adaptation. Never invent content — always source from provided screenshots.

Chinese screenshots used so far:
- `home_content.png` — homepage content
- Model overview screenshot — api-compare page content
- AI Trends screenshot — ai-trends page content
- User Guide screenshot + `https://www.aitoken.com.tw/`
- Compliance screenshot + `https://www.aitoken.com.tw/enterprise-ai-compliance-solution`
- Use Cases screenshot + `https://www.aitoken.com.tw/ai-token-use-cases`
- Beginners Guide screenshot + `https://www.aitoken.com.tw/ai-token-beginners-guide`
- `archive/chatgpt-api.html` — ChatGPT API Guide EN content source (used for Sanity doc)

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
