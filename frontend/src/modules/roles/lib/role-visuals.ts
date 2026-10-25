import React from "react";
import {
  // ── 1. Academic & Learning (25 icons) ──────────────────────
  GraduationCap,
  BookOpen,
  Book,
  Library,
  School,
  Notebook,
  NotebookPen,
  PenTool,
  Pen,
  Pencil,
  Languages,
  Bookmark,
  FileText,
  FileSpreadsheet,
  Files,
  FolderOpen,
  FileQuestion,
  FileSignature,
  Presentation,
  Binary,
  Newspaper,
  Backpack,
  Scroll,
  BookCheck,
  BookMarked,

  // ── 2. Administration & Governance (21 icons) ───────────────
  ShieldCheck,
  Shield,
  ShieldAlert,
  KeyRound,
  Key,
  Lock,
  Unlock,
  BadgeCheck,
  FileCheck,
  Crown,
  Settings,
  Sliders,
  SlidersHorizontal,
  Fingerprint,
  ScanFace,
  Eye,
  Gavel,
  Scale,
  Building,
  Landmark,
  History,

  // ── 3. Faculty, Students & People (18 icons) ────────────────
  Users,
  User,
  UserCheck,
  UserCog,
  UserPlus,
  UserMinus,
  UserX,
  HeartHandshake,
  Smile,
  Sparkles,
  Contact,
  Baby,
  Accessibility,
  HelpingHand,
  Footprints,
  PartyPopper,
  Glasses,
  Users2,

  // ── 4. Campus Operations & Facilities (26 icons) ────────────
  Briefcase,
  Building2,
  CalendarCheck,
  Calendar,
  CalendarDays,
  CalendarRange,
  Clock,
  Timer,
  AlarmClock,
  Compass,
  MapPin,
  Navigation,
  Route,
  Bus,
  Car,
  Bike,
  Truck,
  Utensils,
  Coffee,
  Wrench,
  Hammer,
  Warehouse,
  ClipboardList,
  ClipboardCheck,
  FolderKanban,
  Inbox,

  // ── 5. Science, Tech & Analytics (22 icons) ─────────────────
  FlaskConical,
  FlaskRound,
  Microscope,
  Atom,
  Dna,
  TestTube,
  TestTubes,
  Laptop,
  Monitor,
  Cpu,
  HardDrive,
  Terminal,
  Code2,
  Calculator,
  Percent,
  LineChart,
  BarChart3,
  PieChart,
  TrendingUp,
  Gauge,
  Zap,
  Radio,

  // ── 6. Arts, Media, Health & Sports (23 icons) ──────────────
  Award,
  Trophy,
  Medal,
  Star,
  Target,
  Flame,
  Palette,
  Paintbrush,
  Music,
  Headphones,
  Mic,
  Volume2,
  Camera,
  Video,
  Film,
  Dumbbell,
  Activity,
  HeartPulse,
  Stethoscope,
  Pill,
  Sparkle,
  Sun,
  Moon,

  // ── 7. Communications, Support & Finance (20 icons) ─────────
  Megaphone,
  Bell,
  Mail,
  MessageSquare,
  MessageCircle,
  Phone,
  PhoneCall,
  Send,
  Share2,
  LifeBuoy,
  HelpCircle,
  Info,
  Coins,
  CreditCard,
  Wallet,
  DollarSign,
  Receipt,
  Banknote,
  QrCode,
  Printer,
} from "lucide-react";

export type IconCategory =
  | "Academic"
  | "Administration"
  | "People"
  | "Operations"
  | "Science & Tech"
  | "Arts & Sports"
  | "Communications & Finance";

export const ICON_CATEGORIES = [
  "All",
  "Academic",
  "Administration",
  "People",
  "Operations",
  "Science & Tech",
  "Arts & Sports",
  "Communications & Finance",
] as const;

export type IconCategoryFilter = (typeof ICON_CATEGORIES)[number];

export interface IconOption {
  name: string;
  label: string;
  category: IconCategory;
  icon: React.ElementType;
}

