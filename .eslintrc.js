module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['prettier', 'prettier/standard', 'plugin:vue/recommended'],
  plugins: ['vue', 'prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true
      }
    ],
    'vue/require-prop-types': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
