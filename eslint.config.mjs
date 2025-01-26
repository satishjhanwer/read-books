import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import reduxSaga from 'eslint-plugin-redux-saga';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11Y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';
import babelParser from '@babel/eslint-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['app/assets/*', 'internals/*', 'node_modules/*', 'build/*', '**/coverage', '.history'],
  },
  ...fixupConfigRules(
    compat.extends('eslint:recommended', 'plugin:import/recommended', 'plugin:react/recommended', 'prettier'),
  ),
  {
    plugins: {
      'redux-saga': reduxSaga,
      react: fixupPluginRules(react),
      'react-hooks': fixupPluginRules(reactHooks),
      'jsx-a11y': jsxA11Y,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
      },

      parser: babelParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      'react/jsx-props-no-spreading': 0,
      'react/display-name': 0,
    },
  },
];
