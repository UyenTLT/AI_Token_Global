# AI Token Global — 專案稽核總結報告

**日期：** 2026-05-08
**製作單位：** 專案總監（綜合技術、SEO、自動化、QA／行動端四份專家稽核——QA／行動端為首次納入）
**閱讀對象：** 專案決策者
**待回答問題：** 是否值得繼續投入資源於 AI Token Global 專案？
**取代版本：** `audits/FINAL_PROJECT_AUDIT_2026-05-07.md`（已歸檔，供差異比對）

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
- **行動裝置流量預期將佔大宗。** 本次合併納入的 QA／行動端稽核（2026-05-08）發現：目前手機與平板的行動端導覽完全無法運作——這是上一次稽核未發現的上線阻擋項目。在 Task #5 將單例模式複製到 11 個頁面之前，於 `global.css` 集中化響應式系統已成為新的 Pre-flight 必要項目。

---

## 一、執行摘要

**建議：可繼續投入，但須先處理多項條件（GO WITH CAVEATS）——與 5 月 7 日結論一致。** 本次合併新加入的 QA／行動端稽核**強化並擴充**了 5 月 7 日的結論，而非翻轉它。架構仍然紮實；團隊已交付實質進度；新發現（其中之一是上一次稽核未抓到的上線阻擋項目）皆能納入既有的 Pre-flight 加上 Task #5 框架。最關鍵的是：QA 稽核在 Task #5 將單例模式複製到 11 個頁面**之前**發現了這些問題——這正是稽核循環應該產出的價值。30 天優先事項清單僅擴充約半天工作量；其餘維持不變。

### 5 月 7 日以來的變動

- 第四份專家稽核（QA／行動端）於 2026-05-08 完成，本次首度納入合併。
- 風險矩陣新增類別：**Visual / Mobile / A11y（視覺／行動端／無障礙）**。
- 新增一組 **A 級（上線阻擋）發現**：手機與平板上的行動端導覽完全無法運作——`global.css` 中的 `!important` 規則覆蓋了負責開啟選單的 JavaScript（Q-01／Q-02）。AI Trends 頁的 FAQ 折疊面板目前在所有裝置上都打不開（Q-03）。
- 為實作計畫提出**一項新的 Pre-flight 項目（Task #0f）**：在 `src/styles/global.css` 中集中化響應式斷點系統，並修正 QA 稽核發現的所有行動端／無障礙問題。約 4–6 小時工作量；若於 Task #5 之前完成，可吸收同一問題在 11 個頁面上被複製的代價。
- 5 月 7 日的成本軌跡與架構結論不變。

### 三大優勢（不變）

1. **核心架構正確且已定案。** 動態 `[lang]` 路由、Sanity-first 內容模式、以 `SUPPORTED_LANGS` 為基礎的 `getStaticPaths()` 以及語言切換器，皆按設計運作。沒有任何會中斷建置的問題。Astro + Sanity + AWS Amplify 的組合在預算範圍內，仍是支撐 15 語系內容平台的正確選擇。
2. **Sanity 結構描述（schema）品質高，POC 模式可直接複用。** `post` 與 `aiTrendsPage` 都採用 Portable Text 處理內文欄位、必填 `language`、並正確重複使用 `faqItem`。在 Pre-flight 擴充（SEO、EN/ES 去地區化、響應式系統）後，此模式無須重新設計即可擴展至剩餘 11 個頁面結構描述。
3. **成本曲線非常友善。** 目前每月支出約 1.25 美元（僅網域費用）。12 個月規模下預估每月 26–34 美元；完整 15 語系規模仍維持在每月 60 美元以下。

### 四大風險（原為三項——新增 Visual／Mobile／A11y）

1. **`.env` 檔案被納入 git 版本控管，** 內含實際的 Sanity 專案 ID。安全與配額濫用的暴露風險，違反該檔案標頭自身的警告文字。**必須在下次 push 前先行處理。**（與 5 月 7 日相同。）
2. **目前完全沒有 SEO 基礎建設。** 無 `robots.txt`、無 sitemap、無 canonical、無 `hreflang`、無 Open Graph、所有 Sanity 結構描述中也未設置任何 SEO 欄位。`seo` 物件必須在 Task #5 複製模式**之前**進入 schema 模式。（與 5 月 7 日相同。）
3. **兩處潛藏的 EN/ES 假設將在第三語言加入時悄悄損壞。** 兩個部落格頁面內的 `locale` 三元運算式以及 `studio/schemas/post.ts` 中的靜態語言列表。兩者皆阻擋 Task #10。（與 5 月 7 日相同。）
4. **行動端導覽在所有手機與平板上皆無法運作；FAQ 折疊面板無法展開；整套 CSS 為桌面優先而非 `CLAUDE.md` 宣稱的「行動優先」。新增。** `global.css:277` 中的 `.desktop-nav { display: none !important }` 規則覆蓋了 `Nav.astro:118` 中的 `style.display = 'flex'` 切換動作，因此漢堡按鈕沒有任何視覺反應。FAQ 折疊面板的 `max-height` 過渡從未被觸發，因為 JavaScript 將 `.open` 加在錯誤的元素上。兩處 CSS 動畫（部落格閱讀進度條的 `transition: width`；FAQ 的 `transition: max-height`）違反 `CLAUDE.md` 僅允許 `transform`／`opacity` 的規則。稽核同時發現一處 WCAG AA 顏色對比失敗（Footer 中 `#666` 文字搭配 `#1C1C1C` 背景，比例約 3.0:1，需達 ≥4.5:1）。

