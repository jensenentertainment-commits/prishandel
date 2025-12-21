"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./CartProvider";

export default function CartNavItem() {
  const { itemCount } = useCart();

  return (
    <Link href="/kurv" className="relative inline-flex items-center gap-2">
      <ShoppingCart className="h-5 w-5" />

      {/* hvis du vil ha tekst i navbar */}
      <span className="text-sm font-black">Kurv</span>

      {/* count */}
      <span className="rounded-full bg-red-600 text-white text-[11px] font-black px-2 py-0.5 tabular-nums">
        {itemCount}
      </span>
    </Link>
  );
}
