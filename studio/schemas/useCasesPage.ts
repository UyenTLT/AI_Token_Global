import { defineType, defineField } from 'sanity';
import { STUDIO_LANGUAGES } from '../config/languages';

const portableText = { type: 'array', of: [{ type: 'block' }] } as const;

export const useCasesPageSchema = defineType({
  name: 'useCasesPage',
  title: 'Use Cases Page',
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
    defineField({ name: 'heroLabel',    title: 'Hero Label (pill)',   type: 'string', initialValue: 'Use Cases' }),
    defineField({ name: 'heroHeadline', title: 'Hero Headline',       type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'heroSubtitle', title: 'Hero Subtitle',       type: 'text',   rows: 2 }),

    // ── Use Case Cards ────────────────────────────────────
    defineField({
      name: 'useCases',
      title: 'Use Case Cards (up to 9)',
      type: 'array',
      of: [{
        type: 'object',
        name: 'useCase',
        fields: [
          defineField({ name: 'title',            title: 'Use Case Title',       type: 'string', validation: (Rule: any) => Rule.required() }),
          defineField({ name: 'description',      title: 'Description',          type: 'text',   rows: 3 }),
          defineField({ name: 'commonDirections', title: 'Common Directions (e.g. "Long-context comprehension · Stable summarization")', type: 'string' }),
        ],
        preview: { select: { title: 'title', subtitle: 'description' } },
      }],
    }),

    // ── Footer Note ───────────────────────────────────────
    defineField({ name: 'footerNoteBody', title: 'Footer Note Body', ...portableText }),

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
      title: headline ?? 'Use Cases',
      subtitle: lang?.toUpperCase(),
    }),
  },
});
