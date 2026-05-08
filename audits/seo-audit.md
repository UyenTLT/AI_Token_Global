# AI Token Global — SEO Audit
**Date:** 2026-05-08 | **Scope:** Indexability, multilingual structure, metadata, structured data, images, performance, migration
**Prior audit:** Archived at `FINAL_PROJECT_AUDIT_2026-05-07.md` — no commits since May 7; all findings persist unchanged.
**New this run:** Language-3 Readiness Gate table; expanded schema gap analysis with exact line references; concrete `BaseLayout.astro` implementation sketches.

---

## 1. Headline

- **Critical gap:** Zero hreflang tags exist anywhere — Google will treat EN and ES as duplicate content and suppress both from rankings on launch day.
- **No sitemap:** `@astrojs/sitemap` is not installed; crawlers have no map to discover `/en/*` or `/es/*` routes at any depth.
- **No `robots.txt`:** Without this file, bots operate with no guidance; Sitemap location is unannounced.
- **No SEO metadata fields in Sanity:** Neither `aiTrendsPage` nor `post` schemas have `seoTitle`, `seoDescription`, or `ogImage` — every page launches with blank/auto-generated metadata.
- **Multilingual scorecard: 2 of 16 checks passing** — only `<html lang>` attribute and "no accidental noindex" are correct; everything else fails for both EN and ES.

---

## 2. Findings Table

| ID | Severity | Category | Location | Issue | Impact | Fix Effort |
|----|----------|----------|----------|-------|--------|------------|
| S-01 | **Blocker** | Indexability | `public/robots.txt` (missing) | File does not exist | Bots have no guidance; sitemap undiscoverable | S |
| S-02 | **Blocker** | Multilingual | `src/layouts/BaseLayout.astro` | No `<link rel="alternate" hreflang>` tags of any kind | EN and ES treated as duplicate content; both suppressed | M |
| S-03 | **Blocker** | Multilingual | `src/layouts/BaseLayout.astro` | No `hreflang="x-default"` | Google cannot determine canonical language for non-targeted visitors | S (add with hreflang loop) |
| S-04 | **Blocker** | Sitemap | `astro.config.mjs` | `@astrojs/sitemap` not installed; no `site` property set | Zero sitemap; crawl budget wasted; new pages undiscoverable | M |
| S-05 | **Blocker** | Multilingual | Sitemap (not generated) | Sitemap missing `<xhtml:link rel="alternate" hreflang>` clusters | International ranking signals absent | M (depends on S-04) |
| S-06 | **Blocker** | Indexability | `src/layouts/BaseLayout.astro` | No `<link rel="canonical">` | Potential self-canonicalization drift across languages | M |
| S-07 | **Blocker** | Metadata | `src/layouts/BaseLayout.astro` | No Open Graph tags (`og:title`, `og:description`, `og:image`, `og:locale`) | Zero social preview quality; click-through rate suppressed | M |
| S-08 | **Blocker** | Metadata | `src/layouts/BaseLayout.astro` | No Twitter Card tags | Social sharing broken on X/Twitter | S (add alongside OG) |
| S-09 | **High** | Metadata | `studio/schemas/aiTrendsPage.ts`, `studio/schemas/post.ts` | No `seoTitle`, `seoDescription`, or `ogImage` fields in either schema | Editors cannot set page titles or descriptions; all pages launch with blank metadata | L |
| S-10 | **High** | Structured Data | `src/pages/[lang]/blog/[slug].astro` | No `Article` JSON-LD | E-E-A-T signals absent; rich results ineligible | M |
| S-11 | **High** | Structured Data | Pages rendering FAQ items | No `FAQPage` JSON-LD | FAQ accordion SERP feature unavailable | M |
| S-12 | **High** | Structured Data | `src/pages/[lang]/index.astro` | No `Organization` JSON-LD on homepage | Brand knowledge panel signals absent | S |
| S-13 | **High** | Performance | `src/styles/global.css` | Google Fonts loaded via CSS `@import` (render-blocking) | Delays FCP and LCP; fails Core Web Vitals on slow connections | S |
| S-14 | **High** | Schema Design | `studio/schemas/post.ts` lines 58–63; `studio/schemas/aiTrendsPage.ts` lines 22–24 | Language field uses hard-coded `['en', 'es']` options list | Adding language 3 requires schema change + re-deploy; silently blocks new languages | S |
| S-15 | **Medium** | Multilingual | `src/components/Nav.astro` | Language switcher routes to homepage (`/${lang}/`) not equivalent page | Users lose their place; Googlebot cannot verify hreflang cross-language equivalence | M |
| S-16 | **Medium** | Structured Data | Inner pages with visual breadcrumbs | No `BreadcrumbList` JSON-LD despite visual breadcrumbs present | Rich result eligibility missed | M |
| S-17 | **Medium** | Images | `studio/schemas/post.ts` `coverImage` field | `alt` text not required via validation | Images indexed without alt text; image search ranking suppressed | S |
| S-18 | **Medium** | Images | Blog post templates | Raw `<img>` tags instead of Astro `<Image>` component | No `srcset`, no lazy loading, no CLS prevention, no format optimization | M per template |
| S-19 | **Medium** | Indexability | `src/pages/[lang]/index.astro` | Coming Soon homepage will be indexed with thin content | Thin-content penalty risk; wastes crawl budget | S (add `noindex` temporarily) |
| S-20 | **Low** | Metadata | `src/i18n/index.ts` `LANG_META` | Missing `locale` (BCP 47) and `hreflangCode` fields | OG locale and hreflang codes will be hand-coded per callsite as languages scale | S |
| S-21 | **Low** | Metadata | `src/pages/[lang]/blog/[slug].astro` line 51 | Domain hard-coded in `postUrl` construction (`'https://aitokenglobal.com'`) | Breaks on Amplify preview URLs; should use `Astro.site` | S |
| S-22 | **Low** | Indexability | `public/` | No `apple-touch-icon` or web manifest | Minor PWA/bookmark experience degradation | S |

