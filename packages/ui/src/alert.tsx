"use client";

import type { ComponentProps } from "react";
import { AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";

type AlertVariant = "error" | "success" | "warning" | "info";

type AlertProps = ComponentProps<"div"> & {
  variant?: AlertVariant;
};

const variantConfig: Record<AlertVariant, { className: string; Icon: typeof AlertCircle }> = {
  error: {
    className: "border-error/30 bg-error/10 text-error",
    Icon: AlertCircle,
  },
  success: {
    className: "border-success/30 bg-success/10 text-success",
    Icon: CheckCircle,
  },
  warning: {
    className: "border-warning/30 bg-warning/10 text-warning",
    Icon: AlertTriangle,
  },
  info: {
    className: "border-primary/30 bg-primary/10 text-primary",
    Icon: Info,
  },
};

/** Alert banner with icon for error/success/warning/info states */
export const Alert = ({
  variant = "info",
  children,
  className = "",
  ...props
}: AlertProps) => {
  const { className: variantClass, Icon } = variantConfig[variant];

  return (
    <div
      role="alert"
      className={`flex items-start gap-2 rounded-lg border p-3 text-sm animate-fade-in ${variantClass} ${className}`}
      {...props}
    >
      <Icon size={16} className="mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
};
