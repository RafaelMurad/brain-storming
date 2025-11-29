import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  base: '/brain-storming/galactic-gourmet/',
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