---

## 3. Schema Gaps

Fields that must be added to Sanity schemas **before content scaling to additional languages**.

### Define once — reuse across all page schemas
```typescript
// studio/schemas/seoFields.ts (new file)
export const seoFieldsSchema = {
  name: 'seoFields',
  title: 'SEO Fields',
  type: 'object',
  fields: [
    {
      name: 'seoTitle',
      title: 'SEO Title (~60 chars)',
      type: 'string',
      validation: (Rule: any) => Rule.max(70).warning('Aim for under 60 characters'),
    },
    {
      name: 'seoDescription',
      title: 'SEO Description (~155 chars)',
      type: 'text',
      rows: 3,
      validation: (Rule: any) => Rule.max(165).warning('Aim for under 155 characters'),
    },
    {
      name: 'ogImage',
      title: 'Social Share Image (1200×630px)',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
      ],
    },
  ],
};
```

### `studio/schemas/aiTrendsPage.ts`
```typescript
// Add seoFields object reference:
{ name: 'seo', title: 'SEO', type: 'seoFields' },

// Fix language hard-coding at lines 22–24:
// BEFORE: options: { list: ['en', 'es'] }
// AFTER: remove options entirely — language is set programmatically, not user-chosen
```

### `studio/schemas/post.ts`
```typescript
// Add seoFields reference:
{ name: 'seo', title: 'SEO', type: 'seoFields' },

// Add for Article JSON-LD E-E-A-T:
{ name: 'author', title: 'Author', type: 'string', validation: (Rule) => Rule.required() },
{ name: 'publishedAt', title: 'Published At', type: 'datetime', validation: (Rule) => Rule.required() },
{ name: 'updatedAt', title: 'Last Updated', type: 'datetime' },

// Fix coverImage alt — add validation at lines 46–52:
// coverImage.fields.alt: validation: (Rule) => Rule.required()

// Fix language hard-coding at lines 58–63 — same fix as aiTrendsPage
```

### All future page schemas (Task #5 prerequisite)
Every new schema created under Task #5 must include the `seoFields` object type at creation time. Retrofitting 11 schemas post-hoc costs 11× the effort.

---

## 4. Multilingual Readiness Scorecard

| Check | EN | ES | Notes |
|-------|----|----|-------|
| `<html lang>` attribute | ✅ Pass | ✅ Pass | Set in `BaseLayout.astro` — the only structural SEO working |
| `<link rel="canonical">` | ❌ Fail | ❌ Fail | Not implemented |
| `<link rel="alternate" hreflang>` | ❌ Fail | ❌ Fail | Not implemented |
| `hreflang="x-default"` | ❌ Fail | ❌ Fail | Not implemented |
| Sitemap with hreflang clusters | ❌ Fail | ❌ Fail | Sitemap not generated |
| `seoTitle` field in Sanity schema | ❌ Fail | ❌ Fail | Field missing from all schemas |
| `seoDescription` field in Sanity schema | ❌ Fail | ❌ Fail | Field missing from all schemas |
| `ogImage` field in Sanity schema | ❌ Fail | ❌ Fail | Field missing from all schemas |
| Open Graph tags in `<head>` | ❌ Fail | ❌ Fail | Not in `BaseLayout.astro` |
| Twitter Card tags in `<head>` | ❌ Fail | ❌ Fail | Not in `BaseLayout.astro` |
| Article JSON-LD on blog posts | ❌ Fail | ❌ Fail | Not implemented |
| FAQPage JSON-LD on FAQ-heavy pages | ❌ Fail | ❌ Fail | Not implemented |
| Organization JSON-LD on homepage | ❌ Fail | ❌ Fail | Not implemented |
| Language switcher → equivalent page | ❌ Fail | ❌ Fail | Routes to homepage only |
| `robots.txt` present | ❌ Fail | ❌ Fail | File missing |
| Google Fonts non-blocking | ❌ Fail | ❌ Fail | Uses render-blocking CSS `@import` |
| No accidental `noindex` | ✅ Pass | ✅ Pass | Safe (but Coming Soon thin content is a risk) |

