import { BookOpen, Globe, Beaker, Monitor, Dumbbell, Music, Palette, Building2 } from "lucide-react";
import { ClassData, DepartmentData } from "../types";

export const CLASS_DATA: ClassData[] = [
  { id: "lkg", label: "LKG", fullName: "Lower Kindergarten", students: 42, present: 39, absent: 2, late: 1, gradient: "linear-gradient(135deg, oklch(0.72 0.16 340), oklch(0.60 0.20 350))" },
  { id: "ukg", label: "UKG", fullName: "Upper Kindergarten", students: 45, present: 42, absent: 1, late: 2, gradient: "linear-gradient(135deg, oklch(0.68 0.18 310), oklch(0.55 0.22 320))" },
  { id: "1", label: "Class 1", fullName: "First Standard", students: 48, present: 44, absent: 3, late: 1, gradient: "linear-gradient(135deg, oklch(0.65 0.18 280), oklch(0.50 0.22 290))" },
  { id: "2", label: "Class 2", fullName: "Second Standard", students: 50, present: 47, absent: 2, late: 1, gradient: "linear-gradient(135deg, oklch(0.60 0.16 255), oklch(0.45 0.20 265))" },
  { id: "3", label: "Class 3", fullName: "Third Standard", students: 46, present: 43, absent: 2, late: 1, gradient: "linear-gradient(135deg, oklch(0.58 0.15 230), oklch(0.44 0.19 240))" },
  { id: "4", label: "Class 4", fullName: "Fourth Standard", students: 52, present: 49, absent: 1, late: 2, gradient: "linear-gradient(135deg, oklch(0.62 0.14 200), oklch(0.48 0.18 210))" },
  { id: "5", label: "Class 5", fullName: "Fifth Standard", students: 55, present: 51, absent: 3, late: 1, gradient: "linear-gradient(135deg, oklch(0.65 0.14 175), oklch(0.50 0.18 185))" },
  { id: "6", label: "Class 6", fullName: "Sixth Standard", students: 54, present: 50, absent: 2, late: 2, gradient: "linear-gradient(135deg, oklch(0.65 0.14 155), oklch(0.50 0.18 165))" },
  { id: "7", label: "Class 7", fullName: "Seventh Standard", students: 58, present: 54, absent: 3, late: 1, gradient: "linear-gradient(135deg, oklch(0.68 0.14 130), oklch(0.52 0.18 140))" },
  { id: "8", label: "Class 8", fullName: "Eighth Standard", students: 56, present: 52, absent: 2, late: 2, gradient: "linear-gradient(135deg, oklch(0.72 0.15 95), oklch(0.56 0.19 105))" },
  { id: "9", label: "Class 9", fullName: "Ninth Standard", students: 60, present: 56, absent: 3, late: 1, gradient: "linear-gradient(135deg, oklch(0.75 0.15 75), oklch(0.58 0.19 85))" },
  { id: "10", label: "Class 10", fullName: "Tenth Standard", students: 64, present: 60, absent: 2, late: 2, gradient: "linear-gradient(135deg, oklch(0.70 0.16 50), oklch(0.55 0.20 60))" },
  { id: "11", label: "Class 11", fullName: "Eleventh Standard", students: 58, present: 54, absent: 3, late: 1, gradient: "linear-gradient(135deg, oklch(0.65 0.18 30), oklch(0.50 0.22 40))" },
  { id: "12", label: "Class 12", fullName: "Twelfth Standard", students: 62, present: 58, absent: 2, late: 2, gradient: "linear-gradient(135deg, oklch(0.60 0.20 15), oklch(0.48 0.24 25))" },
];

export const DEPARTMENT_DATA: DepartmentData[] = [
  { id: "math", label: "Mathematics", icon: BookOpen, staff: 8, present: 7, absent: 0, onLeave: 1, gradient: "linear-gradient(135deg, oklch(0.60 0.16 255), oklch(0.45 0.20 265))" },
  { id: "english", label: "English", icon: Globe, staff: 7, present: 6, absent: 0, onLeave: 1, gradient: "linear-gradient(135deg, oklch(0.65 0.18 280), oklch(0.50 0.22 290))" },
  { id: "physics", label: "Physics", icon: Beaker, staff: 5, present: 5, absent: 0, onLeave: 0, gradient: "linear-gradient(135deg, oklch(0.58 0.15 230), oklch(0.44 0.19 240))" },
  { id: "chemistry", label: "Chemistry", icon: Beaker, staff: 5, present: 4, absent: 1, onLeave: 0, gradient: "linear-gradient(135deg, oklch(0.65 0.14 175), oklch(0.50 0.18 185))" },
  { id: "biology", label: "Biology", icon: Beaker, staff: 4, present: 4, absent: 0, onLeave: 0, gradient: "linear-gradient(135deg, oklch(0.65 0.14 155), oklch(0.50 0.18 165))" },
  { id: "history", label: "History", icon: Globe, staff: 4, present: 3, absent: 0, onLeave: 1, gradient: "linear-gradient(135deg, oklch(0.72 0.15 95), oklch(0.56 0.19 105))" },
  { id: "cs", label: "Computer Science", icon: Monitor, staff: 6, present: 6, absent: 0, onLeave: 0, gradient: "linear-gradient(135deg, oklch(0.55 0.18 280), oklch(0.40 0.22 290))" },
  { id: "pe", label: "Physical Education", icon: Dumbbell, staff: 3, present: 3, absent: 0, onLeave: 0, gradient: "linear-gradient(135deg, oklch(0.70 0.16 50), oklch(0.55 0.20 60))" },
  { id: "music", label: "Music", icon: Music, staff: 2, present: 2, absent: 0, onLeave: 0, gradient: "linear-gradient(135deg, oklch(0.68 0.18 310), oklch(0.55 0.22 320))" },
  { id: "art", label: "Fine Arts", icon: Palette, staff: 2, present: 2, absent: 0, onLeave: 0, gradient: "linear-gradient(135deg, oklch(0.72 0.16 340), oklch(0.60 0.20 350))" },
  { id: "admin", label: "Administration", icon: Building2, staff: 12, present: 11, absent: 1, onLeave: 0, gradient: "linear-gradient(135deg, oklch(0.24 0.08 265), oklch(0.40 0.13 258))" },
];
