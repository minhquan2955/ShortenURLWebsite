import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function BottomCTA() {
  return (
    <section className="bg-[var(--color-ink)] text-[var(--color-canvas-soft)] py-[var(--spacing-3xl)] text-center relative overflow-hidden">
      {/* Decorative stars */}
      <div className="absolute top-10 left-10 opacity-10">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5l-10 14M22 12H2M19 17L5 7" /></svg>
      </div>
      <div className="absolute bottom-10 right-10 opacity-10">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5l-10 14M22 12H2M19 17L5 7" /></svg>
      </div>

      <div className="max-w-[800px] mx-auto px-[var(--spacing-xl)] relative z-10">
        <h2 className="text-display-xl text-white mb-[var(--spacing-lg)]">
          More than a link shortener
        </h2>
        <p className="text-body-lg text-[var(--color-canvas-soft)] mb-[var(--spacing-2xl)]">
          Knowing how your clicks and scans are performing should be as easy as making them. Track, analyze, and optimize all your connections in one place.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-active)] text-[var(--color-on-primary)] px-[var(--spacing-xl)] py-[14px] rounded-[var(--radius-xl)] text-button-md transition-colors"
        >
          Get started for free
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
