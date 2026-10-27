import { memo } from "react";
import {
  CalendarCheck,
  School,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import type { Institution } from "@/lib/institutions";
import { getBrandName } from "./auth-constants";
import { InstitutionAvatar } from "./institution-step";

/** Left-column desktop branding. Memoized so form typing never re-renders it. */
export const LoginShowcase = memo(function LoginShowcase({
  institution,
}: {
  institution?: Institution;
}) {
  const brandName = getBrandName(institution);
  const brandShort = institution?.shortName ?? "Northgate";

  return (
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
          {institution ? (
            <div className="ring-2 ring-accent/30 rounded-xl">
              <InstitutionAvatar institution={institution} size="lg" />
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-sidebar-primary text-white shadow-lg shadow-accent/25 border border-white/10 ring-2 ring-accent/30">
              <School className="h-6 w-6" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-[0.2em] text-white uppercase">
                {brandName}
              </span>
              {institution && (
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-accent/30 text-white/90 border border-white/10">
                  EST. {institution.established}
                </span>
              )}
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
            <p className="text-xl font-bold text-white tracking-tight">1,248</p>
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
            <p className="text-xl font-bold text-white tracking-tight">98.4%</p>
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
            <p className="text-xl font-bold text-white tracking-tight">3.82</p>
            <p className="text-[11px] text-sidebar-foreground/60 leading-tight">
              Campus GPA
            </p>
          </div>
        </div>

        {/* Academic Motto Card */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
          <p className="text-xs italic text-sidebar-foreground/90 leading-relaxed">
            &ldquo;
            {institution?.motto ??
              "One gateway for every campus — every classroom structured for brilliance and every milestone recorded with precision."}
            &rdquo;
          </p>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-sidebar-foreground/60 font-medium">
            <span>
              {institution
                ? `${institution.campus}, ${institution.city}`
                : "Office of Academic Administration"}
            </span>
            <span className="flex items-center gap-1 text-accent">
              <ShieldCheck className="h-3 w-3" />
              {institution ? institution.domain : "Verified Domain"}
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
        <span>{brandShort} SecureAccess™ v2.4</span>
      </div>
    </div>
  );
});

/** Compact brand header shown above the form on screens without the showcase column. */
export const MobileBrand = memo(function MobileBrand({
  institution,
}: {
  institution?: Institution;
}) {
  return (
    <div className="flex items-center gap-2.5 lg:hidden mb-4">
      {institution ? (
        <InstitutionAvatar institution={institution} size="sm" />
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <School className="h-5 w-5" />
        </div>
      )}
      <div>
        <span className="text-sm font-bold tracking-wider text-foreground uppercase">
          {getBrandName(institution)}
        </span>
        <p className="text-[11px] text-muted-foreground">Classroom Suite</p>
      </div>
    </div>
  );
});
