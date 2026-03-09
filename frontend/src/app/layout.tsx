import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/hooks/QueryProvider";
import { StoreProvider } from "@/lib/store/provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayoutWrapper } from "@/components/layouts/AppLayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Book Management Library",
  description: "Manage your book collection with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <QueryProvider>
            <TooltipProvider>
              <AppLayoutWrapper>{children}</AppLayoutWrapper>
            </TooltipProvider>
            <Toaster position="top-right" />
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
