import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "修仙之路 - 打怪升级修仙游戏",
  description: "一个经典的修仙网页游戏，打怪升级、收集装备、渡劫飞升，踏上修仙之路！",
  keywords: ["修仙", "游戏", "RPG", "网页游戏", "仙侠", "打怪升级"],
  authors: [{ name: "修仙之路" }],
  icons: {
    icon: "🏔️",
  },
  openGraph: {
    title: "修仙之路",
    description: "打怪升级、收集装备、渡劫飞升，踏上修仙之路！",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
