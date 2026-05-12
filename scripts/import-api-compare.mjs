// scripts/import-api-compare.mjs
//
// Parses archive/api-compare.html and produces a Sanity NDJSON document for the
// `apiComparePage` document type (English).
//
// Usage from repo root:
//   node scripts/import-api-compare.mjs
//
// Then import to Sanity (creates or replaces the document):
//   cd studio && npx sanity dataset import ../scripts/data/apiComparePage-en.ndjson production --replace

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
import * as cheerio from 'cheerio';

const HTML_PATH = 'archive/api-compare.html';
const OUTPUT_PATH = 'scripts/data/apiComparePage-en.ndjson';

const key = () => randomUUID().replace(/-/g, '').slice(0, 12);
const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

// ── Portable Text helpers ──────────────────────────────────────────────
function span(text, marks = []) {
  return { _type: 'span', _key: key(), text, marks };
}

function block(children, extra = {}) {
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: children.length ? children : [span('')],
    ...extra,
  };
}

// Convert inline content (with <strong>) of a cheerio element into spans.
// Preserves single spaces between inline children so "<strong>X</strong> — Y"
// renders as "X — Y" not "X— Y".
function spansFromInline($, el) {
  const spans = [];
  $(el).contents().each((_, node) => {
    if (node.type === 'text') {
      // Normalize whitespace but keep leading/trailing single spaces.
      const text = node.data.replace(/\s+/g, ' ');
      if (text.trim()) spans.push(span(text));
    } else if (node.type === 'tag') {
      const innerText = $(node).text().replace(/\s+/g, ' ').trim();
      if (!innerText) return;
      if (node.name === 'strong' || node.name === 'b') {
        spans.push(span(innerText, ['strong']));
      } else if (node.name === 'em' || node.name === 'i') {
        spans.push(span(innerText, ['em']));
      } else {
        spans.push(span(innerText));
      }
    }
  });
  return spans;
}

// Convert an element's direct children (<p>, <ul><li>) into Portable Text blocks.
function elementToPortableText($, el) {
  if (!el) return [];
  const blocks = [];
  $(el).children().each((_, child) => {
    if (child.name === 'p') {
      blocks.push(block(spansFromInline($, child)));
    } else if (child.name === 'ul') {
      $(child)
        .find('> li')
        .each((_, li) => {
          blocks.push(block(spansFromInline($, li), { listItem: 'bullet', level: 1 }));
        });
    } else if (child.name === 'ol') {
      $(child)
        .find('> li')
        .each((_, li) => {
          blocks.push(block(spansFromInline($, li), { listItem: 'number', level: 1 }));
        });
    }
  });
  return blocks;
}

// ── Load HTML ──────────────────────────────────────────────────────────
const html = readFileSync(HTML_PATH, 'utf-8');
const $ = cheerio.load(html);

// ── Hero ───────────────────────────────────────────────────────────────
const heroBlock = $('.page-hero-content > div').filter((_, el) =>
  $(el).find('h1').length > 0
).first();
const heroHeadline = clean(heroBlock.find('h1').text());
const heroParas = heroBlock.find('> p');
const heroSubtitle = clean(heroParas.eq(0).text());
const heroNote = clean(heroParas.eq(1).text());

// ── Type cards (Text / Image / Video) ──────────────────────────────────
const iconMap = {
  'text-models': 'text',
  'image-models': 'image',
  'video-models': 'video',
};
const typeCards = [];
$('.section-anchor-card').each((_, el) => {
  const $el = $(el);
  const anchorId = ($el.attr('href') || '').replace('#', '');
  // The title and subtitle live in two stacked divs inside an outer flex container
  const innerDivs = $el.find('> div').first().find('> div').last().find('> div');
  const title = clean(innerDivs.eq(0).text());
  const subtitle = clean(innerDivs.eq(1).text());
  const description = clean($el.find('> p').first().text());
  const ctaLabel = clean($el.find('.btn-ghost').text()) || 'View Models →';
  typeCards.push({
    _key: key(),
    _type: 'typeCard',
    icon: iconMap[anchorId] || 'text',
    title,
    subtitle,
    description,
    ctaLabel,
    anchorId,
  });
});

// ── Pricing callout ────────────────────────────────────────────────────
const pricingCalloutTitle = clean(
  $('span').filter((_, el) => clean($(el).text()) === 'Live API Model Pricing').first().text()
) || 'Live API Model Pricing';
const pricingCalloutBody = clean(
  $('p').filter((_, el) => /Real-time pricing/.test($(el).text())).first().text()
);
const pricingCalloutCta = 'View Live Pricing';

