import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import type { UserRoleItem } from "../types";

interface RoleDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleToDelete?: UserRoleItem | null;
  onConfirmDelete: () => void;
}

export function RoleDeleteDialog({
  open,
  onOpenChange,
  roleToDelete,
  onConfirmDelete,
}: RoleDeleteDialogProps) {
  if (!roleToDelete) return null;

  const isSystem = roleToDelete.isSystem;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md p-6 sm:rounded-2xl border-destructive/20 shadow-xl">
        <AlertDialogHeader className="space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
            {isSystem ? (
              <ShieldAlert className="h-6 w-6 text-amber-500" />
            ) : (
              <AlertTriangle className="h-6 w-6" />
            )}
          </div>
          <div>
            <AlertDialogTitle className="text-lg font-bold">
              {isSystem
                ? `System Role Protected: ${roleToDelete.name}`
                : `Delete Role: ${roleToDelete.name}?`}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              {isSystem ? (
                <span>
                  <strong>{roleToDelete.name}</strong> is a core system role required for the
                  fundamental architecture of Northgate Academy. It cannot be deleted to prevent
                  orphan accounts and permission deadlock.
                </span>
              ) : (
                <span>
                  Are you sure you want to permanently delete the <strong>{roleToDelete.name}</strong>{" "}
                  role? This role currently has <strong>{roleToDelete.userCount} assigned personnel</strong>.
                  Their permissions will be revoked until reassigned. This action cannot be undone.
                </span>
              )}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 gap-2">
          <AlertDialogCancel className="text-xs">
            {isSystem ? "Close" : "Cancel"}
          </AlertDialogCancel>
          {!isSystem && (
            <AlertDialogAction
              onClick={onConfirmDelete}
              className="text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirm & Delete Role
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
