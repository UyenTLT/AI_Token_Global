// fetch-gsc.mjs — pulls Google Search Console data via the Search Console API and
// writes the gsc/*.json snapshots the dashboard reads. Auth: OAuth as Levinson
// (Owner of the property) — the Google org bug blocks service-account access to
// GSC, so we use the user's own token. The FIRST run opens a browser for a
// one-time sign-in and saves a refresh token (secrets/gsc-oauth-token.json);
// later runs reuse it silently. Run from studio/: node scripts/fetch-gsc.mjs
//
// v1 (untested): query→locale assignment (via the landing page), the striking-
// distance + CTR-outlier heuristics are best-effort — tune after the first run.
// A new site may return little/no data (GSC lags ~2-3 days + needs impressions).

import 'dotenv/config';
import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(HERE, '../seo-data/gsc');
const RANGE_DAYS = 30;
const SITE_URL_META = 'aitoken.global';
const LOCALES = new Set(['en', 'es', 'id']);
const LOCALE_LABEL = { en: 'English', es: 'Español', id: 'Indonesia' };

const SITE = process.env.GSC_SITE_URL; // sc-domain:aitoken.global
const CREDENTIALS_PATH = resolve(HERE, '..', process.env.GOOGLE_OAUTH_CLIENT || './secrets/oauth-credentials.json');
const TOKEN_PATH = resolve(HERE, '..', process.env.GOOGLE_OAUTH_TOKEN || './secrets/gsc-oauth-token.json');
const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];

if (!SITE) {
  console.error('Missing GSC_SITE_URL in studio/.env (expected sc-domain:aitoken.global)');
  process.exit(1);
}

async function loadSaved() {
  try {
    return google.auth.fromJSON(JSON.parse(await readFile(TOKEN_PATH, 'utf8')));
  } catch {
    return null;
  }
}
async function saveToken(client) {
  const keys = JSON.parse(await readFile(CREDENTIALS_PATH, 'utf8'));
  const key = keys.installed || keys.web;
  await writeFile(
    TOKEN_PATH,
    JSON.stringify(
      { type: 'authorized_user', client_id: key.client_id, client_secret: key.client_secret, refresh_token: client.credentials.refresh_token },
      null,
      2,
    ),
  );
}
async function authorize() {
  const saved = await loadSaved();
  if (saved) return saved;
  console.log('No saved token — opening a browser for a one-time Google sign-in…');
  console.log('Sign in with the Gmail that OWNS the GSC property (aitoken.global).');
  const client = await authenticate({ scopes: SCOPES, keyfilePath: CREDENTIALS_PATH });
  if (client.credentials?.refresh_token) {
    await saveToken(client);
    console.log('✓ token saved — future runs won’t prompt.');
  }
  return client;
}

const day = (offset) => new Date(Date.now() - offset * 86400000).toISOString().slice(0, 10);
const CURRENT = { startDate: day(30), endDate: day(1) };
const PREVIOUS = { startDate: day(60), endDate: day(31) };
const SNAPSHOT_DATE = new Date().toISOString().slice(0, 10);
const META = { siteUrl: SITE_URL_META, snapshotDate: SNAPSHOT_DATE, rangeDays: RANGE_DAYS, dataSource: 'gsc' };

let webmasters;
async function query(body) {
  const res = await webmasters.searchanalytics.query({ siteUrl: SITE, requestBody: body });
  return res.data.rows ?? [];
}

function pathOf(url) {
  try { return new URL(url).pathname; } catch { return url; }
}
function localeOf(path) {
  const seg = (path || '').split('/').filter(Boolean)[0];
  return LOCALES.has(seg) ? seg : null;
}
async function write(section, payload) {
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(resolve(OUT_DIR, `${section}-${SNAPSHOT_DATE}.json`), JSON.stringify(payload, null, 2) + '\n');
  console.log(`✓ wrote ${section}-${SNAPSHOT_DATE}.json`);
}

async function bucket(range) {
  const r = (await query({ startDate: range.startDate, endDate: range.endDate }))[0];
  return { clicks: r?.clicks ?? 0, impressions: r?.impressions ?? 0, ctr: r?.ctr ?? 0, avgPosition: r?.position ?? 0 };
}

