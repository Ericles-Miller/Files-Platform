module.exports = {
  env: {
    es2021: true,
    jest: true,
    node: true
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'eslint-plugin-import-helpers', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'max-len': ['error', { code: 170 }],
    'quotes': ['error', 'single', { allowTemplateLiterals: true }],
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
    'camelcase': 'off',
    'import/no-unresolved': 'error',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: true
        }
      }
    ],
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'off',
    'linebreak-style': ['error', 'windows'],
    'no-shadow': 'off',
    'no-console': 'off',
    'no-useless-constructor': 'off',
    'no-empty-function': 'off',
    'lines-between-class-members': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never'
      }
    ],
    'import-helpers/order-imports': [
      'warn',
      {
        newlinesBetween: 'always',
        groups: ['module', '/^@/', ['parent', 'sibling', 'index']],
        alphabetize: { order: 'asc', ignoreCase: true }
      }
    ],
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.spec.js'] }
    ]
  },
  settings: {
    'import/resolver': {
      typescript: {}
    }
  },
  ignores: ['node_modules'] // Substituindo o .eslintignore
};