export const ROLE_ICONS: IconOption[] = [
  // ── Academic (25) ───────────────────────────────────────────
  { name: "GraduationCap", label: "Student & Scholar", category: "Academic", icon: GraduationCap },
  { name: "BookOpen", label: "Open Textbook", category: "Academic", icon: BookOpen },
  { name: "Book", label: "Course Guide", category: "Academic", icon: Book },
  { name: "BookCheck", label: "Graded Reading", category: "Academic", icon: BookCheck },
  { name: "BookMarked", label: "Reference Material", category: "Academic", icon: BookMarked },
  { name: "Library", label: "Library & Archives", category: "Academic", icon: Library },
  { name: "School", label: "Department & Campus", category: "Academic", icon: School },
  { name: "Notebook", label: "Lecture Notes", category: "Academic", icon: Notebook },
  { name: "NotebookPen", label: "Teacher Journal", category: "Academic", icon: NotebookPen },
  { name: "Languages", label: "Foreign Languages", category: "Academic", icon: Languages },
  { name: "PenTool", label: "Curriculum Design", category: "Academic", icon: PenTool },
  { name: "Pen", label: "Evaluator / Grader", category: "Academic", icon: Pen },
  { name: "Pencil", label: "Classwork & Quizzes", category: "Academic", icon: Pencil },
  { name: "Backpack", label: "Primary / Secondary Student", category: "Academic", icon: Backpack },
  { name: "Scroll", label: "Diploma & Degree", category: "Academic", icon: Scroll },
  { name: "Presentation", label: "Lecture / Seminar", category: "Academic", icon: Presentation },
  { name: "FileText", label: "Course Syllabus", category: "Academic", icon: FileText },
  { name: "FileSpreadsheet", label: "Grade Sheet", category: "Academic", icon: FileSpreadsheet },
  { name: "Files", label: "Student Dossier", category: "Academic", icon: Files },
  { name: "FolderOpen", label: "Open Repository", category: "Academic", icon: FolderOpen },
  { name: "FileQuestion", label: "Exam Question Paper", category: "Academic", icon: FileQuestion },
  { name: "FileSignature", label: "Signed Transcript", category: "Academic", icon: FileSignature },
  { name: "Bookmark", label: "Curriculum Bookmark", category: "Academic", icon: Bookmark },
  { name: "Binary", label: "Digital Literacy", category: "Academic", icon: Binary },
  { name: "Newspaper", label: "Academic Journal", category: "Academic", icon: Newspaper },

  // ── Administration & Governance (21) ────────────────────────
  { name: "ShieldCheck", label: "Principal & Executive", category: "Administration", icon: ShieldCheck },
  { name: "Shield", label: "Campus Security", category: "Administration", icon: Shield },
  { name: "ShieldAlert", label: "Disciplinary Officer", category: "Administration", icon: ShieldAlert },
  { name: "Crown", label: "Chancellor & Trust", category: "Administration", icon: Crown },
  { name: "Gavel", label: "Judicial & Ethics Board", category: "Administration", icon: Gavel },
  { name: "Scale", label: "Legal & Compliance", category: "Administration", icon: Scale },
  { name: "Building", label: "Central Administration", category: "Administration", icon: Building },
  { name: "Landmark", label: "Board of Governors", category: "Administration", icon: Landmark },
  { name: "KeyRound", label: "Master Key Access", category: "Administration", icon: KeyRound },
  { name: "Key", label: "Building Keyholder", category: "Administration", icon: Key },
  { name: "Lock", label: "Confidential Records", category: "Administration", icon: Lock },
  { name: "Unlock", label: "Open Access Officer", category: "Administration", icon: Unlock },
  { name: "BadgeCheck", label: "Accreditation Lead", category: "Administration", icon: BadgeCheck },
  { name: "FileCheck", label: "Registrar Approval", category: "Administration", icon: FileCheck },
  { name: "Settings", label: "System Administrator", category: "Administration", icon: Settings },
  { name: "Sliders", label: "Policy Configurator", category: "Administration", icon: Sliders },
  { name: "SlidersHorizontal", label: "Portal Preferences", category: "Administration", icon: SlidersHorizontal },
  { name: "Fingerprint", label: "Biometric Attendance", category: "Administration", icon: Fingerprint },
  { name: "ScanFace", label: "Facial ID Security", category: "Administration", icon: ScanFace },
  { name: "Eye", label: "Campus Proctor", category: "Administration", icon: Eye },
  { name: "History", label: "Audit Log Examiner", category: "Administration", icon: History },

  // ── People & Community (18) ─────────────────────────────────
  { name: "Users", label: "Teaching Faculty", category: "People", icon: Users },
  { name: "Users2", label: "Student Council", category: "People", icon: Users2 },
  { name: "User", label: "Individual Member", category: "People", icon: User },
  { name: "UserCheck", label: "Attendance Officer", category: "People", icon: UserCheck },
  { name: "UserCog", label: "Staff Operations / HR", category: "People", icon: UserCog },
  { name: "UserPlus", label: "Admissions Counselor", category: "People", icon: UserPlus },
  { name: "UserMinus", label: "Withdrawal Officer", category: "People", icon: UserMinus },
  { name: "UserX", label: "Suspension Officer", category: "People", icon: UserX },
  { name: "HeartHandshake", label: "Parent & Guardian", category: "People", icon: HeartHandshake },
  { name: "HelpingHand", label: "Special Education Aid", category: "People", icon: HelpingHand },
  { name: "Contact", label: "Student Directory", category: "People", icon: Contact },
  { name: "Baby", label: "Kindergarten / Pre-K", category: "People", icon: Baby },
  { name: "Smile", label: "Student Counselor", category: "People", icon: Smile },
  { name: "Sparkles", label: "Academic Mentor", category: "People", icon: Sparkles },
  { name: "Accessibility", label: "Inclusion & Accessibility", category: "People", icon: Accessibility },
  { name: "Glasses", label: "Senior Professor", category: "People", icon: Glasses },
  { name: "Footprints", label: "Primary Monitor", category: "People", icon: Footprints },
  { name: "PartyPopper", label: "Student Activities", category: "People", icon: PartyPopper },

  // ── Campus Operations (26) ──────────────────────────────────
  { name: "Briefcase", label: "Operations & Bursar", category: "Operations", icon: Briefcase },
  { name: "Building2", label: "Facilities & Estates", category: "Operations", icon: Building2 },
  { name: "CalendarCheck", label: "Timetable Scheduler", category: "Operations", icon: CalendarCheck },
  { name: "Calendar", label: "Academic Calendar", category: "Operations", icon: Calendar },
  { name: "CalendarDays", label: "Duty Roster", category: "Operations", icon: CalendarDays },
  { name: "CalendarRange", label: "Term Dates", category: "Operations", icon: CalendarRange },
  { name: "Clock", label: "Bell & Shift Manager", category: "Operations", icon: Clock },
  { name: "Timer", label: "Exam Timing Invigilator", category: "Operations", icon: Timer },
  { name: "AlarmClock", label: "Morning Roll Caller", category: "Operations", icon: AlarmClock },
  { name: "ClipboardCheck", label: "Daily Inspection", category: "Operations", icon: ClipboardCheck },
  { name: "ClipboardList", label: "Inventory Inspector", category: "Operations", icon: ClipboardList },
  { name: "FolderKanban", label: "Department Projects", category: "Operations", icon: FolderKanban },
  { name: "Inbox", label: "Central Mailroom", category: "Operations", icon: Inbox },
  { name: "Compass", label: "Campus Navigation", category: "Operations", icon: Compass },
  { name: "MapPin", label: "Bus Route Stop", category: "Operations", icon: MapPin },
  { name: "Navigation", label: "Field Trip Coordinator", category: "Operations", icon: Navigation },
  { name: "Route", label: "Transport Logistics", category: "Operations", icon: Route },
  { name: "Bus", label: "School Bus Transport", category: "Operations", icon: Bus },
  { name: "Car", label: "Staff Parking Lead", category: "Operations", icon: Car },
  { name: "Bike", label: "Eco-Campus Officer", category: "Operations", icon: Bike },
  { name: "Truck", label: "Deliveries & Supply", category: "Operations", icon: Truck },
  { name: "Utensils", label: "Dining Hall & Cafeteria", category: "Operations", icon: Utensils },
  { name: "Coffee", label: "Faculty Lounge", category: "Operations", icon: Coffee },
  { name: "Wrench", label: "Campus Maintenance", category: "Operations", icon: Wrench },
  { name: "Hammer", label: "Carpentry & Repairs", category: "Operations", icon: Hammer },
  { name: "Warehouse", label: "Central Storekeeper", category: "Operations", icon: Warehouse },

  // ── Science, Tech & Analytics (22) ──────────────────────────
  { name: "FlaskConical", label: "Chemistry Lab Lead", category: "Science & Tech", icon: FlaskConical },
  { name: "FlaskRound", label: "Research Scientist", category: "Science & Tech", icon: FlaskRound },
  { name: "Microscope", label: "Biology & Life Sciences", category: "Science & Tech", icon: Microscope },
  { name: "Atom", label: "Physics & Nuclear Lab", category: "Science & Tech", icon: Atom },
  { name: "Dna", label: "Genetics & Biotechnology", category: "Science & Tech", icon: Dna },
  { name: "TestTube", label: "Science Practical Assistant", category: "Science & Tech", icon: TestTube },
  { name: "TestTubes", label: "Senior Laboratory Manager", category: "Science & Tech", icon: TestTubes },
  { name: "Laptop", label: "Computer Science Dept", category: "Science & Tech", icon: Laptop },
  { name: "Monitor", label: "IT Lab Instructor", category: "Science & Tech", icon: Monitor },
  { name: "Cpu", label: "Robotics & Hardware Lab", category: "Science & Tech", icon: Cpu },
  { name: "HardDrive", label: "Data Center Admin", category: "Science & Tech", icon: HardDrive },
  { name: "Terminal", label: "Software Engineering", category: "Science & Tech", icon: Terminal },
  { name: "Code2", label: "Coding Club Lead", category: "Science & Tech", icon: Code2 },
  { name: "Calculator", label: "Mathematics Dept", category: "Science & Tech", icon: Calculator },
  { name: "Percent", label: "Statistics & Data", category: "Science & Tech", icon: Percent },
  { name: "LineChart", label: "Performance Analytics", category: "Science & Tech", icon: LineChart },
  { name: "BarChart3", label: "Attendance Metrics", category: "Science & Tech", icon: BarChart3 },
  { name: "PieChart", label: "Demographic Insights", category: "Science & Tech", icon: PieChart },
  { name: "TrendingUp", label: "Progress Analyst", category: "Science & Tech", icon: TrendingUp },
  { name: "Gauge", label: "Efficiency Evaluator", category: "Science & Tech", icon: Gauge },
  { name: "Zap", label: "Electrical Engineering", category: "Science & Tech", icon: Zap },
  { name: "Radio", label: "Campus Radio & Comm", category: "Science & Tech", icon: Radio },

  // ── Arts, Media, Health & Sports (23) ───────────────────────
  { name: "Award", label: "Exam Controller", category: "Arts & Sports", icon: Award },
  { name: "Trophy", label: "Athletic Director", category: "Arts & Sports", icon: Trophy },
  { name: "Medal", label: "Honors & Merit Lead", category: "Arts & Sports", icon: Medal },
  { name: "Star", label: "Head Prefect / Valedictorian", category: "Arts & Sports", icon: Star },
  { name: "Target", label: "Advisory & Strategy", category: "Arts & Sports", icon: Target },
  { name: "Flame", label: "House Captain / Spirit", category: "Arts & Sports", icon: Flame },
  { name: "Palette", label: "Visual Arts & Design", category: "Arts & Sports", icon: Palette },
  { name: "Paintbrush", label: "Studio Art Instructor", category: "Arts & Sports", icon: Paintbrush },
  { name: "Music", label: "Music Department", category: "Arts & Sports", icon: Music },
  { name: "Headphones", label: "Audio-Visual Technician", category: "Arts & Sports", icon: Headphones },
  { name: "Mic", label: "Debate & Public Speaking", category: "Arts & Sports", icon: Mic },
  { name: "Volume2", label: "Campus Announcer", category: "Arts & Sports", icon: Volume2 },
  { name: "Camera", label: "Photography & Yearbook", category: "Arts & Sports", icon: Camera },
  { name: "Video", label: "Media Studies / Video", category: "Arts & Sports", icon: Video },
  { name: "Film", label: "Film & Theatre Director", category: "Arts & Sports", icon: Film },
  { name: "Dumbbell", label: "Fitness & Gymnasium", category: "Arts & Sports", icon: Dumbbell },
  { name: "Activity", label: "Physical Education", category: "Arts & Sports", icon: Activity },
  { name: "HeartPulse", label: "Campus Nurse & Infirmary", category: "Arts & Sports", icon: HeartPulse },
  { name: "Stethoscope", label: "Medical Officer", category: "Arts & Sports", icon: Stethoscope },
  { name: "Pill", label: "Pharmacy & First Aid", category: "Arts & Sports", icon: Pill },
  { name: "Sparkle", label: "Talent Development", category: "Arts & Sports", icon: Sparkle },
  { name: "Sun", label: "Day Boarding Lead", category: "Arts & Sports", icon: Sun },
  { name: "Moon", label: "Night Warden / Dormitory", category: "Arts & Sports", icon: Moon },

  // ── Communications & Finance (20) ───────────────────────────
  { name: "Megaphone", label: "Public Relations & Press", category: "Communications & Finance", icon: Megaphone },
  { name: "Bell", label: "Notifications Officer", category: "Communications & Finance", icon: Bell },
  { name: "Mail", label: "Correspondence Desk", category: "Communications & Finance", icon: Mail },
  { name: "MessageSquare", label: "Feedback & Grievances", category: "Communications & Finance", icon: MessageSquare },
  { name: "MessageCircle", label: "Parent Chat Coordinator", category: "Communications & Finance", icon: MessageCircle },
  { name: "Phone", label: "Reception & Enquiries", category: "Communications & Finance", icon: Phone },
  { name: "PhoneCall", label: "Helpline Operator", category: "Communications & Finance", icon: PhoneCall },
  { name: "Send", label: "Dispatch Coordinator", category: "Communications & Finance", icon: Send },
  { name: "Share2", label: "Alumni Relations", category: "Communications & Finance", icon: Share2 },
  { name: "LifeBuoy", label: "Student Crisis Support", category: "Communications & Finance", icon: LifeBuoy },
  { name: "HelpCircle", label: "IT Helpdesk Lead", category: "Communications & Finance", icon: HelpCircle },
  { name: "Info", label: "Information Kiosk", category: "Communications & Finance", icon: Info },
  { name: "Coins", label: "Student Petty Cash", category: "Communications & Finance", icon: Coins },
  { name: "CreditCard", label: "Fee Collection Desk", category: "Communications & Finance", icon: CreditCard },
  { name: "Wallet", label: "Bursary & Grants", category: "Communications & Finance", icon: Wallet },
  { name: "DollarSign", label: "Scholarship Trustee", category: "Communications & Finance", icon: DollarSign },
  { name: "Receipt", label: "Invoice & Billing Clerk", category: "Communications & Finance", icon: Receipt },
  { name: "Banknote", label: "Payroll Administrator", category: "Communications & Finance", icon: Banknote },
  { name: "QrCode", label: "Digital Pass & Scanner", category: "Communications & Finance", icon: QrCode },
  { name: "Printer", label: "Reprographics & Print", category: "Communications & Finance", icon: Printer },
];

