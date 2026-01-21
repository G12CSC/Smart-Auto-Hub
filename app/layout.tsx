import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Providers from "@/app/providers";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import ChatBot from "@/components/ChatBot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart AutoHub - Sameera Auto Traders",
  description:
    "Find your perfect vehicle at Sameera Auto Traders. Browse our complete inventory, book consultations, and get expert guidance.",
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
    apple: "/favicon128x128.png",
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
