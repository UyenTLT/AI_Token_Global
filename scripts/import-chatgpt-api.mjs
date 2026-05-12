// scripts/import-chatgpt-api.mjs
//
// Parses archive/chatgpt-api.html and produces a Sanity NDJSON document for the
// `apiModelPage` document type (English, modelSlug: chatgpt).
//
// Usage from repo root:
//   node scripts/import-chatgpt-api.mjs
//
// Import to Sanity:
//   cd studio && npx sanity dataset import ../scripts/data/chatgptApiPage-en.ndjson production --replace

// ── Config ─────────────────────────────────────────────────────────────
const MODEL_SLUG     = 'chatgpt';
const HERO_ACCENT    = 'purple';
const DOC_ID         = 'apiModelPage-chatgpt-en';
const HTML_PATH      = 'archive/chatgpt-api.html';
const OUTPUT_PATH    = 'scripts/data/chatgptApiPage-en.ndjson';
const UNIQUE_SECTION = 'who-fits'; // h2[id] for the model-specific section

// ── Imports ─────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
import * as cheerio from 'cheerio';

// ── Helpers ─────────────────────────────────────────────────────────────
const key   = () => randomUUID().replace(/-/g, '').slice(0, 12);
const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

function span(text, marks = []) {
  return { _type: 'span', _key: key(), text, marks };
}

function block(children, extra = {}) {
  return {
    _type: 'block', _key: key(), style: 'normal', markDefs: [],
    children: children.length ? children : [span('')],
    ...extra,
  };
}

// Convert inline content (text + <strong>/<em>) of a cheerio element into spans.
function spansFromInline($, el) {
  const spans = [];
  $(el).contents().each((_, node) => {
    if (node.type === 'text') {
      const text = node.data.replace(/\s+/g, ' ');
      if (text.trim()) spans.push(span(text));
    } else if (node.type === 'tag') {
      const inner = $(node).text().replace(/\s+/g, ' ').trim();
      if (!inner) return;
      if (node.name === 'strong' || node.name === 'b') {
        spans.push(span(inner, ['strong']));
      } else if (node.name === 'em' || node.name === 'i') {
        spans.push(span(inner, ['em']));
      } else {
        // inline <a> — keep as plain text (links to archive html, not needed in CMS)
        spans.push(span(inner));
      }
    }
  });
  return spans;
}

// Convert an array of raw DOM nodes to Portable Text blocks (p, ul, ol).
// h3 and unknown tags are skipped — handle them upstream if needed.
function nodesToPT($, nodes) {
  const blocks = [];
  nodes.forEach(node => {
    if (!node.name) return; // skip raw text / comment nodes
    if (node.name === 'p') {
      const spans = spansFromInline($, node);
      if (spans.length) blocks.push(block(spans));
    } else if (node.name === 'ul') {
      $(node).find('> li').each((_, li) => {
        blocks.push(block(spansFromInline($, li), { listItem: 'bullet', level: 1 }));
      });
    } else if (node.name === 'ol') {
      $(node).find('> li').each((_, li) => {
        blocks.push(block(spansFromInline($, li), { listItem: 'number', level: 1 }));
      });
    }
    // h3, div — skipped intentionally
  });
  return blocks;
}

// Return all DOM nodes between h2[id=sectionId] and the next h2 sibling.
function sectionNodes($, article, sectionId) {
  return $(article).find(`h2[id="${sectionId}"]`).nextUntil('h2').toArray();
}

// Parse FAQ items from the #faq section.
// Each FAQ item has a <button> (question text + SVG) and a .faq-answer > p.
function parseFaqs($, article) {
  const items = [];
  $(article).find('h2[id="faq"]').nextUntil('h2').find('button').each((_, btn) => {
    const question = clean(
      $(btn).contents()
        .filter((_, n) => n.type === 'text')
        .map((_, n) => n.data).get().join(' ')
    );
    if (!question) return;
    const answerNodes = $(btn).next('.faq-answer').children().toArray();
    const answer = nodesToPT($, answerNodes);
    items.push({ _key: key(), _type: 'faqItem', question, answer });
  });
  return items;
}

// Parse further-reading links (ul > li > a) from the #further-reading section.
function parseFurtherReading($, article) {
  const links = [];
  sectionNodes($, article, 'further-reading').forEach(node => {
    if (node.name === 'ul') {
      $(node).find('> li > a').each((_, a) => {
        links.push({
          _key: key(), _type: 'readingLink',
          label: clean($(a).text()),
          url: $(a).attr('href') || '',
        });
      });
    }
  });
  return links;
}

