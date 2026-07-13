import { LucideIcon } from "lucide-react";

export interface ClassData {
  id: string;
  label: string;
  fullName: string;
  students: number;
  present: number;
  absent: number;
  late: number;
  gradient: string;
}

export interface DepartmentData {
  id: string;
  label: string;
  icon: LucideIcon;
  staff: number;
  present: number;
  absent: number;
  onLeave: number;
  gradient: string;
}
