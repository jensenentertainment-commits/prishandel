export type CartLine = {
  slug: string;
  qty: number;
};

export type CartState = {
  lines: CartLine[];
};

export type CartAction =
  | { type: "INIT"; payload: CartState }
  | { type: "ADD"; slug: string; qty?: number }
  | { type: "SET_QTY"; slug: string; qty: number }
  | { type: "REMOVE"; slug: string }
  | { type: "CLEAR" };
