# AI Token Global — Implementation Plan (Post-Audit)

**Date:** 2026-05-08 (v2.1 — adds Task #0f from QA/mobile audit)
**Supersedes:** the "Next, in order" block at the top of `summary.md` and the implicit Task #5 → #6 → #8 → #9 → #10 sequence used through Session 12
**Driven by:** `audits/FINAL_PROJECT_AUDIT.md` (Sections 5–6, Appendix B) and the underlying technical / SEO / automation / QA-mobile audits
**Owner:** Antonio (project) · Claude Code (implementation) · Claude (review/planning)

---

## What Changed in v2.1 (2026-05-08)

The v2 plan (May 7) introduced Task #0 pre-flight with five sub-items (#0a–#0e). The QA/mobile audit run on 2026-05-08 surfaced findings that must also land before Task #5 — most notably a centralized responsive breakpoint system in `src/styles/global.css` and several `CLAUDE.md` self-violations. These have been bundled into a new **Task #0f — Visual / Mobile / A11y pre-flight** (~4–6 hours).

The v2.1 changes are limited to:
- Task #0 sub-items table — adds row #0f
- Sequenced queue step 2 — notes #0f alongside #0b–e
- Total Task #0 effort updates from 1–2 days to **1.5–2.5 days**
- Task #9 gains two post-deploy items moved from QA findings (Q-13 image migration alongside S-17; Q-15 full Tailwind CDN → build-step migration; Lighthouse mobile baseline)

No tasks were re-sequenced beyond Task #0's expansion. No new top-level tasks were added — the supervisor explicitly checked whether to propose Task #13 and concluded the QA findings fit cleanly inside #0/#5/#9.

---

## What Changed (Plan v1 → v2)

The pre-audit plan was a four-step queue: **port pages → deploy → SEO → scale**. The audit found three problems with that ordering, none of them about *what* to do — all of them about *when*:

1. **`.env` is in git today.** Not on the old plan at all. Five-minute fix, but it's a hard prerequisite for the next push and was off-radar.
2. **SEO foundation must precede page porting**, not follow it. The `seo` object on the Sanity schema, and canonical/hreflang/OG in `BaseLayout.astro`, have to be in place *before* Task #5 stamps the singleton pattern across 11 pages — otherwise the same gap is fixed 11 times instead of once. This is a 1–2 day investment that the audit estimates saves 8–11 days of fix-everywhere work later.
3. **Two EN/ES assumptions silently break at language 3.** The `locale` ternary in the blog pages and the static `['en','es']` list in `studio/schemas/post.ts` contradict the documented "one constant + Sanity content" guarantee in `summary.md`. They're prerequisites for Task #10, not nice-to-haves.

The audit also adds two new tasks (#11 Operations Safety Net, #12 AI Ops Pipeline) that don't fit cleanly inside the existing 10. They're appended.

---

## Reordered Task Tracker

Status legend: ✅ done · ⏳ pending · 🆕 new (audit-added) · ⚠️ blocked

Audit IDs in brackets reference findings in `audits/FINAL_PROJECT_AUDIT.md` Section 2 (Risk Matrix). Effort sizes: **S** = under 1 hr · **M** = 1 hr to 1 day · **L** = 1+ days.

### Task #1 — Restructure repo (Astro at root, archive HTML) ✅
No audit changes.

### Task #2 — Dynamic Nav language switcher ✅
No audit changes. (S-14 — per-page equivalence — moves to Task #10.)

### Task #3 — Sanity schema POC for AI Trends ✅
No audit changes.

### Task #4 — Implement Sanity POC (schema + Astro fetch + EN/ES content) ✅
No audit changes.

---

### Task #0 — Pre-flight (NEW, blocks Task #5) 🆕

The audit's "Week 1: Security and SEO foundation." Five sub-items, all small, all blocking. This is the only place the queue meaningfully changes.

| ID | Sub-task | Audit ref | Effort | Blocks |
|---|---|---|---|---|
| **#0a** | `git rm --cached .env`, add `.env.example`, commit | F-01, D-09 | S (5 min) | #8 (cannot push until done) |
| **#0b** | Add `seo` object (`seoTitle`, `seoDescription`, `ogImage`, `noindex`) to `aiTrendsPage` and `post` schemas in `studio/schemas/` | S-09 | M (1 hr per schema) | #5 |
| **#0c** | Add `<link rel="canonical">`, `hreflang` cluster, Open Graph + Twitter Card to `BaseLayout.astro`; consume `seo` object when present | S-02/03/05, S-06, S-07/08 | M (3–4 hr) | #5, #8 |
| **#0d** | Install `@astrojs/sitemap`, set `site` URL in `astro.config.mjs`, create `public/robots.txt` with sitemap pointer | S-01, S-04 | M (45 min) | #8 |
| **#0e** | Fix EN/ES delocalization: add `locale` to `LANG_META` in `src/i18n/index.ts`, replace ternaries in both blog pages; convert `studio/schemas/post.ts` `language` list to dynamic source (or install `sanity-plugin-document-internationalization`) | F-05, A-07, D-01 | M (2–3 hr) | #10 (hard) |
| **#0f** | **Visual / Mobile / A11y pre-flight (NEW v2.1).** Centralize the responsive breakpoint system in `src/styles/global.css` per QA audit §7 (3 breakpoints: 640/1024/1280, mobile-first `min-width` queries, `.grid-auto-3` / `.grid-auto-2` / `.container-page` utilities, `clamp()` heading scale). Fix mobile nav `!important` override (Q-01) and add drawer styles (Q-02). Fix FAQ accordion JS/CSS mismatch (Q-03). Replace `transition: width` (blog reading bar) with `transform: scaleX()`; replace FAQ `transition: max-height` with JS height animation (Q-07). Add `:active` states to `.dropdown-item` and `.faq-question` (Q-09). Set `min-width: 44px; min-height: 44px` on `#mobile-menu-btn` (Q-05). Lighten footer secondary text from `#666` to `#999` for WCAG AA (Q-12). Wrap blob/scroll animations in `@media (prefers-reduced-motion: no-preference)` (Q-16). Add `defer` to Tailwind CDN script (Q-15). Update `CLAUDE.md` with the Responsive System section per QA audit §7. | Q-01 to Q-09, Q-12, Q-15, Q-16, Q-17; D-11/12/13 | **M (4–6 hr)** | **#5** |

Also fix at the same time, since they touch the same files:
- F-07 — null-guard on `ai-trends.astro` Sanity fetch (10 min) → blocks #5
- F-06 / S-16 — `coverImage` alt-text validation in `post.ts` (15 min) → blocks #5
- F-02 / F-03 / F-04 — hardcoded English strings in `[lang]/index.astro`, `ai-trends.astro`, `blog/[slug].astro` (1 hr) → blocks #5
- F-13 — English-only default `description` in `BaseLayout.astro` (15 min) → blocks #5
- S-18 — `noindex` on Coming Soon homepage (uses #0b's `noindex` field) (5 min)

**Total Task #0 effort: 1.5–2.5 days** (was 1–2 days in v2; +0.5 day for #0f). Do not start Task #5 until this is green.

**Sub-task ordering inside Task #0:** do #0a first (security gate); then #0b–e and #0f can run in any order. #0f can be done in parallel with #0b–e by a second contributor since it touches only `global.css`, `Nav.astro`, and the FAQ-related blocks of `ai-trends.astro` and `blog/[slug].astro` — minimal overlap with the SEO and i18n work in #0b–e.

---

### Task #5 — Port remaining 11 pages (Batch A → B → C) ⏳

**Status:** ⚠️ blocked by Task #0. Resume once pre-flight is green.

Same Batch A / B / C plan as Session 12. Pattern hardening from Task #0 means each batch automatically gets SEO fields, null-guards, alt-text validation, and i18n strings out of `.astro` files.

| Batch | Pages | Schema strategy |
|---|---|---|
| A | `api-compare`, `chatgpt-api`, `claude-api`, `gemini-api` | One shared schema with model-focus variations; reuse `faqItem` |
| B | `beginners-guide`, `user-guide`, `use-cases`, `token-calculator`, `compliance` | Per-page schemas; FAQ array via `faqItem` |
| C | Homepage (`/[lang]/`) | Build last so A and B inform the pattern |

Stop after Batch A and review one rendered page before B. Effort: ~1 day per batch for schemas + templates (content entry is Task #6).

---

### Task #6 — Enter EN + ES content + bulk migration scripts ⏳ (parallel to #5)

**Audit changes:** scope expanded to include the bulk migration scripts. The audit estimates these scripts compress 80–120 hr of manual entry into 10–13 hr — a 10× return that pays for itself on first use.

| Sub-task | Audit ref | Effort |
|---|---|---|
| `scripts/upload-images.js` — bulk upload archive images to Sanity assets, set `articleNumber` via `imageMeta.ts` | A-05 | M (1 day) |
| `scripts/convert-articles.js` — parse archived HTML, generate Sanity Portable Text drafts | A-06 | M (1.5 days) |
| Enter EN content for Batch A in Sanity (after schemas land) | — | M (4–6 hr) |
| Enter ES content for Batch A (translator or AI draft + human review per Task #12) | — | M (4–6 hr) |
| Repeat for Batch B and C | — | L |

Run scripts before manual entry; review output before publish.

---

### Task #7 — Update `go-live-guide.md` for AWS Amplify ✅
No audit changes (already done in Session 12). Drift item D-07 (`amplify.yml` referenced but doesn't exist) is fixed by Task #8.

---

### Task #8 — Deploy to AWS Amplify with Sanity webhook ⏳

**Hard prerequisite:** Task #0a (`.env` untracked) must be done before any push.

**Audit changes:** scope expanded to include three 15-minute hardening items.

| Sub-task | Audit ref | Effort |
|---|---|---|
| Create `amplify.yml` at repo root with the Astro build spec from `go-live-guide.md` §6.2 | A-01, D-07 | S (1 hr) |
| Set Amplify Console env vars: `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET` | A-03 | S (10 min) |
| Configure Sanity → Amplify webhook (filter `_type in ["aiTrendsPage","post",...]`) | A-02 | S (30 min) |
| First deploy + verification per `go-live-guide.md` §6.5 | — | S (30 min) |
| Webhook debounce (15-min quiet period) — ~40% build minute reduction | A-08 | M (2 hr) |
| Amplify build-failure email/SNS notification | A-11 | S (15 min) |
| AWS Budget alarm at $20 / $50 thresholds | A-12 | S (15 min) |

---

### Task #9 — SEO basics ⏳ (split per audit)

**Audit changes:** the audit splits this into two phases. Most of the original Task #9 has migrated into Task #0 because it has to land before Task #5. What's left here is performance-and-polish work that can run after deploy.

| Sub-task | Audit ref | Effort | When |
|---|---|---|---|
| Verify all #0c/#0d work in production (canonical, hreflang, OG, sitemap, robots) | S-01–S-08 | S (1 hr) | After #8 |
| Replace hard-coded `https://aitokenglobal.com` in blog slug page with `Astro.site` | F-08 | S (10 min) | After #8 |
| Google Fonts: replace render-blocking `@import` with preconnect + `<link>` | S-13, Q-14 | S (15 min) | After #8 |
| Migrate `<img>` tags to Astro `<Image>` (WebP, srcset, CLS prevention; covers blog images flagged in Q-13) | S-17, Q-13 | L (1 day) | After #8 |
| Migrate Tailwind CDN to build-step Tailwind (production-appropriate; Q-15 is `defer`-only as a stopgap in #0f) | Q-15 | M (2 hr) | After #8 |
| Run Lighthouse mobile preset post-deploy; capture LCP/CLS/INP baseline; identify LCP element | QA §4 priority 1 | S (1 hr) | After #8 |
| `Article` JSON-LD on blog post pages | S-10 | M | Post-launch |
| `FAQPage` JSON-LD on AI Trends + guide pages with FAQ | S-11 | M | Post-launch |
| `Organization` JSON-LD on site-wide layout | S-12 | S | Post-launch |
| `BreadcrumbList` JSON-LD on deeper pages | S-15 | M | Post-launch |

---

### Task #10 — Scale to languages 3–15 ⏳

**Hard prerequisites:** Task #0e must be complete. Without it, the documented "one constant + Sanity content" guarantee is false and language 3 will silently break date formatting.

**Audit changes:** S-14 (per-page language switcher equivalence) lands here, not in Task #2 retroactively.

| Sub-task | Audit ref | Effort |
|---|---|---|
| Add language 3 (zh-TW, suggested) — one entry in `SUPPORTED_LANGS` + `LANG_META` | — | S (15 min once #0e done) |
| Per-page language-switcher equivalence — switch to current page's translation, not `/{lang}/` root | S-14 | M (3 hr) |
| Translate UI strings (`src/i18n/{lang}.json`) | — | M per language |
| Enter content per language (use Task #12 translation drafting) | — | L per language |
| Continue to languages 4–15 on cadence set by Task #12 capacity | — | L |

---

### Task #11 — Operations Safety Net 🆕 (audit-proposed)

**When:** within first 30 days post-launch.

| Sub-task | Audit ref | Effort |
|---|---|---|
| Weekly Sanity dataset export to S3 or GitHub Action artifact | A-13 | M (2 hr) |
| Pre-commit hook (Husky) blocking token-shaped values + `.env` | A-04 enhancement | S (1 hr) |
| Document `imageMeta.ts` extending `sanity.imageAsset` system type — risk note in `summary.md` schema notes | D-10 | S (15 min) |

Total: 4–6 hr.

---

### Task #12 — AI Ops Pipeline 🆕 (audit-proposed)

**When:** priorities 1 and 2 must land before language 3 (Task #10). Others can run post-launch on cadence.

| Priority | Sub-task | Audit ref | Effort |
|---|---|---|---|
| 1 | Claude-based translation drafting (EN → new language, human review) | A-09 strategic | M (1 day) |
| 2 | Vision-model alt-text generation on Sanity image upload | A-10 | M (1 day) |
| 3 | Claude-based `seoDescription` generation from page body (uses #0b field) | A-09 | M (1 day) |
| 4 | FAQ extraction from long-form articles → candidate `faqItem` blocks | — | M (1 day) |
| 5 | Content QA pass (hardcoded EN strings, missing translations, broken links) | — | M (1 day) |

Total: 5 days across all five.

---

## Sequenced Queue (the order to actually work)

Translating the tracker above into a working queue. Dependencies are real, not stylistic — do not skip ahead.

1. **Task #0a** — `.env` out of git. Today, before any other commit. *(5 min)*
2. **Task #0b–f** — pattern hardening (SEO schema, BaseLayout meta, sitemap+robots, EN/ES delocalization, **and Visual/Mobile/A11y centralization including the working mobile nav drawer + responsive breakpoint system**). *(1.5–2.5 days)*
3. **Task #5 Batch A** — port the four API model pages on the hardened pattern (now also mobile-ready). Stop and review one rendered page on a real phone before B. *(~1 day)*
4. **Task #6 scripts** — write `upload-images.js` and `convert-articles.js` while Batch A content gets entered. *(2–3 days, parallel-ish)*
5. **Task #8** — deploy to Amplify, set env vars, wire the Sanity webhook, add debounce + alerts + budget alarm. *(half day, gated by #0a)*
6. **Task #5 Batch B and C** — using the now-validated pattern and the bulk scripts. *(2–3 days)*
7. **Task #9 polish** — Astro `<Image>`, font preconnect, JSON-LD as content lands. *(1–2 days, post-deploy)*
8. **Task #11** — backups, pre-commit hook, schema risk doc. *(half day, post-launch first 30 days)*
9. **Task #12 priorities 1–2** — translation drafting + alt-text generation. *(2 days, before language 3)*
10. **Task #10** — add language 3, then 4–15 on cadence set by #12 capacity.
11. **Task #12 priorities 3–5** — meta description, FAQ extraction, QA. *(post-launch on cadence)*

---

## Diff vs. the Old Plan

The original "Next, in order" in `summary.md`:
1. Port remaining pages
2. Deploy to AWS Amplify
3. SEO basics
4. Scale to 10–15 languages

What's different now and why:

- **Step 0 (new):** A 1–2 day pre-flight before "port remaining pages." Without it the same SEO and i18n gaps get stamped into 11 page schemas instead of fixed once.
- **Steps 2 and 3 swap-ish:** SEO schema + BaseLayout meta moves *before* deploy (because it must be in place when content goes live so search engines see canonical/hreflang on day one). The performance/JSON-LD remainder of "SEO basics" stays after deploy.
- **Step 4 unchanged in position, but blocked** until Task #0e (delocalization) and Task #12 priority 1 (translation drafting) are done. Adding language 3 without those is a documented regression.
- **Two new tasks (#11, #12) appended** for operational hygiene and AI ops — both flagged by the audit as not fitting any existing task.

---

## Cross-references

- Audit findings → `audits/FINAL_PROJECT_AUDIT.md` (Sections 2, 5, 6, Appendix B)
- Specialist audits → `audits/technical-audit.md`, `audits/seo-audit.md`, `audits/automation-audit.md`, `audits/qa-mobile-audit.md`
- Deployment phases → `go-live-guide.md` (Task #8 maps to Phase 6)
- Project state, repo structure, batch plan → `summary.md`
- Prior audit synthesis (May 7) → `audits/FINAL_PROJECT_AUDIT_2026-05-07.md`

---

*This plan is the canonical task tracker as of 2026-05-08 (v2.1). Update this file (not `summary.md`'s "Next, in order" block) as tasks complete.*
