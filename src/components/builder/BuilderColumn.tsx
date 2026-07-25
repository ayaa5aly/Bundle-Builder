import { useCallback, useState } from "react";
import { Camera, ChevronUp } from "lucide-react";
import productsData from "../../data/products.json";
import type { Product } from "../../domain/types";
import { Button } from "../ui/Button";
import { ProductCard } from "./ProductCard";

const products = productsData as Product[];
const cameraProducts = products.filter((p) => p.stepId === "cameras");

export function BuilderColumn() {
  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, boolean>
  >({});

  const selectedCount = Object.values(selectedProducts).filter(Boolean).length;

  const handleSelectedChange = useCallback(
    (productId: string, selected: boolean) => {
      setSelectedProducts((prev) => ({
        ...prev,
        [productId]: selected,
      }));
    },
    [],
  );

  return (
    <section
      aria-label="Bundle builder"
      className="rounded-4xl border border-slate-200 bg-[var(--color-brand-50)] p-4 shadow-sm"
    >
      <div className="mb-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm">
            <Camera size={18} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Step 1 of 4
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Choose your cameras
            </h2>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-brand-600">
          <span>{selectedCount} selected</span>
          <ChevronUp size={12} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {cameraProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelectedChange={handleSelectedChange}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Button className="rounded-full px-8 py-3 text-sm font-semibold">
          Next: Choose your sensors
        </Button>
      </div>
    </section>
  );
}
