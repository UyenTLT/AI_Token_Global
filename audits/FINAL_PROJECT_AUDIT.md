# AI Token Global — Final Project Audit Report

**Date:** 2026-05-08
**Prepared by:** Project Supervisor (synthesizing technical, SEO, automation, and QA/mobile audits — four specialists, first inclusion of QA/mobile)
**Audience:** Project sponsor / decision-maker
**Decision asked:** Continue resource commitment to AI Token Global?
**Supersedes:** `audits/FINAL_PROJECT_AUDIT_2026-05-07.md` (archived for diff comparison)

---

## 0. Project Context (for readers new to the project)

This section orients a reader who has not worked on the project before. Returning readers can skip ahead to Section 1.

### What the site is

AI Token Global is a multilingual content hub being built to teach a Western, English-speaking audience about AI tokens, model pricing, API choices, use cases, and best practices. It is the international expansion of an existing Taiwanese brand — **AI Token King** — whose Traditional Chinese site lives at `aitoken.com.tw`. The Chinese site is the content source: copy is translated and adapted (not invented) for a Western audience, with a redesigned look. The long-term plan is to support 10–15 languages, with English and Spanish as the launch pair.

The brand mascot is a corgi with a crown, the primary brand color is purple `#6155F1`, and the design system pairs Kanit (headings) with Plus Jakarta Sans (body). A strict "anti-generic" set of rules in `CLAUDE.md` — no default Tailwind blue/indigo, no `transition-all`, layered shadows and gradients only — gives the site its visual identity.

### Tech stack (locked in)

The architecture decision was made deliberately and is not open for revision. Any audit recommendation argues *inside* these constraints:

- **Astro** as the static-site framework, generating pages at build time
- **Sanity CMS** as the content store (project ID `mq3wxr8n`, dataset `production`)
- **AWS Amplify** for hosting (CloudFront-backed CDN)

The repo is `antonioduran-insight/AI_Token_Global` on GitHub, with the Astro project at the root and a Sanity Studio inside `studio/`. The validated content pattern: one Sanity document per (page × language), Portable Text for body fields, and `[lang]` dynamic routes that loop over a `SUPPORTED_LANGS` constant — meaning a new language should require *one constant change plus content entry*, with no per-page code edits.

### How content flows

Editors work in Sanity Studio (`localhost:3333` for local dev). They publish documents tagged with a `language` field. Astro fetches Sanity at build time and statically generates every language variant. So `/en/ai-trends` and `/es/ai-trends` are different documents that share one `.astro` template. **A current gap:** no webhook from Sanity to Amplify exists yet, so a content publish does not trigger a rebuild — the live site stays stale until the next `git push`. Wiring this webhook is the single biggest pending leverage point in the project.

### Where things stand (May 2026, after 12 work sessions)

Done: repo restructure (Astro at root, HTML prototypes archived); dynamic language switcher in Nav and Footer; Sanity schema POC built and validated on the AI Trends page (the pattern everything else will follow); blog routes working with three English posts live; AWS Amplify deployment guide written.

Not done: 10 of 14 planned pages still exist only as HTML prototypes in `archive/` — they need to be ported to Astro using the Sanity singleton pattern (this is the next active task); homepage is a "Coming Soon" placeholder; the site has not been deployed to Amplify yet; no SEO infrastructure exists (no `robots.txt`, no sitemap, no `hreflang`, no Open Graph tags, no SEO fields in any Sanity schema); languages 3–15 not yet planned in detail.

### The 14 pages

Four are working: `/en/`, `/es/` (placeholders), AI Trends, blog index, blog post template. Ten remain to port, batched as **Batch A** (four API model pages — `api-compare`, `chatgpt-api`, `claude-api`, `gemini-api`), **Batch B** (five guide pages — `beginners-guide`, `user-guide`, `use-cases`, `token-calculator`, `compliance`), and **Batch C** (the homepage, saved for last because it is most complex).

### Team and budget shape

The team is small — implied as roughly one technical operator plus one editor. Cost trajectory is friendly: ~$1.25/month today (just the domain), projecting to $26–34/month at 12 months (5+ languages, ~50K visitors), and capping around $50–60/month at full 15-language scale. The largest hidden cost is *manual* content entry: without bulk-migration scripts, importing the 200+ existing articles would take 80–120 hours; with scripts, ~10–13 hours.

### Constraints anyone joining should know up front

- **The architecture is not open for debate.** Astro + Sanity + Amplify, `[lang]` routing, Sanity-first content, and Portable Text are decided. Implementation gaps inside those choices are fair game; the choices themselves are not.
- **Sanity-first means no hardcoded English in `.astro` files.** All UI strings live in `src/i18n/{en,es}.json` or in Sanity. The audit found several violations where Spanish users still see English UI labels.
- **Anything assuming exactly EN+ES will silently break at language 3.** The audit flagged two specific places (a `locale` ternary in the blog pages and a static `language` list in the post schema) that must be fixed before scaling.
- **Mobile traffic is expected to dominate.** The QA/mobile audit added in this synthesis (2026-05-08) found that mobile navigation is currently completely broken on phones and tablets — a launch blocker the previous audit cycle did not catch. Centralizing the responsive system in `global.css` before Task #5 stamps the singleton pattern across 11 pages is now a pre-flight item.

