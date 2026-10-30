import { memo } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { DbInstitutionalRole } from "@/lib/api";
import { CURRENT_USER, type Role } from "@/lib/mock-data";
import { PERSONA_LABELS } from "./auth-constants";

export const QuickLoginGrid = memo(function QuickLoginGrid({
  roleOptions,
  selectedRole,
  isLoading,
  onQuickLogin,
}: {
  roleOptions: DbInstitutionalRole[];
  selectedRole: Role;
  isLoading: boolean;
  onQuickLogin: (role: Role) => void;
}) {
  return (
    <>
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
          const persona = CURRENT_USER[opt.slug];
          const info = PERSONA_LABELS[opt.slug];
          // Only roles with a demo persona get a quick-access tile
          if (!persona || !info) return null;
          const isSelected = selectedRole === opt.slug;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={isLoading}
              onClick={() => onQuickLogin(opt.slug)}
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
    </>
  );
});
