# AI Token Global — 專案稽核總結報告

**日期：** 2026-05-07
**製作單位：** 專案總監（綜合技術、SEO 與自動化稽核結果）
**閱讀對象：** 專案決策者
**待回答問題：** 是否值得繼續投入資源於 AI Token Global 專案？

---

## 〇、專案背景（為首次接觸本專案的讀者準備）

本章節為從未參與本專案的讀者提供脈絡。已熟悉本專案的讀者可直接跳至第一章。

### 網站定位

AI Token Global 是一個正在建置中的多語系內容平台，目的在於向英語為主的西方讀者介紹 AI tokens、模型定價、API 選擇、使用情境與最佳實踐。本網站是台灣品牌「**AI Token King**」的國際版延伸——其繁體中文版網站位於 `aitoken.com.tw`。中文網站是內容來源：所有文案皆從中文翻譯並進行西方語境調整（非原創），同時搭配重新設計的視覺呈現。長期計畫為支援 10–15 種語言，首發語對為英文與西班牙文。

品牌吉祥物為戴著皇冠的柯基犬，主色為紫色 `#6155F1`，設計系統採用 Kanit（標題字體）搭配 Plus Jakarta Sans（內文字體）。`CLAUDE.md` 中明訂「反通用化」設計守則——禁用預設 Tailwind 藍／靛、禁用 `transition-all`、僅允許層次化陰影與漸層——以維持網站的視覺辨識度。

### 技術堆疊（已定案）

架構決策已審慎拍板，不再開放討論。任何稽核建議皆於下列限制**之內**論述：

- **Astro** 作為靜態網站產生框架，於建置時產生頁面
- **Sanity CMS** 作為內容資料庫（專案 ID `mq3wxr8n`、dataset `production`）
- **AWS Amplify** 作為主機服務（採 CloudFront-backed CDN）

GitHub 儲存庫為 `antonioduran-insight/AI_Token_Global`，Astro 專案位於根目錄，Sanity Studio 位於 `studio/` 子目錄。已驗證的內容模式為：每個（頁面 × 語言）對應一份 Sanity 文件、內文欄位皆使用 Portable Text、`[lang]` 動態路由迭代 `SUPPORTED_LANGS` 常數——意味著新增一語言應只需**修改一個常數＋輸入內容**，無需任何頁面層級程式碼變更。

### 內容流程運作方式

編輯者於 Sanity Studio（本地開發為 `localhost:3333`）進行作業，發佈標記 `language` 欄位的文件。Astro 於建置時抓取 Sanity 資料並靜態產生所有語言變體。因此 `/en/ai-trends` 與 `/es/ai-trends` 為不同文件但共用同一 `.astro` 樣板。**目前缺口：** 尚未配置 Sanity 至 Amplify 的 webhook，內容發佈不會觸發重新建置——正式網站會維持過時狀態，直到下一次 `git push`。配置此 webhook 是整個專案中最大的單點槓桿。

### 目前進度（2026 年 5 月，12 個工作回合後）

**已完成：** 專案結構重整（Astro 移至根目錄、HTML 原型歸檔）；Nav 與 Footer 中的動態語言切換器；於 AI Trends 頁建置並驗證 Sanity schema POC（其餘所有頁面皆將沿用此模式）；部落格路由運作中、三篇英文文章已上線；AWS Amplify 部署指引已撰寫完成。

**未完成：** 14 個規劃頁面中仍有 10 個僅以 HTML 原型形式存在於 `archive/` 中——需以 Sanity 單例模式移植至 Astro（此為下一個進行中的任務）；首頁 (`/en/`、`/es/`) 仍為「Coming Soon」佔位符；網站尚未部署至 Amplify；目前完全沒有 SEO 基礎建設（無 `robots.txt`、無 sitemap、無 `hreflang`、無 Open Graph 標籤、Sanity schema 中無任何 SEO 欄位）；第 3 至 15 種語言尚未進入詳細規劃。

### 14 個頁面總覽

四個頁面已運作：`/en/`、`/es/`（佔位符）、AI Trends、部落格首頁、部落格文章樣板。剩餘 10 個頁面分批移植：**Batch A**（四個 API 模型頁——`api-compare`、`chatgpt-api`、`claude-api`、`gemini-api`）；**Batch B**（五個指南頁——`beginners-guide`、`user-guide`、`use-cases`、`token-calculator`、`compliance`）；**Batch C**（首頁，因結構最複雜留待最後處理）。

### 團隊規模與預算輪廓

團隊規模小——隱含為一名技術維運者加一名編輯。成本曲線友善：目前每月約 1.25 美元（僅網域）；12 個月後預估每月 26–34 美元（5 種以上語言、約 5 萬訪客）；完整 15 語系規模上限約每月 50–60 美元。最大隱性成本為**人工內容輸入**——若無批次遷移腳本，匯入既有 200 篇以上文章需 80–120 小時；有腳本則僅需約 10–13 小時。

