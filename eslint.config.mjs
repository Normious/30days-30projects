import vitals from "eslint-config-next/core-web-vitals";
import ts from "eslint-config-next/typescript";

/** Flat config (Next 16 removed `next lint`; run via `pnpm lint` → `eslint .`). */
const config = [
  { ignores: ["node_modules/**", ".next/**", "supabase/functions/**", ".kilo/**"] },
  ...vitals,
  ...ts,
];

export default config;
