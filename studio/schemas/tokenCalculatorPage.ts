import { defineType, defineField } from 'sanity';
import { STUDIO_LANGUAGES } from '../config/languages';

export const tokenCalculatorPageSchema = defineType({
  name: 'tokenCalculatorPage',
  title: 'Token Calculator Page',
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
    defineField({ name: 'heroLabel',    title: 'Hero Label (pill)',   type: 'string', initialValue: 'Free Tool' }),
    defineField({ name: 'heroHeadline', title: 'Hero Headline',       type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'heroSubtitle', title: 'Hero Subtitle',       type: 'text',   rows: 2 }),

    // ── FAQ ───────────────────────────────────────────────
    defineField({ name: 'faqSectionLabel', title: 'FAQ Section Label (pill)',  type: 'string', initialValue: 'Common Questions' }),
    defineField({ name: 'faqTitle',        title: 'FAQ Section Title',         type: 'string', initialValue: 'About the Token Calculator' }),
    defineField({ name: 'faqIntro',        title: 'FAQ Intro Text',            type: 'text',   rows: 2 }),
    defineField({ name: 'faq',             title: 'FAQ Items', type: 'array', of: [{ type: 'faqItem' }] }),

    // ── CTA Banner ───────────────────────────────────────
    defineField({ name: 'ctaTitle', title: 'CTA Headline', type: 'string', initialValue: 'Want to compare model prices?' }),
    defineField({ name: 'ctaBody',  title: 'CTA Body',     type: 'text',   rows: 2 }),

    // ── SEO ───────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'seoTitle',       title: 'SEO Title',        type: 'string', description: 'Max 60 chars.',  validation: (Rule: any) => Rule.max(60) }),
        defineField({ name: 'seoDescription', title: 'Meta Description', type: 'text',   rows: 2, description: 'Max 160 chars.', validation: (Rule: any) => Rule.max(160) }),
        defineField({ name: 'ogImage',        title: 'Open Graph Image', type: 'image',  description: '1200×630px recommended.' }),
        defineField({ name: 'noindex',        title: 'Hide from search engines', type: 'boolean', initialValue: false }),
      ],
    }),
  ],

  preview: {
    select: { lang: 'language', headline: 'heroHeadline' },
    prepare: ({ lang, headline }: { lang: string; headline: string }) => ({
      title: headline ?? 'Token Calculator',
      subtitle: lang?.toUpperCase(),
    }),
  },
});
