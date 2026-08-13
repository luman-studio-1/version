import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // React Three Fiber's rendering model is per-frame imperative mutation:
    // useFrame exists precisely to write to refs, materials, and the camera
    // outside React's render. The React Compiler immutability/purity rules
    // describe a contract R3F does not and cannot follow, so they're off for
    // the WebGL layer only — everywhere else in the app they stand.
    files: ["components/three/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/set-state-in-render": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
