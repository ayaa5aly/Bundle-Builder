/**
 * Domain types — no React, no UI concerns. Describes the shape of the
 * catalog (static, from JSON).
 */

export type StepId = "cameras" | "plan" | "sensors" | "accessories";

export interface Variant {
  id: string; // stable id, e.g. "white" — never an array index
  label: string; // "White"
  swatch: string; // hex color for the swatch dot
}

export interface Product {
  id: string;
  stepId: StepId;
  layout: "grid" | "row"; // grid = standard card, row = wide card (Battery Cam Pro)
  name: string;
  description?: string;
  learnMoreUrl?: string;
  image: string;
  badge?: string; // "Save 22%" — absent if no badge
  compareAtPrice?: number; // absent => no strikethrough shown
  price: number; // per-unit active price
  variants?: Variant[]; // absent/empty => no color selector rendered
  isRequired?: boolean; // true => quantity floor is 1, cannot be removed
}

export const DEFAULT_VARIANT_ID = "default";
