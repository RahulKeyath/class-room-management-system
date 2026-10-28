export interface Institution {
  id: string;
  name: string;
  shortName: string;
  code: string;
  type: "K-12 Campus" | "University" | "Autonomous" | "International School";
  city: string;
  campus: string;
  domain: string;
  established: number;
  motto: string;
  /** Tailwind gradient classes used for the initials avatar */
  gradient: string;
}

/**
 * Avatar gradients used by seeded and self-registered institutions. Gradients
 * now arrive from the API at runtime, so they are listed here to keep the
 * classes in Tailwind's source scan.
 */
export const INSTITUTION_GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-sky-500 to-cyan-600",
  "from-violet-500 to-purple-600",
] as const;

export const LAST_INSTITUTION_KEY = "last_selected_institution";

export function getInstitutionInitials(inst: Institution): string {
  return inst.name
    .replace(/[^A-Za-z\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 || /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function filterInstitutions(
  institutions: Institution[],
  query: string,
): Institution[] {
  const q = query.trim().toLowerCase();
  if (!q) return institutions;
  return institutions.filter((i) =>
    [i.name, i.code, i.city, i.campus, i.domain, i.type].some((f) =>
      f.toLowerCase().includes(q),
    ),
  );
}

/** Exact lookup by institutional code, domain (with or without subdomain / email), or id. */
export function findInstitutionByCodeOrDomain(
  institutions: Institution[],
  input: string,
): Institution | undefined {
  const q = input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^.*@/, "")
    .replace(/\/.*$/, "");
  if (!q) return undefined;
  return institutions.find(
    (i) =>
      i.code.toLowerCase() === q ||
      i.id === q ||
      i.domain === q ||
      q.endsWith(`.${i.domain}`) ||
      q.split(".")[0] === i.id,
  );
}

export function loadLastInstitutionId(): string | undefined {
  try {
    return localStorage.getItem(LAST_INSTITUTION_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}

export function saveLastInstitution(inst: Institution) {
  try {
    localStorage.setItem(LAST_INSTITUTION_KEY, inst.id);
  } catch {
    // Ignore
  }
}

/** Rewrites a demo email (e.g. `e.vance@northgate.edu`) onto the institution's domain. */
export function emailForInstitution(email: string, inst: Institution): string {
  return email.replace(/@.*$/, `@${inst.domain}`);
}
