import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  globalIgnores([
    '.next/**',
    'out/**',
    'node_modules/**',
    'public/**',
    'next-env.d.ts',
  ]),
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      'react-hooks/exhaustive-deps': 'warn',
      '@next/next/no-html-link-for-pages': 'off',
      'react/display-name': 'off',
      // Prose apostrophes/quotes in JSX content — stylistic, 200+ hits across SEO copy
      'react/no-unescaped-entities': 'off',
      // React Hooks v7 rules & TS preset are new since the eslint-config-next 16 migration;
      // existing violations are tracked as warnings rather than hard failures
      'react-hooks/static-components': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    // CommonJS config/scripts can't use ESM imports
    files: ['*.config.js', 'scripts/**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]);