### 任何接手者必須先知道的限制

- **架構決策不開放討論。** Astro + Sanity + Amplify、`[lang]` 路由、Sanity-first 內容、Portable Text 皆已定案。在這些選擇之內的實作落差可討論；選擇本身不可動。
- **Sanity-first 意味著 `.astro` 檔案中不得出現硬編碼英文。** 所有 UI 字串皆位於 `src/i18n/{en,es}.json` 或 Sanity 中。本稽核發現多處違規，導致西語使用者仍看到英文 UI 標籤。
- **任何假設「恰好為 EN+ES」的程式碼將在第 3 種語言時靜默損壞。** 稽核已標出兩處（部落格頁面的 `locale` 三元運算式與 post schema 中的靜態 `language` 列表），擴展前必須修正。
- **行動裝置流量預期將佔大宗，** 但目前尚未進行專屬的行動端稽核。現有三份稽核涵蓋技術、SEO 與自動化；行動裝置顯示優化為已知缺口，上線前可能需追加第四份專家稽核。

---

## 一、執行摘要

**建議：可繼續投入，但須先處理三項條件（GO WITH CAVEATS）。** 整體架構紮實，團隊在 12 個工作回合中已交付實質進度，但在邁向下一個里程碑（部署到 AWS Amplify）以及擴展到第三語言之前，必須優先處理三項具體缺口。

### 三大優勢

1. **核心架構正確且已定案。** 動態 `[lang]` 路由、Sanity-first 內容模式、以 `SUPPORTED_LANGS` 為基礎的 `getStaticPaths()` 以及語言切換器，皆按設計運作。沒有任何會中斷建置的問題。Astro + Sanity + AWS Amplify 的組合在預算範圍內，是支撐 15 語系內容平台的正確選擇。
2. **Sanity 結構描述（schema）品質高，POC 模式可直接複用。** `post` 與 `aiTrendsPage` 都採用 Portable Text 處理內文欄位、必填 `language`、並正確重複使用 `faqItem`。此模式無須重新設計即可擴展至剩餘 11 個頁面結構描述。
3. **成本曲線非常友善。** 目前每月支出約為 1.25 美元（僅網域費用）。在 12 個月後達到 5 種以上語言、每月 5 萬訪客、每日 20 篇內容發佈的規模時，預估每月成本為 26–34 美元。即使達到完整 15 語系規模，預算仍可控制在每月 60 美元以下，遠低於可承受範圍。

### 三大風險

1. **`.env` 檔案被納入 git 版本控管，** 內含實際的 Sanity 專案 ID。這違反該檔案標頭自身的警告文字，存在安全與配額濫用的暴露風險。**無論其他事項優先順序為何，必須在下次 push 前先行處理。**
2. **目前完全沒有 SEO 基礎建設。** 無 `robots.txt`、無 sitemap、無 canonical 標籤、無 `hreflang`、無 Open Graph 標籤、所有 Sanity 結構描述中也未設置任何 SEO 欄位。在這狀態下上線意味著英文與西文頁面會互相競爭相同關鍵字排名，且每一次社群分享都會產生空白預覽。
3. **兩處潛藏的 EN/ES 假設將在第三語言加入時悄悄損壞。** 兩個部落格頁面內的 `locale` 三元運算式（`lang === 'es' ? 'es-ES' : 'en-US'`）以及 `studio/schemas/post.ts` 中的靜態語言列表，正是 Session 11 已特別警告過的迴歸風險。新增任何第三語言之前必須修正這兩處，否則文件中宣稱的「只需新增一個常數＋ Sanity 內容」承諾將不成立。

### 30 天優先事項

- **第一週：安全性與 SEO 基礎。** 將 `.env` 從 git 移除、在 `aiTrendsPage` 與 `post` 結構描述加入 `seo` 物件、在 `BaseLayout.astro` 加入 `<link rel="canonical">`、`hreflang` 與 Open Graph 標籤、安裝 `@astrojs/sitemap`、建立 `public/robots.txt`。**現在執行**——在 Task #5 將單例模式複製到 11 個頁面之前——可避免將同一個問題修 11 次。
- **第二週：部署基礎建設。** 將 `amplify.yml` 加入專案根目錄、在 Amplify Console 設定環境變數、配置 Sanity → Amplify webhook（這是整個專案中最大的單點槓桿——若沒有它，每次內容發佈都會讓正式網站維持過時狀態）。
- **第三週：批次資料遷移腳本。** 撰寫 `scripts/upload-images.js` 與 `scripts/convert-articles.js`。這兩支腳本可將原本 80–120 小時的人工資料輸入工作壓縮為 10–13 小時。
- **第四週：開始 Task #5 頁面移植。** 從 Batch A（四個 API 模型頁面）著手，採用第一週完成的 SEO 強化版單例模式。

