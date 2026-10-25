import type { LucideIcon } from "lucide-react";
import type { Role as SystemRoleSlug } from "@/lib/mock-data";

export type Department = string;

export type RoleColorTheme = string;

export interface PermissionDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
}


export interface UserRoleItem {
  id: string;
  name: string;
  slug: SystemRoleSlug | string;
  department: Department;
  description: string;
  status: "active" | "inactive";
  isSystem: boolean; // System roles cannot be deleted
  userCount: number;
  color: RoleColorTheme;
  iconName: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  sampleUsers?: {
    name: string;
    email: string;
    avatar: string;
  }[];
}

export interface RoleFormData {
  name: string;
  slug: string;
  department: Department;
  description: string;
  color: RoleColorTheme;
  status: "active" | "inactive";
  iconName: string;
  permissions: string[];
}