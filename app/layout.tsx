import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import { ManagerProvider } from "@/contexts/ManagerContext";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkillStream: QA Onboarding DXP",
  description: "Personalized QA onboarding experience powered by Contentstack",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ManagerProvider>
          <AppProvider>
            {children}
            <Toaster position="top-right" richColors />
          </AppProvider>
        </ManagerProvider>
      </body>
    </html>
  );
}

