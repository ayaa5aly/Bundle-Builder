import type { Variant } from "../../domain/types";

interface VariantSwatchSelectorProps {
  variants: Variant[];
  activeVariantId: string;
  onSelect: (variantId: string) => void;
  productName: string;
}

/**
 * Per the assignment: selected-chip styling isn't the focus yet — what
 * matters is that selecting a chip makes it the "active" variant and
 * that this flows through to the quantity stepper and review panel.
 * A visible active state is still included for basic usability/a11y,
 * kept intentionally simple.
 */
export function VariantSwatchSelector({
  variants,
  activeVariantId,
  onSelect,
  productName,
}: VariantSwatchSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label={`${productName} color`}
      className="flex flex-wrap gap-2"
    >
      {variants.map((variant) => {
        const isActive = variant.id === activeVariantId;
        return (
          <button
            key={variant.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onSelect(variant.id)}
            className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
              isActive
                ? "border-brand-500 bg-brand-50 text-slate-900"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full border border-black/10"
              style={{ backgroundColor: variant.swatch }}
            />
            {variant.label}
          </button>
        );
      })}
    </div>
  );
}
