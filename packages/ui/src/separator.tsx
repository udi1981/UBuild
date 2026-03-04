"use client";

import type { ComponentProps } from "react";

type SeparatorProps = ComponentProps<"div"> & {
  label?: string;
};

/** Horizontal divider with optional centered text label */
export const Separator = ({ label, className = "", ...props }: SeparatorProps) => {
  if (!label) {
    return <div className={`h-px bg-border-muted ${className}`} {...props} />;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`} {...props}>
      <div className="h-px flex-1 bg-border-muted" />
      <span className="text-xs text-fg-subtle select-none">{label}</span>
      <div className="h-px flex-1 bg-border-muted" />
    </div>
  );
};
