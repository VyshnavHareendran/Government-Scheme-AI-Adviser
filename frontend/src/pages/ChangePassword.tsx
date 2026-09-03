import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { changePassword } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export function ChangePassword() {
  const navigate = useNavigate();

  const {
    user,
    mustChangePassword,
    clearMustChangePassword,
  } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!mustChangePassword) {
    const role = user.role?.toLowerCase();

    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (role === "employee") {
      return <Navigate to="/employee" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const current = currentPassword.trim();
    const next = newPassword.trim();
    const confirm = confirmPassword.trim();

    if (!current || !next || !confirm) {
      setError("All password fields are required.");
      return;
    }

    if (next !== confirm) {
      setError(
        "New password and confirmation do not match.",
      );
      return;
    }

    if (next.length < 8) {
      setError(
        "New password must be at least 8 characters long.",
      );
      return;
    }

    if (current === next) {
      setError(
        "New password must be different from the current password.",
      );
      return;
    }

    try {
      setLoading(true);

      await changePassword({
        current_password: current,
        new_password: next,
      });

      clearMustChangePassword();

      const role = user?.role?.toLowerCase();

      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else if (role === "employee") {
        navigate("/employee", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error(err);

      const message =
        err &&
        typeof err === "object" &&
        "response" in err
          ? String(
              (
                err as {
                  response?: {
                    data?: {
                      detail?: string;
                    };
                  };
                }
              ).response?.data?.detail ??
                "Unable to change password.",
            )
          : "Unable to change password.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-app-background px-4">
      <div className="w-full max-w-md rounded-xl border border-app-border bg-white p-6 shadow-soft">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-app-foreground">
            Change Your Password
          </h1>

          <p className="mt-2 text-sm text-app-muted">
            This is your first login. Please change your
            temporary password before continuing.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-100 bg-red-50 p-3 text-sm text-app-danger">
            {error}
          </div>
        )}

        <form
          className="space-y-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-app-foreground">
              Current Password
            </label>

            <div className="relative">
              <input
                type={
                  showCurrentPassword ? "text" : "password"
                }
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(event.target.value)
                }
                autoComplete="current-password"
                className="w-full rounded-lg border border-app-border bg-white px-3 py-2 pr-16 text-sm outline-none focus:border-brand-primary"
                placeholder="Enter temporary password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrentPassword(
                    (value) => !value,
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-app-muted hover:text-app-foreground"
                aria-label={
                  showCurrentPassword
                    ? "Hide current password"
                    : "Show current password"
                }
              >
                {showCurrentPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-app-foreground">
              New Password
            </label>

            <div className="relative">
              <input
                type={
                  showNewPassword ? "text" : "password"
                }
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                autoComplete="new-password"
                className="w-full rounded-lg border border-app-border bg-white px-3 py-2 pr-16 text-sm outline-none focus:border-brand-primary"
                placeholder="Enter new password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowNewPassword(
                    (value) => !value,
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-app-muted hover:text-app-foreground"
                aria-label={
                  showNewPassword
                    ? "Hide new password"
                    : "Show new password"
                }
              >
                {showNewPassword ? "Hide" : "Show"}
              </button>
            </div>

            <p className="mt-1.5 text-xs text-app-muted">
              Use at least 8 characters.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-app-foreground">
              Confirm New Password
            </label>

            <div className="relative">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                autoComplete="new-password"
                className="w-full rounded-lg border border-app-border bg-white px-3 py-2 pr-16 text-sm outline-none focus:border-brand-primary"
                placeholder="Confirm new password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (value) => !value,
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-app-muted hover:text-app-foreground"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirmation password"
                    : "Show confirmation password"
                }
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Changing Password..."
              : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}