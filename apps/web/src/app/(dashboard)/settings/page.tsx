import { Settings } from "lucide-react";

const SettingsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center">
        <Settings className="w-8 h-8 text-fg-muted" />
      </div>
      <h1 className="text-2xl font-bold text-fg">הגדרות</h1>
      <p className="text-fg-muted max-w-md">
        הגדרות חשבון, התראות, חיבורים ועוד.
      </p>
      <p className="text-sm text-fg-muted/60">בקרוב...</p>
    </div>
  );
};

export default SettingsPage;
