import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-lg border border-app-border bg-app-surface p-5 shadow-soft ${className}`}
      {...props}
    />
  );
}
