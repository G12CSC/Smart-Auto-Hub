import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {Analytics} from "@vercel/analytics/next";
import "./globals.css";
import Providers from "@/app/providers";

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
  description: "Find your perfect vehicle at Sameera Auto Traders. Browse our complete inventory, book consultations, and get expert guidance.",
  icons: {
    icon: [
      {
        url: "/car32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/car32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: " ",
        type: "image/svg+xml",
      },
    ],
    apple: "/car128x128.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans antialiased`}
      >
        <Providers>
            {children}
            <Analytics />
            </Providers>


      </body>
    </html>
  );
}
