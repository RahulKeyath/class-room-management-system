import type { UserRoleItem, PermissionDefinition } from "../types";

export const AVAILABLE_PERMISSIONS: PermissionDefinition[] = [
  // Attendance Domain
  {
    id: "attendance.view",
    name: "View Attendance Records",
    description: "Inspect daily class attendance rolls, statistics, and trends.",
    category: "Attendance",
  },
  {
    id: "attendance.mark",
    name: "Mark & Submit Attendance",
    description: "Take daily morning/evening attendance for assigned classes.",
    category: "Attendance",
  },
  {
    id: "attendance.edit",
    name: "Override Past Attendance",
    description: "Modify attendance logs after submission with change audit.",
    category: "Attendance",
  },
  {
    id: "attendance.export",
    name: "Export Attendance Reports",
    description: "Download CSV, Excel, and PDF attendance summaries.",
    category: "Attendance",
  },

  // Academics Domain
  {
    id: "academics.courses",
    name: "Course & Curriculum Management",
    description: "Create course sections, syllabi, and assign teaching faculty.",
    category: "Academics",
  },
  {
    id: "academics.grades",
    name: "Grading & Performance Records",
    description: "Enter test scores, semester grades, and calculate GPAs.",
    category: "Academics",
  },
  {
    id: "academics.timetable",
    name: "Timetable & Room Scheduling",
    description: "Schedule class periods, labs, and allocate classroom facilities.",
    category: "Academics",
  },

  // Students Domain
  {
    id: "students.view",
    name: "View Student Roster",
    description: "Access student personal records, enrollments, and guardians.",
    category: "Students",
  },
  {
    id: "students.edit",
    name: "Manage Student Profiles",
    description: "Enroll new students, update contact details, and transfer classes.",
    category: "Students",
  },
  {
    id: "students.guardians",
    name: "Guardian Communications",
    description: "Send broadcast notices, emails, and SMS alerts to sponsors.",
    category: "Students",
  },

  // System & Security Domain
  {
    id: "system.roles",
    name: "Roles & Access Control",
    description: "Create, modify, and assign institutional security roles.",
    category: "System",
  },
  {
    id: "system.users",
    name: "User Account Provisioning",
    description: "Create new user logins, reset passwords, and revoke access.",
    category: "System",
  },
  {
    id: "system.audit",
    name: "Security Audit Logs",
    description: "Inspect detailed logs of user actions and sensitive overrides.",
    category: "System",
  },
];

export const INITIAL_ROLES: UserRoleItem[] = [
  {
    id: "role-admin",
    name: "Administrator",
    slug: "admin",
    department: "Administration",
    description:
      "Full administrative oversight with authority over academic records, personnel, and institutional settings.",
    status: "active",
    isSystem: true,
    userCount: 4,
    color: "indigo",
    iconName: "ShieldCheck",
    permissions: [
      "attendance.view",
      "attendance.mark",
      "attendance.edit",
      "attendance.export",
      "academics.courses",
      "academics.grades",
      "academics.timetable",
      "students.view",
      "students.edit",
      "students.guardians",
      "system.roles",
      "system.users",
      "system.audit",
    ],
    createdAt: "2025-01-10",
    updatedAt: "2026-10-12",
    sampleUsers: [
      { name: "Dr. Evelyn Vance", email: "vance.e@northgate.edu", avatar: "EV" },
      { name: "Dean Robert Sterling", email: "sterling.r@northgate.edu", avatar: "RS" },
    ],
  },
  {
    id: "role-teacher",
    name: "Faculty",
    slug: "teacher",
    department: "Academic",
    description:
      "Teaching instructors, professors, and department heads responsible for classroom delivery and grading.",
    status: "active",
    isSystem: true,
    userCount: 38,
    color: "violet",
    iconName: "Users",
    permissions: [
      "attendance.view",
      "attendance.mark",
      "attendance.export",
      "academics.courses",
      "academics.grades",
      "academics.timetable",
      "students.view",
    ],
    createdAt: "2025-01-10",
    updatedAt: "2026-09-28",
    sampleUsers: [
      { name: "Mr. Marcus Carter", email: "carter.m@northgate.edu", avatar: "MC" },
      { name: "Dr. Sarah Lin", email: "lin.s@northgate.edu", avatar: "SL" },
      { name: "Prof. Alan Turing", email: "turing.a@northgate.edu", avatar: "AT" },
    ],
  },
  {
    id: "role-student",
    name: "Student",
    slug: "student",
    department: "Student Affairs",
    description:
      "Enrolled scholars with read access to personal timetables, submitted grades, and attendance track records.",
    status: "active",
    isSystem: true,
    userCount: 520,
    color: "emerald",
    iconName: "GraduationCap",
    permissions: ["attendance.view", "academics.timetable"],
    createdAt: "2025-01-10",
    updatedAt: "2026-10-01",
    sampleUsers: [
      { name: "Aarav Sharma", email: "sharma.a@northgate.edu", avatar: "AS" },
      { name: "Priya Patel", email: "patel.p@northgate.edu", avatar: "PP" },
      { name: "Arjun Singh", email: "singh.a@northgate.edu", avatar: "AR" },
    ],
  },
  {
    id: "role-staff",
    name: "Staff",
    slug: "staff",
    department: "Operations",
    description:
      "Operational, clerical, and registrar personnel managing student records, admissions, and campus services.",
    status: "active",
    isSystem: true,
    userCount: 16,
    color: "sky",
    iconName: "Briefcase",
    permissions: [
      "attendance.view",
      "attendance.export",
      "students.view",
      "students.edit",
      "students.guardians",
    ],
    createdAt: "2025-01-15",
    updatedAt: "2026-08-14",
    sampleUsers: [
      { name: "Mr. Arthur Wilson", email: "wilson.a@northgate.edu", avatar: "AW" },
      { name: "Elena Gomez", email: "gomez.e@northgate.edu", avatar: "EG" },
    ],
  },
  {
    id: "role-parent",
    name: "Parent",
    slug: "parent",
    department: "Student Affairs",
    description:
      "Parents and sponsors accessing academic performance, attendance alerts, and institutional announcements.",
    status: "inactive",
    isSystem: false,
    userCount: 480,
    color: "amber",
    iconName: "HeartHandshake",
    permissions: ["attendance.view"],
    createdAt: "2025-02-01",
    updatedAt: "2026-10-13",
    sampleUsers: [
      { name: "Mrs. Sunita Sharma", email: "sunita.sharma@example.com", avatar: "SS" },
      { name: "Vikram Reddy", email: "v.reddy@example.com", avatar: "VR" },
    ],
  },
  {
    id: "role-exam-coordinator",
    name: "Exam Coordinator",
    slug: "exam_coordinator",
    department: "Academic",
    description:
      "Specialized faculty overseeing exam hall logistics, invigilation duty rosters, and final report cards.",
    status: "active",
    isSystem: false,
    userCount: 3,
    color: "rose",
    iconName: "Award",
    permissions: [
      "attendance.view",
      "academics.grades",
      "academics.timetable",
      "students.view",
    ],
    createdAt: "2026-04-12",
    updatedAt: "2026-09-15",
    sampleUsers: [
      { name: "Dr. Miriam O'Connor", email: "oconnor.m@northgate.edu", avatar: "MO" },
    ],
  },
];