# AI Token Global — Final Project Audit Report

**Date:** 2026-05-07
**Prepared by:** Project Supervisor (synthesizing technical, SEO, and automation audits)
**Audience:** Project sponsor / decision-maker
**Decision asked:** Continue resource commitment to AI Token Global?

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
- **Mobile traffic is expected to dominate** but no specialist mobile audit has been run yet. The current three audits cover technical, SEO, and automation; mobile-display optimization is a known gap and may warrant a fourth specialist audit before launch.

---

## 1. Executive Summary

**Recommendation: GO WITH CAVEATS.** The architecture is sound and the team has shipped real progress through 12 sessions, but three specific gaps must be closed before the next milestone (AWS Amplify deploy) and before scaling beyond two languages.

### Top 3 Strengths

1. **Core architecture is correctly implemented and locked in.** Dynamic `[lang]` routing, Sanity-first content, `getStaticPaths()` over `SUPPORTED_LANGS`, and the language switcher all work as designed. There are no build-breaking issues. The Astro + Sanity + AWS Amplify stack is the right choice for a 15-language content hub at this budget.
2. **Sanity schema quality is high and the POC pattern is reusable.** Both `post` and `aiTrendsPage` use Portable Text for body fields, require `language`, and reuse `faqItem` correctly. This pattern can scale to the remaining 11 page schemas without redesign.
3. **Cost trajectory is highly favorable.** Current burn is roughly $1.25/month (domain only). Projected burn at 12-month scale (5+ languages, 50K visitors/month, 20 publishes/day) is $26–34/month. Even at full 15-language scale, the budget stays under $60/month — well within tolerance.

### Top 3 Risks

1. **`.env` is committed to git** with the live Sanity project ID. This is a security and quota-abuse exposure that contradicts the file's own warning header. **Must fix before the next push, regardless of other priorities.**
2. **Zero SEO infrastructure exists today** — no `robots.txt`, no sitemap, no canonical tags, no `hreflang`, no Open Graph tags, and no SEO fields in any Sanity schema. Launching without these means English and Spanish pages will compete for the same keyword rankings, and every social share will produce a blank preview.
3. **Two hidden EN/ES assumptions will silently break at language 3.** The `locale` ternary (`lang === 'es' ? 'es-ES' : 'en-US'`) in both blog pages and the static language list inside `studio/schemas/post.ts` are exactly the regressions Session 11 warned against. Both must be fixed before adding any third language; otherwise the documented "one constant + Sanity content" guarantee is false.

### 30-Day Priorities

- **Week 1: Security and SEO foundation.** Remove `.env` from git, add the `seo` object to `aiTrendsPage` and `post` schemas, add `<link rel="canonical">`, `hreflang`, and Open Graph tags to `BaseLayout.astro`, install `@astrojs/sitemap`, create `public/robots.txt`. Doing this **now** — before Task #5 replicates the singleton pattern across 11 pages — avoids fixing the same problem 11 times.
- **Week 2: Deploy infrastructure.** Add `amplify.yml` to repo, set Amplify Console environment variables, configure the Sanity → Amplify webhook (the single biggest leverage point in the entire project — without it, every content publish leaves the live site stale).
- **Week 3: Bulk migration scripts.** Write `scripts/upload-images.js` and `scripts/convert-articles.js`. These two scripts convert what would be 80–120 hours of manual data entry into 10–13 hours.
- **Week 4: Begin Task #5 page port.** Start with Batch A (the four API model pages) using the SEO-hardened singleton pattern from Week 1.

### Cost Trajectory

| Stage | Languages | Traffic | Build Activity | Monthly Cost |
|---|---|---|---|---|
| Today (pre-launch) | 2 (EN + ES) | 0 | 0 builds | ~$1.25 |
| Month 6 | 2 | ~5K visitors | ~10 publishes/day | ~$3–5 |
| Month 12 | 5+ | ~50K visitors | ~20 publishes/day | ~$26–34 |
| Full scale | 15 | Daily publishing | All langs active | ~$50–60 |

