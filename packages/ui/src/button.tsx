"use client";

import type { ComponentProps } from "react";
import { Spinner } from "./spinner";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-fg hover:bg-primary-hover active:bg-primary-hover",
  secondary:
    "bg-secondary text-secondary-fg hover:bg-secondary-hover active:bg-secondary-hover",
  outline:
    "border border-border bg-transparent text-fg hover:bg-bg-subtle active:bg-bg-muted",
  ghost:
    "bg-transparent text-fg hover:bg-bg-subtle active:bg-bg-muted",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm rounded-md gap-1.5",
  md: "h-10 px-4 text-sm rounded-lg gap-2",
  lg: "h-12 px-6 text-base rounded-lg gap-2.5",
};

/** Button component with variants, sizes, and loading state */
export const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading && <Spinner size={size === "sm" ? 14 : 18} />}
      {children}
    </button>
  );
};
