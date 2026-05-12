import { defineType, defineField } from 'sanity';
import { STUDIO_LANGUAGES } from '../config/languages';

const portableText = { type: 'array', of: [{ type: 'block' }] } as const;

export const beginnersGuidePageSchema = defineType({
  name: 'beginnersGuidePage',
  title: 'Beginners Guide Page',
  type: 'document',

  fields: [
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: { list: [...STUDIO_LANGUAGES], layout: 'radio' },
      validation: Rule => Rule.required(),
    }),

    // ── Hero ─────────────────────────────────────────────
    defineField({ name: 'heroLabel',    title: 'Hero Label (pill)',   type: 'string', initialValue: 'Getting Started' }),
    defineField({ name: 'heroHeadline', title: 'Hero Headline',       type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'heroSubtitle', title: 'Hero Subtitle',       type: 'text',   rows: 2 }),

    // ── Reading Steps section ─────────────────────────────
    defineField({ name: 'stepsTitle',     title: 'Reading Steps Section Title', type: 'string', initialValue: 'If You\'re New, Read in This Order' }),
    defineField({ name: 'stepsIntroBody', title: 'Reading Steps Intro',         ...portableText }),
    defineField({
      name: 'readingSteps',
      title: 'Reading Steps (3 ordered steps)',
      type: 'array',
      of: [{
        type: 'object',
        name: 'readingStep',
        fields: [
          defineField({ name: 'stepLabel', title: 'Step Label (e.g. "Step 1 · Start Here")', type: 'string', validation: (Rule: any) => Rule.required() }),
          defineField({ name: 'title',     title: 'Step Title', type: 'string', validation: (Rule: any) => Rule.required() }),
          defineField({ name: 'body',      title: 'Step Body',  type: 'array', of: [{ type: 'block' }] }),
          defineField({ name: 'linkLabel', title: 'Link Label (e.g. "Read: What is an AI Token →")', type: 'string' }),
          defineField({ name: 'linkUrl',   title: 'Link URL (relative path)',  type: 'string' }),
        ],
        preview: { select: { title: 'title', subtitle: 'stepLabel' } },
      }],
    }),

    // ── Where Beginners Get Stuck ─────────────────────────
    defineField({ name: 'stuckTitle', title: '"Where Beginners Get Stuck" Title', type: 'string', initialValue: 'Where Most Beginners Get Stuck' }),
    defineField({ name: 'stuckBody',  title: 'Stuck Section Body', ...portableText }),
    defineField({
      name: 'stuckCallouts',
      title: 'Stuck Section Callouts (3 colored cards)',
      type: 'array',
      of: [{
        type: 'object',
        name: 'stuckCallout',
        fields: [
          defineField({ name: 'title', title: 'Callout Title', type: 'string', validation: (Rule: any) => Rule.required() }),
          defineField({ name: 'body',  title: 'Callout Body',  type: 'array', of: [{ type: 'block' }] }),
        ],
        preview: { select: { title: 'title' } },
      }],
    }),

    // ── FAQ ───────────────────────────────────────────────
    defineField({ name: 'faqTitle', title: 'FAQ Section Title', type: 'string', initialValue: 'Common Questions from Beginners' }),
    defineField({ name: 'faq', title: 'FAQ Items', type: 'array', of: [{ type: 'faqItem' }] }),

    // ── Recommended Next Reads ────────────────────────────
    defineField({ name: 'nextReadsTitle',     title: 'Next Reads Section Title', type: 'string', initialValue: 'Recommended Next Reads' }),
    defineField({ name: 'nextReadsIntroBody', title: 'Next Reads Intro',          ...portableText }),
    defineField({
      name: 'nextReads',
      title: 'Recommended Articles',
      type: 'array',
      of: [{
        type: 'object',
        name: 'nextRead',
        fields: [
          defineField({ name: 'title',   title: 'Article Title',   type: 'string', validation: (Rule: any) => Rule.required() }),
          defineField({ name: 'excerpt', title: 'Article Excerpt', type: 'string' }),
          defineField({ name: 'url',     title: 'URL (relative)',   type: 'string' }),
        ],
        preview: { select: { title: 'title', subtitle: 'excerpt' } },
      }],
    }),

    // ── Closing CTA ───────────────────────────────────────
    defineField({ name: 'ctaTitle', title: 'CTA Title', type: 'string', initialValue: 'Get the foundation right — the rest follows' }),
    defineField({ name: 'ctaBody',  title: 'CTA Body',  type: 'text',   rows: 3 }),

    // ── SEO ───────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'seoTitle',       title: 'SEO Title',         type: 'string', description: 'Max 60 chars.',  validation: (Rule: any) => Rule.max(60) }),
        defineField({ name: 'seoDescription', title: 'Meta Description',  type: 'text',   rows: 2, description: 'Max 160 chars.', validation: (Rule: any) => Rule.max(160) }),
        defineField({ name: 'ogImage',        title: 'Open Graph Image',  type: 'image',  description: '1200×630px recommended.' }),
        defineField({ name: 'noindex',        title: 'Hide from search engines', type: 'boolean', initialValue: false }),
      ],
    }),
  ],

  preview: {
    select: { lang: 'language', headline: 'heroHeadline' },
    prepare: ({ lang, headline }: { lang: string; headline: string }) => ({
      title: headline ?? 'Beginners Guide',
      subtitle: lang?.toUpperCase(),
    }),
  },
});
