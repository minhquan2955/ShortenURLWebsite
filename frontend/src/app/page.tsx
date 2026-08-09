"use client";

import { useState } from "react";
import { Link2, QrCode, ArrowRight } from "lucide-react";
import Link from "next/link";
import FeaturesSection from "@/components/home/FeaturesSection";
import MetricsSection from "@/components/home/MetricsSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import BottomCTA from "@/components/home/BottomCTA";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"link" | "qr">("link");
  const [longUrl, setLongUrl] = useState("");

  return (
    <main className="flex-1 flex flex-col min-h-screen">
      {/* Navbar (Mock for visual completeness based on Bitly) */}
      <header className="flex items-center justify-between px-[var(--spacing-xl)] py-[var(--spacing-md)] bg-[var(--color-ink)] text-white">
        <div className="flex items-center gap-[var(--spacing-xl)]">
          {/* Logo placeholder */}
          <div className="text-[var(--color-primary)] font-black text-2xl tracking-tighter">
            ShortenURL
          </div>
          <nav className="hidden md:flex gap-[var(--spacing-lg)] text-body-sm-strong text-[var(--color-canvas-soft)]">
            <Link href="#" className="hover:text-white transition-colors">Platform</Link>
            <Link href="#" className="hover:text-white transition-colors">Solutions</Link>
            <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="#" className="hover:text-white transition-colors">Resources</Link>
          </nav>
        </div>
        <div className="flex items-center gap-[var(--spacing-md)]">
          <Link href="/login" className="text-body-sm-strong text-[var(--color-canvas-soft)] hover:text-white">
            Log in
          </Link>
          <Link
            href="/register"
            className="hidden md:inline-flex items-center justify-center bg-[var(--color-canvas)] text-[var(--color-ink)] px-[var(--spacing-lg)] py-[var(--spacing-sm)] rounded-[var(--radius-pill)] text-body-sm-strong hover:bg-[var(--color-canvas-soft)] transition-colors"
          >
            Sign up Free
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 bg-[var(--color-ink)] text-white px-[var(--spacing-xl)] pt-[var(--spacing-3xl)] pb-[80px] flex flex-col items-center relative overflow-hidden">
        {/* Decorative elements (Stars) */}
        <div className="absolute top-20 left-1/4 opacity-20">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5l-10 14M22 12H2M19 17L5 7" /></svg>
        </div>
        <div className="absolute top-32 right-1/4 opacity-20">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5l-10 14M22 12H2M19 17L5 7" /></svg>
        </div>

        <div className="max-w-[896px] w-full text-center z-10 px-4">
          <h1 className="text-display-xl md:text-display-xxl mb-[var(--spacing-lg)] text-[var(--color-canvas)]">
            Understand what clicks with your audience
          </h1>
          <p className="text-body-lg text-[var(--color-canvas-soft)] max-w-[768px] mx-auto mb-[var(--spacing-3xl)]">
            ShortenURL makes it easy to create, share, and track short links and QR Codes. Find what&apos;s resonating and scale it into bigger reach, more clicks, and more sales.
          </p>

          {/* Interactive Card Area - Unified Outer Dark Container */}
          <div className="max-w-[768px] mx-auto mt-8 bg-[#1a202c] p-2.5 sm:p-3.5 rounded-[32px] shadow-2xl border border-[#2d3748]">
            {/* Header Tabs */}
            <div className="flex justify-center pb-2.5 pt-1">
              <div className="flex bg-[#0e131f] p-1.5 rounded-[var(--radius-lg)] border border-[#2d3748]">
                <button
                  onClick={() => setActiveTab("link")}
                  className={`flex items-center gap-2 px-[var(--spacing-xl)] py-[var(--spacing-md)] rounded-[var(--radius-md)] text-body-md-strong transition-colors ${
                    activeTab === "link"
                      ? "bg-[var(--color-canvas)] text-[var(--color-ink)] shadow-sm"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <Link2 size={20} className={activeTab === "link" ? "text-[#ff6b00]" : "text-white"} />
                  Short Link
                </button>
                <button
                  onClick={() => setActiveTab("qr")}
                  className={`flex items-center gap-2 px-[var(--spacing-xl)] py-[var(--spacing-md)] rounded-[var(--radius-md)] text-body-md-strong transition-colors ${
                    activeTab === "qr"
                      ? "bg-[var(--color-canvas)] text-[var(--color-ink)] shadow-sm"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <QrCode size={20} className={activeTab === "qr" ? "text-[#ff6b00]" : "text-white"} />
                  QR Code
                </button>
              </div>
            </div>

            {/* Inner White Card */}
            <div className="bg-[var(--color-canvas)] rounded-[24px] p-[var(--spacing-2xl)] md:p-[var(--spacing-3xl)] text-left shadow-sm">
              <h2 className="text-display-md text-[var(--color-ink)] mb-1">
                {activeTab === "link" ? "Shorten a long link" : "Create a QR Code"}
              </h2>
              <p className="text-body-sm text-[var(--color-mute)] mb-[var(--spacing-xl)]">
                No credit card required.
              </p>

              <div className="mb-[var(--spacing-lg)]">
                <label className="block text-body-sm-strong text-[var(--color-ink)] mb-[var(--spacing-sm)]">
                  {activeTab === "link" ? "Paste your long link here" : "Enter your URL for the QR Code"}
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/my-long-url"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  className="w-full bg-[var(--color-canvas)] text-[var(--color-ink)] border border-[var(--color-mute)] rounded-[var(--radius-md)] px-[var(--spacing-lg)] py-[var(--spacing-md)] text-body-md focus:outline-none focus:border-[var(--color-ink)] focus:ring-1 focus:ring-[var(--color-ink)] transition-colors"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-[var(--spacing-lg)]">
                <button
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-active)] text-[var(--color-on-primary)] px-[var(--spacing-xl)] py-[14px] rounded-[var(--radius-xl)] text-button-md transition-colors"
                >
                  {activeTab === "link" ? "Get your link for free" : "Generate QR Code"}
                  <ArrowRight size={18} />
                </button>
                
                {/* Mock G2 Rating */}
                <div className="flex items-center gap-2 text-[var(--color-mute)]">
                  <div className="w-8 h-8 rounded-full bg-[#ff492c] flex items-center justify-center text-white font-bold text-xs">
                    G2
                  </div>
                  <div className="flex flex-col">
                    <div className="flex text-[#ff492c] text-sm">
                      ★★★★★ <span className="text-[var(--color-mute)] text-xs ml-1">4.5/5</span>
                    </div>
                    <span className="text-caption text-[var(--color-mute)]">Loved by 900+ on G2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New sections from template.html */}
      <FeaturesSection />
      <MetricsSection />
      <TestimonialSection />
      <BottomCTA />
      
      {/* Footer */}
      <footer className="bg-[#031f39] text-white py-12 text-center text-body-sm">
        <p className="opacity-70">&copy; 2026 ShortenURL. All rights reserved.</p>
      </footer>
    </main>
  );
}
