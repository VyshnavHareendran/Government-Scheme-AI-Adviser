import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ className = "", error, id, label, ...props }: InputProps) {
  const inputId = id ?? props.name ?? label;
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-app-text" htmlFor={inputId}>
        {label}
      </label>
      <input
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`h-10 w-full rounded-md border border-app-border bg-white px-3 text-sm text-app-text shadow-soft transition placeholder:text-slate-400 focus:border-brand-primary ${className}`}
        id={inputId}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-sm text-app-danger" id={`${inputId}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
