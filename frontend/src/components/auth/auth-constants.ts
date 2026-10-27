import {
  School,
  ShieldCheck,
  GraduationCap,
  Users,
  HeartHandshake,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import { ROLE_CREDENTIALS } from "@/lib/auth-types";
import { CURRENT_USER, type Role } from "@/lib/mock-data";
import { type Institution, emailForInstitution } from "@/lib/institutions";

export type AuthStep = "institution" | "login";

export interface RoleOption {
  id: Role;
  label: string;
  badge: string;
  icon: typeof School;
  description: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export const ROLE_OPTIONS: RoleOption[] = [
  {
    id: "admin",
    label: "Administrator",
    badge: "Executive",
    icon: ShieldCheck,
    description: "Principal, Deans & Operations",
  },
  {
    id: "teacher",
    label: "Faculty",
    badge: "Academics",
    icon: Users,
    description: "Professors & Teaching Staff",
  },
  {
    id: "student",
    label: "Student",
    badge: "Scholar",
    icon: GraduationCap,
    description: "Students & Enrolled Scholars",
  },
  {
    id: "parent",
    label: "Parent",
    badge: "Guardian",
    icon: HeartHandshake,
    description: "Guardians & Student Sponsors",
  },
  {
    id: "staff",
    label: "Staff",
    badge: "Operations",
    icon: Briefcase,
    description: "Administrative & Operational Staff",
  },
];

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

export function getRoleOption(role: Role): RoleOption | undefined {
  return ROLE_OPTIONS.find((r) => r.id === role);
}

// Demo credentials are issued per-institution on the institution's own domain
export function getDemoCredentials(
  role: Role,
  institution?: Institution,
): Credentials {
  const creds = ROLE_CREDENTIALS[role];
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
export function notifyAuthResult(role: Role, ok: boolean, quick = false) {
  if (!ok) {
    toast.error(
      quick
        ? "Quick sign-in encountered an issue."
        : "Authentication failed. Please verify institutional credentials.",
    );
    return;
  }
  const label = getRoleOption(role)?.label;
  toast.success(`Welcome back, ${CURRENT_USER[role].name}!`, {
    description: quick
      ? `Authenticated as ${label || role}.`
      : `Signed in to ${label || "Portal"}.`,
  });
}
