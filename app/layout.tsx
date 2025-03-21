import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { BackgroundMesh } from "@/components/background-mesh";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const arabic = localFont({
  src: "../public/fonts/ScheherazadeNew-Regular.woff",
  variable: "--font-arabic",
  display: "swap",
});

export const metadata = {
  title: "Al-Qur'an Digital",
  description: "Aplikasi Al-Qur'an digital dengan fitur lengkap",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className="scroll-smooth">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          arabic.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <BackgroundMesh />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
