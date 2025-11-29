import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  site: 'https://rafaelmurad.github.io',
  base: '/brain-storming/cosmic-void',
});
