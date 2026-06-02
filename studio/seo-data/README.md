# SEO data snapshots

The SEO dashboard reads its data from dated JSON snapshot files in this directory.
Each section (Overview, Top Queries, …) reads one snapshot. Files are imported at
build time by [`../components/SeoDashboard/lib/loadSnapshot.ts`](../components/SeoDashboard/lib/loadSnapshot.ts)
and rendered by the matching section component.

There is **no mock data**. If a section has no snapshot yet, the dashboard renders
an **empty-state** ("No data for this period yet"). Real snapshots are produced by
the fetch scripts and committed here.

## Folder layout

```
seo-data/
  gsc/          ← Google Search Console snapshots (dated)
    overview-YYYY-MM-DD.json
    queries-YYYY-MM-DD.json
    pages-YYYY-MM-DD.json
    striking-YYYY-MM-DD.json
    locale-YYYY-MM-DD.json
    ctr-outliers-YYYY-MM-DD.json
  ga4/          ← Google Analytics 4 snapshots (dated, ga4- prefix)
    ga4-overview-YYYY-MM-DD.json
    ga4-channels-YYYY-MM-DD.json
    ga4-pages-YYYY-MM-DD.json
    ga4-events-YYYY-MM-DD.json
    ga4-locale-YYYY-MM-DD.json
  cloudflare/   ← Cloudflare Web Analytics snapshots (dated, cloudflare- prefix)
    cloudflare-overview-YYYY-MM-DD.json
    cloudflare-pages-YYYY-MM-DD.json
    cloudflare-referrers-YYYY-MM-DD.json
    cloudflare-countries-YYYY-MM-DD.json
```

## How the loader picks a file (per section)

1. Glob `<source>/<file>-*.json`. If any files exist, pick the **most recent by
   filename date** (filenames sort lexicographically because dates are `YYYY-MM-DD`).
2. If none exist, return an **empty snapshot** (zeroed buckets / empty rows) — the
   section renders its empty-state. **No mock fallback.**

So swapping in real data is just dropping a new dated file into the source folder —
no component changes. Old files don't need deleting; the loader always picks the newest.

## Producing the data — fetch scripts

Real snapshots are written by [`../scripts/`](../scripts/):

| Script | Source | Auth |
|---|---|---|
| `fetch-gsc.mjs` | Search Console API | OAuth (property Owner) |
| `fetch-ga4.mjs` | GA4 Data API | service account |
| `fetch-cloudflare.mjs` | Cloudflare GraphQL Analytics | API token |

Credentials live in `studio/.env` + `studio/secrets/` (both gitignored — see
`studio/.env.example`). Run a script from `studio/` (`node scripts/fetch-ga4.mjs`),
then commit the new JSON. To refresh, re-run and commit. (A GitHub Actions cron can
automate this later — same scripts, creds as CI secrets.)

The exact JSON shape each script must produce is the contract in
[`FETCH_CONTRACT.md`](./FETCH_CONTRACT.md).

## Snapshot `meta`

Every snapshot has a `meta` object that flows into rendering:

| Field | Effect |
|---|---|
| `siteUrl` | Shown in the dashboard intro |
| `snapshotDate` | Informational (data freshness) |
| `rangeDays` | Drives every "Last N days" label + the period-over-period framing |
| `dataSource` | `gsc` / `ga4` / `cloudflare` |
| `mockNote` | Optional; ignored by the UI |

## Schema

JSON must match the TypeScript interfaces in
[`../components/SeoDashboard/lib/types.ts`](../components/SeoDashboard/lib/types.ts)
(and the shapes in `FETCH_CONTRACT.md`). Mismatches surface at build time.

## Adding a new section / data source

1. Add the snapshot interface to `lib/types.ts`.
2. Add a loader in `lib/loadSnapshot.ts` following the existing pattern: glob the
   source folder, return `newest(...) ?? <empty snapshot>`.
3. Build the section component, reusing `SectionHeader`, `SortableTable` +
   `useSortableData`, `LocaleFilter`, the charts (`HBarChart`, `ShareDonut`), and
   `EmptyState`.
4. Wire it into `index.tsx` (and, optionally, `lib/exportReport.ts`).
5. Teach the relevant fetch script to write the new dated file. The loader picks it
   up on the next build — no further code changes.
