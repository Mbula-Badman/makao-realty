import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Makao Realty | Find a place to call your own",
    template: "%s | Makao Realty",
  },
  description:
    "Discover thoughtfully selected land, homes and investment properties across Kenya with Makao Realty.",
  openGraph: {
    title: "Makao Realty | Find a place to call your own",
    description: "Land, homes and considered investments across Kenya.",
    siteName: "Makao Realty",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try { var savedTheme = localStorage.getItem("makao-theme"); var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches; document.documentElement.dataset.theme = savedTheme || (prefersDark ? "dark" : "light"); } catch (_) { document.documentElement.dataset.theme = "light"; }`,
          }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
