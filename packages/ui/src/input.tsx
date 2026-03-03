"use client";

import { useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";

type InputProps = Omit<ComponentProps<"input">, "size"> & {
  label?: string;
  error?: string;
};

/** Text input with label, error state, and password toggle */
export const Input = ({
  label,
  error,
  type,
  id,
  className = "",
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-fg">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={isPassword && showPassword ? "text" : type}
          className={`w-full h-10 rounded-lg border border-border bg-bg-subtle px-3 text-sm text-fg placeholder:text-fg-subtle transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-ring focus:border-ring disabled:opacity-50 disabled:cursor-not-allowed ${isPassword ? "pe-10" : ""} ${error ? "border-error focus:outline-error" : ""} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute end-0 top-0 h-10 w-10 inline-flex items-center justify-center text-fg-muted hover:text-fg transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
};
