import { memo } from "react";
import { Lock } from "lucide-react";
import type { Institution } from "@/lib/institutions";
import { getBrandName } from "./auth-constants";

export const LoginFooter = memo(function LoginFooter({
  institution,
  onOpenHelp,
}: {
  institution?: Institution;
  onOpenHelp: () => void;
}) {
  return (
    <div className="w-full max-w-2xl xl:max-w-3xl mx-auto pt-4 border-t border-border/70 text-center text-xs text-muted-foreground">
      <p className="flex items-center justify-center gap-1.5 text-[11px]">
        <Lock className="h-3 w-3 text-accent" />
        <span>{getBrandName(institution)} Central Authentication Service</span>
      </p>
      <div className="mt-2 flex items-center justify-center gap-3 text-[11px] text-muted-foreground/80">
        <button
          type="button"
          onClick={onOpenHelp}
          className="hover:text-foreground transition-colors"
        >
          IT Guidelines
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={onOpenHelp}
          className="hover:text-foreground transition-colors"
        >
          Acceptable Use Policy
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={onOpenHelp}
          className="hover:text-foreground transition-colors"
        >
          Privacy & FERPA
        </button>
      </div>
    </div>
  );
});
