import { useState } from "react";
import { ImageOff } from "lucide-react";
import type { Product } from "../../domain/types";
import { useBundle } from "../../store/BundleContext";
import { Badge } from "../ui/Badge";
import { PriceDisplay } from "../ui/PriceDisplay";
import { QuantityStepper } from "../ui/QuantityStepper";
import { VariantSwatchSelector } from "../ui/VariantSwatchSelector";

interface ProductCardProps {
  product: Product;
}

/**
 * Reads and writes quantity/variant through the shared bundle store, so the
 * same values shown here are exactly what the review panel totals up.
 */
export function ProductCard({ product }: ProductCardProps) {
  const { getQuantity, getVariant, setQuantity, setVariant } = useBundle();
  const hasVariants = Boolean(product.variants && product.variants.length > 0);
  const [imageError, setImageError] = useState(false);

  const activeVariantId = getVariant(product.id);
  const activeQuantity = getQuantity(product.id);
  const isSelected = activeQuantity > 0;
  const isRow = product.layout === "row";

  return (
    <div
      className={`rounded-3xl border bg-white p-4 shadow-sm transition duration-200 ${
        isSelected ? "border-brand-500" : "border-slate-200"
      } ${isRow ? "flex gap-4" : ""}`}
    >
      {product.badge && (
        <div className={isRow ? "shrink-0" : "mb-4"}>
          <Badge tone="discount">{product.badge}</Badge>
        </div>
      )}

      <div className={isRow ? "flex flex-1 gap-4" : ""}>
        <div
          className={`flex items-center justify-center overflow-hidden rounded-[20px] bg-slate-50 text-slate-300 ${
            isRow ? "h-[100px] w-[100px] shrink-0" : "mb-4 h-[100px] w-full"
          }`}
        >
          {product.image && !imageError ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              onError={() => setImageError(true)}
              className="h-full w-full object-contain p-2"
            />
          ) : (
            <ImageOff size={24} aria-hidden="true" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold leading-6 text-slate-900">
              {product.name}
            </h3>
            {product.isRequired && (
              <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-brand-600">
                Required
              </span>
            )}
          </div>

          {product.description && (
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {product.description}{" "}
              {product.learnMoreUrl && (
                <a
                  href={product.learnMoreUrl}
                  className="text-brand-600 font-semibold hover:underline"
                >
                  Learn More
                </a>
              )}
            </p>
          )}

          {hasVariants && (
            <div className="mt-4">
              <VariantSwatchSelector
                variants={product.variants!}
                activeVariantId={activeVariantId}
                onSelect={(variantId) => setVariant(product.id, variantId)}
                productName={product.name}
              />
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-3">
            <QuantityStepper
              label={`${product.name} quantity`}
              value={activeQuantity}
              onIncrement={() => setQuantity(product.id, activeQuantity + 1)}
              onDecrement={() => setQuantity(product.id, activeQuantity - 1)}
              decrementDisabled={product.isRequired && activeQuantity <= 1}
              size="sm"
            />
            <PriceDisplay
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
