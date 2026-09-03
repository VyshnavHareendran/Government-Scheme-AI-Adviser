import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { LockKeyhole } from "lucide-react";

import {
  changePassword,
  getCurrentUser,
} from "../../api/auth";

import type { User } from "../../types/api";

export function AdminSettings() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error(
          "Unable to load administrator information.",
          error,
        );
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  async function handleChangePassword(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    const current = currentPassword.trim();
    const next = newPassword.trim();
    const confirm = confirmPassword.trim();

    if (!current || !next || !confirm) {
      setPasswordError(
        "All password fields are required.",
      );
      return;
    }

    if (next !== confirm) {
      setPasswordError(
        "New password and confirmation do not match.",
      );
      return;
    }

    if (next.length < 8) {
      setPasswordError(
        "New password must be at least 8 characters long.",
      );
      return;
    }

    if (current === next) {
      setPasswordError(
        "New password must be different from the current password.",
      );
      return;
    }

    try {
      setPasswordLoading(true);

      await changePassword({
        current_password: current,
        new_password: next,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordSuccess(
        "Password changed successfully.",
      );
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

      setPasswordError(message);
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
          Administration
        </p>

        <h1 className="mt-2 text-2xl font-semibold text-app-foreground">
          Admin Settings
        </h1>

        <p className="mt-1 text-sm text-app-muted">
          Manage your administrator account and system configuration.
        </p>
      </div>

      {/* Administrator Account */}
      <div className="rounded-xl border border-app-border bg-app-surface p-6">
        <div>
          <h2 className="text-lg font-semibold text-app-foreground">
            Administrator Account
          </h2>

          <p className="mt-1 text-sm text-app-muted">
            Information about the currently signed-in administrator.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-app-muted">
              Full Name
            </p>

            <p className="mt-1 text-sm font-medium text-app-foreground">
              {loading
                ? "Loading..."
                : user?.full_name ?? "Not available"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-app-muted">
              Email
            </p>

            <p className="mt-1 text-sm font-medium text-app-foreground">
              {loading
                ? "Loading..."
                : user?.email ?? "Not available"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-app-muted">
              Role
            </p>

            <p className="mt-1 text-sm font-medium text-app-foreground">
              {loading
                ? "Loading..."
                : user?.role ?? "Not available"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-app-muted">
              Account Status
            </p>

            <p className="mt-1 text-sm font-medium text-app-foreground">
              {loading
                ? "Loading..."
                : user?.is_active
                  ? "Active"
                  : "Inactive"}
            </p>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-xl border border-app-border bg-app-surface p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-brand-primary/10 p-2 text-brand-primary">
            <LockKeyhole className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-app-foreground">
              Security
            </h2>

            <p className="mt-1 text-sm text-app-muted">
              Change your administrator account password.
            </p>
          </div>
        </div>

        {/* Error */}
        {passwordError && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-app-danger">
              {passwordError}
            </p>
          </div>
        )}

        {/* Success */}
        {passwordSuccess && (
          <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
            <p className="text-sm text-app-success">
              {passwordSuccess}
            </p>
          </div>
        )}

        <form
          className="mt-6 max-w-xl space-y-4"
          onSubmit={handleChangePassword}
        >
          {/* Current Password */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-app-text">
              Current Password
            </label>

            <div className="relative">
              <input
                type={
                  showCurrentPassword
                    ? "text"
                    : "password"
                }
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(event.target.value)
                }
                autoComplete="current-password"
                placeholder="Enter current password"
                className="h-10 w-full rounded-md border border-app-border bg-white px-3 pr-16 text-sm text-app-text shadow-soft outline-none transition focus:border-brand-primary"
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

          {/* New Password */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-app-text">
              New Password
            </label>

            <div className="relative">
              <input
                type={
                  showNewPassword
                    ? "text"
                    : "password"
                }
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                autoComplete="new-password"
                placeholder="Enter new password"
                className="h-10 w-full rounded-md border border-app-border bg-white px-3 pr-16 text-sm text-app-text shadow-soft outline-none transition focus:border-brand-primary"
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
              Use at least 8 characters. Your browser may offer to generate a strong password.
            </p>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-app-text">
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
                placeholder="Confirm new password"
                className="h-10 w-full rounded-md border border-app-border bg-white px-3 pr-16 text-sm text-app-text shadow-soft outline-none transition focus:border-brand-primary"
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
                {showConfirmPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={passwordLoading}
              className="inline-flex min-h-10 items-center justify-center rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {passwordLoading
                ? "Changing Password..."
                : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
