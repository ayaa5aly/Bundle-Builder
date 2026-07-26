import type { LineItem } from "../../utils/pricing";
import { useBundle } from "../../store/BundleContext";
import { PriceDisplay } from "../ui/PriceDisplay";
import { QuantityStepper } from "../ui/QuantityStepper";

export function ReviewLine({ product, quantity, lineTotal, lineCompareTotal }: LineItem) {
  const { setQuantity } = useBundle();

  return (
    <div className="py-2.5">
      <p className="text-sm font-medium text-slate-900">
        {product.name}
        {product.isRequired && (
          <span className="text-slate-400"> (Required)</span>
        )}
      </p>
      <div className="mt-1.5 flex items-center justify-between gap-3">
        <QuantityStepper
          label={`${product.name} quantity`}
          value={quantity}
          onIncrement={() => setQuantity(product.id, quantity + 1)}
          onDecrement={() => setQuantity(product.id, quantity - 1)}
          decrementDisabled={product.isRequired && quantity <= 1}
          size="sm"
        />
        <PriceDisplay
          price={lineTotal}
          compareAtPrice={
            lineCompareTotal > lineTotal ? lineCompareTotal : undefined
          }
          size="sm"
        />
      </div>
    </div>
  );
}
