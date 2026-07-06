"use client";

import { Eye, EyeOff } from "lucide-react";

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  showPassword: boolean;
  describedBy: string;
  onChange: (value: string) => void;
  onToggleShow: () => void;
};

export function PasswordField({
  id,
  label,
  value,
  showPassword,
  describedBy,
  onChange,
  onToggleShow,
}: PasswordFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-foreground">
        {label}
      </label>
      <div className="mt-2 flex rounded-md border border-input bg-background shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-ring">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-describedby={describedBy}
          className="min-w-0 flex-1 rounded-l-md bg-transparent px-3 py-2.5 text-sm font-medium text-foreground outline-none"
        />
        <button
          type="button"
          onClick={onToggleShow}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="grid w-11 place-items-center rounded-r-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {showPassword ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
