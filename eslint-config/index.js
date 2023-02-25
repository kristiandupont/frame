module.exports = {
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: "module",
  },

  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:unicorn/recommended",
  ],

  plugins: [
    "prettier",
    "simple-import-sort",
    "unicorn",
    "ignore-generated",
    "filenames",
  ],

  env: {
    amd: true,
    node: true,
    es6: true,
  },

  overrides: [
    {
      files: ["*.js", "*.jsx"],
      parser: "@babel/eslint-parser",
      parserOptions: {
        requireConfigFile: false,
      },
      plugins: [],
      rules: {},
    },
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint/eslint-plugin"],
      extends: ["plugin:@typescript-eslint/recommended"],
      rules: {
        "no-unused-vars": "off",
        "no-undef": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
        ],
        "@typescript-eslint/prefer-nullish-coalescing": "error",
        "@typescript-eslint/explicit-module-boundary-types": "error",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-explicit-any": "off",
      },
    },
    {
      files: [
        "*.{spec,test}.{js,jsx,ts,tsx}",
        "**/__{mocks,tests}__/**/*.{js,jsx,ts,tsx}",
      ],
      rules: {
        "import/no-extraneous-dependencies": "off",
        "import/no-duplicates": "off",
        "no-underscore-dangle": "off",
        quotes: [
          1,
          "single",
          { avoidEscape: true, allowTemplateLiterals: true },
        ],
      },
    },
  ],

  rules: {
    "no-unused-expressions": "error",
    "no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "no-implicit-coercion": "error",
    "no-unused-labels": "error",
    "no-process-env": "error",
    "no-restricted-syntax": [
      "error",
      "ForInStatement",
      "LabeledStatement",
      "WithStatement",
    ],
    "no-console": ["error", { allow: ["info", "warn", "error"] }],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "arrow-body-style": ["error", "as-needed"],
    "prefer-const": "error",
    "filenames/match-exported": "error",

    "unicorn/filename-case": "off",
    "unicorn/no-array-reduce": "off",
    "unicorn/prefer-node-protocol": "off",
    "unicorn/prevent-abbreviations": "off",
    "unicorn/no-null": "off",
  },
};
