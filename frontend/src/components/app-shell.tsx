import { Outlet, useRouterState } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { RoleProvider, useRole } from "@/lib/role-context";
import { useAuth } from "@/lib/auth-context";
import { getCurrentUser } from "@/lib/mock-data";
import { Bell, Search, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginPage } from "@/components/login-page";
import { toast } from "sonner";

function HeaderBar() {
  const { role } = useRole();
  const { logout } = useAuth();
  const user = getCurrentUser(role);

  const handleLogout = () => {
    logout();
    toast.info("Signed out of Northgate Portal", {
      description: "You have returned to the login screen.",
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-card/80 backdrop-blur px-4">
      <SidebarTrigger />
      <div className="hidden md:flex items-center gap-2 max-w-sm flex-1">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students, classes, subjects..."
            className="pl-8 h-9 bg-muted/50 border-0"
          />
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent" />
        </Button>
        <div className="hidden sm:flex flex-col text-right leading-tight">
          <span className="text-sm font-medium">{user.name}</span>
          <span className="text-xs text-muted-foreground capitalize">
            {role}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-destructive hover:border-destructive/40"
          title="Sign out of portal"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    </header>
  );
}

function AuthenticatedApp() {
  const { isAuthenticated } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // If not authenticated or explicitly on /login route, show the full-screen Login Page
  if (!isAuthenticated || pathname === "/login") {
    return <LoginPage />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <HeaderBar />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export function AppShell() {
  return (
    <RoleProvider>
      <AuthenticatedApp />
    </RoleProvider>
  );
}