---

## 1. Executive Summary

**Recommendation: GO WITH CAVEATS** — unchanged from the May 7 verdict. The QA/mobile audit added in this synthesis **reinforces and extends** the May 7 conclusion rather than shifting it. The architecture is still sound; the team has shipped real progress; the new findings (one of which is a launch blocker the previous cycle missed) all fit inside the existing pre-flight + Task #5 framework. Crucially, the QA audit caught these issues *before* Task #5 stamps the singleton pattern across 11 pages — the exact value the audit cycle is meant to produce. The 30-day priority list expands by roughly half a day; everything else holds.

### What changed since May 7

- A **fourth specialist audit (QA/mobile)** was run on 2026-05-08 and is included in this synthesis for the first time.
- Risk Matrix gains a new category: **Visual / Mobile / A11y**.
- One **new Bucket A (launch-blocking) cluster** emerged: mobile navigation is completely broken on every phone and tablet — a CSS `!important` rule overrides the JavaScript that tries to open the menu (Q-01/Q-02). The FAQ accordion on the AI Trends page is also broken in production today (Q-03).
- One **new pre-flight item (Task #0f)** is recommended for the implementation plan: a centralized responsive breakpoint system in `src/styles/global.css` plus the mobile/A11y fixes the audit surfaced. ~4–6 hours of work; absorbs eleven follow-on copies of the same problem if done before Task #5.
- The May 7 cost trajectory and architecture verdict are unchanged.

### Top 3 Strengths (unchanged)

1. **Core architecture is correctly implemented and locked in.** Dynamic `[lang]` routing, Sanity-first content, `getStaticPaths()` over `SUPPORTED_LANGS`, and the language switcher all work as designed. There are no build-breaking issues. The Astro + Sanity + AWS Amplify stack remains the right choice for a 15-language content hub at this budget.
2. **Sanity schema quality is high and the POC pattern is reusable.** Both `post` and `aiTrendsPage` use Portable Text for body fields, require `language`, and reuse `faqItem` correctly. With the pre-flight expansions (SEO, EN/ES delocalization, responsive system) the pattern can scale to the remaining 11 page schemas without redesign.
3. **Cost trajectory is highly favorable.** Current burn is roughly $1.25/month (domain only). Projected burn at 12-month scale is $26–34/month; full 15-language scale stays under $60/month.

### Top 4 Risks (was 3 — Visual/Mobile/A11y added)

1. **`.env` is committed to git** with the live Sanity project ID. Security and quota-abuse exposure that contradicts the file's own warning header. **Must fix before the next push.** *(Unchanged from May 7.)*
2. **Zero SEO infrastructure exists today** — no `robots.txt`, no sitemap, no canonical, no `hreflang`, no Open Graph, no `seo` fields in any Sanity schema. The `seo` object must land in the schema pattern *before* Task #5 replicates it. *(Unchanged from May 7.)*
3. **Two hidden EN/ES assumptions will silently break at language 3.** The `locale` ternary in both blog pages and the static language list inside `studio/schemas/post.ts`. Both block Task #10. *(Unchanged from May 7.)*
4. **Mobile navigation is broken on every phone and tablet, the FAQ accordion does not open, and the entire CSS system is desktop-first despite `CLAUDE.md` declaring "mobile-first." NEW.** A CSS `!important` rule in `global.css:277` (`.desktop-nav { display: none !important }`) overrides the inline `style.display = 'flex'` toggle in `Nav.astro:118`, so the hamburger button has no visible effect. The FAQ accordion's `max-height` transition is never triggered because the JavaScript adds `.open` to the wrong element. Two CSS animations (`transition: width` on the blog reading bar; `transition: max-height` on the FAQ) violate `CLAUDE.md`'s `transform`/`opacity`-only rule. The audit also caught one WCAG AA color contrast failure in the footer (`#666` on `#1C1C1C` ≈ 3.0:1; needs ≥4.5:1).

### 30-Day Priorities (expanded)

- **Week 1: Pre-flight (Task #0).** Originally 5 sub-items; now 6 with the QA additions. Remove `.env` from git (#0a), add the `seo` object to schemas (#0b), wire `BaseLayout.astro` for canonical/hreflang/OG (#0c), install sitemap + robots (#0d), fix the EN/ES delocalization (#0e), **and now: standardize the responsive breakpoint system + fix the mobile nav, FAQ accordion, illegal transitions, missing `:active` states, hamburger touch target, and footer contrast (#0f, NEW)**. Doing this *now* — before Task #5 replicates the singleton pattern across 11 pages — avoids fixing the same problem 11 times. Total Task #0 effort: ~1.5–2.5 days (was 1–2).
- **Week 2: Deploy infrastructure (Task #8).** Add `amplify.yml`, set Amplify Console env vars, configure the Sanity → Amplify webhook. Hard-blocked on Task #0a until `.env` is untracked.
- **Week 3: Bulk migration scripts (Task #6).** `scripts/upload-images.js` + `scripts/convert-articles.js` — converts ~80–120 hours of manual entry into ~10–13 hours.
- **Week 4: Begin Task #5 page port.** Start with Batch A (the four API model pages) using the SEO-hardened **and** mobile-hardened singleton pattern from Week 1.

### Cost Trajectory (unchanged)

| Stage | Languages | Traffic | Build Activity | Monthly Cost |
|---|---|---|---|---|
| Today (pre-launch) | 2 (EN + ES) | 0 | 0 builds | ~$1.25 |
| Month 6 | 2 | ~5K visitors | ~10 publishes/day | ~$3–5 |
| Month 12 | 5+ | ~50K visitors | ~20 publishes/day | ~$26–34 |
| Full scale | 15 | Daily publishing | All langs active | ~$50–60 |

---

## 2. Risk Matrix

All findings from the four specialist audits, grouped by impact tier and now by category. **A new "Visual / Mobile / A11y" category** is added to accommodate the QA audit. Severity is the supervisor's judgment after cross-checking.

### Bucket A — Blocking Launch (cannot deploy or will visibly break)

| ID | Finding | Category | Source | Effort | Owner Task |
|---|---|---|---|---|---|
| A-01 | `amplify.yml` does not exist at repo root; build spec not version-controlled | Automation | Automation | S (1 hr) | #8 |
| A-02 | Sanity → Amplify publish webhook entirely unconfigured — content edits will not trigger rebuilds | Automation | Automation | S (30 min) | #8 |
| A-03 | Amplify Console env vars not set — first deploy will return empty Sanity queries with no error | Automation | Automation | S (10 min) | #8 |
| F-01 | `.env` committed to git with live `mq3wxr8n` project ID despite gitignore policy | Technical | Technical | S (5 min) | #0a (security gate) |
| S-01 | No `public/robots.txt` — search engines have no crawl instructions or sitemap pointer | SEO | SEO | S (15 min) | #0d |
| S-04 | `astro.config.mjs` has no `site` URL and no sitemap integration installed | SEO | SEO | S (30 min) | #0d |
| S-02 / S-03 / S-05 | No `hreflang` tags anywhere; sitemap won't include hreflang clusters | SEO | SEO | M (3–4 hr) | #0c |
| S-06 | No `<link rel="canonical">` on any page | SEO | SEO | S (30 min) | #0c |
| S-07 / S-08 | No Open Graph or Twitter Card tags — every social share produces a blank preview | SEO | SEO | M (2–3 hr) | #0c |
| S-18 | Coming Soon homepage will be indexed with thin content; no `noindex` mechanism | SEO | SEO | S (30 min) | #0b |
| **Q-01** | **`!important` on `.desktop-nav { display: none }` overrides the inline-style toggle — mobile menu cannot open** | **Visual / Mobile / A11y** | **QA/Mobile** | **S (15 min)** | **#0f (NEW)** |
| **Q-02** | **No mobile nav drawer styles exist — even if Q-01 is fixed, the panel has no mobile layout** | **Visual / Mobile / A11y** | **QA/Mobile** | **M (1–2 hr)** | **#0f (NEW)** |
| **Q-03** | **AI Trends FAQ accordion never opens — JS adds `.open` but CSS `max-height` transition is on the wrong selector** | **Visual / Mobile / A11y** | **QA/Mobile** | **S (30 min)** | **#0f (NEW)** |
| **Q-04** | **Possible horizontal scroll on mobile — needs verification once nav is repaired** | **Visual / Mobile / A11y** | **QA/Mobile** | **S (30 min)** | **#0f (NEW)** |
| **Q-12** | **Footer secondary text fails WCAG AA contrast (`#666` on `#1C1C1C` ≈ 3.0:1; needs ≥4.5:1)** | **Visual / Mobile / A11y** | **QA/Mobile** | **S (5 min)** | **#0f (NEW)** |

**Total launch-blocker count: 14 (was 9).** The five new entries are the QA/mobile cluster. Of these, Q-01–Q-03 are functional bugs that will be visible to any phone user on day one of launch. Q-12 is a legal/accessibility risk (ADA-style claims have been filed against contrast failures). All five fit inside Task #0f and are bounded.

### Bucket B — Blocking Scale (works at EN+ES, breaks at language 3+ or 200+ articles)

| ID | Finding | Category | Source | Effort | Owner Task |
|---|---|---|---|---|---|
| F-05 | `locale` ternary defaults to `en-US` when language 3 is added | Technical | Technical | S (15 min) | #0e (#10 prereq) |
| A-07 | `studio/schemas/post.ts` `language` field is a static `['en','es']` list | Automation | Automation | M (2 hr or install plugin) | #0e (#10 prereq) |
| S-09 | No `seo` object in any Sanity schema — must be added to base pattern *before* it is replicated to 11 pages in Task #5 | SEO | SEO | M (1 hr per schema) | #0b |
| F-07 | `ai-trends.astro` renders blank silently if Sanity returns `null` | Technical | Technical | S (10 min) | #0f / #5 (pattern) |
| S-14 | Language switcher always routes to `/{lang}/` instead of equivalent page | SEO | SEO | M (3 hr) | #10 |
| A-05 / A-06 | No bulk migration scripts — 200+ articles will need 80–120 hours of manual Sanity entry | Automation | Automation | M (10–13 hr to build, saves ~110 hr) | #6 (scope expansion) |
| A-09 / A-10 | No AI-assisted meta-description or alt-text generation | Automation | Automation | M (1 day each) | #6 / #12 |
| **Q-05** | **Hamburger button hit area ≈38px — below 44×44px touch-target minimum (Apple HIG / WCAG)** | **Visual / Mobile / A11y** | **QA/Mobile** | **S (5 min)** | **#0f (NEW)** |
| **Q-07** | **Two illegal CSS transitions violate `CLAUDE.md`'s `transform`/`opacity` rule: `transition: width` on blog reading bar; `transition: max-height` on FAQ** | **Visual / Mobile / A11y** | **QA/Mobile** | **S (30 min)** | **#0f (NEW)** |
| **Q-08** | **All CSS is desktop-first (`max-width` queries) despite `CLAUDE.md` declaring "mobile-first" — entire system is override-down, not enhance-up** | **Visual / Mobile / A11y** | **QA/Mobile** | **M (3–4 hr)** | **#0f (NEW — centralization)** |
| **Q-09** | **Missing `:active` states on `.dropdown-item` and `.faq-question` — `CLAUDE.md` requires hover, focus-visible, and active on every interactive element** | **Visual / Mobile / A11y** | **QA/Mobile** | **S (15 min)** | **#0f (NEW)** |
| **Q-13** | **Blog images use raw `<img>` with no `width`/`height` or `aspect-ratio` — CLS risk that compounds when Task #5 replicates the blog pattern** | **Visual / Mobile / A11y** | **QA/Mobile + SEO (S-17 cross-ref)** | **M (1 hr)** | **#0f / #9 (post-deploy migration to Astro `<Image>`)** |
| **Q-17** | **Conflicting breakpoints — Footer uses 768px scoped `!important` while `global.css` uses 640px — single mobile breakpoint must be centralized** | **Visual / Mobile / A11y** | **QA/Mobile** | **S (15 min)** | **#0f (NEW)** |

### Bucket C — Quality and Optimization (improves but does not block)

| ID | Finding | Category | Source | Effort | Owner Task |
|---|---|---|---|---|---|
| F-02 / F-03 / F-04 | Hardcoded English strings in `[lang]/index.astro`, `ai-trends.astro`, `blog/[slug].astro` | Technical | Technical | S (1 hr total) | #0 / #5 |
| F-06 / S-16 | `coverImage` has no alt-text field; inline image alt has no `Rule.required()` | Technical / SEO | Technical / SEO | S (15 min) | #0 / #5 |
| F-08 | Hard-coded `https://aitokenglobal.com` in blog slug page should use `Astro.site` | Technical | Technical | S (10 min) | #9 |
| F-13 | Default `description` prop in `BaseLayout.astro` is English-only | Technical | Technical | S (15 min) | #0 / #5 |
| S-13 / Q-14 | Google Fonts loaded via render-blocking CSS `@import`; no preconnect (cross-confirmed by both audits) | SEO | SEO + QA/Mobile | S (15 min) | #9 |
| S-17 | Raw `<img>` tags everywhere instead of Astro `<Image>` (cross-confirms Q-13 from a perf/SEO angle) | SEO | SEO | L (1 day) | #9 / post-launch |
| A-08 | No webhook debounce — every Sanity publish triggers a build | Automation | Automation | S (2 hr) | #8 |
| A-11 | No Amplify build-failure notifications | Automation | Automation | S (15 min) | #8 |
| A-12 | No AWS Budget alarms for cost spikes | Automation | Automation | S (15 min) | #8 |
| A-13 | No Sanity dataset backup automation | Automation | Automation | M (2 hr) | #11 (NEW from May 7) |
| **Q-11** | **Heading scale on small viewports needs verification — Kanit at large desktop sizes may be too tight on mobile** | **Visual / Mobile / A11y** | **QA/Mobile** | **S (1 hr)** | **#0f / #9** |
| **Q-15** | **Tailwind CDN script lacks `defer`; CDN Tailwind itself is not production-appropriate** | **Visual / Mobile / A11y** | **QA/Mobile** | **S (5 min for `defer`); M (2 hr for build-step migration)** | **#0f for `defer`; #9 for full migration** |
| **Q-16** | **No `prefers-reduced-motion` block — animations cannot be disabled by users with vestibular sensitivities** | **Visual / Mobile / A11y** | **QA/Mobile** | **S (15 min)** | **#0f / #9** |

### Bucket D — Nice-to-Have (defer to post-launch)

| ID | Finding | Category | Source | Effort |
|---|---|---|---|---|
| F-09 | Privacy / Terms footer links are dead `href="#"` | Technical | Technical | S (1 hr) |
| F-10 | Sources download CTA links to `href="#"` with no file | Technical | Technical | S (15 min) |
| F-11 | Copyright year is 2025; brand name reads "AI Token King" instead of "AI Token Global" | Technical | Technical | S (5 min) |
| S-10 | No `Article` JSON-LD on blog post pages | SEO | SEO | M |
| S-11 | No `FAQPage` JSON-LD on AI Trends page | SEO | SEO | M |
| S-12 | No `Organization` JSON-LD anywhere | SEO | SEO | S |
| S-15 | No `BreadcrumbList` JSON-LD | SEO | SEO | M |
| A-14 | No `node_modules` cache key in `amplify.yml` | Automation | Automation | S |
| A-15 | No branch auto-deploys for preview URLs | Automation | Automation | S |
| **Q-20** | **Input `font-size` ≥16px to prevent iOS auto-zoom — N/A until newsletter / contact forms exist** | **Visual / Mobile / A11y** | **QA/Mobile** | **N/A** |

### QA Pass Items (no action needed)

The QA/mobile audit confirmed several rules already correctly enforced. Worth recording so the team gets credit:

- **Q-06 — `transition-all` is nowhere in the codebase** (CLAUDE.md compliance).
- **Q-10 — Body font-size is 16px** (no iOS auto-zoom).
- **Q-18 — `aria-label="Toggle mobile menu"`** is on the hamburger button (correct ARIA).
- **Q-19 — No bare `outline: none`** anywhere — focus indicators are preserved.

---

## 3. Specialist Audit Highlights

### 3.1 Technical Audit — Headline (unchanged from May 7)

> The core architecture is sound. `[lang]` routing, `getStaticPaths()`, Sanity-first content, and dynamic language switching are correctly implemented. The blockers are concentrated in two places: `.env` is committed to git (a security exposure), and several hardcoded English strings violate the Sanity-first principle and appear on the Spanish site today.

Key findings remain F-01 (`.env` in git), F-05 (`locale` ternary regression risk), F-07 (silent null-render in `ai-trends.astro`), and well-designed Sanity schemas with required `language` validation.

### 3.2 SEO Audit — Headline (unchanged from May 7)

> The site has no SEO infrastructure at all. Launching today would mean search engines crawl blind, English and Spanish pages compete for the same rankings, every social share produces a blank preview, and zero structured data unlocks rich results.

**Multilingual readiness scorecard remains 1 of 10 passing** (`<html lang>` only). Pre-launch must-fix order: robots.txt → sitemap + `site` URL → canonical → hreflang → OG + Twitter Card → `seo` object in schemas → `noindex` on Coming Soon homepage. With Task #0c/d landing in pre-flight, all eight blockers will be cleared before deploy.

### 3.3 Automation Audit — Headline (unchanged from May 7)

> The architectural automation works. The operational glue is missing: no `amplify.yml`, no Sanity webhook, no env vars in Amplify Console, and no bulk migration scripts. The single biggest leverage point is the Sanity → Amplify webhook — a 30-minute task whose absence means every content publish leaves the live site stale.

Cost projection unchanged. AI-assisted ops roadmap (translation drafting, alt-text generation, meta description, FAQ extraction, content QA) sits in proposed Task #12.

### 3.4 QA & Mobile Audit — Headline (NEW — first inclusion)

> Mobile navigation is completely broken on every phone and tablet today, the FAQ accordion on the AI Trends page doesn't open, and the entire responsive system is desktop-first despite `CLAUDE.md` declaring otherwise. None of the findings are architecturally hard — most are 5–30-minute fixes — but they need to land **before** Task #5 stamps the singleton pattern across 11 pages, because the same broken pattern would otherwise be fixed eleven times.

#### Headline findings

- **Q-01 / Q-02 — Mobile nav broken:** A CSS `!important` rule in `global.css:277` (`.desktop-nav { display: none !important }`) overrides the inline `style.display = 'flex'` toggle in `Nav.astro:118`. CSS cascade beats inline non-`!important`. Tapping the hamburger does nothing. There are also no mobile drawer styles (full-width, stacked links, visible panel) — even if the toggle worked, the layout would be wrong.
- **Q-03 — FAQ accordion broken:** The JS adds class `.open`, but the CSS only styles `.faq-answer` (without `.open`) with `max-height: 0` and a `max-height` transition. The transition never fires; the panel stays hidden.
- **Q-07 — Two illegal CSS transitions:** `transition: width` on the blog reading progress bar (triggers layout/paint on every scroll event — visibly lags on mobile); `transition: max-height` on the FAQ accordion (the second-class citizen of CSS transitions). Both violate `CLAUDE.md`'s `transform`/`opacity`-only rule.
- **Q-08 — Desktop-first CSS, despite "mobile-first" declared:** Every `@media` query across all files uses `max-width` (override-down). Zero `min-width` queries (enhance-up). This is the most leveraged finding because it touches every component.
- **Q-12 — WCAG AA contrast fail:** Footer secondary text `#666` on `#1C1C1C` ≈ 3.0:1. Needs ≥4.5:1. Use `#999` or lighter.

#### CLAUDE.md drift surfaced by QA audit

Three rules in `CLAUDE.md` are claimed but not enforced:

| Rule | Reality | Severity |
|---|---|---|
| "Mobile-first responsive" | Entire CSS system is desktop-first (12 `max-width` queries, 0 `min-width`) | High |
| "Only animate `transform` and `opacity`" | Two violations: `transition: width`, `transition: max-height` | High |
| "Every clickable element needs hover, focus-visible, and active states. No exceptions." | `.dropdown-item` and `.faq-question` are missing `:active` states | High |

These three drift items become Section 4 entries D-11 through D-13.

#### Standardization proposal (the 30-minute / 11× leverage move)

The QA audit's Section 7 proposes a centralized responsive system added to the top of `src/styles/global.css`: three breakpoints (640px mobile, 1024px tablet, 1280px desktop), three utility classes (`.grid-auto-3`, `.grid-auto-2`, `.container-page`), a typography scale using `clamp()`, mobile-first media queries throughout, and a working mobile nav drawer. It also proposes a `CLAUDE.md` addition under "Output Defaults" so future page authors don't introduce new ad-hoc breakpoints.

**Why this matters for sequencing:** Task #5 will replicate the AI Trends pattern across 10 pages plus the homepage. Every ad-hoc responsive pattern fixed today is fixed once. After Task #5 lands without centralization, the same fix costs 11×. This is the same "fix-once-vs-fix-eleven-times" argument that justified pulling the SEO `seo` object into Task #0b for the May 7 cycle. The mobile case has identical mechanics.

#### What QA audit did NOT cover (scope boundary)

The audit was code analysis only — no live browser testing (the site isn't deployed). Lighthouse mobile scores, real-device Safari/Chrome divergence, screen-reader navigation, and keyboard tab order are post-deploy items recorded in the QA audit's Section 4 "Post-Launch Optimization Roadmap" (priorities 1–7).

---

## 4. Drift Report (Documented Claims vs. Actual State)

May 7 surfaced ten drift items (D-01 through D-10). The QA audit adds three more — all three are `CLAUDE.md` self-violations. One existing item (D-03) is updated with new evidence.

| # | Source | Claim | Reality | Action |
|---|---|---|---|---|
| D-01 | `summary.md` | "Adding a language requires one constant + Sanity content" | **Partially false.** The `locale` ternary in two blog pages also requires a code change | Fix F-05 in #0e |
| D-02 | `summary.md` | "Three EN posts live in Sanity" | True for EN; `/es/blog` renders an empty list — not flagged in status table | Either backfill ES content or update status table |
| D-03 | `summary.md` | "AI Trends page — content-complete" | **Now extended:** Three hardcoded English strings appear on `/es/ai-trends` (technical audit), AND the FAQ accordion does not open at all on any device (Q-03 from QA audit). Calling this page "content-complete" is doubly inaccurate | Fix in #0 / #5 |
| D-04 | `summary.md` | Status table marks Task #8 as "Pending" | Confirmed accurate | None |
| D-05 | `summary.md` claim "hreflang via i18n routing" | URL structure alone does not emit hreflang tags | Update to "URL structure ready; hreflang tags pending #0c" |
| D-06 | `summary.md` | "Language switcher links to equivalent page" | Always routes to `/{lang}/` | Update to "Switcher routes to homepage; per-page equivalence pending #10" |
| D-07 | `go-live-guide.md` Phase 6.2 | References `amplify.yml` build spec | `amplify.yml` does not exist at repo root | Create file in #8 |
| D-08 | `go-live-guide.md` Phase 6.4 | Sanity webhook trigger described | Not configured anywhere | None — doc is forward-looking spec |
| D-09 | `.gitignore` | `.env` excluded by rule | `.env` is currently tracked | Run `git rm --cached .env` in #0a |
| D-10 | (no document flags this) | `imageMeta.ts` extends the `sanity.imageAsset` system type | Non-standard; could break on Sanity major upgrades | Document in `summary.md` schema notes (#11) |
| **D-11** | **`CLAUDE.md`** | **"Mobile-first responsive"** | **All CSS is desktop-first — 12 `@media (max-width)` queries, zero `@media (min-width)` queries** | **Refactor in #0f using QA audit's Section 7 standardization proposal** |
| **D-12** | **`CLAUDE.md`** | **"Only animate `transform` and `opacity`"** | **Two violations: `transition: width` on blog reading bar; `transition: max-height` on FAQ accordion** | **Replace in #0f: `transform: scaleX()` for the bar, JS height animation for the FAQ** |
| **D-13** | **`CLAUDE.md`** | **"Every clickable element needs hover, focus-visible, and active states. No exceptions."** | **`.dropdown-item` and `.faq-question` are missing `:active` states** | **Add in #0f** |

Thirteen drift items total (was 10). All thirteen are fixable in under 1.5 cumulative days. The `CLAUDE.md` self-violations (D-11–D-13) are particularly important because the project-rules file is what Claude Code and any human contributor consult before writing frontend code — drift between rules and reality compounds.

---

## 5. Recommended Roadmap (Mapped to Existing Task #0–12 Plan)

The May 7 audit produced `audits/IMPLEMENTATION_PLAN.md`, which is the canonical task tracker (it supersedes the "Next, in order" block at the top of `summary.md`). This synthesis updates the plan in **one place only**: Task #0 gains a new sub-item #0f.

### Task #0 — Pre-flight (NEW since May 7; **expands** in this synthesis) 🆕

The existing five sub-items (#0a–e) hold. The QA/mobile audit adds one consolidated sub-item:

| ID | Sub-task | Audit ref | Effort | Blocks |
|---|---|---|---|---|
| #0a | `git rm --cached .env`, add `.env.example`, commit | F-01, D-09 | S (5 min) | #8 |
| #0b | Add `seo` object to `aiTrendsPage` and `post` schemas | S-09 | M (1–2 hr) | #5 |
| #0c | Add canonical / hreflang / Open Graph / Twitter Card to `BaseLayout.astro` | S-02/03/05/06/07/08 | M (3–4 hr) | #5, #8 |
| #0d | Install `@astrojs/sitemap`, set `site` URL, create `public/robots.txt` | S-01, S-04 | M (45 min) | #8 |
| #0e | Fix EN/ES delocalization: `locale` in `LANG_META`, dynamic `language` source for `post.ts` | F-05, A-07, D-01 | M (2–3 hr) | #10 |
| **#0f** | **Visual / Mobile / A11y pre-flight (NEW):** centralize responsive breakpoint system in `global.css` per QA audit §7; fix mobile nav `!important` override (Q-01) and add drawer styles (Q-02); fix FAQ accordion (Q-03); replace `transition: width` and `transition: max-height` with allowed properties (Q-07); add `:active` states (Q-09); hamburger 44×44 hit area (Q-05); footer contrast (Q-12); `prefers-reduced-motion` (Q-16); `defer` on Tailwind CDN script (Q-15); update `CLAUDE.md` with the Responsive System section per QA audit §7 | Q-01–Q-09, Q-12, Q-15, Q-16, Q-17; D-11/12/13 | **M (4–6 hr)** | **#5** |

Also fix at the same time (unchanged from May 7): F-07 null-guard, F-06/S-16 alt-text validation, F-02/F-03/F-04 hardcoded English strings, F-13 default description, S-18 `noindex`.

**Total Task #0 effort: 1.5–2.5 days** (was 1–2). Do not start Task #5 until this is green.

### Tasks #5 through #12 — no other re-sequencing required

The QA findings either fit inside Task #0f (almost all) or land naturally inside Task #9 post-deploy (raw `<img>` → Astro `<Image>` migration; full Tailwind CDN → build-step migration; Lighthouse mobile real-device testing). No new tasks are warranted — the supervisor explicitly reviewed whether to propose a Task #13 and concluded it would create a parallel todo list rather than fitting findings inside the existing structure.

Specifically:

- **Task #5** — Pattern hardening from #0f means each batch automatically inherits a working mobile nav, the centralized breakpoint system, valid CSS transitions, complete interactive states, and proper touch targets. No scope change beyond the existing May 7 expansion.
- **Task #6** — No QA-driven changes. Bulk migration scripts and AI-assisted content remain as scoped.
- **Task #8** — No QA-driven changes. Webhook + amplify.yml + env vars + monitoring as scoped May 7.
- **Task #9** — Two QA items move here as the *post-deploy* polish layer: full Astro `<Image>` migration (Q-13 reinforces S-17) and a Lighthouse-mobile baseline run.
- **Task #10** — Unchanged. F-05/A-07 prerequisites still gate language 3.
- **Task #11** (NEW from May 7) — Operations Safety Net. Unchanged.
- **Task #12** (NEW from May 7) — AI Ops Pipeline. Unchanged.

---

## 6. New Tasks (none added in this synthesis)

The May 7 audit added Tasks #11 (Operations Safety Net) and #12 (AI Ops Pipeline). The QA/mobile audit added in this synthesis did **not** surface anything that warrants another new task. Every QA finding maps cleanly to Task #0f (pre-flight), Task #5 (pattern replication), or Task #9 (post-deploy polish). This is a deliberate choice — the supervisor's job is to fit findings into the existing 12-task structure where possible, and a new "Task #13: Mobile Stuff" would dilute that discipline.

The QA audit's *post-launch optimization roadmap* (priorities 1–7 in its Section 4) is explicitly post-launch work and naturally lives inside Task #9's tail end.

---

## 7. Decision Justification

**Recommendation: GO WITH CAVEATS — unchanged from May 7.**

The QA/mobile audit reinforces the May 7 conclusion. The trajectory is still credible: 12 sessions of real progress, sound architecture, locked-in tech stack, no findings that justify HOLD or PIVOT. What changed is that a fourth specialist looked specifically for the things the first three didn't cover, and found one launch-blocker cluster (mobile navigation completely broken) plus three `CLAUDE.md` self-violations. None of these are architectural — they are implementation gaps inside the locked-in design choices, which is exactly the category the audit cycle exists to surface.

The QA findings actually *strengthen* the case for the pre-flight pattern that Task #0 institutionalized in the May 7 plan. The May 7 logic was: "Don't replicate the AI Trends singleton pattern across 11 pages until the SEO and EN/ES gaps are closed in the base — otherwise we fix the same problem 11 times." The QA audit shows the same logic applies to the responsive system: a 30-minute centralization in `global.css` today saves eleven copies of the same broken responsive code tomorrow. This is high-leverage work being caught at exactly the right moment in the project lifecycle, which is the value an audit cycle is meant to produce. If the QA audit had run *after* Task #5, the cost would have been roughly 8–10× higher.

The cost picture remains the supporting argument. Today's burn is ~$1.25/month; full 15-language scale stays under $60/month. The largest hidden cost — manual content entry without bulk migration scripts — is a 80-to-13-hour delta that dwarfs any infrastructure decision. The QA additions to Task #0 cost approximately 4–6 hours of pre-flight work and prevent eleven copies of broken mobile navigation. Approve continued commitment, conditional on the expanded 30-day priority list landing on schedule. The decision in front of the boss is not "is this worth keeping" — it is "do we close the four specific gaps above (security + SEO foundation + EN/ES delocalization + Visual/Mobile/A11y) before the next push?" The supervisor's answer is yes; the work is bounded; the audit cycle is delivering exactly the early-warning value it was designed to.

---

## Appendix A — Audit Sources

- `audits/technical-audit.md` (2026-05-07) — Routing, Sanity schemas, i18n, Sanity-first compliance, build config, drift check
- `audits/seo-audit.md` (2026-05-07) — Indexability, multilingual structure, metadata, structured data, images, performance, migration
- `audits/automation-audit.md` (2026-05-07) — Build pipeline, deploy triggers, env management, bulk migration, AI ops, cost, monitoring, backup
- **`audits/qa-mobile-audit.md` (2026-05-08, NEW) — Responsive behavior, mobile navigation, touch targets, CLAUDE.md drift, accessibility, interactive states**
- `summary.md` — current project state and session-by-session changelog
- `go-live-guide.md` — phase-by-phase deployment roadmap
- `CLAUDE.md` — project rules and design guardrails
- `audits/IMPLEMENTATION_PLAN.md` — canonical task tracker (post-May-7 audit)
- `audits/FINAL_PROJECT_AUDIT_2026-05-07.md` — archived prior synthesis (for diff reference)

## Appendix B — Task Tracker Status After This Synthesis

| # | Task | Status | Net Audit-Driven Change (May 7 + 2026-05-08) |
|---|---|---|---|
| 1 | Restructure repo | ✅ Done | No change |
| 2 | Dynamic Nav language switcher | ✅ Done | No change (S-14 / per-page equivalence stays in #10) |
| 3 | Sanity schema POC for AI Trends | ✅ Done | No change |
| 4 | Implement Sanity POC | ✅ Done | No change |
| **0** | **Pre-flight (NEW from May 7; expanded in 2026-05-08)** | ⏳ Pending | **6 sub-items: #0a–#0e from May 7; #0f Visual/Mobile/A11y NEW. 1.5–2.5 days.** |
| 5 | Port remaining 11 pages (Batch A → B → C) | ⏳ Blocked by #0 | Pattern hardening from #0 includes mobile/A11y from this synthesis |
| 6 | Enter EN + ES content + bulk migration scripts | ⏳ Parallel to #5 | No change from May 7 |
| 7 | Update `go-live-guide.md` for AWS Amplify | ✅ Done | No change |
| 8 | Deploy to AWS Amplify with Sanity webhook | ⏳ Pending; gated by #0a | No change from May 7 |
| 9 | SEO + performance polish (post-deploy) | ⏳ Pending | Adds: Q-13 image migration alongside S-17; Q-15 full Tailwind CDN → build-step migration; Lighthouse mobile baseline |
| 10 | Scale to languages 3–15 | ⏳ Pending; gated by #0e | No change from May 7 |
| 11 | Operations Safety Net (NEW from May 7) | ⏳ Proposed | No change |
| 12 | AI Ops Pipeline (NEW from May 7) | ⏳ Proposed | No change |

---

*End of report. This synthesis is dated 2026-05-08. The prior May 7 version is archived at `audits/FINAL_PROJECT_AUDIT_2026-05-07.md` for diff comparison.*
