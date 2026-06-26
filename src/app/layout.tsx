import type { Metadata } from "next";
import "./globals.css";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { CookieConsent } from "@/components/cookie-consent";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "https://auditgpt.ai"),
  title: "AuditGPT — Find what is unsupported, invisible, risky, or leaking",
  description:
    "AuditGPT by Scrutexity. The diagnostic that maps the gap between claim, evidence, AI/search readability, and demand leakage. Free Visibility & Trust Snapshot.",
  keywords: [
    "Visibility and Trust audit",
    "claim audit",
    "AI search visibility audit",
    "reputation surface audit",
    "demand recovery audit",
    "Scrutexity",
    "auditgpt",
  ],
  authors: [{ name: "AuditGPT by Scrutexity" }],
  icons: {
    icon: [{ url: "/logo-shield.png", type: "image/png", sizes: "any" }],
    apple: [{ url: "/logo-shield.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    title: "AuditGPT — Find what is unsupported, invisible, risky, or leaking",
    description:
      "AuditGPT by Scrutexity. The diagnostic front door for governed marketing and demand recovery.",
    type: "website",
    siteName: "AuditGPT",
    images: [{ url: "/logo-full.png", width: 1200, height: 285, alt: "AuditGPT" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AuditGPT — Visibility & Trust diagnostics",
    description:
      "Find what is unsupported, invisible, risky, or leaking. AuditGPT by Scrutexity.",
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
        className="antialiased bg-background text-foreground min-h-screen"
      >
        <Providers>
          {children}
          <SonnerToaster richColors position="top-center" />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
