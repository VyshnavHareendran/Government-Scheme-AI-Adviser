import {
  Brain,
  ClipboardList,
  Home,
  LogOut,
  Search,
  UserRound,
  Vote,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { initials } from "../../utils/format";
import { Logo } from "./Logo";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: Home },
  { label: "Schemes", to: "/schemes", icon: Search },
  { label: "My Profile", to: "/profile", icon: UserRound },
  { label: "Eligible Schemes", to: "/eligibility", icon: Vote },
  { label: "AI Recommendations", to: "/recommendations", icon: Brain },
  { label: "My Applications", to: "/applications", icon: ClipboardList },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { logout, user } = useAuth();

  return (
    <aside className="flex h-full flex-col border-r border-app-border bg-white">
      {/* Logo */}
      <div className="border-b border-app-border px-5 py-5">
        <Logo />
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto px-3 py-4"
        aria-label="Primary navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              className={({ isActive }) =>
                `mb-1 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-brand-light text-brand-dark"
                    : "text-app-muted hover:bg-slate-100 hover:text-app-text"
                }`
              }
              key={item.to}
              onClick={onNavigate}
              to={item.to}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-app-border p-4">
        <div className="flex items-center gap-3 rounded-md bg-slate-50 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-semibold text-white">
            {initials(user?.full_name ?? "User")}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-app-text">
              {user?.full_name}
            </p>
            <p className="truncate text-xs text-app-muted">
              {user?.email}
            </p>
          </div>
        </div>

        <button
          className="mt-3 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-app-muted transition hover:bg-slate-100 hover:text-app-text"
          onClick={logout}
          type="button"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}