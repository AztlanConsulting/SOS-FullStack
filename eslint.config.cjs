const storybook = require('eslint-plugin-storybook');
const tsParser = require('@typescript-eslint/parser');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

const baseRules = {
  'prettier/prettier': 'error',
  '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/consistent-type-imports': [
    'warn',
    { prefer: 'type-imports' },
  ],
};

module.exports = [
  {
    ignores: [
      'eslint.config.cjs',
      'prettier.config.cjs',
      'commitlint.config.cjs',
    ],
  },

  // Proyecto
  {
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      prettier: prettierPlugin,
    },
    rules: baseRules,
  },

  // Frontend
  {
    files: ['frontend/**/*.{ts,tsx}', '!frontend/.storybook/**/*'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: [
          './frontend/tsconfig.app.json',
          './frontend/tsconfig.node.json',
        ],
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-key': 'warn',
      'react/self-closing-comp': 'warn',
      'react/no-unescaped-entities': 'warn',
    },
  },

  // Backend
  {
    files: ['backend/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './backend/tsconfig.json',
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'warn',
      '@typescript-eslint/require-await': 'warn',
    },
  },

  // Story Book
  {
    files: ['frontend/.storybook/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./frontend/tsconfig.storybook.json'],
      },
    },
  },

  // Story Book stories
  {
    files: ['**/*.stories.@(ts|tsx|js|jsx|mjs)'],
    plugins: {
      storybook,
    },
    rules: {
      ...storybook.configs.recommended.rules,
    },
  },

  prettierConfig,
];
