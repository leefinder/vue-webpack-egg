module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential', 
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  globals: {
    'LMGetID1': true,
    'LMZShowQR': true,
    'LMZShowQRVC': true,
    'LMZSkipToUrl': true,
    'LMPopWebView': true,
    'LMZSkipToUrlQR': true
  },
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  rules: {
       // allow async-await
      'generator-star-spacing': 'off',
      // allow debugger during development
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      "indent": ["error", 4],
      "semi": ["error", "always"],
      "no-new": 0,
      "keyword-spacing": ["error", { "before": true, "after": true }],
      "space-before-function-paren": ["error", "always"],
      'quotes': ['error', 'single'],
  }
}