"use client";

import { useState, useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Globe,
  FileText,
  ShoppingCart,
  BarChart3,
  Settings,
} from "lucide-react";
import { Sidebar, Header, TabBar, Breadcrumbs, type NavItem } from "@ubuilder/ui";
import { useSession, signOut } from "@/lib/auth-client";
import { Spinner } from "@ubuilder/ui";

/** Main navigation items with Hebrew labels */
const navItems: NavItem[] = [
  { label: "ראשי", href: "/", icon: Home },
  { label: "אתרים", href: "/sites", icon: Globe },
  { label: "עמודים", href: "/pages", icon: FileText },
  { label: "חנות", href: "/commerce", icon: ShoppingCart },
  { label: "אנליטיקס", href: "/analytics", icon: BarChart3 },
  { label: "הגדרות", href: "/settings", icon: Settings },
];

/** Bottom tab bar items — subset of nav items for mobile */
const tabItems = [
  { label: "ראשי", href: "/", icon: Home },
  { label: "אתרים", href: "/sites", icon: Globe },
  { label: "חנות", href: "/commerce", icon: ShoppingCart },
  { label: "אנליטיקס", href: "/analytics", icon: BarChart3 },
  { label: "הגדרות", href: "/settings", icon: Settings },
];

/** Map paths to Hebrew breadcrumb labels */
const pathLabels: Record<string, string> = {
  "/": "ראשי",
  "/sites": "אתרים",
  "/pages": "עמודים",
  "/commerce": "חנות",
  "/analytics": "אנליטיקס",
  "/settings": "הגדרות",
};

/** Build breadcrumb items from current path */
const buildBreadcrumbs = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return [{ label: "ראשי" }];
  }

  const items = [{ label: "ראשי", href: "/" }];
  let currentPath = "";
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const label = pathLabels[currentPath] || segment;
    items.push({ label, href: currentPath });
  }
  // Last item has no href (current page)
  const last = items[items.length - 1]!;
  return [...items.slice(0, -1), { label: last.label }];
};

/** Dashboard layout with sidebar, header, tab bar, and auth guard */
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  const handleNavigate = useCallback(
    (href: string) => {
      router.push(href);
    },
    [router],
  );

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.replace("/login");
  }, [router]);

  // Show loading state while checking auth
  if (isPending) {
    return (
      <div className="flex h-dvh items-center justify-center bg-bg">
        <Spinner size={32} />
      </div>
    );
  }

  // Don't render layout if not authenticated (redirect is happening)
  if (!session) {
    return null;
  }

  const breadcrumbs = buildBreadcrumbs(pathname);

  return (
    <div className="flex h-dvh bg-bg">
      {/* Sidebar */}
      <Sidebar
        items={navItems}
        currentPath={pathname}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={session.user}
        onSignOut={handleSignOut}
        onNavigate={handleNavigate}
      />

      {/* Main content area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          user={session.user}
        >
          <Breadcrumbs items={breadcrumbs} />
        </Header>

        {/* Page content — scrollable */}
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile tab bar */}
      <TabBar
        items={tabItems}
        currentPath={pathname}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default DashboardLayout;
