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

**In progress / remaining**
- Port remaining 10 static pages to Astro using the Sanity singleton pattern (none started yet)
- Enter EN + ES content for those pages in Sanity
- Homepage (`/en/`, `/es/`) is a "Coming Soon" placeholder

**Next, in order** *(updated 2026-05-08 from `audits/FINAL_PROJECT_AUDIT.md` — canonical task tracker in `audits/IMPLEMENTATION_PLAN.md` v2.1)*
1. **Pre-flight (Task #0)** — `.env` out of git (#0a), add `seo` object to schemas (#0b), add canonical/hreflang/OG to `BaseLayout.astro` (#0c), install sitemap + `robots.txt` (#0d), fix EN/ES delocalization — `locale` in `LANG_META`, dynamic `language` list in `post.ts` (#0e), **and centralize Visual/Mobile/A11y system — fix broken mobile nav, FAQ accordion, illegal CSS transitions, contrast and touch-target gaps (#0f, NEW from QA/mobile audit)**. 1.5–2.5 days. Blocks Task #5.
2. **Task #5** — Port remaining 11 pages (Batch A → B → C) on the SEO-hardened *and* mobile-hardened singleton pattern.
3. **Task #6** — Bulk migration scripts (`upload-images.js`, `convert-articles.js`) plus EN + ES content entry. Runs parallel to #5. Compresses ~80–120 hr of manual entry into ~10–13 hr.
4. **Task #8** — Deploy to AWS Amplify, env vars, Sanity webhook, debounce + alerts + budget alarm. Hard-gated by Task #0a.
5. **Task #9 (remainder)** — Astro `<Image>` migration, Tailwind CDN → build-step, font preconnect, JSON-LD, Lighthouse mobile baseline. Post-deploy polish.
6. **Task #11 (new)** — Operations safety net: weekly Sanity backup, pre-commit secret block.
7. **Task #12 (new)** — AI ops pipeline: translation drafting + alt-text generation *before* language 3.
8. **Task #10** — Scale to languages 3–15. Blocked until Task #0e and Task #12 priority 1 complete.

---

## Repo Structure (current)

```
aitokenglobal/              ← repo root = Astro project
  src/
    components/
      Nav.astro             ← dynamic lang switcher, all hrefs /{lang}/
      Footer.astro          ← lang-aware, all hrefs /{lang}/
    i18n/
      en.json               ← all EN UI strings
      es.json               ← all ES UI strings
      index.ts              ← useTranslations(), SUPPORTED_LANGS, LANG_META, isValidLang()
    layouts/
      BaseLayout.astro      ← wraps every page; sets <html lang>, passes lang to Nav/Footer
    lib/
      sanity.ts             ← Sanity client, getAllPosts(lang), getPostBySlug, getAiTrendsPage(lang), types
    pages/
      index.astro           ← / → 301 redirect to /en/
      [lang]/
        index.astro         ← /en/ and /es/ homepages (placeholder "Coming Soon")
        ai-trends.astro     ← /en/ai-trends and /es/ai-trends (DONE — Sanity-powered)
        blog/
          index.astro       ← /en/blog and /es/blog
          [slug].astro      ← /en/blog/[slug] and /es/blog/[slug]
    styles/
      global.css            ← full design system (vars, buttons, cards, animations, prose)
  studio/
    schemas/
      post.ts               ← blog post schema (title, slug, language, body, etc.)
      aiTrendsPage.ts       ← AI Trends singleton schema (hero, trends, audience, sources, faq)
      faqItem.ts            ← reusable FAQ object type (question + portableText answer)
      imageMeta.ts          ← image asset extension (articleNumber field)
    sanity.config.ts
    sanity.cli.ts
  public/
    AI_Token_logoPNG.avif
  archive/                  ← all 14 HTML prototypes + scripts + brand images
  go-live-guide.md
  summary.md
  astro.config.mjs
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
| Compare Models | Top-level | `/{lang}/api-compare` (not yet built) |
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
| All other pages | ❌ Not started | Still in `archive/` as HTML prototypes |

---

## Pages Still to Port (Batch Plan)

**Batch A** — API model pages (share a schema):
- `api-compare` — AI Model Type Overview
- `chatgpt-api` — ChatGPT API Guide
- `claude-api` — Claude API Guide
- `gemini-api` — Gemini API Guide

**Batch B** — Guide pages (use existing `faqItem` schema):
- `beginners-guide`
- `user-guide`
- `use-cases`
- `token-calculator`
- `compliance`

**Batch C** — Homepage (most complex, save for last)

Build Batch A first and enter EN content before scaling to B and C.

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

### Key decisions
- **Portable Text everywhere** for body fields — translators need inline bold/links across 15+ languages
- **One document per language** (not one document with translated fields) — simpler GROQ queries
- **`accentColor` uses named options** — editor sees "Purple/Blue/Teal/Amber/Rose", not hex values

---

## Astro Patterns Established

### Fetching a page singleton
```ts
// src/lib/sanity.ts
export async function getAiTrendsPage(lang: Lang): Promise<AiTrendsPageData | null> {
  return client.fetch(`*[_type == "aiTrendsPage" && language == $lang][0]{...}`, { lang });
}
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
| `cd studio && npm run dev` | Start Sanity Studio → `http://localhost:3333` |

**Shell note:** Always prefix node commands with `source ~/.nvm/nvm.sh 2>/dev/null;` in Bash tool calls — Node.js is installed via nvm.

---

## Task Tracker

| # | Task | Status |
|---|---|---|
| 1 | Restructure repo: Astro to root, archive HTML prototype | ✅ Done |
| 2 | Fix Nav language switcher to be dynamic | ✅ Done |
| 3 | Design Sanity schema POC for one page (AI Trends) | ✅ Done |
| 4 | Implement Sanity POC: schema + Astro fetch + EN/ES content | ✅ Done |
| 5 | Port remaining 10 pages using Sanity singleton pattern | ⏳ Next |
| 6 | Enter EN + ES content into Sanity for all pages | ⏳ Parallel to #5 |
| 7 | Update `go-live-guide.md` for AWS Amplify | ✅ Done |
| 8 | Deploy to AWS Amplify with Sanity webhook | ⏳ Pending |
| 9 | Add SEO basics (sitemap, meta tags, OG images, robots.txt) | ⏳ Pending |
| 10 | Scale to languages 3–15 | ⏳ Pending |

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

---

## Important Rules (from CLAUDE.md)

- Invoke the `frontend-design` skill before writing any frontend code, every session
- Dev server for Astro: `npm run dev` → `http://localhost:4321`
- Screenshots: `node screenshot.mjs http://localhost:4321/en/page label`
- The VSCode Read tool does NOT render PNG images — audit via Puppeteer `page.evaluate()` instead
- Never use default Tailwind blue/indigo — use brand `#6155F1` purple
- Never `transition-all` — only animate `transform` and `opacity`
- Kanit headings, Plus Jakarta Sans body — never the same font for both
