import type { ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AccordionStepProps {
  stepIndex: number;
  totalSteps: number;
  icon: ReactNode;
  title: string;
  selectedCount: number;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

/**
 * One step of the builder. Closed state is a slim bordered row (icon +
 * "STEP N OF 4" + title, "N selected" + chevron on the right). Open state
 * expands into the full lavender panel that holds the step's content.
 */
export function AccordionStep({
  stepIndex,
  totalSteps,
  icon,
  title,
  selectedCount,
  isOpen,
  onToggle,
  children,
}: AccordionStepProps) {
  const panelId = `builder-step-panel-${stepIndex}`;
  const headerId = `builder-step-header-${stepIndex}`;

  return (
    <section
      className={`overflow-hidden rounded-3xl border transition-colors ${
        isOpen
          ? "border-slate-200 bg-[var(--color-brand-50)]"
          : "border-slate-200 bg-white"
      }`}
    >
      <h3 id={headerId} className="m-0">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-6"
        >
          <span className="flex items-center gap-3">
            <span
              className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-sm ${
                isOpen
                  ? "bg-white text-brand-600"
                  : "bg-[var(--color-brand-50)] text-brand-600"
              }`}
            >
              {icon}
            </span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Step {stepIndex} of {totalSteps}
              </span>
              <span className="block text-lg font-semibold text-slate-900 sm:text-2xl">
                {title}
              </span>
            </span>
          </span>

          <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-brand-600">
            <span className="hidden sm:inline">{selectedCount} selected</span>
            <span className="sm:hidden">{selectedCount}</span>
            {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </span>
        </button>
      </h3>

      {isOpen && (
        <div id={panelId} role="region" aria-labelledby={headerId} className="px-4 pb-6 sm:px-6">
          {children}
        </div>
      )}
    </section>
  );
}
