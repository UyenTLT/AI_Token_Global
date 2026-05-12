// scripts/import-use-cases.mjs
//
// Generates scripts/data/useCasesPage-en.ndjson for the `useCasesPage` schema.
//
// Usage:  node scripts/import-use-cases.mjs
// Import: cd studio && npx sanity dataset import ../scripts/data/useCasesPage-en.ndjson production --replace

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';

const OUTPUT_PATH = 'scripts/data/useCasesPage-en.ndjson';
const key = () => randomUUID().replace(/-/g, '').slice(0, 12);
function span(text, marks = []) { return { _type: 'span', _key: key(), text, marks }; }
function block(children, extra = {}) {
  return { _type: 'block', _key: key(), style: 'normal', markDefs: [], children: children.length ? children : [span('')], ...extra };
}
function pt(...texts) { return texts.map(t => block([span(t)])); }

const doc = {
  _id: 'useCasesPage-en',
  _type: 'useCasesPage',
  language: 'en',

  heroLabel:    'Use Cases',
  heroHeadline: 'AI Token Use Cases',
  heroSubtitle: 'Based on different work needs, quickly understand common AI Token application directions, model requirements, and cost differences.',

  useCases: [
    {
      _key: key(), _type: 'useCase',
      title: 'Document Summarization & Organization',
      description: 'Best for summarizing long documents, condensing meeting notes, generating report abstracts, and quick reading of large datasets. These tasks typically involve longer input content — so alongside output quality, you\'ll want to pay attention to context length, processing stability, and token consumption.',
      commonDirections: 'Long-context comprehension · Stable summarization · Large input capacity',
    },
    {
      _key: key(), _type: 'useCase',
      title: 'Q&A & Knowledge Queries',
      description: "Best for document Q&A, FAQ assistants, internal knowledge retrieval, and quick information lookup. These scenarios require stable model comprehension — and you'll need to watch how context accumulates across multi-turn conversations and its effect on token consumption.",
      commonDirections: 'Stable comprehension · Clear answers · Strong context retention',
    },
    {
      _key: key(), _type: 'useCase',
      title: 'Content Creation & Copywriting',
      description: 'Best for article drafts, headline ideation, copy editing, social content, and SEO writing. Output tends to be longer, so when prioritizing naturalness and quality, you also need to factor in output length and cost implications together.',
      commonDirections: 'Natural output · Long-form stability · Quality/cost balance',
    },
    {
      _key: key(), _type: 'useCase',
      title: 'Social Media & Short-form Copy',
      description: 'Best for Facebook, Instagram, Threads, short ad copy, event posts, and product descriptions. Output is typically short, but tone, rhythm, and readability matter a lot — and it pairs well with lighter-weight models for efficiency.',
      commonDirections: 'Fast response · Natural copy · High efficiency for short content',
    },
    {
      _key: key(), _type: 'useCase',
      title: 'Customer Service & FAQ Responses',
      description: 'Best for 24/7 customer support, FAQ organization, and basic conversation flows. These scenarios accumulate conversation history, so beyond response stability, you need to watch context length and long-term token consumption.',
      commonDirections: 'Stable responses · Controllable costs · Good for repetitive tasks',
    },
    {
      _key: key(), _type: 'useCase',
      title: 'Code Writing & Debugging',
      description: 'Best for code generation, debugging, refactoring, adding comments, and development assistance. These tasks often involve longer prompts, multi-round corrections, and repeated testing — making model comprehension and output stability both critical.',
      commonDirections: 'Clear code understanding · Logical stability · Good at iterative edits',
    },
    {
      _key: key(), _type: 'useCase',
      title: 'Translation & Multilingual Content',
      description: 'Best for English translation, multilingual copy adaptation, localization, and cross-language data organization. These tasks prioritize semantic naturalness, consistent tone, and stability across longer paragraph translations.',
      commonDirections: 'Semantic naturalness · Multilingual balance · Long-paragraph stability',
    },
    {
      _key: key(), _type: 'useCase',
      title: 'Image Generation & Visual Assets',
      description: 'Best for illustrations, cover images, social media assets, design drafts, and brand visual proposals. These tasks prioritize image quality, style consistency, and generation speed — and work differently from pure text model evaluation.',
      commonDirections: 'Stable visual quality · Style control · Good for asset generation',
    },
    {
      _key: key(), _type: 'useCase',
      title: 'Video Generation & Short-form Video',
      description: "Best for text-to-video, image-to-video, short video assets, and dynamic content production. These tasks prioritize frame continuity, pacing, and generation efficiency — and pair well with image models for a complete visual pipeline.",
      commonDirections: 'Stable motion output · Short-video friendly · High generation efficiency',
    },
  ],

  footerNoteBody: [
    ...pt("Not sure which direction to start with? Look at model comparisons, cost calculations, and AI Token differences first — it'll make it much easier to judge which model or API fits your needs."),
  ],

  seo: {
    seoTitle: 'AI Token Use Cases — 9 Common Applications',
    seoDescription: 'Explore 9 common AI Token use cases: document summarization, Q&A, content creation, customer service, coding, translation, image and video generation.',
    noindex: false,
  },
};

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, JSON.stringify(doc) + '\n');
console.log(`✓ Wrote ${OUTPUT_PATH}`);
console.log(`  use cases: ${doc.useCases.length}`);
console.log(`\nImport: cd studio && npx sanity dataset import ../${OUTPUT_PATH} production --replace`);
