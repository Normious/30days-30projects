/** App-wide branding config. Forks rebrand here + env vars. Refs: SPEC §23.5 */
export const APP_CONFIG = {
  displayName: process.env.NEXT_PUBLIC_APP_NAME || "30 Days, 30 Projects",
  tagline: process.env.NEXT_PUBLIC_TAGLINE || "Ship. Showcase. Get discovered.",
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || "#4F46E5",
  repoUrl: "https://github.com/Normious/30days-30projects",
} as const;

export const RESERVED_USERNAMES = [
  "admin", "api", "login", "logout", "register", "dashboard",
  "discover", "u", "p", "c", "me", "settings", "about", "help",
  "organiser", "challenges",
] as const;

export const MAX_FEATURED_PROJECTS = 5;
export const MAX_CO_ORGANISERS = 5;

// ponytail: OAuth buttons hidden until Google/GitHub providers are configured
// in Supabase. Flip to true — no other change needed, the logic stays wired.
export const OAUTH_ENABLED = false;
