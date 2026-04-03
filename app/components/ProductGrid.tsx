"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ShoppingCart, Receipt } from "lucide-react";
import { Icon } from "./Icon";
import { PRODUCTS, getLeaks, type Product } from "../lib/products";
import { useCart } from "./cart/CartProvider";

type ProductGridProps = {
  limit?: number;
  title?: string;
  subtitle?: string;
};

function hashString(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i);
  return Math.abs(h);
}

function prng(seed: number) {
  let x = seed || 1;
  return () => {
    x = (x * 16807) % 2147483647;
    return (x - 1) / 2147483646;
  };
}

function pickSeed(extra = "") {
  const now = new Date();
  const cycle = Math.floor(now.getTime() / (1000 * 60 * 61));
  return hashString(`${cycle}|${extra}`);
}

const ACCOUNTING_VARIANTS = [
  "Pris er godkjent for visning.",
  "Avvik er notert uten tiltak.",
  "Tall er registrert.",
  "Beregning er gjennomført.",
  "Regnskap er orientert.",
] as const;

export default function ProductGrid({
  limit,
  title,
  subtitle,
}: ProductGridProps) {
  const items = useMemo(() => {
    let list = [...PRODUCTS];
    if (limit) list = list.slice(0, limit);
    return list;
  }, [limit]);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-10">
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h1 className="text-3xl font-black">{title}</h1>}
          {subtitle && <p className="mt-2 text-sm opacity-70">{subtitle}</p>}
        </div>
      )}

      <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <ProductCard key={p.slug} p={p} />
        ))}

        {items.length === 0 && (
          <div className="rounded-2xl border border-black/12 bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-3">
            <div className="text-lg font-black">Ingen varer tilgjengelig</div>
            <div className="mt-3 space-y-2 text-sm opacity-80">
              <div>Markedsavdelingen anbefaler fortsatt optimisme.</div>
              <div className="opacity-70">Regnskap har notert situasjonen.</div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-xs opacity-60">
        Rabatter gjelder kun i teorien. Handlekraft vurderes separat.
      </div>
    </section>
  );
}

function ProductCard({ p }: { p: Product }) {
  const { add, state } = useCart();
  const inCartQty = state.lines.find((l) => l.slug === p.slug)?.qty ?? 0;

  const seed = pickSeed(p.slug);
  const rnd = prng(seed);

  const accountingIndex = Math.max(
    0,
    Math.min(
      ACCOUNTING_VARIANTS.length - 1,
      Math.floor(rnd() * ACCOUNTING_VARIANTS.length)
    )
  );

  const accountingText =
    ACCOUNTING_VARIANTS[accountingIndex] ?? "Tall er registrert.";

  const discount = Math.max(
    10,
    Math.min(97, Math.round(((p.before - p.now) / p.before) * 100))
  );

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/12 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative flex h-56 items-end justify-between overflow-hidden border-b border-black/10 bg-[#f7f4ea] p-4 md:h-64">
        <span className="absolute left-3 top-3 z-10 rounded-full bg-black px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-yellow-300">
          Kampanje
        </span>

        <span className="absolute right-3 top-3 z-10 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white">
          -{discount}%
        </span>

        <img
          src={`/products/${p.slug}.svg`}
          alt={p.title}
          className="relative z-0 h-full w-full scale-110 object-contain"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex min-h-[132px] items-start justify-between gap-3">
          <div>
            <h3 className="text-[1.75rem] font-black leading-[1] tracking-tight">
              {p.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed opacity-80">{p.short}</p>
          </div>

          <div className="shrink-0 text-right">
            <div className="text-2xl font-black leading-none">{p.now},-</div>
            <div className="mt-1 text-[12px] line-through opacity-60">
              {p.before},-
            </div>
          </div>
        </div>

        <div className="min-h-[88px] rounded-xl border border-black/10 bg-[#f7f4ea] p-3">
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide">
            <Icon icon={Receipt} />
            Regnskap
          </div>
          <div className="mt-1 text-sm opacity-80">{accountingText}</div>
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex items-stretch gap-2">
            <Link
              href={`/produkt/${p.slug}`}
              className="flex min-h-[56px] flex-1 items-center justify-center rounded-xl bg-red-600 px-4 py-4 text-center text-sm font-black tracking-wide text-white transition hover:opacity-90"
            >
              <span>Se produkt →</span>
            </Link>

            <button
              type="button"
              onClick={() => add(p.slug, 1)}
              className="relative inline-flex min-h-[56px] items-center justify-center rounded-xl border border-black/20 bg-white px-4 py-4 font-black text-black transition hover:bg-black/5"
              title={inCartQty > 0 ? `I kurv (${inCartQty})` : "Legg i handlekurv"}
            >
              <Icon icon={ShoppingCart} />
              {inCartQty > 0 && (
                <span className="absolute -right-2 -top-2 rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-black tabular-nums text-white">
                  {inCartQty}
                </span>
              )}
            </button>
          </div>

          <div className="rounded-xl border border-black/10 bg-[#f7f4ea] p-3">
            <div className="text-[11px] font-black uppercase tracking-wide opacity-70">
              Systemnotater
            </div>
            <ul className="mt-2 space-y-1 text-[12px] font-semibold">
              {getLeaks(p.slug, 2).map((line) => (
                <li key={line}>
                  <span className="opacity-60">•</span>{" "}
                  <span className="opacity-80">{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}