// scripts/import-beginners-guide.mjs
//
// Generates scripts/data/beginnersGuidePage-en.ndjson for the `beginnersGuidePage` schema.
//
// Usage:  node scripts/import-beginners-guide.mjs
// Import: cd studio && npx sanity dataset import ../scripts/data/beginnersGuidePage-en.ndjson production --replace

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
import * as cheerio from 'cheerio';
import { readFileSync } from 'node:fs';

const OUTPUT_PATH = 'scripts/data/beginnersGuidePage-en.ndjson';
const key = () => randomUUID().replace(/-/g, '').slice(0, 12);
const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

function span(text, marks = []) { return { _type: 'span', _key: key(), text, marks }; }
function block(children, extra = {}) {
  return { _type: 'block', _key: key(), style: 'normal', markDefs: [], children: children.length ? children : [span('')], ...extra };
}
function pt(...texts) { return texts.map(t => block([span(t)])); }
function ptStrong(parts) {
  // parts: array of {text, strong?}
  return [block(parts.map(p => span(p.text, p.strong ? ['strong'] : [])))];
}

// ── Parse FAQs from HTML ───────────────────────────────────────────────
const $ = cheerio.load(readFileSync('archive/beginners-guide.html', 'utf-8'));
const faq = [];
$('.faq-item').each((_, item) => {
  const question = clean($('.faq-btn', item).contents().filter((_, n) => n.type === 'text').map((_, n) => n.data).get().join(' '));
  const answerText = clean($('.faq-body', item).text());
  if (question) faq.push({ _key: key(), _type: 'faqItem', question, answer: pt(answerText) });
});

// ── Document ───────────────────────────────────────────────────────────
const doc = {
  _id: 'beginnersGuidePage-en',
  _type: 'beginnersGuidePage',
  language: 'en',

  heroLabel:    'Getting Started',
  heroHeadline: 'AI Token Beginners Guide',
  heroSubtitle: "New to AI Tokens? Don't rush to model comparisons, pricing tables, or APIs just yet. This guide walks you through the concepts, calculation logic, and cost structure in the right order — so you can make confident decisions about what to read next.",

  stepsTitle: "If You're New, Read in This Order",
  stepsIntroBody: pt(
    "First time encountering AI Tokens? You don't need to rush into model comparisons, pricing tables, or APIs. This page will walk you through the concepts, calculation logic, and cost structure in the simplest sequence — then help you decide what to read next."
  ),
  readingSteps: [
    {
      _key: key(), _type: 'readingStep',
      stepLabel: 'Step 1 · Start Here',
      title: 'Understand What an AI Token Actually Is',
      body: ptStrong([
        { text: 'Build the most basic concept first: an AI Token is not points, not an API key — it\'s the ' },
        { text: 'unit of computation', strong: true },
        { text: ' a model uses when processing input and generating output.' },
      ]),
      linkLabel: 'Read: What is an AI Token →',
      linkUrl: '/en/beginners-guide',
    },
    {
      _key: key(), _type: 'readingStep',
      stepLabel: 'Step 2 · Then This',
      title: 'Learn How AI Tokens Are Calculated',
      body: ptStrong([
        { text: 'Once you know what a Token is, the next step is understanding the relationship between ' },
        { text: 'input, output, word count, and usage', strong: true },
        { text: '. This is where the numbers start to make sense.' },
      ]),
      linkLabel: 'Read: How AI Tokens Are Calculated →',
      linkUrl: '/en/beginners-guide',
    },
    {
      _key: key(), _type: 'readingStep',
      stepLabel: 'Step 3 · Finally',
      title: 'Understand How Costs Are Derived',
      body: ptStrong([
        { text: 'Once you understand how usage is formed, ' },
        { text: 'pricing, costs, and platform differences', strong: true },
        { text: " will click into place much more easily. Don't start here — it'll make more sense after steps 1 and 2." },
      ]),
      linkLabel: 'Read: How AI Token Pricing Works →',
      linkUrl: '/en/beginners-guide',
    },
  ],

  stuckTitle: 'Where Most Beginners Get Stuck',
  stuckBody: [
    ...ptStrong([
      { text: 'Most beginners stumble not because of the tools — but because of ' },
      { text: 'the order they approach things in', strong: true },
      { text: '. The most common mistake is jumping straight to model comparisons, pricing tables, or platform plans before understanding the underlying concepts.' },
    ]),
    ...pt("If you haven't first understood what tokens are, how input and output work, and how costs are formed — reading more data just creates more confusion. For most beginners, building a solid foundation first is more valuable than rushing to compare which model is cheapest."),
  ],
  stuckCallouts: [
    {
      _key: key(), _type: 'stuckCallout',
      title: 'Build the concept first',
      body: pt("Once you know the basic terminology, the next step is understanding the relationship between input, output, and usage. Just knowing that longer input and more output generally means higher usage makes everything else easier to absorb."),
    },
    {
      _key: key(), _type: 'stuckCallout',
      title: 'Then understand usage',
      body: pt("Once you have a basic grasp of concepts and calculation, looking at pricing, costs, and model differences becomes much less overwhelming than starting with a wall of numbers."),
    },
    {
      _key: key(), _type: 'stuckCallout',
      title: 'Then look at pricing and models',
      body: pt("With a clear conceptual foundation in place, you can start exploring different models' cost differences and real-world use cases in depth — and actually understand what you're reading."),
    },
  ],

  faqTitle: 'Common Questions from Beginners',
  faq,

  nextReadsTitle: 'Recommended Next Reads',
  nextReadsIntroBody: pt("Once you've built up the basic concepts, these are the best articles to read next — they'll help you connect token counts, input/output differences, and usage patterns into a complete picture."),
  nextReads: [
    {
      _key: key(), _type: 'nextRead',
      title: 'How Many Characters Is One AI Token? English vs. Chinese',
      excerpt: 'The character count per token varies significantly by language — and it affects your costs.',
      url: '/en/blog',
    },
    {
      _key: key(), _type: 'nextRead',
      title: "What's the Difference Between Input Tokens and Output Tokens?",
      excerpt: "They're priced differently and behave differently — understanding both is essential.",
      url: '/en/blog',
    },
    {
      _key: key(), _type: 'nextRead',
      title: 'Why Do AI Tokens Run Out So Fast? 8 Most Common Reasons',
      excerpt: 'The most common reason usage grows faster than expected — and how to manage it.',
      url: '/en/blog',
    },
  ],

  ctaTitle: 'Get the foundation right — the rest follows',
  ctaBody: "First time with AI Tokens? You don't need to read every model comparison and pricing table upfront. Build the basic concepts, calculation logic, and cost understanding first — then the model comparisons, use cases, and platform differences will be much easier to navigate.",

  seo: {
    seoTitle: "AI Token Beginners Guide — Start Here",
    seoDescription: "New to AI Tokens? Learn what they are, how they're calculated, and how costs work — in the right order. The clearest beginner's guide to AI tokens.",
    noindex: false,
  },
};

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, JSON.stringify(doc) + '\n');
console.log(`✓ Wrote ${OUTPUT_PATH}`);
console.log(`  reading steps: ${doc.readingSteps.length} | stuck callouts: ${doc.stuckCallouts.length} | FAQs: ${doc.faq.length} | next reads: ${doc.nextReads.length}`);
console.log(`\nImport: cd studio && npx sanity dataset import ../${OUTPUT_PATH} production --replace`);
