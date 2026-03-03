"use client";

import type { ComponentType } from "react";

type TabItem = {
  label: string;
  href: string;
  icon: ComponentType<{ size?: number; className?: string }>;
};

type TabBarProps = {
  items: TabItem[];
  currentPath: string;
  onNavigate?: (href: string) => void;
};

/** Mobile-only bottom tab bar for quick navigation */
export const TabBar = ({ items, currentPath, onNavigate }: TabBarProps) => {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-border-muted bg-bg-subtle pb-2 pt-1.5 md:hidden">
      {items.map((item) => {
        const isActive = currentPath === item.href || currentPath.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <button
            key={item.href}
            onClick={() => onNavigate?.(item.href)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors ${
              isActive ? "text-primary" : "text-fg-muted"
            }`}
          >
            <Icon size={22} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
