"use client";

import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { CartAction, CartState } from "./cartTypes";
import { loadCart, saveCart } from "./cartStorage";

type CartContextValue = {
  state: CartState;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  itemCount: number;
  lineCount: number;
  isEmpty: boolean;
  statusLabel: string;
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
          (l): l is { slug: string; qty: number } =>
            !!l &&
            typeof l === "object" &&
            typeof l.slug === "string" &&
            typeof l.qty === "number"
        )
        .map((l) => ({ slug: l.slug, qty: clampQty(l.qty) }))
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
    updatedAt: typeof raw.updatedAt === "number" ? raw.updatedAt : Date.now(),
  };
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const qty = clampQty(action.qty ?? 1);
      const idx = state.lines.findIndex((l) => l.slug === action.slug);

      const lines =
        idx === -1
          ? [...state.lines, { slug: action.slug, qty }]
          : state.lines.map((l, i) =>
              i === idx ? { ...l, qty: clampQty(l.qty + qty) } : l
            );

      return {
        ...state,
        lines,
        status: deriveStatus(lines),
        lastAction: "add",
        updatedAt: Date.now(),
      };
    }

    case "SET_QTY": {
      const qty = clampQty(action.qty);
      const lines = state.lines.map((l) =>
        l.slug === action.slug ? { ...l, qty } : l
      );

      return {
        ...state,
        lines,
        status: deriveStatus(lines),
        lastAction: "set_qty",
        updatedAt: Date.now(),
      };
    }

    case "REMOVE": {
      const lines = state.lines.filter((l) => l.slug !== action.slug);

      return {
        ...state,
        lines,
        status: deriveStatus(lines),
        lastAction: "remove",
        updatedAt: Date.now(),
      };
    }

    case "CLEAR":
      return {
        ...state,
        lines: [],
        status: "released",
        lastAction: "clear",
        updatedAt: Date.now(),
      };

    default:
      return state;
  }
}

function getInitialState(seedSlugs: string[]): CartState {
  const existing = normalizeState(loadCart());
  if (existing) return existing;

  const lines = seedSlugs.length
    ? seedSlugs.map((slug) => ({ slug, qty: 1 }))
    : [];

  return {
    lines,
    status: deriveStatus(lines),
    lastAction: undefined,
    updatedAt: Date.now(),
  };
}

function getStatusLabel(status: CartState["status"]) {
  switch (status) {
    case "stable":
      return "Cart stable";
    case "reviewing":
      return "Cart under review";
    case "flagged":
      return "Cart flagged";
    case "released":
      return "Cart released";
    default:
      return "Cart active";
  }
}

export function CartProvider({
  children,
  seedSlugs = [],
}: {
  children: React.ReactNode;
  seedSlugs?: string[];
}) {
  const [state, dispatch] = useReducer(reducer, seedSlugs, (s) => getInitialState(s));

  useEffect(() => {
    saveCart(state);
  }, [state]);

  const api = useMemo<CartContextValue>(() => {
    const itemCount = state.lines.reduce((sum, l) => sum + l.qty, 0);
    const lineCount = state.lines.length;

    return {
      state,
      add: (slug, qty) => dispatch({ type: "ADD", slug, qty }),
      setQty: (slug, qty) => dispatch({ type: "SET_QTY", slug, qty }),
      remove: (slug) => dispatch({ type: "REMOVE", slug }),
      clear: () => dispatch({ type: "CLEAR" }),
      itemCount,
      lineCount,
      isEmpty: lineCount === 0,
      statusLabel: getStatusLabel(state.status),
    };
  }, [state]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart må brukes inni <CartProvider>");
  return ctx;
}