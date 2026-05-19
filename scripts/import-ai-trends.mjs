// scripts/import-ai-trends.mjs
//
// Generates scripts/data/aiTrendsPage-en.ndjson for the `aiTrendsPage` schema.
// Mirrors the live EN document in Sanity, including the new download card fields.
//
// Usage:  node scripts/import-ai-trends.mjs
// Import: cd studio && npx sanity dataset import ../scripts/data/aiTrendsPage-en.ndjson production --replace

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';

const OUTPUT_PATH = 'scripts/data/aiTrendsPage-en.ndjson';
const key = () => randomUUID().replace(/-/g, '').slice(0, 12);
function span(text, marks = []) { return { _type: 'span', _key: key(), text, marks }; }
function block(children) { return { _type: 'block', _key: key(), style: 'normal', markDefs: [], children }; }
function pt(text) { return [block([span(text)])]; }

const doc = {
  _id: 'aiTrendsPage-en',
  _type: 'aiTrendsPage',
  language: 'en',

  // ── Hero ────────────────────────────────────────────────────────────
  heroHeadline: 'AI Token Trend Watch',
  heroSubtitle: 'From AI tokens and AI APIs to model costs and data governance — a look at the changes most worth watching in the years ahead.',
  heroSubtitle2: [block([
    span("It's not just about models getting more powerful. It's about understanding "),
    span('how to choose models', ['em']),
    span(', connect APIs, control costs, and deploy AI practically in the real world.'),
  ])],

  // ── Intro ────────────────────────────────────────────────────────────
  introTitle: 'AI Future Trend Watch',
  introParagraphs: [
    block([
      span("In the years ahead, AI's evolution won't just be about models continuously improving in capability — the "),
      span('entire way people use AI', ['strong']),
      span(' will change alongside them. For everyday users, the focus will shift from "which model is the hottest" to "which model fits this task, how much does it cost, and which platform should I choose."'),
    ]),
    block([
      span('For businesses, the next wave of concern will be '),
      span('AI costs, API usage patterns, multi-model management, data governance, security controls, and deployment efficiency', ['strong']),
      span('. When AI starts entering customer service, search, analytics tools, and internal systems, what matters most won\'t just be the model itself — it\'ll be how to use AI more deeply, more economically, and with more control.'),
    ]),
  ],
  summaryTitle: 'Key Shifts to Watch',
  summaryPoints: [
    'From "which model is best" → to "which model fits this task"',
    'Cost control becomes a baseline skill, not an advanced one',
    'Multi-model pipelines replace single-model dependence',
    'Data governance and security become non-negotiable',
    'AI Agents amplify token consumption and governance complexity',
  ],

  // ── Trend cards ──────────────────────────────────────────────────────
  trendsSectionLabel: '5 Trends Shaping AI Usage',
  trendsSectionTitle: "What's Actually Changing — and Why It Matters",
  trendCards: [
    {
      _key: 'trend-en-1', _type: 'object',
      tag: 'Cost',
      title: 'AI Cost Control Becomes a Core Competency',
      accentColor: '#6155F1',
      pullQuote: '"The future of AI isn\'t just capability — it\'s whether you can afford to run it at scale."',
      body: [block([
        span('AI will no longer just be about whether you '),
        span('can', ['em']),
        span(' use it — it\'ll be about whether you can '),
        span('calculate costs clearly, keep spending under control, and sustain usage long-term', ['strong']),
        span('. Teams that can\'t manage token economics will be outcompeted by those that can.'),
      ])],
    },
    {
      _key: 'trend-en-2', _type: 'object',
      tag: 'Models',
      title: 'Not Every Task Uses the Same Model',
      accentColor: '#3E81E5',
      pullQuote: '"Quality, speed, and cost all need to be evaluated together — not just capability."',
      body: [block([
        span('The era of using one flagship model for everything is ending. The next generation of AI workflows will '),
        span('route tasks by type, cost, and quality requirement', ['strong']),
        span(' — a lightweight model for simple Q&A, a powerful one for complex reasoning, a specialized one for code.'),
      ])],
    },
    {
      _key: 'trend-en-3', _type: 'object',
      tag: 'APIs',
      title: 'AI APIs Become Infrastructure',
      accentColor: '#0ABFBC',
      pullQuote: '"The real moat isn\'t the model — it\'s how well you\'ve integrated it."',
      body: [block([
        span('More and more products — customer service, search, content tools, internal systems — will have AI APIs running behind them. '),
        span('AI will be infrastructure', ['strong']),
        span(', not a feature. Knowing how to connect, manage, and monitor these APIs becomes a foundational business skill.'),
      ])],
    },
    {
      _key: 'trend-en-4', _type: 'object',
      tag: 'Agents',
      title: 'AI Agents Amplify Token & Cost Management Complexity',
      accentColor: '#F59E0B',
      body: [
        block([
          span('As AI moves from single-turn conversations to '),
          span('automated multi-step workflows', ['strong']),
          span(', token consumption, API call counts, and governance complexity all increase significantly. An agent that runs 20 steps autonomously can consume 50× the tokens of a single chat message.'),
        ]),
        block([span('Teams building with AI Agents need to think about token budgets, retry logic, cost caps, and audit trails from day one — not as an afterthought.')]),
      ],
    },
    {
      _key: 'trend-en-5', _type: 'object',
      tag: 'Governance',
      title: 'Data Governance Determines What AI Can and Can\'t Do',
      accentColor: '#F43F5E',
      body: [
        block([
          span('A model alone is not enough. If your data, models, and security controls don\'t keep pace, '),
          span('AI will struggle to deliver real value', ['strong']),
          span(' in enterprise contexts. Compliance, data residency, access controls, and audit logging are all becoming prerequisites — not optional extras.'),
        ]),
        block([span("Organizations that get governance right early will move faster — not slower — because they'll have the trust needed to deploy AI broadly.")]),
      ],
    },
  ],

  // ── Audience ─────────────────────────────────────────────────────────
  audienceSectionTitle: 'What Do These Changes Mean for You?',
  audienceIntro: [block([span('Whether you\'re an everyday user, a content creator, a team manager, or an enterprise buyer — these trends will increasingly affect you: how to calculate AI tokens, compare different models, choose a platform, and avoid runaway costs. This is exactly the problem AI Token King is here to help you solve.')])],
  audienceCards: [
    {
      _key: 'aud-en-1', _type: 'object',
      audience: 'Individual Users',
      body: pt('Understand which AI tools are worth paying for, how to avoid overspending, and how to pick the right model for your specific needs — not just the most popular one.'),
    },
    {
      _key: 'aud-en-2', _type: 'object',
      audience: 'Teams & Managers',
      body: pt("Make informed decisions about which AI tools to adopt, how to budget for API usage across your team, and how to build workflows that won't break the bank as you scale."),
    },
    {
      _key: 'aud-en-3', _type: 'object',
      audience: 'Enterprise Buyers',
      body: pt('Navigate procurement, compliance, data governance, and vendor lock-in risks. Understand the total cost of AI ownership before committing to a platform or provider.'),
    },
  ],

  // ── Sources & Download card ───────────────────────────────────────────
  sourcesTitle: 'Sources & Further Reading',
  sourcesNote: "This page draws primarily from Gartner's 2031 Data, Analytics & AI Top 10 Predictions. If you'd like to read the full report, you can download the original document for reference. The report covers data governance, task-type models, AI agents, automated decision-making, API adoption, and security risk in depth.",
  downloadTitle: '2031 Data, Analytics & AI Top 10 Predictions',
  downloadMeta: 'Gartner Report · PDF',
  downloadUrl: '',   // ← fill in the real PDF URL here if you have it

  // ── FAQ ──────────────────────────────────────────────────────────────
  faq: [],

  // ── SEO ──────────────────────────────────────────────────────────────
  seo: { noindex: false },
};

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, JSON.stringify(doc) + '\n');
console.log(`✓ Wrote ${OUTPUT_PATH}`);
console.log(`\nImport: cd studio && npx sanity dataset import ../${OUTPUT_PATH} production --replace`);
console.log(`\nThen translate: node scripts/translate-page.mjs ${OUTPUT_PATH} es`);
