export type CartStatus = "stable" | "reviewing" | "flagged" | "released";

export type CartLastAction = "add" | "set_qty" | "remove" | "clear";

export type CartLine = {
  slug: string;
  qty: number;
  addedAt?: number;
};

export type CartState = {
  lines: CartLine[];
  status: CartStatus;
  lastAction?: CartLastAction;
  updatedAt: number;
};

export type CartAction =
  | { type: "ADD"; slug: string; qty?: number }
  | { type: "SET_QTY"; slug: string; qty: number }
  | { type: "REMOVE"; slug: string }
  | { type: "CLEAR" };