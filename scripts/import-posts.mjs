/**
 * import-posts.mjs
 *
 * Converts a JSON file of blog posts into a Sanity-ready ndjson file.
 *
 * Usage:
 *   node scripts/import-posts.mjs scripts/data/posts-batch-1.json
 *
 * Then import to Sanity:
 *   cd studio && npx sanity dataset import ../scripts/data/posts-batch-1.ndjson production --replace
 *
 * Input JSON shape (array of posts):
 * [
 *   {
 *     "articleNumber": 1,
 *     "title": "What Is an AI Token?",
 *     "excerpt": "A short summary under 300 characters.",
 *     "publishedAt": "2026-04-15",
 *     "category": "fundamentals",
 *     "tags": ["AI Fundamentals", "Beginner"],
 *     "body": [
 *       { "type": "h2", "text": "Section heading" },
 *       { "type": "p",  "text": "A paragraph of body text." },
 *       { "type": "h3", "text": "Sub-heading" },
 *       { "type": "ul", "items": ["First point", "Second point"] },
 *       { "type": "ol", "items": ["Step one", "Step two"] },
 *       { "type": "blockquote", "text": "A pull quote." }
 *     ]
 *   }
 * ]
 *
 * Notes:
 * - "slug" is auto-derived from the title (lowercase, hyphens, max 96 chars)
 * - "language" is always "en" — run translate-page.mjs separately for ES
 * - "coverImage" is intentionally omitted — add images via patch-post-images.mjs
 * - Each post gets a stable _id: "post-en-{articleNumber}"
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── helpers ──────────────────────────────────────────────────────────────────

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 96);
}

function makeKey() {
  return Math.random().toString(36).slice(2, 10);
}

// Convert a simple body block (from the input JSON) into a Sanity Portable Text block.
function toPortableTextBlock(block) {
  // Heading 2
  if (block.type === 'h2') {
    return {
      _type: 'block',
      _key: makeKey(),
      style: 'h2',
      children: [{ _type: 'span', _key: makeKey(), text: block.text, marks: [] }],
      markDefs: [],
    };
  }

  // Heading 3
  if (block.type === 'h3') {
    return {
      _type: 'block',
      _key: makeKey(),
      style: 'h3',
      children: [{ _type: 'span', _key: makeKey(), text: block.text, marks: [] }],
      markDefs: [],
    };
  }

  // Blockquote
  if (block.type === 'blockquote') {
    return {
      _type: 'block',
      _key: makeKey(),
      style: 'blockquote',
      children: [{ _type: 'span', _key: makeKey(), text: block.text, marks: [] }],
      markDefs: [],
    };
  }

  // Unordered list — each item becomes a separate listItem block
  if (block.type === 'ul') {
    return block.items.map(item => ({
      _type: 'block',
      _key: makeKey(),
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      children: [{ _type: 'span', _key: makeKey(), text: item, marks: [] }],
      markDefs: [],
    }));
  }

  // Ordered list
  if (block.type === 'ol') {
    return block.items.map(item => ({
      _type: 'block',
      _key: makeKey(),
      style: 'normal',
      listItem: 'number',
      level: 1,
      children: [{ _type: 'span', _key: makeKey(), text: item, marks: [] }],
      markDefs: [],
    }));
  }

  // Default: normal paragraph
  return {
    _type: 'block',
    _key: makeKey(),
    style: 'normal',
    children: [{ _type: 'span', _key: makeKey(), text: block.text ?? '', marks: [] }],
    markDefs: [],
  };
}

function convertPost(post) {
  // Flatten body (lists produce arrays of blocks)
  const body = post.body.flatMap(block => {
    const result = toPortableTextBlock(block);
    return Array.isArray(result) ? result : [result];
  });

  // Normalise publishedAt to full ISO datetime
  const publishedAt = post.publishedAt.includes('T')
    ? post.publishedAt
    : `${post.publishedAt}T00:00:00.000Z`;

  return {
    _id: `post-en-${post.articleNumber}`,
    _type: 'post',
    title: post.title,
    articleNumber: post.articleNumber,
    slug: { _type: 'slug', current: slugify(post.title) },
    publishedAt,
    excerpt: post.excerpt.slice(0, 300),
    language: 'en',
    ...(post.category && { category: post.category }),
    tags: Array.isArray(post.tags) ? post.tags : [],
    body,
  };
}

// ── main ─────────────────────────────────────────────────────────────────────

const inputArg = process.argv[2];
if (!inputArg) {
  console.error('Usage: node scripts/import-posts.mjs <path-to-posts.json>');
  process.exit(1);
}

const inputPath = resolve(process.cwd(), inputArg);
const outputPath = inputPath.replace(/\.json$/, '.ndjson');

let posts;
try {
  posts = JSON.parse(readFileSync(inputPath, 'utf8'));
} catch (err) {
  console.error(`Could not read or parse ${inputPath}:`, err.message);
  process.exit(1);
}

if (!Array.isArray(posts)) {
  console.error('Input JSON must be an array of post objects.');
  process.exit(1);
}

const lines = posts.map(post => JSON.stringify(convertPost(post)));
writeFileSync(outputPath, lines.join('\n') + '\n', 'utf8');

console.log(`✓ Converted ${posts.length} post(s)`);
console.log(`✓ Output: ${outputPath}`);
console.log('');
console.log('Next step — import to Sanity:');
console.log(`  cd studio && npx sanity dataset import ../${outputPath.replace(process.cwd() + '/', '')} production --replace`);
