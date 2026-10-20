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
    // The original prototype UI, reconstructed from its published bundle and
    // kept as-is so it stays faithful to the design. Its minifier-era patterns
    // (`a && b()` statements, unescaped apostrophes) are not worth rewriting
    // 12k lines for. Folders are listed individually — ESLint cannot un-ignore
    // a file inside an ignored folder — so the code written for the port
    // (router.jsx, layout/AppShell.jsx, layout/RootLayout.jsx) stays linted.
    "src/legacy/assistant/**",
    "src/legacy/components/**",
    "src/legacy/context/**",
    "src/legacy/data/**",
    "src/legacy/lib/**",
    "src/legacy/onboarding/**",
    "src/legacy/pages/**",
    "src/legacy/submit/**",
    "src/legacy/layout/TopNav.jsx",
  ]),
]);

export default eslintConfig;
