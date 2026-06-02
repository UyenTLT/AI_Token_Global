// fetch-ga4.mjs — pulls real GA4 data via the GA4 Data API and writes the JSON
// snapshots the dashboard reads. Auth: service account (read-only Viewer on the
// property). Run: `node scripts/fetch-ga4.mjs` from the studio/ dir.
//
// Output (per studio/seo-data/FETCH_CONTRACT.md):
//   seo-data/ga4/ga4-overview-<date>.json
//   seo-data/ga4/ga4-channels-<date>.json
//   seo-data/ga4/ga4-pages-<date>.json
//   seo-data/ga4/ga4-events-<date>.json
//   seo-data/ga4/ga4-locale-<date>.json
//
// NOTE (v1, untested against the live API at time of writing): the exact GA4
// metric→shape mappings below are best-effort and may need a tweak after the
// first real run — especially the per-locale aggregation, which GA4 can't do
// natively (we bucket pagePath by its locale prefix, which slightly over-counts
// users/sessions across pages). Adjust and re-run; the dashboard side won't change.

import 'dotenv/config';
import { google } from 'googleapis';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(HERE, '../seo-data/ga4');
const RANGE_DAYS = 30;
const SITE_URL = 'aitoken.global';
const LOCALES = new Set(['en', 'es', 'id']);
const LOCALE_LABEL = { en: 'English', es: 'Español', id: 'Indonesia' };
const CUSTOM_EVENTS = new Set([
  'cta_get_started',
  'calculator_used',
  'faq_open',
  'language_switch',
]);

const PROPERTY_ID = process.env.GA4_PROPERTY_ID;
const KEYFILE = process.env.GOOGLE_SERVICE_ACCOUNT_KEYFILE;
if (!PROPERTY_ID || !KEYFILE) {
  console.error('Missing GA4_PROPERTY_ID or GOOGLE_SERVICE_ACCOUNT_KEYFILE in studio/.env');
  process.exit(1);
}

const auth = new google.auth.GoogleAuth({
  keyFile: resolve(HERE, '..', KEYFILE),
  scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
});
const analyticsdata = google.analyticsdata({ version: 'v1beta', auth });

// Current 30-day window and the prior 30-day window, for period-over-period deltas.
const CURRENT = { startDate: '30daysAgo', endDate: 'yesterday' };
const PREVIOUS = { startDate: '60daysAgo', endDate: '31daysAgo' };

const SNAPSHOT_DATE = new Date().toISOString().slice(0, 10);
const META = {
  siteUrl: SITE_URL,
  snapshotDate: SNAPSHOT_DATE,
  rangeDays: RANGE_DAYS,
  dataSource: 'ga4',
};

const num = (v) => Number(v ?? 0);
function localeOf(path) {
  const seg = (path || '').split('/').filter(Boolean)[0];
  return LOCALES.has(seg) ? seg : null;
}

async function runReport(body) {
  const res = await analyticsdata.properties.runReport({
    property: `properties/${PROPERTY_ID}`,
    requestBody: body,
  });
  return res.data.rows ?? [];
}

// Pull metric values by name for a row, given the report's metricHeaders order.
function metricMap(row, metricHeaders) {
  const out = {};
  metricHeaders.forEach((h, i) => { out[h.name] = num(row.metricValues?.[i]?.value); });
  return out;
}

async function reportWithHeaders(body) {
  const res = await analyticsdata.properties.runReport({
    property: `properties/${PROPERTY_ID}`,
    requestBody: body,
  });
  return { rows: res.data.rows ?? [], metricHeaders: res.data.metricHeaders ?? [] };
}

async function write(section, payload) {
  await mkdir(OUT_DIR, { recursive: true });
  const file = resolve(OUT_DIR, `ga4-${section}-${SNAPSHOT_DATE}.json`);
  await writeFile(file, JSON.stringify(payload, null, 2) + '\n');
  console.log(`✓ wrote ${file} (${'rows' in payload ? payload.rows?.length ?? '-' : 'aggregate'})`);
}

const METRICS = ['activeUsers', 'engagedSessions', 'engagementRate', 'userEngagementDuration', 'sessions'];

function bucket(m) {
  // Build a Ga4OverviewBucket from a metric map. avgEngagementSeconds = total
  // engagement seconds / active users (GA4's "average engagement time per user").
  return {
    users: m.activeUsers,
    engagedSessions: m.engagedSessions,
    engagementRate: m.engagementRate, // already a fraction [0,1]
    avgEngagementSeconds:
      m.activeUsers > 0 ? Math.round(m.userEngagementDuration / m.activeUsers) : 0,
  };
}

async function overview() {
  const { rows, metricHeaders } = await reportWithHeaders({
    dateRanges: [CURRENT, PREVIOUS],
    metrics: METRICS.map((name) => ({ name })),
  });
  // With 2 date ranges, GA4 returns a 'dateRange' dimension (dateRange_0 / _1).
  const byRange = { current: {}, previous: {} };
  for (const r of rows) {
    const idx = r.dimensionValues?.[0]?.value; // "date_range_0" or "date_range_1"
    const key = idx?.endsWith('0') ? 'current' : 'previous';
    byRange[key] = metricMap(r, metricHeaders);
  }
  await write('overview', { meta: META, current: bucket(byRange.current), previous: bucket(byRange.previous) });
}

