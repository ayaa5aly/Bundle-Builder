import { useState } from "react";
import { Camera, LayoutGrid, Radar, Shield } from "lucide-react";
import type { ReactNode } from "react";
import type { Product, StepId } from "../../domain/types";
import { plans, products, useBundle } from "../../store/BundleContext";
import { Button } from "../ui/Button";
import { AccordionStep } from "../ui/Accordion";
import { ProductCard } from "./ProductCard";
import { PlanCard } from "./PlanCard";

const GRID_COLS_BY_COUNT: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

/**
 * "grid" products sit in a responsive card grid (capped at 4 columns —
 * the widest camera step). "row" products (e.g. Wyze Battery Cam Pro) are
 * wide cards that don't fit a column track, so they render full-width
 * underneath the grid instead of being squeezed into it.
 */
function StepProductGrid({ products: stepProducts }: { products: Product[] }) {
  const gridProducts = stepProducts.filter((p) => p.layout === "grid");
  const rowProducts = stepProducts.filter((p) => p.layout === "row");
  const lgCols =
    GRID_COLS_BY_COUNT[Math.min(gridProducts.length, 4)] ?? "lg:grid-cols-4";

  return (
    <div className="flex flex-col gap-4">
      {gridProducts.length > 0 && (
        <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${lgCols}`}>
          {gridProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      {rowProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

interface StepConfig {
  id: StepId;
  title: string;
  icon: ReactNode;
  nextLabel?: string;
}

const STEPS: StepConfig[] = [
  {
    id: "cameras",
    title: "Choose your cameras",
    icon: <Camera size={18} />,
    nextLabel: "Next: Choose your plan",
  },
  {
    id: "plan",
    title: "Choose your plan",
    icon: <Shield size={18} />,
    nextLabel: "Next: Choose your sensors",
  },
  {
    id: "sensors",
    title: "Choose your sensors",
    icon: <Radar size={18} />,
    nextLabel: "Next: Add extra protection",
  },
  {
    id: "accessories",
    title: "Add extra protection",
    icon: <LayoutGrid size={18} />,
  },
];

/**
 * Each step can be independently expanded or collapsed — matching the
 * design, where more than one step can be open at once. Only "cameras"
 * starts open. Pressing a step's "Next: ..." button collapses that step
 * and opens the following one.
 */
export function BuilderColumn() {
  const [openSteps, setOpenSteps] = useState<Set<StepId>>(
    () => new Set<StepId>(["cameras"]),
  );
  const { planId, selectPlan, selectedCountForStep } = useBundle();

  function toggleStep(id: StepId) {
    setOpenSteps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function advanceTo(currentId: StepId, nextId: StepId) {
    setOpenSteps((prev) => {
      const next = new Set(prev);
      next.delete(currentId);
      next.add(nextId);
      return next;
    });
  }

  return (
    <div aria-label="Bundle builder" className="flex flex-col gap-4">
      {STEPS.map((step, index) => {
        const stepProducts = products.filter((p) => p.stepId === step.id);
        const isOpen = openSteps.has(step.id);
        const nextStep = STEPS[index + 1];

        return (
          <AccordionStep
            key={step.id}
            stepIndex={index + 1}
            totalSteps={STEPS.length}
            icon={step.icon}
            title={step.title}
            selectedCount={selectedCountForStep(step.id)}
            isOpen={isOpen}
            onToggle={() => toggleStep(step.id)}
          >
            {step.id === "plan" ? (
              <div
                role="radiogroup"
                aria-label="Choose your plan"
                className="grid grid-cols-1 gap-4 sm:grid-cols-3"
              >
                {plans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    isSelected={plan.id === planId}
                    onSelect={selectPlan}
                  />
                ))}
              </div>
            ) : (
              <StepProductGrid products={stepProducts} />
            )}

            {step.nextLabel && nextStep && (
              <div className="mt-6 flex justify-center">
                <Button
                  className="rounded-full px-8 py-3 text-sm font-semibold"
                  onClick={() => advanceTo(step.id, nextStep.id)}
                >
                  {step.nextLabel}
                </Button>
              </div>
            )}
          </AccordionStep>
        );
      })}
    </div>
  );
}
