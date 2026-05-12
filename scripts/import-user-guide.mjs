// scripts/import-user-guide.mjs
//
// Generates scripts/data/userGuidePage-en.ndjson for the `userGuidePage` schema.
//
// Usage:  node scripts/import-user-guide.mjs
// Import: cd studio && npx sanity dataset import ../scripts/data/userGuidePage-en.ndjson production --replace

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
import * as cheerio from 'cheerio';
import { readFileSync } from 'node:fs';

const OUTPUT_PATH = 'scripts/data/userGuidePage-en.ndjson';
const key = () => randomUUID().replace(/-/g, '').slice(0, 12);
const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

function span(text, marks = []) { return { _type: 'span', _key: key(), text, marks }; }
function block(children, extra = {}) {
  return { _type: 'block', _key: key(), style: 'normal', markDefs: [], children: children.length ? children : [span('')], ...extra };
}
function pt(...texts) { return texts.map(t => block([span(t)])); }
function bullet(text) { return block([span(text)], { listItem: 'bullet', level: 1 }); }

// ── Parse FAQs from HTML ───────────────────────────────────────────────
const $ = cheerio.load(readFileSync('archive/user-guide.html', 'utf-8'));
const faq = [];
$('#faq').nextAll().find('.faq-btn, .faq-body').length; // init
// User guide uses a different FAQ structure — parse question/answer pairs
$('.faq-item, [class*="faq"]').each((_, item) => {
  const q = clean($(item).find('.faq-btn, button').first().contents().filter((_, n) => n.type === 'text').map((_, n) => n.data).get().join(' '));
  const a = clean($(item).find('.faq-body, .faq-answer').first().text());
  if (q && a) faq.push({ _key: key(), _type: 'faqItem', question: q, answer: pt(a) });
});

// Fallback: hardcode FAQs if parser finds nothing (user-guide uses accordion JS classes)
const faqItems = faq.length ? faq : [
  {
    _key: key(), _type: 'faqItem',
    question: 'Is AI Token King a cryptocurrency token?',
    answer: pt('No. The "Token" in AI Token King refers to AI model usage units — the measurement AI APIs use to charge for text processing. It has nothing to do with cryptocurrency or virtual currency.'),
  },
  {
    _key: key(), _type: 'faqItem',
    question: 'Can non-technical users use it?',
    answer: pt('Yes. Regular users can use it for writing, organizing, translation, and Q&A without any technical knowledge. The platform is designed to be accessible to anyone who can use a chat interface.'),
  },
  {
    _key: key(), _type: 'faqItem',
    question: 'How does AI Token King charge for usage?',
    answer: pt('You top up your AI Token balance and consume tokens as you use AI models. More input content, longer tasks, and more capable models consume more tokens. You can view your balance and usage history at any time.'),
  },
  {
    _key: key(), _type: 'faqItem',
    question: 'How is AI Token King different from a standard AI subscription?',
    answer: pt('Standard AI subscriptions typically give you access to one platform or one model. AI Token King gives you access to multiple models with a single balance — you switch models based on task, not based on which subscription you have.'),
  },
  {
    _key: key(), _type: 'faqItem',
    question: 'What if I only want to use one AI model?',
    answer: pt("That's fine — you can absolutely use AI Token King with just one model. But most users find that different tasks benefit from different models, and having the flexibility to switch without re-subscribing is one of the main reasons they stay."),
  },
];

