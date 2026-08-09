import Link from "next/link";
import { Link2, QrCode, LineChart } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="bg-[var(--color-canvas)] py-[var(--spacing-3xl)]">
      <div className="max-w-[1200px] mx-auto px-[var(--spacing-xl)]">
        <div className="text-center mb-[var(--spacing-3xl)]">
          <p className="text-body-sm-strong uppercase tracking-wider text-[var(--color-primary)] mb-[var(--spacing-sm)]">
            See what works
          </p>
          <h2 className="text-display-md text-[var(--color-ink)] mb-[var(--spacing-lg)]">
            Link your marketing with ShortenURL
          </h2>
          <p className="text-body-lg text-[var(--color-body)] max-w-[768px] mx-auto">
            Create branded links and QR Codes in seconds, track every click and scan, and get clear cross-channel analytics so you can see what’s driving results.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-[var(--spacing-xl)]">
          {/* Feature 1 */}
          <div className="bg-[var(--color-canvas-soft)] rounded-[var(--radius-xl)] p-[var(--spacing-xl)] flex flex-col h-full border border-[var(--color-canvas-soft)] hover:border-[var(--color-primary)] transition-colors">
            <div className="w-12 h-12 rounded-full bg-[var(--color-canvas)] flex items-center justify-center mb-[var(--spacing-lg)] text-[var(--color-ink)]">
              <Link2 size={24} />
            </div>
            <h3 className="text-display-xs text-[var(--color-ink)] mb-[var(--spacing-sm)]">
              URL Shortening
            </h3>
            <p className="text-body-md text-[var(--color-body)] flex-1 mb-[var(--spacing-xl)]">
              Transform long, ugly links into clean, memorable URLs. Perfect for social media, SMS, and email marketing.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/register" className="text-button-md text-[var(--color-ink)] hover:text-[var(--color-primary)] underline decoration-2 underline-offset-4">
                Get started for free
              </Link>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-[var(--color-primary-pale)] rounded-[var(--radius-xl)] p-[var(--spacing-xl)] flex flex-col h-full border border-[var(--color-primary-pale)] hover:border-[var(--color-primary)] transition-colors">
            <div className="w-12 h-12 rounded-full bg-[var(--color-canvas)] flex items-center justify-center mb-[var(--spacing-lg)] text-[var(--color-primary)]">
              <QrCode size={24} />
            </div>
            <h3 className="text-display-xs text-[var(--color-ink)] mb-[var(--spacing-sm)]">
              QR Codes
            </h3>
            <p className="text-body-md text-[var(--color-body)] flex-1 mb-[var(--spacing-xl)]">
              Generate dynamic QR codes for your shortened links. Bridge the gap between offline and online marketing seamlessly.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/register" className="text-button-md text-[var(--color-ink)] hover:text-[var(--color-primary)] underline decoration-2 underline-offset-4">
                Get started for free
              </Link>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-[var(--color-ink)] rounded-[var(--radius-xl)] p-[var(--spacing-xl)] flex flex-col h-full border border-[var(--color-ink)] hover:border-[var(--color-primary)] transition-colors">
            <div className="w-12 h-12 rounded-full bg-[var(--color-canvas)] flex items-center justify-center mb-[var(--spacing-lg)] text-[var(--color-primary)]">
              <LineChart size={24} />
            </div>
            <h3 className="text-display-xs text-[var(--color-primary)] mb-[var(--spacing-sm)]">
              Analytics
            </h3>
            <p className="text-body-md text-[var(--color-canvas-soft)] flex-1 mb-[var(--spacing-xl)]">
              Get real-time insights into your audience. Track locations, devices, and referrers to optimize your campaigns.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/register" className="text-button-md text-[var(--color-primary)] hover:text-white underline decoration-2 underline-offset-4">
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