### 成本軌跡

| 階段 | 語言數 | 流量 | 建置活動 | 每月成本 |
|---|---|---|---|---|
| 目前（上線前） | 2（EN + ES） | 0 | 0 次建置 | 約 1.25 美元 |
| 第 6 個月 | 2 | 約 5,000 訪客 | 每日約 10 次發佈 | 約 3–5 美元 |
| 第 12 個月 | 5 種以上 | 約 5 萬訪客 | 每日約 20 次發佈 | 約 26–34 美元 |
| 完整規模 | 15 | 每日發佈 | 全語系運作中 | 約 50–60 美元 |

目前團隊（一名技術維運人員＋一名編輯）在第 12 個月之前皆可維持運作，前提是在新增第三語言之前先建立 AI 翻譯草稿管線。超過此規模後，需透過外包譯者或讓 AI 維運管線在量產層級運作，方能維持品質。

---

## 二、風險矩陣

以下將三份專家稽核中的所有發現依影響層級分類。嚴重度為總監綜合判斷，可能與原稽核員評級不同。

### A 級——阻擋上線（無法部署或上線後將明顯損壞）

| 編號 | 發現項目 | 來源 | 工時 | 對應任務 |
|---|---|---|---|---|
| A-01 | 專案根目錄缺少 `amplify.yml`；建置規格未版本控管 | 自動化 | 小（1 小時） | #8 |
| A-02 | Sanity → Amplify 發佈 webhook 完全未配置——內容編輯不會觸發重新建置 | 自動化 | 小（30 分鐘） | #8 |
| A-03 | Amplify Console 環境變數（`PUBLIC_SANITY_PROJECT_ID`、`PUBLIC_SANITY_DATASET`）未設定——首次部署將回傳空 Sanity 查詢結果且不會報錯 | 自動化 | 小（10 分鐘） | #8 |
| F-01 | `.env` 已被納入 git，含實際的 `mq3wxr8n` 專案 ID，違反 gitignore 規範 | 技術 | 小（5 分鐘） | #8（安全閘） |
| S-01 | 無 `public/robots.txt`——搜尋引擎沒有爬取指引或 sitemap 指標 | SEO | 小（15 分鐘） | #9 |
| S-04 | `astro.config.mjs` 缺少 `site` URL，且 sitemap 整合未安裝 | SEO | 小（30 分鐘） | #9 |
| S-02 / S-03 / S-05 | 無 `hreflang` 標籤；即使安裝 sitemap，也不會包含 hreflang 叢集 | SEO | 中（3–4 小時） | #9 |
| S-06 | 任一頁面皆無 `<link rel="canonical">` | SEO | 小（30 分鐘） | #9 |
| S-07 / S-08 | 無 Open Graph 與 Twitter Card 標籤——每次社群分享都會產生空白預覽 | SEO | 中（2–3 小時） | #9 |
| S-18 | 「Coming Soon」首頁將被搜尋引擎以薄弱內容索引；尚無 `noindex` 機制 | SEO | 小（30 分鐘） | #9 或 #5 |

**A 級項目共 9 項。** 其中 8 項屬於兩個已知的待辦任務（#8 部署與 #9 SEO）——這些並非意外發現，而是團隊原本即計畫處理的工作。稽核確認範圍認定正確；本層級唯一真正的新發現為 F-01（`.env` 在 git 中），這項屬於計畫外的偏離。

### B 級——阻擋擴展（在 EN+ES 可運作，但在第三語言或 200+ 文章規模時崩潰）

| 編號 | 發現項目 | 來源 | 工時 | 對應任務 |
|---|---|---|---|---|
| F-05 | 兩個部落格頁面內的 `locale` 三元運算式——加入第三語言時將靜默退回 `en-US` | 技術 | 小（15 分鐘） | #10 前置 |
| A-07 | `studio/schemas/post.ts` 的 `language` 欄位是靜態 `['en','es']` 列表——新增第三語言需要修改 schema 並重新部署 Studio | 自動化 | 中（2 小時或安裝外掛） | #10 前置 |
| S-09 | 任一 Sanity 結構描述皆無 `seo` 物件——必須在 Task #5 將 schema 複製到 11 個頁面**之前**加入基底模式 | SEO | 中（每個 schema 1 小時） | #5 + #9 |
| F-07 | 當 Sanity 回傳 `null` 時 `ai-trends.astro` 會靜默渲染空白頁——編輯者無法察覺此失敗模式 | 技術 | 小（10 分鐘） | #5（模式強化） |
| S-14 | 語言切換器永遠導向 `/{lang}/` 而非當前頁面對應路徑——每多一種語言，使用者體驗就更差 | SEO | 中（3 小時） | #10 |
| A-05 / A-06 | 無批次遷移腳本——200 篇以上文章與圖片需要 80–120 小時人工 Sanity 輸入 | 自動化 | 中（10–13 小時製作，可省 110 小時） | #6（範圍擴增） |
| A-09 / A-10 | 無 AI 輔助的 meta description 與 alt text 生成——人工成本將隨內容量線性增長 | 自動化 | 中（每項 1 天） | #6 / #10 |

