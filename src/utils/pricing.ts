import type { Plan, Product } from "../domain/types";

export function formatUsd(value: number): string {
  return `$${value.toFixed(2)}`;
}

export interface LineItem {
  product: Product;
  quantity: number;
  lineTotal: number;
  lineCompareTotal: number;
}

export interface BundleTotals {
  cameraLines: LineItem[];
  sensorLines: LineItem[];
  accessoryLines: LineItem[];
  plan: Plan | undefined;
  oneTimeTotal: number;
  oneTimeCompareTotal: number;
  dueToday: number;
  dueTodayCompare: number;
  savings: number;
  financingPerMonth: number;
}

function toLineItems(
  products: Product[],
  selections: Record<string, { variantId: string; quantity: number }>,
  stepId: Product["stepId"],
): LineItem[] {
  return products
    .filter((p) => p.stepId === stepId)
    .map((product) => ({
      product,
      quantity: selections[product.id]?.quantity ?? 0,
    }))
    .filter((entry) => entry.quantity > 0)
    .map(({ product, quantity }) => ({
      product,
      quantity,
      lineTotal: product.price * quantity,
      lineCompareTotal: (product.compareAtPrice ?? product.price) * quantity,
    }));
}

export function computeTotals(
  products: Product[],
  plans: Plan[],
  selections: Record<string, { variantId: string; quantity: number }>,
  planId: string,
): BundleTotals {
  const cameraLines = toLineItems(products, selections, "cameras");
  const sensorLines = toLineItems(products, selections, "sensors");
  const accessoryLines = toLineItems(products, selections, "accessories");
  const plan = plans.find((p) => p.id === planId);

  const allLines = [...cameraLines, ...sensorLines, ...accessoryLines];
  const oneTimeTotal = allLines.reduce((sum, l) => sum + l.lineTotal, 0);
  const oneTimeCompareTotal = allLines.reduce(
    (sum, l) => sum + l.lineCompareTotal,
    0,
  );

  const planSale = plan?.price ?? 0;
  const planCompare = plan?.compareAtPrice ?? plan?.price ?? 0;

  const dueToday = oneTimeTotal + planSale;
  const dueTodayCompare = oneTimeCompareTotal + planCompare;
  const savings = Math.max(0, dueTodayCompare - dueToday);
  const financingPerMonth = dueToday / 12;

  return {
    cameraLines,
    sensorLines,
    accessoryLines,
    plan,
    oneTimeTotal,
    oneTimeCompareTotal,
    dueToday,
    dueTodayCompare,
    savings,
    financingPerMonth,
  };
}
