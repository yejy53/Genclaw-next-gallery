import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Imported, pre-built interactive case bundles. These contain minified
    // vendor JS and binary GLB/MP4 assets, not gallery source code.
    "content/sources/web/*/app/**",
    "public/cases/**/v2/**",
  ]),
]);

export default eslintConfig;
