# Claude Code Prompt — Task #5 Batch B: Schemas + Astro Templates

## Context

You are working on AI Token Global, a multilingual Astro + Sanity CMS site hosted on AWS Amplify at https://aitoken.global. The repo root is the Astro project. Sanity Studio lives in `studio/`. All pages render under the dynamic `[lang]` route (`/en/*` and `/es/*`).

Before doing anything else, read these files to orient yourself:
- `src/pages/[lang]/chatgpt-api.astro` — the established Astro page pattern for Batch A
- `src/components/ApiModelPage.astro` — the shared Astro component used by chatgpt/claude/gemini pages
- `studio/schemas/apiModelPage.ts` — the established Sanity schema pattern (fields map 1:1 to article sections, `seo` object, `language` field, `faqItem` reference type)
- `studio/schemas/faqItem.ts` — the reusable FAQ object type
- `studio/sanity.config.ts` — to see how schemas are registered
- `src/lib/sanity.ts` — to see GROQ fetchers and TypeScript interfaces
- `src/layouts/BaseLayout.astro` — to see how SEO fields are consumed
- `src/styles/global.css` — design system (CSS variables, component classes, breakpoints)

Also read the archive HTML for all five Batch B pages to understand content structure before designing schemas:
- `archive/beginners-guide.html`
- `archive/user-guide.html`
- `archive/use-cases.html`
- `archive/token-calculator.html`
- `archive/compliance.html`

---

## Task

Build the **Sanity schema + Astro page template** for each of the five Batch B pages. Do them one at a time in this order:

1. `beginners-guide`
2. `user-guide`
3. `use-cases`
4. `token-calculator`
5. `compliance`

For each page, deliver:
1. `studio/schemas/{pageName}.ts` — Sanity schema
2. `src/pages/[lang]/{page-slug}.astro` — Astro page (no shared component needed; inline the layout since each page is structurally unique)
3. Update `src/lib/sanity.ts` — add the GROQ query function and TypeScript interface
4. Update `studio/sanity.config.ts` — register the new schema type

---

## Mandatory Patterns — Follow Exactly

### Sanity Schema Pattern

Every schema must include, without exception:

```typescript
// Language field
defineField({
  name: 'language',
  title: 'Language',
  type: 'string',
  options: { list: [...STUDIO_LANGUAGES], layout: 'radio' },
  validation: Rule => Rule.required(),
}),

// SEO object (at the end of every schema)
defineField({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({ name: 'seoTitle',       title: 'SEO Title',       type: 'string', description: 'Max 60 chars.', validation: (Rule: any) => Rule.max(60) }),
    defineField({ name: 'seoDescription', title: 'Meta Description', type: 'text', rows: 2, description: 'Max 160 chars.', validation: (Rule: any) => Rule.max(160) }),
    defineField({ name: 'ogImage',        title: 'Open Graph Image', type: 'image', description: '1200×630px recommended.' }),
    defineField({ name: 'noindex',        title: 'Hide from search engines', type: 'boolean', initialValue: false }),
  ],
}),
```

Field naming convention: `{sectionId}Title` (string) + `{sectionId}Body` (portableText array) for each article section. Use `faqItem` reference type for FAQ arrays.

Each schema should be a **singleton per language** — not one document for all languages. The `language` + a slug-like identifier together uniquely identify the document (see how `apiModelPage` uses `modelSlug` + `language`).

Portable Text field pattern:
```typescript
const portableText = { type: 'array', of: [{ type: 'block' }] } as const;
// Usage:
defineField({ name: 'introBody', title: 'Intro Body', ...portableText }),
```

### Astro Page Pattern

```astro
---
import { getStaticPaths } from '../../...'; // Not needed — [lang] handles routing
import BaseLayout from '../../layouts/BaseLayout.astro';
import { SUPPORTED_LANGS, isValidLang, useTranslations } from '../../i18n/index';
import { getXxxPage } from '../../lib/sanity';   // your new fetcher

export async function getStaticPaths() {
  return SUPPORTED_LANGS.map(lang => ({ params: { lang } }));
}

const { lang } = Astro.params;
if (!isValidLang(lang)) return Astro.redirect('/en/');

const page = await getXxxPage(lang);
if (!page) return Astro.redirect(`/${lang}/`);   // ← NULL GUARD, required on every page

const t = useTranslations(lang);
---
<BaseLayout
  title={page.seo?.seoTitle || page.heroHeadline}
  description={page.seo?.seoDescription || ''}
  noindex={page.seo?.noindex ?? false}
  lang={lang}
>
  <!-- page content here -->
</BaseLayout>
```

