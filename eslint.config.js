import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import boundaries from 'eslint-plugin-boundaries'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'import': importPlugin,
      'boundaries': boundaries,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                'features/*/*',
                'entities/*/*',
                'widgets/*/*',
              ],
              message: 'Import only from index.ts of the folder',
            },
          ],
        },
      ],
      'boundaries/element-types': ['error', {
    default: 'disallow',
    rules: [
      {
        from: 'shared',
        allow: ['shared'],
      },
      {
        from: 'features',
        allow: ['features'],
      },
      {
        from: 'widgets',
        allow: ['widgets'],
      },
      {
        from: 'entities',
        allow: ['entities'],
      },
    ],
  }],
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
      'boundaries/elements': [
        { type: 'shared', pattern: 'src/shared/*', mode: 'folder', entry: ['index.ts', 'index.tsx'] },
        { type: 'features', pattern: 'src/features/*', mode: 'folder', entry: ['index.ts', 'index.tsx'] },
        { type: 'entities', pattern: 'src/entities/*', mode: 'folder', entry: ['index.ts', 'index.tsx'] },
        { type: 'widgets', pattern: 'src/widgets/*', mode: 'folder', entry: ['index.ts', 'index.tsx'] },
      ],
      'boundaries/source': 'src',
    },
    
    
  },
)
