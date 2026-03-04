"use client";

import type { ComponentType } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "./card";

type StatCardProps = {
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  trend?: number;
  trendLabel?: string;
};

/** Dashboard metric card with icon, value, and optional trend indicator */
export const StatCard = ({ icon: Icon, label, value, trend, trendLabel }: StatCardProps) => {
  const isPositive = trend != null && trend >= 0;
  const trendColor = isPositive ? "text-success" : "text-error";
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-fg-muted">{label}</span>
        <div className="flex size-9 items-center justify-center rounded-lg bg-bg-muted">
          <Icon size={18} className="text-fg-muted" />
        </div>
      </div>
      <p className="text-2xl font-bold text-fg" dir="ltr">{value}</p>
      {trend != null && (
        <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
          <TrendIcon size={14} />
          <span dir="ltr">{Math.abs(trend)}%</span>
          {trendLabel && <span className="text-fg-subtle">{trendLabel}</span>}
        </div>
      )}
    </Card>
  );
};
