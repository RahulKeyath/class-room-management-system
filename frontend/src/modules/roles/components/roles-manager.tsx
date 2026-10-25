import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ShieldCheck,
  Users,
  GraduationCap,
  Briefcase,
  HeartHandshake,
  Award,
  BookOpen,
  KeyRound,
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  Power,
  Sparkles,
  Shield,
  Layers,
  UserCheck,
  Lock,
  ArrowUpDown,
  CheckSquare,
  Tag,
  FolderKanban,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { INITIAL_ROLES, AVAILABLE_PERMISSIONS } from "../data/mock-roles";
import { getRoleIcon, getRoleColorTokens } from "../lib/role-visuals";
import type { UserRoleItem, RoleFormData, Department, PermissionDefinition } from "../types";
import { RoleDialog } from "./role-dialog";
import { RoleDeleteDialog } from "./role-delete-dialog";
import { RoleDetailsPanel } from "./role-details-panel";
import { DepartmentManagerDialog } from "./department-manager-dialog";
import { useRole } from "@/lib/role-context";
import { api, type DbInstitutionalRole } from "@/lib/api";

const mapDbRoleToItem = (dbRole: DbInstitutionalRole): UserRoleItem => ({
  id: String(dbRole.id),
  name: dbRole.name,
  slug: dbRole.slug,
  department: dbRole.department || "Academic",
  description: dbRole.description || "",
  status: (dbRole.status as "active" | "inactive") || "active",
  isSystem: dbRole.isSystem ?? false,
  userCount: 0,
  color: dbRole.color || "#6366f1",
  iconName: dbRole.iconName || "ShieldCheck",
  permissions: dbRole.permissions || [],
  createdAt: dbRole.createdAt || new Date().toISOString().split("T")[0],
  updatedAt: dbRole.updatedAt || new Date().toISOString().split("T")[0],
});

