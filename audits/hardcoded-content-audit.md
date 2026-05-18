# Hardcoded Content Audit — 2026-05-18

## Summary
- Total findings: 79
- Pages with issues: 11 / 13 (blog/index.astro and blog/[slug].astro are clean; chatgpt-api, claude-api, gemini-api are thin wrappers — violations are in ApiModelPage.astro)
- Highest-priority files: `src/components/ApiModelPage.astro`, `src/pages/[lang]/index.astro`, `src/pages/[lang]/token-calculator.astro`, `src/components/Nav.astro`, `src/pages/[lang]/api-compare.astro`

---

## Findings by file

### src/components/Nav.astro
| Line | Text found | Context | Suggested fix |
|---|---|---|---|
| 92 | `"Toggle mobile menu"` | `aria-label` on hamburger button | Add to i18n as `nav.toggleMobileMenu` |
| 20 | `"AI Token King Logo"` | `alt` on logo image in header | Acceptable / brand name — see Acceptable section |

---

### src/components/Footer.astro
Footer is fully covered by `useTranslations`. No violations found.

---

### src/components/ApiModelPage.astro
This component renders for chatgpt-api, claude-api, and gemini-api pages — all three are affected by every finding here.

| Line | Text found | Context | Suggested fix |
|---|---|---|---|
| 75 | `"Compare Models"` | Breadcrumb second level, plain text inside `<a>` | Use `t('nav.compareModels')` — key already exists |
| 82 | `"API Guide"` | Section label badge in hero | Add to i18n as `apiModel.sectionLabel` |
| 134 | `"Pricing Reference"` | Uppercase label inside pricing reference card | Add to i18n as `apiModel.pricingReferenceLabel` |
| 139 | `"View full model comparison"` | CTA link inside pricing reference card | Add to i18n as `apiModel.viewFullComparison` |
| 167 | `page.furtherReadingTitle ?? 'Further Reading'` | Fallback for Further Reading section heading | `furtherReadingTitle` Sanity field exists; fallback "Further Reading" needs i18n key `apiModel.furtherReadingFallback` |
| 189 | `page.faqTitle ?? 'Common Questions'` | Fallback for FAQ heading | `faqTitle` Sanity field exists; fallback "Common Questions" needs i18n key `apiModel.faqFallback` |
| 213 | `"On This Page"` | TOC sidebar heading | Use `t('common.onThisPage')` — key already exists |
| 220 | `page.furtherReadingTitle ?? 'Further Reading'` | TOC link fallback | Same as line 167 |
| 221 | `page.faqTitle ?? 'Common Questions'` | TOC link fallback | Same as line 189 |
| 227 | `"Compare All Models"` | Sidebar CTA card heading | Add to i18n as `apiModel.compareAllModelsTitle` |
| 228 | `"Full live pricing for 60+ text, image, and video models."` | Sidebar CTA card body text | Add to i18n as `apiModel.compareAllModelsBody` |
| 230 | `"View All Models"` | Sidebar CTA button label | Add to i18n as `apiModel.viewAllModelsBtn` |
| 237 | `"Also Compare"` | Sidebar "Also Compare" card heading | Add to i18n as `apiModel.alsoCompareTitle` |
| 41–43 | `'ChatGPT API'`, `'Claude API'`, `'Gemini API'` | `ALL_MODELS` label strings in `alsoCompare` array | Acceptable — these are proper brand names / technical product names |

---

