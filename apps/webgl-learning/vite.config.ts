import { defineConfig } from 'vite';
import path from 'path';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

export default defineConfig({
  plugins: [
    (monacoEditorPlugin as any).default({
      languageWorkers: ['typescript', 'json', 'css', 'html'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@lessons': path.resolve(__dirname, './src/lessons'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@editor': path.resolve(__dirname, './src/editor'),
      '@api': path.resolve(__dirname, './src/api'),
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        learning: path.resolve(__dirname, 'learning.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    include: ['monaco-editor'],
  },
});
