import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  site: 'https://nordic-minimal.dev',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});
