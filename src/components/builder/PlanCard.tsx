import { Check } from "lucide-react";
import type { Plan } from "../../domain/types";
import { Badge } from "../ui/Badge";
import { PriceDisplay } from "../ui/PriceDisplay";

interface PlanCardProps {
  plan: Plan;
  isSelected: boolean;
  onSelect: (planId: string) => void;
}

export function PlanCard({ plan, isSelected, onSelect }: PlanCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={() => onSelect(plan.id)}
      className={`flex h-full w-full flex-col rounded-3xl border bg-white p-5 text-left shadow-sm transition duration-200 ${
        isSelected ? "border-brand-500 ring-1 ring-brand-500" : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        {plan.badge ? (
          <Badge tone="discount">{plan.badge}</Badge>
        ) : (
          <span />
        )}
        <span
          aria-hidden="true"
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
            isSelected
              ? "border-brand-600 bg-brand-600 text-white"
              : "border-slate-300 bg-white"
          }`}
        >
          {isSelected && <Check size={14} strokeWidth={3} />}
        </span>
      </div>

      <h3 className="mt-3 text-base font-semibold text-slate-900">{plan.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
        {plan.description}
      </p>

      <ul className="mt-4 space-y-1.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
            <Check
              size={14}
              className="mt-1 shrink-0 text-brand-600"
              aria-hidden="true"
            />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-baseline gap-1.5">
        <PriceDisplay price={plan.price} compareAtPrice={plan.compareAtPrice} />
        <span className="text-sm font-medium text-slate-500">/mo</span>
      </div>
    </button>
  );
}
