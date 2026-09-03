import { useEffect, useState } from "react";
import {
  getAdminDashboard,
  type AdminDashboardResponse,
} from "../../api/admin";

export function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const result = await getAdminDashboard();
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = [
    {
      label: "Citizens",
      value: data?.statistics.citizens,
      description: "Registered citizen accounts",
    },
    {
      label: "Employees",
      value: data?.statistics.employees,
      description: "System employee accounts",
    },
    {
      label: "Active Schemes",
      value: data?.statistics.active_schemes,
      description: "Currently active schemes",
    },
    {
      label: "Eligibility Rules",
      value: data?.statistics.eligibility_rules,
      description: "Configured eligibility rules",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
          Platform Overview
        </p>

        <h1 className="mt-2 text-2xl font-semibold text-app-foreground">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-app-muted">
          Monitor citizens, employees, schemes, and eligibility configuration.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
          <p className="text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={loadDashboard}
            className="text-sm font-medium text-red-600 hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-app-border bg-app-surface p-5"
          >
            <p className="text-sm text-app-muted">
              {stat.label}
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-app-foreground">
              {loading ? "—" : stat.value ?? 0}
            </p>

            <p className="mt-1 text-xs text-app-muted">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* System overview */}
      <div className="rounded-xl border border-app-border bg-app-surface p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-app-foreground">
              System Overview
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-app-muted">
              The administration module provides centralized management
              of citizens, employees, government schemes, eligibility
              rules, AI recommendations, reports, and system settings.
            </p>
          </div>

          {data && (
            <div className="hidden rounded-lg bg-brand-primary/10 px-3 py-2 text-right sm:block">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-primary">
                Signed in as
              </p>

              <p className="mt-1 text-sm font-medium text-app-foreground">
                {data.admin.full_name}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Additional platform information */}
      {data && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-app-border bg-app-surface p-5">
            <p className="text-sm text-app-muted">
              Citizen Profiles
            </p>

            <p className="mt-2 text-2xl font-semibold text-app-foreground">
              {data.statistics.citizen_profiles}
            </p>

            <p className="mt-1 text-xs text-app-muted">
              Profiles completed by registered citizens
            </p>
          </div>

          <div className="rounded-xl border border-app-border bg-app-surface p-5">
            <p className="text-sm text-app-muted">
              Administrators
            </p>

            <p className="mt-2 text-2xl font-semibold text-app-foreground">
              {data.statistics.admins}
            </p>

            <p className="mt-1 text-xs text-app-muted">
              Active administrative accounts
            </p>
          </div>
        </div>
      )}
    </div>
  );
}