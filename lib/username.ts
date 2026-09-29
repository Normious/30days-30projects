import { RESERVED_USERNAMES } from "./constants";

/** Username rules per SPEC §10.3. */
const USERNAME_RE = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

export function isValidUsername(username: string): boolean {
  if (!USERNAME_RE.test(username)) return false;
  if ((RESERVED_USERNAMES as readonly string[]).includes(username)) return false;
  return true;
}

/** Derive a base username from an email prefix. */
export function baseUsernameFromEmail(email: string): string {
  const prefix = email.split("@")[0] ?? "user";
  const cleaned = prefix.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  return cleaned.length >= 3 ? cleaned : `user-${cleaned || "x"}`;
}
