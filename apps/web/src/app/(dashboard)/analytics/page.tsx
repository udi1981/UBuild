import { BarChart3 } from "lucide-react";

const AnalyticsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center">
        <BarChart3 className="w-8 h-8 text-fg-muted" />
      </div>
      <h1 className="text-2xl font-bold text-fg">אנליטיקס</h1>
      <p className="text-fg-muted max-w-md">
        סטטיסטיקות ונתוני ביצועים של האתר והחנות שלך.
      </p>
      <p className="text-sm text-fg-muted/60">בקרוב...</p>
    </div>
  );
};

export default AnalyticsPage;
