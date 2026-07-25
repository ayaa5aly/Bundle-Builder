import { BuilderColumn } from "../builder/BuilderColumn";
import { ReviewColumn } from "../review/ReviewColumn";

/**
 * Top-level page layout: two columns on desktop (builder + sticky review),
 * stacked on smaller viewports. No business logic lives here — this
 * component is purely responsible for the responsive grid.
 */
export function BundleBuilderPage() {
  return (
    <main className="min-h-screen bg-[var(--color-brand-50)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-300 grid-cols-1 gap-6 lg:grid-cols-[1fr_420px] lg:items-start">
        <BuilderColumn />
        <ReviewColumn />
      </div>
    </main>
  );
}
