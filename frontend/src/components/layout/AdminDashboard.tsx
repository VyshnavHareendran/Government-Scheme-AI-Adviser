import { Link } from "react-router-dom";

const modules = [
  {
    title: "Citizens",
    description: "View and manage registered citizen profiles.",
    path: "/admin/citizens",
    icon: "◉",
  },
  {
    title: "Employees",
    description: "Manage employees and administrative access.",
    path: "/admin/employees",
    icon: "◎",
  },
  {
    title: "Schemes",
    description: "Manage government schemes and configuration.",
    path: "/admin/schemes",
    icon: "◇",
  },
  {
    title: "Eligibility Rules",
    description: "Review rules used by the eligibility engine.",
    path: "/admin/rules",
    icon: "✓",
  },
  {
    title: "AI Recommendations",
    description: "Monitor AI-powered scheme recommendations.",
    path: "/admin/recommendations",
    icon: "✦",
  },
  {
    title: "Reports",
    description: "Review system reports and analytics.",
    path: "/admin/reports",
    icon: "▤",
  },
];

export function AdminDashboard() {
  const stats = [
    {
      label: "Citizens",
      value: "—",
      description: "Registered citizen profiles",
    },
    {
      label: "Employees",
      value: "—",
      description: "System employees",
    },
    {
      label: "Schemes",
      value: "—",
      description: "Government schemes",
    },
    {
      label: "Recommendations",
      value: "—",
      description: "AI recommendations",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-primary" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-primary">
                Administration
              </p>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-app-foreground sm:text-3xl">
              Platform Overview
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-app-muted">
              Centralized administration for citizens, employees,
              government schemes, eligibility rules, and AI-powered
              recommendations.
            </p>
          </div>

          <div className="rounded-lg border border-app-border bg-app-surface px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-app-muted">
              System
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-sm font-medium text-app-foreground">
                Operational
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-app-border bg-app-surface p-5 transition hover:border-brand-primary/30"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-app-muted">
                  {stat.label}
                </p>

                <span className="h-2 w-2 rounded-full bg-brand-primary/70" />
              </div>

              <p className="mt-4 text-3xl font-semibold tracking-tight text-app-foreground">
                {stat.value}
              </p>

              <p className="mt-1 text-xs text-app-muted">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* AI status */}
      <section className="rounded-xl border border-app-border bg-app-surface p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                ✦
              </span>

              <h2 className="text-base font-semibold text-app-foreground">
                AI Recommendation Engine
              </h2>
            </div>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-app-muted">
              The recommendation engine evaluates citizen and scheme
              features to identify relevant government schemes.
            </p>
          </div>

          <Link
            to="/admin/recommendations"
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-app-border px-4 py-2.5 text-sm font-medium text-app-foreground transition hover:border-brand-primary/40 hover:bg-brand-primary/5"
          >
            View recommendations
            <span className="ml-2">→</span>
          </Link>
        </div>
      </section>

      {/* Modules */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-app-foreground">
            Administration Modules
          </h2>

          <p className="mt-1 text-sm text-app-muted">
            Access the core management areas of the platform.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <Link
              key={module.path}
              to={module.path}
              className="group rounded-xl border border-app-border bg-app-surface p-5 transition hover:-translate-y-0.5 hover:border-brand-primary/30 hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-app-border bg-app-background text-sm text-brand-primary transition group-hover:border-brand-primary/30">
                  {module.icon}
                </span>

                <span className="text-app-muted transition group-hover:translate-x-1 group-hover:text-brand-primary">
                  →
                </span>
              </div>

              <h3 className="mt-5 text-sm font-semibold text-app-foreground">
                {module.title}
              </h3>

              <p className="mt-1.5 text-sm leading-5 text-app-muted">
                {module.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* System architecture */}
      <section className="rounded-xl border border-app-border bg-app-surface p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-app-foreground">
            Platform Architecture
          </h2>

          <p className="mt-1 text-sm text-app-muted">
            Core components currently available in the platform.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg bg-app-background p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">
              Data
            </p>

            <p className="mt-2 text-sm font-medium text-app-foreground">
              Citizen & Scheme Data
            </p>

            <p className="mt-1 text-xs leading-5 text-app-muted">
              Profiles, scheme metadata, and eligibility information.
            </p>
          </div>

          <div className="rounded-lg bg-app-background p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">
              Rules
            </p>

            <p className="mt-2 text-sm font-medium text-app-foreground">
              Eligibility Engine
            </p>

            <p className="mt-1 text-xs leading-5 text-app-muted">
              Rule-based evaluation of citizen eligibility.
            </p>
          </div>

          <div className="rounded-lg bg-app-background p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">
              Intelligence
            </p>

            <p className="mt-2 text-sm font-medium text-app-foreground">
              ML Recommendation Engine
            </p>

            <p className="mt-1 text-xs leading-5 text-app-muted">
              AI-assisted ranking and recommendation of relevant schemes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}