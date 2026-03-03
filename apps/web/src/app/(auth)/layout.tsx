import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UBuilder AI — כניסה",
  description: "התחבר לחשבון UBuilder AI שלך",
};

/** Auth pages layout — centered card on dark background */
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-fg">UBuilder AI</h1>
        <p className="mt-1 text-sm text-fg-muted">בנה אתרים חכמים עם AI</p>
      </div>
      <div className="w-full max-w-md animate-slide-up">{children}</div>
    </div>
  );
};

export default AuthLayout;