### 30 天優先事項（已擴充）

- **第 1 週：Pre-flight（Task #0）。** 原為 5 個子項目，現因 QA 加入擴為 6 個。將 `.env` 從 git 移除（#0a）、為 schema 加入 `seo` 物件（#0b）、為 `BaseLayout.astro` 加入 canonical／hreflang／OG（#0c）、安裝 sitemap + robots（#0d）、修正 EN/ES 去地區化（#0e），**新增：集中化響應式斷點系統，並修復行動端導覽、FAQ 折疊面板、非法 CSS 過渡、缺漏的 `:active` 狀態、漢堡按鈕觸控區域、Footer 對比（#0f，新）**。**現在執行**——在 Task #5 將單例模式複製到 11 個頁面之前——可避免將同一問題修 11 次。Task #0 總工時：約 1.5–2.5 天（原為 1–2 天）。
- **第 2 週：部署基礎建設（Task #8）。** 加入 `amplify.yml`、設定 Amplify Console 環境變數、配置 Sanity → Amplify webhook。在 Task #0a（`.env` 脫離追蹤）完成前為硬性阻擋。
- **第 3 週：批次遷移腳本（Task #6）。** `scripts/upload-images.js` + `scripts/convert-articles.js`——將 80–120 小時的人工輸入壓縮為 10–13 小時。
- **第 4 週：開始 Task #5 頁面移植。** 從 Batch A（四個 API 模型頁）著手，採用第 1 週完成的 SEO 強化版**且**行動端強化版單例模式。

### 成本軌跡（不變）

| 階段 | 語言數 | 流量 | 建置活動 | 每月成本 |
|---|---|---|---|---|
| 目前（上線前） | 2（EN + ES） | 0 | 0 次建置 | 約 1.25 美元 |
| 第 6 個月 | 2 | 約 5,000 訪客 | 每日約 10 次發佈 | 約 3–5 美元 |
| 第 12 個月 | 5 種以上 | 約 5 萬訪客 | 每日約 20 次發佈 | 約 26–34 美元 |
| 完整規模 | 15 | 每日發佈 | 全語系運作中 | 約 50–60 美元 |

---

## 二、風險矩陣

來自四份專家稽核的所有發現，依影響層級分組，現在亦依類別分組。**新增「Visual / Mobile / A11y」類別**以容納 QA 稽核發現。嚴重度為總監綜合判斷。

### A 級——阻擋上線（無法部署或上線後將明顯損壞）

| 編號 | 發現項目 | 類別 | 來源 | 工時 | 對應任務 |
|---|---|---|---|---|---|
| A-01 | 專案根目錄缺少 `amplify.yml` | 自動化 | 自動化 | 小（1 小時） | #8 |
| A-02 | Sanity → Amplify webhook 完全未配置 | 自動化 | 自動化 | 小（30 分鐘） | #8 |
| A-03 | Amplify Console 環境變數未設定 | 自動化 | 自動化 | 小（10 分鐘） | #8 |
| F-01 | `.env` 已被納入 git，含實際的 `mq3wxr8n` 專案 ID | 技術 | 技術 | 小（5 分鐘） | #0a（安全閘） |
| S-01 | 無 `public/robots.txt` | SEO | SEO | 小（15 分鐘） | #0d |
| S-04 | `astro.config.mjs` 缺少 `site` URL，sitemap 整合未安裝 | SEO | SEO | 小（30 分鐘） | #0d |
| S-02 / S-03 / S-05 | 無 `hreflang` 標籤；sitemap 不含 hreflang 叢集 | SEO | SEO | 中（3–4 小時） | #0c |
| S-06 | 任一頁面皆無 `<link rel="canonical">` | SEO | SEO | 小（30 分鐘） | #0c |
| S-07 / S-08 | 無 Open Graph 與 Twitter Card 標籤 | SEO | SEO | 中（2–3 小時） | #0c |
| S-18 | 「Coming Soon」首頁將被薄弱內容索引；無 `noindex` 機制 | SEO | SEO | 小（30 分鐘） | #0b |
| **Q-01** | **`.desktop-nav { display: none }` 上的 `!important` 覆蓋了內聯樣式切換——行動端選單無法開啟** | **Visual / Mobile / A11y** | **QA／行動端** | **小（15 分鐘）** | **#0f（新）** |
| **Q-02** | **不存在行動端導覽抽屜樣式——即使 Q-01 修正，面板也沒有行動端版面** | **Visual / Mobile / A11y** | **QA／行動端** | **中（1–2 小時）** | **#0f（新）** |
| **Q-03** | **AI Trends FAQ 折疊面板永遠打不開——JS 添加 `.open` 但 CSS `max-height` 過渡掛在錯誤的選擇器上** | **Visual / Mobile / A11y** | **QA／行動端** | **小（30 分鐘）** | **#0f（新）** |
| **Q-04** | **行動端可能存在水平捲動——導覽修復後需驗證** | **Visual / Mobile / A11y** | **QA／行動端** | **小（30 分鐘）** | **#0f（新）** |
| **Q-12** | **Footer 次要文字未通過 WCAG AA 對比（`#666` on `#1C1C1C` 約 3.0:1，需 ≥4.5:1）** | **Visual / Mobile / A11y** | **QA／行動端** | **小（5 分鐘）** | **#0f（新）** |