export function RolesManager() {
  // Departments loaded directly from the database table 'departments'
  const [departments, setDepartments] = useState<string[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);

  // Permissions loaded directly from the database table 'permissions'
  const [permissions, setPermissions] = useState<PermissionDefinition[]>(AVAILABLE_PERMISSIONS);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);

  // Institutional roles loaded directly from the database tables 'roles' and 'role_permissions'
  const [roles, setRoles] = useState<UserRoleItem[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  const loadDepartments = async () => {
    try {
      setIsLoadingDepartments(true);
      const data = await api.getDepartments();
      // data is an array of records from the database table: [] or [{id, name}, ...]
      setDepartments(data.map((c) => c.name));
    } catch (e) {
      console.error("Failed to load departments from database:", e);
    } finally {
      setIsLoadingDepartments(false);
    }
  };

  const loadPermissions = async () => {
    try {
      setIsLoadingPermissions(true);
      const data = await api.getPermissions();
      if (Array.isArray(data) && data.length > 0) {
        setPermissions(data as PermissionDefinition[]);
      }
    } catch (e) {
      console.error("Failed to load permissions from database:", e);
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  const loadRoles = async () => {
    try {
      setIsLoadingRoles(true);
      const data = await api.getInstitutionalRoles();
      if (Array.isArray(data)) {
        const mapped = data.map(mapDbRoleToItem);
        setRoles(mapped);
        if (mapped.length > 0) {
          setSelectedRoleId((prev) => (prev && mapped.some((r) => r.id === prev) ? prev : mapped[0].id));
        }
      }
    } catch (e) {
      console.error("Failed to load roles from database:", e);
      toast.error("Failed to load roles from database");
    } finally {
      setIsLoadingRoles(false);
    }
  };

  useEffect(() => {
    loadDepartments();
    loadPermissions();
    loadRoles();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<"All" | Department>("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Selected single role for the inspector panel
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  // Multi-selection for bulk operations
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);


  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<UserRoleItem | null>(null);
  const [deletingRole, setDeletingRole] = useState<UserRoleItem | null>(null);

  // Department Manager dialog states
  const [isDepartmentManagerOpen, setIsDepartmentManagerOpen] = useState(false);
  const [departmentToFocus, setDepartmentToFocus] = useState<string | null>(null);

  const { role: currentSessionRole, setRole: setSessionRole } = useRole();

  /* ── Derived Statistics ─────────────────────────────────── */
  const stats = useMemo(() => {
    const total = roles.length;
    const active = roles.filter((r) => r.status === "active").length;
    const inactive = roles.filter((r) => r.status === "inactive").length;
    const totalPersonnel = roles.reduce((sum, r) => sum + r.userCount, 0);
    return { total, active, inactive, totalPersonnel };
  }, [roles]);

  /* ── Filtered Roles ─────────────────────────────────────── */
  const filteredRoles = useMemo(() => {
    return roles.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.slug.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment =
        selectedDepartment === "All" || r.department === selectedDepartment;

      const matchesStatus =
        statusFilter === "all" || r.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [roles, searchQuery, selectedDepartment, statusFilter]);

  const currentlyInspectedRole = useMemo(() => {
    return roles.find((r) => r.id === selectedRoleId) || null;
  }, [roles, selectedRoleId]);

  /* ── Handlers: Toggle Status ───────────────────────────── */
  const handleToggleStatus = async (roleId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const target = roles.find((r) => r.id === roleId);
    if (!target) return;
    const nextStatus = target.status === "active" ? "inactive" : "active";

    try {
      const updatedDbRole = await api.updateInstitutionalRole(roleId, {
        name: target.name,
        slug: String(target.slug),
        department: target.department,
        description: target.description,
        status: nextStatus,
        color: target.color,
        iconName: target.iconName,
        permissions: target.permissions,
      });

      const updatedItem = mapDbRoleToItem(updatedDbRole);
      setRoles((prev) => prev.map((r) => (r.id === roleId ? updatedItem : r)));

      toast.success(
        `Role '${target.name}' is now ${nextStatus === "active" ? "Activated" : "Deactivated"}`,
        {
          description:
            nextStatus === "active"
              ? "Members with this role can now sign in and exercise granted permissions."
              : "Authentication and portal access for this role are temporarily suspended.",
        }
      );
    } catch (err: any) {
      console.error("Failed to update role status:", err);
      toast.error(`Database error: ${err.message || "Failed to update role status"}`);
    }
  };

  /* ── Handlers: Add / Edit Role ─────────────────────────── */
  const handleSaveRole = async (formData: RoleFormData) => {
    try {
      if (editingRole) {
        // Update existing role in PostgreSQL database (roles and role_permissions tables)
        const updatedDbRole = await api.updateInstitutionalRole(editingRole.id, {
          name: formData.name,
          slug: formData.slug || String(editingRole.slug),
          department: formData.department,
          description: formData.description,
          status: formData.status,
          color: formData.color,
          iconName: formData.iconName,
          permissions: formData.permissions,
        });

        const updatedItem = mapDbRoleToItem(updatedDbRole);
        setRoles((prev) =>
          prev.map((r) => (r.id === editingRole.id ? updatedItem : r))
        );
        toast.success(`Role '${formData.name}' updated in database`);
        setEditingRole(null);
      } else {
        // Create new role in PostgreSQL database (roles and role_permissions tables)
        const createdDbRole = await api.createInstitutionalRole({
          name: formData.name,
          slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
          department: formData.department,
          description: formData.description,
          status: formData.status,
          color: formData.color,
          iconName: formData.iconName,
          permissions: formData.permissions,
        });

        const newItem = mapDbRoleToItem(createdDbRole);
        setRoles((prev) => [newItem, ...prev]);
        setSelectedRoleId(newItem.id);
        toast.success(`Role '${formData.name}' created and saved to database`);
      }
    } catch (err: any) {
      console.error("Failed to save role to database:", err);
      toast.error(`Database error: ${err.message || "Failed to save role"}`);
      throw err; // Re-throw so dialog knows not to prematurely close
    }
  };

  /* ── Handlers: Delete Role ─────────────────────────────── */
  const handleConfirmDelete = async () => {
    if (!deletingRole) return;
    if (deletingRole.isSystem) {
      toast.error("Cannot delete core system role.");
      return;
    }

    try {
      await api.deleteInstitutionalRole(deletingRole.id);
      setRoles((prev) => prev.filter((r) => r.id !== deletingRole.id));
      if (selectedRoleId === deletingRole.id) {
        const remaining = roles.filter((r) => r.id !== deletingRole.id);
        setSelectedRoleId(remaining[0]?.id || null);
      }
      toast.success(`Role '${deletingRole.name}' deleted from database`);
      setDeletingRole(null);
    } catch (err: any) {
      console.error("Failed to delete role:", err);
      toast.error(`Database error: ${err.message || "Failed to delete role"}`);
    }
  };

  /* ── Handlers: Multi Selection ─────────────────────────── */
  const toggleSelectRole = (roleId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const selectAllFiltered = () => {
    if (selectedRoleIds.length === filteredRoles.length) {
      setSelectedRoleIds([]);
    } else {
      setSelectedRoleIds(filteredRoles.map((r) => r.id));
    }
  };

  const handleBatchStatus = async (nextStatus: "active" | "inactive") => {
    const idsToUpdate = [...selectedRoleIds];
    try {
      for (const roleId of idsToUpdate) {
        const target = roles.find((r) => r.id === roleId);
        if (target) {
          await api.updateInstitutionalRole(roleId, {
            name: target.name,
            slug: String(target.slug),
            department: target.department,
            description: target.description,
            status: nextStatus,
            color: target.color,
            iconName: target.iconName,
            permissions: target.permissions,
          });
        }
      }
      setRoles((prev) =>
        prev.map((r) => {
          if (!idsToUpdate.includes(r.id)) return r;
          return { ...r, status: nextStatus };
        })
      );
      toast.success(`Updated status to ${nextStatus} for ${idsToUpdate.length} roles in database.`);
      setSelectedRoleIds([]);
    } catch (err: any) {
      console.error("Batch update error:", err);
      toast.error(`Failed to update some roles in database: ${err.message || "Database error"}`);
    }
  };


  /* ── Handlers: Department Management ──────────────────── */
  const handleAddDepartment = (name: string): boolean => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Department name cannot be empty.");
      return false;
    }
    if (departments.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      toast.error(`Department "${trimmed}" already exists.`);
      return false;
    }
    setDepartments((prev) => [...prev, trimmed]);
    setSelectedDepartment(trimmed);

    // Save to PostgreSQL database
    api.createDepartment(trimmed)
      .then(() => {
        toast.success(`Department "${trimmed}" saved to database!`);
      })
      .catch((err) => {
        console.error("Failed to save department to database:", err);
        toast.error("Failed to save department to database.");
        setDepartments((prev) => prev.filter((c) => c !== trimmed));
      });

    return true;
  };

  const handleEditDepartment = (oldName: string, newName: string): boolean => {
    const trimmed = newName.trim();
    if (!trimmed) {
      toast.error("Department name cannot be empty.");
      return false;
    }
    if (
      trimmed.toLowerCase() !== oldName.toLowerCase() &&
      departments.some((c) => c.toLowerCase() === trimmed.toLowerCase())
    ) {
      toast.error(`Department "${trimmed}" already exists.`);
      return false;
    }

    setDepartments((prev) => prev.map((c) => (c === oldName ? trimmed : c)));

    // Update all roles assigned to this department
    let affectedCount = 0;
    setRoles((prev) =>
      prev.map((r) => {
        if (r.department === oldName) {
          affectedCount++;
          return { ...r, department: trimmed };
        }
        return r;
      })
    );

    if (selectedDepartment === oldName) {
      setSelectedDepartment(trimmed);
    }

    // Save new department and delete old in database
    api.createDepartment(trimmed)
      .then(() => api.deleteDepartment(oldName))
      .catch((err) => console.error("Database rename error:", err));

    toast.success(
      `Renamed department to "${trimmed}".${
        affectedCount > 0 ? ` Updated ${affectedCount} roles.` : ""
      }`
    );
    return true;
  };

  const handleDeleteDepartment = (deptToDelete: string, reassignTo?: string) => {
    setDepartments((prev) => prev.filter((c) => c !== deptToDelete));

    // Reassign affected roles
    let affectedCount = 0;
    if (reassignTo) {
      setRoles((prev) =>
        prev.map((r) => {
          if (r.department === deptToDelete) {
            affectedCount++;
            return { ...r, department: reassignTo };
          }
          return r;
        })
      );
    }

    if (selectedDepartment === deptToDelete) {
      setSelectedDepartment("All");
    }

    // Delete from PostgreSQL database
    api.deleteDepartment(deptToDelete)
      .then(() => {
        toast.success(
          `Department "${deptToDelete}" deleted from database.${
            affectedCount > 0 ? ` Reassigned ${affectedCount} roles to "${reassignTo}".` : ""
          }`
        );
      })
      .catch((err) => {
        console.error("Failed to delete department from database:", err);
        toast.error("Failed to delete department from database.");
        loadDepartments();
      });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── Top Page Header ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-1 sm:pb-2">
        <div className="space-y-1">
          {/* Eyebrow / Department Breadcrumb */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            <span>Administration</span>
            <span className="opacity-40">•</span>
            <span className="text-accent flex items-center gap-1 font-medium">
              <Shield className="h-3 w-3 shrink-0" />
              Access & Security Control
            </span>
          </div>

          {/* Responsive Heading */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground leading-tight">
            Institutional Roles & Privileges
          </h1>

          {/* Responsive Description */}
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Configure authorization tiers, activate user access scopes, and enforce permission boundaries.
          </p>
        </div>

        <div className="flex items-center gap-2.5 pt-1 sm:pt-0 shrink-0">
          <Button
            onClick={() => {
              setEditingRole(null);
              setIsCreateOpen(true);
            }}
            className="h-9 sm:h-10 px-3.5 sm:px-4 text-xs font-semibold gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm cursor-pointer rounded-xl"
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Create New Role
          </Button>
        </div>
      </div>

      {/* ── KPI Stat Summary Cards ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-3.5">
        {/* Total Roles */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs relative overflow-hidden group hover:border-border transition-all">
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider leading-tight min-w-0 break-words">
              Total Roles
            </span>
            <div className="h-8 w-8 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground tabular-nums">{stats.total}</div>
          <p className="text-[11px] text-muted-foreground mt-1">Across {departments.length} institutional departments</p>
        </div>

        {/* Active Roles */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider leading-tight min-w-0 break-words">
              Active Portals
            </span>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {stats.active}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Available for user authentication</p>
        </div>

        {/* Inactive Roles */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider leading-tight min-w-0 break-words">
              Suspended / Draft
            </span>
            <div className="h-8 w-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Power className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
            {stats.inactive}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Access restricted by admin policy</p>
        </div>

        {/* Total Assigned Users */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs relative overflow-hidden group hover:border-border transition-all">
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider leading-tight min-w-0 break-words">
              Total Enrolled
            </span>
            <div className="h-8 w-8 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground tabular-nums">
            {stats.totalPersonnel.toLocaleString()}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Staff, students, and faculty members</p>
        </div>
      </div>

      {/* ── Control & Filter Ribbon ─────────────────────────────── */}
      <div className="p-3 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
        {/* Row 1: Search & Utility Controls */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2.5 sm:gap-3">
          {/* Search Input (Expands generously) */}
          <div className="relative w-full xl:flex-1 xl:min-w-[240px]">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roles by name, identifier, or policy scope..."
              className="pl-9.5 pr-8 h-9 sm:h-9.5 text-xs bg-muted/20 border-border/60 hover:border-border focus-visible:bg-background transition-all rounded-xl w-full"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Clear search query"
              >
                <XCircle className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Right Utility Controls Cluster */}
          <div className="flex items-center justify-between xl:justify-end gap-2 w-full xl:w-auto min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="h-8.5 sm:h-9 text-xs font-medium bg-muted/30 border border-border/60 rounded-xl px-2.5 sm:px-3 text-foreground cursor-pointer focus:outline-none hover:bg-muted/50 transition-colors shadow-2xs shrink-0"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>

              {/* Manage Departments Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDepartmentToFocus(null);
                  setIsDepartmentManagerOpen(true);
                }}
                className="h-8.5 sm:h-9 px-2.5 sm:px-3 text-xs font-semibold gap-1.5 rounded-xl border-border/70 hover:bg-accent/10 hover:text-accent hover:border-accent/40 shadow-2xs transition-all cursor-pointer shrink-0"
                title="Manage Departments (Add, Rename, Delete)"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-accent shrink-0" />
                <span className="hidden sm:inline">Manage Departments</span>
                <span className="sm:hidden">Departments</span>
              </Button>
            </div>

            <div className="h-5 w-[1px] bg-border/80 mx-0.5 hidden xl:block" />

            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 rounded-xl bg-muted/50 border border-border/60 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`h-7.5 w-7.5 sm:h-8 sm:w-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`h-7.5 w-7.5 sm:h-8 sm:w-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Table View"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Department Filter Strip */}
        <div className="pt-2.5 border-t border-border/50 flex items-center justify-between gap-3">
          {/* Scrollable Department Segmented Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0.5 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setSelectedDepartment("All")}
              className={`px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                selectedDepartment === "All"
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60 font-medium"
              }`}
            >
              All Roles
            </button>

            {departments.map((dept) => {
              const isSelected = selectedDepartment === dept;
              return (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60 font-medium"
                  }`}
                >
                  {dept}
                </button>
              );
            })}
          </div>

          {/* Live Result Counter & Reset Button (visible on wide screens) */}
          <div className="hidden xl:flex items-center gap-2 text-xs text-muted-foreground font-medium shrink-0 pl-2">
            <span>
              Showing <strong className="text-foreground font-semibold">{filteredRoles.length}</strong> of {roles.length} roles
            </span>
            {(selectedDepartment !== "All" || searchQuery || statusFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSelectedDepartment("All");
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="text-accent hover:underline text-[11px] font-semibold cursor-pointer ml-1"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Multi-Select Batch Bar (Conditional) ────────────────── */}
      {selectedRoleIds.length > 0 && (
        <div className="p-3 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 font-semibold text-accent">
            <CheckSquare className="h-4 w-4" />
            <span>{selectedRoleIds.length} roles selected</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBatchStatus("active")}
              className="h-7 text-xs bg-card"
            >
              Activate All
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBatchStatus("inactive")}
              className="h-7 text-xs bg-card"
            >
              Deactivate All
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedRoleIds([])}
              className="h-7 text-xs text-muted-foreground"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* ── Main Workspace: Content Grid & Details Panel ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Roles List / Grid */}
        <div className={currentlyInspectedRole ? "lg:col-span-7 xl:col-span-8" : "lg:col-span-12"}>
          {filteredRoles.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/40">
              <Shield className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-foreground">No matching roles found</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                No institutional roles match your current query or department filter. Try clearing filters or create a new role.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDepartment("All");
                  setStatusFilter("all");
                }}
                className="mt-4 text-xs"
              >
                Reset Filters
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            /* ── GRID VIEW ─────────────────────────────────────── */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredRoles.map((role) => {
                const IconComponent = getRoleIcon(role.iconName);
                const colorTokens = getRoleColorTokens(role.color);
                const isSelected = selectedRoleId === role.id;
                const isChecked = selectedRoleIds.includes(role.id);
                const isActive = role.status === "active";

                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRoleId(role.id)}
                    className={`rounded-2xl border transition-all duration-200 p-5 cursor-pointer flex flex-col justify-between relative group ${
                      isSelected
                        ? "bg-card border-accent/50 shadow-md ring-2 ring-accent/20"
                        : "bg-card/70 border-border/80 hover:bg-card hover:border-border hover:shadow-xs"
                    }`}
                  >
                    {/* Top Row: Icon, Title, and Dropdown */}
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3.5">
                        <div className="flex items-center gap-3">
                          {/* Selection Checkbox */}
                          <div onClick={(e) => toggleSelectRole(role.id, e)} className="p-1 -ml-1">
                            <Checkbox checked={isChecked} aria-label={`Select ${role.name}`} />
                          </div>

                          {/* Role Icon */}
                          <div
                            className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-xs border"
                            style={colorTokens.containerStyle}
                          >
                            <IconComponent className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h3 className="font-bold text-sm text-foreground truncate leading-snug">
                                {role.name}
                              </h3>
                              {role.isSystem && (
                                <span className="text-[9px] font-semibold bg-muted text-muted-foreground px-1.5 py-0.2 rounded-md">
                                  System
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-muted-foreground font-medium">
                              {role.department}
                            </span>
                          </div>
                        </div>

                        {/* Actions Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            onClick={(e) => e.stopPropagation()}
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 text-xs">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRoleId(role.id);
                              }}
                            >
                              <Shield className="h-3.5 w-3.5 mr-2" /> Inspect Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingRole(role);
                                setIsCreateOpen(true);
                              }}
                            >
                              <Edit2 className="h-3.5 w-3.5 mr-2" /> Edit Configuration
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => handleToggleStatus(role.id, e as any)}
                            >
                              <Power className="h-3.5 w-3.5 mr-2" />
                              {isActive ? "Deactivate Role" : "Activate Role"}
                            </DropdownMenuItem>
                            {!role.isSystem && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeletingRole(role);
                                  }}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete Role
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                        {role.description}
                      </p>
                    </div>

                    {/* Bottom Meta & Interactive Switch */}
                    <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-muted-foreground tabular-nums">
                          {role.userCount} {role.userCount === 1 ? "user" : "users"}
                        </span>
                      </div>

                      {/* Activate / Deactivate Switch with Pill */}
                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span
                          className={`text-[10px] font-semibold flex items-center gap-1 ${
                            isActive ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isActive ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
                            }`}
                          />
                          {isActive ? "Active" : "Inactive"}
                        </span>
                        <Switch
                          checked={isActive}
                          onCheckedChange={() => handleToggleStatus(role.id)}
                          aria-label={`Toggle status for ${role.name}`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── TABLE VIEW ─────────────────────────────────────── */
            <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent bg-muted/30">
                    <TableHead className="w-10">
                      <Checkbox
                        checked={
                          selectedRoleIds.length === filteredRoles.length &&
                          filteredRoles.length > 0
                        }
                        onCheckedChange={selectAllFiltered}
                      />
                    </TableHead>
                    <TableHead>Role Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Enrolled</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.map((role) => {
                    const IconComponent = getRoleIcon(role.iconName);
                    const colorTokens = getRoleColorTokens(role.color);
                    const isSelected = selectedRoleId === role.id;
                    const isChecked = selectedRoleIds.includes(role.id);
                    const isActive = role.status === "active";

                    return (
                      <TableRow
                        key={role.id}
                        onClick={() => setSelectedRoleId(role.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? "bg-accent/10 hover:bg-accent/15" : "hover:bg-muted/40"
                        }`}
                      >
                        <TableCell onClick={(e) => toggleSelectRole(role.id, e as any)}>
                          <Checkbox checked={isChecked} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div
                              className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border"
                              style={colorTokens.containerStyle}
                            >
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                                {role.name}
                                {role.isSystem && (
                                  <span className="text-[9px] bg-muted text-muted-foreground px-1.5 rounded">
                                    System
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-muted-foreground font-mono">
                                {role.slug}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{role.department}</TableCell>
                        <TableCell className="text-xs font-mono tabular-nums">
                          {role.userCount}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={isActive}
                              onCheckedChange={() => handleToggleStatus(role.id)}
                            />
                            <span
                              className={`text-[11px] font-medium ${
                                isActive ? "text-emerald-600" : "text-muted-foreground"
                              }`}
                            >
                              {isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingRole(role);
                                setIsCreateOpen(true);
                              }}
                              className="h-7 w-7 p-0"
                            >
                              <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                            {!role.isSystem && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeletingRole(role)}
                                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Right Side: Role Inspection & Selection Details Panel */}
        {currentlyInspectedRole && (
          <div className="lg:col-span-5 xl:col-span-4 sticky top-6">
            <RoleDetailsPanel
              role={currentlyInspectedRole}
              onClose={() => setSelectedRoleId(null)}
              permissions={permissions}
              onEdit={(r) => {
                setEditingRole(r);
                setIsCreateOpen(true);
              }}
            />
          </div>
        )}
      </div>

      {/* ── Dialogs: Add/Edit & Delete Confirmation ─────────────── */}
      <RoleDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        roleToEdit={editingRole}
        onSave={handleSaveRole}
        departments={departments}
        onAddDepartment={handleAddDepartment}
        permissions={permissions}
        isLoadingPermissions={isLoadingPermissions}
      />


      <RoleDeleteDialog
        open={Boolean(deletingRole)}
        onOpenChange={(open) => !open && setDeletingRole(null)}
        roleToDelete={deletingRole}
        onConfirmDelete={handleConfirmDelete}
      />

      <DepartmentManagerDialog
        open={isDepartmentManagerOpen}
        onOpenChange={(open) => {
          setIsDepartmentManagerOpen(open);
          if (!open) setDepartmentToFocus(null);
        }}
        departments={departments}
        roles={roles}
        onAddDepartment={handleAddDepartment}
        onEditDepartment={handleEditDepartment}
        onDeleteDepartment={handleDeleteDepartment}
        focusDepartment={departmentToFocus}
      />
    </div>
  );
}