### src/pages/[lang]/index.astro (Homepage)
| Line | Text found | Context | Suggested fix |
|---|---|---|---|
| 44 | `'AI Token King — Your AI Knowledge Hub'` | Hardcoded SEO title fallback string | Add to i18n as `home.seoTitleFallback` or move to Sanity seo field |
| 187 | `"Every API call you make is billed in tokens: input tokens (what you send) and output tokens (what the model generates). Mastering token math is essential for anyone building with AI."` | Second paragraph in token explainer section, fully hardcoded | Add to Sanity `homePage.tokenBody2` field, or add to i18n as `home.tokenBody2` |
| 208 | `"Tokens"` | Label under token count box in visual breakdown | Add to i18n as `home.tokenBreakdownTokensLabel` |
| 212 | `"Characters"` | Label under character count box in visual breakdown | Add to i18n as `home.tokenBreakdownCharsLabel` |
| 120 | `"Model"` | Table header in hero price card | Add to i18n as `home.tableCellModel` |
| 121 | `"Input"` | Table header in hero price card | Add to i18n as `home.tableCellInput` |
| 122 | `"Output"` | Table header in hero price card | Add to i18n as `home.tableCellOutput` |
| 127 | `"GPT-4o"` | Model name in hero table | Acceptable — technical model ID |
| 132 | `"Claude 3.5 Sonnet"` | Model name in hero table | Acceptable — technical model ID |
| 137 | `"Gemini 1.5 Pro"` | Model name in hero table | Acceptable — technical model ID |
| 396 | `"Model"`, `"Provider"`, `"Context Window"`, `"Input (per 1M tokens)"`, `"Output (per 1M tokens)"`, `"Modality"` | Full comparison table headers (6 columns) | Add to i18n as `home.compareColModel`, `home.compareColProvider`, `home.compareColContext`, `home.compareColInput`, `home.compareColOutput`, `home.compareColModality` |
| 401–434 | Model names and provider names in comparison table rows (`GPT-4o`, `GPT-4o mini`, `Claude 3.5 Sonnet`, `Claude 3 Haiku`, `Gemini 1.5 Pro`, `Llama 3.1 405B`; `OpenAI`, `Anthropic`, `Google`, `Meta`) | Table body data | Acceptable — technical model and brand names; prices acceptable as data |
| 404–434 | `"Text"`, `"Vision"`, `"Audio"` | Modality tags in table rows | Add to i18n as `home.modalityText`, `home.modalityVision`, `home.modalityAudio` |
| 524 | `"AI Token Guide"` | `alt` text on placeholder blog card image | Acceptable — placeholder image; will be replaced by real Sanity content |
| 529 | `"Beginner"`, `"Tokens"` | Hardcoded blog card tags on placeholder card | Acceptable — placeholder content |
| 532 | `"The Complete Beginner's Guide to AI Tokens: What They Are and Why They Matter"` | Hardcoded blog card title (placeholder) | Acceptable — placeholder content; real data from Sanity |
| 535 | `"If you've ever wondered why AI APIs charge by the token, or why your prompt suddenly stopped working, this guide is for you."` | Hardcoded blog card excerpt (placeholder) | Acceptable — placeholder content |
| 538 | `"8 min read · AI Token King"` | Hardcoded blog card meta | Acceptable — placeholder content |
| 539 | `"Read More"` | CTA on placeholder blog card | Add to i18n as `home.readMore` (or use `blog.readArticle` which already exists) |
| 549 | `"ChatGPT API vs Gemini API vs Claude API: Which One Should You Use?"` | Hardcoded sidebar blog card title | Acceptable — placeholder |
| 550 | `"6 min read"` | Hardcoded blog card meta | Add to i18n as `home.minuteRead` with interpolation, or acceptable as placeholder |
| 553–568 | Multiple hardcoded side/bottom blog card titles and `"N min read"` labels | Placeholder blog content in homepage | Acceptable as placeholders |
| 577 | `"Why Enterprise AI Teams Need to Care About Token Management"` | Hardcoded blog card title | Acceptable — placeholder |
| 585 | `"Integrating Multiple AI APIs and Aggregators: What You Need to Know"` | Hardcoded blog card title | Acceptable — placeholder |
| 593 | `"How Beginners Should Read AI Token King Before Their First API Call"` | Hardcoded blog card title | Acceptable — placeholder |

---

### src/pages/[lang]/ai-trends.astro
| Line | Text found | Context | Suggested fix |
|---|---|---|---|
| 253 | `"2031 Data, Analytics & AI Top 10 Predictions"` | Hardcoded download card title inside sources section | Add to Sanity `aiTrendsPage` schema as `downloadTitle` field |
| 254 | `"Gartner Report · PDF"` | Hardcoded download card meta | Add to Sanity `aiTrendsPage` schema as `downloadMeta` field |
| 290 | `"FAQ"` | FAQ section heading — hardcoded `<h2>` with the literal string "FAQ" | Add to i18n as `aiTrends.faqHeading` or use a Sanity field `faqTitle` on aiTrendsPage |

---

