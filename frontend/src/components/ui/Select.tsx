import type { SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: (string | SelectOption)[];
  placeholder?: string;
}

export function Select({
  className = "",
  error,
  id,
  label,
  options,
  placeholder = "Select",
  ...props
}: SelectProps) {
  const selectId = id ?? props.name ?? label;
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-app-text" htmlFor={selectId}>
        {label}
      </label>
      <select
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${selectId}-error` : undefined}
        className={`h-10 w-full rounded-md border border-app-border bg-white px-3 text-sm text-app-text shadow-soft transition focus:border-brand-primary ${className}`}
        id={selectId}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => {
          const value =
            typeof option === "string"
              ? option
              : option.value;

          const label =
            typeof option === "string"
              ? option
              : option.label;

          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
      {error ? (
        <p className="mt-1 text-sm text-app-danger" id={`${selectId}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
