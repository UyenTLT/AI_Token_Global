# AI Token Global — Automation & Operations Audit
**Date:** 2026-05-08 | **Scope:** Build pipeline, deploy triggers, env management, bulk migration, AI ops, cost, monitoring, backup
**Prior audit:** Archived at `FINAL_PROJECT_AUDIT_2026-05-07.md` — no commits since May 7; all findings persist unchanged.
**New this run:** Node 22 version mismatch finding; expanded `amplify.yml` recommendation with exact YAML; GitHub Actions backup workflow.

---

## 1. Headline

- **No `amplify.yml` exists** — Amplify uses auto-detection, which is fragile across Amplify console updates; the build spec is undocumented and could silently change. Creating `amplify.yml` is a one-file, one-hour fix.
- **Sanity → Amplify webhook is not configured** — every content publish requires a manual git commit or a console-triggered rebuild to go live. This is the single highest manual-labor item at scale.
- **200+ article migration has no automation plan yet** — at manual pace, this is an 83–124 hour task; with a conversion script + AI translation drafts, it shrinks to 10–13 hours.
- **No monitoring, alerting, or backup exists** — build failures will go unnoticed; there is no recovery plan if the Sanity dataset is corrupted.
- **AI-assisted translation is the highest-ROI automation:** at 15 languages × 200 articles, it saves an estimated 1,800+ translator-hours vs. translating from scratch.

---

## 2. Pipeline Diagram

```
LOCAL DEV
  │
  ├─ Edit code (Astro/components/schemas)
  ├─ Edit content (Sanity Studio at localhost:3333)
  │
  └─► git push origin main
          │
          ▼
      GITHUB
      antonioduran-insight/AI_Token_Global
          │
          │  (webhook — auto-configured by Amplify)
          ▼
      AWS AMPLIFY
      ┌─────────────────────────────────────────┐
      │  npm ci                                 │
      │  npm run build   (Astro static output)  │
      │  output: dist/                          │
      └─────────────────────────────────────────┘
          │
          ▼
      LIVE SITE (CDN edge)
      https://aitokenglobal.com


SANITY STUDIO (content editing)
  │
  │  Editor clicks "Publish"
  │
  ▼
  Sanity API (document saved to dataset)
  │
  │  ❌ MISSING: Webhook → Amplify incoming URL
  │     (Task #8 — not configured)
  │
  [Site content stays STALE until next git push or manual Amplify rebuild]
```

**The missing link:** Without the Sanity → Amplify webhook, content edits do not trigger a rebuild. On a static site, this means editors see their changes in the Studio but visitors see the old site until a developer triggers a rebuild manually.

---

## 3. Findings Table