### src/pages/[lang]/api-compare.astro
| Line | Text found | Context | Suggested fix |
|---|---|---|---|
| 71 | `"Model Reference"` | Section label badge in hero | Add to i18n as `apiCompare.sectionLabel` |
| 134 | `page.pricingCalloutCta ?? 'View Live Pricing'` | CTA button fallback | `pricingCalloutCta` Sanity field exists; fallback needs i18n key `apiCompare.viewLivePricingFallback` |
| 147 | `page.textModelsTitle ?? 'Text Models'` | Section heading fallback | `textModelsTitle` Sanity field exists; fallback needs i18n key `apiCompare.textModelsFallback` |
| 153 | `"Model Name"` | Table header column 1 in all three model tables (text, image, video) | Add to i18n as `apiCompare.tableColModelName` |
| 154 | `"Best For / Use Case"` | Table header column 2 in all three model tables | Add to i18n as `apiCompare.tableColBestFor` |
| 173 | `page.imageModelsTitle ?? 'Image Models'` | Section heading fallback | `imageModelsTitle` Sanity field exists; fallback needs i18n key `apiCompare.imageModelsFallback` |
| 179–180 | `"Model Name"`, `"Best For / Use Case"` | Same table headers repeated for image models | Same as lines 153–154 |
| 199 | `page.videoModelsTitle ?? 'Video Models'` | Section heading fallback | `videoModelsTitle` Sanity field exists; fallback needs i18n key `apiCompare.videoModelsFallback` |
| 205–206 | `"Model Name"`, `"Best For / Use Case"` | Same table headers repeated for video models | Same as lines 153–154 |
| 228 | `page.faqTitle ?? 'Common Questions About Model Types'` | FAQ heading fallback | `faqTitle` Sanity field exists; fallback needs i18n key `apiCompare.faqFallback` |
| 257 | `"View Pricing Table"` | Bottom CTA button — hardcoded label | Add to i18n as `apiCompare.viewPricingTableBtn` |
| 258 | `"Back to Home"` | Second button in bottom CTA section | Add to i18n as `apiCompare.backToHomeBtn` |

---

### src/pages/[lang]/beginners-guide.astro
| Line | Text found | Context | Suggested fix |
|---|---|---|---|
| 90 | `page.stepsTitle ?? 'If You\'re New, Read in This Order'` | Reading order section heading fallback | `stepsTitle` Sanity field exists; fallback needs i18n key `beginners.readingOrderFallback` |
| 114 | `page.stuckTitle ?? 'Where Most Beginners Get Stuck'` | Section heading fallback | `stuckTitle` Sanity field exists; fallback needs i18n key `beginners.stuckFallback` |
| 131 | `page.faqTitle ?? 'Common Questions'` | FAQ heading fallback | `faqTitle` Sanity field exists; fallback needs i18n key `beginners.faqFallback` |
| 151 | `page.nextReadsTitle ?? 'Recommended Next Reads'` | Section heading fallback | `nextReadsTitle` Sanity field exists; fallback needs i18n key `beginners.nextReadsFallback` |
| 172 | `"Compare Models"` | CTA button inside closing CTA block | Use `t('nav.compareModels')` — key already exists |
| 186 | `page.stepsTitle ?? 'Reading Order'` | TOC sidebar link fallback (different fallback from line 90!) | Unify with one i18n key `beginners.readingOrderFallback` |
| 187 | `page.stuckTitle ?? 'Where Beginners Get Stuck'` | TOC sidebar link fallback (different text than line 114!) | Unify with one i18n key `beginners.stuckFallback` |
| 188 | `page.faqTitle ?? 'Common Questions'` | TOC fallback | Same as line 131 |
| 189 | `page.nextReadsTitle ?? 'Recommended Next Reads'` | TOC fallback | Same as line 151 |
| 193 | `"Compare AI Models"` | Sidebar CTA heading | Add to i18n as `beginners.sidebarCtaTitle` |
| 194 | `"Full live pricing for 60+ text, image, and video models."` | Sidebar CTA body | Add to i18n as `beginners.sidebarCtaBody` |
| 196 | `"Compare Models"` | Sidebar CTA button | Use `t('nav.compareModels')` — key already exists |

---

