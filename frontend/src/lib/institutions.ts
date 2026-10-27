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

export const INSTITUTIONS: Institution[] = [
  {
    id: "northgate",
    name: "Northgate Academy",
    shortName: "Northgate",
    code: "NGA-01",
    type: "K-12 Campus",
    city: "Boston",
    campus: "Main Campus",
    domain: "northgate.edu",
    established: 1988,
    motto:
      "Virtus et Scientia — Discipline in character, distinction in scholarship.",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: "oakridge",
    name: "Oakridge International School",
    shortName: "Oakridge",
    code: "OIS-22",
    type: "International School",
    city: "Bengaluru",
    campus: "Whitefield",
    domain: "oakridge.edu",
    established: 2001,
    motto: "Global minds, grounded roots — learning without borders.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "stmarys",
    name: "St. Mary's Academy",
    shortName: "St. Mary's",
    code: "SMA-07",
    type: "Autonomous",
    city: "Kochi",
    campus: "Ernakulam",
    domain: "stmarys.edu",
    established: 1952,
    motto: "Lux et Veritas — Light and truth in every endeavour.",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    id: "beacon",
    name: "Beacon Global University",
    shortName: "Beacon",
    code: "BGU-10",
    type: "University",
    city: "Singapore",
    campus: "Marina Campus",
    domain: "beacon.edu",
    established: 1996,
    motto: "Illuminating paths to research, innovation and leadership.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: "riverside",
    name: "Riverside Public School",
    shortName: "Riverside",
    code: "RPS-03",
    type: "K-12 Campus",
    city: "Pune",
    campus: "Kalyani Nagar",
    domain: "riverside.edu",
    established: 1979,
    motto: "Flowing forward — curiosity, character, community.",
    gradient: "from-sky-500 to-cyan-600",
  },
  {
    id: "crestwood",
    name: "Crestwood Institute of Technology",
    shortName: "Crestwood",
    code: "CIT-15",
    type: "University",
    city: "Chennai",
    campus: "OMR Campus",
    domain: "crestwood.edu",
    established: 2008,
    motto: "Engineering tomorrow, one discovery at a time.",
    gradient: "from-violet-500 to-purple-600",
  },
];

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

export function filterInstitutions(query: string): Institution[] {
  const q = query.trim().toLowerCase();
  if (!q) return INSTITUTIONS;
  return INSTITUTIONS.filter((i) =>
    [i.name, i.code, i.city, i.campus, i.domain, i.type].some((f) =>
      f.toLowerCase().includes(q),
    ),
  );
}

/** Exact lookup by institutional code, domain (with or without subdomain / email), or id. */
export function findInstitutionByCodeOrDomain(
  input: string,
): Institution | undefined {
  const q = input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^.*@/, "")
    .replace(/\/.*$/, "");
  if (!q) return undefined;
  return INSTITUTIONS.find(
    (i) =>
      i.code.toLowerCase() === q ||
      i.id === q ||
      i.domain === q ||
      q.endsWith(`.${i.domain}`) ||
      q.split(".")[0] === i.id,
  );
}

export function loadLastInstitution(): Institution | undefined {
  try {
    const id = localStorage.getItem(LAST_INSTITUTION_KEY);
    return INSTITUTIONS.find((i) => i.id === id);
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