The current team (one technical operator + one editor) can maintain through Month 12 if AI translation drafting is built before language 3 is added. Beyond that, headcount needs to grow either with a contracted translator or with the AI ops pipeline operating at scale.

---

## 2. Risk Matrix

All findings from the three specialist audits, grouped by impact tier. Severity is the supervisor's judgment after cross-checking — it may differ from the original auditor's rating where the supervisor disagrees.

### Bucket A — Blocking Launch (cannot deploy or will visibly break)

| ID | Finding | Source | Effort | Owner Task |
|---|---|---|---|---|
| A-01 | `amplify.yml` does not exist at repo root; build spec not version-controlled | Automation | S (1 hr) | #8 |
| A-02 | Sanity → Amplify publish webhook entirely unconfigured — content edits will not trigger rebuilds | Automation | S (30 min) | #8 |
| A-03 | Amplify Console env vars (`PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`) not set — first deploy will return empty Sanity queries with no error | Automation | S (10 min) | #8 |
| F-01 | `.env` committed to git with live `mq3wxr8n` project ID despite gitignore policy | Technical | S (5 min) | #8 (security gate) |
| S-01 | No `public/robots.txt` — search engines have no crawl instructions or sitemap pointer | SEO | S (15 min) | #9 |
| S-04 | `astro.config.mjs` has no `site` URL and no sitemap integration installed | SEO | S (30 min) | #9 |
| S-02 / S-03 / S-05 | No `hreflang` tags anywhere; sitemap won't include hreflang clusters | SEO | M (3–4 hr) | #9 |
| S-06 | No `<link rel="canonical">` on any page | SEO | S (30 min) | #9 |
| S-07 / S-08 | No Open Graph or Twitter Card tags — every social share produces a blank preview | SEO | M (2–3 hr) | #9 |
| S-18 | Coming Soon homepage will be indexed with thin content; no `noindex` mechanism | SEO | S (30 min) | #9 or #5 |

