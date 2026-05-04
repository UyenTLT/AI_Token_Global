import { createClient } from '@sanity/client';

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
