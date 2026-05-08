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
  return createClient({ projectId, dataset, apiVersion: '2024-01-01', useCdn: true });
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

