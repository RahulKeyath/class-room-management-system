import { memo, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { Institution } from "@/lib/institutions";
import type { Credentials } from "./auth-constants";

export const CredentialsForm = memo(function CredentialsForm({
  institution,
  credentials,
  roleLabel,
  isLoading,
  onCredentialsChange,
  onSubmit,
  onForgotPassword,
}: {
  institution: Institution;
  credentials: Credentials;
  roleLabel?: string;
  isLoading: boolean;
  onCredentialsChange: React.Dispatch<React.SetStateAction<Credentials>>;
  onSubmit: () => void;
  onForgotPassword: () => void;
}) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.email.trim() || !credentials.password.trim()) {
      toast.error("Please enter both institutional email and password.");
      return;
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
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
            @{institution.domain}
          </span>
        </div>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={credentials.email}
            onChange={(e) =>
              onCredentialsChange((c) => ({ ...c, email: e.target.value }))
            }
            placeholder={`name@${institution.domain}`}
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
            onClick={onForgotPassword}
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
            value={credentials.password}
            onChange={(e) =>
              onCredentialsChange((c) => ({ ...c, password: e.target.value }))
            }
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
            <span>Sign In to {roleLabel || "Role"} Portal</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </>
        )}
      </Button>
    </form>
  );
});
