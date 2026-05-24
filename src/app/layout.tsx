import type { Metadata } from "next";
import { Inter, Heebo, Geist } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
});

export const metadata: Metadata = {
  title: "Insight Ad Preview - Insight Marketing Solutions",
  description:
    "Preview and submit ad content across Google, Facebook, Instagram, LinkedIn, and Pinterest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={cn("h-full", "antialiased", inter.variable, heebo.variable, "font-sans", geist.variable)}
    >
      <body className="flex min-h-full flex-col">
        <I18nProvider>
          <TooltipProvider delay={200}>
            {children}
            <Toaster richColors closeButton position="top-center" />
          </TooltipProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
