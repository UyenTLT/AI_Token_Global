# AI Token Global — Technical Audit
**Date:** 2026-05-08 | **Scope:** Routing, Sanity schemas, i18n, Sanity-first compliance, build config, docs-vs-reality drift
**Prior audit:** Archived at `FINAL_PROJECT_AUDIT_2026-05-07.md` — no commits since May 7; all findings persist unchanged.
**Build note:** Static analysis + `dist/` output inspection; build was previously confirmed clean.

---

## Headline

- **Core architecture is sound and correctly implemented.** `[lang]` routing via `getStaticPaths()` over `SUPPORTED_LANGS`, Sanity-first content, reusable `faqItem`, Portable Text body fields, and dynamic language switching all work as designed. No build-breaking issues found.
- **`.env` is committed to git** — it contains the live Sanity project ID and dataset name. The file's own header warns against this. This is the single highest-priority fix.
- **Seven hardcoded English strings remain in `.astro` files** across three pages, causing Spanish users to see English UI labels today. These violate the locked-in Sanity-first / i18n-first architecture.
- **The `locale` ternary in both blog pages** (`lang === 'es' ? 'es-ES' : 'en-US'`) is a hidden EN/ES hardcoding that will silently break date formatting when language 3 is added — the exact regression `summary.md` Session 11 warned against.
- **Zero SEO infrastructure exists** (no `site:` in `astro.config.mjs`, no sitemap, no `robots.txt`, no Open Graph tags, no canonical/hreflang) — expected per plan (Phase 8), but no pre-flight Task #0 items have been started.

---

## Findings

### F-01 — `.env` committed to git with live Sanity credentials
**Severity: Blocker**
**Location:** `/.env` lines 4–5

The file is listed in `.gitignore` under `# environment variables`, yet it is actively tracked by git. Contents:
```
PUBLIC_SANITY_PROJECT_ID="mq3wxr8n"
PUBLIC_SANITY_DATASET="production"
```
The file's own header reads: *"Warning: Do not add secrets to this file, as it source controlled!"* While `PUBLIC_*` values are not write-capable Sanity API keys, the project ID in git history exposes the free-tier account to API quota exhaustion and sets a dangerous precedent for when actual secret tokens are added.

**Evidence:** `git ls-files .env` returns the file path.

**Recommended fix:**
```bash
git rm --cached .env
git commit -m "chore: stop tracking .env"
```
Use `.env.local` (already gitignored by Astro defaults) for local dev. Set `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET` as Amplify environment variables per Phase 6.2.

---

### F-02 — Hardcoded English copy in `[lang]/index.astro`
**Severity: High**
**Location:** `src/pages/[lang]/index.astro` lines 19, 23

`"Coming Soon"` and `"The Astro-powered site is being set up. In the meantime, check out the blog."` — Spanish users at `/es/` see English text today.

**Evidence:**
```astro
<h1 class="text-4xl font-bold text-white mb-4">Coming Soon</h1>
<p class="text-white/80 text-lg mb-8">The Astro-powered site is being set up...</p>
```

**Recommended fix:** Add `homepage.comingSoon` and `homepage.placeholder` to both `en.json` and `es.json`. Replace literals with `t('homepage.comingSoon')` and `t('homepage.placeholder')`.

---

### F-03 — Hardcoded English strings in `ai-trends.astro`
**Severity: High**
**Location:** `src/pages/[lang]/ai-trends.astro`

| Line | String | Issue |
|------|--------|-------|
| ~81 | `Home` | Breadcrumb label — English on `/es/ai-trends` |
| ~91 | `Trend Watch` | Section pill — English on `/es/ai-trends` |
| ~251 | `2031 Data, Analytics & AI Top 10 Predictions` | Download CTA title — language-unaware |
| ~252 | `Gartner Report · PDF` | Download CTA metadata — language-unaware |

**Recommended fix:** Add `common.home` and `aiTrends.trendWatchLabel` to both JSON files. Add `sourcesDownloadTitle`, `sourcesDownloadMeta`, `sourcesDownloadUrl` fields to `aiTrendsPage` Sanity schema; conditionally render the CTA only when `sourcesDownloadUrl` is non-empty.

---

### F-04 — Hardcoded English strings in `blog/[slug].astro`
**Severity: Medium**
**Location:** `src/pages/[lang]/blog/[slug].astro` lines ~74, ~116, ~122–123

`"Home"` (breadcrumb), `"X / Twitter"`, `"Copy link"`, `"Copied!"` (clipboard JS string inside `onclick`). All appear in English on Spanish blog post pages.

**Recommended fix:** Add `blog.shareTwitter`, `blog.shareCopyLink`, `blog.shareCopied`, `common.home` to both JSON files. Extract clipboard feedback string from the `onclick` attribute into a `<script>` block using a `data-*` attribute to pass the translated string.

---

