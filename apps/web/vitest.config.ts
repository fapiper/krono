import path from 'node:path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['./tests/unit{,/**}/*.{test,spec}.{ts,tsx}'],
    coverage: {
      reportsDirectory: './tests/unit/coverage',
    },
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@krono/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@krono/ui/lib': path.resolve(__dirname, '../../packages/ui/src/lib'),
      '@krono/kit': path.resolve(__dirname, '../../packages/kit/src'),
      '@krono/core': path.resolve(__dirname, '../../packages/core/src'),
      '@krono/hooks': path.resolve(__dirname, '../../packages/hooks/src'),
    },
  },
});
