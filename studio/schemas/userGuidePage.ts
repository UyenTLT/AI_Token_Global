import { defineType, defineField } from 'sanity';
import { STUDIO_LANGUAGES } from '../config/languages';

const portableText = { type: 'array', of: [{ type: 'block' }] } as const;

export const userGuidePageSchema = defineType({
  name: 'userGuidePage',
  title: 'User Guide Page',
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
    defineField({ name: 'heroLabel',    title: 'Hero Label (pill)',   type: 'string', initialValue: 'Platform Manual' }),
    defineField({ name: 'heroHeadline', title: 'Hero Headline',       type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'heroSubtitle', title: 'Hero Subtitle',       type: 'text',   rows: 2 }),
    defineField({ name: 'heroSubtitle2', title: 'Hero Subtitle 2 (smaller, secondary line)', type: 'text', rows: 2 }),

    // ── What is AI Token King ─────────────────────────────
    defineField({ name: 'whatIsTitle', title: '"What Is AI Token King?" Heading', type: 'string', initialValue: 'What is AI Token King?' }),
    defineField({ name: 'whatIsBody',  title: '"What Is?" Body', ...portableText }),

    // ── Problems ─────────────────────────────────────────
    defineField({ name: 'problemsTitle', title: '"What Problems?" Heading', type: 'string', initialValue: 'What Problems Does It Solve?' }),
    defineField({ name: 'problemsBody',  title: '"What Problems?" Body', ...portableText }),

    // ── Core Features ────────────────────────────────────
    defineField({ name: 'featuresTitle', title: 'Core Features Heading', type: 'string', initialValue: 'Core Features' }),
    defineField({
      name: 'features',
      title: 'Feature Cards',
      type: 'array',
      of: [{
        type: 'object',
        name: 'feature',
        fields: [
          defineField({ name: 'title', title: 'Feature Title', type: 'string', validation: (Rule: any) => Rule.required() }),
          defineField({ name: 'body',  title: 'Feature Body',  type: 'array', of: [{ type: 'block' }] }),
        ],
        preview: { select: { title: 'title' } },
      }],
    }),

    // ── Supported Models ─────────────────────────────────
    defineField({ name: 'modelsTitle', title: 'Supported Models Heading', type: 'string', initialValue: 'Supported AI Models' }),
    defineField({
      name: 'models',
      title: 'Model Cards',
      type: 'array',
      of: [{
        type: 'object',
        name: 'model',
        fields: [
          defineField({ name: 'name',        title: 'Model Name',        type: 'string', validation: (Rule: any) => Rule.required() }),
          defineField({ name: 'description', title: 'Model Description', type: 'text',   rows: 2 }),
        ],
        preview: { select: { title: 'name', subtitle: 'description' } },
      }],
    }),

    // ── Use Cases ─────────────────────────────────────────
    defineField({ name: 'useCasesTitle', title: '"What Can You Use It For?" Heading', type: 'string', initialValue: 'What Can You Use It For?' }),
    defineField({ name: 'useCasesBody',  title: '"What Can You Use It For?" Body', ...portableText }),

    // ── Audience ─────────────────────────────────────────
    defineField({ name: 'audienceTitle', title: '"Who Is It For?" Heading', type: 'string', initialValue: 'Who Is It For?' }),
    defineField({
      name: 'audience',
      title: 'Audience Cards',
      type: 'array',
      of: [{
        type: 'object',
        name: 'audienceCard',
        fields: [
          defineField({ name: 'role', title: 'Audience Role', type: 'string', validation: (Rule: any) => Rule.required() }),
          defineField({ name: 'body', title: 'Description',   type: 'array', of: [{ type: 'block' }] }),
        ],
        preview: { select: { title: 'role' } },
      }],
    }),

    // ── OpenClaw ─────────────────────────────────────────
    defineField({ name: 'openclawTitle', title: '"What is OpenClaw?" Heading', type: 'string', initialValue: 'What is OpenClaw?' }),
    defineField({ name: 'openclawBody',  title: '"What is OpenClaw?" Body', ...portableText }),

    // ── Getting Started ───────────────────────────────────
    defineField({ name: 'gettingStartedTitle', title: '"How to Get Started" Heading', type: 'string', initialValue: 'How to Get Started' }),
    defineField({
      name: 'steps',
      title: 'Getting Started Steps',
      type: 'array',
      of: [{
        type: 'object',
        name: 'step',
        fields: [
          defineField({ name: 'title', title: 'Step Title', type: 'string', validation: (Rule: any) => Rule.required() }),
          defineField({ name: 'body',  title: 'Step Body',  type: 'array', of: [{ type: 'block' }] }),
        ],
        preview: { select: { title: 'title' } },
      }],
    }),

    // ── FAQ ───────────────────────────────────────────────
    defineField({ name: 'faqTitle', title: 'FAQ Section Title', type: 'string', initialValue: 'Common Questions' }),
    defineField({ name: 'faq', title: 'FAQ Items', type: 'array', of: [{ type: 'faqItem' }] }),

    // ── SEO ───────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'seoTitle',       title: 'SEO Title',        type: 'string', description: 'Max 60 chars.',  validation: (Rule: any) => Rule.max(60).warning('Over 60 chars — search engines may truncate the title') }),
        defineField({ name: 'seoDescription', title: 'Meta Description', type: 'text',   rows: 2, description: 'Max 160 chars.', validation: (Rule: any) => Rule.max(160).warning('Over 160 chars — search engines may truncate the description') }),
        defineField({ name: 'ogImage',        title: 'Open Graph Image', type: 'image',  description: '1200×630px recommended.' }),
        defineField({ name: 'noindex',        title: 'Hide from search engines', type: 'boolean', initialValue: false }),
      ],
    }),
  ],

  preview: {
    select: { lang: 'language', headline: 'heroHeadline' },
    prepare: ({ lang, headline }: { lang: string; headline: string }) => ({
      title: headline ?? 'User Guide',
      subtitle: lang?.toUpperCase(),
    }),
  },
});
