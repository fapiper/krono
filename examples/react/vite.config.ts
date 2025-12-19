import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@krono/kit': path.resolve(__dirname, '../../packages/kit/src'),
      '@krono/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
});