**A 級項目總計 14 項（原為 9 項）。** 新增的 5 項為 QA／行動端集群。其中 Q-01 至 Q-03 為功能性 bug，上線首日任何手機使用者都會看到。Q-12 屬法律／無障礙風險（過往曾有對比失敗的相關訴訟）。五項皆能納入 Task #0f 且邊界清楚。

### B 級——阻擋擴展（在 EN+ES 可運作，但在第三語言或 200+ 文章規模時崩潰）

| 編號 | 發現項目 | 類別 | 來源 | 工時 | 對應任務 |
|---|---|---|---|---|---|
| F-05 | `locale` 三元運算式於第三語言時靜默退回 `en-US` | 技術 | 技術 | 小（15 分鐘） | #0e（#10 前置） |
| A-07 | `studio/schemas/post.ts` 的 `language` 欄位為靜態 `['en','es']` | 自動化 | 自動化 | 中（2 小時或安裝外掛） | #0e（#10 前置） |
| S-09 | 任一 Sanity schema 皆無 `seo` 物件——必須在 Task #5 複製到 11 個頁面**之前**加入基底模式 | SEO | SEO | 中（每個 schema 1 小時） | #0b |
| F-07 | 當 Sanity 回傳 `null` 時 `ai-trends.astro` 會靜默渲染空白頁 | 技術 | 技術 | 小（10 分鐘） | #0f / #5（模式） |
| S-14 | 語言切換器永遠導向 `/{lang}/` 而非當前頁面對應路徑 | SEO | SEO | 中（3 小時） | #10 |
| A-05 / A-06 | 無批次遷移腳本——200+ 文章需 80–120 小時人工 Sanity 輸入 | 自動化 | 自動化 | 中（10–13 小時，可省 110 小時） | #6（範圍擴增） |
| A-09 / A-10 | 無 AI 輔助 meta description 與 alt text 生成 | 自動化 | 自動化 | 中（每項 1 天） | #6 / #12 |
| **Q-05** | **漢堡按鈕觸控區域約 38 px——低於 44×44 px 觸控目標最小值（Apple HIG／WCAG）** | **Visual / Mobile / A11y** | **QA／行動端** | **小（5 分鐘）** | **#0f（新）** |
| **Q-07** | **兩處非法 CSS 過渡違反 `CLAUDE.md` 的 `transform`／`opacity` 規則：部落格閱讀條的 `transition: width`；FAQ 的 `transition: max-height`** | **Visual / Mobile / A11y** | **QA／行動端** | **小（30 分鐘）** | **#0f（新）** |
| **Q-08** | **儘管 `CLAUDE.md` 宣稱「行動優先」，所有 CSS 仍為桌面優先（`max-width` 查詢）——整套系統為覆蓋式而非漸進增強式** | **Visual / Mobile / A11y** | **QA／行動端** | **中（3–4 小時）** | **#0f（新——集中化）** |
| **Q-09** | **`.dropdown-item` 與 `.faq-question` 缺漏 `:active` 狀態——`CLAUDE.md` 要求每個互動元素皆需 hover、focus-visible、active 狀態** | **Visual / Mobile / A11y** | **QA／行動端** | **小（15 分鐘）** | **#0f（新）** |
| **Q-13** | **部落格圖片使用無 `width`／`height` 或 `aspect-ratio` 的原始 `<img>`——CLS 風險，會在 Task #5 複製部落格模式時放大** | **Visual / Mobile / A11y** | **QA／行動端 + SEO（S-17 互相佐證）** | **中（1 小時）** | **#0f / #9（部署後遷移至 Astro `<Image>`）** |
| **Q-17** | **斷點衝突——Footer 在元件層使用 768 px 加 `!important`，`global.css` 用 640 px——必須集中為單一行動端斷點** | **Visual / Mobile / A11y** | **QA／行動端** | **小（15 分鐘）** | **#0f（新）** |

### C 級——品質與優化（會改善但不會阻擋）