### src/pages/[lang]/token-calculator.astro
| Line | Text found | Context | Suggested fix |
|---|---|---|---|
| 79 | `"Paste or type your text below"` | Label for `<textarea>` input | Add to i18n as `calculator.inputLabel` |
| 85 | `"Enter your text here..."` | `placeholder` on textarea | Add to i18n as `calculator.inputPlaceholder` |
| 88 | `"0 characters"` | Initial char count display (also set dynamically via JS on line 239) | Add to i18n as `calculator.charCountInitial`; JS on line 239 also hardcodes `' characters'` suffix — needs i18n |
| 95 | `"Calculate Tokens"` | Primary button label | Add to i18n as `calculator.calculateBtn` |
| 98 | `"Clear"` | Secondary button label | Add to i18n as `calculator.clearBtn` |
| 104 | `"Estimation Results"` | Results section heading (rendered by JS, set on page init) | Add to i18n as `calculator.resultsHeading` |
| 109 | `"Chinese Chars"` | Result stat label | Add to i18n as `calculator.chineseCharsLabel` |
| 113 | `"English Words"` | Result stat label | Add to i18n as `calculator.englishWordsLabel` |
| 117 | `"Symbols"` | Result stat label | Add to i18n as `calculator.symbolsLabel` |
| 121 | `"Est. Input Tokens"` | Result stat label | Add to i18n as `calculator.estInputTokensLabel` |
| 134 | `"OpenAI GPT-4o"` | Cost card model label | Acceptable — technical model/brand name |
| 136 | `"$2.50 / 1M tokens (input)"` | Cost card pricing note | Add to i18n as `calculator.priceNoteOpenai` (or acceptable as data) |
| 145 | `"Claude 3.5 Sonnet"` | Cost card model label | Acceptable — technical model/brand name |
| 147 | `"$3.00 / 1M tokens (input)"` | Cost card pricing note | Add to i18n as `calculator.priceNoteClaude` (or acceptable as data) |
| 156 | `"Gemini 1.5 Pro"` | Cost card model label | Acceptable — technical model/brand name |
| 158 | `"$1.25 / 1M tokens (input)"` | Cost card pricing note | Add to i18n as `calculator.priceNoteGemini` (or acceptable as data) |
| 165–166 | `"* Estimates only. Actual token counts may vary by model tokenizer. Prices are approximate and subject to change — verify at each provider's pricing page."` | Disclaimer paragraph | Add to i18n as `calculator.disclaimer` |
| 181 | `page.faqTitle ?? 'About the Token Calculator'` | FAQ heading fallback | `faqTitle` Sanity field exists; fallback needs i18n key `calculator.faqFallback` |
| 211 | `"Compare Models"` | CTA button in closing banner | Use `t('nav.compareModels')` — key already exists |
| 239 | `+ ' characters'` | JS string appended to char count | See line 88 note |

---

### src/pages/[lang]/compliance.astro
| Line | Text found | Context | Suggested fix |
|---|---|---|---|
| 91 | `page.blockersTitle ?? 'Where Enterprises Get Stuck with AI'` | Section heading fallback | `blockersTitle` Sanity field exists; fallback needs i18n key `compliance.blockersFallback` |
| 114 | `"Enterprise Proposal"` | Hardcoded label inside proposal CTA div | Add to i18n as `compliance.enterpriseProposalLabel` |
| 118 | `page.proposalCtaLabel ?? 'View Enterprise Proposal'` | CTA button label fallback | `proposalCtaLabel` Sanity field exists; fallback needs i18n key `compliance.proposalCtaFallback` |
| 129 | `page.solutionTitle ?? 'What the Solution Covers'` | Section heading fallback | `solutionTitle` Sanity field exists; fallback needs i18n key `compliance.solutionTitleFallback` |
| 144 | `page.audienceTitle ?? 'Who Is This For?'` | Section heading fallback | `audienceTitle` Sanity field exists; fallback needs i18n key `compliance.audienceFallback` |
| 165 | `page.roleTitle ?? 'AI Token King\'s Role'` | Section heading fallback | `roleTitle` Sanity field exists; fallback needs i18n key `compliance.roleFallback` |
| 179 | `page.faqTitle ?? 'Common Questions'` | FAQ heading fallback | `faqTitle` Sanity field exists; fallback needs i18n key `compliance.faqFallback` |
| 203 | `page.blockersTitle ?? 'Where Enterprises Get Stuck'` | TOC link fallback (different text than line 91 — note "with AI" truncated) | Unify fallback text with one i18n key |
| 204 | `"Enterprise Proposal"` | TOC link label, hardcoded | Use i18n key `compliance.enterpriseProposalLabel` (same as line 114) |
| 205 | `page.solutionTitle ?? 'What the Solution Covers'` | TOC link fallback | Same as line 129 |
| 206 | `page.audienceTitle ?? 'Who Is This For?'` | TOC link fallback | Same as line 144 |
| 207 | `page.roleTitle ?? 'AI Token King\'s Role'` | TOC link fallback | Same as line 165 |
| 208 | `page.faqTitle ?? 'Common Questions'` | TOC link fallback | Same as line 179 |
| 212 | `page.sidebarCtaTitle ?? 'Enterprise Inquiry'` | Sidebar CTA title fallback | `sidebarCtaTitle` Sanity field exists; fallback needs i18n key `compliance.sidebarCtaTitleFallback` |
| 215 | `page.sidebarCtaLabel ?? 'Contact Enterprise Sales'` | Sidebar CTA button fallback | `sidebarCtaLabel` Sanity field exists; fallback needs i18n key `compliance.sidebarCtaLabelFallback` |

