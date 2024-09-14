import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
    env: {
      commonjs: true,
      es2021: true,
      node: true,
      jest: true,
    },
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
];
