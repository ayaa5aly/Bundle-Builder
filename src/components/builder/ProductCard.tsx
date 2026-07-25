import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";
import type { Product } from "../../domain/types";
import { DEFAULT_VARIANT_ID } from "../../domain/types";
import { Badge } from "../ui/Badge";
import { PriceDisplay } from "../ui/PriceDisplay";
import { QuantityStepper } from "../ui/QuantityStepper";
import { VariantSwatchSelector } from "../ui/VariantSwatchSelector";

interface ProductCardProps {
  product: Product;
  onSelectedChange?: (productId: string, selected: boolean) => void;
}

/**
 * TEMPORARY (Step 6): quantity state lives locally per card via useState,
 * shaped exactly like the future reducer slice (activeVariantId + a
 * quantities map keyed by variant id) so swapping in real dispatch calls
 * later is a mechanical change, not a rewrite. This local state will be
 * removed once the store lands — the card will take value/onChange props
 * instead.
 */
export function ProductCard({ product, onSelectedChange }: ProductCardProps) {
  const hasVariants = Boolean(product.variants && product.variants.length > 0);
  const firstVariantId = product.variants?.[0]?.id ?? DEFAULT_VARIANT_ID;

  const [activeVariantId, setActiveVariantId] = useState(firstVariantId);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [product.image]);

  const activeQuantity = quantities[activeVariantId] ?? 0;
  const isSelected = activeQuantity > 0;
  const isRow = product.layout === "row";

  useEffect(() => {
    if (onSelectedChange) {
      onSelectedChange(product.id, isSelected);
    }
  }, [isSelected, onSelectedChange, product.id]);

  function setActiveQuantity(next: number) {
    setQuantities((prev) => ({
      ...prev,
      [activeVariantId]: Math.max(0, next),
    }));
  }

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
              className="h-full w-full object-contain"
            />
          ) : (
            <ImageOff size={24} aria-hidden="true" />
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-base font-semibold leading-6 text-slate-900">
            {product.name}
          </h3>

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
                onSelect={setActiveVariantId}
                productName={product.name}
              />
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-3">
            <QuantityStepper
              label={`${product.name} quantity`}
              value={activeQuantity}
              onIncrement={() => setActiveQuantity(activeQuantity + 1)}
              onDecrement={() => setActiveQuantity(activeQuantity - 1)}
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
