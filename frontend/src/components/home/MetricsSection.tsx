export default function MetricsSection() {
  return (
    <section className="bg-[var(--color-canvas-soft)] py-[var(--spacing-3xl)]">
      <div className="max-w-[1200px] mx-auto px-[var(--spacing-xl)] text-center">
        <h2 className="text-display-md text-[var(--color-ink)] mb-[var(--spacing-3xl)] max-w-[768px] mx-auto">
          Adopted and loved by millions of users for over a decade
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--spacing-xl)]">
          {/* Metric 1 */}
          <div className="flex flex-col items-center">
            <div className="text-display-lg font-black text-[var(--color-primary)] mb-[var(--spacing-xs)]">
              500k+
            </div>
            <div className="text-body-sm-strong text-[var(--color-body)] uppercase tracking-wider">
              Global Paying Customers
            </div>
          </div>

          {/* Metric 2 */}
          <div className="flex flex-col items-center">
            <div className="text-display-lg font-black text-[var(--color-primary)] mb-[var(--spacing-xs)]">
              5.7M
            </div>
            <div className="text-body-sm-strong text-[var(--color-body)] uppercase tracking-wider">
              Monthly Active Users
            </div>
          </div>

          {/* Metric 3 */}
          <div className="flex flex-col items-center">
            <div className="text-display-lg font-black text-[var(--color-primary)] mb-[var(--spacing-xs)]">
              256M
            </div>
            <div className="text-body-sm-strong text-[var(--color-body)] uppercase tracking-wider">
              Links & QR Codes Created
            </div>
          </div>

          {/* Metric 4 */}
          <div className="flex flex-col items-center">
            <div className="text-display-lg font-black text-[var(--color-primary)] mb-[var(--spacing-xs)]">
              10B+
            </div>
            <div className="text-body-sm-strong text-[var(--color-body)] uppercase tracking-wider">
              Clicks & Scans Tracked
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