**Overall: 2 of 17 passing**

### Language-3 Readiness Gate
Before adding any language beyond EN/ES, ALL of the following must be true:

| Gate item | File to change | Status |
|-----------|---------------|--------|
| `SUPPORTED_LANGS` updated | `src/i18n/index.ts` | ✅ Ready (dynamic) |
| `LANG_META` entry added with `locale` + `hreflangCode` | `src/i18n/index.ts` | ❌ Fields don't exist yet |
| Language NOT in hard-coded schema options | `studio/schemas/post.ts` L58–63; `studio/schemas/aiTrendsPage.ts` L22–24 | ❌ Still hard-coded |
| Hreflang loop in `BaseLayout.astro` iterates `SUPPORTED_LANGS` | `src/layouts/BaseLayout.astro` | ❌ Not implemented |
| Sitemap configured with `site` URL | `astro.config.mjs` | ❌ Not configured |
| Sanity content document exists for new language | Sanity Studio | ❌ Must be created per page |

---

## 5. Pre-Launch Must-Fix (ordered by dependency)

1. **Create `public/robots.txt`** (S)
   ```
   User-agent: *
   Allow: /
   Sitemap: https://aitokenglobal.com/sitemap-index.xml
   ```

2. **Install `@astrojs/sitemap` + set `site` in `astro.config.mjs`** (M) — unblocks S-04, S-05
   ```js
   import sitemap from '@astrojs/sitemap';
   export default defineConfig({
     site: 'https://aitokenglobal.com',
     integrations: [sitemap()],
   });
   ```

3. **Add `hreflang` + canonical to `BaseLayout.astro`** (M) — resolves S-02, S-03, S-06
   - Thread `currentPath` prop through all page templates
   - Build canonical as `` `${Astro.site}${lang}/${currentPath}` ``
   - Loop `SUPPORTED_LANGS` for `<link rel="alternate">` + add `x-default` pointing to `/en/`
   - Add `locale` and `hreflangCode` to `LANG_META` first (S-20) to avoid per-callsite hardcoding

4. **Add OG + Twitter Card tags to `BaseLayout.astro`** (S, alongside #3) — resolves S-07, S-08

5. **Create `studio/schemas/seoFields.ts`; add to all existing schemas; register in `sanity.config.ts`** (L) — resolves S-09

6. **Add `noindex` to Coming Soon homepage** (S) — resolves S-19
   ```astro
   <meta name="robots" content="noindex, follow" />
   ```

7. **Fix Google Fonts loading** (S) — resolves S-13
   - Remove `@import url('https://fonts.googleapis.com/...')` from `src/styles/global.css`
   - Add to `BaseLayout.astro` `<head>`:
     ```html
     <link rel="preconnect" href="https://fonts.googleapis.com">
     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
     <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap">
     ```

8. **Add `locale` + `hreflangCode` to `LANG_META` in `src/i18n/index.ts`** (S) — resolves S-20

---

## 6. Post-Launch Optimization (first 30 days)

| Priority | Item | Effort | Expected Impact |
|----------|------|--------|----------------|
| 1 | Article JSON-LD on all blog posts | M | Rich results eligibility; E-E-A-T signals |
| 2 | FAQPage JSON-LD on FAQ-heavy pages | M | FAQ accordion SERP feature |
| 3 | Organization JSON-LD on homepage | S | Brand knowledge panel |
| 4 | Fix language switcher to route to equivalent page, not homepage | M | Improves hreflang compliance; reduces bounce rate |
| 5 | Replace raw `<img>` with Astro `<Image>` component in blog templates | M | CLS fix; `srcset` for mobile bandwidth savings |
| 6 | BreadcrumbList JSON-LD on inner pages | M | Rich results eligibility |
| 7 | Run Lighthouse mobile audit on production and address score gaps | L | Core Web Vitals baseline; ranking factor |
| 8 | Validate sitemap hreflang clusters in Google Search Console | S | Catch hreflang implementation errors |
| 9 | Submit sitemap to Google Search Console and Bing Webmaster Tools | S | Accelerates indexing of all language variants |
