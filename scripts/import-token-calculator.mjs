// scripts/import-token-calculator.mjs
//
// Generates scripts/data/tokenCalculatorPage-en.ndjson for the `tokenCalculatorPage` schema.
// Note: the calculator widget JS is hardcoded in the Astro template — this script only
// populates text content (hero, FAQ, CTA).
//
// Usage:  node scripts/import-token-calculator.mjs
// Import: cd studio && npx sanity dataset import ../scripts/data/tokenCalculatorPage-en.ndjson production --replace

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';

const OUTPUT_PATH = 'scripts/data/tokenCalculatorPage-en.ndjson';
const key = () => randomUUID().replace(/-/g, '').slice(0, 12);
function span(text, marks = []) { return { _type: 'span', _key: key(), text, marks }; }
function block(children, extra = {}) {
  return { _type: 'block', _key: key(), style: 'normal', markDefs: [], children: children.length ? children : [span('')], ...extra };
}
function pt(...texts) { return texts.map(t => block([span(t)])); }

const doc = {
  _id: 'tokenCalculatorPage-en',
  _type: 'tokenCalculatorPage',
  language: 'en',

  heroLabel:    'Free Tool',
  heroHeadline: 'AI Token Calculator',
  heroSubtitle: 'Paste any text to instantly estimate token count and input costs across OpenAI, Anthropic, and Google — no sign-up required.',

  faqSectionLabel: 'Common Questions',
  faqTitle:        'About the Token Calculator',
  faqIntro:        'Quick answers to the most common questions about how this tool works and what the results mean.',

  faq: [
    {
      _key: key(), _type: 'faqItem',
      question: 'What exactly is a token?',
      answer: pt('A token is the smallest unit of text an AI model reads and generates. In English, one token is roughly 4 characters or ¾ of a word. Punctuation and spaces also count as tokens. AI APIs bill you per token — both for what you send (input) and what the model replies (output).'),
    },
    {
      _key: key(), _type: 'faqItem',
      question: 'Why do the numbers differ from the actual API?',
      answer: pt('Each AI provider uses its own tokenizer (e.g. GPT uses tiktoken, Claude uses its own BPE tokenizer). This tool uses a universal approximation formula that works well for quick estimates, but the exact count may differ by 5–15% depending on the text and model.'),
    },
    {
      _key: key(), _type: 'faqItem',
      question: 'Does this include output (response) tokens?',
      answer: pt("No — this calculator only estimates input tokens (what you send to the model). Output tokens depend on the model's response length, which varies. To estimate total cost, you'd need to add an output estimate based on your expected response length."),
    },
    {
      _key: key(), _type: 'faqItem',
      question: 'Are the prices shown up to date?',
      answer: pt('The prices are AI Token King reference prices and are updated periodically. AI pricing changes frequently — always verify the current rate on the official OpenAI, Anthropic, or Google AI platform before making billing decisions.'),
    },
  ],

  ctaTitle: 'Want to compare model prices?',
  ctaBody:  'See a full breakdown of 25+ models across OpenAI, Anthropic, Google, and open-source — with input/output pricing, context windows, and use case guidance.',

  seo: {
    seoTitle: 'AI Token Calculator — Estimate Costs Instantly',
    seoDescription: 'Free AI token calculator: paste any text to instantly estimate token count and input costs for GPT-4o, Claude, and Gemini. No sign-up required.',
    noindex: false,
  },
};

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, JSON.stringify(doc) + '\n');
console.log(`✓ Wrote ${OUTPUT_PATH}`);
console.log(`  FAQs: ${doc.faq.length}`);
console.log(`\nImport: cd studio && npx sanity dataset import ../${OUTPUT_PATH} production --replace`);