**Total launch-blocker count: 9.** Note that 8 of 9 belong to two known-pending tasks (#8 deploy and #9 SEO). They are not surprises — they are the work the team already planned to do. The audit confirms scope is correctly identified; the only true new finding in this tier is F-01 (`.env` in git), which is genuinely off-plan.

### Bucket B — Blocking Scale (works at EN+ES, breaks at language 3+ or 200+ articles)

| ID | Finding | Source | Effort | Owner Task |
|---|---|---|---|---|
| F-05 | `locale` ternary (`lang === 'es' ? 'es-ES' : 'en-US'`) in both blog pages — silently defaults to `en-US` when third language is added | Technical | S (15 min) | #10 prereq |
| A-07 | `studio/schemas/post.ts` `language` field is a static `list` of `['en','es']` — adding language 3 requires schema edit + Studio redeploy | Automation | M (2 hr or install plugin) | #10 prereq |
| S-09 | No `seo` object in any Sanity schema — must be added to base pattern *before* it is replicated to 11 pages in Task #5 | SEO | M (1 hr per schema) | #5 + #9 |
| F-07 | `ai-trends.astro` renders blank silently if Sanity returns `null` — failure mode invisible to editors | Technical | S (10 min) | #5 (pattern hardening) |
| S-14 | Language switcher always routes to `/{lang}/` instead of equivalent page — UX gets worse with each language added | SEO | M (3 hr) | #10 |
| A-05 / A-06 | No bulk migration scripts — 200+ articles and images will require 80–120 hours of manual Sanity entry | Automation | M (10–13 hr to build, saves ~110 hr) | #6 (scope expansion) |
| A-09 / A-10 | No AI-assisted meta-description or alt-text generation — manual cost grows linearly with content | Automation | M (1 day each) | #6 / #10 |

### Bucket C — Quality and Optimization (improves but does not block)

| ID | Finding | Source | Effort | Owner Task |
|---|---|---|---|---|
| F-02 / F-03 / F-04 | Hardcoded English strings in `[lang]/index.astro`, `ai-trends.astro`, `blog/[slug].astro` — Spanish users see English UI elements | Technical | S (1 hr total) | #5 (during port) |
| F-06 / S-16 | `coverImage` has no alt-text field; inline image alt has no `Rule.required()` validation | Technical / SEO | S (15 min) | #5 (schema update) |
| F-08 | Hard-coded `https://aitokenglobal.com` in blog slug page should use `Astro.site` | Technical | S (10 min) | #9 |
| F-13 | Default `description` prop in `BaseLayout.astro` is English-only | Technical | S (15 min) | #5 / #9 |
| S-13 | Google Fonts loaded via render-blocking CSS `@import`; no preconnect | SEO | S (15 min) | #9 |
| S-17 | Raw `<img>` tags everywhere instead of Astro `<Image>` — no WebP, no `srcset`, no CLS prevention | SEO | L (1 day) | #9 / post-launch |
| A-08 | No webhook debounce — every Sanity publish triggers a build (potential 40% reduction with 15-min quiet period) | Automation | S (2 hr) | #8 (enhancement) |
| A-11 | No Amplify build-failure notifications | Automation | S (15 min) | #8 (enhancement) |
| A-12 | No AWS Budget alarms for cost spikes | Automation | S (15 min) | #8 (enhancement) |
| A-13 | No Sanity dataset backup automation | Automation | M (2 hr) | NEW (proposed Task #11) |

### Bucket D — Nice-to-Have (defer to post-launch)

| ID | Finding | Source | Effort |
|---|---|---|---|
| F-09 | Privacy / Terms footer links are dead `href="#"` | Technical | S (1 hr) |
| F-10 | Sources download CTA links to `href="#"` with no file | Technical | S (15 min) |
| F-11 | Copyright year is 2025; brand name reads "AI Token King" instead of "AI Token Global" | Technical | S (5 min) |
| S-10 | No `Article` JSON-LD on blog post pages | SEO | M |
| S-11 | No `FAQPage` JSON-LD on AI Trends page | SEO | M |
| S-12 | No `Organization` JSON-LD anywhere | SEO | S |
| S-15 | No `BreadcrumbList` JSON-LD | SEO | M |
| A-14 | No `node_modules` cache key in `amplify.yml` | Automation | S |
| A-15 | No branch auto-deploys for preview URLs | Automation | S |

---

## 3. Specialist Audit Highlights

### 3.1 Technical Audit — Headline

> The core architecture is sound. `[lang]` routing, `getStaticPaths()`, Sanity-first content, and dynamic language switching are correctly implemented. The blockers are concentrated in two places: `.env` is committed to git (a security exposure), and several hardcoded English strings violate the Sanity-first principle and appear on the Spanish site today.

**Most-important findings (from Technical Audit F-01 to F-13):**

- **F-01 — `.env` tracked by git despite gitignore policy.** The file header itself warns "Do not add secrets to this file, as it is source controlled!" — awareness exists but enforcement does not. Although `PUBLIC_*` values are not write-capable keys, the project ID being public exposes the Sanity free-tier quota to abuse.
- **F-05 — `locale` ternary regression risk.** This is the exact pattern Session 11 explicitly warned against eliminating. The fix is small (adding `locale` to `LANG_META` in `src/i18n/index.ts` and replacing both ternaries) but the cost of leaving it grows with every language added.
- **F-07 — Silent null-render in `ai-trends.astro`.** If `PUBLIC_SANITY_PROJECT_ID` is unset or no document exists, the build succeeds but the page is empty with no error surfaced. This pattern must be fixed before it is copy-pasted into 11 more pages during Task #5.
- **Sanity schemas are well designed.** Both `post` and `aiTrendsPage` require `language` via `Rule.required()`. The reusable `faqItem` is correctly referenced as `{ type: 'faqItem' }` rather than redefined inline. `accentColor` uses `options.list` with named labels rather than free-text hex inputs.

### 3.2 SEO Audit — Headline

> The site has no SEO infrastructure at all. Launching today would mean search engines crawl blind, English and Spanish pages compete for the same rankings, every social share produces a blank preview, and zero structured data unlocks rich results. None of this is hidden — Phase 8 of `go-live-guide.md` correctly anticipates the work — but none of it is built yet, and the biggest items must land *before* Task #5 replicates the singleton pattern.

**Multilingual Readiness Scorecard:**

| SEO Check | EN | ES | Status |
|---|---|---|---|
| `<html lang>` set correctly | PASS | PASS | ✅ Set in BaseLayout from `lang` param |
| `<link rel="canonical">` | FAIL | FAIL | Not implemented anywhere |
| `hreflang="en"` self-tag | FAIL | FAIL | Not implemented |
| `hreflang="es"` cross-tag | FAIL | FAIL | Not implemented |
| `hreflang="x-default"` | FAIL | FAIL | Not implemented |
| Sitemap with hreflang clusters | FAIL | FAIL | Sitemap integration not installed |
| Per-page CMS meta description | FAIL | FAIL | No `seoDescription` field in any schema |
| Open Graph tags | FAIL | FAIL | Not in BaseLayout |
| Language switcher → equivalent page | FAIL | FAIL | Always routes to homepage |
| Structured data (JSON-LD) | FAIL | FAIL | None anywhere |

**Overall: 1 of 10 passing.** Scaling from 2 to 15 languages with this baseline multiplies every failure 15-fold. The `hreflang` and sitemap gaps become exponentially more damaging as language count grows.

**Pre-launch must-fix order (from SEO audit):** robots.txt → sitemap integration + `site` URL → canonical tags → hreflang tags → Open Graph + Twitter Card → `seo` object in schemas → `noindex` on Coming Soon homepage.

### 3.3 Automation Audit — Headline

> The architectural automation works — dynamic routing generates all language variants from one codebase, and Astro builds the static site cleanly. But the operational glue is missing: no `amplify.yml`, no Sanity webhook, no env vars in Amplify Console, and no bulk migration scripts. The single biggest leverage point in the entire project is the Sanity → Amplify webhook — a 30-minute task whose absence means every content publish leaves the live site stale.

**Pipeline status:**

```
LOCAL DEV               ✅ working — Astro 4321, Sanity Studio 3333
CONTENT AUTHORING       ✅ working — Sanity production dataset live
   └─ webhook to Amplify ❌ MISSING — content edits do not trigger rebuilds
CODE DEPLOY (git push)  ⚠️  partially configured — Amplify auto-detects but no amplify.yml
LIVE SITE               ❌ not yet deployed
BULK MIGRATION SCRIPTS  ❌ none exist — 200+ articles will be manual
AI OPS                  ❌ no automation in place
MONITORING              ❌ no build alerts, no cost alarms, no backup
```

**AI-Assisted Ops Roadmap (priority-ordered):**

1. **Translation drafting** — Claude drafts new-language versions from EN documents; human translator reviews. Saves ~8 hours per language per content batch. **Build before adding language 3.**
2. **Alt text generation** — vision model generates alt text on every image upload. Saves ~3 hours per 200-image batch. Build before article import.
3. **Meta description generation** — Claude generates `seoDescription` from page body. Saves ~5 hours per 165-page complete publish. Build alongside SEO schema addition.
4. **FAQ extraction** — extract candidate `faqItem` blocks from long-form articles. Saves ~15 hours per 200-article batch. Post-launch, first 30 days.
5. **Content QA** — Claude audits all published pages for hardcoded English strings, missing translations, broken links. Saves ~2 hours/week.

ROI at 15-language scale: translation drafting alone saves ~120 hours per full content update cycle. At Anthropic API pricing, the cost per page draft is roughly $0.02–0.10 — orders of magnitude cheaper than human translation.

---

## 4. Drift Report (Documented Claims vs. Actual State)

| # | Source | Claim | Reality | Action |
|---|---|---|---|---|
| D-01 | `summary.md` | "Adding a language requires one constant + Sanity content" | **Partially false.** The `locale` ternary in two blog pages also requires a code change | Fix F-05; then claim becomes true |
| D-02 | `summary.md` | "Three EN posts live in Sanity" | True for EN; `/es/blog` renders an empty list — not flagged in status table | Either backfill ES content or update status table to show this asymmetry |
| D-03 | `summary.md` | "AI Trends page — content-complete" | **Overstated.** Three hardcoded English strings appear on `/es/ai-trends` | Update to "EN content-complete; ES has hardcoded UI strings pending" |
| D-04 | `summary.md` | Status table marks Task #8 as "Pending" | Confirmed accurate | None — accurate |
| D-05 | `summary.md` claim "hreflang via i18n routing" | URL structure alone does not emit hreflang tags; zero `<link rel="alternate">` exist | URL structure is necessary but not sufficient | Update to "URL structure ready; hreflang tags pending Phase 8" |
| D-06 | `summary.md` | "Language switcher links to equivalent page" | Always routes to `/{lang}/` (homepage) regardless of current page | Update to "Switcher routes to homepage; per-page equivalence pending" |
| D-07 | `go-live-guide.md` Phase 6.2 | References `amplify.yml` build spec | `amplify.yml` does not exist at repo root | Either create the file (preferred) or update doc to reflect auto-detection |
| D-08 | `go-live-guide.md` Phase 6.4 | Sanity webhook trigger described | Not configured anywhere | None — doc is a forward-looking spec, correctly aspirational |
| D-09 | `.gitignore` | `.env` excluded by rule | `.env` is currently tracked | Run `git rm --cached .env` and commit |
| D-10 | (no document flags this) | `imageMeta.ts` extends the `sanity.imageAsset` system type | This is non-standard; could break on Sanity major upgrades | Document the risk in `summary.md` schema notes |

Ten drift items is on the high end of the supervisor's expected 2–10 range. This is **not** a sign of negligence — three audits in one day will surface drift that gradually accumulated across 12 sessions. None of the items are catastrophic; all are fixable in under one cumulative day of work.

---

## 5. Recommended Roadmap (Mapped to Existing 10-Task Tracker)

The project already maintains a 10-task tracker in `summary.md`. The audit does **not** invent a competing list. For each pending task, the audit specifies what changes:

### Task #5 — Port remaining 10 pages using Sanity singleton pattern (⏳ Next)

**Audit findings affecting it:**
- S-09: `seo` object missing from base singleton pattern → must be added *before* replication
- F-07: silent null-render pattern → must be hardened before copy-paste to 11 pages
- F-02 / F-03 / F-04: hardcoded English strings → fix the pattern in `aiTrendsPage` before replicating
- F-06 / S-16: `coverImage` alt-text validation → add to schema pattern

**Scope expansion:** Before porting *any* of the 10 pages, harden the `aiTrendsPage` pattern with: (1) the `seo` object, (2) a null-guard pattern, (3) all i18n strings moved out of `.astro` files, (4) required alt-text validation. This is a 1–2 day investment that prevents fixing the same problem 11 times.

**Sequencing recommendation:** Pause Task #5 until pattern hardening is complete, then resume with Batch A.

### Task #6 — Enter EN + ES content into Sanity for all pages (⏳ Parallel to #5)

**Audit findings affecting it:**
- A-05 / A-06: bulk migration scripts (image upload, article conversion) — write before manual entry
- A-09 / A-10: AI-assisted meta description and alt text — build alongside content entry

**Scope expansion:** Build the bulk migration scripts as part of this task, not as a separate effort. The 10–13 hours of script work saves ~110 hours of manual entry — a 10x return.

**Sequencing recommendation:** Bulk image upload + article conversion runs first, then content entry uses the imported data as a starting point.

### Task #8 — Deploy to AWS Amplify with Sanity webhook (⏳ Pending)

**Audit findings affecting it:**
- A-01: create `amplify.yml` at repo root
- A-02: configure Sanity → Amplify webhook (the 30-minute fix that prevents stale-site syndrome)
- A-03: set Amplify Console env vars
- F-01 / A-04: remove `.env` from git tracking *before* first push
- A-08: webhook debounce (2-hour task, ~40% build minute reduction)
- A-11: build-failure notifications
- A-12: AWS Budget alarms

**Scope expansion:** Add A-08, A-11, A-12 to this task — they are 15-minute additions each and prevent expensive surprises later. The webhook debounce is borderline (could go to post-launch), but doing it now is cheap.

**Sequencing recommendation:** F-01 fix is a hard prerequisite — do not push to git until `.env` is untracked.

### Task #9 — Add SEO basics (⏳ Pending)

**Audit findings affecting it:**
- All 8 SEO blockers (S-01 through S-08, S-18) live here
- F-08: `astro.config.mjs` `site` URL belongs here
- S-13: Google Fonts preconnect

**Scope expansion:** Move *part* of this task earlier. The SEO foundation that affects schemas (S-09 — the `seo` object) must land in Task #5 pattern hardening, not after. The `BaseLayout` work (canonical, hreflang, Open Graph) and the static files (robots.txt, sitemap config) can stay in Task #9 as scoped.

**Sequencing recommendation:** Split this task into "Task #9a — Schema SEO foundation (do first, blocks Task #5)" and "Task #9b — BaseLayout SEO + sitemap + robots (do after Task #8 deploy)."

### Task #10 — Scale to languages 3–15 (⏳ Pending)

**Audit findings affecting it:**
- F-05: `locale` ternary fix (hard prerequisite — adding language 3 silently breaks date formatting otherwise)
- A-07: `post.ts` `language` field — install `sanity-plugin-document-internationalization` or convert to dynamic list
- S-14: language switcher per-page equivalence (UX gets worse with each language added)
- AI translation drafting roadmap (build before language 3)

**Scope expansion:** Treat F-05 and A-07 as blockers, not "nice to have." Without them, the documented "one constant + Sanity content" guarantee is false.

**Sequencing recommendation:** No new dependencies. This task remains correctly sequenced after #5/#6/#8/#9.

---

## 6. New Tasks (Proposed Additions to Tracker)

The audit aimed to fit findings inside the existing 10-task tracker wherever possible. Two genuinely new items emerged that do not fit any existing task:

### Proposed Task #11 — Operations Safety Net

**Scope:**
- Weekly Sanity dataset export to S3 or GitHub Action artifact (A-13)
- Pre-commit hook to block token-shaped values (A-04 enhancement)
- Documentation note about `imageMeta.ts` extending a Sanity system type (D-10)

**Why it doesn't fit existing tasks:** Backup automation is not deploy work (Task #8) and not SEO work (Task #9). It is post-deploy operational hygiene.

**Effort:** 4–6 hours total. **Priority:** within first 30 days post-launch.

### Proposed Task #12 — AI Ops Pipeline

**Scope:**
- Claude-based translation drafting (priority 1; build before language 3)
- Vision-model alt-text generation on image upload (priority 2; build before article import)
- Claude-based meta description generation (priority 3; alongside SEO schema work)
- FAQ extraction (priority 4; post-launch)
- Content QA (priority 5; when team grows)

**Why it doesn't fit existing tasks:** Task #10 is "scale to languages 3–15" — the *act* of scaling. The AI ops pipeline is *how* the scaling becomes affordable. They are coupled but distinct.

**Effort:** 1–2 days per priority, totaling 5–10 days across all five. **Priority:** start before language 3 (priorities 1 and 2), continue post-launch.

---

## 7. Decision Justification

**Recommendation: GO WITH CAVEATS.**

The trajectory is credible. After 12 sessions, the team has shipped a working multilingual site skeleton with two languages, Sanity-driven content for the AI Trends page, and a clean Astro + Sanity + Amplify architecture. The audit found no fundamental architecture errors that would justify a HOLD or PIVOT recommendation. The remaining work is execution-shaped, not design-shaped.

The caveats are real, however, and the boss should hold the team to them before the next milestone. The most important is that **Task #9 SEO work cannot be deferred to post-launch**, even though the existing roadmap implies that ordering. The `seo` object must land in the Sanity schema pattern *before* Task #5 replicates that pattern across 11 pages — otherwise the same fix gets applied 11 times instead of once. A 1-day investment in pattern hardening saves roughly 8–11 days of fix-everywhere work later. Similarly, the `.env` file currently tracked by git is a 5-minute fix that becomes a much harder cleanup if more secrets accumulate or if the repo is shared more broadly.

The cost picture supports continued commitment. Current monthly burn is approximately $1.25 (domain only). Even at full 15-language scale with daily publishing, the budget projects to $50–60 per month — a rounding error against any reasonable opportunity-cost comparison for a multilingual content hub. The biggest cost lever is the Sanity → Amplify webhook debounce (a 2-hour build), which can reduce build minutes by ~40% and keep Month 12 costs in the $15–22 range. The single largest hidden cost is **manual content entry without bulk-migration scripts** — 80–120 hours of editor time that the proposed scripts compress to 10–13 hours. That delta dwarfs any infrastructure cost decision and is the strongest argument for continued investment: the scripts pay for themselves on first use, and the team has the skills to write them. The decision in front of the boss is therefore not "is this worth keeping" — it is "do we close the three specific gaps above before the next push?" The supervisor's answer is yes, and the work is bounded. Approve continued commitment, conditional on the 30-day priority list landing on schedule.

---

## Appendix A — Audit Sources

- `audits/technical-audit.md` (2026-05-07) — Routing, Sanity schemas, i18n, Sanity-first compliance, build config, drift check
- `audits/seo-audit.md` (2026-05-07) — Indexability, multilingual structure, metadata, structured data, images, performance, migration
- `audits/automation-audit.md` (2026-05-07) — Build pipeline, deploy triggers, env management, bulk migration, AI ops, cost, monitoring, backup
- `summary.md` — current project state and session-by-session changelog
- `go-live-guide.md` — phase-by-phase deployment roadmap
- `CLAUDE.md` — project rules and design guardrails

## Appendix B — 10-Task Tracker Status After Audit

| # | Task | Status | Audit-Driven Change |
|---|---|---|---|
| 1 | Restructure repo: Astro to root, archive HTML prototype | ✅ Done | No change |
| 2 | Fix Nav language switcher to be dynamic | ✅ Done | No change (S-14 adds per-page equivalence to #10) |
| 3 | Design Sanity schema POC for one page (AI Trends) | ✅ Done | No change |
| 4 | Implement Sanity POC: schema + Astro fetch + EN/ES content | ✅ Done | No change |
| 5 | Port remaining 10 pages using Sanity singleton pattern | ⏳ Next | **Pause until pattern hardening complete** (1–2 day investment) |
| 6 | Enter EN + ES content into Sanity for all pages | ⏳ Parallel to #5 | Add bulk migration scripts as in-scope |
| 7 | Update `go-live-guide.md` for AWS Amplify | ✅ Done | No change |
| 8 | Deploy to AWS Amplify with Sanity webhook | ⏳ Pending | Add webhook debounce, build alerts, budget alarms; F-01 is a hard prerequisite |
| 9 | Add SEO basics | ⏳ Pending | **Split into 9a (schema SEO, blocks #5) and 9b (BaseLayout + sitemap, after #8)** |
| 10 | Scale to languages 3–15 | ⏳ Pending | F-05 + A-07 are hard prerequisites |
| **11 (NEW)** | **Operations Safety Net** | ⏳ Proposed | Backup, pre-commit hook, schema risk doc |
| **12 (NEW)** | **AI Ops Pipeline** | ⏳ Proposed | Translation drafting, alt text, meta desc, FAQ extraction, QA |

---

*End of report.*
