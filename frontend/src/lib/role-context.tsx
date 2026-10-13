import { type ReactNode } from "react";
import type { Role } from "./mock-data";
import { AuthProvider, useAuth } from "./auth-context";

export function RoleProvider({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

export function useRole(): { role: Role; setRole: (r: Role) => void } {
  const { role, setRole } = useAuth();
  return { role, setRole };
}
