import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AuditGPT — The Truth Engine for AI Businesses",
  description:
    "Did an AI build your business? AuditGPT scrapes, verifies, and grades your site — then rebuilds it without hallucinations. No fluff. Just facts.",
  keywords: [
    "AI business audit",
    "Polsia review",
    "Polsia alternative",
    "is my AI-built business real",
    "auditgpt",
    "business audit",
    "AI slop detector",
    "fact-backed audit",
  ],
  authors: [{ name: "AuditGPT" }],
  icons: {
    icon: [
      { url: "/logo-shield.png", type: "image/png", sizes: "any" },
    ],
    apple: [
      { url: "/logo-shield.png", type: "image/png", sizes: "180x180" },
    ],
  },
  openGraph: {
    title: "AuditGPT — The Truth Engine for AI Businesses",
    description:
      "Did an AI build your business? AuditGPT will tell you the brutal truth — and then rebuild it for real.",
    type: "website",
    siteName: "AuditGPT",
    images: [{ url: "/logo-full.png", width: 1200, height: 285, alt: "AuditGPT" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AuditGPT — The Truth Engine for AI Businesses",
    description:
      "Did an AI build your business? AuditGPT tells you the truth — then rebuilds it without hallucinations.",
    images: ["/logo-full.png"],
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
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <Providers>
          {children}
          <SonnerToaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
