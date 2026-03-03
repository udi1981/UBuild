"use client";

import type { ComponentProps } from "react";

type CardProps = ComponentProps<"div">;

/** Card container with dark theme surface */
export const Card = ({ children, className = "", ...props }: CardProps) => {
  return (
    <div
      className={`rounded-xl border border-border-muted bg-bg-subtle p-6 shadow-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
