"use client";

import { useEffect, type ComponentType } from "react";
import { X, LogOut } from "lucide-react";
import { Avatar } from "./avatar";

/** Navigation item definition */
export type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  badge?: number;
};

type SidebarProps = {
  items: NavItem[];
  currentPath: string;
  isOpen: boolean;
  onClose: () => void;
  user?: { name: string; email: string; image?: string | null } | null;
  onSignOut?: () => void;
  onNavigate?: (href: string) => void;
};

/** Responsive sidebar — always visible on desktop, slide-in drawer on mobile */
export const Sidebar = ({
  items,
  currentPath,
  isOpen,
  onClose,
  user,
  onSignOut,
  onNavigate,
}: SidebarProps) => {
  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNav = (href: string) => {
    if (onNavigate) {
      onNavigate(href);
    }
    onClose();
  };

  const navContent = (
    <div className="flex h-full flex-col">
      {/* Logo / Brand */}
      <div className="flex h-16 items-center justify-between border-b border-border-muted px-4">
        <span className="text-lg font-bold text-fg">UBuilder AI</span>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-fg-muted hover:bg-bg-muted hover:text-fg transition-colors md:hidden"
          aria-label="סגור תפריט"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const isActive = currentPath === item.href || currentPath.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <button
                  onClick={() => handleNav(item.href)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-bg-muted text-fg"
                      : "text-fg-muted hover:bg-bg-muted/50 hover:text-fg"
                  }`}
                >
                  <Icon size={20} className="shrink-0" />
                  <span className="flex-1 text-start">{item.label}</span>
                  {item.badge != null && item.badge > 0 && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-fg">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      {user && (
        <div className="border-t border-border-muted px-3 py-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <Avatar src={user.image} name={user.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-fg">{user.name}</p>
              <p className="truncate text-xs text-fg-muted" dir="ltr">{user.email}</p>
            </div>
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="shrink-0 rounded-lg p-1.5 text-fg-muted hover:bg-bg-muted hover:text-error transition-colors"
                aria-label="התנתקות"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <aside className="hidden md:flex md:w-64 md:shrink-0 md:flex-col bg-bg-subtle border-e border-border-muted">
        {navContent}
      </aside>

      {/* Mobile overlay backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 end-0 z-50 w-72 bg-bg-subtle shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full"
        }`}
      >
        {navContent}
      </aside>
    </>
  );
};
