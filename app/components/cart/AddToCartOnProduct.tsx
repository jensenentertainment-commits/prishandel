"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCart, Check, ArrowRight } from "lucide-react";
import { useCart } from "./CartProvider";

export default function AddToCartOnProduct(props: { slug: string }) {
  const { add, state, itemCount } = useCart();
  const qty = state.lines.find((l) => l.slug === props.slug)?.qty ?? 0;

  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const timer = window.setTimeout(() => setJustAdded(false), 1400);
    return () => window.clearTimeout(timer);
  }, [justAdded]);

  function handleAdd() {
    add(props.slug, 1);
    setJustAdded(true);
  }

  function getButtonLabel() {
    if (justAdded) return "Registrert i kurven";
    if (qty === 0) return "Legg i handlekurv";
    if (qty === 1) return "Legg til én til";
    return "Legg til flere";
  }

  function getHelperLine() {
    if (justAdded) {
      return "Produktet er lagt til. Videre behandling kan nå påbegynnes.";
    }
    if (qty === 0) {
      return "Produktet kan legges i kurven før tilgjengeligheten er endelig avklart.";
    }
    return `Du har ${qty} ${
      qty === 1 ? "eksemplar" : "eksemplarer"
    } av dette produktet i kurven.`;
  }

  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={handleAdd}
        className={[
          "inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl px-4 py-3 text-center font-black transition",
          justAdded
            ? "bg-green-600 text-white"
            : "bg-black text-white hover:opacity-90",
        ].join(" ")}
      >
        {justAdded ? (
          <Check className="h-4 w-4" />
        ) : (
          <ShoppingCart className="h-4 w-4" />
        )}
        <span>{getButtonLabel()}</span>
      </button>

      <div className="rounded-2xl border border-black/10 bg-neutral-50 p-3 text-sm leading-relaxed opacity-80">
        {getHelperLine()}
      </div>

      {itemCount > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          <Link
            href="/kurv"
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-black/20 bg-white px-4 py-3 text-center font-black text-black hover:bg-black/5"
          >
            Åpne kurven
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/kurv"
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-center font-black text-white hover:opacity-90"
          >
            Fortsett til behandling
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {itemCount > 0 && (
        <div className="text-xs leading-relaxed opacity-60">
          Du kan nå gå til kurven, fortsette til kassen og se hvor langt ordren kommer.
        </div>
      )}
    </div>
  );
}