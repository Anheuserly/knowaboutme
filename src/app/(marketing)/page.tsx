import React from "react";
import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { InteractiveDemo } from "@/components/marketing/InteractiveDemo";
import { Features } from "@/components/marketing/Features";
import { Footer } from "@/components/marketing/Footer";

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <InteractiveDemo />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
