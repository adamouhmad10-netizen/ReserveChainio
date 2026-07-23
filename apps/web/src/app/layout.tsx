import type { Metadata } from "next";
import { Inter, Inter_Tight, IBM_Plex_Mono } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", display: "swap" });
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ReserveChain.io | Building the Infrastructure for Industrial-Metals Tokenization",
    template: "%s | ReserveChain.io",
  },
  description:
    "ReserveChain is developing an institutional platform intended to connect documented industrial-metal assets with digital tokenization, verification, custody and physical-redemption infrastructure. Prelaunch information platform — no tokens are offered or sold through this website.",
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32" },
      { url: "/brand/favicon-64.png", sizes: "64x64" },
    ],
    apple: "/brand/apple-touch-icon.png",
  },
  openGraph: {
    siteName: "ReserveChain.io",
    type: "website",
    images: ["/brand/social-preview.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable} ${plexMono.variable}`}>
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
