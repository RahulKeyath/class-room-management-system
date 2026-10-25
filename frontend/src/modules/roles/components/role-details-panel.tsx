import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ShieldCheck,
  Users,
  GraduationCap,
  Briefcase,
  HeartHandshake,
  Award,
  BookOpen,
  KeyRound,
  X,
  LogIn,
  Edit2,
  CheckCircle2,
  Calendar,
  Lock,
  ExternalLink,
} from "lucide-react";
import { AVAILABLE_PERMISSIONS } from "../data/mock-roles";
import { getRoleIcon, getRoleColorTokens } from "../lib/role-visuals";
import type { UserRoleItem, PermissionDefinition } from "../types";
import { useRole } from "@/lib/role-context";
import { toast } from "sonner";
import type { Role as SystemRole } from "@/lib/mock-data";

interface RoleDetailsPanelProps {
  role: UserRoleItem | null;
  onClose: () => void;
  onEdit: (role: UserRoleItem) => void;
  permissions?: PermissionDefinition[];
}

export function RoleDetailsPanel({
  role,
  onClose,
  onEdit,
  permissions = AVAILABLE_PERMISSIONS,
}: RoleDetailsPanelProps) {

  const { role: currentActiveRole, setRole } = useRole();

  if (!role) return null;

  const IconComponent = getRoleIcon(role.iconName);
  const colorTokens = getRoleColorTokens(role.color);
  const isCurrentActive = currentActiveRole === role.slug;

  const handleSimulateRole = () => {
    // Only core supported system roles can switch authentication session directly
    const validRoles: SystemRole[] = ["admin", "teacher", "student", "parent", "staff"];
    if (validRoles.includes(role.slug as SystemRole)) {
      setRole(role.slug as SystemRole);
      toast.success(`Switched active view to ${role.name}!`, {
        description: `You are now browsing the portal with ${role.name} access permissions.`,
      });
    } else {
      toast.info(`Simulating ${role.name} access`, {
        description: `Custom policy preview activated for ${role.name}.`,
      });
    }
  };

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header with Close */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs border"
            style={colorTokens.containerStyle}
          >
            <IconComponent className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-foreground tracking-tight">{role.name}</h3>
              {role.isSystem && (
                <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  System
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">{role.slug}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
          aria-label="Close inspector panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Status & Department Pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Badge
          variant="outline"
          className={
            role.status === "active"
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-medium"
              : "bg-muted text-muted-foreground font-medium"
          }
        >
          <span
            className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
              role.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
            }`}
          />
          {role.status === "active" ? "Active Policy" : "Inactive Policy"}
        </Badge>

        <Badge variant="secondary" className="font-semibold text-xs">
          {role.department}
        </Badge>

        <span className="text-xs text-muted-foreground ml-auto">
          {role.userCount} assigned personnel
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-xl border border-border/40">
        {role.description}
      </p>

      {/* Primary Actions: Switch & Edit */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <Button
          onClick={handleSimulateRole}
          variant={isCurrentActive ? "outline" : "default"}
          size="sm"
          className="text-xs gap-1.5 font-medium shadow-xs"
        >
          {isCurrentActive ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              Active Session
            </>
          ) : (
            <>
              <LogIn className="h-3.5 w-3.5" />
              Switch to Role
            </>
          )}
        </Button>

        <Button
          onClick={() => onEdit(role)}
          variant="outline"
          size="sm"
          className="text-xs gap-1.5 font-medium"
        >
          <Edit2 className="h-3.5 w-3.5" />
          Edit Permissions
        </Button>
      </div>

      <Separator />

      {/* Granted Permissions Summary */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
            Granted Authorizations
          </h4>
          <span className="text-[11px] font-semibold text-muted-foreground">
            {role.permissions.length} of {permissions.length} Policies
          </span>
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {role.permissions.map((permId) => {
            const def = permissions.find((p) => p.id === permId);

            return (
              <div
                key={permId}
                className="p-2 rounded-lg bg-muted/40 border border-border/40 text-xs flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-[11px] truncate">
                    {def?.name || permId}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">{def?.category}</p>
                </div>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              </div>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Sample Assigned Personnel */}
      {role.sampleUsers && role.sampleUsers.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              Sample Assigned Members
            </h4>
            <span className="text-[11px] text-muted-foreground">Recent</span>
          </div>

          <div className="space-y-2">
            {role.sampleUsers.map((u) => (
              <div
                key={u.email}
                className="flex items-center gap-2.5 p-2 rounded-xl bg-card border border-border/60"
              >
                <Avatar className="h-7 w-7 text-[10px]">
                  <AvatarFallback className="bg-accent/15 text-accent font-bold">
                    {u.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground truncate leading-tight">
                    {u.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Meta */}
      <div className="pt-2 text-[10px] text-muted-foreground flex items-center justify-between border-t border-border/40">
        <span>Created: {role.createdAt}</span>
        <span>Last Audit: {role.updatedAt}</span>
      </div>
    </div>
  );
}
