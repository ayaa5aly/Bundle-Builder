import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import productsData from "../data/products.json";
import plansData from "../data/plans.json";
import type { Plan, Product } from "../domain/types";
import { DEFAULT_VARIANT_ID } from "../domain/types";

const products = productsData as Product[];
const plans = plansData as Plan[];

interface Selection {
  variantId: string;
  quantity: number;
}

interface BundleState {
  selections: Record<string, Selection>;
  planId: string;
}

type Action =
  | { type: "SET_QUANTITY"; productId: string; quantity: number }
  | { type: "SET_VARIANT"; productId: string; variantId: string }
  | { type: "SELECT_PLAN"; planId: string };

function initialSelectionFor(product: Product): Selection {
  return {
    variantId: product.variants?.[0]?.id ?? DEFAULT_VARIANT_ID,
    quantity: product.isRequired ? 1 : 0,
  };
}

/**
 * Seeded to mirror the reviewed design mock: a couple of cameras, both
 * sensors, two microSD cards, and the Unlimited plan pre-selected — so the
 * review panel matches the Figma reference the moment the app loads.
 */
const DEMO_QUANTITIES: Record<string, number> = {
  "wyze-cam-v4": 1,
  "wyze-cam-pan-v3": 2,
  "wyze-sense-motion-sensor": 2,
  "wyze-sense-hub": 1,
  "wyze-microsd-card": 2,
};

function buildInitialState(): BundleState {
  const selections: Record<string, Selection> = {};
  for (const product of products) {
    const base = initialSelectionFor(product);
    selections[product.id] = {
      ...base,
      quantity: DEMO_QUANTITIES[product.id] ?? base.quantity,
    };
  }
  return { selections, planId: "cam-unlimited" };
}

function reducer(state: BundleState, action: Action): BundleState {
  switch (action.type) {
    case "SET_QUANTITY": {
      const current = state.selections[action.productId];
      const product = products.find((p) => p.id === action.productId);
      const floor = product?.isRequired ? 1 : 0;
      const quantity = Math.max(floor, action.quantity);
      return {
        ...state,
        selections: {
          ...state.selections,
          [action.productId]: {
            variantId: current?.variantId ?? DEFAULT_VARIANT_ID,
            quantity,
          },
        },
      };
    }
    case "SET_VARIANT": {
      const current = state.selections[action.productId];
      return {
        ...state,
        selections: {
          ...state.selections,
          [action.productId]: {
            variantId: action.variantId,
            quantity: current?.quantity ?? 0,
          },
        },
      };
    }
    case "SELECT_PLAN":
      return { ...state, planId: action.planId };
    default:
      return state;
  }
}

interface BundleContextValue {
  selections: Record<string, Selection>;
  planId: string;
  getQuantity: (productId: string) => number;
  getVariant: (productId: string) => string;
  setQuantity: (productId: string, quantity: number) => void;
  setVariant: (productId: string, variantId: string) => void;
  selectPlan: (planId: string) => void;
  selectedCountForStep: (stepId: Product["stepId"]) => number;
}

const BundleContext = createContext<BundleContextValue | null>(null);

export function BundleProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitialState);

  const getQuantity = useCallback(
    (productId: string) => state.selections[productId]?.quantity ?? 0,
    [state.selections],
  );

  const getVariant = useCallback(
    (productId: string) =>
      state.selections[productId]?.variantId ?? DEFAULT_VARIANT_ID,
    [state.selections],
  );

  const setQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: "SET_QUANTITY", productId, quantity });
  }, []);

  const setVariant = useCallback((productId: string, variantId: string) => {
    dispatch({ type: "SET_VARIANT", productId, variantId });
  }, []);

  const selectPlan = useCallback((planId: string) => {
    dispatch({ type: "SELECT_PLAN", planId });
  }, []);

  const selectedCountForStep = useCallback(
    (stepId: Product["stepId"]) => {
      if (stepId === "plan") return state.planId ? 1 : 0;
      return products.filter(
        (p) => p.stepId === stepId && (state.selections[p.id]?.quantity ?? 0) > 0,
      ).length;
    },
    [state.selections, state.planId],
  );

  const value = useMemo<BundleContextValue>(
    () => ({
      selections: state.selections,
      planId: state.planId,
      getQuantity,
      getVariant,
      setQuantity,
      setVariant,
      selectPlan,
      selectedCountForStep,
    }),
    [
      state.selections,
      state.planId,
      getQuantity,
      getVariant,
      setQuantity,
      setVariant,
      selectPlan,
      selectedCountForStep,
    ],
  );

  return (
    <BundleContext.Provider value={value}>{children}</BundleContext.Provider>
  );
}

export function useBundle(): BundleContextValue {
  const ctx = useContext(BundleContext);
  if (!ctx) {
    throw new Error("useBundle must be used within a BundleProvider");
  }
  return ctx;
}

export { products, plans };