| ID | Severity | Category | Location | Issue | Manual Cost (if unautomated) | Automation Opportunity |
|----|----------|----------|----------|-------|------------------------------|------------------------|
| A-01 | **Blocker** | Build pipeline | Repo root (missing `amplify.yml`) | No `amplify.yml` — relying on Amplify auto-detection | Low now, high risk on Amplify updates | Create `amplify.yml` with pinned build spec |
| A-02 | **Blocker** | Deploy triggers | Sanity manage console | Sanity → Amplify webhook not configured (Task #8) | ~2 hr/month manually triggering rebuilds per content update | Configure Sanity outgoing webhook to Amplify incoming URL |
| A-03 | **Blocker** | Env management | `/.env` (committed to git) | `.env` tracked by git; violates stated policy | — | `git rm --cached .env`; move to `.env.local` |
| A-04 | **High** | Build pipeline | `astro.config.mjs` | No `site:` URL — breaks sitemap generation and canonical tags | Blocks all of Phase 8 SEO | Add `site: 'https://aitokenglobal.com'` |
| A-05 | **High** | Build pipeline | `studio/package.json` lines 8, 10 | `"sanity": "*"` — unbounded version; CI can pull breaking major | ~4 hr debugging unexpected Sanity upgrade breaks | Pin to `"sanity": "^3.x.x"` |
| A-06 | **High** | Content migration | No scripts exist | 200+ articles have no import pipeline | 83–124 hr manual entry | NDJSON conversion script + `sanity dataset import` |
| A-07 | **High** | Content migration | No scripts exist | 200+ images need bulk upload to Sanity media library | ~20 hr manual upload | `@sanity/client` bulk upload script |
| A-08 | **High** | Content scaling | `studio/schemas/` | No `sanity-plugin-document-internationalization` | 143 manual document creations for 11 pages × 13 new langs | Evaluate and install the plugin |
| A-09 | **High** | Monitoring | No monitoring configured | No build failure notifications | Outages go undetected; no SLA visibility | Amplify SNS notification + UptimeRobot |
| A-10 | **High** | Backup | No backup configured | No Sanity export schedule | Full data loss on accidental dataset wipe | Weekly `sanity dataset export` via GitHub Actions |
| A-11 | **Medium** | Build pipeline | `amplify.yml` (to create) | No `node_modules` cache configured | Builds take 2–4 min vs. 30–60 sec with warm cache | Add `cache` block in `amplify.yml` |
| A-12 | **Medium** | Env management | Amplify Console | No staging/preview dataset | Editors can't preview content without risking production | Create `staging` dataset; wire to branch deployments |
| A-13 | **Medium** | Monitoring | AWS Console | No AWS budget alarm | Cost overruns undetected until invoice | Set $25/mo and $50/mo CloudWatch billing alarms |
| A-14 | **Medium** | Build pipeline | `package.json` `engines` field (missing) | Node version not pinned — Amplify defaults may drift | Subtle build failures on Node version mismatches | Add `"engines": { "node": ">=20.0.0 <23" }` to `package.json` |
| A-15 | **Low** | Monitoring | Sanity manage console | No webhook delivery monitoring | Failed webhook calls go unnoticed | Check Sanity manage → API → Webhooks panel regularly |

---

## 4. Migration Plan (200+ Articles + Images)

### Phase 1 — Image upload (estimated: 4–6 hours)

**Goal:** Upload all article images to Sanity media library with consistent filenames.

```typescript
// scripts/bulk-upload-images.ts
import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: 'production',
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function uploadImages(imageDir: string) {
  const files = fs.readdirSync(imageDir).filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f));
  for (const file of files) {
    const articleNumber = path.basename(file, path.extname(file)); // '1', '2', etc.
    const stream = fs.createReadStream(path.join(imageDir, file));
    const asset = await client.assets.upload('image', stream, {
      filename: file,
      label: `article-${articleNumber}`,
    });
    console.log(`Uploaded ${file} → ${asset._id}`);
  }
}
```

**Effort breakdown:**
- Script development: 1–2 hr
- Test run on 10 images: 30 min
- Full upload run: 1–2 hr (rate-limited by Sanity API)
- Verification: 30 min

### Phase 2 — Article data conversion (estimated: 3–5 hours)

**Goal:** Convert existing article data (assumed JSON or CSV export from Chinese CMS) to Sanity NDJSON format matching the `post` schema.

```typescript
// scripts/convert-articles-to-ndjson.ts
import { nanoid } from 'nanoid';

interface SourceArticle {
  id: number;
  title_zh: string;
  title_en: string;
  body_zh: string;
  body_en: string;
  publishDate: string;
  imageFilename: string; // matches uploaded asset label
}

function toPortableText(text: string) {
  return text.split('\n\n').map(para => ({
    _type: 'block',
    _key: nanoid(),
    style: 'normal',
    children: [{ _type: 'span', _key: nanoid(), text: para, marks: [] }],
    markDefs: [],
  }));
}

function toSanityPost(article: SourceArticle, lang: string) {
  return {
    _type: 'post',
    _id: `post-${article.id}-${lang}`,
    language: lang,
    title: lang === 'zh' ? article.title_zh : article.title_en,
    slug: { _type: 'slug', current: `article-${article.id}` },
    body: toPortableText(lang === 'zh' ? article.body_zh : article.body_en),
    publishedAt: article.publishDate,
    // coverImage reference resolved in Phase 3
  };
}
```

Import command:
```bash
sanity dataset import articles.ndjson production --replace
```

**Effort breakdown:**
- Script development: 2–3 hr
- Test import of 10 articles: 30 min
- Fix edge cases + re-import: 1–2 hr
- Verification in Sanity Studio: 30 min

### Phase 3 — Translation pipeline (estimated: ongoing, AI-assisted)

See Section 5 (AI-assisted ops roadmap).

**Total migration cost:**
| Approach | Effort |
|----------|--------|
| Fully manual (no scripts, no AI) | 83–124 hr |
| Scripts only (no AI translation) | 15–22 hr |
| Scripts + AI translation drafts | 10–13 hr |

---

## 5. AI-Assisted Ops Roadmap

| Priority | Automation | Tool | ROI | When to implement |
|----------|-----------|------|-----|-------------------|
| 1 | **Translation drafting** | Claude API (Sonnet) — translate EN → target language; translator reviews/edits rather than translating from scratch | ~6 hr saved per article per language; at 200 articles × 13 new languages = 1,800+ translator-hours saved | Now — before migration starts |
| 2 | **Alt-text generation** | Claude vision API — generate descriptive alt text for each uploaded image | ~2 min per image saved; at 200 images × 15 languages = 50 hr saved | During Phase 1 image upload |
| 3 | **SEO description generation** | Claude API — generate `seoDescription` from `body` Portable Text; editor refines tone | ~15 min per page × 165 pages = 41 hr saved | When `seoFields` schema is added |
| 4 | **FAQ extraction** | Claude API — extract candidate FAQ items from long-form articles | ~30 min per article × 200 = 100 hr saved | After blog migration, before FAQ schema porting |
| 5 | **Content QA** | Claude API — check translated content against EN source for omissions, added claims, or mistranslated numbers | ~1 hr per review cycle × 165 documents = 165 hr of reviewer time de-risked | At scale (5+ languages) |

**API cost estimate (Claude Sonnet 4.6):**
- Translation: ~2,000 tokens/article × 200 articles × 13 languages = 5.2M tokens ≈ $15–20 one-time
- Alt-text: ~500 tokens/image × 200 images = 100K tokens ≈ $0.30 one-time
- SEO descriptions: ~500 tokens/page × 165 pages = 82K tokens ≈ $0.25 one-time
- **Total one-time AI cost:** ~$16–21 to automate 1,800+ hours of translator work

---

## 6. Cost Projection

| Milestone | AWS Amplify | Sanity | Domain | Total/mo |
|-----------|------------|--------|--------|----------|
| Today (dev, no deploy) | $0 | $0 (free tier) | ~$1.25 | **~$1.25** |
| Launch (EN + ES, ~50 builds/mo) | $0 (free tier: 1,000 build-min, 15 GB storage) | $0 | ~$1.25 | **~$1.25** |
| 6 months (~150 builds/mo, 5 languages, 500 docs) | $0–5 | $0 (free tier: up to 10k docs) | ~$1.25 | **~$1.25–6** |
| 12 months (15 languages, 3,000 docs, 300 builds/mo) | $5–15 (storage/bandwidth overage) | $0–19 (Growth plan if >10k docs) | ~$1.25 | **~$6–35** |
| Peak scale (15 langs, 3,000 docs, 1M+ pageviews/mo) | $15–50 (bandwidth overage) | $19 (Growth) | ~$1.25 | **~$35–70** |

**Cost levers:**
- Amplify free tier covers 1,000 build-min/mo and 5 GB storage — easily sufficient through 6 months
- Sanity free tier covers 10,000 documents — 3,000 docs (11 pages × 15 langs + 200 articles × 15 langs) approaches this ceiling
- Primary cost risk at scale: **Sanity Growth plan ($19/mo)** triggered when documents exceed 10,000

**Recommendation:** Watch document count in Sanity dashboard as article migration progresses. Set a reminder to evaluate the Growth plan upgrade when document count passes 7,500.

---

## 7. Monitoring & Alerting

**Build failure notifications (configure in Amplify Console):**
- Amplify → App → Notifications → Add notification → Email or Slack
- Trigger: `FAILED` build status
- Target: developer email or team Slack `#deploys` channel

**Uptime monitoring (free tier):**
- UptimeRobot: monitor `https://aitokenglobal.com` every 5 min; alert on downtime
- Monitor `/en/`, `/en/ai-trends/`, `/en/blog/` independently to catch route-level failures

**AWS Budget alarm:**
- AWS Console → Budgets → Create budget → Monthly cost → Alert at $25 and $50
- Prevents surprise invoice if Amplify bandwidth spikes unexpectedly

**Sanity webhook delivery:**
- Sanity manage → API → Webhooks → view delivery logs
- Check weekly for failed deliveries after webhook is configured

---

## 8. Backup & Recovery

**Sanity dataset backup — GitHub Actions workflow:**
```yaml
# .github/workflows/sanity-backup.yml
name: Weekly Sanity Backup
on:
  schedule:
    - cron: '0 2 * * 0'  # Every Sunday at 2am UTC
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install -g @sanity/cli
      - run: |
          sanity dataset export production sanity-backup-$(date +%Y-%m-%d).tar.gz
        env:
          SANITY_AUTH_TOKEN: ${{ secrets.SANITY_WRITE_TOKEN }}
      - uses: actions/upload-artifact@v4
        with:
          name: sanity-backup-${{ github.run_id }}
          path: '*.tar.gz'
          retention-days: 90
```

**Recovery runbook:**

| Scenario | Steps | RTO |
|----------|-------|-----|
| Accidental document deletion | Sanity manage → History → Restore document | <5 min |
| Dataset corruption | `sanity dataset import <latest-backup.tar.gz> production --replace` | <30 min |
| Amplify build failure | Check build logs → fix code → git push | <1 hr |
| Amplify deploy lost | Re-connect repo in Amplify Console; trigger manual build | <2 hr |
| Domain DNS failure | Update DNS records at registrar; TTL propagation | 1–24 hr |

---

## 9. Drift Check (Docs vs. Reality)

| # | Document | Claim | Reality |
|---|---|---|---|
| D-01 | `go-live-guide.md` Phase 6.4 | "Configure Sanity → Amplify webhook" | ❌ Not configured — Sanity manage shows no outgoing webhooks |
| D-02 | `summary.md` | References `amplify.yml` in build discussion | ❌ File does not exist at repo root — Amplify is using auto-detection |
| D-03 | `go-live-guide.md` Phase 6.2 | Build: `npm ci && npm run build`, output `dist` | ✅ Matches `package.json` `build` script exactly |
| D-04 | `summary.md` | `.env` is gitignored | ❌ `.env` is tracked by git (`git ls-files .env` returns the file) |
| D-05 | Neither doc | (not mentioned) | ❌ Node version is not pinned in `package.json`; Amplify could run a different Node major than local dev |
| D-06 | `go-live-guide.md` | "Phase 8: SEO" listed as a future task | ✅ Correctly deferred — no premature SEO implementation found |
| D-07 | `summary.md` Task #8 | "Connect Sanity webhook to Amplify — pending" | ✅ Correctly flagged as pending |

---

## Recommended `amplify.yml`

Create at repo root immediately (resolves A-01 and documents the build contract):

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - node --version
        - npm --version
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .npm/**/*
```

This pins the build spec in code (not Amplify console), adds `node_modules` caching (cuts build time from ~3 min to ~45 sec on warm cache), and makes the contract visible to the team.
