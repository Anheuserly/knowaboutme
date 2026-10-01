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
