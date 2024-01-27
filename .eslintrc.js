module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'standard-with-typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@next/next/recommended',
    'plugin:prettier/recommended',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
    {
      files: 'next-env.d.ts',
      rules: { '@typescript-eslint/triple-slash-reference': 'off' },
    },
    {
      files: '*.config.js',
      rules: { '@typescript-eslint/no-var-requires': 'off' },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  settings: { react: { version: 'detect' } },
  rules: {
    // General
    'no-var': 'off',

    // TypeScript
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',

    // React
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',

    // Prettier
    'prettier/prettier': [
      'error',
      {
        semi: false,
        singleQuote: true,
        arrowParens: 'avoid',
        endOfLine: 'auto',

        plugins: ['prettier-plugin-tailwindcss'],
      },
    ],
  },
}
