import {
  CalendarDays,
  Check,
  Copy,
  Eye,
  Plus,
  RefreshCw,
  Search,
  UserRound,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import type { FormEvent } from "react";

import {
  createAdminEmployee,
  deleteAdminEmployee,
  getAdminEmployee,
  getAdminEmployees,
  resetAdminEmployeePassword,
  updateAdminEmployee,
  updateAdminEmployeeStatus,
  type AdminEmployee,
} from "../../api/adminEmployees";

import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { CardSkeleton } from "../../components/ui/Skeleton";

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function AdminEmployees() {
  const [employees, setEmployees] = useState<AdminEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [selectedEmployee, setSelectedEmployee] =
    useState<AdminEmployee | null>(null);

  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  const [editingEmployee, setEditingEmployee] =
    useState(false);

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editError, setEditError] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [createdEmployee, setCreatedEmployee] =
    useState<AdminEmployee | null>(null);

  const [temporaryPassword, setTemporaryPassword] =
    useState("");

  const [copiedPassword, setCopiedPassword] =
    useState(false);

  const [deletingEmployeeId, setDeletingEmployeeId] =
    useState<number | null>(null);

  const [resettingPassword, setResettingPassword] =
    useState(false);

  const [resetEmployee, setResetEmployee] =
    useState<AdminEmployee | null>(null);

  const [resetTemporaryPassword, setResetTemporaryPassword] =
    useState("");

  const [copiedResetPassword, setCopiedResetPassword] =
    useState(false);

  const [resetPasswordError, setResetPasswordError] =
    useState("");

  async function loadEmployees() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminEmployees();

      setEmployees(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load employees.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return employees
      .filter((employee) => {
        if (statusFilter === "active") {
          return employee.is_active;
        }

        if (statusFilter === "inactive") {
          return !employee.is_active;
        }

        return true;
      })
      .filter((employee) => {
        if (!normalizedQuery) {
          return true;
        }

        return [employee.full_name, employee.email]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((a, b) =>
        a.full_name.localeCompare(b.full_name),
      );
  }, [employees, query, statusFilter]);

  async function handleViewEmployee(employeeId: number) {
    try {
      setLoadingDetails(true);
      setDetailsError("");
      setSelectedEmployee(null);

      const employee = await getAdminEmployee(employeeId);

      setSelectedEmployee(employee);
    } catch (err) {
      console.error(err);
      setDetailsError(
        "Unable to load employee details. Please try again.",
      );
    } finally {
      setLoadingDetails(false);
    }
  }

  function closeDetails() {
    if (loadingDetails) {
      return;
    }

    setSelectedEmployee(null);
    setDetailsError("");
  }

  async function handleEditEmployee() {
    if (!selectedEmployee) {
      return;
    }

    const name = editName.trim();
    const email = editEmail.trim();

    if (!name || !email) {
      setEditError("Full name and email are required.");
      return;
    }

    try {
      setSavingEdit(true);
      setEditError("");

      const updatedEmployee = await updateAdminEmployee(
        selectedEmployee.id,
        {
          full_name: name,
          email,
        },
      );

      setSelectedEmployee(updatedEmployee);
      setEditingEmployee(false);

      await loadEmployees();
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
                "Unable to update employee.",
            )
          : "Unable to update employee.";

      setEditError(message);
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleToggleStatus(employee: AdminEmployee) {
    const nextStatus = !employee.is_active;

    const confirmed = window.confirm(
      nextStatus
        ? `Activate ${employee.full_name}?`
        : `Deactivate ${employee.full_name}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await updateAdminEmployeeStatus(
        employee.id,
        nextStatus,
      );

      await loadEmployees();

      if (selectedEmployee?.id === employee.id) {
        const updatedEmployee =
          await getAdminEmployee(employee.id);

        setSelectedEmployee(updatedEmployee);
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
                "Unable to update employee status.",
            )
          : "Unable to update employee status.";

      setError(message);
    }
  }

  async function handleResetEmployeePassword(
    employee: AdminEmployee,
  ) {
    const confirmed = window.confirm(
      `Reset password for ${employee.full_name}?\n\n` +
        "The current password will no longer work and a new temporary password will be generated.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setResettingPassword(true);
      setResetPasswordError("");
      setResetTemporaryPassword("");
      setCopiedResetPassword(false);

      const response =
        await resetAdminEmployeePassword(employee.id);

      setResetEmployee(response.employee);
      setResetTemporaryPassword(
        response.temporary_password,
      );

      await loadEmployees();

      if (selectedEmployee?.id === employee.id) {
        setSelectedEmployee(response.employee);
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
                "Unable to reset employee password.",
            )
          : "Unable to reset employee password.";

      setResetPasswordError(message);
    } finally {
      setResettingPassword(false);
    }
  }

  async function handleDeleteEmployee(
    employee: AdminEmployee,
  ) {
    const confirmed = window.confirm(
      `Delete ${employee.full_name}?\n\nThis will permanently remove the employee account and cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingEmployeeId(employee.id);
      setError("");

      await deleteAdminEmployee(employee.id);

      if (selectedEmployee?.id === employee.id) {
        setSelectedEmployee(null);
      }

      await loadEmployees();
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
                "Unable to delete employee.",
            )
          : "Unable to delete employee.";

      setError(message);
    } finally {
      setDeletingEmployeeId(null);
    }
  }

  async function handleCreateEmployee(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const name = createName.trim();
    const email = createEmail.trim();

    if (!name || !email) {
      setCreateError(
        "Full name and email are required.",
      );
      return;
    }

    try {
      setCreating(true);
      setCreateError("");

      const response = await createAdminEmployee({
        full_name: name,
        email,
      });

      setCreatedEmployee(response.employee);
      setTemporaryPassword(
        response.temporary_password,
      );

      setCreateName("");
      setCreateEmail("");
      setShowCreateForm(false);

      await loadEmployees();
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
                "Unable to create employee.",
            )
          : "Unable to create employee.";

      setCreateError(message);
    } finally {
      setCreating(false);
    }
  }

  async function copyTemporaryPassword() {
    if (!temporaryPassword) {
      return;
    }

    await navigator.clipboard.writeText(
      temporaryPassword,
    );

    setCopiedPassword(true);

    window.setTimeout(() => {
      setCopiedPassword(false);
    }, 2000);
  }

  async function copyResetTemporaryPassword() {
    if (!resetTemporaryPassword) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        resetTemporaryPassword,
      );

      setCopiedResetPassword(true);

      window.setTimeout(() => {
        setCopiedResetPassword(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
            Administration
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-app-foreground">
            Employee Management
          </h1>

          <p className="mt-1 text-sm text-app-muted">
            View employees and their access status.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            icon={<Plus className="h-4 w-4" />}
            onClick={() => {
              setCreateError("");
              setShowCreateForm(true);
            }}
          >
            Add Employee
          </Button>

          <Button
            variant="secondary"
            icon={<RefreshCw className="h-4 w-4" />}
            onClick={() => void loadEmployees()}
            disabled={loading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-app-danger">{error}</p>

          <button
            type="button"
            onClick={() => setError("")}
            className="text-app-danger"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Search and Filter */}
      <Card>
        <div className="grid gap-4 md:grid-cols-[1fr_200px]">
          <div className="relative">
            <Input
              label="Search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search employees by name or email..."
            />

            <Search className="pointer-events-none absolute right-3 top-8 h-4 w-4 text-app-muted" />
          </div>

          <Select
            label="Status"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as
                  | "all"
                  | "active"
                  | "inactive",
              )
            }
            options={["all", "active", "inactive"]}
          />
        </div>
      </Card>

      {/* Employee Table */}
      <Card className="overflow-hidden p-0">
        {loading ? (
          <div className="space-y-4 p-6">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : filteredEmployees.length === 0 ? (
          <EmptyState
            icon={<UserRound className="h-8 w-8" />}
            title="No employees found"
            message={
              query.trim()
                ? "No employees match your search. Try a different name or email."
                : "There are currently no employees registered in the system."
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="border-b border-app-border bg-app-background">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Employee
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Role
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Status
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Registered
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-app-border">
                {filteredEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="transition hover:bg-app-background/60"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand-dark">
                          <UserRound className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-medium text-app-foreground">
                            {employee.full_name}
                          </p>

                          <p className="mt-1 truncate text-xs text-app-muted">
                            {employee.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <Badge variant="teal">
                        Employee
                      </Badge>
                    </td>

                    <td className="px-5 py-4">
                      <Badge
                        variant={
                          employee.is_active
                            ? "green"
                            : "slate"
                        }
                      >
                        {employee.is_active
                          ? "Active"
                          : "Inactive"}
                      </Badge>
                    </td>

                    <td className="px-5 py-4 text-sm text-app-muted">
                      {formatDate(employee.created_at)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          className="px-2"
                          icon={
                            <Eye className="h-4 w-4" />
                          }
                          onClick={() =>
                            void handleViewEmployee(employee.id)
                          }
                          disabled={deletingEmployeeId === employee.id}
                        >
                          View
                        </Button>

                        <Button
                          variant="secondary"
                          className="px-2"
                          onClick={() =>
                            void handleToggleStatus(employee)
                          }
                          disabled={deletingEmployeeId === employee.id}
                        >
                          {employee.is_active
                            ? "Deactivate"
                            : "Activate"}
                        </Button>

                        <Button
                          variant="ghost"
                          className="px-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() =>
                            void handleDeleteEmployee(employee)
                          }
                          disabled={deletingEmployeeId === employee.id}
                        >
                          {deletingEmployeeId === employee.id
                            ? "Deleting..."
                            : "Delete"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Employee Created */}
      {createdEmployee && temporaryPassword && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="employee-created-title"
        >
          <div className="w-full max-w-md rounded-xl border border-app-border bg-white shadow-xl">
            <div className="p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50 text-app-success">
                <Check className="h-5 w-5" />
              </div>

              <h2
                id="employee-created-title"
                className="mt-4 text-lg font-semibold text-app-foreground"
              >
                Employee Created Successfully
              </h2>

              <p className="mt-2 text-sm text-app-muted">
                {createdEmployee.full_name} can now use
                this temporary password for the first login.
              </p>

              <div className="mt-5 rounded-lg border border-app-border bg-app-background p-4">
                <p className="text-xs font-medium text-app-muted">
                  Email
                </p>

                <p className="mt-1 break-all text-sm font-medium text-app-foreground">
                  {createdEmployee.email}
                </p>

                <p className="mt-4 text-xs font-medium text-app-muted">
                  Temporary Password
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <code className="min-w-0 flex-1 break-all rounded-md border border-app-border bg-white px-3 py-2 text-sm font-semibold text-app-foreground">
                    {temporaryPassword}
                  </code>

                  <Button
                    type="button"
                    variant="secondary"
                    className="shrink-0 px-3"
                    icon={<Copy className="h-4 w-4" />}
                    onClick={() =>
                      void copyTemporaryPassword()
                    }
                  >
                    {copiedPassword
                      ? "Copied"
                      : "Copy"}
                  </Button>
                </div>
              </div>

              <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm text-amber-800">
                  Save or share this temporary password
                  securely. It will be required for the
                  employee's first login.
                </p>
              </div>

              <div className="mt-5 flex justify-end">
                <Button
                  onClick={() => {
                    setCreatedEmployee(null);
                    setTemporaryPassword("");
                    setCopiedPassword(false);
                  }}
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Details */}
      {loadingDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Loading employee details"
        >
          <div className="w-full max-w-md rounded-xl border border-app-border bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />

              <p className="text-sm font-medium text-app-foreground">
                Loading employee details...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Create Employee */}
      {showCreateForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-employee-title"
        >
          <div className="w-full max-w-md rounded-xl border border-app-border bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-app-border px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
                  Employee Management
                </p>

                <h2
                  id="create-employee-title"
                  className="mt-1 text-lg font-semibold text-app-foreground"
                >
                  Add Employee
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded-md p-2 text-app-muted hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              className="space-y-4 p-6"
              onSubmit={handleCreateEmployee}
            >
              {createError && (
                <div className="rounded-md border border-red-100 bg-red-50 p-3 text-sm text-app-danger">
                  {createError}
                </div>
              )}

              <Input
                label="Full Name"
                value={createName}
                onChange={(event) =>
                  setCreateName(event.target.value)
                }
                placeholder="Enter employee name"
                autoComplete="name"
              />

              <Input
                label="Email"
                type="email"
                value={createEmail}
                onChange={(event) =>
                  setCreateEmail(event.target.value)
                }
                placeholder="employee@example.com"
                autoComplete="email"
              />

              <div className="rounded-lg border border-app-border bg-app-background/50 p-3">
                <p className="text-xs font-medium text-app-muted">
                  Temporary password
                </p>

                <p className="mt-1 text-sm text-app-muted">
                  A secure temporary password will be
                  generated automatically. The employee
                  must change it after their first login.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    setShowCreateForm(false)
                  }
                  disabled={creating}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  isLoading={creating}
                >
                  Create Employee
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* Detail Error */}
      {detailsError && !loadingDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-app-foreground">
                  Unable to load details
                </h2>

                <p className="mt-2 text-sm text-app-muted">
                  {detailsError}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDetailsError("")}
                className="rounded-md p-2 text-app-muted hover:bg-slate-100"
                aria-label="Close error"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <Button
              variant="secondary"
              className="mt-5"
              onClick={() => setDetailsError("")}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Employee Details */}
      {selectedEmployee && !loadingDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="employee-details-title"
        >
          <div className="w-full max-w-2xl rounded-xl border border-app-border bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-app-border px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
                  Employee Details
                </p>

                <h2
                  id="employee-details-title"
                  className="mt-1 text-lg font-semibold text-app-foreground"
                >
                  {selectedEmployee.full_name}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeDetails}
                className="rounded-md p-2 text-app-muted hover:bg-slate-100 hover:text-app-foreground"
                aria-label="Close employee details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <DetailItem
                icon={<UserRound className="h-4 w-4" />}
                label="Full Name"
                value={selectedEmployee.full_name}
              />

              <DetailItem
                label="Email"
                value={selectedEmployee.email}
              />

              <DetailItem
                icon={<CalendarDays className="h-4 w-4" />}
                label="Registered"
                value={formatDate(
                  selectedEmployee.created_at,
                )}
              />

              <div className="rounded-lg border border-app-border p-4">
                <p className="text-xs font-medium text-app-muted">
                  Account Status
                </p>

                <div className="mt-2">
                  <Badge
                    variant={
                      selectedEmployee.is_active
                        ? "green"
                        : "slate"
                    }
                  >
                    {selectedEmployee.is_active
                      ? "Active"
                      : "Inactive"}
                  </Badge>
                </div>
              </div>

              <DetailItem
                label="Role"
                value="Employee"
              />

              <DetailItem
                label="Employee ID"
                value={String(selectedEmployee.id)}
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-app-border px-6 py-4">
              <Button
                variant="secondary"
                onClick={() => {
                  if (!selectedEmployee) {
                    return;
                  }

                  setEditName(selectedEmployee.full_name);
                  setEditEmail(selectedEmployee.email);
                  setEditError("");
                  setEditingEmployee(true);
                }}
              >
                Edit
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  if (!selectedEmployee) {
                    return;
                  }

                  void handleResetEmployeePassword(
                    selectedEmployee,
                  );
                }}
                disabled={resettingPassword}
              >
                {resettingPassword
                  ? "Resetting..."
                  : "Reset Password"}
              </Button>

              <Button
                variant="secondary"
                onClick={closeDetails}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Password Reset Result */}
      {resetEmployee && resetTemporaryPassword && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="password-reset-title"
        >
          <div className="w-full max-w-md rounded-xl border border-app-border bg-white shadow-xl">
            <div className="p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50 text-app-success">
                <Check className="h-5 w-5" />
              </div>

              <h2
                id="password-reset-title"
                className="mt-4 text-lg font-semibold text-app-foreground"
              >
                Password Reset Successfully
              </h2>

              <p className="mt-2 text-sm text-app-muted">
                A new temporary password has been generated
                for {resetEmployee.full_name}.
              </p>

              <div className="mt-5 rounded-lg border border-app-border bg-app-background p-4">
                <p className="text-xs font-medium text-app-muted">
                  Email
                </p>

                <p className="mt-1 break-all text-sm font-medium text-app-foreground">
                  {resetEmployee.email}
                </p>

                <p className="mt-4 text-xs font-medium text-app-muted">
                  Temporary Password
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <code className="min-w-0 flex-1 break-all rounded-md border border-app-border bg-white px-3 py-2 text-sm font-semibold text-app-foreground">
                    {resetTemporaryPassword}
                  </code>

                  <Button
                    type="button"
                    variant="secondary"
                    className="shrink-0 px-3"
                    icon={<Copy className="h-4 w-4" />}
                    onClick={() =>
                      void copyResetTemporaryPassword()
                    }
                  >
                    {copiedResetPassword
                      ? "Copied"
                      : "Copy"}
                  </Button>
                </div>
              </div>

              <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm text-amber-800">
                  Share this temporary password securely.
                  The employee must change it after logging
                  in.
                </p>
              </div>

              {resetPasswordError && (
                <div className="mt-4 rounded-md border border-red-100 bg-red-50 p-3 text-sm text-app-danger">
                  {resetPasswordError}
                </div>
              )}

              <div className="mt-5 flex justify-end">
                <Button
                  onClick={() => {
                    setResetEmployee(null);
                    setResetTemporaryPassword("");
                    setCopiedResetPassword(false);
                    setResetPasswordError("");
                  }}
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {editingEmployee && selectedEmployee && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-employee-title"
        >
          <div className="w-full max-w-md rounded-xl border border-app-border bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-app-border px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
                  Employee Management
                </p>

                <h2
                  id="edit-employee-title"
                  className="mt-1 text-lg font-semibold text-app-foreground"
                >
                  Edit Employee
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setEditingEmployee(false)}
                className="rounded-md p-2 text-app-muted hover:bg-slate-100"
                aria-label="Close"
                disabled={savingEdit}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              {editError && (
                <div className="rounded-md border border-red-100 bg-red-50 p-3 text-sm text-app-danger">
                  {editError}
                </div>
              )}

              <Input
                label="Full Name"
                value={editName}
                onChange={(event) =>
                  setEditName(event.target.value)
                }
                placeholder="Enter employee name"
                autoComplete="name"
              />

              <Input
                label="Email"
                type="email"
                value={editEmail}
                onChange={(event) =>
                  setEditEmail(event.target.value)
                }
                placeholder="employee@example.com"
                autoComplete="email"
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEditingEmployee(false)}
                  disabled={savingEdit}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  onClick={() => void handleEditEmployee()}
                  isLoading={savingEdit}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



function DetailItem({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-app-border bg-app-background/40 p-4">
      <div className="flex items-center gap-2 text-app-muted">
        {icon}
        <p className="text-xs font-medium">{label}</p>
      </div>

      <p className="mt-2 break-all text-sm font-medium text-app-foreground">
        {value || "—"}
      </p>
    </div>
  );
}