### C 級——品質與優化（會改善但不會阻擋）

| 編號 | 發現項目 | 來源 | 工時 | 對應任務 |
|---|---|---|---|---|
| F-02 / F-03 / F-04 | `[lang]/index.astro`、`ai-trends.astro`、`blog/[slug].astro` 中的硬編碼英文字串——西語使用者看到英文 UI 元素 | 技術 | 小（共 1 小時） | #5（移植時處理） |
| F-06 / S-16 | `coverImage` 無 alt-text 欄位；行內圖片 alt 缺乏 `Rule.required()` 驗證 | 技術 / SEO | 小（15 分鐘） | #5（schema 更新） |
| F-08 | 部落格 slug 頁硬編碼 `https://aitokenglobal.com`，應改用 `Astro.site` | 技術 | 小（10 分鐘） | #9 |
| F-13 | `BaseLayout.astro` 預設 `description` 屬性僅有英文 | 技術 | 小（15 分鐘） | #5 / #9 |
| S-13 | Google Fonts 透過會阻擋渲染的 CSS `@import` 載入，未設 preconnect | SEO | 小（15 分鐘） | #9 |
| S-17 | 全站使用原始 `<img>` 標籤，未採用 Astro `<Image>` 元件——無 WebP、無 `srcset`、無 CLS 預防 | SEO | 大（1 天） | #9 / 上線後 |
| A-08 | 無 webhook 防抖（debounce）——每次 Sanity 發佈即觸發一次建置（設 15 分鐘安靜期可減少約 40%） | 自動化 | 小（2 小時） | #8（強化） |
| A-11 | 無 Amplify 建置失敗通知 | 自動化 | 小（15 分鐘） | #8（強化） |
| A-12 | 無 AWS 預算警報用以防範成本暴增 | 自動化 | 小（15 分鐘） | #8（強化） |
| A-13 | 無 Sanity dataset 自動備份 | 自動化 | 中（2 小時） | 新增（建議 Task #11） |

### D 級——可延後（推遲至上線後）

| 編號 | 發現項目 | 來源 | 工時 |
|---|---|---|---|
| F-09 | Footer 的 Privacy / Terms 連結為無效的 `href="#"` | 技術 | 小（1 小時） |
| F-10 | 來源下載 CTA 連結到 `href="#"` 但實際無檔案 | 技術 | 小（15 分鐘） |
| F-11 | 著作權年份為 2025；品牌名稱寫成「AI Token King」而非「AI Token Global」 | 技術 | 小（5 分鐘） |
| S-10 | 部落格文章頁缺少 `Article` JSON-LD | SEO | 中 |
| S-11 | AI Trends 頁缺少 `FAQPage` JSON-LD | SEO | 中 |
| S-12 | 任一處皆無 `Organization` JSON-LD | SEO | 小 |
| S-15 | 無 `BreadcrumbList` JSON-LD | SEO | 中 |
| A-14 | `amplify.yml` 中無 `node_modules` 快取金鑰 | 自動化 | 小 |
| A-15 | 未啟用分支自動部署以提供預覽 URL | 自動化 | 小 |

---

## 三、專家稽核重點摘要

### 3.1 技術稽核——核心結論

> 核心架構紮實。`[lang]` 路由、`getStaticPaths()`、Sanity-first 內容模式與動態語言切換皆已正確實作。阻擋項目集中在兩處：`.env` 已被納入 git（安全暴露），以及多處硬編碼英文字串違反 Sanity-first 原則，目前已出現在西語站上。

**主要發現（技術稽核 F-01 至 F-13）：**

