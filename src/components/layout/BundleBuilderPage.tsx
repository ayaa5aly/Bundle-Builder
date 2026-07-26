import { BuilderColumn } from "../builder/BuilderColumn";
import { ReviewColumn } from "../review/ReviewColumn";
import { BundleProvider } from "../../store/BundleContext";

/**
 * Top-level page layout: two columns on desktop (builder + sticky review),
 * stacked on smaller viewports. All state lives in BundleProvider so the
 * builder and the review panel always agree on quantities/variants/plan.
 */
export function BundleBuilderPage() {
  return (
    <BundleProvider>
      <main className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto mb-6 max-w-300">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Let's get started!
          </h1>
        </div>
        <div className="mx-auto grid max-w-300 grid-cols-1 gap-6 lg:grid-cols-[1fr_420px] lg:items-start">
          <BuilderColumn />
          <ReviewColumn />
        </div>
      </main>
    </BundleProvider>
  );
}
