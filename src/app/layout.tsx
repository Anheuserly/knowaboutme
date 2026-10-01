import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "KnowAboutMe | Your story. Your world. Your identity.",
    template: "%s | KnowAboutMe",
  },
  description:
    "A professional, modern personal identity platform where anyone can create a beautiful public profile containing their biography, career, projects, artwork, and social links.",
  keywords: [
    "personal identity",
    "biography platform",
    "portfolio builder",
    "digital identity",
    "developer profile",
    "creator profile",
    "link in bio",
  ],
  authors: [{ name: "KnowAboutMe" }],
  creator: "KnowAboutMe",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://knowaboutme.com",
    title: "KnowAboutMe | Your story. Your world. Your identity.",
    description:
      "A professional personal identity platform where anyone can create a rich digital biography, portfolio, and verified social identity.",
    siteName: "KnowAboutMe",
  },
  twitter: {
    card: "summary_large_image",
    title: "KnowAboutMe | Your story. Your world. Your identity.",
    description:
      "A professional personal identity platform where anyone can create a rich digital biography, portfolio, and verified social identity.",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
