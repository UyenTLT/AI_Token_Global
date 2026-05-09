import { defineType, defineField } from 'sanity';
import { STUDIO_LANGUAGES } from '../config/languages';

const portableText = { type: 'array', of: [{ type: 'block' }] } as const;

const modelRowFields = [
  defineField({ name: 'modelName',    title: 'Model Name',              type: 'string', validation: (Rule: any) => Rule.required() }),
  defineField({ name: 'description',  title: 'Best For / Use Case',     type: 'text',   rows: 2 }),
];

export const apiComparePageSchema = defineType({
  name: 'apiComparePage',
  title: 'API Compare Page',
  type: 'document',

  fields: [
    // ── Identity ──────────────────────────────────────────
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: { list: [...STUDIO_LANGUAGES], layout: 'radio' },
      validation: Rule => Rule.required(),
    }),

    // ── Hero ──────────────────────────────────────────────
    defineField({ name: 'heroHeadline', title: 'Hero Headline',  type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'heroSubtitle', title: 'Hero Subtitle',  type: 'text',   rows: 2 }),
    defineField({ name: 'heroNote',     title: 'Hero Note',      type: 'text',   rows: 2, description: "Small note below subtitle, e.g. 'Not sure? Read the beginner's guide first.'" }),

    // ── Type cards (Text / Image / Video) ─────────────────
    defineField({
      name: 'typeCards',
      title: 'Model Type Cards (Text / Image / Video)',
      type: 'array',
      validation: Rule => Rule.min(1).max(4),
      of: [{
        type: 'object',
        name: 'typeCard',
        fields: [
          defineField({ name: 'icon',        title: 'Icon key (text | image | video)', type: 'string', options: { list: ['text', 'image', 'video'] } }),
          defineField({ name: 'title',       title: 'Card Title',       type: 'string', validation: (Rule: any) => Rule.required() }),
          defineField({ name: 'subtitle',    title: 'Subtitle / Tags',  type: 'string', description: 'e.g. "Language · Code · Reasoning"' }),
          defineField({ name: 'description', title: 'Description',      type: 'text',   rows: 2 }),
          defineField({ name: 'ctaLabel',    title: 'CTA Link Label',   type: 'string', initialValue: 'View Models →' }),
          defineField({ name: 'anchorId',    title: 'Anchor ID',        type: 'string', description: 'e.g. text-models — links the card to the table section below', initialValue: 'text-models' }),
        ],
        preview: { select: { title: 'title', subtitle: 'icon' } },
      }],
    }),

    // ── Pricing callout ───────────────────────────────────
    defineField({ name: 'pricingCalloutTitle', title: 'Pricing Callout Title',       type: 'string' }),
    defineField({ name: 'pricingCalloutBody',  title: 'Pricing Callout Description', type: 'text', rows: 2 }),
    defineField({ name: 'pricingCalloutCta',   title: 'Pricing Callout CTA Label',   type: 'string', initialValue: 'View Live Pricing' }),

    // ── Text Models table ─────────────────────────────────
    defineField({ name: 'textModelsTitle',    title: 'Text Models Section Title',    type: 'string', initialValue: 'Text Models' }),
    defineField({ name: 'textModelsSubtitle', title: 'Text Models Subtitle',         type: 'text',   rows: 2 }),
    defineField({
      name: 'textModels',
      title: 'Text Models Rows',
      type: 'array',
      of: [{ type: 'object', name: 'textModelRow', fields: modelRowFields, preview: { select: { title: 'modelName', subtitle: 'description' } } }],
    }),

    // ── Image Models table ────────────────────────────────
    defineField({ name: 'imageModelsTitle',    title: 'Image Models Section Title',  type: 'string', initialValue: 'Image Models' }),
    defineField({ name: 'imageModelsSubtitle', title: 'Image Models Subtitle',       type: 'text',   rows: 2 }),
    defineField({
      name: 'imageModels',
      title: 'Image Models Rows',
      type: 'array',
      of: [{ type: 'object', name: 'imageModelRow', fields: modelRowFields, preview: { select: { title: 'modelName', subtitle: 'description' } } }],
    }),

    // ── Video Models table ────────────────────────────────
    defineField({ name: 'videoModelsTitle',    title: 'Video Models Section Title',  type: 'string', initialValue: 'Video Models' }),
    defineField({ name: 'videoModelsSubtitle', title: 'Video Models Subtitle',       type: 'text',   rows: 2 }),
    defineField({
      name: 'videoModels',
      title: 'Video Models Rows',
      type: 'array',
      of: [{ type: 'object', name: 'videoModelRow', fields: modelRowFields, preview: { select: { title: 'modelName', subtitle: 'description' } } }],
    }),

    // ── FAQ ───────────────────────────────────────────────
    defineField({ name: 'faqTitle', title: 'FAQ Section Heading', type: 'string', initialValue: 'Common Questions About Model Types' }),
    defineField({ name: 'faq', title: 'FAQ Items', type: 'array', of: [{ type: 'faqItem' }] }),

    // ── Bottom CTA ────────────────────────────────────────
    defineField({ name: 'ctaHeadline', title: 'Bottom CTA Headline', type: 'string' }),
    defineField({ name: 'ctaBody',     title: 'Bottom CTA Body',     type: 'text', rows: 2 }),

    // ── SEO ───────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'seoTitle',       title: 'SEO Title',              type: 'string', validation: (Rule: any) => Rule.max(60) }),
        defineField({ name: 'seoDescription', title: 'Meta Description',       type: 'text',   rows: 2, validation: (Rule: any) => Rule.max(160) }),
        defineField({ name: 'ogImage',        title: 'Open Graph Image',       type: 'image'  }),
        defineField({ name: 'noindex',        title: 'Hide from search engines', type: 'boolean', initialValue: false }),
      ],
    }),
  ],

  preview: {
    select: { lang: 'language', headline: 'heroHeadline' },
    prepare: ({ lang, headline }: { lang: string; headline: string }) => ({
      title: headline ?? 'API Compare Page',
      subtitle: lang?.toUpperCase(),
    }),
  },
});
