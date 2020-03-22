console.log("[config:eslint] config loaded");

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    allowImportExportEverywhere: false,
    codeFrame: false,
    ecmaVersion: 2020,
    errorOnUnknownASTType: true,
    errorOnTypeScriptSyntacticAndSemanticIssues: true,
    project: "tsconfig.json",
    sourceType: "module"
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:node/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
    "class-methods-use-this": "off",
    "dot-notation": ["error", { "allowPattern": "^(code)$" }],
    "function-paren-newline": [
      "error",
      "consistent",
    ],
    // "import/prefer-default-export": "off",
    // "import/no-unresolved": "error",
    "max-len": [
      "error",
      {
        code: 90,
        tabWidth: 2,
        ignoreComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    "no-unused-vars": "off",
    "no-underscore-dangle": ["error", { "allow": ["_id", "_headers"] }],
    "quote-props": ["error", "consistent-as-needed"]
  },
  env: {
    node: true,
    es6: true
  },
  globals: {
    beforeEach: true,
    afterEach: true,
    describe: true,
    it: true,
    expect: true,
  },
  plugins: [
    "@typescript-eslint",
    "json",
    "import"
  ],
  settings: {
    "import/extensions": [".js",".jsx",".ts",".tsx"],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts",".tsx"]
    },
    "import/resolver": {
      "typescript": {
        directory: "./configs/tsconfig.json"
      }
    }
  }
};