// ── Model tables ───────────────────────────────────────────────────────
function parseModelRows(sectionId, rowType) {
  return $(`#${sectionId} .model-row`)
    .map((_, row) => {
      const $row = $(row);
      return {
        _key: key(),
        _type: rowType,
        modelName: clean($row.find('.model-name').text()),
        description: clean($row.find('.model-desc').text()),
      };
    })
    .get()
    .filter((r) => r.modelName);
}

function sectionSubtitle(sectionId) {
  return clean(
    $(`#${sectionId} h2`).parent().parent().find('> div > p').first().text()
  );
}

const textModels = parseModelRows('text-models', 'textModelRow');
const imageModels = parseModelRows('image-models', 'imageModelRow');
const videoModels = parseModelRows('video-models', 'videoModelRow');

const textModelsSubtitle = sectionSubtitle('text-models');
const imageModelsSubtitle = sectionSubtitle('image-models');
const videoModelsSubtitle = sectionSubtitle('video-models');

// ── FAQ ────────────────────────────────────────────────────────────────
const faqTitle = clean($('#faq h2').text()) || 'Common Questions About Model Types';
const faq = $('#faq .faq-item')
  .map((_, item) => {
    const $item = $(item);
    // Question is the visible text of the .faq-question button (ignore SVG content).
    let question = clean(
      $item
        .find('.faq-question')
        .first()
        .contents()
        .filter((_, n) => n.type === 'text')
        .map((_, n) => n.data)
        .get()
        .join(' ')
    );
    if (!question) question = clean($item.find('.faq-question').first().text());
    const answer = elementToPortableText($, $item.find('.faq-answer').first()[0]);
    return { _key: key(), _type: 'faqItem', question, answer };
  })
  .get();

// ── Bottom CTA ─────────────────────────────────────────────────────────
const ctaHeadline = clean(
  $('div').filter((_, el) => clean($(el).text()) === 'Ready to compare API pricing?').first().text()
) || 'Ready to compare API pricing?';
const ctaBody = clean(
  $('p').filter((_, el) => /Now that you know the model types/.test($(el).text())).first().text()
);

// ── SEO (sensible defaults — refine in Studio later) ───────────────────
const seo = {
  seoTitle: 'AI Model Type Overview — Compare Text, Image & Video AI',
  seoDescription:
    'Compare 40+ AI models across text, image, and video. See use cases, pricing, and find the right model for your project on AI Token King.',
  noindex: false,
};

// ── Build document ─────────────────────────────────────────────────────
const doc = {
  _id: 'apiComparePage-en',
  _type: 'apiComparePage',
  language: 'en',
  heroHeadline,
  heroSubtitle,
  heroNote,
  typeCards,
  pricingCalloutTitle,
  pricingCalloutBody,
  pricingCalloutCta,
  textModelsTitle: 'Text Models',
  textModelsSubtitle,
  textModels,
  imageModelsTitle: 'Image Models',
  imageModelsSubtitle,
  imageModels,
  videoModelsTitle: 'Video Models',
  videoModelsSubtitle,
  videoModels,
  faqTitle,
  faq,
  ctaHeadline,
  ctaBody,
  seo,
};

// ── Write NDJSON ───────────────────────────────────────────────────────
mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, JSON.stringify(doc) + '\n');

// ── Summary ────────────────────────────────────────────────────────────
console.log(`✓ Wrote ${OUTPUT_PATH}`);
console.log('');
console.log('Document summary:');
console.log(`  hero headline:    "${heroHeadline}"`);
console.log(`  hero subtitle:    "${heroSubtitle.slice(0, 60)}…"`);
console.log(`  type cards:       ${typeCards.length} (${typeCards.map((c) => c.title).join(', ')})`);
console.log(`  pricing callout:  "${pricingCalloutTitle}"`);
console.log(`  text models:      ${textModels.length}`);
console.log(`  image models:     ${imageModels.length}`);
console.log(`  video models:     ${videoModels.length}`);
console.log(`  FAQ items:        ${faq.length}`);
console.log(`  bottom CTA:       "${ctaHeadline}"`);
console.log('');
console.log('Next step — import to Sanity:');
console.log(`  cd studio && npx sanity dataset import ../${OUTPUT_PATH} production --replace`);
