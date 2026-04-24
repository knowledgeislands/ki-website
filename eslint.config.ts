import type { TSESLint } from '@typescript-eslint/utils'

import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import pluginStylistic from '@stylistic/eslint-plugin'
import { defineConfig } from 'eslint/config'
import love from 'eslint-config-love'
import canonical from 'eslint-plugin-canonical'
import perfectionist from 'eslint-plugin-perfectionist'
import unusedImports from 'eslint-plugin-unused-imports'

const isTools = path.matchesGlob(path.dirname(fileURLToPath(import.meta.url)), '**/tools-*/**')

const commonRules: Record<string, TSESLint.SharedConfig.RuleEntry> = {
  // --- ESLint core rules ---
  eqeqeq: ['error', 'always', { null: 'ignore' }],
  complexity: 'off',
  'require-atomic-updates': 'off', // Re-enable at some point?
  'no-await-in-loop': 'off', // Re-enable with warn?
  'no-negated-condition': 'off',
  'no-param-reassign': 'off',
  'no-multi-assign': 'off',
  'guard-for-in': 'off',
  'max-lines': 'off',
  'max-nested-callbacks': 'off',
  'no-duplicate-imports': ['error'],
  'no-console': isTools ? 'off' : ['error'],
  'no-new': 'off',
  'no-restricted-imports': [
    'error',
    {
      patterns: [
        {
          regex: 'lodash',
          message: 'use @hnr/hnr-commons-util-nodash instead of lodash for better tree-shaking and smaller bundle sizes.',
        },
        {
          regex: 'hoek',
          message: 'use @hnr/hnr-commons-util-nodash instead of hoek for better tree-shaking and smaller bundle sizes.',
        },
      ],
    },
  ],
  'no-restricted-syntax': [
    'warn',
    {
      selector: 'ImportDeclaration[source.value=/^\\.\\.\\/(?:\\.\\.\\/)+(?:apps-|commons-|domain-|configs-|tests-|tools-).+/]',
      message: 'avoid cross-package relative imports. Use @hnr scoped package imports and exported entry points instead.',
    },
  ],

  // --- @stylistic/eslint-plugin rules ---
  '@stylistic/brace-style': ['error', '1tbs'],
  '@stylistic/comma-dangle': ['off', 'always-multiline'],
  '@stylistic/max-statements-per-line': 'off',
  '@stylistic/no-trailing-spaces': ['error'],
  '@stylistic/quote-props': ['error', 'as-needed', { unnecessary: true }],
  '@stylistic/space-before-function-paren': 'off',

  // --- @typescript-eslint rules ---
  '@typescript-eslint/class-methods-use-this': 'off',
  '@typescript-eslint/consistent-type-exports': 'off',
  '@typescript-eslint/init-declarations': 'off',
  '@typescript-eslint/max-params': 'off',
  '@typescript-eslint/no-empty-function': 'off',
  '@typescript-eslint/no-empty-object-type': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-import-type-side-effects': 'off',
  '@typescript-eslint/no-inferrable-types': 'off',
  '@typescript-eslint/no-magic-numbers': 'off',
  '@typescript-eslint/no-unnecessary-condition': 'off',
  '@typescript-eslint/no-unnecessary-template-expression': 'off',
  '@typescript-eslint/no-unnecessary-type-arguments': 'off',
  '@typescript-eslint/no-unsafe-argument': 'off',
  '@typescript-eslint/no-unsafe-assignment': 'off',
  '@typescript-eslint/no-unsafe-call': 'off',
  '@typescript-eslint/no-unsafe-member-access': 'off',
  '@typescript-eslint/no-unsafe-return': 'off',
  '@typescript-eslint/no-unsafe-type-assertion': 'off',
  '@typescript-eslint/non-nullable-type-assertion-style': 'off',
  '@typescript-eslint/only-throw-error': 'off',
  '@typescript-eslint/prefer-destructuring': 'off',
  '@typescript-eslint/require-await': 'off',
  '@typescript-eslint/strict-boolean-expressions': 'off',
  '@typescript-eslint/strict-void-return': 'off',
  '@typescript-eslint/use-unknown-in-catch-callback-variable': 'off',

  // --- perfectionist plugin rules ---
  'perfectionist/sort-objects': [
    'error',
    {
      useConfigurationIf: {
        declarationMatchesPattern: '^overrides$',
      },
      type: 'unsorted', // Do not sort overrides objects
    },
    {
      groups: [
        'ddbKeys',
        'arn',
        'id',
        'owner',
        'name',
        'unknown',
      ],
      customGroups: [
        {
          groupName: 'ddbKeys',
          elementNamePattern: '^(pk|sk)$',
        },
        {
          groupName: 'arn',
          elementNamePattern: '(?:Arn)$',
        },
        {
          groupName: 'id',
          elementNamePattern: '^(?:id)$',
        },
        {
          groupName: 'owner',
          elementNamePattern: '^(?:owner)$',
        },
        {
          groupName: 'name',
          elementNamePattern: '^(?:name)$',
        }
      ],
      type: 'unsorted',
    }
  ],

  // --- canonical plugin rules ---
  'canonical/require-extension': ['error', { ignorePackages: true }],
  // 'canonical/destructuring-property-newline': 'error',
  // 'canonical/export-specifier-newline': 'error',
  // 'canonical/import-specifier-newline': 'error',

  // --- unused-imports plugin rules ---
  'unused-imports/no-unused-imports': 'error',

  // --- promise plugin rules ---
  'promise/avoid-new': 'off',

  // --- sort-imports (core) ---
  'sort-imports': [
    'warn',
    {
      ignoreCase: true,
      ignoreDeclarationSort: true,
      ignoreMemberSort: false,
      memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      allowSeparatedGroups: false,
    },
  ],

  // --- import plugin rules (commented out) ---
  'import/extensions': ['error', 'always', { ignorePackages: true }],
  'import/order': [
    'warn',
    {
      groups: [
        'type',
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
        'object',
      ],
      'newlines-between': 'always',
      alphabetize: {
        order: 'asc', /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */
        caseInsensitive: true, /* ignore case. Options: [true, false] */
      },
    },
  ],
  'import/enforce-node-protocol-usage': ['error', 'always'],
}

export default defineConfig([
  {
    ignores: ['node_modules', 'cdk.out', 'dist', 'build', 'reports', '**/functions/**', '.claude/**', '**/*.js'],
  },
  pluginStylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: false,
    jsx: true,
  }),
  {
    files: ['**/*.mjs', '**/*.ts', '!**/*.test.ts'],
    ...love,
    languageOptions: {
      ...love.languageOptions,
    },
    linterOptions: {
      ...love.linterOptions,
    },
    plugins: {
      ...love.plugins,
      canonical,
      'unused-imports': unusedImports,
      perfectionist,
    },
    rules: {
      ...love.rules,
      ...commonRules
    }
  },
  {
    files: ['**/*.test.ts'],
    ...love,
    languageOptions: {
      ...love.languageOptions,
    },
    linterOptions: {
      ...love.linterOptions,
    },
    plugins: {
      ...love.plugins,
      canonical,
      'unused-imports': unusedImports,
      perfectionist,
    },
    rules: {
      ...love.rules,
      ...commonRules,
      'prefer-arrow-callback': 'off', // breaks vitest tests
    },
  },
])
