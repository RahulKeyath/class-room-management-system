import { toast } from "sonner";
import { ROLE_CREDENTIALS } from "@/lib/auth-types";
import { getCurrentUser, type Role } from "@/lib/mock-data";
import { type Institution, emailForInstitution } from "@/lib/institutions";

export type AuthStep = "institution" | "login" | "register-institution";

export interface Credentials {
  email: string;
  password: string;
}

export const PERSONA_LABELS: Record<
  Role,
  { shortName: string; roleLabel: string; title: string }
> = {
  admin: {
    shortName: "Dr. Vance",
    roleLabel: "Administrator",
    title: "Principal & Executive",
  },
  teacher: {
    shortName: "Mr. Carter",
    roleLabel: "Faculty",
    title: "Mathematics Dept.",
  },
  student: {
    shortName: "Aarav S.",
    roleLabel: "Student",
    title: "Grade 10-A Scholar",
  },
  parent: {
    shortName: "Mrs. Sharma",
    roleLabel: "Parent",
    title: "Guardian (Aarav)",
  },
  staff: {
    shortName: "Mr. Wilson",
    roleLabel: "Staff",
    title: "Senior Registrar",
  },
};

// Demo credentials are issued per-institution on the institution's own domain
export function getDemoCredentials(
  role: Role,
  institution?: Institution,
): Credentials {
  const creds = ROLE_CREDENTIALS[role];
  // Roles created per institution have no demo account
  if (!creds) return { email: "", password: "" };
  return {
    email: institution
      ? emailForInstitution(creds.email, institution)
      : creds.email,
    password: creds.pass,
  };
}

// Branding falls back to the platform name until an institution is chosen
export function getBrandName(institution?: Institution) {
  return institution?.name ?? "Northgate Classroom Suite";
}

/** Shows the sign-in outcome toast; quick-login tiles use slightly different copy. */
export function notifyAuthResult(
  role: Role,
  ok: boolean,
  quick = false,
  label?: string,
) {
  if (!ok) {
    toast.error(
      quick
        ? "Quick sign-in encountered an issue."
        : "Authentication failed. Please verify institutional credentials.",
    );
    return;
  }
  toast.success(`Welcome back, ${getCurrentUser(role).name}!`, {
    description: quick
      ? `Authenticated as ${label || role}.`
      : `Signed in to ${label || "Portal"}.`,
  });
}