| 編號 | 發現項目 | 類別 | 來源 | 工時 | 對應任務 |
|---|---|---|---|---|---|
| F-02 / F-03 / F-04 | `[lang]/index.astro`、`ai-trends.astro`、`blog/[slug].astro` 中的硬編碼英文字串 | 技術 | 技術 | 小（共 1 小時） | #0 / #5 |
| F-06 / S-16 | `coverImage` 無 alt-text 欄位；行內圖片 alt 缺乏 `Rule.required()` | 技術 / SEO | 技術 / SEO | 小（15 分鐘） | #0 / #5 |
| F-08 | 部落格 slug 頁硬編碼 `https://aitokenglobal.com`，應改用 `Astro.site` | 技術 | 技術 | 小（10 分鐘） | #9 |
| F-13 | `BaseLayout.astro` 預設 `description` 屬性僅有英文 | 技術 | 技術 | 小（15 分鐘） | #0 / #5 |
| S-13 / Q-14 | Google Fonts 透過會阻擋渲染的 CSS `@import` 載入；無 preconnect（兩份稽核交叉確認） | SEO | SEO + QA／行動端 | 小（15 分鐘） | #9 |
| S-17 | 全站使用原始 `<img>` 標籤而非 Astro `<Image>`（從效能／SEO 角度交叉佐證 Q-13） | SEO | SEO | 大（1 天） | #9 / 上線後 |
| A-08 | 無 webhook debounce | 自動化 | 自動化 | 小（2 小時） | #8 |
| A-11 | 無 Amplify 建置失敗通知 | 自動化 | 自動化 | 小（15 分鐘） | #8 |
| A-12 | 無 AWS 預算警報 | 自動化 | 自動化 | 小（15 分鐘） | #8 |
| A-13 | 無 Sanity dataset 自動備份 | 自動化 | 自動化 | 中（2 小時） | #11（5 月 7 日新增） |
| **Q-11** | **小型視窗下的標題縮放需驗證——Kanit 在桌面大尺寸下可能於行動端顯得過於緊縮** | **Visual / Mobile / A11y** | **QA／行動端** | **小（1 小時）** | **#0f / #9** |
| **Q-15** | **Tailwind CDN 腳本缺 `defer`；CDN Tailwind 本身不適合正式環境** | **Visual / Mobile / A11y** | **QA／行動端** | **小（5 分鐘加 `defer`）；中（2 小時改為建置流程）** | **`defer` 在 #0f；完整遷移在 #9** |
| **Q-16** | **無 `prefers-reduced-motion` 區塊——對前庭敏感的使用者無法停用動畫** | **Visual / Mobile / A11y** | **QA／行動端** | **小（15 分鐘）** | **#0f / #9** |

### D 級——可延後（推遲至上線後）

| 編號 | 發現項目 | 類別 | 來源 | 工時 |
|---|---|---|---|---|
| F-09 | Footer 的 Privacy / Terms 連結為無效的 `href="#"` | 技術 | 技術 | 小（1 小時） |
| F-10 | 來源下載 CTA 連結到 `href="#"` 但實際無檔案 | 技術 | 技術 | 小（15 分鐘） |
| F-11 | 著作權年份為 2025；品牌名稱寫成「AI Token King」而非「AI Token Global」 | 技術 | 技術 | 小（5 分鐘） |
| S-10 | 部落格文章頁缺少 `Article` JSON-LD | SEO | SEO | 中 |
| S-11 | AI Trends 頁缺少 `FAQPage` JSON-LD | SEO | SEO | 中 |
| S-12 | 任一處皆無 `Organization` JSON-LD | SEO | SEO | 小 |
| S-15 | 無 `BreadcrumbList` JSON-LD | SEO | SEO | 中 |
| A-14 | `amplify.yml` 中無 `node_modules` 快取金鑰 | 自動化 | 自動化 | 小 |
| A-15 | 未啟用分支自動部署 | 自動化 | 自動化 | 小 |
| **Q-20** | **輸入欄位 `font-size` ≥16 px 以避免 iOS 自動縮放——尚無表單，目前不適用** | **Visual / Mobile / A11y** | **QA／行動端** | **不適用** |

### QA 通過項目（無需處理）

QA／行動端稽核確認多項規則已正確執行，值得記錄以表彰團隊：

- **Q-06——程式碼中無 `transition-all`** （符合 CLAUDE.md）。
- **Q-10——內文字體 16 px** （無 iOS 自動縮放）。
- **Q-18——`aria-label="Toggle mobile menu"`** 已加在漢堡按鈕（ARIA 正確）。
- **Q-19——任何處皆無裸寫 `outline: none`** ——焦點指示器保留完整。

---

## 三、專家稽核重點摘要

### 3.1 技術稽核——核心結論（與 5 月 7 日相同）

> 核心架構紮實。`[lang]` 路由、`getStaticPaths()`、Sanity-first 內容模式與動態語言切換皆已正確實作。阻擋項目集中在兩處：`.env` 已被納入 git（安全暴露），以及多處硬編碼英文字串違反 Sanity-first 原則，目前已出現在西語站上。

