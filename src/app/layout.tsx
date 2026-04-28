import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BrandOS | The All-in-One Brand Operating System",
  description: "Unified brand strategy, asset management, and AI-powered content generation.",
};

import { LanguageProvider } from "@/lib/i18n";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased dark`}
    >
      <body className="min-h-full font-sans selection:bg-primary/30 selection:text-primary">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