// query+page rows let us assign each query the locale of the page it lands on.
async function buildQueries() {
  const rows = await query({ startDate: CURRENT.startDate, endDate: CURRENT.endDate, dimensions: ['query', 'page'], rowLimit: 5000 });
  const byQuery = new Map();
  for (const r of rows) {
    const q = r.keys[0];
    const loc = localeOf(pathOf(r.keys[1]));
    if (!loc) continue;
    const a = byQuery.get(q) ?? { query: q, clicks: 0, impressions: 0, posW: 0, byLocale: {} };
    a.clicks += r.clicks;
    a.impressions += r.impressions;
    a.posW += r.position * r.impressions;
    a.byLocale[loc] = (a.byLocale[loc] ?? 0) + r.clicks;
    byQuery.set(q, a);
  }
  return [...byQuery.values()]
    .map((a) => ({
      query: a.query,
      locale: Object.entries(a.byLocale).sort((x, y) => y[1] - x[1])[0]?.[0] ?? 'en',
      clicks: a.clicks,
      impressions: a.impressions,
      ctr: a.impressions ? a.clicks / a.impressions : 0,
      position: a.impressions ? a.posW / a.impressions : 0,
    }))
    .sort((x, y) => y.clicks - x.clicks);
}

async function buildPages(range) {
  const rows = await query({ startDate: range.startDate, endDate: range.endDate, dimensions: ['page'], rowLimit: 5000 });
  return rows
    .map((r) => {
      const page = pathOf(r.keys[0]);
      return { page, locale: localeOf(page), clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position };
    })
    .filter((r) => r.locale);
}

// Industry organic CTR-by-position benchmark, for the CTR-outlier check.
function expectedCtr(pos) {
  const C = [0, 0.28, 0.15, 0.11, 0.08, 0.07, 0.05, 0.04, 0.032, 0.028, 0.025];
  if (pos <= 1) return C[1];
  if (pos >= 10) return Math.max(0.01, 0.025 - (pos - 10) * 0.002);
  const lo = Math.floor(pos), hi = Math.ceil(pos);
  return C[lo] + (C[hi] - C[lo]) * (pos - lo);
}

async function localeSection(curPages, queryRows) {
  const prevPages = await buildPages(PREVIOUS);
  const agg = (pageRows) => {
    const acc = {};
    for (const r of pageRows) {
      const a = (acc[r.locale] ??= { clicks: 0, impressions: 0, posW: 0, pages: {} });
      a.clicks += r.clicks;
      a.impressions += r.impressions;
      a.posW += r.position * r.impressions;
      a.pages[r.page] = (a.pages[r.page] ?? 0) + r.clicks;
    }
    return acc;
  };
  const cur = agg(curPages), prev = agg(prevPages);
  const topQ = {};
  for (const q of queryRows) if (!topQ[q.locale] || q.clicks > topQ[q.locale].clicks) topQ[q.locale] = q;
  const toBucket = (a) =>
    a
      ? { clicks: a.clicks, impressions: a.impressions, ctr: a.impressions ? a.clicks / a.impressions : 0, avgPosition: a.impressions ? a.posW / a.impressions : 0 }
      : { clicks: 0, impressions: 0, ctr: 0, avgPosition: 0 };
  const topKey = (obj) => Object.entries(obj ?? {}).sort((x, y) => y[1] - x[1])[0]?.[0] ?? '—';
  // Always emit all locales (zeros when a locale has no data this period), so the
  // By Locale grid stays complete instead of silently dropping a column.
  const locales = [];
  for (const loc of ['en', 'es', 'id']) {
    locales.push({
      locale: loc,
      label: LOCALE_LABEL[loc],
      current: toBucket(cur[loc]),
      previous: toBucket(prev[loc]),
      topQuery: topQ[loc]?.query ?? '—',
      topPage: cur[loc] ? topKey(cur[loc].pages) : '—',
    });
  }
  await write('locale', { meta: META, locales });
}

async function main() {
  const auth = await authorize();
  webmasters = google.webmasters({ version: 'v3', auth });
  console.log(`GSC fetch → ${SITE}, window ${RANGE_DAYS}d, date ${SNAPSHOT_DATE}`);

  await write('overview', { meta: META, current: await bucket(CURRENT), previous: await bucket(PREVIOUS) });

  const qrows = await buildQueries();
  await write('queries', { meta: META, rows: qrows.slice(0, 50) });
  await write('striking', {
    meta: META,
    criteria: 'position 8-20, impressions >= 10',
    rows: qrows.filter((r) => r.position >= 8 && r.position <= 20 && r.impressions >= 10).sort((x, y) => y.impressions - x.impressions).slice(0, 30),
  });

  const prows = await buildPages(CURRENT);
  await write('pages', { meta: META, rows: [...prows].sort((a, b) => b.clicks - a.clicks).slice(0, 50) });
  await write('ctr-outliers', {
    meta: META,
    criteria: 'CTR < 60% of position-expected, impressions >= 20',
    rows: prows.filter((r) => r.impressions >= 20 && r.ctr < expectedCtr(r.position) * 0.6).sort((a, b) => b.impressions - a.impressions).slice(0, 25),
  });

  await localeSection(prows, qrows);
  console.log('Done. Rebuild the Studio to see real data.');
}

main().catch((err) => {
  console.error('GSC fetch failed:', err?.response?.data ?? err?.message ?? err);
  process.exit(1);
});
