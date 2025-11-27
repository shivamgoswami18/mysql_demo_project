import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import securityPlugin from 'eslint-plugin-security';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import boundariesPlugin from 'eslint-plugin-boundaries';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      security: securityPlugin,
      'simple-import-sort': simpleImportSortPlugin,
      boundaries: boundariesPlugin,
    },
    settings: {
      'boundaries/elements': [
        { type: 'constants', pattern: 'src/constants' },
        { type: 'services', pattern: 'src/services' },
        { type: 'components', pattern: 'src/components' },
      ],
    },
    rules: {
      ...securityPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // 🔐 Constants enforcement
      'no-restricted-syntax': [
        'error',
        {
          selector: "Literal[value='admin']",
          message: "Use USER_ROLES.ADMIN instead of string 'admin'",
        },
        {
          selector: "Literal[value='customer']",
          message: "Use USER_ROLES.CUSTOMER instead of string 'customer'",
        },
      ],

      // 🧱 Structure enforcement
      'boundaries/element-types': [2, {
        default: 'disallow',
        rules: [
          {
            from: 'services',
            allow: ['constants', 'utils'],
          },
          {
            from: 'components',
            allow: ['services', 'constants'],
          },
        ],
      }],
    }
  }
);
