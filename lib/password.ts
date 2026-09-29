import { z } from "zod";

export type PasswordCheck = { id: "length" | "case" | "digit" | "symbol"; label: string; ok: boolean };

/** Single source of truth for the registration password policy (client meter + server enforcement). */
export function passwordChecks(pw: string): PasswordCheck[] {
  return [
    { id: "length", label: "8+ characters", ok: pw.length >= 8 },
    { id: "case", label: "Upper & lower case", ok: /[a-z]/.test(pw) && /[A-Z]/.test(pw) },
    { id: "digit", label: "A number", ok: /\d/.test(pw) },
    { id: "symbol", label: "A symbol", ok: /[^A-Za-z0-9]/.test(pw) },
  ];
}

export function isStrongPassword(pw: string): boolean {
  return passwordChecks(pw).every((c) => c.ok);
}

export function weakPasswordMessage(pw: string): string {
  const missing = passwordChecks(pw).filter((c) => !c.ok).map((c) => c.label);
  return `Password must include: ${missing.join(", ")}.`;
}

export const signUpInputSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string(),
});
