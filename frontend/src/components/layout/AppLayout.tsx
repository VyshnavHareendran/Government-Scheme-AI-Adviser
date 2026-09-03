import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-app-background">
      {/* Desktop Sidebar */}
      <div className="fixed inset-y-0 left-0 hidden w-72 lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setMobileOpen(false)}
            type="button"
          />

          <div className="relative h-full w-80 max-w-[86vw]">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      {/* Main Content */}
      <div className="lg:pl-72">
        <Header onMenuClick={() => setMobileOpen(true)} />

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-5 md:px-6 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}