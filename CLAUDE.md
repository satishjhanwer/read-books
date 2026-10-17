# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status

The project is being rebuilt from an old react-boilerplate/Goodreads app into a Vite + React + TypeScript SPA backed by the Open Library API, hosted on GitHub Pages. [plan.md](plan.md) holds the full plan, target stack, folder structure, and phase list. Work happens on the `revamp/v3` branch, one commit per phase. The old app is only in git history (before the `revamp/v3` branch). README.md is still the old one and gets rewritten in the final phase.

## Commands

Yarn 4 via Corepack (`corepack enable`), Node from `.nvmrc`.

```sh
yarn dev             # Vite dev server at http://localhost:5173/read-books/
yarn build           # tsc -b && vite build -> dist/
yarn preview         # serve dist/
yarn lint            # ESLint (typescript-eslint strictTypeChecked)
yarn typecheck       # tsc -b
yarn test            # Vitest (jsdom, globals)
yarn test src/App.test.tsx   # single file; add -t "<name>" for one test
yarn format          # Prettier; CI runs format:check
```

CI (`.github/workflows/ci.yml`) runs format:check, lint, typecheck, test, and build. All of them must pass.

## Architecture notes

- Vite `base` is `/read-books/` (GitHub Pages project site). Router basename and asset URLs must respect it.
- The app calls Open Library straight from the browser. There is no backend.
- Planned layering (see plan.md): `src/api` holds fetch wrappers, Zod schemas, and normalizers that turn Open Library responses into app-level types. Components never see raw API shapes. TanStack Query handles server state, and the search term lives in the URL.
- `src/i18n/{en,de}.json` are the old react-intl message files, kept to migrate in phase 3.
- Vitest config lives inside `vite.config.ts`. Test setup is in `src/test/setup.ts`.

## Conventions

- Prettier: single quotes, semicolons, 2 spaces, `printWidth` 120, trailing commas, `bracketSameLine`. LF line endings are enforced by `.gitattributes`.
- TypeScript is strict with `noUncheckedIndexedAccess` and `verbatimModuleSyntax`, so use `import type` for type-only imports.
- TypeScript is pinned to `~6.0` because typescript-eslint doesn't support TS 7 yet.
