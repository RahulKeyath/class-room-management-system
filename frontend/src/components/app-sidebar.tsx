import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  CalendarDays,
  Trophy,
  TrendingUp,
  BookOpen,
  School,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRole } from "@/lib/role-context";
import { CURRENT_USER, type Role } from "@/lib/mock-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type NavItem = { title: string; url: string; icon: typeof LayoutDashboard };

const NAV_BY_ROLE: Record<Role, { label: string; items: NavItem[] }[]> = {
  admin: [
    {
      label: "Overview",
      items: [{ title: "Dashboard", url: "/", icon: LayoutDashboard }],
    },
    {
      label: "Management",
      items: [
        // { title: "Students", url: "/students", icon: GraduationCap },
        // { title: "Staff", url: "/staff", icon: Users },
        { title: "Attendance", url: "/attendance", icon: CalendarCheck },
        // { title: "Timetable", url: "/timetable", icon: CalendarDays },
      ],
    },
    // {
    //   label: "Academics",
    //   items: [
    //     { title: "Results", url: "/results", icon: Trophy },
    //     { title: "Performance", url: "/performance", icon: TrendingUp },
    //     { title: "Syllabus", url: "/syllabus", icon: BookOpen },
    //   ],
    // },
  ],
  teacher: [
    {
      label: "Overview",
      items: [{ title: "Dashboard", url: "/", icon: LayoutDashboard }],
    },
    {
      label: "Classroom",
      items: [
        { title: "My Students", url: "/students", icon: GraduationCap },
        { title: "Attendance", url: "/attendance", icon: CalendarCheck },
        { title: "Timetable", url: "/timetable", icon: CalendarDays },
      ],
    },
    {
      label: "Academics",
      items: [
        { title: "Results", url: "/results", icon: Trophy },
        { title: "Performance", url: "/performance", icon: TrendingUp },
        { title: "Syllabus", url: "/syllabus", icon: BookOpen },
      ],
    },
  ],
  student: [
    {
      label: "Overview",
      items: [{ title: "Dashboard", url: "/", icon: LayoutDashboard }],
    },
    {
      label: "My Studies",
      items: [
        { title: "Timetable", url: "/timetable", icon: CalendarDays },
        { title: "Attendance", url: "/attendance", icon: CalendarCheck },
        { title: "Results", url: "/results", icon: Trophy },
        { title: "Performance", url: "/performance", icon: TrendingUp },
        { title: "Syllabus", url: "/syllabus", icon: BookOpen },
      ],
    },
  ],
};

export function AppSidebar() {
  const { role, setRole } = useRole();
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string) => (url === "/" ? currentPath === "/" : currentPath.startsWith(url));
  const user = CURRENT_USER[role];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground shrink-0">
            <School className="h-5 w-5" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold text-sidebar-foreground">Northgate Academy</span>
            <span className="text-xs text-sidebar-foreground/60">Classroom Suite</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {NAV_BY_ROLE[role].map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border gap-2">
        <div className="px-2 group-data-[collapsible=icon]:hidden">
          <label className="text-xs text-sidebar-foreground/60 mb-1 block">View as</label>
          <Select value={role} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger className="h-8 bg-sidebar-accent border-sidebar-border text-sidebar-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrator</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="student">Student</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 px-2 py-2">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
              {user.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</span>
            <span className="text-xs text-sidebar-foreground/60 truncate">{user.title}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}