---

### src/pages/[lang]/user-guide.astro
| Line | Text found | Context | Suggested fix |
|---|---|---|---|
| 110 | `page.featuresTitle ?? 'Core Features'` | Section heading fallback | `featuresTitle` Sanity field exists; fallback needs i18n key `userGuide.featuresFallback` |
| 129 | `page.modelsTitle ?? 'Supported AI Models'` | Section heading fallback | `modelsTitle` Sanity field exists; fallback needs i18n key `userGuide.modelsFallback` |
| 153 | `page.audienceTitle ?? 'Who Is It For?'` | Section heading fallback | `audienceTitle` Sanity field exists; fallback needs i18n key `userGuide.audienceFallback` |
| 177 | `page.gettingStartedTitle ?? 'How to Get Started'` | Section heading fallback | `gettingStartedTitle` Sanity field exists; fallback needs i18n key `userGuide.gettingStartedFallback` |
| 194 | `page.faqTitle ?? 'Common Questions'` | FAQ heading fallback | `faqTitle` Sanity field exists; fallback needs i18n key `userGuide.faqFallback` |
| 220 | `page.featuresTitle ?? 'Core Features'` | TOC link fallback | Same as line 110 |
| 221 | `page.modelsTitle ?? 'Supported Models'` | TOC link fallback (note: "Supported Models" vs "Supported AI Models" on line 129) | Unify with one i18n key |
| 222 | `page.audienceTitle ?? 'Who Is It For?'` | TOC link fallback | Same as line 153 |
| 225 | `page.gettingStartedTitle ?? 'Getting Started'` | TOC link fallback (different text from line 177's "How to Get Started") | Unify fallback text |
| 226 | `page.faqTitle ?? 'Common Questions'` | TOC link fallback | Same as line 194 |
| 230 | `"Get Started Free"` | Sidebar CTA heading | Add to i18n as `userGuide.sidebarCtaTitle` |
| 231 | `"Start using AI Token King to manage and optimize your AI usage."` | Sidebar CTA body text | Add to i18n as `userGuide.sidebarCtaBody` |
| 233 | `"Get Started"` | Sidebar CTA button label | Add to i18n as `userGuide.sidebarCtaBtn` (or use `nav.getStarted` — key exists) |

---

### src/pages/[lang]/use-cases.astro
No hardcoded violations found. All content comes from Sanity fields (`uc.title`, `uc.description`, `uc.commonDirections`) and all structural chrome comes from Sanity or uses i18n correctly.

---

### src/pages/[lang]/blog/index.astro
No hardcoded violations found. All content is from i18n keys or Sanity post data.

---

### src/pages/[lang]/blog/[slug].astro
| Line | Text found | Context | Suggested fix |
|---|---|---|---|
| 116 | `"X / Twitter"` | Share button label | Acceptable — social platform brand name |
| 120 | `"LinkedIn"` | Share button label | Acceptable — social platform brand name |

---

## Findings categorized by fix type

### Already-Existing i18n Keys Not Being Used (highest priority — zero-effort fixes)
These strings already have a translation key; the template just isn't using it.

| File | Line | Text | Existing key to use |
|---|---|---|---|
| ApiModelPage.astro | 75 | "Compare Models" (breadcrumb) | `nav.compareModels` |
| ApiModelPage.astro | 213 | "On This Page" (TOC heading) | `common.onThisPage` |
| beginners-guide.astro | 172 | "Compare Models" (CTA button) | `nav.compareModels` |
| beginners-guide.astro | 196 | "Compare Models" (sidebar button) | `nav.compareModels` |
| token-calculator.astro | 211 | "Compare Models" (CTA button) | `nav.compareModels` |
| user-guide.astro | 233 | "Get Started" (sidebar button) | `nav.getStarted` |

---

### i18n Dictionary Additions Needed (UI labels, not page-specific content)
These are structural UI labels that should not be in Sanity (they don't vary by page).

| File | Line | Text | Suggested key |
|---|---|---|---|
| Nav.astro | 92 | "Toggle mobile menu" | `nav.toggleMobileMenu` |
| ApiModelPage.astro | 82 | "API Guide" | `apiModel.sectionLabel` |
| ApiModelPage.astro | 134 | "Pricing Reference" | `apiModel.pricingReferenceLabel` |
| ApiModelPage.astro | 139 | "View full model comparison" | `apiModel.viewFullComparison` |
| ApiModelPage.astro | 167 | "Further Reading" (fallback) | `apiModel.furtherReadingFallback` |
| ApiModelPage.astro | 189 | "Common Questions" (fallback) | `apiModel.faqFallback` |
| ApiModelPage.astro | 227 | "Compare All Models" | `apiModel.compareAllModelsTitle` |
| ApiModelPage.astro | 228 | "Full live pricing for 60+ text, image, and video models." | `apiModel.compareAllModelsBody` |
| ApiModelPage.astro | 230 | "View All Models" | `apiModel.viewAllModelsBtn` |
| ApiModelPage.astro | 237 | "Also Compare" | `apiModel.alsoCompareTitle` |
| api-compare.astro | 71 | "Model Reference" | `apiCompare.sectionLabel` |
| api-compare.astro | 134 | "View Live Pricing" (fallback) | `apiCompare.viewLivePricingFallback` |
| api-compare.astro | 147 | "Text Models" (fallback) | `apiCompare.textModelsFallback` |
| api-compare.astro | 153 | "Model Name" | `apiCompare.tableColModelName` |
| api-compare.astro | 154 | "Best For / Use Case" | `apiCompare.tableColBestFor` |
| api-compare.astro | 173 | "Image Models" (fallback) | `apiCompare.imageModelsFallback` |
| api-compare.astro | 199 | "Video Models" (fallback) | `apiCompare.videoModelsFallback` |
| api-compare.astro | 228 | "Common Questions About Model Types" (fallback) | `apiCompare.faqFallback` |
| api-compare.astro | 257 | "View Pricing Table" | `apiCompare.viewPricingTableBtn` |
| api-compare.astro | 258 | "Back to Home" | `apiCompare.backToHomeBtn` |
| beginners-guide.astro | 90 | "If You're New, Read in This Order" (fallback) | `beginners.readingOrderFallback` |
| beginners-guide.astro | 114 | "Where Most Beginners Get Stuck" (fallback) | `beginners.stuckFallback` |
| beginners-guide.astro | 131 | "Common Questions" (fallback) | `beginners.faqFallback` |
| beginners-guide.astro | 151 | "Recommended Next Reads" (fallback) | `beginners.nextReadsFallback` |
| beginners-guide.astro | 193 | "Compare AI Models" | `beginners.sidebarCtaTitle` |
| beginners-guide.astro | 194 | "Full live pricing for 60+ text, image, and video models." | `beginners.sidebarCtaBody` |
| token-calculator.astro | 79 | "Paste or type your text below" | `calculator.inputLabel` |
| token-calculator.astro | 85 | "Enter your text here..." | `calculator.inputPlaceholder` |
| token-calculator.astro | 88/239 | "0 characters" / " characters" suffix | `calculator.charCountInitial` / `calculator.charCountSuffix` |
| token-calculator.astro | 95 | "Calculate Tokens" | `calculator.calculateBtn` |
| token-calculator.astro | 98 | "Clear" | `calculator.clearBtn` |
| token-calculator.astro | 104 | "Estimation Results" | `calculator.resultsHeading` |
| token-calculator.astro | 109 | "Chinese Chars" | `calculator.chineseCharsLabel` |
| token-calculator.astro | 113 | "English Words" | `calculator.englishWordsLabel` |
| token-calculator.astro | 117 | "Symbols" | `calculator.symbolsLabel` |
| token-calculator.astro | 121 | "Est. Input Tokens" | `calculator.estInputTokensLabel` |
| token-calculator.astro | 136/147/158 | "$2.50 / 1M tokens (input)" etc. | `calculator.priceNoteOpenai`, `calculator.priceNoteClaude`, `calculator.priceNoteGemini` |
| token-calculator.astro | 165–166 | Disclaimer text | `calculator.disclaimer` |
| token-calculator.astro | 181 | "About the Token Calculator" (fallback) | `calculator.faqFallback` |
| compliance.astro | 91 | "Where Enterprises Get Stuck with AI" (fallback) | `compliance.blockersFallback` |
| compliance.astro | 114/204 | "Enterprise Proposal" | `compliance.enterpriseProposalLabel` |
| compliance.astro | 118 | "View Enterprise Proposal" (fallback) | `compliance.proposalCtaFallback` |
| compliance.astro | 129 | "What the Solution Covers" (fallback) | `compliance.solutionTitleFallback` |
| compliance.astro | 144 | "Who Is This For?" (fallback) | `compliance.audienceFallback` |
| compliance.astro | 165 | "AI Token King's Role" (fallback) | `compliance.roleFallback` |
| compliance.astro | 179 | "Common Questions" (fallback) | `compliance.faqFallback` |
| compliance.astro | 212 | "Enterprise Inquiry" (fallback) | `compliance.sidebarCtaTitleFallback` |
| compliance.astro | 215 | "Contact Enterprise Sales" (fallback) | `compliance.sidebarCtaLabelFallback` |
| user-guide.astro | 110 | "Core Features" (fallback) | `userGuide.featuresFallback` |
| user-guide.astro | 129 | "Supported AI Models" (fallback) | `userGuide.modelsFallback` |
| user-guide.astro | 153 | "Who Is It For?" (fallback) | `userGuide.audienceFallback` |
| user-guide.astro | 177 | "How to Get Started" (fallback) | `userGuide.gettingStartedFallback` |
| user-guide.astro | 194 | "Common Questions" (fallback) | `userGuide.faqFallback` |
| user-guide.astro | 230 | "Get Started Free" | `userGuide.sidebarCtaTitle` |
| user-guide.astro | 231 | "Start using AI Token King to manage and optimize your AI usage." | `userGuide.sidebarCtaBody` |
| index.astro | 44 | "AI Token King — Your AI Knowledge Hub" | `home.seoTitleFallback` |
| index.astro | 208/212 | "Tokens" / "Characters" | `home.tokenBreakdownTokensLabel` / `home.tokenBreakdownCharsLabel` |
| index.astro | 120–122 | "Model", "Input", "Output" (hero table headers) | `home.tableCellModel`, `home.tableCellInput`, `home.tableCellOutput` |
| index.astro | 396 | 6x comparison table column headers | `home.compareColModel` … `home.compareColModality` |
| index.astro | 404–434 | "Text", "Vision", "Audio" (modality tags) | `home.modalityText`, `home.modalityVision`, `home.modalityAudio` |
| index.astro | 539 | "Read More" | `home.readMore` (or reuse `blog.readArticle`) |
| ai-trends.astro | 290 | "FAQ" (h2 heading) | `aiTrends.faqHeading` |

---

### Sanity Schema Additions Needed (page-specific content)
These strings are editorial content that would ideally be editable per language in the CMS.

| File | Line | Text | Schema | Suggested field name |
|---|---|---|---|---|
| index.astro | 187 | Second token explainer paragraph ("Every API call you make is billed in tokens…") | `homePage` | `tokenBody2` |
| ai-trends.astro | 253 | "2031 Data, Analytics & AI Top 10 Predictions" | `aiTrendsPage` | `downloadTitle` |
| ai-trends.astro | 254 | "Gartner Report · PDF" | `aiTrendsPage` | `downloadMeta` |

Note: The `aiTrendsPage` download card is fully hardcoded — not just the fallback but the entire content. The download link `href="#"` is also a placeholder. Both the title, meta, and URL should become editable Sanity fields.

---

### Acceptable / Intentional (technical IDs, brand names, placeholders)
| File | Line | Text | Reason |
|---|---|---|---|
| Nav.astro | 20 | "AI Token King Logo" (alt) | Brand name in alt text — acceptable |
| index.astro | 127/132/137 | "GPT-4o", "Claude 3.5 Sonnet", "Gemini 1.5 Pro" (hero table) | Technical model IDs — not translatable |
| index.astro | 401–434 | Model names, provider names, pricing data in comparison table | Technical data — not translatable; note that this table is entirely hardcoded and could be moved to Sanity in a future task |
| index.astro | 524–593 | All placeholder blog cards (titles, excerpts, tags, read times) | Placeholder content — will be replaced by live Sanity posts |
| ApiModelPage.astro | 41–43 | `'ChatGPT API'`, `'Claude API'`, `'Gemini API'` in alsoCompare array | Official product names — not translatable |
| api-compare.astro | 129 | `"Live"` badge text | Short technical badge — borderline; could add i18n key `apiCompare.liveBadge` if needed |
| token-calculator.astro | 134/145/156 | "OpenAI GPT-4o", "Claude 3.5 Sonnet", "Gemini 1.5 Pro" | Technical model/brand names |
| blog/[slug].astro | 116/120 | "X / Twitter", "LinkedIn" | Social platform brand names |

---

## Recommended next steps

### 1. Zero-effort fixes (reuse existing keys)
In the following locations, replace the hardcoded string with the already-translated `t()` call:
- `ApiModelPage.astro` line 75: replace `"Compare Models"` with `{t('nav.compareModels')}`
- `ApiModelPage.astro` line 213: replace `"On This Page"` with `{t('common.onThisPage')}`
- `beginners-guide.astro` lines 172 and 196: replace `"Compare Models"` with `{t('nav.compareModels')}`
- `token-calculator.astro` line 211: replace `"Compare Models"` with `{t('nav.compareModels')}`
- `user-guide.astro` line 233: replace `"Get Started"` with `{t('nav.getStarted')}`
- `index.astro` line 539: replace `"Read More"` with `{t('blog.readArticle')}`

### 2. New i18n namespace additions
Add the following namespaces (with all keys listed above) to both `en.json` and `es.json`:
- `apiModel` namespace: 8 new keys (sectionLabel, pricingReferenceLabel, viewFullComparison, furtherReadingFallback, faqFallback, compareAllModelsTitle, compareAllModelsBody, viewAllModelsBtn, alsoCompareTitle)
- `apiCompare` namespace: 9 new keys (sectionLabel, viewLivePricingFallback, textModelsFallback, imageModelsFallback, videoModelsFallback, tableColModelName, tableColBestFor, faqFallback, viewPricingTableBtn, backToHomeBtn)
- `beginners` namespace: 6 new keys (readingOrderFallback, stuckFallback, faqFallback, nextReadsFallback, sidebarCtaTitle, sidebarCtaBody)
- `calculator` namespace: 12 new keys (inputLabel, inputPlaceholder, charCountInitial, charCountSuffix, calculateBtn, clearBtn, resultsHeading, chineseCharsLabel, englishWordsLabel, symbolsLabel, estInputTokensLabel, priceNoteOpenai, priceNoteClaude, priceNoteGemini, disclaimer, faqFallback)
- `compliance` namespace: 8 new keys (blockersFallback, enterpriseProposalLabel, proposalCtaFallback, solutionTitleFallback, audienceFallback, roleFallback, faqFallback, sidebarCtaTitleFallback, sidebarCtaLabelFallback)
- `userGuide` namespace: 7 new keys (featuresFallback, modelsFallback, audienceFallback, gettingStartedFallback, faqFallback, sidebarCtaTitle, sidebarCtaBody)
- `nav` namespace addition: 1 new key (toggleMobileMenu)
- `aiTrends` namespace addition: 1 new key (faqHeading)
- `home` namespace additions: ~12 new keys (seoTitleFallback, tokenBody2 or keep in Sanity, tokenBreakdownTokensLabel, tokenBreakdownCharsLabel, tableCellModel, tableCellInput, tableCellOutput, compareColModel through compareColModality, modalityText, modalityVision, modalityAudio, readMore)

**Important:** The `token-calculator.astro` has JS strings that also need to be handled. Because the calculator logic runs client-side as `is:inline` JS, these strings cannot use Astro's `t()` function at runtime. The recommended approach is to render the translated strings as `data-*` attributes on the elements and read them from JS, similar to how the copy-link button already works in `blog/[slug].astro` (lines 122, 188–189).

### 3. Sanity schema additions
- `aiTrendsPage` schema: Add `downloadTitle` (string), `downloadMeta` (string), `downloadUrl` (string) fields so the Gartner report card is editable and translatable per language.
- `homePage` schema: Add `tokenBody2` (portable text) field for the second paragraph in the token explainer section, to make it translatable alongside `tokenBody1`.
- Long-term: The entire comparison table in `index.astro` (lines 392–438) is hardcoded with static model data and could be moved to a Sanity `featuredModels` array field on `homePage`, making it updatable without a code deploy.

### 4. Consistency issues to fix
- `beginners-guide.astro`: The fallback text for the stuckTitle section differs between article body (line 114: "Where Most Beginners Get Stuck") and TOC (line 187: "Where Beginners Get Stuck"). Pick one and use a shared i18n key.
- `user-guide.astro`: The modelsTitle fallback is "Supported AI Models" in the article (line 129) but "Supported Models" in the TOC (line 221). Pick one and use a shared i18n key.
- `user-guide.astro`: The gettingStartedTitle fallback is "How to Get Started" in the article (line 177) but "Getting Started" in the TOC (line 225). Pick one and use a shared i18n key.
- `compliance.astro`: The blockersTitle fallback is "Where Enterprises Get Stuck with AI" (line 91) vs "Where Enterprises Get Stuck" (line 203). Pick one and use a shared i18n key.
