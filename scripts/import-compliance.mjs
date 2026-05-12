// scripts/import-compliance.mjs
//
// Generates scripts/data/compliancePage-en.ndjson for the `compliancePage` schema.
//
// Usage:  node scripts/import-compliance.mjs
// Import: cd studio && npx sanity dataset import ../scripts/data/compliancePage-en.ndjson production --replace

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';

const OUTPUT_PATH = 'scripts/data/compliancePage-en.ndjson';
const key = () => randomUUID().replace(/-/g, '').slice(0, 12);
function span(text, marks = []) { return { _type: 'span', _key: key(), text, marks }; }
function block(children, extra = {}) {
  return { _type: 'block', _key: key(), style: 'normal', markDefs: [], children: children.length ? children : [span('')], ...extra };
}
function pt(...texts) { return texts.map(t => block([span(t)])); }

const doc = {
  _id: 'compliancePage-en',
  _type: 'compliancePage',
  language: 'en',

  heroLabel:    'Enterprise Solution',
  heroHeadline: 'Enterprise AI Compliance Solution',
  heroSubtitle: 'Deploying AI in your organization is about more than buying an API. From procurement invoicing and data masking to Prompt auditing and internal SOPs — AI Token King helps enterprises build a controllable, verifiable, and deployable AI adoption framework.',

  blockersTitle: 'Where Enterprises Get Stuck with AI',
  blockersIntroBody: pt("The challenge isn't whether to use AI — it's that organizations need to answer several hard questions first:"),
  blockerItems: [
    { _key: key(), _type: 'blockerItem', text: 'How do we handle invoices from overseas AI providers?' },
    { _key: key(), _type: 'blockerItem', text: 'How do we define liability with resellers and vendors?' },
    { _key: key(), _type: 'blockerItem', text: 'Can customer data be sent to external AI APIs?' },
    { _key: key(), _type: 'blockerItem', text: 'Is there an auditable record of data masking?' },
    { _key: key(), _type: 'blockerItem', text: 'Can Prompts and AI responses be audited?' },
    { _key: key(), _type: 'blockerItem', text: 'How do we build an internal AI usage SOP?' },
  ],

  proposalTitle:    'View the Full Enterprise AI Compliance Proposal',
  proposalBody:     'This proposal covers the three most common challenges enterprises face when adopting AI: procurement and invoice compliance, data masking and aggregation platform architecture, and internal control standards when regulations haven\'t fully caught up.',
  proposalCtaLabel: 'View Enterprise AI Compliance Proposal',
  proposalCtaUrl:   '/en/compliance',

  solutionTitle: 'What the Solution Covers',
  solutions: [
    {
      _key: key(), _type: 'solution',
      title: 'Procurement & Invoice Compliance',
      body: pt('Helps enterprises handle local invoicing, contract jurisdiction, procurement workflows, and liability attribution — so AI adoption doesn\'t create accounting or legal gaps.'),
    },
    {
      _key: key(), _type: 'solution',
      title: 'Data Masking & Security Controls',
      body: pt('Before data enters any AI API, sensitive information is identified, masked, and controlled. This creates an auditable record of what was sent — and what wasn\'t.'),
    },
    {
      _key: key(), _type: 'solution',
      title: 'Prompt-Level Auditing',
      body: pt('Logs who used which model, at what time, with what input, and what output was returned. Every AI interaction becomes traceable — essential for regulated industries.'),
    },
    {
      _key: key(), _type: 'solution',
      title: 'Multi-Model Routing & Failover',
      body: pt('Route tasks to the right model based on requirements. Reduces single-model dependency, improves cost control, and maintains continuity when a provider has downtime.'),
    },
    {
      _key: key(), _type: 'solution',
      title: 'Internal SOP Development',
      body: pt('Helps enterprises build AI usage procedures that legal, security, accounting, and audit teams can understand and sign off on — not just technical documentation.'),
    },
  ],

  audienceTitle: 'Who Is This For?',
  audienceItems: [
    {
      _key: key(), _type: 'audienceItem',
      role: 'Financial Sector',
      description: 'Financial institutions, exchanges, virtual asset service providers, securities, insurance, and futures companies.',
    },
    {
      _key: key(), _type: 'audienceItem',
      role: 'Listed Companies',
      description: 'Publicly listed companies with compliance, audit, and governance requirements that extend to AI usage.',
    },
    {
      _key: key(), _type: 'audienceItem',
      role: 'High-Sensitivity Industries',
      description: 'Healthcare, legal, and accounting firms where data sensitivity and professional liability are non-negotiable.',
    },
    {
      _key: key(), _type: 'audienceItem',
      role: 'Platform Companies & Startups',
      description: 'Any company building AI API integrations into their product — especially those handling end-user data at scale.',
    },
  ],
  audienceFootnote: [
    block([
      span('The key signal: ', ['strong']),
      span('If your organization uses AI in ways that touch customer data, internal documents, transaction records, or legal workflows — you need to establish clear AI usage boundaries and an auditing mechanism before you scale.'),
    ]),
  ],

  roleTitle: "AI Token King's Role",
  roles: [
    {
      _key: key(), _type: 'role',
      title: 'Local Representative',
      body: pt('Handles invoicing, contracts, procurement, and liability attribution — bridging the gap between overseas AI providers and local business requirements.'),
    },
    {
      _key: key(), _type: 'role',
      title: 'Technical Value Layer',
      body: pt('Provides data masking, Guardrails, Prompt auditing, and multi-model routing on top of raw API access — adding the compliance layer that providers don\'t offer.'),
    },
    {
      _key: key(), _type: 'role',
      title: 'Multi-Model Aggregation',
      body: pt('Integrates GPT, Claude, Gemini, Qwen, Llama, and more — so enterprises can route tasks by model and maintain failover without managing multiple vendor relationships.'),
    },
  ],

  faqTitle: 'Common Questions',
  faq: [
    {
      _key: key(), _type: 'faqItem',
      question: 'Can enterprises use external AI APIs directly?',
      answer: pt('Yes — but you need to first confirm your data classification, masking procedures, audit trail, contracts, and vendor management mechanisms. Direct API access without these controls creates compliance exposure, especially in regulated industries.'),
    },
    {
      _key: key(), _type: 'faqItem',
      question: 'Is handling data masking ourselves sufficient?',
      answer: pt("Not necessarily. Enterprises also need masking records, Prompt audit logs, vendor commitments, and an internal SOP. Self-managed masking without documentation and process controls won't satisfy most compliance requirements."),
    },
    {
      _key: key(), _type: 'faqItem',
      question: "Is AI Token King replacing the original provider's Enterprise tier?",
      answer: pt("No. AI Token King is better understood as a complement — filling the gap for enterprises that need to embed AI APIs into their products, with data masking, auditing, and multi-model routing that raw provider access doesn't include."),
    },
    {
      _key: key(), _type: 'faqItem',
      question: 'Is this suitable for financial institutions or exchanges?',
      answer: pt('Yes. These industries typically have the strictest requirements around data security, internal controls, auditing, and vendor accountability — which is exactly what this solution is designed to address.'),
    },
  ],

  sidebarCtaTitle: 'Enterprise Inquiry',
  sidebarCtaBody:  "Talk to us about your organization's AI compliance requirements.",
  sidebarCtaLabel: 'Contact Enterprise Sales',
  sidebarCtaUrl:   '/en/compliance',

  seo: {
    seoTitle: 'Enterprise AI Compliance Solution — AI Token King',
    seoDescription: 'AI Token King helps enterprises adopt AI compliantly: invoice handling, data masking, Prompt auditing, multi-model routing, and internal SOP development.',
    noindex: false,
  },
};

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, JSON.stringify(doc) + '\n');
console.log(`✓ Wrote ${OUTPUT_PATH}`);
console.log(`  blockers: ${doc.blockerItems.length} | solutions: ${doc.solutions.length} | audience: ${doc.audienceItems.length} | roles: ${doc.roles.length} | FAQs: ${doc.faq.length}`);
console.log(`\nImport: cd studio && npx sanity dataset import ../${OUTPUT_PATH} production --replace`);
