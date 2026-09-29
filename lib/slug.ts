/** Slug helpers. Refs: SPEC §26.3, §26.9 */

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Build a unique slug given a title + set of taken slugs (appends -2, -3…). */
export function uniqueSlug(title: string, taken: Set<string>): string {
  const base = slugify(title) || "project";
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

/** Validate project slug shape per SPEC §10.3. */
export function isValidProjectSlug(slug: string): boolean {
  return /^[a-z0-9][a-z0-9-]{1,80}[a-z0-9]$/.test(slug);
}

/** Validate challenge slug shape per SPEC §10.3. */
export function isValidChallengeSlug(slug: string): boolean {
  return /^[a-z0-9][a-z0-9-]{1,60}[a-z0-9]$/.test(slug);
}
