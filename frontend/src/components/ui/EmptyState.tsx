import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
}

export function EmptyState({ action, icon, message, title }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-app-border bg-white p-8 text-center">
      {icon ? <div className="mx-auto mb-3 flex justify-center text-app-muted">{icon}</div> : null}
      <h3 className="text-base font-semibold text-app-text">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm text-app-muted">{message}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
