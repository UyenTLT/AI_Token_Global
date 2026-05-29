# SEO data snapshots

The SEO dashboard reads its data from JSON snapshot files in this directory.
Each "section" of the dashboard (Overview, Top Queries, Top Pages, etc.) has
its own snapshot. JSON files in this folder are imported at build time by
[`../components/SeoDashboard/lib/loadSnapshot.ts`](../components/SeoDashboard/lib/loadSnapshot.ts)
and rendered by the corresponding section component.

## Folder layout

```
seo-data/
  mock/                ← hand-crafted placeholder data, used while real GSC is unavailable
    overview.json
    queries.json       (added as each section ships)
    ...
  gsc/                 ← real Google Search Console snapshots, dated
    overview-YYYY-MM-DD.json
    queries-YYYY-MM-DD.json
    ...
```

## How the loader picks a file (per section)

For each section, the loader follows this rule:

1. Look in `gsc/<section>-*.json`. If any files exist, pick the **most recent by
   filename date** (filenames sort lexicographically because dates are
   `YYYY-MM-DD`).
2. Otherwise, fall back to `mock/<section>.json`.

This means **no component code ever has to change** to swap mock for real data.
Adding a new GSC snapshot is just a matter of dropping a new file into `gsc/`.

## When to use mock vs. gsc

- **mock/**: currently in use because `aitoken.global` is not yet verified in
  Google Search Console. See `TASK5_PROGRESS.md §1.5 Q1` for the pending
  Antonio ask.
- **gsc/**: starts being populated as soon as we can fetch real data. Eventually
  a small script (`studio/scripts/fetch-seo-snapshots.*`) will write new dated
  files here periodically.

## Naming convention for GSC files

```
gsc/<section>-<YYYY-MM-DD>.json
```

- `<section>` is `overview`, `queries`, `pages`, `striking`, `locale`, or `ctr`.
- `<YYYY-MM-DD>` is the date the snapshot was generated (UTC).
- Old files don't need to be deleted — the loader always picks the newest.
  Keeping a couple of weeks of history is useful for week-over-week comparisons
  done outside the loader.

## Schema

JSON files must match the TypeScript interfaces in
[`../components/SeoDashboard/lib/types.ts`](../components/SeoDashboard/lib/types.ts).
Mismatches are caught by TypeScript at build time.

## Do not edit the snapshots by hand

Once real GSC data starts flowing, treat the files in `gsc/` as generated
output. If a number looks wrong, the source of truth is GSC; fix it there and
regenerate. Mock files in `mock/` are the only ones intended for manual
authoring, and only while the dashboard is in placeholder mode.
