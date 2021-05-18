module.exports = {
    env: {
        "node": true,
        "es6": true,
        "jest/globals": true
    },
    extends: [
      'airbnb-base',
    ],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
    globals: {
        firebase: "readonly",
        auth: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
          },
    rules: {
      "import/extensions": 0,
      "quotes": 0,
    },
  };