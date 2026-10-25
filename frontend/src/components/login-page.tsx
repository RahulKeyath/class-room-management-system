import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { ROLE_CREDENTIALS } from "@/lib/auth-types";
import { CURRENT_USER, type Role } from "@/lib/mock-data";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  School,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Users,
  Sparkles,
  HelpCircle,
  KeyRound,
  CheckCircle2,
  Building2,
  CalendarCheck,
  TrendingUp,
  LogIn,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";

interface RoleOption {
  id: Role;
  label: string;
  badge: string;
  icon: typeof School;
  description: string;
}

const ROLE_OPTIONS: RoleOption[] = [
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

const ROLE_METADATA: Record<
  string,
  { id: Role; badge: string; icon: typeof School; description: string }
> = {
  Administrator: {
    id: "admin",
    badge: "Executive",
    icon: ShieldCheck,
    description: "Principal, Deans & Operations",
  },
  Faculty: {
    id: "teacher",
    badge: "Academics",
    icon: Users,
    description: "Professors & Teaching Staff",
  },
  Student: {
    id: "student",
    badge: "Scholar",
    icon: GraduationCap,
    description: "Students & Enrolled Scholars",
  },
  Parent: {
    id: "parent",
    badge: "Guardian",
    icon: HeartHandshake,
    description: "Guardians & Student Sponsors",
  },
  Staff: {
    id: "staff",
    badge: "Operations",
    icon: Briefcase,
    description: "Administrative & Operational Staff",
  },
};

const PERSONA_LABELS: Record<
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

export function LoginPage() {
  const { login } = useAuth();

  // Fetch dynamic roles from backend database
  const { data: dbRoles } = useQuery({
    queryKey: ["userRoles"],
    queryFn: () => api.getUserRoles(),
  });

  const roleOptions: RoleOption[] = useMemo(() => {
    if (!dbRoles || dbRoles.length === 0) return ROLE_OPTIONS;

    return dbRoles.map((r) => {
      const meta = ROLE_METADATA[r.role] || {
        id: (r.role.toLowerCase() === "faculty" ? "teacher" : r.role.toLowerCase()) as Role,
        badge: "User",
        icon: School,
        description: `${r.role} Portal Access`,
      };
      return {
        id: meta.id,
        label: r.role,
        badge: meta.badge,
        icon: meta.icon,
        description: meta.description,
      };
    });
  }, [dbRoles]);

  const [selectedRole, setSelectedRole] = useState<Role>("admin");
  const [email, setEmail] = useState<string>(ROLE_CREDENTIALS.admin.email);
  const [password, setPassword] = useState<string>(ROLE_CREDENTIALS.admin.pass);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [helpOpen, setHelpOpen] = useState<boolean>(false);

  // Horizontal scroll state for Role Segmented Control
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const roleButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll]);

  const scrollRoleContainer = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = 140;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // When changing roles, automatically update suggested credentials and center role in view
  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    setEmail(ROLE_CREDENTIALS[role].email);
    setPassword(ROLE_CREDENTIALS[role].pass);

    const btn = roleButtonRefs.current[role];
    if (btn && scrollContainerRef.current) {
      btn.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both institutional email and password.");
      return;
    }

    setIsLoading(true);
    try {
      await login(selectedRole, { email, password });
      const persona = CURRENT_USER[selectedRole];
      toast.success(`Welcome back, ${persona.name}!`, {
        description: `Signed in to ${roleOptions.find((r) => r.id === selectedRole)?.label || "Portal"}.`,
      });
    } catch {
      toast.error(
        "Authentication failed. Please verify institutional credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (role: Role) => {
    setSelectedRole(role);
    setEmail(ROLE_CREDENTIALS[role].email);
    setPassword(ROLE_CREDENTIALS[role].pass);
    setIsLoading(true);

    try {
      await login(role, {
        email: ROLE_CREDENTIALS[role].email,
        password: ROLE_CREDENTIALS[role].pass,
      });
      const persona = CURRENT_USER[role];
      toast.success(`Welcome back, ${persona.name}!`, {
        description: `Authenticated as ${roleOptions.find((r) => r.id === role)?.label || role}.`,
      });
    } catch {
      toast.error("Quick sign-in encountered an issue.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentPersona = CURRENT_USER[selectedRole];
  const currentCredentials = ROLE_CREDENTIALS[selectedRole];

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground antialiased selection:bg-accent/20">
      {/* ── Left Majestic Showcase Column (Desktop Only) ── */}
      <div className="hidden lg:flex lg:w-[40%] xl:w-[38%] relative flex-col justify-between p-10 xl:p-12 bg-sidebar text-sidebar-foreground overflow-hidden border-r border-sidebar-border">
        {/* Ambient atmospheric lighting & subtle grid */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-sidebar-primary/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/4 w-96 h-96 rounded-full bg-accent/15 blur-3xl" />
          {/* Subtle micro-grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        {/* Top Header / Insignia */}
        <div className="relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-sidebar-primary text-white shadow-lg shadow-accent/25 border border-white/10 ring-2 ring-accent/30">
              <School className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-[0.2em] text-white">
                  NORTHGATE ACADEMY
                </span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-accent/30 text-white/90 border border-white/10">
                  EST. 1988
                </span>
              </div>
              <p className="text-xs text-sidebar-foreground/70 font-medium">
                Integrated Classroom & Institutional Management Suite
              </p>
            </div>
          </div>
        </div>

        {/* Centerpiece: Hero Statement & Academic Cards */}
        <div className="relative z-10 my-auto py-8 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-accent-foreground backdrop-blur-md mb-6">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>Academic Year 2026–2027 • Official Access Portal</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-[1.2] mb-4">
            Inspiring Excellence,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-indigo-100 to-white">
              Shaping Tomorrow's Leaders.
            </span>
          </h1>

          <p className="text-sm xl:text-base text-sidebar-foreground/80 leading-relaxed mb-8 font-normal">
            A state-of-the-art academic ecosystem connecting institutional
            leadership, faculty, and scholars. Streamlining attendance, academic
            records, and classroom operations.
          </p>

          {/* 3 Metric Highlight Tiles */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm hover:bg-white/[0.07] transition-all">
              <div className="flex items-center gap-2 text-accent mb-1.5">
                <Users className="h-4 w-4" />
                <span className="text-xs font-semibold text-white/90">
                  Community
                </span>
              </div>
              <p className="text-xl font-bold text-white tracking-tight">
                1,248
              </p>
              <p className="text-[11px] text-sidebar-foreground/60 leading-tight">
                Scholars & Faculty
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm hover:bg-white/[0.07] transition-all">
              <div className="flex items-center gap-2 text-success mb-1.5">
                <CalendarCheck className="h-4 w-4" />
                <span className="text-xs font-semibold text-white/90">
                  Attendance
                </span>
              </div>
              <p className="text-xl font-bold text-white tracking-tight">
                98.4%
              </p>
              <p className="text-[11px] text-sidebar-foreground/60 leading-tight">
                Average Rate
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm hover:bg-white/[0.07] transition-all">
              <div className="flex items-center gap-2 text-accent mb-1.5">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-semibold text-white/90">
                  Grading
                </span>
              </div>
              <p className="text-xl font-bold text-white tracking-tight">
                3.82
              </p>
              <p className="text-[11px] text-sidebar-foreground/60 leading-tight">
                Campus GPA
              </p>
            </div>
          </div>

          {/* Academic Motto Card */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
            <p className="text-xs italic text-sidebar-foreground/90 leading-relaxed">
              "Virtus et Scientia — Discipline in character, distinction in
              scholarship. Every classroom structured for brilliance and every
              milestone recorded with precision."
            </p>
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-sidebar-foreground/60 font-medium">
              <span>Office of Academic Administration</span>
              <span className="flex items-center gap-1 text-accent">
                <ShieldCheck className="h-3 w-3" />
                Verified Domain
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Telemetry & Status Bar */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/10 text-xs text-sidebar-foreground/60">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Gateway 8081 • Systems Operational</span>
          </div>
          <span>Northgate SecureAccess™ v2.4</span>
        </div>
      </div>

      {/* ── Right Pristine Login Column ── */}
      <div className="flex-1 lg:w-[60%] xl:w-[62%] flex flex-col justify-between p-6 sm:p-8 lg:p-8 xl:p-10 overflow-y-auto">
        {/* Center: Auth Form Container */}
        <div className="w-full max-w-2xl xl:max-w-3xl mx-auto my-auto py-2 sm:py-4">
          {/* Mobile brand presentation */}
          <div className="flex items-center gap-2.5 lg:hidden mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <School className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-wider text-foreground">
                NORTHGATE ACADEMY
              </span>
              <p className="text-[11px] text-muted-foreground">
                Classroom Suite
              </p>
            </div>
          </div>

          {/* Header */}
          <div className="mb-4 text-left">
            <div className="flex items-center justify-between mb-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold">
                <Building2 className="h-3.5 w-3.5" />
                <span>Northgate Portal Gateway</span>
              </div>

              {/* Help & Support Button on the same line */}
              <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground hover:text-foreground gap-1.5 h-7 px-2.5 hover:bg-muted/60 cursor-pointer"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>Help & Support</span>
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <KeyRound className="h-4 w-4" />
                      </div>
                      <DialogTitle className="text-lg">
                        Institutional Access Support
                      </DialogTitle>
                    </div>
                    <DialogDescription className="text-xs text-muted-foreground">
                      Credentials for Northgate Academy are issued by the Office
                      of Academic Affairs.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-3.5 text-xs py-2">
                    <div className="p-3 rounded-lg bg-muted/60 border border-border">
                      <p className="font-semibold text-foreground mb-1">
                        Demo Access Credentials
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        You can use the 1-click Quick Access buttons or enter:
                      </p>
                      <div className="mt-2 space-y-1 font-mono text-[11px]">
                        <div>
                          <span className="text-primary font-medium">
                            Admin:
                          </span>{" "}
                          e.vance@northgate.edu / Admin#2026
                        </div>
                        <div>
                          <span className="text-primary font-medium">
                            Faculty:
                          </span>{" "}
                          j.carter@northgate.edu / Teacher#2026
                        </div>
                        <div>
                          <span className="text-primary font-medium">
                            Student:
                          </span>{" "}
                          a.sharma@northgate.edu / Student#2026
                        </div>
                        <div>
                          <span className="text-primary font-medium">
                            Parent:
                          </span>{" "}
                          m.sharma@northgate.edu / Parent#2026
                        </div>
                        <div>
                          <span className="text-primary font-medium">
                            Staff:
                          </span>{" "}
                          d.wilson@northgate.edu / Staff#2026
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border border-border/80 space-y-1.5">
                      <div className="flex items-center justify-between font-medium text-foreground">
                        <span>IT Services Helpdesk</span>
                        <span className="text-[11px] text-accent">
                          Ext. 401
                        </span>
                      </div>
                      <p className="text-muted-foreground">
                        Email:{" "}
                        <span className="text-foreground">
                          helpdesk@northgate.edu
                        </span>
                      </p>
                      <p className="text-muted-foreground">
                        Hours: Monday – Friday, 07:30 – 17:30 EST
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button size="sm" onClick={() => setHelpOpen(false)}>
                      Understood
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Sign In to Your Portal
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Select your academic affiliation to access customized tools and
              records.
            </p>
          </div>

          {/* Role Selector Segmented Controls with Header Scroll Buttons */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3 gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Label className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Select Institutional Role
                  </Label>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-accent/15 text-accent">
                    {roleOptions.length} Portals
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Choose your role to switch permissions and authentication
                  credentials
                </p>
              </div>

              {/* Refined Navigation Controls in Header */}
              <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl border border-border shrink-0">
                <button
                  type="button"
                  onClick={() => scrollRoleContainer("left")}
                  disabled={!canScrollLeft}
                  className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-card hover:text-foreground text-muted-foreground disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer shadow-xs"
                  title="Scroll roles left"
                  aria-label="Scroll roles left"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-semibold px-2 text-foreground/80 tabular-nums select-none">
                  {Math.max(1, roleOptions.findIndex((r) => r.id === selectedRole) + 1)} of{" "}
                  {roleOptions.length}
                </span>
                <button
                  type="button"
                  onClick={() => scrollRoleContainer("right")}
                  disabled={!canScrollRight}
                  className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-card hover:text-foreground text-muted-foreground disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer shadow-xs"
                  title="Scroll roles right"
                  aria-label="Scroll roles right"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Full-Width Spacious Role Ribbon */}
            <div className="relative group">
              {/* Left subtle edge fade */}
              {canScrollLeft && (
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 rounded-l-2xl transition-opacity" />
              )}
              {/* Right subtle edge fade */}
              {canScrollRight && (
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 rounded-r-2xl transition-opacity" />
              )}

              <div
                ref={scrollContainerRef}
                onScroll={checkScroll}
                onWheel={(e) => {
                  if (
                    scrollContainerRef.current &&
                    Math.abs(e.deltaX) < Math.abs(e.deltaY)
                  ) {
                    scrollContainerRef.current.scrollLeft += e.deltaY;
                  }
                }}
                className="flex gap-2.5 p-2 bg-muted/40 rounded-2xl border border-border/80 overflow-x-auto scroll-smooth scrollbar-none select-none snap-x snap-mandatory"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {roleOptions.map((opt) => {
                  const isSelected = selectedRole === opt.id;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      ref={(el) => {
                        roleButtonRefs.current[opt.id] = el;
                      }}
                      type="button"
                      onClick={() => handleRoleChange(opt.id)}
                      className={`snap-center relative flex-1 min-w-[120px] sm:min-w-[126px] md:min-w-[132px] flex flex-col items-center justify-center py-3.5 px-3 rounded-xl sm:rounded-2xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-card text-foreground shadow-sm border border-accent/40 font-semibold ring-2 ring-accent/20 scale-[1.01]"
                          : "text-muted-foreground hover:text-foreground hover:bg-card/70 border border-transparent"
                      }`}
                    >
                      <div
                        className={`h-9 w-9 rounded-xl flex items-center justify-center mb-1.5 transition-all ${
                          isSelected
                            ? "bg-accent/15 text-accent shadow-xs"
                            : "bg-muted/80 text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <span className="leading-tight font-semibold tracking-tight whitespace-nowrap text-xs sm:text-[13px]">
                        {opt.label}
                      </span>
                      <span
                        className={`text-[10px] mt-1 px-2 py-0.5 rounded-full transition-colors whitespace-nowrap ${
                          isSelected
                            ? "bg-accent/15 text-accent font-semibold"
                            : "text-muted-foreground/75"
                        }`}
                      >
                        {opt.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Role Preview & Context Banner */}
            <div className="mt-3 px-3.5 py-2.5 rounded-xl bg-card border border-border/80 flex items-center justify-between text-xs transition-all shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                </span>
                <p className="text-muted-foreground truncate">
                  <span className="font-semibold text-foreground">
                    {roleOptions.find((r) => r.id === selectedRole)?.label}:
                  </span>{" "}
                  {roleOptions.find((r) => r.id === selectedRole)?.description}
                </p>
              </div>
              <span className="shrink-0 ml-2 text-[11px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-md">
                {roleOptions.find((r) => r.id === selectedRole)?.badge} Access
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-3.5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold text-foreground"
                >
                  Institutional Email or Student ID
                </Label>
                <span className="text-[11px] font-mono text-muted-foreground">
                  @northgate.edu
                </span>
              </div>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@northgate.edu"
                  required
                  className="pl-10 h-12 rounded-xl bg-card border-border/80 focus-visible:ring-accent text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold text-foreground"
                >
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => setHelpOpen(true)}
                  className="text-[11px] text-accent hover:underline font-medium cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="pl-10 pr-10 h-12 rounded-xl bg-card border-border/80 focus-visible:ring-accent text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember device checkbox */}
            <div className="flex items-center justify-between pt-0.5">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(c) => setRememberMe(!!c)}
                />
                <label
                  htmlFor="remember"
                  className="text-xs text-muted-foreground leading-none cursor-pointer"
                >
                  Keep this workstation verified for 30 days
                </label>
              </div>
            </div>

            {/* Primary Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl text-sm sm:text-base font-semibold bg-gradient-to-r from-primary to-[oklch(0.35_0.12_260)] hover:opacity-95 text-primary-foreground shadow-md transition-all mt-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>
                    Sign In to{" "}
                    {roleOptions.find((r) => r.id === selectedRole)?.label || "Role"}{" "}
                    Portal
                  </span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Separator */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground font-semibold text-[11px] tracking-wider">
                Instant Persona Quick-Access
              </span>
            </div>
          </div>

          {/* Quick Demo Sign-in Tiles */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {roleOptions.map((opt) => {
              const persona = CURRENT_USER[opt.id];
              const info = PERSONA_LABELS[opt.id];
              const isSelected = selectedRole === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleQuickLogin(opt.id)}
                  className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border transition-all text-center group cursor-pointer ${
                    isSelected
                      ? "bg-accent/5 border-accent/40 shadow-xs"
                      : "bg-card border-border/80 hover:bg-muted/60 hover:border-accent/40 hover:-translate-y-0.5"
                  }`}
                  title={`Instant sign-in as ${persona.name} (${info.roleLabel})`}
                >
                  <Avatar
                    className={`h-8 w-8 mb-1.5 ring-1 transition-all ${
                      isSelected
                        ? "ring-accent"
                        : "ring-border group-hover:ring-accent/50"
                    }`}
                  >
                    <AvatarFallback
                      className={`text-[11px] font-semibold transition-colors ${
                        isSelected
                          ? "bg-accent text-white"
                          : "bg-muted text-foreground group-hover:bg-accent group-hover:text-white"
                      }`}
                    >
                      {persona.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[11px] sm:text-xs font-semibold text-foreground truncate w-full">
                    {info.shortName}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate w-full">
                    {info.roleLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="w-full max-w-2xl xl:max-w-3xl mx-auto pt-4 border-t border-border/70 text-center text-xs text-muted-foreground">
          <p className="flex items-center justify-center gap-1.5 text-[11px]">
            <Lock className="h-3 w-3 text-accent" />
            <span>Northgate Academy Central Authentication Service</span>
          </p>
          <div className="mt-2 flex items-center justify-center gap-3 text-[11px] text-muted-foreground/80">
            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className="hover:text-foreground transition-colors"
            >
              IT Guidelines
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className="hover:text-foreground transition-colors"
            >
              Acceptable Use Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className="hover:text-foreground transition-colors"
            >
              Privacy & FERPA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}