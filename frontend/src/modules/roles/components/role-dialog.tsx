import React, { useState, useEffect, useMemo } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Check,
  Sparkles,
  Palette,
  Pipette,
  CheckCircle2,
  X,
  Plus,
} from "lucide-react";
import { AVAILABLE_PERMISSIONS } from "../data/mock-roles";
import {
  ROLE_ICONS,
  PRESET_COLORS,
  ICON_CATEGORIES,
  getRoleIcon,
  getRoleColorTokens,
  type IconOption,
  type IconCategoryFilter,
} from "../lib/role-visuals";
import type { UserRoleItem, RoleFormData, Department, PermissionDefinition } from "../types";
import { toast } from "sonner";

export const DEFAULT_DEPARTMENTS = [
  "Administration",
  "Academic",
  "Student Affairs",
  "Operations",
  "Support",
];

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleToEdit?: UserRoleItem | null;
  onSave: (data: RoleFormData) => void;
  departments?: string[];
  onAddDepartment?: (department: string) => boolean | void;
  permissions?: PermissionDefinition[];
  isLoadingPermissions?: boolean;
}

export function RoleDialog({
  open,
  onOpenChange,
  roleToEdit,
  onSave,
  departments = DEFAULT_DEPARTMENTS,
  onAddDepartment,
  permissions = AVAILABLE_PERMISSIONS,
  isLoadingPermissions = false,
}: RoleDialogProps) {

  const isEditing = Boolean(roleToEdit);

  const [formData, setFormData] = useState<RoleFormData>({
    name: "",
    slug: "",
    department: "Academic",
    description: "",
    color: "#6366f1",
    status: "active",
    iconName: "ShieldCheck",
    permissions: ["attendance.view"],
  });

  const [activeTab, setActiveTab] = useState<"general" | "visuals" | "permissions">("general");

  // Icon search & category filters
  const [iconSearch, setIconSearch] = useState("");
  const [selectedIconCategory, setSelectedIconCategory] =
    useState<IconCategoryFilter>("All");

  // Custom hex color input state
  const [customHex, setCustomHex] = useState("#6366f1");

  // Inline department creation
  const [isAddingInlineDept, setIsAddingInlineDept] = useState(false);
  const [inlineDeptName, setInlineDeptName] = useState("");

  const availableDepartments = useMemo(() => {
    const list = [...(departments || DEFAULT_DEPARTMENTS)];
    if (formData.department && !list.includes(formData.department)) {
      list.unshift(formData.department);
    }
    return list;
  }, [departments, formData.department]);

  const handleAddInlineDepartment = () => {
    const trimmed = inlineDeptName.trim();
    if (!trimmed) {
      toast.error("Department name cannot be empty");
      return;
    }
    if (onAddDepartment) {
      onAddDepartment(trimmed);
    }
    setFormData((prev) => ({ ...prev, department: trimmed }));
    setIsAddingInlineDept(false);
    setInlineDeptName("");
  };

  useEffect(() => {
    if (roleToEdit) {
      const initialColor = roleToEdit.color || "#6366f1";
      setFormData({
        name: roleToEdit.name,
        slug: String(roleToEdit.slug),
        department: roleToEdit.department,
        description: roleToEdit.description,
        color: initialColor,
        status: roleToEdit.status,
        iconName: roleToEdit.iconName || "ShieldCheck",
        permissions: [...roleToEdit.permissions],
      });
      const tokens = getRoleColorTokens(initialColor);
      setCustomHex(tokens.hex);
    } else {
      setFormData({
        name: "",
        slug: "",
        department: "Academic",
        description: "",
        color: "#6366f1",
        status: "active",
        iconName: "ShieldCheck",
        permissions: ["attendance.view"],
      });
      setCustomHex("#6366f1");
    }
    setActiveTab("general");
    setIsAddingInlineDept(false);
    setInlineDeptName("");
    setIconSearch("");
    setSelectedIconCategory("All");
  }, [roleToEdit, open]);

  const handleNameChange = (val: string) => {
    setFormData((prev) => {
      const updated = { ...prev, name: val };
      if (!isEditing) {
        updated.slug = val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/^_+|_+$/g, "");
      }
      return updated;
    });
  };

  // Filtered icons based on search query and category
  const filteredIcons = useMemo(() => {
    return ROLE_ICONS.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(iconSearch.toLowerCase()) ||
        item.label.toLowerCase().includes(iconSearch.toLowerCase());
      const matchesCategory =
        selectedIconCategory === "All" || item.category === selectedIconCategory;
      return matchesSearch && matchesCategory;
    });
  }, [iconSearch, selectedIconCategory]);

  // Color handling: either from preset click or custom input
  const handleColorSelect = (colorValue: string) => {
    const tokens = getRoleColorTokens(colorValue);
    setFormData((prev) => ({ ...prev, color: tokens.hex }));
    setCustomHex(tokens.hex);
  };

  const handleCustomHexChange = (val: string) => {
    setCustomHex(val);
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val)) {
      setFormData((prev) => ({ ...prev, color: val }));
    }
  };

  const togglePermission = (id: string) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(id);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((p) => p !== id)
          : [...prev.permissions, id],
      };
    });
  };

  const selectAllPermissions = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: permissions.map((p) => p.id),
    }));
  };

  const clearAllPermissions = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: [],
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || isSubmitting) return;
    try {
      setIsSubmitting(true);
      await onSave(formData);
      onOpenChange(false);
    } catch (err) {
      console.error("Save role failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };


  const CurrentIconComponent = getRoleIcon(formData.iconName);
  const colorTokens = getRoleColorTokens(formData.color);

  // Dynamically group permissions by their category field from the database
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, PermissionDefinition[]> = {};
    for (const p of permissions) {
      const cat = p.category || "General";
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(p);
    }
    return groups;
  }, [permissions]);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[92vh] flex flex-col p-0 overflow-hidden sm:rounded-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/80 bg-muted/20">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border transition-all"
              style={colorTokens.containerStyle}
            >
              <CurrentIconComponent className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight">
                {isEditing ? `Edit Role: ${roleToEdit?.name}` : "Create Institutional Role"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {isEditing
                  ? "Update role naming, icon, custom color, and authorization permissions."
                  : "Define a new access role with assigned privilege policies, custom icon, and color."}
              </DialogDescription>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex gap-1.5 sm:gap-2 mt-4 pt-2 border-t border-border/40 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "general"
                  ? "bg-accent/15 text-accent border border-accent/30 shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              1. General <span className="hidden sm:inline">Details</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("visuals")}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "visuals"
                  ? "bg-accent/15 text-accent border border-accent/30 shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              2. Icon & Theme
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("permissions")}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "permissions"
                  ? "bg-accent/15 text-accent border border-accent/30 shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              3. Permissions <span className="hidden sm:inline">Matrix</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-accent text-accent-foreground font-bold">
                {formData.permissions.length}
              </span>
            </button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Section 1: General Details */}
          {activeTab === "general" && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              {/* Role Name and Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="role-name" className="text-xs font-semibold text-foreground">
                    Role Display Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="role-name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Dean of Academics, Lab Specialist"
                    required
                    className="h-10 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="role-slug" className="text-xs font-semibold text-foreground">
                    System Identifier (Key)
                  </Label>
                  <Input
                    id="role-slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. academic_dean"
                    disabled={isEditing && roleToEdit?.isSystem}
                    className="h-10 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Department */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="role-department" className="text-xs font-semibold text-foreground">
                    Department
                  </Label>
                  {!isAddingInlineDept && (
                    <button
                      type="button"
                      onClick={() => setIsAddingInlineDept(true)}
                      className="text-[11px] text-accent hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Plus className="h-3 w-3" />
                      New department
                    </button>
                  )}
                </div>

                {isAddingInlineDept ? (
                  <div className="flex items-center gap-1.5 animate-in fade-in">
                    <Input
                      value={inlineDeptName}
                      onChange={(e) => setInlineDeptName(e.target.value)}
                      placeholder="New department name..."
                      className="h-10 text-xs bg-background"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddInlineDepartment();
                        } else if (e.key === "Escape") {
                          setIsAddingInlineDept(false);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddInlineDepartment}
                      className="h-10 px-3 text-xs font-medium cursor-pointer shrink-0"
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsAddingInlineDept(false);
                        setInlineDeptName("");
                      }}
                      className="h-10 px-2 text-xs cursor-pointer shrink-0"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <Select
                    value={formData.department}
                    onValueChange={(val: Department) =>
                      setFormData({ ...formData, department: val })
                    }
                  >
                    <SelectTrigger id="role-department" className="h-10 text-sm">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDepartments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="role-desc" className="text-xs font-semibold text-foreground">
                  Description & Mandate
                </Label>
                <Textarea
                  id="role-desc"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Outline responsibilities, portal scope, and operational expectations for this role..."
                  rows={3}
                  className="text-sm resize-none"
                />
              </div>

              {/* Status Toggle */}
              <div className="pt-2">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/30 border border-border/60">
                  <div>
                    <div className="text-xs font-semibold text-foreground flex items-center gap-2">
                      Initial Activation Status
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          formData.status === "active"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {formData.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Active roles are immediately usable and selectable by assigned institutional members.
                    </p>
                  </div>
                  <Switch
                    checked={formData.status === "active"}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, status: checked ? "active" : "inactive" })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Icon and Theme */}
          {activeTab === "visuals" && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              {/* Role Live Visual Preview Banner */}
              <div
                className="p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all"
                style={colorTokens.borderGlowStyle}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border transition-all"
                    style={colorTokens.containerStyle}
                  >
                    <CurrentIconComponent className="h-5.5 w-5.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-foreground truncate">
                        {formData.name || "Untitled Role"}
                      </span>
                      {formData.department && (
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                          style={colorTokens.badgeStyle}
                        >
                          {formData.department}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                      {formData.department} Department • Icon: <code className="text-foreground">{formData.iconName}</code> • Accent: <code className="text-foreground">{colorTokens.hex.toUpperCase()}</code>
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  <div
                    className="h-5 w-5 rounded-full border border-black/10 dark:border-white/10 shadow-xs"
                    style={colorTokens.dotStyle}
                  />
                </div>
              </div>

              {/* ── EXPANDABLE RICH ICON SELECTOR ───────────────────── */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    Assigned Portal Icon
                    <span className="text-[10px] font-normal text-muted-foreground">
                      ({filteredIcons.length} of {ROLE_ICONS.length} available)
                    </span>
                  </Label>
                  {(() => {
                    const CurrentSelectedIcon = getRoleIcon(formData.iconName);
                    return (
                      <Badge variant="outline" className="text-[11px] gap-1.5 font-mono font-medium py-0.5 px-2">
                        <CurrentSelectedIcon className="h-3.5 w-3.5 text-accent" />
                        Selected: <span className="font-semibold text-foreground">{formData.iconName}</span>
                      </Badge>
                    );
                  })()}
                </div>

                {/* Row 1: Dedicated Full-Width Search Input */}
                <div className="relative w-full">
                  <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    placeholder="Search 150+ icons by name or role (e.g. book, graduation, shield, key, bus, lab, chart)..."
                    className="pl-8 pr-8 h-8 text-xs bg-muted/20 w-full"
                  />
                  {iconSearch && (
                    <button
                      type="button"
                      onClick={() => setIconSearch("")}
                      title="Clear search"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>

                {/* Row 2: Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
                  {ICON_CATEGORIES.map((cat) => {
                    const count =
                      cat === "All"
                        ? ROLE_ICONS.length
                        : ROLE_ICONS.filter((i) => i.category === cat).length;
                    const isActive = selectedIconCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedIconCategory(cat)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap cursor-pointer transition-all shrink-0 flex items-center gap-1 ${
                          isActive
                            ? "bg-accent/20 text-accent font-semibold border border-accent/40"
                            : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-transparent"
                        }`}
                      >
                        <span>{cat}</span>
                        <span className={`text-[10px] ${isActive ? "opacity-90" : "opacity-60"}`}>
                          ({count})
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Scrollable Icon Gallery */}
                <div className="max-h-52 overflow-y-auto p-2 rounded-xl bg-muted/20 border border-border/60 grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
                  {filteredIcons.map((item) => {
                    const IconComp = item.icon;
                    const isSelected = formData.iconName === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, iconName: item.name })}
                        title={`${item.label} (${item.name})`}
                        className={`h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-accent/20 border-accent text-accent shadow-xs scale-105 ring-2 ring-accent/30"
                            : "bg-card border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/70 hover:scale-105"
                        }`}
                      >
                        <IconComp className="h-4 w-4" />
                      </button>
                    );
                  })}
                  {filteredIcons.length === 0 && (
                    <div className="col-span-full py-6 text-center text-xs text-muted-foreground space-y-1">
                      <p>No icons matching "{iconSearch}" in {selectedIconCategory}.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setIconSearch("");
                          setSelectedIconCategory("All");
                        }}
                        className="text-[11px] text-accent hover:underline font-medium cursor-pointer"
                      >
                        Reset search & category filter
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ── UNLIMITED COLOR ACCENT SELECTOR ─────────────────── */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="h-3.5 w-3.5 text-muted-foreground" />
                    Theme Color Accent
                  </Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3.5 w-3.5 rounded-full border border-black/10 dark:border-white/10"
                      style={colorTokens.dotStyle}
                    />
                    <span className="text-xs font-mono font-medium text-foreground">
                      {colorTokens.hex.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Preset Luxury Palette */}
                <div className="p-2.5 rounded-xl bg-muted/20 border border-border/60 space-y-2.5">
                  <div className="flex flex-wrap gap-2 items-center">
                    {PRESET_COLORS.map((c) => {
                      const isSelected = colorTokens.hex.toLowerCase() === c.hex.toLowerCase();
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleColorSelect(c.hex)}
                          title={`${c.name} (${c.hex})`}
                          className={`h-6 w-6 rounded-full transition-all cursor-pointer relative flex items-center justify-center border border-black/10 dark:border-white/10 ${
                            isSelected
                              ? "ring-2 ring-accent ring-offset-2 ring-offset-background scale-110 shadow-xs"
                              : "opacity-85 hover:opacity-100 hover:scale-110"
                          }`}
                          style={{ backgroundColor: c.hex }}
                        >
                          {isSelected && <Check className="h-3 w-3 text-white drop-shadow-sm" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Hex Picker Row */}
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="color"
                          id="custom-color-picker"
                          value={colorTokens.hex}
                          onChange={(e) => handleColorSelect(e.target.value)}
                          className="h-7 w-8 rounded-lg cursor-pointer border border-border bg-transparent p-0 overflow-hidden"
                          title="Open color wheel"
                        />
                      </div>
                      <Label htmlFor="custom-color-picker" className="text-xs font-medium text-muted-foreground cursor-pointer">
                        Custom Color Picker
                      </Label>
                    </div>

                    <div className="flex items-center gap-1.5 max-w-[150px]">
                      <span className="text-xs text-muted-foreground font-mono">Hex:</span>
                      <Input
                        value={customHex}
                        onChange={(e) => handleCustomHexChange(e.target.value)}
                        placeholder="#6366f1"
                        maxLength={7}
                        className="h-7 text-xs font-mono px-2 uppercase bg-background"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Permissions Matrix */}
          {activeTab === "permissions" && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                      Role Authorization Policies
                    </h4>
                    <span className="text-[10px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full border border-border/60">
                      {permissions.length} Available
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Select granted capabilities for members holding this role.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={selectAllPermissions}
                    className="h-7 text-xs"
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearAllPermissions}
                    className="h-7 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear All
                  </Button>
                </div>
              </div>

              {Object.entries(groupedPermissions).map(([categoryName, perms]) => (
                <div key={categoryName} className="space-y-2">
                  <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {categoryName}
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {perms.map((p) => {
                      const isChecked = formData.permissions.includes(p.id);
                      return (
                        <div
                          key={p.id}
                          onClick={() => togglePermission(p.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-2.5 ${
                            isChecked
                              ? "bg-accent/10 border-accent/40 shadow-xs"
                              : "bg-card border-border/60 hover:bg-muted/50 hover:border-border"
                          }`}
                        >
                          <div
                            className={`h-4 w-4 rounded mt-0.5 flex items-center justify-center border transition-all shrink-0 ${
                              isChecked
                                ? "bg-accent border-accent text-accent-foreground"
                                : "border-muted-foreground/40 bg-background"
                            }`}
                          >
                            {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-foreground leading-tight">
                              {p.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                              {p.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>

        <DialogFooter className="p-3 sm:p-4 border-t border-border/80 bg-muted/20 flex flex-col sm:flex-row sm:items-center sm:justify-between sm:space-x-0 gap-2.5">
          {/* Mobile Phone Layout (< sm) */}
          <div className="flex flex-col gap-2 w-full sm:hidden">
            {/* Row 1: Step Navigation */}
            <div className="grid grid-cols-2 gap-2">
              {activeTab === "general" ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="text-xs h-9 font-medium"
                >
                  Cancel
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab(activeTab === "permissions" ? "visuals" : "general")}
                  className="text-xs h-9 font-medium"
                >
                  ← Back
                </Button>
              )}

              {activeTab !== "permissions" ? (
                <Button
                  type="button"
                  onClick={() => setActiveTab(activeTab === "general" ? "visuals" : "permissions")}
                  className="text-xs h-9 bg-accent text-accent-foreground hover:bg-accent/90 font-medium"
                >
                  {activeTab === "general" ? "Next: Theme →" : "Next: Privileges →"}
                </Button>
              ) : (
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={!formData.name.trim()}
                  className="text-xs h-9 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                >
                  {isEditing ? "Save Role" : "Create Role"}
                </Button>
              )}
            </div>

            {/* Row 2: Final Action & Dismissal */}
            {activeTab !== "permissions" ? (
              <div className="flex items-center gap-2">
                {activeTab !== "general" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenChange(false)}
                    className="text-xs h-9 text-muted-foreground hover:text-foreground px-3 shrink-0"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={!formData.name.trim() || isSubmitting}
                  className="text-xs h-9 flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                >
                  {isSubmitting ? "Saving..." : isEditing ? "Save Role Changes" : "Create Role"}
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-xs h-7 text-muted-foreground hover:text-foreground w-full"
              >
                Cancel
              </Button>
            )}
          </div>

          {/* Desktop Layout (>= sm) */}
          <div className="hidden sm:flex sm:items-center sm:justify-between sm:w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-xs font-medium"
            >
              Cancel
            </Button>
            <div className="flex items-center gap-2">
              {activeTab === "general" && (
                <Button
                  type="button"
                  onClick={() => setActiveTab("visuals")}
                  className="text-xs bg-accent text-accent-foreground hover:bg-accent/90 font-medium"
                >
                  Next: Icon & Theme →
                </Button>
              )}
              {activeTab === "visuals" && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("general")}
                    className="text-xs font-medium"
                  >
                    ← Back to Details
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("permissions")}
                    className="text-xs bg-accent text-accent-foreground hover:bg-accent/90 font-medium"
                  >
                    Next: Permissions Matrix →
                  </Button>
                </>
              )}
              {activeTab === "permissions" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("visuals")}
                  className="text-xs font-medium"
                >
                  ← Back to Icon & Theme
                </Button>
              )}
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={!formData.name.trim() || isSubmitting}
                className="text-xs bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              >
                {isSubmitting ? "Saving..." : isEditing ? "Save Role Changes" : "Create Role"}
              </Button>

            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}