import { defineType, defineField } from 'sanity';
import { STUDIO_LANGUAGES } from '../config/languages';

const portableText = { type: 'array', of: [{ type: 'block' }] } as const;

const HERO_ACCENTS = [
  { title: 'Purple (ChatGPT / OpenAI)',  value: 'purple' },
  { title: 'Teal (Claude / Anthropic)',  value: 'teal'   },
  { title: 'Blue (Gemini / Google)',     value: 'blue'   },
];

export const apiModelPageSchema = defineType({
  name: 'apiModelPage',
  title: 'API Model Page',
  type: 'document',

  fields: [
    // ── Identity ──────────────────────────────────────────
    defineField({
      name: 'modelSlug',
      title: 'Model',
      type: 'string',
      description: 'Matches the URL slug: chatgpt → /{lang}/chatgpt-api',
      options: {
        list: [
          { title: 'ChatGPT (chatgpt-api)', value: 'chatgpt' },
          { title: 'Claude (claude-api)',   value: 'claude'   },
          { title: 'Gemini (gemini-api)',   value: 'gemini'   },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: { list: [...STUDIO_LANGUAGES], layout: 'radio' },
      validation: Rule => Rule.required(),
    }),

    // ── Hero ──────────────────────────────────────────────
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      description: 'e.g. "ChatGPT API Guide"',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
      description: 'One sentence shown below the headline.',
    }),
    defineField({
      name: 'heroAccent',
      title: 'Hero Accent Color',
      type: 'string',
      options: { list: HERO_ACCENTS, layout: 'radio' },
      initialValue: 'purple',
      validation: Rule => Rule.required(),
    }),

    // ── Article sections ──────────────────────────────────
    defineField({
      name: 'overviewBody',
      title: 'Overview (intro paragraphs before first H2)',
      ...portableText,
    }),

    defineField({ name: 'whatIsTitle', title: '"What Is…?" Heading', type: 'string', initialValue: 'What Is the API?' }),
    defineField({ name: 'whatIsBody',  title: '"What Is…?" Body',    ...portableText }),

    defineField({ name: 'useCasesTitle', title: 'Use Cases Heading', type: 'string', initialValue: 'What Is It Commonly Used For?' }),
    defineField({ name: 'useCasesBody',  title: 'Use Cases Body',    ...portableText }),

    defineField({ name: 'pricingTitle', title: 'Pricing Heading', type: 'string', initialValue: 'How Does Pricing Work?' }),
    defineField({ name: 'pricingBody',  title: 'Pricing Body',    ...portableText }),
    defineField({
      name: 'pricingReference',
      title: 'Pricing Reference (bulleted tier list)',
      ...portableText,
      description: 'Use bullet list items for each pricing tier.',
    }),

    defineField({
      name: 'uniqueSectionTitle',
      title: 'Unique Section Heading',
      type: 'string',
      description: 'Differs per model: "Who Is It For?", "Claude API Is Not for Everyone", etc.',
    }),
    defineField({ name: 'uniqueSectionBody', title: 'Unique Section Body', ...portableText }),

    defineField({ name: 'comparingTitle', title: 'Comparing Section Heading', type: 'string', initialValue: 'When Comparing, What Should You Look At?' }),
    defineField({ name: 'comparingBody',  title: 'Comparing Section Body',    ...portableText }),

    defineField({
      name: 'furtherReadingTitle',
      title: 'Further Reading Heading',
      type: 'string',
      initialValue: 'Further Reading',
    }),
    defineField({
      name: 'furtherReading',
      title: 'Further Reading Links',
      type: 'array',
      of: [{
        type: 'object',
        name: 'readingLink',
        fields: [
          defineField({ name: 'label', title: 'Link Label', type: 'string', validation: (Rule: any) => Rule.required() }),
          defineField({ name: 'url',   title: 'URL (relative or absolute)', type: 'string' }),
        ],
        preview: { select: { title: 'label', subtitle: 'url' } },
      }],
    }),

    defineField({
      name: 'faqTitle',
      title: 'FAQ Section Heading',
      type: 'string',
      initialValue: 'Common Questions',
    }),
    defineField({
      name: 'faq',
      title: 'FAQ Items',
      type: 'array',
      of: [{ type: 'faqItem' }],
    }),

    // ── SEO ───────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string', description: 'Overrides hero headline. Max 60 chars.', validation: (Rule: any) => Rule.max(60).warning('Over 60 chars — search engines may truncate the title') }),
        defineField({ name: 'seoDescription', title: 'Meta Description', type: 'text', rows: 2, description: 'Max 160 chars.', validation: (Rule: any) => Rule.max(160).warning('Over 160 chars — search engines may truncate the description') }),
        defineField({ name: 'ogImage', title: 'Open Graph Image', type: 'image', description: '1200×630px recommended.' }),
        defineField({ name: 'noindex', title: 'Hide from search engines', type: 'boolean', initialValue: false }),
      ],
    }),
  ],

  preview: {
    select: { model: 'modelSlug', lang: 'language', headline: 'heroHeadline' },
    prepare: ({ model, lang, headline }: { model: string; lang: string; headline: string }) => ({
      title: headline ?? `${model} API Page`,
      subtitle: `${model?.toUpperCase()} · ${lang?.toUpperCase()}`,
    }),
  },
});