### F-05 — `locale` ternary is a hardcoded EN/ES assumption
**Severity: Medium**
**Location:** `src/pages/[lang]/blog/index.astro` line ~19; `src/pages/[lang]/blog/[slug].astro` line ~25

```ts
const locale = lang === 'es' ? 'es-ES' : 'en-US';
```

When language 3 is added to `SUPPORTED_LANGS`, this silently defaults to `en-US`. Identical copies exist in both blog files. This is the exact regression `summary.md` Session 11 warned against and believed eliminated.

**Recommended fix:** Add `locale` field to `LANG_META` in `src/i18n/index.ts`. Replace both ternaries with:
```ts
const locale = LANG_META[lang as Lang].locale;
```

---

### F-06 — `coverImage` has no `alt` field; inline image alt has no required validation
**Severity: Medium**
**Location:** `studio/schemas/post.ts` lines ~46–52 (coverImage), ~107–110 (inline image block)

`coverImage` has no `alt` sub-field at all. The inline image block's `alt` field exists but has no `validation: Rule => Rule.required()`. Editors can publish inaccessible images with no warning.

**Recommended fix:**
```ts
// coverImage field — add fields array:
fields: [{ name: 'alt', title: 'Alt text', type: 'string', validation: Rule => Rule.required() }]
// Inline image block alt — add validation:
validation: Rule => Rule.required()
```

---

### F-07 — `ai-trends.astro` renders blank page silently when Sanity returns `null`
**Severity: Medium**
**Location:** `src/pages/[lang]/ai-trends.astro` line ~17

No null guard after `const page = await getAiTrendsPage(lang)`. On missing env vars or missing Sanity document, the page builds successfully but ships completely blank HTML.

**Evidence:** The blog `[slug].astro` already implements the equivalent guard at line ~22 (`if (!post) return Astro.redirect(...)`).

**Recommended fix:** Add immediately after the `getAiTrendsPage` call:
```ts
if (!page) return Astro.redirect(`/${lang}/`);
```

---

### F-08 — `astro.config.mjs` missing `site:` URL
**Severity: Medium**
**Location:** `/astro.config.mjs` (entire file — 7 lines)

Without `site:`, `Astro.site` is `undefined`, which blocks `@astrojs/sitemap` (Phase 8). The blog post page hardcodes `'https://aitokenglobal.com'` at `[slug].astro` line ~51 as a workaround — incorrect on Amplify preview URLs.

**Recommended fix:**
```js
export default defineConfig({
  site: 'https://aitokenglobal.com',
  integrations: [...],
});
```
Replace the hardcoded domain in `[slug].astro` with `new URL(Astro.url.pathname, Astro.site).href`.

---

### F-09 — `studio/package.json` pins Sanity to `"*"` (unbounded version)
**Severity: Medium**
**Location:** `studio/package.json` lines 8, 10

```json
"@sanity/vision": "*",
"sanity": "*"
```

Unbounded `*` means `npm install` can pull a breaking major version silently. Different team members may end up running different Sanity versions.

**Recommended fix:** Pin to specific semver ranges (e.g., `"sanity": "^3.88.0"`). Commit `studio/package-lock.json` to git.

---

### F-10 — Sources download CTA links to `href="#"`
**Severity: Low**
**Location:** `src/pages/[lang]/ai-trends.astro` line ~246

The download button is live on all pages but links nowhere. Title is also hardcoded English (see F-03).

**Recommended fix:** Add `sourcesDownloadUrl` to `aiTrendsPage` schema. Conditionally render CTA only when field is non-empty.

---

### F-11 — Privacy and Terms links are dead placeholders
**Severity: Low**
**Location:** `src/components/Footer.astro` lines ~61–62

Both legal links use `href="#"` and are live on every page.

**Recommended fix:** Create stub pages at `src/pages/[lang]/privacy.astro` and `src/pages/[lang]/terms.astro`, or remove links until pages exist.

---

### F-12 — Copyright year is stale; brand name inconsistent in footer
**Severity: Low**
**Location:** `src/i18n/en.json` line ~31; `src/i18n/es.json` line ~31

`"© 2025 AI Token King. All rights reserved."` — year is 2026, brand name is "AI Token King" (should be "AI Token Global" for the international site).

**Recommended fix:** Update both JSON files. Consider dynamic year via `new Date().getFullYear()` in `Footer.astro` to avoid future drift.

---

### F-13 — Default `description` prop in `BaseLayout.astro` is English-only
**Severity: Low**
**Location:** `src/layouts/BaseLayout.astro` line ~17

The default description falls back to an English sentence on all language pages that don't pass an explicit description prop.

**Recommended fix:** Add `common.siteDescription` to both JSON files and use `t('common.siteDescription')` for the default.

---

### F-14 — `imageMeta.ts` extends system document type `sanity.imageAsset`
**Severity: Low**
**Location:** `studio/schemas/imageMeta.ts` lines 1–14

