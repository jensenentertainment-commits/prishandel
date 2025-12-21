"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export default function AddToCartOnProduct(props: { slug: string }) {
  const { add, state } = useCart();
  const qty = state.lines.find((l) => l.slug === props.slug)?.qty ?? 0;

  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={() => add(props.slug, 1)}
        className="rounded-xl bg-black text-white px-4 py-3 font-black text-center hover:opacity-90"
      >
        Legg i handlekurv ({qty})
      </button>

      {/* Dette føles “ekte”: etter add kan de gå til kurv hvis de vil */}
      <Link
        href="/kurv"
        className="rounded-xl bg-white text-black px-4 py-3 font-black text-center border border-black/20 hover:bg-black/5"
      >
        Gå til kurv →
      </Link>
    </div>
  );
}
