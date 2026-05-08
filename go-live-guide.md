# AI Token Global — Go-Live Guide

## Overview

This guide covers everything from finishing the current HTML prototype to a fully deployed, scalable, multilingual site on AWS Amplify.

---

## Where We Are Now (May 2026)

**Done**
- HTML prototype complete and archived in `archive/`
- Repo on GitHub, Astro project at repo root
- Sanity CMS connected (project `mq3wxr8n`), AI Trends page schema designed and wired up with EN + ES content
- Dynamic language switcher in Nav — supports any number of languages
- This deploy guide updated for AWS Amplify
- Full project audit completed (2026-05-08, four specialists + supervisor synthesis)

**Active focus: Pre-flight (Task #0)** — must land before Task #5 page port and before any Phase 6 deploy. The 2026-05-08 audit identified six pre-flight items totalling 1.5–2.5 days: `.env` out of git, `seo` object on Sanity schemas, canonical/hreflang/OG in `BaseLayout.astro`, sitemap + `robots.txt`, EN/ES delocalization, and centralizing the Visual/Mobile/A11y system (mobile nav broken, FAQ accordion broken, illegal CSS transitions). Doing this now avoids fixing the same gaps 11 times once the singleton pattern replicates.

**Next, in order** *(post-audit sequencing — full tracker in `audits/IMPLEMENTATION_PLAN.md` v2.1)*
1. **Task #0 — Pre-flight** (in progress): security, SEO foundation, EN/ES delocalization, Visual/Mobile/A11y standardization
2. **Task #5 — Port remaining 11 pages** (Batch A → B → C) on the hardened pattern
3. **Task #6 — Bulk migration scripts + EN/ES content** (parallel to #5)
4. **Task #8 — Deploy to AWS Amplify** (Phase 6 below; hard-gated by Task #0a `.env` removal)
5. **Task #9 — Post-deploy polish** (Phase 8 below; most SEO basics moved to pre-flight, what's left here is image migration, JSON-LD, and Lighthouse work)
6. **Tasks #11, #12** — Operations safety net, AI ops pipeline (before language 3)
7. **Task #10 — Scale to languages 3–15**

If you're learning the deploy steps, skip straight to **Phase 6** but check the Task #0a precondition first. Phases 1–5 are kept below for reference / context.

**Audit and risk tracker:** `audits/FINAL_PROJECT_AUDIT.md` (verdict: GO WITH CAVEATS) and `audits/IMPLEMENTATION_PLAN.md` (canonical task list). Update those — not this guide — as tasks complete.

---

## Phase 1 — Finish the HTML Prototype
*Status: Complete · prototype archived in `archive/`*

Complete all remaining design and content work in the raw HTML files. This prototype is the design source of truth for the migration.

**This session's checklist:**
- [ ] Documentation nav link → redirect to `https://www.aitokenking.com.tw/docs`
- [ ] Blog index page (with reference design)
- [ ] Blog post base template (1–3 sample posts)
- [ ] Animations and dynamic elements across all pages
- [ ] Additional hyperlinks to the AI Token King aggregator platform

**When prototype is done, do not add more HTML pages.** All future content goes through the CMS after migration.

---

## Phase 2 — Set Up GitHub Repository
*Status: Complete · repo connected, restructure pushed*

1. Create a GitHub account at https://github.com if you don't have one
2. Create a new repository: `aitokenglobal` (public or private, your choice)
3. In your terminal, from the project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial prototype commit"
   git remote add origin https://github.com/YOUR_USERNAME/aitokenglobal.git
   git push -u origin main
   ```
4. Verify all files appear on GitHub

**Note:** Add a `.gitignore` file to exclude `node_modules/` and `temporary screenshots/` before committing.

---

## Phase 3 — Migrate to Astro (SSG)
*Status: Complete · Astro lives at repo root, design system + Nav + Footer + blog all ported*

This is the most important step before adding 200+ blog articles. Astro generates static HTML at build time, supports components (single nav/footer), and integrates with a CMS.

### 3.1 Install Astro
```bash
npm create astro@latest aitokenglobal-astro
cd aitokenglobal-astro
npm install
```

### 3.2 Port the Design System
- Copy your CSS variables, fonts, and global styles into `src/styles/global.css`
- Create layout components:
  - `src/layouts/BaseLayout.astro` — wraps every page (head, nav, footer)
  - `src/components/Nav.astro` — single nav component, used everywhere
  - `src/components/Footer.astro`

### 3.3 Port Existing Pages
Convert each HTML file to an Astro page in `src/pages/`:
- `index.html` → `src/pages/index.astro`
- `api-compare.html` → `src/pages/api-compare.astro`
- etc.

### 3.4 Set Up Blog Routing
Astro supports Markdown-based blog posts natively:
```
src/
  pages/
    blog/
      index.astro        ← blog index page
      [slug].astro       ← dynamic post template
  content/
    blog/
      post-1.md
      post-2.md
      ...
```

Each `.md` file becomes a blog post automatically. No hand-coding HTML per post.

---

## Phase 4 — Set Up a Headless CMS (Sanity)
*Status: In progress · project connected, AI Trends schema + page done, replicating to remaining pages*

For 200+ articles and regular publishing without touching code. This also enables non-developers to edit **any page content** — not just blog posts.

### 4.1 Create a Sanity project
1. Go to https://sanity.io and create a free account
2. Create a new project: `AI Token Global`
3. Install the Sanity Studio locally:
   ```bash
   npm create sanity@latest
   ```

### 4.2 Define your content schema

**Blog posts** — one document per article:
- `title` (string)
- `slug` (slug)
- `publishedAt` (datetime)
- `language` (string — `en`, `zh`, `es`, etc.)
- `body` (block content / rich text)
- `excerpt` (text)
- `coverImage` (image)
- `tags` (array of strings)

**Page singletons** — one document per page per language, for editing page content without touching code:
- `homePage` → hero headline, subheading, stats, CTA text
- `blogIndexPage` → headline, intro copy
- `apiComparePage` → intro copy, table data
- etc.

This means **any page on any language version can be edited from the Sanity dashboard** — no code changes needed for copy updates.

### 4.3 Connect Astro to Sanity
Install the Sanity client:
```bash
npm install @sanity/client
```

Fetch posts at build time in `[slug].astro`:
```js
import { createClient } from '@sanity/client'
const client = createClient({ projectId: 'YOUR_ID', dataset: 'production', useCdn: true })
const posts = await client.fetch(`*[_type == "post"]`)
```

### 4.4 Load your 200 articles
Options:
- Import from CSV/spreadsheet via Sanity's import tool
- Paste directly into Sanity Studio's editor
- Use the Sanity CLI for bulk import from JSON

---

## Phase 5 — Multilingual Setup
*Status: In progress · Option A chosen, EN + ES live; using `[lang]` dynamic route, not hardcoded language folders*

Since this site is the base template for other language versions, there are two approaches:

### Option A — Single repo, i18n routes (recommended)

One codebase, one CMS, one deployment. All languages live in the same project.

**Folder structure (current):**
```
src/pages/
  [lang]/
    index.astro
    ai-trends.astro
    blog/
      index.astro
      [slug].astro
```
A single `[lang]` dynamic segment generates all language versions at build time — no per-language folder duplication. New languages are added by updating `SUPPORTED_LANGS` in `src/i18n/index.ts` and creating matching content in Sanity.

**How to edit a specific language's page:**
- **Blog posts:** In Sanity, filter by `language == "es"` and edit the Spanish post
- **Page copy** (hero text, section headings, etc.): In Sanity, open the `homePage` singleton for `es` and edit the fields — no code needed
- **Design/layout changes:** Edit the shared Astro component once — it updates all languages automatically

**How Sanity connects to language routes:**
Each content document has a `language` field. Astro fetches only documents matching the current route's language:
```js
// src/pages/es/blog/[slug].astro
const posts = await client.fetch(`*[_type == "post" && language == "es"]`)
```

### Option B — Separate repos per language

Clone the entire repo for each language. Each language version is independently deployed.

- **Pro:** Full independence — different teams, different designs, different deploy schedules
- **Con:** Design/nav updates must be applied to each repo manually
- **When to use:** Only if language versions diverge significantly in ownership or design

**Recommendation:** Start with Option A. If a language version needs to diverge heavily, fork it into Option B at that point.

---

## Phase 6 — Deploy to AWS Amplify

> **Hard prerequisite:** Task #0a (`.env` removed from git tracking) must land *before* the first push to GitHub goes to Amplify. The current `.env` file contains the live Sanity project ID and was flagged by the May 8 audit as a security gate (finding F-01). Run `git rm --cached .env`, add a `.env.example` placeholder, and commit before connecting the repo to Amplify.

### 6.1 Create an AWS account
1. Go to https://aws.amazon.com and sign up. A credit card is required even for the free tier — typical monthly cost for a site this size is $0–$10.
2. Once your account is active, sign into the AWS Console.
3. Pick a region from the region dropdown (top-right of the console). For a globally-distributed audience, **us-east-1 (N. Virginia)** is a safe default — it's the most reliable region and closest to most CDN edge locations.

### 6.2 Connect GitHub to AWS Amplify
1. In the AWS Console, search for and open **AWS Amplify**.
2. Click **Create new app** → **Host web app**.
3. Select **GitHub** as your source provider, then click **Continue**. You'll be prompted to authorize AWS Amplify to access your GitHub account — approve it, and limit the access to just the `aitokenglobal` repo.
4. Choose the `aitokenglobal` repository and the `main` branch.
5. Amplify auto-detects that this is an Astro project. The build settings should populate as:
   - **Build command:** `npm ci && npm run build`
   - **Output directory:** `dist`

   If anything looks different, paste this build spec under **Build settings → Edit**:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
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
   ```
6. Under **Advanced settings → Environment variables**, add the Sanity environment variables (these match what's in your local `.env`):
   - `PUBLIC_SANITY_PROJECT_ID` → `mq3wxr8n`
   - `PUBLIC_SANITY_DATASET` → `production`
7. Click **Save and deploy**. The first build takes 3–5 minutes.

Amplify will now auto-deploy every time you push to `main` on GitHub.

### 6.3 Custom Domain
1. In the Amplify Console → your app → **Domain management** → **Add domain**.
2. Enter your domain (e.g., `aitokenglobal.com`).
3. **If your domain is on Route 53 (AWS DNS):** Amplify connects it automatically.
4. **If your domain is elsewhere (GoDaddy, Namecheap, etc.):** Amplify will give you DNS records to add at your registrar — typically a `CNAME` for `www` and an `ALIAS`/`A` record for the apex domain.
5. Amplify provisions an SSL certificate automatically via AWS Certificate Manager — this can take 15–30 minutes after DNS is verified.
6. Once the domain shows **Available**, your site is live at `https://yourdomain.com`.

### 6.4 Automatic Rebuilds When Sanity Publishes
When you publish content in Sanity, the live site needs to rebuild to pull in the new content. This is wired up via an **Incoming Webhook** from Sanity to Amplify.

**On the Amplify side:**
1. Open your Amplify app → **App settings** → **Build settings**.
2. Scroll to **Incoming webhooks** and click **Create webhook**.
3. Name it something like `sanity-publish` and select the `main` branch.
4. Copy the generated webhook URL — you'll need it in the next step.

**On the Sanity side:**
1. Go to https://sanity.io/manage and open your project.
2. Click **API → Webhooks → Create webhook**.
3. Configure:
   - **Name:** `Amplify rebuild`
   - **URL:** paste the Amplify webhook URL from above
   - **Trigger on:** Create, Update, Delete
   - **Filter:** leave blank to rebuild on any content change, or set to specific document types (e.g., `_type in ["aiTrendsPage", "post"]`) for finer control
4. Save.

Now every time you publish in Sanity, the site rebuilds and goes live within ~3–5 minutes.

### 6.5 Verify the deployment
After your first deploy:
- Visit the `*.amplifyapp.com` URL Amplify gave you (the default domain shown on the app page).
- Confirm `/en/` and `/es/` both render correctly.
- Test the Sanity webhook: open Sanity Studio, edit any field on a published document, and republish. A new build should appear in the Amplify Console within ~30 seconds, and the change should be live within 5 minutes.

---

## Phase 7 — Animations & Dynamic Elements
*Status: Complete · animations carry over from the prototype design system; no separate work needed*

Already planned for this session. No architecture changes needed — static sites support full JS animations.

Recommended libraries (CDN-friendly, no build step required for prototype):
- **GSAP** — scroll-triggered animations, timeline sequences
- **AOS (Animate on Scroll)** — lightweight, easy to add to existing elements

These carry over to Astro with no changes.

---

## Phase 8 — SEO & Launch Prep
*Status: Split by 2026-05-08 audit · most basics moved to Pre-flight (Task #0); what remains here is post-deploy polish*

The 2026-05-08 audit found that most SEO foundation has to land **before** Task #5 replicates the singleton pattern across 11 pages — otherwise the same gap gets stamped 11 times. Those items moved to Pre-flight (Task #0) and are listed in `audits/IMPLEMENTATION_PLAN.md`. What's still in scope for this phase, after AWS Amplify deploy:

**Pre-flight items (now in Task #0, not here):**
- ~~Add `<meta>` description tags to every page~~ → moved to Task #0c (`BaseLayout.astro` consumes `seo` object)
- ~~Add Open Graph and Twitter Card tags~~ → moved to Task #0c
- ~~Add canonical and hreflang tags~~ → moved to Task #0c
- ~~Create a `sitemap.xml`~~ → moved to Task #0d (`@astrojs/sitemap` integration)
- ~~Create a `robots.txt`~~ → moved to Task #0d
- ~~Add `seo` fields to Sanity schemas~~ → moved to Task #0b (`seoTitle`, `seoDescription`, `ogImage`, `noindex`)

**Phase 8 items, post-deploy polish:**
- [ ] Verify all canonical / hreflang / OG / sitemap / robots work in production
- [ ] Replace hard-coded `https://aitokenglobal.com` in blog slug page with `Astro.site`
- [ ] Replace render-blocking Google Fonts `@import` with preconnect + `<link>`
- [ ] Migrate `<img>` tags to Astro `<Image>` (WebP, srcset, CLS prevention)
- [ ] Migrate Tailwind CDN to build-step Tailwind (production-appropriate)
- [ ] Run Lighthouse mobile preset post-deploy; capture LCP / CLS / INP baseline
- [ ] Add `Article` JSON-LD on blog post pages
- [ ] Add `FAQPage` JSON-LD on AI Trends + guide pages with FAQ
- [ ] Add `Organization` JSON-LD site-wide
- [ ] Add `BreadcrumbList` JSON-LD on deeper pages
- [ ] Set up Google Search Console and submit sitemap
- [ ] Verify AWS Amplify caching (enable **Performance mode** in App settings → General if you want stronger CDN-level cache control)
- [ ] Test on real mobile devices (Chrome DevTools emulation as fallback)
- [ ] Test page load speed via https://pagespeed.web.dev

---

## Cost Summary (at scale)

| Service | Free Tier | Paid (when needed) |
|---|---|---|
| GitHub | Free (public or private repos) | — |
| Astro | Free (open source) | — |
| Sanity | Free up to 3 users, 100k API calls/mo | ~$15/mo (Growth) |
| AWS Amplify | Free tier: 1,000 build min/mo, 15 GB stored, 100 GB served | ~$5–15/mo at typical traffic |
| Domain | ~$10–15/yr | — |
| **Total** | **~$10–15/yr** | **~$30–45/mo at scale** |

---

## Quick Reference — Key URLs

| Resource | URL |
|---|---|
| GitHub | https://github.com |
| Astro docs | https://docs.astro.build |
| Sanity | https://sanity.io |
| AWS Amplify docs | https://docs.aws.amazon.com/amplify/ |
| AWS Amplify Console | https://console.aws.amazon.com/amplify/ |
| Pagespeed test | https://pagespeed.web.dev |

---

*Last updated: 2026-05-08 (post-audit alignment)*
