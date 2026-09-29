import nextPlugin from "@next/eslint-plugin-next";

/** Flat config (Next 16 removed `next lint`; run via `pnpm lint` → `eslint .`). */
export default [
  { ignores: ["node_modules/**", ".next/**", "supabase/functions/**"] },
  {
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
];
