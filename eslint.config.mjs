// eslint-config-next ships native ESLint Flat Config as of v16 — no more
// running it through @eslint/eslintrc's legacy-config compat bridge (that
// bridge JSON-validates configs and chokes on the circular plugin<->config
// references a flat config naturally has).
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextCoreWebVitals,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