async function channels() {
  const { rows, metricHeaders } = await reportWithHeaders({
    dateRanges: [CURRENT],
    dimensions: [{ name: 'sessionDefaultChannelGroup' }],
    metrics: METRICS.map((name) => ({ name })),
    orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
  });
  const rowsOut = rows.map((r) => {
    const m = metricMap(r, metricHeaders);
    return {
      channel: r.dimensionValues?.[0]?.value ?? '(unknown)',
      users: m.activeUsers,
      sessions: m.sessions,
      engagementRate: m.engagementRate,
      avgEngagementSeconds: m.sessions > 0 ? Math.round(m.userEngagementDuration / m.sessions) : 0,
    };
  });
  await write('channels', { meta: META, rows: rowsOut });
}

async function pages() {
  const { rows, metricHeaders } = await reportWithHeaders({
    dateRanges: [CURRENT],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }, { name: 'userEngagementDuration' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 200,
  });
  const rowsOut = [];
  for (const r of rows) {
    const path = r.dimensionValues?.[0]?.value ?? '';
    const locale = localeOf(path);
    if (!locale) continue; // only our locale-prefixed pages
    const m = metricMap(r, metricHeaders);
    rowsOut.push({
      page: path,
      locale,
      views: m.screenPageViews,
      users: m.activeUsers,
      avgEngagementSeconds: m.activeUsers > 0 ? Math.round(m.userEngagementDuration / m.activeUsers) : 0,
    });
  }
  await write('pages', { meta: META, rows: rowsOut.slice(0, 50) });
}

async function events() {
  const { rows, metricHeaders } = await reportWithHeaders({
    dateRanges: [CURRENT],
    dimensions: [{ name: 'eventName' }],
    metrics: [{ name: 'eventCount' }, { name: 'activeUsers' }],
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
  });
  const rowsOut = rows.map((r) => {
    const name = r.dimensionValues?.[0]?.value ?? '(unknown)';
    const m = metricMap(r, metricHeaders);
    return { event: name, count: m.eventCount, users: m.activeUsers, custom: CUSTOM_EVENTS.has(name) };
  });
  await write('events', { meta: META, rows: rowsOut });
}

async function locale() {
  // GA4 has no locale dimension — bucket pagePath by its first segment. Approximate
  // for users/sessions (a visitor across pages counts in each); refine later if needed.
  async function perRange(range) {
    const { rows, metricHeaders } = await reportWithHeaders({
      dateRanges: [range],
      dimensions: [{ name: 'pagePath' }, { name: 'sessionDefaultChannelGroup' }],
      metrics: METRICS.map((name) => ({ name })).concat([{ name: 'screenPageViews' }]),
      limit: 2000,
    });
    const acc = {}; // locale -> { metrics..., pages:{path:views}, channels:{ch:users} }
    for (const r of rows) {
      const path = r.dimensionValues?.[0]?.value ?? '';
      const ch = r.dimensionValues?.[1]?.value ?? '(unknown)';
      const loc = localeOf(path);
      if (!loc) continue;
      const m = metricMap(r, metricHeaders);
      const a = (acc[loc] ??= {
        activeUsers: 0, engagedSessions: 0, sessions: 0, userEngagementDuration: 0,
        engagementRateNum: 0, engagementRateDen: 0, pages: {}, channels: {},
      });
      a.activeUsers += m.activeUsers;
      a.engagedSessions += m.engagedSessions;
      a.sessions += m.sessions;
      a.userEngagementDuration += m.userEngagementDuration;
      a.pages[path] = (a.pages[path] ?? 0) + m.screenPageViews;
      a.channels[ch] = (a.channels[ch] ?? 0) + m.activeUsers;
    }
    return acc;
  }

  const cur = await perRange(CURRENT);
  const prev = await perRange(PREVIOUS);

  function toBucket(a) {
    return {
      users: a.activeUsers,
      engagedSessions: a.engagedSessions,
      engagementRate: a.sessions > 0 ? a.engagedSessions / a.sessions : 0,
      avgEngagementSeconds: a.activeUsers > 0 ? Math.round(a.userEngagementDuration / a.activeUsers) : 0,
    };
  }
  const topKey = (obj) => Object.entries(obj).sort((x, y) => y[1] - x[1])[0]?.[0] ?? '—';

  const locales = [];
  for (const loc of ['en', 'es', 'id']) {
    const a = cur[loc];
    if (!a) continue;
    locales.push({
      locale: loc,
      label: LOCALE_LABEL[loc],
      current: toBucket(a),
      previous: toBucket(prev[loc] ?? { activeUsers: 0, engagedSessions: 0, sessions: 0, userEngagementDuration: 0 }),
      topPage: topKey(a.pages),
      topChannel: topKey(a.channels),
    });
  }
  await write('locale', { meta: META, locales });
}

async function main() {
  console.log(`GA4 fetch → property ${PROPERTY_ID}, window ${RANGE_DAYS}d, date ${SNAPSHOT_DATE}`);
  await overview();
  await channels();
  await pages();
  await events();
  await locale();
  console.log('Done. Rebuild the Studio (npm run build) to see real data.');
}

main().catch((err) => {
  console.error('GA4 fetch failed:', err?.response?.data ?? err);
  process.exit(1);
});
