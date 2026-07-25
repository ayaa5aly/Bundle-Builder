import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  /** e.g. "Wyze Cam v4 quantity" — read by screen readers, not shown visually. */
  label: string;
  decrementDisabled?: boolean;
  size?: "sm" | "md";
}

/**
 * Fully controlled: this component holds no state of its own.
 * The same stepper is used on the product card and the review-panel
 * line for the same item — both must read from and write to the
 * same source of truth (the reducer), so state cannot live here.
 */
export function QuantityStepper({
  value,
  onIncrement,
  onDecrement,
  label,
  decrementDisabled = false,
  size = "md",
}: QuantityStepperProps) {
  const isSmall = size === "sm";
  const buttonSize = isSmall ? "h-8 w-8" : "h-10 w-10";
  const iconSize = isSmall ? 12 : 14;
  const textSize = isSmall ? "text-sm" : "text-base";

  return (
    <div
      role="group"
      aria-label={label}
      className={`inline-flex items-center gap-2 ${textSize} font-medium text-slate-700`}
    >
      <button
        type="button"
        onClick={onDecrement}
        disabled={decrementDisabled}
        aria-label={`Decrease ${label}`}
        className={`${buttonSize} flex items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-500 transition-colors hover:enabled:border-slate-400 hover:enabled:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <Minus size={iconSize} aria-hidden="true" />
      </button>

      <span aria-live="polite" className="min-w-6 text-center tabular-nums">
        {value}
      </span>

      <button
        type="button"
        onClick={onIncrement}
        aria-label={`Increase ${label}`}
        className={`${buttonSize} flex items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-500 transition-colors hover:border-slate-400 hover:bg-slate-50`}
      >
        <Plus size={iconSize} aria-hidden="true" />
      </button>
    </div>
  );
}
