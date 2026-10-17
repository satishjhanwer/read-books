import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Served from https://<user>.github.io/read-books/ on GitHub Pages.
export default defineConfig({
  base: '/read-books/',
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        // Long-lived vendor chunks so app-only changes don't invalidate the browser cache for them.
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/, priority: 3 },
            { name: 'router', test: /node_modules[\\/]react-router[\\/]/, priority: 2 },
            // Only libraries the first page needs; lazy-only deps (react-markdown & co.) stay in their own chunk.
            {
              name: 'vendor',
              test: /node_modules[\\/](@tanstack|react-intl|@formatjs|intl-messageformat|zod|lucide-react)[\\/]/,
              priority: 1,
            },
          ],
        },
      },
    },
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/test/**', 'src/**/*.d.ts'],
    },
  },
});
