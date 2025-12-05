import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@examples': path.resolve(__dirname, './src/examples'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@shaders': path.resolve(__dirname, './src/shaders')
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
