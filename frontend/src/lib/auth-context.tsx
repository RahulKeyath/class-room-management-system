import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { api, clearAuthToken, getAuthToken, setAuthToken, type ApiUser } from "./api";
import type { Role } from "./mock-data";
import type { AuthUser } from "./auth-types";

interface AuthContextValue {
  isAuthenticated: boolean;
  isInitializing: boolean;
  role: Role;
  user: AuthUser;
  setRole: (r: Role) => void;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Written by the former mock login; removed on sign-out so no stale session survives
const LEGACY_STORAGE_KEY = "northgate_academy_auth";

const SIGNED_OUT_USER: AuthUser = {
  id: "",
  name: "",
  title: "",
  avatar: "",
  role: "admin",
  email: "",
};

function toAuthUser(user: ApiUser): AuthUser {
  const initials = user.name
    .replace(/^(Dr|Mr|Mrs|Ms|Prof)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
  return { ...user, avatar: initials };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // `role` is the portal being viewed ("View as"); `user` stays the signed-in account
  const [role, setRole] = useState<Role>("admin");
  const [user, setUser] = useState<AuthUser>(SIGNED_OUT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  const applyUser = (apiUser: ApiUser) => {
    const authUser = toAuthUser(apiUser);
    setUser(authUser);
    setRole(authUser.role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearAuthToken();
    try {
      sessionStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // Ignore
    }
    setUser(SIGNED_OUT_USER);
    setRole("admin");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if (!getAuthToken()) {
      setIsInitializing(false);
      return;
    }

    let cancelled = false;
    api
      .getMe()
      .then((apiUser) => {
        if (!cancelled) applyUser(apiUser);
      })
      .catch(() => {
        if (!cancelled) logout();
      })
      .finally(() => {
        if (!cancelled) setIsInitializing(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (credentials: {
    email: string;
    password: string;
  }): Promise<boolean> => {
    try {
      const { token, user: apiUser } = await api.login(
        credentials.email,
        credentials.password,
      );
      setAuthToken(token);
      applyUser(apiUser);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isInitializing,
        role,
        user,
        setRole,
        login,
        logout,
      }}
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
