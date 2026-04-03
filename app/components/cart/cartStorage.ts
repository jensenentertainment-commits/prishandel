import type { CartState } from "./cartTypes";

const KEY = "prh_cart_v2";

function isValidState(input: any): input is CartState {
  if (!input || typeof input !== "object") return false;

  if (!Array.isArray(input.lines)) return false;

  for (const l of input.lines) {
    if (
      !l ||
      typeof l !== "object" ||
      typeof l.slug !== "string" ||
      typeof l.qty !== "number"
    ) {
      return false;
    }
  }

  if (
    input.status !== "stable" &&
    input.status !== "reviewing" &&
    input.status !== "flagged" &&
    input.status !== "released"
  ) {
    return false;
  }

  if (typeof input.updatedAt !== "number") return false;

  return true;
}

export function loadCart(): CartState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (!isValidState(parsed)) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function saveCart(state: CartState) {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // silent
  }
}