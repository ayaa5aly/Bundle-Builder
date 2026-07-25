interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number;
  size?: "sm" | "md";
}

function formatUsd(value: number): string {
  return `$${value.toFixed(2)}`;
}

/**
 * compareAtPrice is optional, not 0 — its absence means "no discount to
 * show", so we only render the struck-through price when it's actually set.
 */
export function PriceDisplay({
  price,
  compareAtPrice,
  size = "md",
}: PriceDisplayProps) {
  const hasDiscount = compareAtPrice !== undefined && compareAtPrice > price;
  const priceTextSize = size === "sm" ? "text-sm" : "text-base";

  return (
    <span
      className={`inline-flex items-baseline gap-1.5 font-semibold ${priceTextSize}`}
    >
      {hasDiscount && (
        <span className="text-slate-400 line-through">
          {formatUsd(compareAtPrice)}
        </span>
      )}
      <span
        className={
          hasDiscount ? "text-[var(--color-discount)]" : "text-slate-900"
        }
      >
        {formatUsd(price)}
      </span>
    </span>
  );
}
