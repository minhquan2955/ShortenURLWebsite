"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-[var(--spacing-xl)] py-[var(--spacing-md)] bg-[var(--color-ink)]/95 backdrop-blur-md text-white border-b border-white/10 shadow-sm transition-all">
      <div className="flex items-center gap-[var(--spacing-xl)]">
        {/* Logo */}
        <Link href="/" className="text-[var(--color-primary)] font-black text-2xl tracking-tighter hover:opacity-90 transition-opacity">
          ShortenURL
        </Link>
        <nav className="hidden md:flex gap-[var(--spacing-lg)] text-body-sm-strong text-[var(--color-canvas-soft)]">
          <Link href="#" className="hover:text-[var(--color-primary)] transition-colors">
            Platform
          </Link>
          <Link href="#" className="hover:text-[var(--color-primary)] transition-colors">
            Solutions
          </Link>
          <Link href="#" className="hover:text-[var(--color-primary)] transition-colors">
            Pricing
          </Link>
          <Link href="#" className="hover:text-[var(--color-primary)] transition-colors">
            Resources
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-[var(--spacing-md)]">
        <Link
          href="/login"
          className="text-body-sm-strong text-[var(--color-canvas-soft)] hover:text-[var(--color-primary)] transition-colors"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="hidden md:inline-flex items-center justify-center bg-[var(--color-canvas)] text-[var(--color-ink)] px-[var(--spacing-lg)] py-[var(--spacing-sm)] rounded-[var(--radius-pill)] text-body-sm-strong hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] transition-colors"
        >
          Sign up Free
        </Link>
      </div>
    </header>
  );
}
