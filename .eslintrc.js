module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    source: 'module',
    ecmaVersion: 2018,
  },
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'no-control-regex': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'sort-imports': ['error', { ignoreDeclarationSort: true, ignoreCase: true }],
    'prettier/prettier': 'warn',
  },
  ignorePatterns: ['*.d.ts', 'dist/*', '**/node_modules/*', '*.js'],
  globals: {
    WeakSet: 'readonly',
    Promise: 'readonly',
    Reflect: 'readonly',
    Symbol: 'readonly',
  },
};
