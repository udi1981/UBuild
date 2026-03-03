import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UBuilder AI — לוח בקרה",
};

/** Dashboard home page placeholder */
const DashboardPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-fg">ברוכים הבאים ל-UBuilder AI</h1>
      <p className="text-fg-muted text-lg max-w-md">
        לוח הבקרה בפיתוח — יושלם במשימה 1.2.2
      </p>
    </div>
  );
};

export default DashboardPage;
