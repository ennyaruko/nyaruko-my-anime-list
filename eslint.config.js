import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import perfectionist from "eslint-plugin-perfectionist";
import { defineConfig, globalIgnores } from "eslint/config";

const sourceFiles = ["**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}"];

const importPathPatterns = ["^react$", "^react-.+", "^react/.+"];
const fsdSegments = [
  "app",
  "pages",
  "widgets",
  "features",
  "entities",
  "shared",
];

const customImportGroups = [
  {
    selector: "type",
    groupName: "react-type",
    elementNamePattern: importPathPatterns,
  },
  {
    groupName: "react",
    elementNamePattern: importPathPatterns,
  },
  ...fsdSegments.flatMap((segment) => [
    {
      selector: "type",
      groupName: `${segment}-type`,
      elementNamePattern: `^@/${segment}(?:/.*)?$`,
    },
    {
      groupName: segment,
      elementNamePattern: `^@/${segment}(?:/.*)?$`,
    },
  ]),
];

export default defineConfig([
  globalIgnores([
    "dist/**",
    "node_modules/**",
    "coverage/**",
    "**/*.tsbuildinfo",
  ]),
  {
    files: sourceFiles,
    extends: [js.configs.recommended],
    plugins: {
      perfectionist,
    },
    languageOptions: {
      sourceType: "module",
      ecmaVersion: "latest",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "max-lines": "off",

      "perfectionist/sort-enums": [
        "error",
        {
          order: "asc",
          type: "line-length",
        },
      ],
      "perfectionist/sort-objects": [
        "error",
        {
          order: "asc",
          type: "line-length",
        },
      ],
      "perfectionist/sort-exports": [
        "error",
        {
          order: "asc",
          type: "line-length",
        },
      ],
      "perfectionist/sort-jsx-props": [
        "error",
        {
          order: "asc",
          type: "line-length",
        },
      ],
      "perfectionist/sort-interfaces": [
        "error",
        {
          order: "asc",
          type: "line-length",
        },
      ],
      "perfectionist/sort-union-types": [
        "error",
        {
          order: "asc",
          type: "line-length",
        },
      ],
      "perfectionist/sort-object-types": [
        "error",
        {
          order: "asc",
          type: "line-length",
        },
      ],
      "perfectionist/sort-named-exports": [
        "error",
        {
          order: "asc",
          type: "line-length",
        },
      ],
      "perfectionist/sort-named-imports": [
        "error",
        {
          order: "asc",
          type: "line-length",
        },
      ],
      "perfectionist/sort-array-includes": [
        "error",
        {
          order: "asc",
          type: "line-length",
        },
      ],
      "perfectionist/sort-imports": [
        "error",
        {
          order: "asc",
          newlinesBetween: 1,
          type: "line-length",
          internalPattern: ["^@/.+"],
          customGroups: customImportGroups,
          groups: [
            ["react", "react-type"],
            [
              "type-import",
              "type-builtin",
              "type-external",
              "value-builtin",
              "value-external",
            ],
            ["internal", "type-internal", "value-internal"],
            ["app", "app-type"],
            ["pages", "pages-type"],
            ["widgets", "widgets-type"],
            ["features", "features-type"],
            ["entities", "entities-type"],
            ["shared", "shared-type"],
            ["type-parent", "value-parent"],
            ["type-sibling", "value-sibling", "type-index", "value-index"],
            "side-effect",
            "style",
            "unknown",
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    extends: [tseslint.configs.recommended],
  },
  {
    files: ["**/*.{jsx,tsx}"],
    extends: [reactHooks.configs.recommended, reactRefresh.configs.vite],
  },
]);