- **F-01——`.env` 違反 gitignore 規範被 git 追蹤。** 該檔案標頭自身已警告「Do not add secrets to this file, as it is source controlled!」——意識存在但未強制執行。雖然 `PUBLIC_*` 值不具寫入權限，但專案 ID 公開於 git 仍會使 Sanity 免費方案配額暴露在被濫用的風險中。
- **F-05——`locale` 三元運算式迴歸風險。** 這正是 Session 11 明確警告不可消除的模式。修正方法簡單（在 `src/i18n/index.ts` 的 `LANG_META` 中加入 `locale`，並替換兩處三元運算式），但若不修正，每新增一語言其代價就會增加。
- **F-07——`ai-trends.astro` 的靜默 null 渲染。** 若 `PUBLIC_SANITY_PROJECT_ID` 未設定或無對應文件，建置會成功但頁面為空，且不會出現任何錯誤訊息。此模式必須在 Task #5 複製到其他 11 個頁面之前先行修正。
- **Sanity 結構描述設計良好。** `post` 與 `aiTrendsPage` 皆透過 `Rule.required()` 強制 `language` 欄位。可重複使用的 `faqItem` 正確以 `{ type: 'faqItem' }` 引用而非行內重複定義。`accentColor` 使用 `options.list` 搭配命名標籤而非自由輸入十六進位值。

### 3.2 SEO 稽核——核心結論

> 網站目前完全沒有 SEO 基礎建設。今天上線意味著搜尋引擎將盲目爬取、英文與西文頁面互相競爭排名、每次社群分享產生空白預覽、零結構化資料導致無法解鎖豐富搜尋結果。這些並非隱藏問題——`go-live-guide.md` 第 8 階段已正確預期此工作量——但目前皆未實作，且最重大的項目必須**先於** Task #5 複製單例模式之前完成。

**多語系就緒度評分卡：**

| SEO 檢查項 | EN | ES | 狀態 |
|---|---|---|---|
| `<html lang>` 設定正確 | 通過 | 通過 | ✅ 由 BaseLayout 從 `lang` 參數設定 |
| `<link rel="canonical">` | 失敗 | 失敗 | 任一處皆未實作 |
| `hreflang="en"` 自指標籤 | 失敗 | 失敗 | 未實作 |
| `hreflang="es"` 互指標籤 | 失敗 | 失敗 | 未實作 |
| `hreflang="x-default"` | 失敗 | 失敗 | 未實作 |
| Sitemap 含 hreflang 叢集 | 失敗 | 失敗 | Sitemap 整合未安裝 |
| 每頁 CMS-driven meta description | 失敗 | 失敗 | 任一 schema 皆無 `seoDescription` 欄位 |
| Open Graph 標籤 | 失敗 | 失敗 | BaseLayout 中未實作 |
| 語言切換器 → 對應頁面 | 失敗 | 失敗 | 永遠導向首頁 |
| 結構化資料（JSON-LD） | 失敗 | 失敗 | 任一處皆無 |

**整體：10 項通過 1 項。** 從 2 種語言擴展到 15 種，會將每一項失敗放大 15 倍。`hreflang` 與 sitemap 的缺口隨語言數成長將呈指數級惡化。

**上線前必修順序（依 SEO 稽核）：** robots.txt → sitemap 整合 + `site` URL → canonical 標籤 → hreflang 標籤 → Open Graph + Twitter Card → schemas 中的 `seo` 物件 → Coming Soon 首頁的 `noindex`。

### 3.3 自動化稽核——核心結論

> 架構層面的自動化運作正常——動態路由能由單一程式碼基底產生所有語言變體，Astro 也能乾淨地建置靜態網站。但作業層面的關鍵連結缺失：無 `amplify.yml`、無 Sanity webhook、Amplify Console 中無環境變數、無批次遷移腳本。整個專案最大的單點槓桿是 Sanity → Amplify webhook——只需 30 分鐘的工作，缺它則表示每次內容發佈都會讓正式站維持過時。

**管線狀態：**

```
本地開發（LOCAL DEV）       ✅ 運作中——Astro 4321、Sanity Studio 3333
內容編輯（CONTENT AUTHORING） ✅ 運作中——Sanity production dataset 已上線
   └─ 至 Amplify 的 webhook  ❌ 缺失——內容編輯不會觸發重新建置
程式碼部署（git push）      ⚠️  部分配置——Amplify 自動偵測但無 amplify.yml
正式站                      ❌ 尚未部署
批次遷移腳本                ❌ 不存在——200 篇以上文章將需人工輸入
AI 維運                     ❌ 無自動化措施
監控                        ❌ 無建置警示、無成本警報、無備份
```

**AI 輔助維運路線圖（依優先度排序）：**

1. **翻譯草稿** — 由 Claude 從英文文件草擬新語言版本，譯者僅做審稿。每一語言每批次內容可省約 8 小時。**在新增第三語言之前完成。**
2. **Alt text 生成** — 視覺模型在每張圖片上傳時生成 alt text。每批 200 張圖片可省約 3 小時。應在文章匯入前完成。
3. **Meta description 生成** — Claude 從頁面內文生成 `seoDescription`。每完整發佈 165 個頁面可省約 5 小時。與 SEO schema 工作併行進行。
4. **FAQ 抽取** — 從長文中抽取候選 `faqItem` 區塊。每批 200 篇文章可省約 15 小時。上線後前 30 天內完成。
5. **內容 QA** — Claude 自動審查所有已發佈頁面是否有硬編碼英文字串、缺漏翻譯、失效連結。每週可省約 2 小時。

