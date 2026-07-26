import { BadgeCheck, Truck } from "lucide-react";
import { plans, products, useBundle } from "../../store/BundleContext";
import { computeTotals, formatUsd } from "../../utils/pricing";
import { Button } from "../ui/Button";
import { ReviewLine } from "./ReviewLine";

const SHIPPING_COMPARE = 5.99;

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
      {children}
    </p>
  );
}

export function ReviewColumn() {
  const { selections, planId } = useBundle();
  const totals = computeTotals(products, plans, selections, planId);

  const hasAnyLines =
    totals.cameraLines.length > 0 ||
    totals.sensorLines.length > 0 ||
    totals.accessoryLines.length > 0;

  return (
    <aside
      aria-label="Order summary"
      className="rounded-4xl border border-slate-200 bg-[var(--color-panel)] p-5 sm:p-6 lg:sticky lg:top-8"
    >
      <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
        Your security system
      </h2>
      <p className="mt-1.5 text-sm leading-6 text-slate-500">
        Review your personalized protection system designed to keep what
        matters most safe.
      </p>

      <div className="mt-6 divide-y divide-slate-200/70 rounded-3xl bg-white p-4 sm:p-5">
        {!hasAnyLines && (
          <p className="py-2.5 text-sm text-slate-400">
            Choose a camera to start building your system.
          </p>
        )}

        {totals.cameraLines.length > 0 && (
          <div className="py-1 first:pt-0">
            <SectionLabel>Cameras</SectionLabel>
            <div className="divide-y divide-slate-100">
              {totals.cameraLines.map((line) => (
                <ReviewLine key={line.product.id} {...line} />
              ))}
            </div>
          </div>
        )}

        {totals.sensorLines.length > 0 && (
          <div className="py-1">
            <SectionLabel>Sensors</SectionLabel>
            <div className="divide-y divide-slate-100">
              {totals.sensorLines.map((line) => (
                <ReviewLine key={line.product.id} {...line} />
              ))}
            </div>
          </div>
        )}

        {totals.accessoryLines.length > 0 && (
          <div className="py-1">
            <SectionLabel>Accessories</SectionLabel>
            <div className="divide-y divide-slate-100">
              {totals.accessoryLines.map((line) => (
                <ReviewLine key={line.product.id} {...line} />
              ))}
            </div>
          </div>
        )}

        {totals.plan && (
          <div className="py-3">
            <SectionLabel>Home Monitoring Plan</SectionLabel>
            <div className="mt-1.5 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-900">
                {totals.plan.name}
              </p>
              <PlanPrice
                price={totals.plan.price}
                compareAtPrice={totals.plan.compareAtPrice}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 py-3">
          <span className="flex items-center gap-2 text-sm font-medium text-slate-900">
            <Truck size={16} className="text-slate-400" aria-hidden="true" />
            Fast Shipping
          </span>
          <span className="inline-flex items-baseline gap-1.5 text-sm font-semibold">
            <span className="text-slate-400 line-through">
              {formatUsd(SHIPPING_COMPARE)}
            </span>
            <span className="text-[var(--color-savings)]">FREE</span>
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full border-2 border-dashed border-brand-500 bg-white text-brand-600">
          <BadgeCheck size={18} aria-hidden="true" />
          <span className="text-xs font-bold leading-none">100%</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900">
            30-day hassle-free returns
          </p>
          <p className="mt-0.5 text-xs leading-5 text-slate-500">
            If you're not totally in love with the product, we will refund
            you 100%.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="inline-flex items-center rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-600">
          as low as {formatUsd(totals.financingPerMonth)}/mo
        </span>
        <span className="inline-flex items-baseline gap-2">
          {totals.dueTodayCompare > totals.dueToday && (
            <span className="text-base text-slate-400 line-through">
              {formatUsd(totals.dueTodayCompare)}
            </span>
          )}
          <span className="text-2xl font-bold text-slate-900">
            {formatUsd(totals.dueToday)}
          </span>
        </span>
      </div>

      {totals.savings > 0 && (
        <p className="mt-2 text-sm font-semibold text-[var(--color-savings)]">
          Congrats! You're saving {formatUsd(totals.savings)} on your
          security bundle!
        </p>
      )}

      <Button fullWidth className="mt-5 rounded-full py-3.5 text-base">
        Checkout
      </Button>

      <div className="mt-3 text-center">
        <a
          href="#"
          className="text-sm font-medium text-slate-500 underline underline-offset-2 hover:text-slate-700"
        >
          Save my system for later
        </a>
      </div>
    </aside>
  );
}

function PlanPrice({
  price,
  compareAtPrice,
}: {
  price: number;
  compareAtPrice?: number;
}) {
  const hasDiscount = compareAtPrice !== undefined && compareAtPrice > price;
  return (
    <span className="inline-flex items-baseline gap-1.5 text-sm font-semibold">
      {hasDiscount && (
        <span className="text-slate-400 line-through">
          {formatUsd(compareAtPrice)}/mo
        </span>
      )}
      <span className={hasDiscount ? "text-[var(--color-discount)]" : "text-slate-900"}>
        {formatUsd(price)}/mo
      </span>
    </span>
  );
}
