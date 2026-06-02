# SEO dashboard — data fetch contract

This is the contract for whoever writes the data-fetch scripts (GSC / GA4 /
Cloudflare). The Sanity Studio "SEO Insights" dashboard does **not** call any
API directly. It reads JSON files from disk. Your job: produce JSON in the
shapes below, in the right folders, and the dashboard shows it automatically.

## How it works (and why auth doesn't matter to this side)

```
your fetch script  ──►  JSON files in studio/seo-data/{gsc,ga4,cloudflare}/  ──►  loader  ──►  dashboard
```

- **The dashboard is auth-agnostic.** OAuth, service account, manual export —
  doesn't matter. We only consume the **output JSON**. Authenticate however works.
- **Loader rule (per section):** it globs `…/<source>/<file>-*.json` and picks the
  **most recent by filename** (dates are `YYYY-MM-DD`, so they sort
  lexicographically). If a section has no file yet, the dashboard shows an
  empty-state — **there is no mock fallback**.
- **To go live:** drop a correctly-named, correctly-shaped JSON into the source
  folder and commit. No code changes. To refresh: write a new dated file.

Branch: `levii/seo-dashboard`. Match the shapes in this doc exactly — there are no
mock files to copy from; until a real file lands, the section renders an empty-state.

## The `meta` object — required on EVERY file

```jsonc
"meta": {
  "siteUrl": "aitoken.global",
  "snapshotDate": "2026-06-01",   // YYYY-MM-DD
  "rangeDays": 30,                 // window length; drives all "Last N days" labels
  "dataSource": "gsc",            // "gsc" | "ga4" | "cloudflare" for real data (NOT "mock")
  "mockNote": "..."               // optional, ignored by the UI
}
```

Set `dataSource` to the real source so the "Mock data" badge clears.

## Conventions (read these — they prevent the common mistakes)

- **Rates are fractions in [0, 1].** `ctr` / `engagementRate` → `0.0293` means 2.93%. NOT `2.93`.
- **`position`**: average rank, lower is better (1 = top).
- **`avgEngagementSeconds`**: seconds. **`medianLoadMs`**: milliseconds.
- **`page`**: site-relative path **including the locale segment**, hostname stripped — e.g. `/en/token-calculator`.
- **`locale`**: exactly one of `"en" | "es" | "id"` (must match the dashboard's locale list).
- **Filenames** — note GSC has NO source prefix; GA4 + Cloudflare DO:

| Source | Folder | Filenames |
|---|---|---|
| GSC | `studio/seo-data/gsc/` | `overview-<date>.json`, `queries-<date>.json`, `pages-<date>.json`, `striking-<date>.json`, `locale-<date>.json`, `ctr-outliers-<date>.json` |
| GA4 | `studio/seo-data/ga4/` | `ga4-overview-<date>.json`, `ga4-channels-<date>.json`, `ga4-pages-<date>.json`, `ga4-events-<date>.json`, `ga4-locale-<date>.json` |
| Cloudflare | `studio/seo-data/cloudflare/` | `cloudflare-overview-<date>.json`, `cloudflare-pages-<date>.json`, `cloudflare-referrers-<date>.json`, `cloudflare-countries-<date>.json` |

---

## GSC shapes (Google Search Console)

```ts
// overview-<date>.json
{ meta, current: Bucket, previous: Bucket }
//   Bucket = { clicks: number, impressions: number, ctr: number, avgPosition: number }

// queries-<date>.json
{ meta, rows: Array<{ query, locale, clicks, impressions, ctr, position }> }

// pages-<date>.json
{ meta, rows: Array<{ page, locale, clicks, impressions, ctr, position }> }

// striking-<date>.json   (same row shape as queries; pick queries at position ~8-20)
{ meta, criteria?: string, rows: Array<{ query, locale, clicks, impressions, ctr, position }> }

// locale-<date>.json
{ meta, locales: Array<{
    locale, label,                         // label e.g. "English"
    current: Bucket, previous: Bucket,     // same Bucket as overview
    topQuery: string, topPage: string
}> }

// ctr-outliers-<date>.json   (same row shape as pages; pick pages with below-curve CTR)
{ meta, criteria?: string, rows: Array<{ page, locale, clicks, impressions, ctr, position }> }
```

## GA4 shapes (Google Analytics 4 — Data API)

```ts
// ga4-overview-<date>.json
{ meta, current: G4, previous: G4 }
//   G4 = { users: number, engagedSessions: number, engagementRate: number, avgEngagementSeconds: number }

// ga4-channels-<date>.json   (default channel grouping)
{ meta, rows: Array<{ channel, users, sessions, engagementRate, avgEngagementSeconds }> }

// ga4-pages-<date>.json
{ meta, rows: Array<{ page, locale, views, users, avgEngagementSeconds }> }

// ga4-events-<date>.json     (custom = our site events; auto = enhanced-measurement)
{ meta, rows: Array<{ event, count, users, custom: boolean }> }

// ga4-locale-<date>.json
{ meta, locales: Array<{
    locale, label,
    current: G4, previous: G4,             // same G4 as overview
    topPage: string, topChannel: string
}> }
```

## Cloudflare shapes (Web Analytics — GraphQL Analytics API)

```ts
// cloudflare-overview-<date>.json
{ meta, current: CF, previous: CF }
//   CF = { visits: number, pageViews: number, medianLoadMs: number }

// cloudflare-pages-<date>.json
{ meta, rows: Array<{ page, locale, visits, pageViews }> }

// cloudflare-referrers-<date>.json
{ meta, rows: Array<{ referrer, visits }> }

// cloudflare-countries-<date>.json
{ meta, rows: Array<{ country, visits }> }
```

---

## Concrete example (GA4 overview)

```json
{
  "meta": { "siteUrl": "aitoken.global", "snapshotDate": "2026-06-01", "rangeDays": 30, "dataSource": "ga4" },
  "current":  { "users": 18420, "engagedSessions": 14980, "engagementRate": 0.612, "avgEngagementSeconds": 74 },
  "previous": { "users": 16310, "engagedSessions": 12740, "engagementRate": 0.587, "avgEngagementSeconds": 68 }
}
```

## Status on the dashboard side (so you know what's done)

- Dashboard, loaders, mock data, and all 15 sections + charts are **built and on
  the branch**. Everything runs on mock data today.
- The **only** missing piece is the fetch scripts that produce the real JSON.
  Match the shapes above and the dashboard flips mock → real with zero code changes.
- Public-site collection is installed: GA4 `gtag` (`G-2KG5EVJQ22`) + Cloudflare
  beacon (`PUBLIC_CLOUDFLARE_BEACON_TOKEN`), both in `src/layouts/BaseLayout.astro`.
