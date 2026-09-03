import { Shield, Sparkles } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary text-white">
        <Shield className="h-5 w-5" aria-hidden="true" />
        <Sparkles className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-white text-brand-amber" />
      </div>
      {!compact ? (
        <div>
          <p className="text-base font-semibold leading-5 text-app-text">CIVORA</p>
          <p className="text-xs text-app-muted">
            Intelligent Access to Government Benefits
          </p>
        </div>
      ) : null}
    </div>
  );
}
