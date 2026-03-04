"use client";

import {
  DollarSign,
  Users,
  ShoppingBag,
  Percent,
  Edit,
  Plus,
  FileText,
  Sparkles,
} from "lucide-react";
import { StatCard, Card } from "@ubuilder/ui";
import { useSession } from "@/lib/auth-client";

// ─── Mock Data ──────────────────────────────────────────────────

const stats = [
  {
    icon: DollarSign,
    label: "הכנסות",
    value: "₪12,450",
    trend: 12.5,
    trendLabel: "מהחודש שעבר",
  },
  {
    icon: Users,
    label: "מבקרים",
    value: "1,284",
    trend: 8.2,
    trendLabel: "מהחודש שעבר",
  },
  {
    icon: ShoppingBag,
    label: "הזמנות",
    value: "64",
    trend: -3.1,
    trendLabel: "מהחודש שעבר",
  },
  {
    icon: Percent,
    label: "המרה",
    value: "4.98%",
    trend: 1.2,
    trendLabel: "מהחודש שעבר",
  },
];

const quickActions = [
  { icon: Edit, label: "עריכת האתר", href: "/editor" },
  { icon: Plus, label: "מוצר חדש", href: "/commerce/new" },
  { icon: FileText, label: "פוסט חדש", href: "/posts/new" },
  { icon: Sparkles, label: "שאל את ה-AI", href: "/ai" },
];

type OrderStatus = "paid" | "pending" | "cancelled";

type MockOrder = {
  id: string;
  customer: string;
  amount: string;
  date: string;
  status: OrderStatus;
};

const recentOrders: MockOrder[] = [
  { id: "#1234", customer: "ישראל כהן", amount: "₪250", date: "03/03/2026", status: "paid" },
  { id: "#1233", customer: "דנה לוי", amount: "₪180", date: "03/03/2026", status: "paid" },
  { id: "#1232", customer: "אבי מזרחי", amount: "₪95", date: "02/03/2026", status: "pending" },
  { id: "#1231", customer: "מיכל ברק", amount: "₪320", date: "02/03/2026", status: "paid" },
  { id: "#1230", customer: "יוסי אדרי", amount: "₪150", date: "01/03/2026", status: "cancelled" },
];

const statusMap: Record<OrderStatus, { label: string; className: string }> = {
  paid: { label: "שולם", className: "bg-success/10 text-success" },
  pending: { label: "ממתין", className: "bg-warning/10 text-warning" },
  cancelled: { label: "בוטל", className: "bg-error/10 text-error" },
};

/** Revenue sparkline data (30 days) */
const revenueData = [
  320, 420, 380, 510, 490, 620, 580, 710, 650, 780,
  740, 830, 690, 920, 870, 960, 1020, 980, 1100, 1050,
  1150, 1080, 1200, 1250, 1180, 1320, 1280, 1400, 1350, 1450,
];

// ─── Sparkline Component ────────────────────────────────────────

const Sparkline = ({ data }: { data: number[] }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 400;
  const height = 80;
  const padding = 4;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-20"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ub-primary)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--ub-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Area fill */}
      <polygon
        points={`${padding},${height - padding} ${points} ${width - padding},${height - padding}`}
        fill="url(#sparkGradient)"
      />
      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke="var(--ub-primary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ─── Dashboard Home Page ────────────────────────────────────────

/** Dashboard home with stats, quick actions, chart, and recent orders */
const DashboardPage = () => {
  const { data: session } = useSession();
  const userName = session?.user?.name?.split(" ")[0] ?? "";

  return (
    <div className="flex flex-col gap-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-fg">
          {userName ? `שלום, ${userName}` : "שלום"}
        </h1>
        <p className="text-fg-muted mt-1">סיכום לוח הבקרה שלך</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-fg">פעולות מהירות</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                className="flex shrink-0 items-center gap-2.5 rounded-xl bg-bg-subtle px-4 py-3 text-sm font-medium text-fg-muted transition-colors hover:bg-bg-muted hover:text-fg"
              >
                <Icon size={18} />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Revenue Chart */}
      <Card className="p-4">
        <h2 className="mb-3 text-lg font-semibold text-fg">הכנסות 30 יום אחרונים</h2>
        <Sparkline data={revenueData} />
      </Card>

      {/* Recent Orders */}
      <Card className="p-4">
        <h2 className="mb-4 text-lg font-semibold text-fg">הזמנות אחרונות</h2>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-muted text-fg-muted">
                <th className="pb-3 text-start font-medium">מזהה</th>
                <th className="pb-3 text-start font-medium">לקוח</th>
                <th className="pb-3 text-start font-medium">סכום</th>
                <th className="pb-3 text-start font-medium">תאריך</th>
                <th className="pb-3 text-start font-medium">סטטוס</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => {
                const status = statusMap[order.status];
                return (
                  <tr key={order.id} className="border-b border-border-muted/50 last:border-0">
                    <td className="py-3 font-mono text-fg-muted" dir="ltr">{order.id}</td>
                    <td className="py-3 text-fg">{order.customer}</td>
                    <td className="py-3 font-medium text-fg" dir="ltr">{order.amount}</td>
                    <td className="py-3 text-fg-muted" dir="ltr">{order.date}</td>
                    <td className="py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="flex flex-col gap-3 md:hidden">
          {recentOrders.map((order) => {
            const status = statusMap[order.status];
            return (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-lg bg-bg-muted/50 px-3 py-2.5"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-fg">{order.customer}</span>
                  <span className="text-xs text-fg-muted">
                    <span dir="ltr">{order.id}</span>
                    {" · "}
                    <span dir="ltr">{order.date}</span>
                  </span>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-sm font-medium text-fg" dir="ltr">{order.amount}</span>
                  <span className={`text-xs font-medium ${status.className.replace(/bg-\S+/g, "")}`}>
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
