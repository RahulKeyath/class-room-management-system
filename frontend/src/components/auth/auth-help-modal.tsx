import { memo } from "react";
import { HelpCircle, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Institution } from "@/lib/institutions";
import { getDemoCredentials, type RoleOption } from "./auth-constants";

export const AuthHelpModal = memo(function AuthHelpModal({
  open,
  onOpenChange,
  institution,
  roleOptions,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  institution: Institution;
  roleOptions: RoleOption[];
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            Credentials for {institution.name} are issued by the Office of
            Academic Affairs.
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
              {roleOptions.map((opt) => {
                const creds = getDemoCredentials(opt.id, institution);
                return (
                  <div key={opt.id}>
                    <span className="text-primary font-medium">
                      {opt.label}:
                    </span>{" "}
                    {creds.email} / {creds.password}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border/80 space-y-1.5">
            <div className="flex items-center justify-between font-medium text-foreground">
              <span>IT Services Helpdesk</span>
              <span className="text-[11px] text-accent">Ext. 401</span>
            </div>
            <p className="text-muted-foreground">
              Email:{" "}
              <span className="text-foreground">
                helpdesk@{institution.domain}
              </span>
            </p>
            <p className="text-muted-foreground">
              Hours: Monday – Friday, 07:30 – 17:30 EST
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button size="sm" onClick={() => onOpenChange(false)}>
            Understood
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});
