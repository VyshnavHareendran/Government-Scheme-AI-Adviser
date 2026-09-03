import type { HTMLAttributes } from "react";

type Variant = "teal" | "green" | "amber" | "slate" | "red";

const styles: Record<Variant, string> = {
  teal: "bg-brand-light text-brand-dark",
  green: "bg-green-50 text-app-success",
  amber: "bg-amber-50 text-app-warning",
  slate: "bg-slate-100 text-app-muted",
  red: "bg-red-50 text-app-danger",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({ className = "", variant = "slate", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[variant]} ${className}`}
      {...props}
    />
  );
}
