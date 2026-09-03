import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Logo } from "./Logo";

export function ProtectedRoute() {
  const {
    isAuthenticated,
    isBootstrapping,
    mustChangePassword,
  } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app-background">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo compact />
          </div>
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
          <p className="mt-3 text-sm text-app-muted">Restoring your session</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  if (mustChangePassword) {
    return <Navigate to="/change-password" replace />;
  }

  return <Outlet />;
}
