import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: 'mq3wxr8n',
    dataset: 'production',
  },
  // Pins the deployment target so `sanity deploy` never prompts for a hostname
  // (required for the non-interactive CI run in .github/workflows/refresh-seo-data.yml).
  studioHost: 'aitokenglobal',
});
