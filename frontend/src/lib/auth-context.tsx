import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Role } from "./mock-data";
import { getCurrentUser } from "./mock-data";
import { type AuthUser, ROLE_CREDENTIALS } from "./auth-types";

interface AuthContextValue {
  isAuthenticated: boolean;
  role: Role;
  user: AuthUser;
  setRole: (r: Role) => void;
  login: (
    selectedRole?: Role,
    credentials?: { email?: string; password?: string },
  ) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "northgate_academy_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("admin");
  // Default to false so that the login page appears immediately when the application is open
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.isAuthenticated && parsed.role) {
          setIsAuthenticated(true);
          setRoleState(parsed.role);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    if (isAuthenticated) {
      try {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ isAuthenticated: true, role: newRole }),
        );
      } catch {
        // Ignore
      }
    }
  };

  const login = async (
    selectedRole: Role = role,
    credentials?: { email?: string; password?: string },
  ): Promise<boolean> => {
    // Simulate brief authentication verification delay for smooth UX
    await new Promise((res) => setTimeout(res, 500));
    setRoleState(selectedRole);
    setIsAuthenticated(true);
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ isAuthenticated: true, role: selectedRole }),
      );
    } catch {
      // Ignore
    }
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const currentUserData = getCurrentUser(role);
  const user: AuthUser = {
    ...currentUserData,
    role,
    email: ROLE_CREDENTIALS[role]?.email ?? "",
    department: ROLE_CREDENTIALS[role]?.department,
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, role, user, setRole, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