export const ICON_NAME_MAP: Record<string, React.ElementType> = ROLE_ICONS.reduce(
  (acc, curr) => {
    acc[curr.name] = curr.icon;
    return acc;
  },
  {} as Record<string, React.ElementType>
);

export function getRoleIcon(iconName: string): React.ElementType {
  return ICON_NAME_MAP[iconName] || ShieldCheck;
}

/* ── PRESET LUXURY COLOR PALETTE ────────────────────────── */
export interface ColorPreset {
  id: string;
  name: string;
  hex: string;
}

export const PRESET_COLORS: ColorPreset[] = [
  { id: "indigo", name: "Royal Indigo", hex: "#6366f1" },
  { id: "violet", name: "Electric Violet", hex: "#8b5cf6" },
  { id: "purple", name: "Deep Purple", hex: "#a855f7" },
  { id: "fuchsia", name: "Vibrant Fuchsia", hex: "#d946ef" },
  { id: "pink", name: "Rose Pink", hex: "#ec4899" },
  { id: "rose", name: "Crimson Rose", hex: "#f43f5e" },
  { id: "red", name: "Ruby Red", hex: "#ef4444" },
  { id: "orange", name: "Solar Orange", hex: "#f97316" },
  { id: "amber", name: "Golden Amber", hex: "#f59e0b" },
  { id: "yellow", name: "Warm Yellow", hex: "#eab308" },
  { id: "lime", name: "Citrus Lime", hex: "#84cc16" },
  { id: "emerald", name: "Emerald Green", hex: "#10b981" },
  { id: "teal", name: "Deep Teal", hex: "#14b8a6" },
  { id: "cyan", name: "Cyan Aqua", hex: "#06b6d4" },
  { id: "sky", name: "Azure Sky", hex: "#0ea5e9" },
  { id: "blue", name: "Cobalt Blue", hex: "#3b82f6" },
  { id: "slate", name: "Classic Slate", hex: "#64748b" },
  { id: "zinc", name: "Charcoal Zinc", hex: "#71717a" },
];

