import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UBuilder Site",
  description: "Published with UBuilder AI",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
