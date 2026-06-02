// Bundles every snapshot the dashboard reads into one JSON file and
// triggers a browser download. The file is intended primarily as
// AI-tool context — paste the JSON into Claude / ChatGPT to brainstorm
// content improvements ("here's the last 30 days of data, what should we do?").
//
// Sections are grouped by data source (search / behavior / traffic), mirroring
// the dashboard's three tabs. Each section's JSON shape is identical to the
// snapshot files on disk.

import {
  loadOverview,
  loadQueries,
  loadPages,
  loadStriking,
  loadLocaleAggregate,
  loadCtrOutliers,
  loadGa4Overview,
  loadGa4Channels,
  loadGa4Pages,
  loadGa4Events,
  loadGa4Locale,
  loadCloudflareOverview,
  loadCloudflarePages,
  loadCloudflareReferrers,
  loadCloudflareCountries,
} from './loadSnapshot';
import type {
  OverviewSnapshot,
  QueriesSnapshot,
  PagesSnapshot,
  StrikingSnapshot,
  LocaleSnapshot,
  CtrOutliersSnapshot,
  Ga4OverviewSnapshot,
  Ga4ChannelsSnapshot,
  Ga4PagesSnapshot,
  Ga4EventsSnapshot,
  Ga4LocaleSnapshot,
  CloudflareOverviewSnapshot,
  CloudflarePagesSnapshot,
  CloudflareReferrersSnapshot,
  CloudflareCountriesSnapshot,
} from './types';

export interface FullReport {
  /** ISO timestamp the export was generated client-side. */
  exportedAt: string;
  /** Site the report describes. */
  siteUrl: string;
  /** Rolling window in days. Read from the GSC Overview snapshot. */
  rangeDays: number;
  /** `mock` (all sections mock), `live` (all real), or `mixed` (some of each). */
  dataSource: 'mock' | 'mixed' | 'live';
  /** A line of context for whoever (human or AI) reads this file first. */
  readme: string;
  sections: {
    /** Google Search Console — how people find the site. */
    search: {
      overview: OverviewSnapshot;
      queries: QueriesSnapshot;
      pages: PagesSnapshot;
      striking: StrikingSnapshot;
      byLocale: LocaleSnapshot;
      ctrOutliers: CtrOutliersSnapshot;
    };
    /** Google Analytics 4 — what people do on the site. */
    behavior: {
      overview: Ga4OverviewSnapshot;
      trafficSources: Ga4ChannelsSnapshot;
      pages: Ga4PagesSnapshot;
      events: Ga4EventsSnapshot;
      byLocale: Ga4LocaleSnapshot;
    };
    /** Cloudflare Web Analytics — cookieless headcount + page speed. */
    traffic: {
      overview: CloudflareOverviewSnapshot;
      pages: CloudflarePagesSnapshot;
      referrers: CloudflareReferrersSnapshot;
      countries: CloudflareCountriesSnapshot;
    };
  };
}

const README_TEXT = [
  'SEO Insights export from the {{siteUrl}} Sanity Studio dashboard.',
  '',
  'Three data sources, grouped under "sections":',
  '',
  'SEARCH (Google Search Console) — how people find the site:',
  '  - overview     : clicks, impressions, CTR, avg position (with WoW deltas)',
  '  - queries      : top search terms',
  '  - pages        : top URLs by clicks',
  '  - striking     : queries on page 2 (~pos 11-20) — biggest editorial-leverage wins',
  '  - byLocale     : per-locale aggregates + top query/page',
  '  - ctrOutliers  : pages with below-curve CTR (rewrite title/meta)',
  '',
  'BEHAVIOR (Google Analytics 4) — what people do on the site:',
  '  - overview       : users, engaged sessions, engagement rate, avg engagement time',
  '  - trafficSources : GA4 channels (organic/direct/referral/social/email)',
  '  - pages          : pages by views + engagement time',
  '  - events         : events incl. custom (cta_get_started, calculator_used, faq_open, language_switch)',
  '  - byLocale       : per-locale behaviour + top page/channel',
  '',
  'TRAFFIC (Cloudflare Web Analytics) — cookieless headcount + page speed:',
  '  - overview   : visits, page views, median load time',
  '  - pages      : pages by visits + page views',
  '  - referrers  : sites sending traffic',
  '  - countries  : visits by country',
  '',
  'Notes:',
  '  - CTRs / engagement rates are fractions in [0, 1] (0.0293 = 2.93%).',
  '  - Avg position: lower is better. Median load time is milliseconds, lower is better.',
  '  - Cloudflare counts everyone (cookieless), so its numbers run above GA4.',
  '',
  'Suggested AI prompt: "Here is the last N days of SEO + behaviour + traffic data for our site.',
  'Identify the 5 highest-leverage content opportunities (posts to write or refresh,',
  'titles/meta-descriptions to rewrite, locale gaps to fill, underperforming pages) and',
  'explain why each one matters."',
].join('\n');

export function buildFullReport(): FullReport {
  // Search (GSC)
  const overview = loadOverview();
  const queries = loadQueries();
  const pages = loadPages();
  const striking = loadStriking();
  const byLocale = loadLocaleAggregate();
  const ctrOutliers = loadCtrOutliers();

  // Behavior (GA4)
  const ga4Overview = loadGa4Overview();
  const ga4Channels = loadGa4Channels();
  const ga4Pages = loadGa4Pages();
  const ga4Events = loadGa4Events();
  const ga4Locale = loadGa4Locale();

  // Traffic (Cloudflare)
  const cfOverview = loadCloudflareOverview();
  const cfPages = loadCloudflarePages();
  const cfReferrers = loadCloudflareReferrers();
  const cfCountries = loadCloudflareCountries();

  const allMeta = [
    overview, queries, pages, striking, byLocale, ctrOutliers,
    ga4Overview, ga4Channels, ga4Pages, ga4Events, ga4Locale,
    cfOverview, cfPages, cfReferrers, cfCountries,
  ].map((s) => s.meta.dataSource);
  const dataSource: FullReport['dataSource'] = allMeta.every((s) => s === 'mock')
    ? 'mock'
    : allMeta.every((s) => s !== 'mock')
      ? 'live'
      : 'mixed';

  return {
    exportedAt: new Date().toISOString(),
    siteUrl: overview.meta.siteUrl,
    rangeDays: overview.meta.rangeDays,
    dataSource,
    readme: README_TEXT.replace('{{siteUrl}}', overview.meta.siteUrl),
    sections: {
      search: { overview, queries, pages, striking, byLocale, ctrOutliers },
      behavior: {
        overview: ga4Overview,
        trafficSources: ga4Channels,
        pages: ga4Pages,
        events: ga4Events,
        byLocale: ga4Locale,
      },
      traffic: {
        overview: cfOverview,
        pages: cfPages,
        referrers: cfReferrers,
        countries: cfCountries,
      },
    },
  };
}

/**
 * Build the full report and trigger a browser download of a JSON file.
 * Filename pattern: `seo-insights-<siteUrl>-<YYYY-MM-DD>.json`.
 */
export function downloadFullReportAsJson(): void {
  const report = buildFullReport();
  const date = report.exportedAt.slice(0, 10);
  const filename = `seo-insights-${report.siteUrl}-${date}.json`;
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
