/** Role helpers. Refs: SPEC §4. Linear hierarchy: admin > organiser > participant > user. */

export type PlatformRole = "user" | "participant" | "organiser" | "admin";

const RANK: Record<PlatformRole, number> = { user: 0, participant: 1, organiser: 2, admin: 3 };

export function hasRole(userRole: PlatformRole | undefined, required: PlatformRole): boolean {
  if (!userRole) return false;
  return RANK[userRole] >= RANK[required];
}

export function isAdmin(role: PlatformRole | undefined): boolean {
  return role === "admin";
}

export function canModerate(role: PlatformRole | undefined): boolean {
  return hasRole(role, "organiser");
}
