import { defineType, defineField } from 'sanity';
import { STUDIO_LANGUAGES } from '../config/languages';

const portableText = { type: 'array', of: [{ type: 'block' }] } as const;

export const compliancePageSchema = defineType({
  name: 'compliancePage',
  title: 'Compliance Page',
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
    defineField({ name: 'heroLabel',    title: 'Hero Label (pill)',   type: 'string', initialValue: 'Enterprise Solution' }),
    defineField({ name: 'heroHeadline', title: 'Hero Headline',       type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'heroSubtitle', title: 'Hero Subtitle',       type: 'text',   rows: 3 }),

    // ── Blockers Section ─────────────────────────────────
    defineField({ name: 'blockersTitle',     title: '"Where Enterprises Get Stuck" Title', type: 'string', initialValue: 'Where Enterprises Get Stuck with AI' }),
    defineField({ name: 'blockersIntroBody', title: 'Blockers Intro',                      ...portableText }),
    defineField({
      name: 'blockerItems',
      title: 'Blocker Bullet Items',
      type: 'array',
      of: [{
        type: 'object',
        name: 'blockerItem',
        fields: [
          defineField({ name: 'text', title: 'Item Text', type: 'string', validation: (Rule: any) => Rule.required() }),
        ],
        preview: { select: { title: 'text' } },
      }],
    }),

    // ── Enterprise Proposal CTA ───────────────────────────
    defineField({ name: 'proposalTitle',    title: 'Proposal CTA Title',    type: 'string', initialValue: 'View the Full Enterprise AI Compliance Proposal' }),
    defineField({ name: 'proposalBody',     title: 'Proposal CTA Body',     type: 'text',   rows: 3 }),
    defineField({ name: 'proposalCtaLabel', title: 'Proposal CTA Button Label', type: 'string', initialValue: 'View Enterprise AI Compliance Proposal' }),
    defineField({ name: 'proposalCtaUrl',   title: 'Proposal CTA Button URL',   type: 'string' }),

    // ── Solution Section ──────────────────────────────────
    defineField({ name: 'solutionTitle', title: '"What the Solution Covers" Title', type: 'string', initialValue: 'What the Solution Covers' }),
    defineField({
      name: 'solutions',
      title: 'Solution Cards (up to 5)',
      type: 'array',
      of: [{
        type: 'object',
        name: 'solution',
        fields: [
          defineField({ name: 'title', title: 'Solution Title', type: 'string', validation: (Rule: any) => Rule.required() }),
          defineField({ name: 'body',  title: 'Solution Body',  type: 'array', of: [{ type: 'block' }] }),
        ],
        preview: { select: { title: 'title' } },
      }],
    }),

    // ── Audience Section ──────────────────────────────────
    defineField({ name: 'audienceTitle', title: '"Who Is This For?" Title', type: 'string', initialValue: 'Who Is This For?' }),
    defineField({
      name: 'audienceItems',
      title: 'Audience Cards (up to 4)',
      type: 'array',
      of: [{
        type: 'object',
        name: 'audienceItem',
        fields: [
          defineField({ name: 'role',        title: 'Audience Role',        type: 'string', validation: (Rule: any) => Rule.required() }),
          defineField({ name: 'description', title: 'Audience Description', type: 'text',   rows: 2 }),
        ],
        preview: { select: { title: 'role', subtitle: 'description' } },
      }],
    }),
    defineField({ name: 'audienceFootnote', title: 'Audience Footnote (highlighted box)', ...portableText }),

    // ── Role Section ──────────────────────────────────────
    defineField({ name: 'roleTitle', title: '"AI Token King\'s Role" Title', type: 'string', initialValue: 'AI Token King\'s Role' }),
    defineField({
      name: 'roles',
      title: 'Role Cards (up to 3)',
      type: 'array',
      of: [{
        type: 'object',
        name: 'role',
        fields: [
          defineField({ name: 'title', title: 'Role Title', type: 'string', validation: (Rule: any) => Rule.required() }),
          defineField({ name: 'body',  title: 'Role Body',  type: 'array', of: [{ type: 'block' }] }),
        ],
        preview: { select: { title: 'title' } },
      }],
    }),

    // ── FAQ ───────────────────────────────────────────────
    defineField({ name: 'faqTitle', title: 'FAQ Section Title', type: 'string', initialValue: 'Common Questions' }),
    defineField({ name: 'faq', title: 'FAQ Items', type: 'array', of: [{ type: 'faqItem' }] }),

    // ── Sidebar CTA ───────────────────────────────────────
    defineField({ name: 'sidebarCtaTitle', title: 'Sidebar CTA Title',        type: 'string', initialValue: 'Enterprise Inquiry' }),
    defineField({ name: 'sidebarCtaBody',  title: 'Sidebar CTA Body',         type: 'text',   rows: 2 }),
    defineField({ name: 'sidebarCtaLabel', title: 'Sidebar CTA Button Label', type: 'string', initialValue: 'Contact Enterprise Sales' }),
    defineField({ name: 'sidebarCtaUrl',   title: 'Sidebar CTA Button URL',   type: 'string' }),

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
      title: headline ?? 'Compliance',
      subtitle: lang?.toUpperCase(),
    }),
  },
});