// ── Document ───────────────────────────────────────────────────────────
const doc = {
  _id: 'userGuidePage-en',
  _type: 'userGuidePage',
  language: 'en',

  heroLabel:    'Platform Manual',
  heroHeadline: 'AI Token King Platform Guide',
  heroSubtitle: "One platform, unified access to the world's leading AI models. Manage tokens, switch models, and control costs — all from a single dashboard.",
  heroSubtitle2: 'Built for individuals, teams, and enterprises who want to use AI more efficiently — without juggling separate subscriptions, platforms, or billing accounts.',

  whatIsTitle: 'What is AI Token King?',
  whatIsBody: [
    block([
      span('AI Token King is a '),
      span('multi-model AI aggregation platform', ['strong']),
      span('. You can use multiple mainstream AI models on a single platform — without subscribing separately to each one, switching between tools, or managing multiple billing accounts.'),
    ]),
    ...pt("It's built for individuals, teams, and enterprises who want to compare models, control AI costs, and centralize their AI usage in one place."),
  ],

  problemsTitle: 'What Problems Does It Solve?',
  problemsBody: [
    ...pt('For users who want to compare models, control AI costs, and centralize usage — AI Token King removes the friction:'),
    bullet('No separate subscriptions for every AI tool'),
    bullet('No constant switching between platforms'),
    bullet('No being locked into a single model'),
    bullet('View AI Token usage and balance at a glance'),
    bullet('Switch models based on the task at hand'),
    bullet('Use OpenClaw AI Agent to automate fixed workflows'),
  ],

  featuresTitle: 'Core Features',
  features: [
    {
      _key: key(), _type: 'feature',
      title: 'Unified Token Top-Up',
      body: pt('Top up your AI Token balance once — use it across all supported models. No need to pay each platform separately.'),
    },
    {
      _key: key(), _type: 'feature',
      title: 'Multi-Model Switching',
      body: pt('Switch between GPT, Claude, Gemini, DeepSeek, Qwen, and more based on the task — no re-logging, no separate accounts.'),
    },
    {
      _key: key(), _type: 'feature',
      title: 'Usage Management',
      body: pt('Track your token balance and usage history across all models. Understand exactly what you\'re spending on AI — and where.'),
    },
    {
      _key: key(), _type: 'feature',
      title: 'OpenClaw AI Agent',
      body: pt('Not just answering questions — OpenClaw helps AI handle fixed tasks and automated workflows. Ideal for customer service, scheduling, content pipelines, and cross-team collaboration.'),
    },
  ],

  modelsTitle: 'Supported AI Models',
  models: [
    { _key: key(), _type: 'model', name: 'GPT Series',     description: 'Best for conversation, analysis, creative writing, and general tasks.' },
    { _key: key(), _type: 'model', name: 'Claude Series',  description: 'Best for long documents, deep reasoning, and complex file analysis.' },
    { _key: key(), _type: 'model', name: 'Gemini Series',  description: 'Best for multilingual tasks, multimodal inputs, and knowledge retrieval.' },
    { _key: key(), _type: 'model', name: 'DeepSeek Series',description: 'Best for high-complexity tasks and cost-sensitive workloads.' },
    { _key: key(), _type: 'model', name: 'Qwen Series',    description: 'Best for Chinese language understanding, writing, and content with Chinese context.' },
  ],

  useCasesTitle: 'What Can You Use It For?',
  useCasesBody: [
    ...pt('Writing, copywriting, organizing materials, translating documents, summarizing reports, comparing options, learning research, coding, and automating workflows.'),
    ...pt('Simply put: if you regularly use AI for content, research, customer service, development, or workflow organization — AI Token King centralizes it all.'),
  ],

  audienceTitle: 'Who Is It For?',
  audience: [
    { _key: key(), _type: 'audienceCard', role: 'Content Creators',      body: pt('Need to produce large volumes of articles, social posts, and scripts efficiently.') },
    { _key: key(), _type: 'audienceCard', role: 'Students & Researchers', body: pt('Need to organize materials, translate documents, or assist with academic learning.') },
    { _key: key(), _type: 'audienceCard', role: 'Individual Users',       body: pt("Don't want to subscribe to every AI tool separately — just want one place to use AI.") },
    { _key: key(), _type: 'audienceCard', role: 'Developers & Startups',  body: pt('Need to test models, integrate APIs, or control costs across multiple AI services.') },
    { _key: key(), _type: 'audienceCard', role: 'Enterprise Buyers',      body: pt('Need unified AI usage management, model-level controls, flexible deployment, and team-wide token visibility.') },
  ],

  openclawTitle: 'What is OpenClaw?',
  openclawBody: [
    block([
      span('OpenClaw is AI Token King\'s '),
      span('AI Agent solution', ['strong']),
      span('. Standard AI tools answer questions — OpenClaw goes further, letting AI handle fixed tasks and automated workflows.'),
    ]),
    ...pt("It's designed for automated customer service, scheduled tasks, content pipelines, knowledge base management, and cross-team collaboration over long time horizons."),
    ...pt("Think of it as: AI that doesn't just respond — it acts. OpenClaw can follow a predefined workflow, execute steps autonomously, and report back — without requiring you to manually prompt every action."),
  ],

  gettingStartedTitle: 'How to Get Started',
  steps: [
    { _key: key(), _type: 'step', title: 'Create an account',          body: pt('Sign up at AI Token King — takes under a minute.') },
    { _key: key(), _type: 'step', title: 'Claim your free tokens',     body: pt('New users receive a free token allocation to try all supported models.') },
    { _key: key(), _type: 'step', title: 'Browse available models',    body: pt('Explore GPT, Claude, Gemini, DeepSeek, and Qwen — compare capabilities and costs.') },
    { _key: key(), _type: 'step', title: 'Submit your first task',     body: pt('Start with writing, research, translation, or summarization — no setup required.') },
    { _key: key(), _type: 'step', title: 'Explore or set up OpenClaw', body: pt('When ready, configure OpenClaw for automated workflows and recurring tasks.') },
  ],

  faqTitle: 'Common Questions',
  faq: faqItems,

  seo: {
    seoTitle: 'AI Token King User Guide — Platform Manual',
    seoDescription: 'Learn how AI Token King works: multi-model access, unified token top-up, usage management, OpenClaw AI Agent, and how to get started in minutes.',
    noindex: false,
  },
};

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, JSON.stringify(doc) + '\n');
console.log(`✓ Wrote ${OUTPUT_PATH}`);
console.log(`  features: ${doc.features.length} | models: ${doc.models.length} | audience: ${doc.audience.length} | steps: ${doc.steps.length} | FAQs: ${doc.faq.length}`);
console.log(`\nImport: cd studio && npx sanity dataset import ../${OUTPUT_PATH} production --replace`);