**15 語系規模下的 ROI：** 僅翻譯草稿一項，每完整內容更新週期即可省約 120 小時。以 Anthropic API 目前定價計算，每頁草擬成本約 0.02–0.10 美元——比人工翻譯便宜數個數量級。

---

## 四、文件落差報告（記載 vs. 實際狀態）

| 編號 | 來源 | 文件記載 | 實際狀況 | 行動 |
|---|---|---|---|---|
| D-01 | `summary.md` | 「新增一語言只需一個常數＋ Sanity 內容」 | **部分為偽。** 兩個部落格頁面的 `locale` 三元運算式同樣需要程式碼變更 | 修正 F-05；之後此聲明即成立 |
| D-02 | `summary.md` | 「Sanity 中已上線三篇英文文章」 | 英文屬實；`/es/blog` 為空清單——狀態表未標記 | 補入西文內容或更新狀態表反映此不對稱 |
| D-03 | `summary.md` | 「AI Trends 頁——內容完整」 | **誇大。** `/es/ai-trends` 上仍出現三處硬編碼英文字串 | 更新為「英文內容完整；西文 UI 字串待處理」 |
| D-04 | `summary.md` | 狀態表將 Task #8 標為「Pending」 | 確認準確 | 無——準確 |
| D-05 | `summary.md` 聲明「hreflang 透過 i18n 路由」 | 僅有 URL 結構並不會輸出 hreflang 標籤；零 `<link rel="alternate">` 存在 | URL 結構為必要但不充分條件 | 更新為「URL 結構就緒；hreflang 標籤待 Phase 8 處理」 |
| D-06 | `summary.md` | 「語言切換器導向對應頁面」 | 永遠導向 `/{lang}/`（首頁），與當前頁面無關 | 更新為「切換器導向首頁；對應頁面切換待處理」 |
| D-07 | `go-live-guide.md` Phase 6.2 | 提及 `amplify.yml` 建置規格 | 專案根目錄不存在 `amplify.yml` | 建立此檔（建議）或更新文件以反映自動偵測 |
| D-08 | `go-live-guide.md` Phase 6.4 | 描述 Sanity webhook 觸發機制 | 任一處皆未配置 | 無——此文件為前瞻規格，正確地具前瞻性 |
| D-09 | `.gitignore` | `.env` 依規定排除 | `.env` 目前正被追蹤 | 執行 `git rm --cached .env` 並提交 |
| D-10 | （無文件提及） | `imageMeta.ts` 擴充 `sanity.imageAsset` 系統型別 | 此屬非標準作法；Sanity 主版本升級時可能損壞 | 在 `summary.md` 的 schema 註記中記錄此風險 |

落差項目共 10 項，位於總監預期 2–10 項區間的上端。這**並非**疏失——一日內進行三份稽核必然會浮現 12 個工作回合期間累積的落差。沒有任何項目屬災難性問題；全部累計可在不到一個工作日內修復。

---

## 五、建議路線圖（對應現有 10 項任務追蹤表）

專案在 `summary.md` 中已維護 10 項任務追蹤表。本稽核**不**另行建立競爭清單。針對每項待辦任務，稽核明確指出範圍變動：

### Task #5——以 Sanity 單例模式移植剩餘 10 個頁面（⏳ 下一步）

**影響此任務的稽核發現：**
- S-09：基底單例模式缺少 `seo` 物件 → 必須在複製**之前**加入
- F-07：靜默 null 渲染模式 → 在複製到 11 個頁面前先強化
- F-02 / F-03 / F-04：硬編碼英文字串 → 先在 `aiTrendsPage` 修正模式再複製
- F-06 / S-16：`coverImage` alt-text 驗證 → 加入 schema 模式

**範圍擴增：** 在開始移植任何 10 個頁面之前，先強化 `aiTrendsPage` 模式：(1) 加入 `seo` 物件、(2) 加入 null guard 模式、(3) 將所有 i18n 字串移出 `.astro` 檔案、(4) 加入必填 alt-text 驗證。此 1–2 天投資可避免將同一問題修 11 次。

**順序建議：** 暫停 Task #5 直至模式強化完成，再以 Batch A 恢復進度。

### Task #6——將 EN + ES 內容輸入 Sanity（⏳ 與 #5 平行）

