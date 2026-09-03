import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser, login as loginRequest } from "../api/auth";
import type { User } from "../types/api";
import { clearStoredToken, getStoredToken, storeToken } from "../utils/authStorage";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  mustChangePassword: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  clearMustChangePassword: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<User | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [mustChangePassword, setMustChangePassword] =
  useState(false);

  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setUser(null);
    setMustChangePassword(false);
  }, []);

  const clearMustChangePassword = useCallback(() => {
    setMustChangePassword(false);
  }, []);

  const refreshUser = useCallback(async () => {
    const currentUser = await getCurrentUser();

    setUser(currentUser);
    setMustChangePassword(
      currentUser.must_change_password,
    );
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => logout();
    window.addEventListener("schemeai:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("schemeai:unauthorized", handleUnauthorized);
  }, [logout]);

  useEffect(() => {
    let mounted = true;
    async function restoreSession() {
      if (!token) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        if (mounted) {
          setUser(currentUser);
          setMustChangePassword(
            currentUser.must_change_password,
          );
        }
      } catch {
        if (mounted) logout();
      } finally {
        if (mounted) setIsBootstrapping(false);
      }
    }

    restoreSession();
    return () => {
      mounted = false;
    };
  }, [logout, token]);

  const login = useCallback(
    async (email: string, password: string): Promise<User> => {
      const response = await loginRequest(
        email,
        password,
      );

      storeToken(response.access_token);
      setToken(response.access_token);

      setMustChangePassword(
        response.must_change_password,
      );

      const currentUser = await getCurrentUser();

      setUser(currentUser);

      return currentUser;
    },
    [],
  );

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isBootstrapping,
      mustChangePassword,
      login,
      logout,
      refreshUser,
      clearMustChangePassword,
    }),
    [
      isBootstrapping,
      login,
      logout,
      refreshUser,
      clearMustChangePassword,
      token,
      user,
      mustChangePassword,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
