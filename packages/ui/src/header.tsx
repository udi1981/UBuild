"use client";

import type { ReactNode } from "react";
import { Menu, Bell } from "lucide-react";
import { Avatar } from "./avatar";

type HeaderProps = {
  onMenuClick: () => void;
  user?: { name: string; image?: string | null } | null;
  notificationCount?: number;
  children?: ReactNode;
};

/** Top header bar with hamburger menu, breadcrumbs slot, and user actions */
export const Header = ({ onMenuClick, user, notificationCount = 0, children }: HeaderProps) => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border-muted bg-bg-subtle px-4">
      {/* Hamburger menu — mobile only */}
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-fg-muted hover:bg-bg-muted hover:text-fg transition-colors md:hidden"
        aria-label="פתח תפריט"
      >
        <Menu size={22} />
      </button>

      {/* Breadcrumbs / page title slot */}
      <div className="flex-1 min-w-0">{children}</div>

      {/* Notification bell */}
      <button
        className="relative rounded-lg p-2 text-fg-muted hover:bg-bg-muted hover:text-fg transition-colors"
        aria-label="התראות"
      >
        <Bell size={20} />
        {notificationCount > 0 && (
          <span className="absolute -top-0.5 -start-0.5 flex size-4 items-center justify-center rounded-full bg-error text-[9px] font-bold text-error-fg">
            {notificationCount > 9 ? "9+" : notificationCount}
          </span>
        )}
      </button>

      {/* User avatar */}
      {user && (
        <Avatar src={user.image} name={user.name} size="sm" className="cursor-pointer" />
      )}
    </header>
  );
};
