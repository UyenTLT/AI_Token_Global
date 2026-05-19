/**
 * patch-post-images.mjs
 *
 * Assigns cover images to blog posts after you've uploaded them to Sanity.
 *
 * Usage:
 *   node scripts/patch-post-images.mjs scripts/data/image-map.json
 *
 * Input JSON shape (image-map.json):
 * [
 *   { "articleNumber": 1, "assetId": "image-abc123def456-1200x630-jpg" },
 *   { "articleNumber": 2, "assetId": "image-xyz789ghi012-1200x630-jpg" }
 * ]
 *
 * How to find the assetId:
 *   In Sanity Studio → Media Library → click any image → copy the ID shown
 *   in the details panel. It looks like: image-abc123...-1200x630-jpg
 *
 * What this script does:
 *   For each entry in the map, it patches the matching post document
 *   (identified by articleNumber) to set its coverImage field.
 *   It also sets the alt text to the post title automatically.
 *
 * Requires these env vars (or a .env file):
 *   SANITY_PROJECT_ID=mq3wxr8n
 *   SANITY_DATASET=production
 *   SANITY_TOKEN=<your write token from sanity.io/manage>
 */

import { createClient } from '@sanity/client';

const PROJECT_ID = process.env.SANITY_PROJECT_ID || 'mq3wxr8n';
const DATASET    = process.env.SANITY_DATASET    || 'production';
const TOKEN      = process.env.SANITY_TOKEN;

if (!TOKEN) {
  console.error('Missing SANITY_TOKEN. Get one from https://sanity.io/manage → your project → API → Tokens');
  console.error('Run as: SANITY_TOKEN=sk-... node scripts/patch-post-images.mjs image-map.json');
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  token: TOKEN,
  useCdn: false,
});

const inputArg = process.argv[2];
if (!inputArg) {
  console.error('Usage: SANITY_TOKEN=sk-... node scripts/patch-post-images.mjs <path-to-image-map.json>');
  process.exit(1);
}

import { readFileSync } from 'fs';
import { resolve } from 'path';

const inputPath = resolve(process.cwd(), inputArg);
let imageMap;
try {
  imageMap = JSON.parse(readFileSync(inputPath, 'utf8'));
} catch (err) {
  console.error(`Could not read ${inputPath}:`, err.message);
  process.exit(1);
}

if (!Array.isArray(imageMap)) {
  console.error('image-map.json must be an array.');
  process.exit(1);
}

console.log(`Patching ${imageMap.length} post(s)...\n`);

for (const entry of imageMap) {
  const { articleNumber, assetId } = entry;

  // Look up the post document by articleNumber
  const post = await client.fetch(
    `*[_type == "post" && articleNumber == $num && language == "en"][0]{ _id, title }`,
    { num: articleNumber }
  );

  if (!post) {
    console.warn(`⚠  No EN post found for articleNumber ${articleNumber} — skipping`);
    continue;
  }

  try {
    await client
      .patch(post._id)
      .set({
        coverImage: {
          _type: 'image',
          asset: { _type: 'reference', _ref: assetId },
          alt: post.title,
        },
      })
      .commit();

    console.log(`✓  #${articleNumber} — "${post.title}"`);
  } catch (err) {
    console.error(`✗  #${articleNumber} — failed: ${err.message}`);
  }
}

console.log('\nDone. Open Sanity Studio to verify, then publish.');
