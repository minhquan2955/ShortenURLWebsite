export default function TestimonialSection() {
  return (
    <section className="bg-[var(--color-canvas)] py-[var(--spacing-3xl)]">
      <div className="max-w-[1200px] mx-auto px-[var(--spacing-xl)]">
        <h2 className="text-display-md text-[var(--color-ink)] mb-[var(--spacing-3xl)] text-center">
          What our customers are saying
        </h2>

        <div className="grid md:grid-cols-2 gap-[var(--spacing-xl)]">
          {/* Testimonial 1 */}
          <div className="bg-[var(--color-canvas-soft)] rounded-[var(--radius-xl)] p-[var(--spacing-2xl)] border border-[var(--color-mute)] opacity-90 hover:opacity-100 transition-opacity">
            <p className="text-body-lg text-[var(--color-ink)] mb-[var(--spacing-xl)] italic">
              "ShortenURL has completely transformed how we track our marketing links. The cross-channel analytics allow us to pinpoint exactly where our audience is engaging the most."
            </p>
            <div className="flex items-center gap-[var(--spacing-md)]">
              <div className="w-12 h-12 rounded-full bg-[var(--color-primary-pale)] flex items-center justify-center text-[var(--color-primary-deep)] font-bold text-lg">
                MP
              </div>
              <div>
                <h4 className="text-body-md-strong text-[var(--color-ink)]">Melody Park</h4>
                <p className="text-caption text-[var(--color-mute)]">Marketing Lead at Smalls</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-[var(--color-ink)] rounded-[var(--radius-xl)] p-[var(--spacing-2xl)] text-white opacity-90 hover:opacity-100 transition-opacity">
            <p className="text-body-lg text-[var(--color-canvas-soft)] mb-[var(--spacing-xl)] italic">
              "The ability to generate dynamic QR codes and short links in the same platform saves us countless hours. The API integration was incredibly seamless."
            </p>
            <div className="flex items-center gap-[var(--spacing-md)]">
              <div className="w-12 h-12 rounded-full bg-[#163300] flex items-center justify-center text-[var(--color-primary)] font-bold text-lg">
                PG
              </div>
              <div>
                <h4 className="text-body-md-strong text-white">Phil Gergen</h4>
                <p className="text-caption text-[var(--color-mute)]">Chief Information Officer at Koozie Group</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