**影響此任務的稽核發現：**
- A-05 / A-06：批次遷移腳本（圖片上傳、文章轉換）——須在人工輸入前完成
- A-09 / A-10：AI 輔助的 meta description 與 alt text——與內容輸入並行建置

**範圍擴增：** 將批次遷移腳本納入此任務範圍，而非另行立案。10–13 小時的腳本工作可省下約 110 小時人工輸入——10 倍報酬。

**順序建議：** 先執行批次圖片上傳與文章轉換，再以匯入後的資料作為內容輸入起點。

### Task #8——部署到 AWS Amplify 並配置 Sanity webhook（⏳ 待辦）

**影響此任務的稽核發現：**
- A-01：在專案根目錄建立 `amplify.yml`
- A-02：配置 Sanity → Amplify webhook（30 分鐘修正即可避免「正式站永遠過時」症候群）
- A-03：在 Amplify Console 設定環境變數
- F-01 / A-04：在首次 push **之前**將 `.env` 從 git 移除追蹤
- A-08：webhook debounce（2 小時工作量，建置分鐘數可減少約 40%）
- A-11：建置失敗通知
- A-12：AWS 預算警報

**範圍擴增：** 將 A-08、A-11、A-12 納入此任務——三者各只需 15 分鐘，可避免日後昂貴意外。webhook debounce 可考慮（亦可延至上線後），但現在做成本低。

**順序建議：** F-01 修正為硬性前置條件——`.env` 未脫離追蹤前不得 push 至 git。

### Task #9——加入基本 SEO（⏳ 待辦）

**影響此任務的稽核發現：**
- 全部 8 項 SEO 阻擋（S-01 至 S-08、S-18）皆屬此任務
- F-08：`astro.config.mjs` `site` URL 屬此任務
- S-13：Google Fonts preconnect

**範圍擴增：** 將此任務**部分前移**。影響 schema 的 SEO 基礎（S-09——`seo` 物件）必須落在 Task #5 模式強化中，而非之後。`BaseLayout` 工作（canonical、hreflang、Open Graph）與靜態檔（robots.txt、sitemap 設定）可保留在 Task #9 範圍內。

**順序建議：** 拆分為「Task #9a——Schema SEO 基礎（先做，阻擋 Task #5）」與「Task #9b——BaseLayout SEO + sitemap + robots（在 Task #8 部署之後）」。

### Task #10——擴展至第 3–15 種語言（⏳ 待辦）

**影響此任務的稽核發現：**
- F-05：`locale` 三元運算式修正（硬性前置條件——若不修，加入第三語言將靜默損壞日期格式化）
- A-07：`post.ts` 的 `language` 欄位——安裝 `sanity-plugin-document-internationalization` 或改為動態列表
- S-14：語言切換器對應頁面切換（每多一語言使用者體驗就更差）
- AI 翻譯草稿路線圖（在新增第三語言前完成）

**範圍擴增：** 將 F-05 與 A-07 視為阻擋項目而非「nice-to-have」。少了它們，文件中宣稱的「只需新增一個常數＋ Sanity 內容」承諾即不成立。

**順序建議：** 無新增依賴。此任務排序維持在 #5/#6/#8/#9 之後即可。

---

## 六、新增任務（建議納入追蹤表）

本稽核盡量將發現納入既有 10 項任務範圍。然有兩項真正屬於新增、無法套入任一既有任務：

### 建議 Task #11——維運安全網

**範圍：**
- 每週 Sanity dataset 匯出至 S3 或 GitHub Action artifact（A-13）
- pre-commit hook 阻擋 token 樣式值（A-04 強化）
- 在文件中註明 `imageMeta.ts` 擴充 Sanity 系統型別之風險（D-10）

**為何不適合既有任務：** 備份自動化既非部署工作（Task #8）也非 SEO 工作（Task #9），而是部署後的維運衛生工作。

**工時：** 共 4–6 小時。**優先度：** 上線後前 30 天內完成。

### 建議 Task #12——AI 維運管線

**範圍：**
- 基於 Claude 的翻譯草稿生成（優先度 1；新增第三語言前完成）
- 圖片上傳時的視覺模型 alt-text 生成（優先度 2；文章匯入前完成）
- 基於 Claude 的 meta description 生成（優先度 3；與 SEO schema 工作併行）
- FAQ 抽取（優先度 4；上線後）
- 內容 QA（優先度 5；團隊擴張時）

**為何不適合既有任務：** Task #10 是「擴展至第 3–15 語言」——擴展行為本身。AI 維運管線是讓擴展在財務上可承擔的方法。兩者相關但不同。

**工時：** 每項優先度 1–2 天，五項共 5–10 天。**優先度：** 在新增第三語言前先完成優先度 1 與 2，其餘上線後持續推進。

