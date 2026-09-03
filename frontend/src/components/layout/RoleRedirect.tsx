import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Logo } from "./Logo";

export function RoleRedirect() {
  const {
    user,
    isBootstrapping,
    mustChangePassword,
  } = useAuth();
  
  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app-background">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo compact />
          </div>

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />

          <p className="mt-3 text-sm text-app-muted">
            Restoring your session
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (mustChangePassword) {
    return <Navigate to="/change-password" replace />;
  }

  const role = user.role?.toLowerCase();

  if (role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (role === "employee") {
    return <Navigate to="/employee" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}