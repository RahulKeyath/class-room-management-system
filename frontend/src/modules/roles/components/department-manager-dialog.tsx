import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  AlertTriangle,
  FolderKanban,
  Search,
} from "lucide-react";
import type { UserRoleItem } from "../types";
import { toast } from "sonner";

export interface DepartmentManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departments?: string[];
  roles: UserRoleItem[];
  onAddDepartment?: (name: string) => boolean;
  onEditDepartment?: (oldName: string, newName: string) => boolean;
  onDeleteDepartment?: (department: string, reassignTo?: string) => void;
  focusDepartment?: string | null;
}

export function DepartmentManagerDialog({
  open,
  onOpenChange,
  departments = [],
  roles,
  onAddDepartment,
  onEditDepartment,
  onDeleteDepartment,
  focusDepartment,
}: DepartmentManagerDialogProps) {
  const handleAddDept = onAddDepartment ?? (() => false);
  const handleEditDept = onEditDepartment ?? (() => false);
  const handleDeleteDept = onDeleteDepartment ?? (() => {});
  const activeFocusDept = focusDepartment;

  // Input for adding a new department
  const [newDeptName, setNewDeptName] = useState("");

  // Department currently in inline rename mode
  const [editingDeptName, setEditingDeptName] = useState<string | null>(null);
  const [editingInputVal, setEditingInputVal] = useState("");

  // Department currently in delete confirmation mode
  const [deletingDeptName, setDeletingDeptName] = useState<string | null>(null);
  const [reassignTargetDept, setReassignTargetDept] = useState<string>("");

  // Search filter for departments
  const [searchFilter, setSearchFilter] = useState("");

  // When focusDepartment is passed, jump to editing it
  React.useEffect(() => {
    if (activeFocusDept && open) {
      setEditingDeptName(activeFocusDept);
      setEditingInputVal(activeFocusDept);
    } else if (!open) {
      setEditingDeptName(null);
      setEditingInputVal("");
      setDeletingDeptName(null);
      setReassignTargetDept("");
      setNewDeptName("");
      setSearchFilter("");
    }
  }, [activeFocusDept, open]);

  // Filter departments by search
  const filteredDepartments = useMemo(() => {
    if (!searchFilter.trim()) return departments;
    return departments.filter((d) =>
      d.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [departments, searchFilter]);

  // Roles count map
  const roleCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const dept of departments) {
      map[dept] = 0;
    }
    for (const r of roles) {
      if (r.department) {
        map[r.department] = (map[r.department] || 0) + 1;
      }
    }
    return map;
  }, [departments, roles]);

  // Handle Add Department
  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newDeptName.trim();
    if (!trimmed) {
      toast.error("Please enter a department name");
      return;
    }
    const success = handleAddDept(trimmed);
    if (success) {
      setNewDeptName("");
    }
  };

  // Start inline edit
  const startEdit = (dept: string) => {
    setEditingDeptName(dept);
    setEditingInputVal(dept);
    setDeletingDeptName(null);
  };

  // Save inline edit
  const saveEdit = (oldName: string) => {
    const trimmed = editingInputVal.trim();
    if (!trimmed) {
      toast.error("Department name cannot be empty");
      return;
    }
    if (trimmed.toLowerCase() === oldName.toLowerCase() && trimmed === oldName) {
      setEditingDeptName(null);
      return;
    }
    const success = handleEditDept(oldName, trimmed);
    if (success) {
      setEditingDeptName(null);
      setEditingInputVal("");
    }
  };

  // Start delete process
  const startDelete = (dept: string) => {
    const count = roleCountMap[dept] || 0;
    const remaining = departments.filter((d) => d !== dept);

    if (count > 0 && remaining.length > 0) {
      // Require reassign target
      setDeletingDeptName(dept);
      setReassignTargetDept(remaining[0]);
      setEditingDeptName(null);
    } else {
      // Direct delete confirmation
      setDeletingDeptName(dept);
      setReassignTargetDept("");
      setEditingDeptName(null);
    }
  };

  // Confirm delete
  const confirmDelete = (dept: string) => {
    const count = roleCountMap[dept] || 0;
    if (count > 0 && !reassignTargetDept) {
      toast.error("Please select a target department to reassign roles to.");
      return;
    }
    handleDeleteDept(dept, count > 0 ? reassignTargetDept : undefined);
    setDeletingDeptName(null);
    setReassignTargetDept("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-card border-border/80 shadow-2xl">
        {/* Header */}
        <DialogHeader className="p-5 pb-4 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
              <FolderKanban className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Manage Departments
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Organize roles into custom operational departments. Create, rename, or delete departments.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Add Department Section */}
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-2">
            <Label htmlFor="new-department-input" className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5 text-accent" />
              Add New Department
            </Label>
            <form onSubmit={handleAdd} className="flex gap-2">
              <Input
                id="new-department-input"
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                placeholder="e.g. Research & Development, Safety, Admissions..."
                className="h-9 text-xs bg-background border-border/70"
              />
              <Button
                type="submit"
                size="sm"
                className="h-9 text-xs font-semibold gap-1.5 px-3.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </Button>
            </form>
          </div>

          {/* Configured Departments Header & Search */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                Configured Departments ({departments.length})
              </Label>
              {departments.length > 5 && (
                <div className="relative w-44">
                  <Search className="h-3 w-3 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Filter departments..."
                    className="h-7 pl-6.5 text-[11px] bg-muted/30 border-border/50"
                  />
                </div>
              )}
            </div>

            {/* List of departments */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {filteredDepartments.map((dept) => {
                const count = roleCountMap[dept] || 0;
                const isEditing = editingDeptName === dept;
                const isDeleting = deletingDeptName === dept;

                if (isDeleting) {
                  const otherDepartments = departments.filter((d) => d !== dept);
                  return (
                    <div
                      key={dept}
                      className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 space-y-2.5 animate-in fade-in"
                    >
                      <div className="flex items-center gap-2 text-destructive font-semibold text-xs">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>Delete department "{dept}"?</span>
                      </div>

                      {count > 0 ? (
                        <div className="space-y-2 text-xs">
                          <p className="text-muted-foreground text-[11px]">
                            There {count === 1 ? "is" : "are"}{" "}
                            <span className="font-bold text-foreground">{count}</span> {count === 1 ? "role" : "roles"} assigned to this department. Select where to move them:
                          </p>
                          <div className="flex items-center gap-2">
                            <Select
                              value={reassignTargetDept}
                              onValueChange={setReassignTargetDept}
                            >
                              <SelectTrigger className="h-8 text-xs bg-card flex-1">
                                <SelectValue placeholder="Select target department" />
                              </SelectTrigger>
                              <SelectContent>
                                {otherDepartments.map((d) => (
                                  <SelectItem key={d} value={d}>
                                    {d}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[11px] text-muted-foreground">
                          No roles are assigned to this department. It can be safely removed.
                        </p>
                      )}

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingDeptName(null)}
                          className="h-7 text-xs px-2.5 cursor-pointer"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => confirmDelete(dept)}
                          className="h-7 text-xs px-3 font-semibold cursor-pointer"
                        >
                          {count > 0 ? "Reassign & Delete" : "Confirm Delete"}
                        </Button>
                      </div>
                    </div>
                  );
                }

                if (isEditing) {
                  return (
                    <div
                      key={dept}
                      className="p-2 rounded-xl bg-accent/10 border border-accent/40 flex items-center gap-2 animate-in fade-in"
                    >
                      <Input
                        value={editingInputVal}
                        onChange={(e) => setEditingInputVal(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            saveEdit(dept);
                          } else if (e.key === "Escape") {
                            setEditingDeptName(null);
                          }
                        }}
                        className="h-8 text-xs bg-background flex-1"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => saveEdit(dept)}
                        className="h-8 w-8 p-0 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 cursor-pointer"
                        title="Save name"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingDeptName(null)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                        title="Cancel"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  );
                }

                return (
                  <div
                    key={dept}
                    className="p-2.5 px-3 rounded-xl bg-card border border-border/60 hover:border-border flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-7 w-7 rounded-lg bg-muted/60 text-muted-foreground flex items-center justify-center shrink-0 group-hover:text-foreground transition-colors">
                        <Tag className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-semibold text-xs text-foreground truncate">
                        {dept}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-normal px-1.5 py-0 rounded-md shrink-0"
                      >
                        {count} {count === 1 ? "role" : "roles"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEdit(dept)}
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                        title={`Rename "${dept}"`}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => startDelete(dept)}
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                        title={`Delete "${dept}"`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredDepartments.length === 0 && (
                <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border/80 rounded-xl">
                  No departments found matching "{searchFilter}".
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-4 border-t border-border/60 bg-muted/10 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs h-9 cursor-pointer"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
