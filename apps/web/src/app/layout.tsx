import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UBuilder AI",
  description: "AI-powered website builder",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('ub-theme');
                if (theme === 'light') {
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
