import { createClient } from '@sanity/client';

export interface SeoData {
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: { asset: { url: string } };
  noindex?: boolean;
}

export interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt: string;
  articleNumber?: number;
  language: string;
  coverImage?: { asset: { url: string } };
  tags?: string[];
  body: any[];
}

export type PortableTextBlock = any[];

export interface TrendCard {
  _key: string;
  tag: string;
  title: string;
  body: PortableTextBlock;
  pullQuote?: string;
  accentColor: string;
}

export interface AudienceCard {
  _key: string;
  audience: string;
  body: PortableTextBlock;
}

export interface FaqItem {
  _key: string;
  question: string;
  answer: PortableTextBlock;
}

export interface AiTrendsPageData {
  seo?: SeoData;
  heroHeadline: string;
  heroSubtitle: string;
  heroSubtitle2: PortableTextBlock;
  introTitle: string;
  introParagraphs: PortableTextBlock;
  summaryTitle: string;
  summaryPoints: string[];
  trendsSectionLabel: string;
  trendsSectionTitle: string;
  trendCards: TrendCard[];
  audienceSectionTitle: string;
  audienceIntro: PortableTextBlock;
  audienceCards: AudienceCard[];
  sourcesTitle: string;
  sourcesNote: string;
  faq: FaqItem[];
}

function getClient() {
  const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
  const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? 'production';
  if (!projectId) return null;
  return createClient({ projectId, dataset, apiVersion: '2024-01-01', useCdn: false });
}

export async function getAllPosts(lang: string): Promise<SanityPost[]> {
  const client = getClient();
  if (!client) return [];
  return client.fetch(
    `*[_type == "post" && language == $lang] | order(articleNumber asc) {
      _id, title, slug, publishedAt, excerpt, tags, articleNumber, language,
      coverImage { asset -> { url } }
    }`,
    { lang }
  );
}

export async function getPostBySlug(slug: string, lang: string): Promise<SanityPost | null> {
  const client = getClient();
  if (!client) return null;
  return client.fetch(
    `*[_type == "post" && slug.current == $slug && language == $lang][0] {
      _id, title, slug, publishedAt, excerpt, tags, articleNumber, language, body,
      coverImage { asset -> { url } }
    }`,
    { slug, lang }
  );
}

export async function getAllPostSlugs(): Promise<{ slug: string; lang: string }[]> {
  const client = getClient();
  if (!client) return [];
  const posts = await client.fetch(
    `*[_type == "post"] { "slug": slug.current, language }`
  );
  return posts.map((p: any) => ({ slug: p.slug, lang: p.language ?? 'en' }));
}

export async function getAiTrendsPage(lang: string): Promise<AiTrendsPageData | null> {
  const client = getClient();
  if (!client) return null;
  return client.fetch(
    `*[_type == "aiTrendsPage" && language == $lang][0] {
      seo { seoTitle, seoDescription, ogImage { asset -> { url } }, noindex },
      heroHeadline, heroSubtitle, heroSubtitle2,
      introTitle, introParagraphs,
      summaryTitle, summaryPoints,
      trendsSectionLabel, trendsSectionTitle,
      trendCards[] { _key, tag, title, body, pullQuote, accentColor },
      audienceSectionTitle, audienceIntro,
      audienceCards[] { _key, audience, body },
      sourcesTitle, sourcesNote,
      faq[] { _key, question, answer }
    }`,
    { lang }
  );
}

// ── API Model Page (chatgpt / claude / gemini) ────────────────────────────

export interface ReadingLink {
  _key: string;
  label: string;
  url: string;
}

export interface ApiModelPageData {
  seo?: SeoData;
  modelSlug: string;
  heroHeadline: string;
  heroSubtitle?: string;
  heroAccent: 'purple' | 'teal' | 'blue';
  overviewBody?: PortableTextBlock;
  whatIsTitle?: string;
  whatIsBody?: PortableTextBlock;
  useCasesTitle?: string;
  useCasesBody?: PortableTextBlock;
  pricingTitle?: string;
  pricingBody?: PortableTextBlock;
  pricingReference?: PortableTextBlock;
  uniqueSectionTitle?: string;
  uniqueSectionBody?: PortableTextBlock;
  comparingTitle?: string;
  comparingBody?: PortableTextBlock;
  furtherReadingTitle?: string;
  furtherReading?: ReadingLink[];
  faqTitle?: string;
  faq?: FaqItem[];
}

export async function getApiModelPage(modelSlug: string, lang: string): Promise<ApiModelPageData | null> {
  const client = getClient();
  if (!client) return null;
  return client.fetch(
    `*[_type == "apiModelPage" && modelSlug == $modelSlug && language == $lang][0] {
      seo { seoTitle, seoDescription, ogImage { asset -> { url } }, noindex },
      modelSlug, heroHeadline, heroSubtitle, heroAccent,
      overviewBody, whatIsTitle, whatIsBody,
      useCasesTitle, useCasesBody,
      pricingTitle, pricingBody, pricingReference,
      uniqueSectionTitle, uniqueSectionBody,
      comparingTitle, comparingBody,
      furtherReadingTitle,
      furtherReading[] { _key, label, url },
      faqTitle,
      faq[] { _key, question, answer }
    }`,
    { modelSlug, lang }
  );
}

// ── API Compare Page ──────────────────────────────────────────────────────

export interface TypeCard {
  _key: string;
  icon: 'text' | 'image' | 'video';
  title: string;
  subtitle?: string;
  description?: string;
  ctaLabel?: string;
  anchorId?: string;
}

export interface ModelRow {
  _key: string;
  modelName: string;
  description?: string;
}

export interface ApiComparePageData {
  seo?: SeoData;
  heroHeadline: string;
  heroSubtitle?: string;
  heroNote?: string;
  typeCards?: TypeCard[];
  pricingCalloutTitle?: string;
  pricingCalloutBody?: string;
  pricingCalloutCta?: string;
  textModelsTitle?: string;
  textModelsSubtitle?: string;
  textModels?: ModelRow[];
  imageModelsTitle?: string;
  imageModelsSubtitle?: string;
  imageModels?: ModelRow[];
  videoModelsTitle?: string;
  videoModelsSubtitle?: string;
  videoModels?: ModelRow[];
  faqTitle?: string;
  faq?: FaqItem[];
  ctaHeadline?: string;
  ctaBody?: string;
}

export async function getApiComparePage(lang: string): Promise<ApiComparePageData | null> {
  const client = getClient();
  if (!client) return null;
  return client.fetch(
    `*[_type == "apiComparePage" && language == $lang][0] {
      seo { seoTitle, seoDescription, ogImage { asset -> { url } }, noindex },
      heroHeadline, heroSubtitle, heroNote,
      typeCards[] { _key, icon, title, subtitle, description, ctaLabel, anchorId },
      pricingCalloutTitle, pricingCalloutBody, pricingCalloutCta,
      textModelsTitle, textModelsSubtitle,
      textModels[] { _key, modelName, description },
      imageModelsTitle, imageModelsSubtitle,
      imageModels[] { _key, modelName, description },
      videoModelsTitle, videoModelsSubtitle,
      videoModels[] { _key, modelName, description },
      faqTitle,
      faq[] { _key, question, answer },
      ctaHeadline, ctaBody
    }`,
    { lang }
  );
}