關鍵發現仍為 F-01（`.env` 進入 git）、F-05（`locale` 三元運算式迴歸風險）、F-07（`ai-trends.astro` 靜默 null 渲染），以及設計良好且 `language` 欄位必填的 Sanity schemas。

### 3.2 SEO 稽核——核心結論（與 5 月 7 日相同）

> 網站目前完全沒有 SEO 基礎建設。今天上線意味著搜尋引擎將盲目爬取、英文與西文頁面互相競爭排名、每次社群分享產生空白預覽、零結構化資料導致無法解鎖豐富搜尋結果。

**多語系就緒度評分卡仍為 10 項通過 1 項**（僅 `<html lang>`）。上線前必修順序：robots.txt → sitemap + `site` URL → canonical → hreflang → OG + Twitter Card → schemas 中的 `seo` 物件 → Coming Soon 首頁的 `noindex`。Task #0c／d 在 Pre-flight 落地後，上述全部 8 項阻擋將於部署前清除。

### 3.3 自動化稽核——核心結論（與 5 月 7 日相同）

> 架構層面的自動化運作正常。作業層面的關鍵連結缺失：無 `amplify.yml`、無 Sanity webhook、Amplify Console 中無環境變數、無批次遷移腳本。最大的單點槓桿為 Sanity → Amplify webhook——只需 30 分鐘的工作，缺它則表示每次內容發佈都會讓正式站維持過時。

成本預測不變。AI 輔助維運路線圖（翻譯草稿、alt-text 生成、meta description、FAQ 抽取、內容 QA）位於建議 Task #12 中。

### 3.4 QA 與行動端稽核——核心結論（新——首次納入）

> 目前手機與平板的行動端導覽完全無法運作，AI Trends 頁的 FAQ 折疊面板無法開啟，整套響應式系統儘管 `CLAUDE.md` 宣稱「行動優先」實則為桌面優先。所有發現在架構上皆不困難——多數為 5–30 分鐘的修正——但必須在 Task #5 將單例模式複製到 11 個頁面**之前**完成，否則同一個破損模式會被修正 11 次。

#### 標題級發現

- **Q-01／Q-02——行動端導覽損壞：** `global.css:277` 的 `.desktop-nav { display: none !important }` 規則覆蓋了 `Nav.astro:118` 的 `style.display = 'flex'` 切換。CSS 串聯規則：含 `!important` 的樣式表勝過不含 `!important` 的內聯樣式。點擊漢堡無任何反應。同時不存在行動端抽屜樣式（全寬、堆疊連結、可見面板）——即使切換能運作，版面亦不正確。
- **Q-03——FAQ 折疊面板損壞：** JS 添加類別 `.open`，但 CSS 僅將 `max-height: 0` 與 `max-height` 過渡掛在 `.faq-answer`（無 `.open`）上。過渡從未觸發；面板永遠隱藏。
- **Q-07——兩處非法 CSS 過渡：** 部落格閱讀進度條的 `transition: width`（每次捲動事件觸發 layout/paint，行動端明顯延遲）；FAQ 折疊面板的 `transition: max-height`（CSS 過渡的二等公民）。兩者皆違反 `CLAUDE.md` 的 `transform`／`opacity` 規則。
- **Q-08——桌面優先 CSS，儘管宣稱「行動優先」：** 所有檔案中的 `@media` 查詢皆使用 `max-width`（覆蓋式）。零個 `min-width` 查詢（漸進增強式）。此項是最具槓桿的發現，因為它觸及每個元件。
- **Q-12——WCAG AA 對比失敗：** Footer 次要文字 `#666` on `#1C1C1C` 約 3.0:1。需 ≥4.5:1。改用 `#999` 或更亮顏色。

#### QA 稽核暴露的 CLAUDE.md 落差

`CLAUDE.md` 中的三項規則被宣稱但未強制執行：

| 規則 | 實際 | 嚴重度 |
|---|---|---|
| 「Mobile-first responsive」 | 整套 CSS 為桌面優先（12 個 `max-width` 查詢，0 個 `min-width`） | 高 |
| 「Only animate `transform` and `opacity`」 | 兩處違反：`transition: width`、`transition: max-height` | 高 |
| 「每個可點擊元素必需 hover、focus-visible、active 狀態。無例外。」 | `.dropdown-item` 與 `.faq-question` 缺漏 `:active` 狀態 | 高 |

上述三項落差將成為第四章的 D-11 至 D-13 項目。

#### 標準化提案（30 分鐘／11× 槓桿動作）

QA 稽核第 7 章提出在 `src/styles/global.css` 頂部加入集中化響應式系統：三個斷點（640 px 行動端、1024 px 平板、1280 px 桌面）、三個工具類別（`.grid-auto-3`、`.grid-auto-2`、`.container-page`）、使用 `clamp()` 的字級系統、整體採用行動優先媒體查詢，以及可運作的行動端導覽抽屜。並建議在 `CLAUDE.md` 的「Output Defaults」之下加入相應段落，讓未來頁面作者不再引入新的隨機斷點。

