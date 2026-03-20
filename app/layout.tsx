import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Providers from "@/app/providers";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import ChatBot from "@/components/ChatBot";
import PWARegister from "@/components/PWARegister";
import PWAInstallButton from "@/components/PWAInstallButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sameera Auto Traders",
  description:
    "Find your perfect vehicle at Sameera Auto Traders. Browse our complete inventory, book consultations, and get expert guidance.",
  manifest: "/manifest.webmanifest",
  themeColor: "#0b1220",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sameera Auto Traders",
  },
  icons: {
    icon: [
      {
        url: "/favicon32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <PWARegister />
            <PWAInstallButton />
            {children}
            <ChatBot />
            <Toaster />
          </ThemeProvider>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
