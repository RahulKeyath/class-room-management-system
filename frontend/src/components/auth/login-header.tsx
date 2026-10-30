import { memo } from "react";
import { ArrowLeftRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DbInstitutionalRole } from "@/lib/api";
import type { Institution } from "@/lib/institutions";
import { AuthHelpModal } from "./auth-help-modal";
import { InstitutionAvatar } from "./institution-step";

/** Active-institution banner plus the Step 2 title row with the help dialog. */
export const LoginHeader = memo(function LoginHeader({
  institution,
  roleOptions,
  isLoading,
  helpOpen,
  onHelpOpenChange,
  onSwitchInstitution,
}: {
  institution: Institution;
  roleOptions: DbInstitutionalRole[];
  isLoading?: boolean;
  helpOpen: boolean;
  onHelpOpenChange: (open: boolean) => void;
  onSwitchInstitution: () => void;
}) {
  return (
    <>
      {/* Active Institution Banner */}
      <div className="mb-4 p-3 rounded-2xl border border-border/80 bg-card shadow-xs flex items-center gap-3">
        <InstitutionAvatar institution={institution} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground truncate">
            {institution.name}
          </p>
          <p className="text-[11px] text-muted-foreground truncate">
            <span className="font-mono">{institution.domain}</span> •{" "}
            {institution.campus}, {institution.city}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onSwitchInstitution}
          className="h-8 text-xs gap-1.5 shrink-0 cursor-pointer"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Switch Institution</span>
          <span className="sm:hidden">Change</span>
        </Button>
      </div>

      {/* Header */}
      <div className="mb-4 text-left">
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold">
            <Building2 className="h-3.5 w-3.5" />
            <span>Step 2 of 2 • {institution.shortName} Portal</span>
          </div>

          {/* Help & Support Button on the same line */}
          <AuthHelpModal
            open={helpOpen}
            onOpenChange={onHelpOpenChange}
            institution={institution}
            roleOptions={roleOptions}
            isLoading={isLoading}
          />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Sign In to Your Portal
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select your academic affiliation to access customized tools and
          records.
        </p>
      </div>
    </>
  );
});
