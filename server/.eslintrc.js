module.exports = {
    root: true,
    parser: "babel-eslint",
    extends: "eslint:recommended",
    env: {
        "commonjs": true,
        "es6": true,
        "node": true
    },
    globals: {
      'console': true
    },
    rules: {
         // allow async-await
        'generator-star-spacing': 'off',
        // allow debugger during development
        "indent": ["error", 4],
        "semi": ["error", "always"],
        "no-new": 0,
        "keyword-spacing": ["error", { "before": true, "after": true }],
        "space-before-function-paren": ["error", "always"],
        'quotes': ['error', 'single'],
    }
}