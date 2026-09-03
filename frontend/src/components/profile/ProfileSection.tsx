import type { ReactNode } from "react";

export function ProfileSection({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="border-t border-app-border pt-5 first:border-t-0 first:pt-0">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-normal text-app-muted">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}