**順序意義：** Task #5 將把 AI Trends 模式複製到 10 個頁面加首頁。今天修正的每一處隨機響應式模式，都只需修一次。若 Task #5 在未集中化的情況下落地，同一修正將需 11×。這與 5 月 7 日週期將 SEO `seo` 物件拉進 Task #0b 的「修一次 vs 修十一次」邏輯相同。行動端案例為相同機制。

#### QA 稽核未涵蓋範圍（範圍邊界）

本次稽核僅做程式碼分析——無實機瀏覽器測試（網站尚未部署）。Lighthouse 行動端評分、實機 Safari／Chrome 差異、螢幕閱讀器導覽、鍵盤 Tab 順序等皆為部署後項目，記錄於 QA 稽核第 4 章「上線後優化路線圖」（優先度 1–7）。

---

## 四、文件落差報告（記載 vs. 實際狀態）

5 月 7 日合併共 10 項落差（D-01 至 D-10）。QA 稽核新增三項——三項皆為 `CLAUDE.md` 自我矛盾。其中既有的 D-03 加上新證據。

| 編號 | 來源 | 文件記載 | 實際狀況 | 行動 |
|---|---|---|---|---|
| D-01 | `summary.md` | 「新增一語言只需一個常數＋ Sanity 內容」 | **部分為偽。** 兩個部落格頁面的 `locale` 三元運算式同樣需要程式碼變更 | 修正 F-05 於 #0e |
| D-02 | `summary.md` | 「Sanity 中已上線三篇英文文章」 | 英文屬實；`/es/blog` 為空清單——狀態表未標記 | 補入西文內容或更新狀態表 |
| D-03 | `summary.md` | 「AI Trends 頁——內容完整」 | **新擴充：** `/es/ai-trends` 上仍出現三處硬編碼英文字串（技術稽核），**且** FAQ 折疊面板在所有裝置上皆無法開啟（QA 稽核 Q-03）。稱此頁「內容完整」雙重不準確 | 修正於 #0 / #5 |
| D-04 | `summary.md` | 狀態表將 Task #8 標為「Pending」 | 確認準確 | 無 |
| D-05 | `summary.md` 聲明「hreflang 透過 i18n 路由」 | 僅有 URL 結構並不會輸出 hreflang 標籤 | 更新為「URL 結構就緒；hreflang 標籤待 #0c 處理」 |
| D-06 | `summary.md` | 「語言切換器導向對應頁面」 | 永遠導向 `/{lang}/` | 更新為「切換器導向首頁；對應頁面切換待 #10 處理」 |
| D-07 | `go-live-guide.md` Phase 6.2 | 提及 `amplify.yml` 建置規格 | 專案根目錄不存在 `amplify.yml` | 於 #8 建立檔案 |
| D-08 | `go-live-guide.md` Phase 6.4 | 描述 Sanity webhook 觸發機制 | 任一處皆未配置 | 無——文件為前瞻規格 |
| D-09 | `.gitignore` | `.env` 依規定排除 | `.env` 目前正被追蹤 | 於 #0a 執行 `git rm --cached .env` |
| D-10 | （無文件提及） | `imageMeta.ts` 擴充 `sanity.imageAsset` 系統型別 | 屬非標準作法；Sanity 主版本升級時可能損壞 | 於 `summary.md` 中註記（#11） |
| **D-11** | **`CLAUDE.md`** | **「Mobile-first responsive」** | **所有 CSS 皆為桌面優先——12 個 `@media (max-width)` 查詢，零個 `@media (min-width)` 查詢** | **於 #0f 採用 QA 稽核第 7 章標準化提案重構** |
| **D-12** | **`CLAUDE.md`** | **「Only animate `transform` and `opacity`」** | **兩處違反：部落格閱讀條 `transition: width`；FAQ 折疊面板 `transition: max-height`** | **於 #0f 替換：閱讀條改 `transform: scaleX()`；FAQ 改 JS 高度動畫** |
| **D-13** | **`CLAUDE.md`** | **「每個可點擊元素必需 hover、focus-visible、active 狀態。無例外。」** | **`.dropdown-item` 與 `.faq-question` 缺漏 `:active` 狀態** | **於 #0f 補上** |

落差項目共 13 項（原為 10 項）。所有 13 項皆可在不到 1.5 個工作日內累計修復。`CLAUDE.md` 自我矛盾（D-11 至 D-13）特別重要，因為該檔案是 Claude Code 與任何人類貢獻者撰寫前端程式前的查詢來源——規則與實際的落差會逐步累積。

---

## 五、建議路線圖（對應現有 Task #0–12 計畫）

5 月 7 日合併產生了 `audits/IMPLEMENTATION_PLAN.md`，為現行的標準任務追蹤表（取代 `summary.md` 頂部的「Next, in order」區塊）。本次合併**僅在一處**更新計畫：Task #0 增加新的子項目 #0f。

### Task #0——Pre-flight（5 月 7 日新增；本次合併**擴充**）🆕

