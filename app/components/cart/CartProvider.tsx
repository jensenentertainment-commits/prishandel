"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import type { CartAction, CartState } from "./cartTypes";
import { loadCart, saveCart } from "./cartStorage";

type HydrateAction = {
  type: "HYDRATE";
  state: CartState;
};

type InternalCartAction = CartAction | HydrateAction;

type CartContextValue = {
  state: CartState;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  itemCount: number;
  lineCount: number;
  isEmpty: boolean;
  hydrated: boolean;
  statusLabel: string;
  systemNote: string;
};

const CartContext = createContext<CartContextValue | null>(null);

function clampQty(n: number) {
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(99, Math.floor(n)));
}

function deriveStatus(lines: CartState["lines"]): CartState["status"] {
  const itemCount = lines.reduce((sum, l) => sum + l.qty, 0);

  if (itemCount === 0) return "released";
  if (itemCount >= 6 || lines.length >= 4) return "flagged";
  if (itemCount >= 2) return "reviewing";
  return "stable";
}

function normalizeState(input: unknown): CartState | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Partial<CartState>;

  const lines = Array.isArray(raw.lines)
    ? raw.lines
        .filter(
          (l): l is { slug: string; qty: number; addedAt?: number } =>
            !!l &&
            typeof l === "object" &&
            typeof l.slug === "string" &&
            typeof l.qty === "number"
        )
        .map((l) => ({
          slug: l.slug,
          qty: clampQty(l.qty),
          addedAt: typeof l.addedAt === "number" ? l.addedAt : undefined,
        }))
    : [];

  return {
    lines,
    status:
      raw.status === "stable" ||
      raw.status === "reviewing" ||
      raw.status === "flagged" ||
      raw.status === "released"
        ? raw.status
        : deriveStatus(lines),
    lastAction:
      raw.lastAction === "add" ||
      raw.lastAction === "set_qty" ||
      raw.lastAction === "remove" ||
      raw.lastAction === "clear"
        ? raw.lastAction
        : undefined,
    updatedAt: typeof raw.updatedAt === "number" ? raw.updatedAt : 0,
  };
}

function createInitialState(seedSlugs: string[]): CartState {
  const lines = seedSlugs.length
    ? seedSlugs.map((slug) => ({
        slug,
        qty: 1,
        addedAt: 0,
      }))
    : [];

  return {
    lines,
    status: deriveStatus(lines),
    lastAction: undefined,
    updatedAt: 0,
  };
}

function reducer(state: CartState, action: InternalCartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return action.state;

    case "ADD": {
      const qty = clampQty(action.qty ?? 1);
      const now = Date.now();
      const idx = state.lines.findIndex((l) => l.slug === action.slug);

      const lines =
        idx === -1
          ? [...state.lines, { slug: action.slug, qty, addedAt: now }]
          : state.lines.map((l, i) =>
              i === idx ? { ...l, qty: clampQty(l.qty + qty) } : l
            );

      return {
        ...state,
        lines,
        status: deriveStatus(lines),
        lastAction: "add",
        updatedAt: now,
      };
    }

    case "SET_QTY": {
      const now = Date.now();
      const qty = clampQty(action.qty);

      const lines = state.lines.map((l) =>
        l.slug === action.slug ? { ...l, qty } : l
      );

      return {
        ...state,
        lines,
        status: deriveStatus(lines),
        lastAction: "set_qty",
        updatedAt: now,
      };
    }

    case "REMOVE": {
      const now = Date.now();
      const lines = state.lines.filter((l) => l.slug !== action.slug);

      return {
        ...state,
        lines,
        status: deriveStatus(lines),
        lastAction: "remove",
        updatedAt: now,
      };
    }

    case "CLEAR": {
      const now = Date.now();

      return {
        ...state,
        lines: [],
        status: "released",
        lastAction: "clear",
        updatedAt: now,
      };
    }

    default:
      return state;
  }
}

function getStatusLabel(status: CartState["status"], itemCount: number) {
  switch (status) {
    case "stable":
      return itemCount === 1 ? "1 aktivt kjøpsforsøk" : "Aktive kjøpsforsøk";
    case "reviewing":
      return "Kurv under behandling";
    case "flagged":
      return "Kurv under vurdering";
    case "released":
      return "Ingen kjøpsforsøk";
    default:
      return "Kjøpsforsøk registrert";
  }
}

function getSystemNote(
  status: CartState["status"],
  itemCount: number,
  lineCount: number,
  lastAction?: CartState["lastAction"]
) {
  if (itemCount === 0) {
    return "Ingen aktive kjøpsforsøk registrert.";
  }

  if (status === "flagged") {
    return "Forhøyet aktivitet registrert. Videre behandling kan avvike.";
  }

  if (status === "reviewing") {
    return "Kurven er aktiv. Systemet følger utviklingen løpende.";
  }

  if (lastAction === "add" && itemCount === 1 && lineCount === 1) {
    return "Første kjøpsforsøk registrert.";
  }

  if (lastAction === "clear") {
    return "Tidligere kjøpsforsøk er fjernet fra aktiv behandling.";
  }

  return "Kjøpsforsøk registrert i systemet.";
}

export function CartProvider({
  children,
  seedSlugs = [],
}: {
  children: React.ReactNode;
  seedSlugs?: string[];
}) {
  const [state, dispatch] = useReducer(reducer, seedSlugs, createInitialState);
  const [hydrated, setHydrated] = useState(false);
  const skipFirstPersistRef = useRef(true);

  useEffect(() => {
    const stored = normalizeState(loadCart());

    if (stored) {
      dispatch({ type: "HYDRATE", state: stored });
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (skipFirstPersistRef.current) {
      skipFirstPersistRef.current = false;
      return;
    }

    saveCart(state);
  }, [state, hydrated]);

  const api = useMemo<CartContextValue>(() => {
    const itemCount = state.lines.reduce((sum, l) => sum + l.qty, 0);
    const lineCount = state.lines.length;
    const isEmpty = lineCount === 0;

    return {
      state,
      add: (slug, qty) => dispatch({ type: "ADD", slug, qty }),
      setQty: (slug, qty) => dispatch({ type: "SET_QTY", slug, qty }),
      remove: (slug) => dispatch({ type: "REMOVE", slug }),
      clear: () => dispatch({ type: "CLEAR" }),
      itemCount,
      lineCount,
      isEmpty,
      hydrated,
      statusLabel: getStatusLabel(state.status, itemCount),
      systemNote: getSystemNote(
        state.status,
        itemCount,
        lineCount,
        state.lastAction
      ),
    };
  }, [state, hydrated]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart må brukes inni <CartProvider>");
  }
  return ctx;
}