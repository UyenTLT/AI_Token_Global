import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { media, mediaAssetSource } from 'sanity-plugin-media';
import { postSchema } from './schemas/post';
import { imageMetaSchema } from './schemas/imageMeta';
import { faqItemSchema } from './schemas/faqItem';
import { aiTrendsPageSchema } from './schemas/aiTrendsPage';
import { apiModelPageSchema } from './schemas/apiModelPage';
import { apiComparePageSchema } from './schemas/apiComparePage';
import { ArticleNumberFilter } from './components/ArticleNumberFilter';

export default defineConfig({
  name: 'ai-token-global',
  title: 'AI Token Global',
  projectId: 'mq3wxr8n',
  dataset: 'production',
  plugins: [
    structureTool(),
    visionTool(),
    media(),
    {
      name: 'article-number-filter',
      tools: [
        {
          name: 'article-lookup',
          title: 'Find by #',
          icon: () => '🔢',
          component: ArticleNumberFilter,
        },
      ],
    },
  ],
  schema: {
    types: [postSchema, imageMetaSchema, faqItemSchema, aiTrendsPageSchema, apiModelPageSchema, apiComparePageSchema],
  },
});