既有五個子項目（#0a–e）維持不變。QA／行動端稽核新增一個整合性子項目：

| 編號 | 子任務 | 稽核參考 | 工時 | 阻擋 |
|---|---|---|---|---|
| #0a | `git rm --cached .env`、加入 `.env.example`、提交 | F-01, D-09 | 小（5 分鐘） | #8 |
| #0b | 為 `aiTrendsPage` 與 `post` schema 加入 `seo` 物件 | S-09 | 中（1–2 小時） | #5 |
| #0c | 為 `BaseLayout.astro` 加入 canonical／hreflang／Open Graph／Twitter Card | S-02/03/05/06/07/08 | 中（3–4 小時） | #5, #8 |
| #0d | 安裝 `@astrojs/sitemap`、設定 `site` URL、建立 `public/robots.txt` | S-01, S-04 | 中（45 分鐘） | #8 |
| #0e | 修正 EN/ES 去地區化：在 `LANG_META` 中加入 `locale`、為 `post.ts` 改為動態 `language` 來源 | F-05, A-07, D-01 | 中（2–3 小時） | #10 |
| **#0f** | **Visual / Mobile / A11y Pre-flight（新）：** 依 QA 稽核第 7 章在 `global.css` 中集中化響應式斷點系統；修正行動端導覽 `!important` 覆蓋（Q-01）並加入抽屜樣式（Q-02）；修正 FAQ 折疊面板（Q-03）；以合法屬性替換 `transition: width` 與 `transition: max-height`（Q-07）；加入 `:active` 狀態（Q-09）；漢堡按鈕 44×44 觸控區域（Q-05）；Footer 對比（Q-12）；`prefers-reduced-motion`（Q-16）；Tailwind CDN 腳本加 `defer`（Q-15）；依 QA 稽核第 7 章將響應式系統段落加入 `CLAUDE.md` | Q-01–Q-09, Q-12, Q-15, Q-16, Q-17；D-11/12/13 | **中（4–6 小時）** | **#5** |

同時修復（與 5 月 7 日相同）：F-07 null guard、F-06／S-16 alt-text 驗證、F-02／F-03／F-04 硬編碼英文字串、F-13 預設 description、S-18 `noindex`。

**Task #0 總工時：1.5–2.5 天**（原為 1–2 天）。在此項目綠燈前，不得啟動 Task #5。

### Task #5 至 Task #12——無其他重新排序

QA 發現幾乎全數可納入 Task #0f，其餘自然落入部署後 Task #9（原始 `<img>` → Astro `<Image>` 遷移、完整 Tailwind CDN → 建置流程遷移、Lighthouse 行動端實機測試）。**無**需新增任務——總監明確檢視是否提案 Task #13，結論為這會建立平行待辦清單而非將發現納入既有結構。

具體而言：

- **Task #5** —— Pre-flight 中 #0f 的模式強化意味著每批次自動繼承可運作的行動端導覽、集中化斷點系統、合法 CSS 過渡、完整互動狀態與正確觸控區域。除 5 月 7 日既有擴充外，無進一步範圍變動。
- **Task #6** —— 無 QA 驅動變動。批次遷移腳本與 AI 輔助內容維持原範圍。
- **Task #8** —— 無 QA 驅動變動。Webhook + amplify.yml + 環境變數 + 監控維持原範圍。
- **Task #9** —— 兩項 QA 項目移入此處作為**部署後**優化層：完整 Astro `<Image>` 遷移（Q-13 強化 S-17）以及 Lighthouse 行動端基準測試。
- **Task #10** —— 不變。F-05／A-07 前置條件仍為第三語言的閘門。
- **Task #11**（5 月 7 日新增）—— 維運安全網。不變。
- **Task #12**（5 月 7 日新增）—— AI 維運管線。不變。

---

## 六、新增任務（本次合併不新增）

5 月 7 日合併新增 Task #11（維運安全網）與 Task #12（AI 維運管線）。本次納入的 QA／行動端稽核**未**產生需要再開新任務的項目。所有 QA 發現皆能乾淨對應到 Task #0f（Pre-flight）、Task #5（模式複製）或 Task #9（部署後優化）。此為刻意決定——總監的職責是盡可能將發現納入既有 12 個任務結構，新增「Task #13：行動端事項」會稀釋此紀律。

QA 稽核的*上線後優化路線圖*（其第 4 章優先度 1–7）明確為上線後工作，自然位於 Task #9 尾段。

---

## 七、決策論述

**建議：可繼續投入，但須先處理多項條件（GO WITH CAVEATS）——與 5 月 7 日相同，未變動。**

QA／行動端稽核強化了 5 月 7 日的結論。整體軌跡仍可信：12 個工作回合的實質進度、紮實架構、定案技術堆疊、無任何足以導出 HOLD 或 PIVOT 的發現。變動之處在於：第四位專家專門尋找前三位未涵蓋的事項，並發現一組上線阻擋集群（行動端導覽完全無法運作）以及三項 `CLAUDE.md` 自我矛盾。其中沒有任何項目屬架構性問題——皆為定案設計選擇之內的實作落差，這正是稽核循環應浮現的類別。

