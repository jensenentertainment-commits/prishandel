"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./CartProvider";

function getCartLabel(count: number, status: string) {
  if (count === 0) return "Tom kurv";
  if (status === "flagged") return "Kurv (vurderes)";
  if (status === "reviewing") return "Kurv (oppdateres)";
  return "Kurv";
}

function getCountLabel(count: number) {
  if (count === 0) return "0";
  if (count >= 8) return "??";
  if (count >= 5) return "5+";
  return String(count);
}

export default function CartNavItem() {
  const { itemCount, statusLabel, state } = useCart();

  const label = getCartLabel(itemCount, state.status);
  const countLabel = getCountLabel(itemCount);

  return (
    <Link
      href="/kurv"
      className="relative inline-flex items-center gap-2"
      title={`Items: ${itemCount} • ${statusLabel}`}
    >
      <ShoppingCart className="h-5 w-5" />

      <span className="text-sm font-black">{label}</span>

      <span className="rounded-full bg-red-600 text-white text-[11px] font-black px-2 py-0.5 tabular-nums">
        {countLabel}
      </span>
    </Link>
  );
}