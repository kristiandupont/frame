module.exports = {
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },

  extends: ["eslint:recommended", "plugin:prettier/recommended"],

  plugins: ["prettier", "simple-import-sort", "ignore-generated", "filenames"],

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
        "@typescript-eslint/consistent-type-exports": "error",
        "@typescript-eslint/consistent-type-imports": "error",
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
      },
    },
  ],

  rules: {
    quotes: "off",
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
  },
};
