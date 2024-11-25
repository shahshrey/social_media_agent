import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { toastConfig } from './components/ui/toast';
import { ThemeProvider } from './providers/ThemeProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SocialGenius AI | Social Media Manager",
  description: "AI-powered social media content generation and management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.className} bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 min-h-screen h-screen`}>
        <ThemeProvider>
          <Toaster
            position="bottom-left"
            toastOptions={{
              ...toastConfig.success,
              success: toastConfig.success,
              error: toastConfig.error,
            }}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