Registering `sanity.imageAsset` as a custom document type is non-standard and conflicts with `sanity-plugin-media`'s own schema definitions. May break on a Sanity major upgrade. Not documented as a known risk anywhere.

**Recommended fix:** Evaluate whether `articleNumber` metadata on assets is still needed. If not, remove `imageMetaSchema` from `studio/sanity.config.ts` types array and delete the file. If needed, use `sanity-plugin-media`'s extension API instead.

---

### F-15 — `/es/blog` produces no posts; EN slug contains a typo
**Severity: Low** (known gap — documented)
**Location:** `dist/es/blog/` (build output); `dist/en/blog/how-are-ai-tokens-calcualted/`

`/es/blog` renders empty (no Spanish posts in Sanity). The EN slug `how-are-ai-tokens-calcualted` contains "calcualted" instead of "calculated" — this slug is live and would require a redirect if corrected.

**Recommended fix:** Enter Spanish blog posts in Sanity. If correcting the slug, create a redirect rule in Amplify custom headers or `amplify.yml` from the old slug to the new one before changing.

---

## Drift Items

| # | Document | Claim | Reality |
|---|---|---|---|
| D-01 | `summary.md` line ~10 | "Adding a language requires one constant + Sanity content" | Partially false — `locale` ternary in two blog pages (F-05) also requires a code change |
| D-02 | `summary.md` | "Blog routes working: `/en/blog`, `/es/blog`" | `/es/blog` route works but renders empty — no Spanish posts in Sanity; not flagged in status table |
| D-03 | `summary.md` | "AI Trends — content-complete" | Three hardcoded English strings appear on `/es/ai-trends` today (F-03) |
| D-04 | `go-live-guide.md` Phase 6.2 | Build spec: `npm ci && npm run build`, output `dist` | Matches `package.json` exactly ✅ |
| D-05 | `summary.md` Pre-flight Task #0 | Pre-flight items listed as "Next" | No evidence any pre-flight item has been completed — all remain open |
| D-06 | Neither doc | (not mentioned) | `studio/package.json` uses `"*"` for Sanity core — undocumented risk (F-09) |
| D-07 | Neither doc | (not mentioned) | `imageMeta.ts` extends `sanity.imageAsset` — non-standard, undocumented risk (F-14) |
| D-08 | `summary.md` Task #7 | "Update go-live-guide.md for AWS Amplify — Done" | Confirmed ✅ |
| D-09 | `summary.md` | "Nav language switcher is fully dynamic" | Confirmed — `otherLangs` computed from `SUPPORTED_LANGS`; no hardcoded EN/ES ternary in Nav or Footer ✅ |

---

## What's Working Well

- **`SUPPORTED_LANGS`-driven routing is correctly implemented end-to-end.** All four `[lang]/` page files use `getStaticPaths()` mapping over the constant. `isValidLang()` guards params. The language switcher computes `otherLangs` dynamically — no hardcoded EN/ES ternary in Nav or Footer.

- **Sanity schema quality is high and the POC pattern is reusable.** Both `post.ts` and `aiTrendsPage.ts` include `language` with `validation: Rule.required()`. All body fields use Portable Text arrays. `faqItem` is correctly reused as `{ type: 'faqItem' }`. `accentColor` uses `options.list` with named labels. All four schemas registered in `studio/sanity.config.ts`.

- **`src/lib/sanity.ts` env-var handling is graceful.** `getClient()` returns `null` when `PUBLIC_SANITY_PROJECT_ID` is absent; all fetch helpers return `[]` or `null`. The build does not crash on a misconfigured environment.

- **i18n dictionaries are in full parity.** `SUPPORTED_LANGS` and `LANG_META` have identical keys. Both `en.json` and `es.json` have matching top-level namespaces. `useTranslations()` falls back gracefully to the key string.

- **Build output confirms all declared routes are generated.** `dist/` contains routes for `/`, `/en/`, `/es/`, `/en/ai-trends/`, `/es/ai-trends/`, `/en/blog/`, `/es/blog/`, and all EN blog slug pages. No orphan pages outside `[lang]/` other than the intentional root redirect.

---

## Priority Action Plan

**Three fixes should precede all other work:**

1. **F-01 (Blocker):** `git rm --cached .env && git commit` — one command, stops tracking the env file.
2. **F-05 (Medium, language-3 blocker):** Add `locale` to `LANG_META`; replace two ternaries — 10-line change that future-proofs the blog section before Task #5 replicates the pattern to 11 more pages.
3. **F-08 (Medium, Phase 8 blocker):** Add `site: 'https://aitokenglobal.com'` to `astro.config.mjs` — required for sitemap, canonical tags, and correct social share URLs.

**All remaining items** (F-02 through F-04, F-06, F-07, F-09 through F-15) should be bundled into the pre-flight Task #0 sprint before Task #5 page porting begins.