QA 發現實際上*強化*了 5 月 7 日計畫所制度化的 Pre-flight 模式論據。5 月 7 日的邏輯為：「在基底中關閉 SEO 與 EN/ES 缺口前，不要將 AI Trends 單例模式複製到 11 個頁面——否則我們會把同一問題修 11 次。」QA 稽核顯示同一邏輯適用於響應式系統：今天在 `global.css` 進行 30 分鐘的集中化，可省下明日在 11 個破損響應式拷貝上的修正成本。這是在專案生命週期的精準時點抓住了高槓桿工作，正是稽核循環應產出的價值。若 QA 稽核在 Task #5*之後*才執行，成本將約為 8–10 倍。

成本面向仍為支持論據。今日支出約每月 1.25 美元；完整 15 語系規模仍維持每月 60 美元以下。最大隱性成本——無批次遷移腳本下的人工內容輸入——是 80 小時對 13 小時的差距，遠超過任何基礎建設決策。本次 Task #0 的 QA 擴充約需 4–6 小時 Pre-flight 工作量，並避免行動端導覽問題被複製 11 份。建議核准繼續投入，條件為已擴充的 30 天優先事項清單按時落地。決策者面前的問題不是「是否值得繼續持有」——而是「是否在下次 push 前處理完上述四項缺口（安全 + SEO 基礎 + EN/ES 去地區化 + 視覺/行動端/無障礙）？」總監的回答是：是；工作邊界清楚；稽核循環正在交付其設計初衷的早期預警價值。

---

## 附錄 A——稽核來源

- `audits/technical-audit.md`（2026-05-07）——路由、Sanity schemas、i18n、Sanity-first 合規、建置設定、落差檢查
- `audits/seo-audit.md`（2026-05-07）——可索引性、多語系結構、metadata、結構化資料、圖片、效能、遷移
- `audits/automation-audit.md`（2026-05-07）——建置管線、部署觸發、環境管理、批次遷移、AI 維運、成本、監控、備份
- **`audits/qa-mobile-audit.md`（2026-05-08，新）——響應式行為、行動端導覽、觸控目標、CLAUDE.md 落差、無障礙、互動狀態**
- `summary.md`——目前專案狀態與工作回合變更紀錄
- `go-live-guide.md`——分階段部署路線圖
- `CLAUDE.md`——專案規範與設計守則
- `audits/IMPLEMENTATION_PLAN.md`——標準任務追蹤表（5 月 7 日稽核後）
- `audits/FINAL_PROJECT_AUDIT_2026-05-07.md`——上一版合併報告（差異參考）

## 附錄 B——本次合併後任務追蹤表狀態

| # | 任務 | 狀態 | 累計稽核驅動之變更（5 月 7 日 + 2026-05-08） |
|---|---|---|---|
| 1 | 重構專案結構 | ✅ 完成 | 無變更 |
| 2 | 動態 Nav 語言切換器 | ✅ 完成 | 無變更（S-14／對應頁面切換留在 #10） |
| 3 | AI Trends 的 Sanity schema POC | ✅ 完成 | 無變更 |
| 4 | 實作 Sanity POC | ✅ 完成 | 無變更 |
| **0** | **Pre-flight（5 月 7 日新增；2026-05-08 擴充）** | ⏳ 待辦 | **6 個子項目：5 月 7 日的 #0a–#0e；#0f Visual/Mobile/A11y 為新。1.5–2.5 天。** |
| 5 | 移植剩餘 11 個頁面（Batch A → B → C） | ⏳ 由 #0 阻擋 | #0 的模式強化包含本次合併新增的行動端／無障礙處理 |
| 6 | 輸入 EN + ES 內容 + 批次遷移腳本 | ⏳ 與 #5 平行 | 與 5 月 7 日相同，無變更 |
| 7 | 為 AWS Amplify 更新 `go-live-guide.md` | ✅ 完成 | 無變更 |
| 8 | 部署到 AWS Amplify 並配置 Sanity webhook | ⏳ 待辦；由 #0a 阻擋 | 與 5 月 7 日相同，無變更 |
| 9 | SEO + 效能優化（部署後） | ⏳ 待辦 | 新增：與 S-17 並行的 Q-13 圖片遷移；Q-15 完整 Tailwind CDN → 建置流程遷移；Lighthouse 行動端基準 |
| 10 | 擴展至第 3–15 種語言 | ⏳ 待辦；由 #0e 阻擋 | 與 5 月 7 日相同，無變更 |
| 11 | 維運安全網（5 月 7 日新增） | ⏳ 建議 | 無變更 |
| 12 | AI 維運管線（5 月 7 日新增） | ⏳ 建議 | 無變更 |

---

*報告結束。本合併報告日期為 2026-05-08。前一版 5 月 7 日報告已歸檔於 `audits/FINAL_PROJECT_AUDIT_2026-05-07.md` 供差異比對。*
