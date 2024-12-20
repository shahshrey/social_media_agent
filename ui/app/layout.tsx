import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { toastConfig } from './components/ui/toast';
import { ThemeProvider } from './providers/theme-provider';

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
      <body className={`${inter.className} min-h-screen h-screen overflow-x-hidden`}>
        <ThemeProvider>
          <Toaster
            position="bottom-left"
            toastOptions={{
              style: toastConfig.success.style,
              className: toastConfig.success.className,
            }}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
