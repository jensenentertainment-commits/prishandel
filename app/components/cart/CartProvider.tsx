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
};

const CartContext = createContext<CartContextValue | null>(null);

function clampQty(n: number) {
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(99, Math.floor(n)));
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const qty = clampQty(action.qty ?? 1);
      const idx = state.lines.findIndex((l) => l.slug === action.slug);
      if (idx === -1) return { lines: [...state.lines, { slug: action.slug, qty }] };
      const next = [...state.lines];
      next[idx] = { ...next[idx], qty: clampQty(next[idx].qty + qty) };
      return { lines: next };
    }
    case "SET_QTY": {
      const qty = clampQty(action.qty);
      return { lines: state.lines.map((l) => (l.slug === action.slug ? { ...l, qty } : l)) };
    }
    case "REMOVE":
      return { lines: state.lines.filter((l) => l.slug !== action.slug) };
    case "CLEAR":
      return { lines: [] };
    default:
      return state;
  }
}

function getInitialState(seedSlugs: string[]): CartState {
  const existing = loadCart();
  if (existing) return existing;
  if (seedSlugs.length) return { lines: seedSlugs.map((slug) => ({ slug, qty: 1 })) };
  return { lines: [] };
}

export function CartProvider({
  children,
  seedSlugs = [],
}: {
  children: React.ReactNode;
  seedSlugs?: string[];
}) {
  const [state, dispatch] = useReducer(
    reducer,
    seedSlugs,
    (s) => getInitialState(s),
  );

  useEffect(() => {
    saveCart(state);
  }, [state]);

  const api = useMemo<CartContextValue>(() => {
    const itemCount = state.lines.reduce((sum, l) => sum + l.qty, 0);
    return {
      state,
      add: (slug, qty) => dispatch({ type: "ADD", slug, qty }),
      setQty: (slug, qty) => dispatch({ type: "SET_QTY", slug, qty }),
      remove: (slug) => dispatch({ type: "REMOVE", slug }),
      clear: () => dispatch({ type: "CLEAR" }),
      itemCount,
    };
  }, [state]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart må brukes inni <CartProvider>");
  return ctx;
}