// ── Load & Parse ────────────────────────────────────────────────────────
const $ = cheerio.load(readFileSync(HTML_PATH, 'utf-8'));
const article = $('article.article-body')[0];

// Hero
const heroHeadline = clean($('h1').first().text());
const heroSubtitle = clean($('h1').first().parent().find('p').first().text());

// Overview (paragraphs directly after h2#overview)
const overviewBody = nodesToPT($, sectionNodes($, article, 'overview'));

// What Is
const whatIsTitle = clean($(article).find('h2[id="what-is"]').text());
const whatIsBody  = nodesToPT($, sectionNodes($, article, 'what-is'));

// Use Cases
const useCasesTitle = clean($(article).find('h2[id="use-cases"]').text());
const useCasesBody  = nodesToPT($, sectionNodes($, article, 'use-cases'));

// Pricing — split body (before h3) from pricingReference (h3 → rest)
const pricingTitle = clean($(article).find('h2[id="pricing"]').text());
const pricingAll   = sectionNodes($, article, 'pricing');
const h3Idx        = pricingAll.findIndex(n => n.name === 'h3');
const pricingBody      = nodesToPT($, h3Idx >= 0 ? pricingAll.slice(0, h3Idx) : pricingAll);
const pricingReference = nodesToPT($, h3Idx >= 0 ? pricingAll.slice(h3Idx + 1) : []);

// Unique section (model-specific)
const uniqueSectionTitle = clean($(article).find(`h2[id="${UNIQUE_SECTION}"]`).text());
const uniqueSectionBody  = nodesToPT($, sectionNodes($, article, UNIQUE_SECTION));

// Comparing
const comparingTitle = clean($(article).find('h2[id="comparison-tips"]').text());
const comparingBody  = nodesToPT($, sectionNodes($, article, 'comparison-tips'));

// Further Reading
const furtherReadingTitle = clean($(article).find('h2[id="further-reading"]').text()) || 'Further Reading';
const furtherReading      = parseFurtherReading($, article);

// FAQ
const faqTitle = clean($(article).find('h2[id="faq"]').text()) || 'Common Questions';
const faq      = parseFaqs($, article);

// ── SEO defaults ────────────────────────────────────────────────────────
const seo = {
  seoTitle: 'ChatGPT API Guide — Pricing, Use Cases & Token Costs',
  seoDescription:
    'Understand the ChatGPT API: what it does, common use cases, how pricing works, and how AI tokens drive costs. Clear overview for developers and teams.',
  noindex: false,
};

// ── Build document ──────────────────────────────────────────────────────
const doc = {
  _id: DOC_ID,
  _type: 'apiModelPage',
  language: 'en',
  modelSlug: MODEL_SLUG,
  heroHeadline,
  heroSubtitle,
  heroAccent: HERO_ACCENT,
  overviewBody,
  whatIsTitle,
  whatIsBody,
  useCasesTitle,
  useCasesBody,
  pricingTitle,
  pricingBody,
  pricingReference,
  uniqueSectionTitle,
  uniqueSectionBody,
  comparingTitle,
  comparingBody,
  furtherReadingTitle,
  furtherReading,
  faqTitle,
  faq,
  seo,
};

// ── Write NDJSON ────────────────────────────────────────────────────────
mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, JSON.stringify(doc) + '\n');

// ── Summary ─────────────────────────────────────────────────────────────
console.log(`✓ Wrote ${OUTPUT_PATH}`);
console.log('');
console.log('Document summary:');
console.log(`  model:           ${MODEL_SLUG} (heroAccent: ${HERO_ACCENT})`);
console.log(`  hero:            "${heroHeadline}"`);
console.log(`  hero subtitle:   "${heroSubtitle.slice(0, 60)}…"`);
console.log(`  overview:        ${overviewBody.length} blocks`);
console.log(`  what-is:         ${whatIsBody.length} blocks`);
console.log(`  use-cases:       ${useCasesBody.length} blocks`);
console.log(`  pricing body:    ${pricingBody.length} blocks`);
console.log(`  pricing ref:     ${pricingReference.length} blocks (${pricingReference.filter(b => b.listItem).length} tiers)`);
console.log(`  unique section:  "${uniqueSectionTitle}" — ${uniqueSectionBody.length} blocks`);
console.log(`  comparing:       ${comparingBody.length} blocks`);
console.log(`  further reading: ${furtherReading.length} links`);
console.log(`  FAQ items:       ${faq.length}`);
console.log('');
console.log('Next step:');
console.log(`  cd studio && npx sanity dataset import ../${OUTPUT_PATH} production --replace`);