Null guard `if (!page) return Astro.redirect(\`/${lang}/\`)` is **mandatory** on every page — without it the page will throw a build error when content is missing in Sanity.

### GROQ Fetcher Pattern

```typescript
// In src/lib/sanity.ts — add after existing fetchers:

export interface XxxPage {
  _id: string;
  language: string;
  heroHeadline: string;
  // ... all fields matching the schema
  seo?: {
    seoTitle?: string;
    seoDescription?: string;
    noindex?: boolean;
  };
}

export async function getXxxPage(lang: string): Promise<XxxPage | null> {
  return client.fetch(
    `*[_type == "xxxPage" && language == $lang][0]`,
    { lang }
  );
}
```

### Responsive / Animation Rules (from CLAUDE.md)

- Use `global.css` CSS variables and component classes — do NOT add new inline Tailwind color values that conflict with the design system
- Breakpoints: `1024px` desktop nav, `900px` grid collapse, `640px` single column
- Only animate `transform` and `opacity` — never `transition-all`, `transition: width`, `transition: max-height`
- FAQ accordion: use `.faq-answer` / `.faq-answer.open` classes + `window.toggleFaq()` already defined in `global.css`/`Nav.astro`
- Every clickable element needs hover, focus-visible, and active states
- Check `global.css` for existing utility classes before writing new styles

---

## Per-Page Schema Design Notes

Read each archive HTML file and design the schema to match the actual content structure you find. Below are high-level hints — **the archive HTML is authoritative**. If you see content that doesn't fit these hints, follow the HTML.

### beginners-guide
Article-style guide page. Expect sections covering: what an AI token is, how tokens are counted, why token count matters for cost, how to estimate token usage. Likely has a FAQ section at the bottom. Schema pattern: named body fields per section + `faqItem` array.

### user-guide
Product guide for the AI Token King platform specifically. Expect sections on how to use the site's features (pricing lookup, model comparison, token calculator). Schema pattern: named body fields per section. May have a step-by-step structure — represent ordered steps as an array of `{stepNumber, title, body}` objects if the HTML shows numbered steps.

### use-cases
Landing page for AI use case categories. Likely has a hero + multiple use case cards or sections (customer service, content generation, code assistance, etc.). Schema pattern: hero fields + array of use case items `{title, description, body}`.

### token-calculator
Hybrid page: static explanatory content + a client-side calculator widget. The calculator logic itself (JS) will be inline in the Astro page, **not** in Sanity. Schema covers only the text content: hero, intro body, any explanatory sections. The calculator UI and JS are hardcoded in the Astro template — **do not try to put the calculator logic into Sanity**.

### compliance
Business/legal-oriented page. Expect sections on: why AI compliance matters, what companies need to know, specific compliance topics (data privacy, usage policies, etc.). Likely has a FAQ. Schema pattern: named body fields per section + `faqItem` array.

---

## Quality Bar

- `npm run build` must pass after all five pages are added. Run it and fix any TypeScript errors before declaring done.
- No hardcoded EN strings in Astro files — any UI text not from Sanity must come from `src/i18n/en.json` via `useTranslations(lang)`. Add new keys to both `en.json` and `es.json` (use `"TODO: translate"` as a placeholder in `es.json` if needed).
- The dev server (`npm run dev` → `http://localhost:4321`) should render all five pages without errors when Sanity content is absent (null-guard redirects) and when content is present.
- After building schemas, run `cd studio && npx sanity schema extract` to verify no TypeScript errors in the studio project.

---

## Deliverables Checklist

For each of the five pages:
- [ ] `studio/schemas/{name}.ts` created
- [ ] Schema registered in `studio/sanity.config.ts`
- [ ] GROQ fetcher + TS interface added to `src/lib/sanity.ts`
- [ ] `src/pages/[lang]/{slug}.astro` created with null guard
- [ ] `npm run build` passes

Do not create import scripts — those will be handled separately.
Do not add ES content — schemas and templates only (EN rendering path).
Do not build the homepage — that is Batch C, handled separately.
