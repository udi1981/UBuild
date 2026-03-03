"use client";

import type { ComponentProps } from "react";

type AvatarSize = "sm" | "md" | "lg";

type AvatarProps = Omit<ComponentProps<"div">, "children"> & {
  src?: string | null;
  name: string;
  size?: AvatarSize;
};

const sizeMap: Record<AvatarSize, string> = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
};

/** Extracts up to 2 initials from a name */
const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]![0]?.toUpperCase() ?? "";
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
};

/** Circular avatar with image or initials fallback */
export const Avatar = ({ src, name, size = "md", className = "", ...props }: AvatarProps) => {
  const sizeClass = sizeMap[size];

  if (src) {
    return (
      <div
        className={`${sizeClass} shrink-0 overflow-hidden rounded-full ${className}`}
        {...props}
      >
        <img src={src} alt={name} className="size-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} shrink-0 flex items-center justify-center rounded-full bg-primary text-primary-fg font-medium select-none ${className}`}
      {...props}
    >
      {getInitials(name)}
    </div>
  );
};