const NAMED_HEX_MAP: Record<string, string> = {
  indigo: "#6366f1",
  violet: "#8b5cf6",
  purple: "#a855f7",
  fuchsia: "#d946ef",
  pink: "#ec4899",
  rose: "#f43f5e",
  red: "#ef4444",
  orange: "#f97316",
  amber: "#f59e0b",
  yellow: "#eab308",
  lime: "#84cc16",
  emerald: "#10b981",
  teal: "#14b8a6",
  cyan: "#06b6d4",
  sky: "#0ea5e9",
  blue: "#3b82f6",
  slate: "#64748b",
  zinc: "#71717a",
};

/**
 * Returns clean styling tokens for any color (preset name or arbitrary hex code).
 */
export function getRoleColorTokens(colorInput?: string) {
  const input = (colorInput || "indigo").trim();
  let hex = input;

  if (NAMED_HEX_MAP[input.toLowerCase()]) {
    hex = NAMED_HEX_MAP[input.toLowerCase()];
  } else if (!hex.startsWith("#")) {
    hex = `#${hex}`;
  }

  // Validate hex format (default to indigo if invalid)
  if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex)) {
    hex = "#6366f1";
  }

  // 6-digit hex expansion
  if (hex.length === 4) {
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return {
    hex,
    // Styles for main role icon container
    containerStyle: {
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.14)`,
      color: hex,
      borderColor: `rgba(${r}, ${g}, ${b}, 0.28)`,
    } as React.CSSProperties,

    // Subtle card border glow
    borderGlowStyle: {
      borderColor: `rgba(${r}, ${g}, ${b}, 0.4)`,
      boxShadow: `0 0 16px -4px rgba(${r}, ${g}, ${b}, 0.25)`,
    } as React.CSSProperties,

    // Badge style
    badgeStyle: {
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.12)`,
      color: hex,
      borderColor: `rgba(${r}, ${g}, ${b}, 0.25)`,
    } as React.CSSProperties,

    // Subtle dot style
    dotStyle: {
      backgroundColor: hex,
    } as React.CSSProperties,
  };
}
