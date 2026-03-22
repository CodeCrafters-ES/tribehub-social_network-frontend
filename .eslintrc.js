module.exports = {
  root: true,
  extends: ['next', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        semi: true,
        singleQuote: true,
        trailingComma: 'all',
        printWidth: 80,
        tabWidth: 2,
      },
    ],
  },
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  ignorePatterns: ['dev/', 'types/', '.next/', 'node_modules/'],
};
