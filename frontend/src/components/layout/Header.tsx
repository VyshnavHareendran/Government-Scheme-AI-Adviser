import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { initials } from "../../utils/format";
import { Logo } from "./Logo";

const titles: Record<string, { title: string; description: string }> = {
  "/dashboard": {
    title: "Dashboard",
    description: "Your personalized scheme overview.",
  },
  "/profile": {
    title: "Citizen Profile",
    description: "Eligibility data used by the Rule Engine and recommendation model.",
  },
  "/schemes": {
    title: "Schemes",
    description: "Active government schemes available in the system.",
  },
  "/eligibility": {
    title: "Eligible Schemes",
    description: "Schemes verified by the deterministic Rule Engine.",
  },
  "/recommendations": {
    title: "AI Recommendations",
    description: "Personalized schemes ranked by backend AI analysis.",
  },
  "/applications": {
    title: "My Applications",
    description: "Track applications started through CIVORA.",
  },
};

function getHeaderMeta(pathname: string) {
  if (pathname.startsWith("/schemes/")) {
    return { title: "Scheme Details", description: "Review eligibility and official application options." };
  }
  return titles[pathname] ?? titles["/dashboard"];
}

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const location = useLocation();
  const { user } = useAuth();
  const meta = getHeaderMeta(location.pathname);

  return (
    <header className="sticky top-0 z-20 border-b border-app-border bg-white">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            aria-label="Open navigation"
            className="rounded-md p-2 text-app-muted hover:bg-slate-100 lg:hidden"
            onClick={onMenuClick}
            type="button"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="lg:hidden">
            <Logo compact />
          </div>
          <div className="hidden lg:block">
            <h2 className="text-lg font-semibold text-app-text">{meta.title}</h2>
            <p className="text-xs text-app-muted">{meta.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-app-text">{user?.full_name}</p>
            <p className="text-xs text-app-muted">{user?.role}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-sm font-semibold text-white">
            {initials(user?.full_name ?? "User")}
          </div>
        </div>
      </div>
    </header>
  );
}
