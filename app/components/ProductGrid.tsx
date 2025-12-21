"use client";
import { ShoppingCart } from "lucide-react";
import { Icon } from "./Icon";
import { Receipt, Megaphone } from "lucide-react";
import { useMemo, useState } from "react";
import { PRODUCTS, getLeaks, type Product } from "../lib/products";
import { useCart } from "./cart/CartProvider";
import Link from "next/link";

function cn(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

export default function ProductGrid(props: {
  title?: string;
  subtitle?: string;
  limit?: number;
}) {
  const [q, setQ] = useState("");

  const items = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = PRODUCTS.filter((p) => {
      if (!query) return true;
      return (
        p.title.toLowerCase().includes(query) ||
        p.short.toLowerCase().includes(query) ||
        p.note.toLowerCase().includes(query)
      );
    });

    if (props.limit) list = list.slice(0, props.limit);
    return list;
  }, [q, props.limit]);

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      {/* header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight">
            {props.title ?? "Utvalgte varer"}
          </h2>
          <p className="mt-2 text-sm opacity-80 max-w-2xl">
            {props.subtitle ??
              "Alle varer er kraftig rabattert og utilgjengelige."}
          </p>
        </div>

        <div className="flex gap-2">
          <a
            href="/kampanjer"
            className="rounded-xl bg-red-600 text-white px-4 py-2 font-black hover:opacity-90"
          >
            Se kampanjer →
          </a>
        <Link href="/lager" className="...">
  Intern Lagerstatus
</Link>
        </div>
      </div>

      {/* søk */}
      <div className="mt-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Søk i butikken…"
          className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm font-semibold placeholder:opacity-60"
        />
      </div>

      {/* grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <ProductCard key={p.slug} p={p} />
        ))}

        {items.length === 0 && (
          <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border border-black/10 bg-white p-6">
            <div className="text-lg font-black">Ingen treff</div>
           <div className="mt-1 text-sm opacity-80 space-y-1">
  <div className="inline-flex items-center gap-2">
    <Icon icon={Megaphone} />
    Markedsavdelingen: prøv “tilbud”.
  </div>
  <div className="inline-flex items-center gap-2 opacity-70">
    <Icon icon={Receipt} />
    Regnskap: notert.
  </div>
</div>

          </div>
        )}
      </div>

      <div className="mt-6 text-xs opacity-60">
        *Rabatter gjelder kun i teorien.
      </div>
    </section>
  );
}

function ProductCard({ p }: { p: Product }) {
  const { add, state } = useCart();

  const inCartQty = state.lines.find((l) => l.slug === p.slug)?.qty ?? 0;

  return (
    <article className="rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden">
      {/* bilde-placeholder */}
      <div className="h-40 bg-neutral-50 border-b border-black/10 p-4 flex items-end justify-between overflow-hidden">
        <img
          src={`/products/${p.slug}.svg`}
          alt={p.title}
          className="h-full w-full object-contain"
        />
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-black">{p.title}</h3>
            <p className="mt-1 text-sm opacity-80">{p.short}</p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-lg font-black">{p.now},-</div>
            <div className="text-[11px] opacity-60 line-through">{p.before},-</div>
          </div>
        </div>

        <div className="rounded-xl bg-neutral-50 border border-black/10 p-3">
          <div className="text-xs font-black inline-flex items-center gap-2">
            <Icon icon={Receipt} />
            Regnskap
          </div>
          <div className="mt-1 text-sm opacity-80">{p.note}</div>
        </div>

        <div className="flex gap-2">
          <a
            href={`/produkt/${p.slug}`}
            className="flex-1 text-center rounded-xl bg-red-600 text-white px-4 py-3 font-black hover:opacity-90"
          >
            Kjøp nå →
          </a>

          <button
            type="button"
            onClick={() => add(p.slug, 1)}
            className="relative rounded-xl bg-white text-black px-4 py-3 font-black border border-black/20 hover:bg-black/5 inline-flex items-center justify-center"
            title={inCartQty > 0 ? `I kurv (${inCartQty})` : "Legg i handlekurv"}
          >
            <Icon icon={ShoppingCart} />
            {inCartQty > 0 && (
              <span className="absolute -top-2 -right-2 rounded-full bg-red-600 text-white text-[11px] font-black px-2 py-0.5 tabular-nums">
                {inCartQty}
              </span>
            )}
          </button>
        </div>

        <div className="rounded-xl bg-neutral-50 border border-black/10 p-3">
          <div className="text-[11px] font-black opacity-70">Systemnotater</div>
          <ul className="mt-2 space-y-1 text-[12px] font-semibold">
            {getLeaks(p.slug, 2).map((line) => (
              <li key={line} className="truncate">
                <span className="opacity-60">•</span>{" "}
                <span className="opacity-80">{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-[11px] opacity-60">📣 Marked: “Dette haster.” • 🧾 “Dette er notert.”</div>
      </div>
    </article>
  );
}
