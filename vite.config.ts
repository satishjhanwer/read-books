import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { copyFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vitest/config';

/**
 * GitHub Pages has no SPA fallback: a deep link such as /read-books/book/OL27482W would 404.
 * Pages serves 404.html for unknown paths, so make it a copy of the app shell and let the router take over.
 */
function spaFallback(): Plugin {
  let outDir = 'dist';
  return {
    name: 'gh-pages-spa-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir;
    },
    async closeBundle() {
      await copyFile(join(outDir, 'index.html'), join(outDir, '404.html'));
    },
  };
}

const DAY = 24 * 60 * 60;

/**
 * Installable app + offline support. The service worker precaches the app shell and caches covers and
 * Open Library responses at runtime; the TanStack Query cache is also persisted (see main.tsx).
 */
const pwa = VitePWA({
  registerType: 'autoUpdate',
  injectRegister: 'script-defer',
  includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
  manifest: {
    name: 'Read Books',
    short_name: 'Read Books',
    description: 'Search books and authors using the Open Library API',
    lang: 'en',
    theme_color: '#4f46e5',
    background_color: '#f8fafc',
    display: 'standalone',
    icons: [
      { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: 'maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,svg,png}'],
    globIgnores: ['404.html'],
    // Take control on the first visit, not the next one, so pages viewed right away are cached too.
    clientsClaim: true,
    // Deep links are SPA routes: serve the cached shell (GitHub Pages would answer 404.html anyway).
    navigateFallback: 'index.html',
    runtimeCaching: [
      {
        // <img> requests are no-cors, so responses are opaque (status 0).
        urlPattern: /^https:\/\/covers\.openlibrary\.org\//,
        handler: 'CacheFirst',
        options: {
          cacheName: 'covers',
          expiration: { maxEntries: 200, maxAgeSeconds: 30 * DAY, purgeOnQuotaError: true },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        urlPattern: /^https:\/\/openlibrary\.org\/.*\.json/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'open-library',
          expiration: { maxEntries: 200, maxAgeSeconds: 7 * DAY, purgeOnQuotaError: true },
          cacheableResponse: { statuses: [200] },
        },
      },
    ],
  },
});

// Served from https://satishjhanwer.dev/read-books/ on GitHub Pages.
export default defineConfig({
  base: '/read-books/',
  plugins: [react(), tailwindcss(), pwa, spaFallback()],
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
    // The first page test in a file waits for lazy route chunks to transform, which is slow on a busy machine.
    testTimeout: 15_000,
    css: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/test/**', 'src/**/*.d.ts'],
    },
  },
});
