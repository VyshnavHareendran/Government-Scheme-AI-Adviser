import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Logo } from "./Logo";
import { useAuth } from "../../context/AuthContext";


const navigation = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: "⌂",
  },
  {
    label: "Citizens",
    path: "/admin/citizens",
    icon: "◉",
  },
  {
    label: "Employees",
    path: "/admin/employees",
    icon: "◎",
  },
  {
    label: "Schemes",
    path: "/admin/schemes",
    icon: "◇",
  },
  {
    label: "Eligibility Rules",
    path: "/admin/rules",
    icon: "✓",
  },
  {
    label: "AI Recommendations",
    path: "/admin/recommendations",
    icon: "✦",
  },
  {
    label: "Reports",
    path: "/admin/reports",
    icon: "▤",
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: "⚙",
  },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials =
    user?.full_name
      ?.split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

  return (
    <div className="min-h-screen bg-app-background text-app-foreground">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-app-border bg-app-surface lg:flex lg:flex-col">
          {/* Brand */}
          <div className="flex h-16 items-center border-b border-app-border px-5">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo_withoutword.png"
                alt="CIVORA"
                className="h-8 w-8 object-contain"
              />

              <div>
                <p className="text-sm font-semibold tracking-wide text-brand-primary">
                  CIVORA
                </p>
                <p className="text-xs text-app-muted">
                  Administration
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-app-muted">
              Control Center
            </p>

            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-brand-primary/10 text-brand-primary"
                      : "text-app-muted hover:bg-app-background hover:text-app-foreground",
                  ].join(" ")
                }
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-current/10 text-xs">
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User section */}
          <div className="border-t border-app-border p-4">
            <div className="mb-3 rounded-lg bg-app-background p-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-white">
                  {initials}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {user?.full_name}
                  </p>

                  <p className="truncate text-xs text-app-muted">
                    {user?.email}
                  </p>
                </div>
              </div>

              <span className="mt-3 inline-flex rounded-full bg-brand-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-primary">
                Administrator
              </span>
            </div>

            <button
              type="button"
              onClick={logout}
              className="w-full rounded-lg border border-app-border px-3 py-2 text-sm font-medium text-app-muted transition hover:bg-app-background hover:text-app-foreground"
            >
              Sign out
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-app-border bg-app-surface lg:hidden">
              <div className="flex h-16 items-center justify-between border-b border-app-border px-5">
                <div>
                  <p className="text-sm font-semibold tracking-wide text-brand-primary">
                    CIVORA
                  </p>

                  <p className="text-xs text-app-muted">
                    Administration
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg border border-app-border px-3 py-1.5 text-sm text-app-muted"
                >
                  ✕
                </button>
              </div>

              <nav className="flex-1 space-y-1 p-4">
                {navigation.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/admin"}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                        isActive
                          ? "bg-brand-primary/10 text-brand-primary"
                          : "text-app-muted hover:bg-app-background hover:text-app-foreground",
                      ].join(" ")
                    }
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-current/10 text-xs">
                      {item.icon}
                    </span>

                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="border-t border-app-border p-4">
                <button
                  type="button"
                  onClick={logout}
                  className="w-full rounded-lg border border-app-border px-3 py-2 text-sm font-medium text-app-muted transition hover:bg-app-background hover:text-app-foreground"
                >
                  Sign out
                </button>
              </div>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          {/* Header */}
          <header className="flex h-16 items-center justify-between border-b border-app-border bg-app-surface px-4 sm:px-6">
            <div className="flex items-center gap-3">
              {/* Mobile menu */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="rounded-lg border border-app-border px-3 py-2 text-sm text-app-muted lg:hidden"
                aria-label="Open admin navigation"
              >
                ☰
              </button>

              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-app-muted">
                  Administration
                </p>
                <h1 className="truncate text-base font-semibold sm:text-lg">
                  CIVORA Control Center
                </h1>
              </div>
            </div>

            {/* Header user */}
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium">
                  {user?.full_name}
                </p>

                <p className="text-xs text-app-muted">
                  Administrator
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-white">
                {initials}
              </div>
            </div>
          </header>

          {/* Page */}
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}