import { defineType } from 'sanity';

// Machine-written SEO snapshot, one singleton document per data source
// (seoInsights-gsc / seoInsights-ga4 / seoInsights-cloudflare). Refreshed on
// every pipeline run by studio/scripts/upload-seo-insights.mjs, which reads the
// newest JSON snapshot under studio/seo-data/ and createOrReplaces these docs.
//
// Purpose: give pipeline agents the SEO numbers as queryable Sanity documents
// (read `summary` for a recap, or `metrics` / `topItems` for structured values)
// instead of having to parse the raw snapshot files. Editors should not hand-edit
// these — they're overwritten on each run, hence readOnly.
export const seoInsightsSchema = defineType({
  name: 'seoInsights',
  type: 'document',
  title: 'SEO Insights',
  readOnly: true,
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    {
      name: 'source',
      title: 'Data source',
      type: 'string',
      options: {
        list: [
          { title: 'Google Search Console', value: 'gsc' },
          { title: 'Google Analytics 4', value: 'ga4' },
          { title: 'Cloudflare Web Analytics', value: 'cloudflare' },
        ],
      },
    },
    { name: 'siteUrl', title: 'Site', type: 'string' },
    { name: 'snapshotDate', title: 'Snapshot date', type: 'date' },
    { name: 'rangeDays', title: 'Window (days)', type: 'number' },
    { name: 'updatedAt', title: 'Updated at', type: 'datetime' },
    {
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 6,
      description: 'Human/agent-readable recap of the headline numbers for this window.',
    },
    {
      name: 'metrics',
      title: 'Headline metrics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'value', title: 'Value', type: 'string' },
            { name: 'change', title: 'Change vs prior window', type: 'string' },
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        },
      ],
    },
    {
      name: 'topItems',
      title: 'Top items',
      type: 'array',
      description: 'Top pages / queries for the window, highest first.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'value', title: 'Value', type: 'string' },
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        },
      ],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'snapshotDate' },
  },
});
