"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";

export default function AddToCartOnProduct(props: { slug: string }) {
  const { add, state, itemCount } = useCart();
  const qty = state.lines.find((l) => l.slug === props.slug)?.qty ?? 0;

  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const timer = window.setTimeout(() => setJustAdded(false), 1200);
    return () => window.clearTimeout(timer);
  }, [justAdded]);

  function handleAdd() {
    add(props.slug, 1);
    setJustAdded(true);
  }

  function getButtonLabel() {
    if (justAdded) return "Lagt til";
    if (qty === 0) return "Legg i handlekurv";
    if (qty === 1) return "Legg til én til";
    return "Legg til flere";
  }

  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={handleAdd}
        className="rounded-xl bg-black text-white px-4 py-3 font-black text-center hover:opacity-90"
      >
        {getButtonLabel()}
      </button>

      {itemCount > 0 && (
        <Link
          href="/kurv"
          className="rounded-xl bg-white text-black px-4 py-3 font-black text-center border border-black/20 hover:bg-black/5"
        >
          Gå til kurv →
        </Link>
      )}
    </div>
  );
}