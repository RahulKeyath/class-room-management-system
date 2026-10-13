import type { Role } from "./mock-data";

export interface AuthUser {
  id: string;
  name: string;
  title: string;
  avatar: string;
  role: Role;
  email: string;
  department?: string;
}

export const ROLE_CREDENTIALS: Record<
  Role,
  {
    email: string;
    pass: string;
    title: string;
    department: string;
    description: string;
  }
> = {
  admin: {
    email: "e.vance@northgate.edu",
    pass: "Admin#2026",
    title: "Principal & Institutional Director",
    department: "Office of the Principal",
    description:
      "Complete institutional administrative control, staff rosters & compliance.",
  },
  teacher: {
    email: "j.carter@northgate.edu",
    pass: "Teacher#2026",
    title: "Senior Faculty • Mathematics",
    department: "Department of Mathematics",
    description:
      "Classroom attendance management, gradebook entries & timetable schedules.",
  },
  student: {
    email: "a.sharma@northgate.edu",
    pass: "Student#2026",
    title: "Scholar • Grade 10 - Section A",
    department: "Senior Secondary Division",
    description:
      "Personal academic timetable, attendance analytics & report cards.",
  },
  parent: {
    email: "m.sharma@northgate.edu",
    pass: "Parent#2026",
    title: "Guardian • Grade 10 - Section A",
    department: "Parent-Teacher Association",
    description:
      "Ward academic progress, attendance notifications & fee statements.",
  },
  staff: {
    email: "d.wilson@northgate.edu",
    pass: "Staff#2026",
    title: "Senior Registrar • Campus Operations",
    department: "Office of the Registrar",
    description:
      "Enrollment logistics, student transcripts & departmental scheduling.",
  },
};