---

## 七、決策論述

**建議：可繼續投入，但須先處理三項條件（GO WITH CAVEATS）。**

整體軌跡可信。經過 12 個工作回合，團隊已交付一個可運作的多語系網站骨架，含 2 種語言、AI Trends 頁的 Sanity-driven 內容、以及乾淨的 Astro + Sanity + Amplify 架構。稽核未發現任何足以導出 HOLD 或 PIVOT 結論的根本性架構錯誤。剩餘工作屬執行性質，而非設計性質。

但條件確實存在，建議專案決策者要求團隊在下一個里程碑前處理完成。最重要的是 **Task #9 SEO 工作不能延至上線後**，即使現有路線圖暗示如此排序。`seo` 物件必須在 Task #5 將 schema 模式複製到 11 個頁面**之前**先加入 Sanity schema 模式——否則同一個修正將被執行 11 次而非一次。1 天的模式強化投資可省下大約 8–11 天的全面修補工作。同樣地，目前被 git 追蹤的 `.env` 是 5 分鐘可修的問題；若再累積更多敏感值或專案被更廣泛分享，清理成本將顯著上升。

成本面向支持繼續投入。目前每月支出約 1.25 美元（僅網域）。即使在完整 15 語系、每日發佈規模下，預算也僅落在每月 50–60 美元——對任何合理的多語系內容平台機會成本而言，皆屬零頭。最大的成本槓桿是 Sanity → Amplify webhook debounce（2 小時工作量），可降低建置分鐘數約 40%，使第 12 個月成本維持在 15–22 美元區間。最大的隱性成本則是**沒有批次遷移腳本下的人工內容輸入**——80–120 小時的編輯工時，可由建議腳本壓縮為 10–13 小時。此差距遠超過任何基礎建設成本決策，也是繼續投入的最強論據：腳本在第一次使用即回收成本，且團隊具備撰寫能力。決策者面前的問題因此不是「是否值得繼續持有」——而是「是否在下次 push 前處理完上述三項缺口？」總監的回答是：是，且工作邊界清楚。建議核准繼續投入，條件為 30 天優先事項清單按時落地。

---

## 附錄 A——稽核來源

- `audits/technical-audit.md`（2026-05-07）——路由、Sanity schemas、i18n、Sanity-first 合規、建置設定、落差檢查
- `audits/seo-audit.md`（2026-05-07）——可索引性、多語系結構、metadata、結構化資料、圖片、效能、遷移
- `audits/automation-audit.md`（2026-05-07）——建置管線、部署觸發、環境管理、批次遷移、AI 維運、成本、監控、備份
- `summary.md`——目前專案狀態與工作回合變更紀錄
- `go-live-guide.md`——分階段部署路線圖
- `CLAUDE.md`——專案規範與設計守則

## 附錄 B——稽核後 10 項任務追蹤表狀態

| # | 任務 | 狀態 | 稽核驅動之變更 |
|---|---|---|---|
| 1 | 重構專案結構：Astro 移至根目錄、HTML 原型歸檔 | ✅ 完成 | 無變更 |
| 2 | 修正 Nav 語言切換器為動態 | ✅ 完成 | 無變更（S-14 將對應頁面切換納入 #10） |
| 3 | 為單頁面（AI Trends）設計 Sanity schema POC | ✅ 完成 | 無變更 |
| 4 | 實作 Sanity POC：schema + Astro fetch + EN/ES 內容 | ✅ 完成 | 無變更 |
| 5 | 以 Sanity 單例模式移植其餘 10 個頁面 | ⏳ 下一步 | **暫停直至模式強化完成**（1–2 天投資） |
| 6 | 將 EN + ES 內容輸入 Sanity 至全部頁面 | ⏳ 與 #5 平行 | 將批次遷移腳本納入範圍 |
| 7 | 為 AWS Amplify 更新 `go-live-guide.md` | ✅ 完成 | 無變更 |
| 8 | 部署到 AWS Amplify 並配置 Sanity webhook | ⏳ 待辦 | 加入 webhook debounce、建置警示、預算警報；F-01 為硬性前置 |
| 9 | 加入基本 SEO | ⏳ 待辦 | **拆分為 9a（schema SEO，阻擋 #5）與 9b（BaseLayout + sitemap，#8 之後）** |
| 10 | 擴展至第 3–15 種語言 | ⏳ 待辦 | F-05 + A-07 為硬性前置 |
| **11（新）** | **維運安全網** | ⏳ 建議 | 備份、pre-commit hook、schema 風險說明 |
| **12（新）** | **AI 維運管線** | ⏳ 建議 | 翻譯草稿、alt text、meta description、FAQ 抽取、內容 QA |

---

*報告結束。*
