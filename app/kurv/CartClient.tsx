"use client";

import CheckoutGate from "../components/CheckoutGate";
import { useCart } from "../components/cart/CartProvider";
import LedgerPanel from "../components/ledger/LedgerPanel";
import { useLedger } from "../components/ledger/useLedger";
import { useEffect, useRef } from "react";

type Product = {
  slug: string;
  title: string;
  now: number;
  before: number;
  badge: string;
  note: string;
  leak: string;
};

function getCartStatus(itemCount: number, total: number) {
  if (itemCount === 0) return "Avventer initiering";
  if (itemCount === 1) return "Midlertidig oppdatert";
  if (itemCount >= 2 && total < 1000) return "Avventer videre vurdering";
  if (total >= 1000) return "Påvirker systemet";
  return "Status uavklart";
}

export default function CartClient({
  products,
}: {
  products: Product[];
}) {

  const { state, setQty, remove, itemCount } = useCart();
const ledger = useLedger();
const prevStatusRef = useRef<string | null>(null);
const appendRef = useRef(ledger.append);

  const linesWithProduct = state.lines
    .map((l) => {
      const p = products.find((x) => x.slug === l.slug);
      return p ? { p, qty: l.qty } : null;
    })
    .filter(Boolean) as { p: Product; qty: number }[];

  const subtotal = linesWithProduct.reduce((s, x) => s + x.p.now * x.qty, 0);
  const shipping = subtotal >= 499 ? 0 : 49;
  const discount = 0;
  const total = subtotal + shipping - discount;
const status = getCartStatus(itemCount, total);

useEffect(() => {
  const prev = prevStatusRef.current;

  // første render: sett baseline uten å logge
  if (prev === null) {
    prevStatusRef.current = status;
    return;
  }

  // logg kun når status faktisk endres
  if (prev !== status) {
    appendRef.current(`Status endret: ${prev} → ${status}`, 0);
    prevStatusRef.current = status;
  }
}, [status]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Handlekurv</h1>
          <p className="text-sm opacity-70">
            Du har {linesWithProduct.length} varer i kurven. Ingen av dem finnes.
          </p>
        </div>
        
        <a href="/butikk" className="text-sm font-black underline decoration-2">
          Fortsett å handle →
        </a>
      </div>


      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,380px]">
        {/* Linjevarer */}
        <section className="rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden">
          <div className="border-b border-black/10 px-6 py-4 flex items-center justify-between">
            <div className="font-black">Varer</div>
            <div className="text-xs font-semibold rounded bg-red-600 text-white px-2 py-1">
              ALLTID UTSOLGT
            </div>
          </div>
<div className="mt-1 text-xs font-semibold opacity-60">
  Status: {status}
</div>

          {linesWithProduct.length === 0 ? (
            <div className="p-10 text-sm opacity-70">
              Kurven er tom. Systemet har ingen innvendinger.
            </div>
          ) : (
            <div className="divide-y divide-black/10">
              {linesWithProduct.map(({ p, qty }) => (
                <div key={p.slug} className="p-6 flex gap-4">
                  <div className="h-24 w-24 rounded-xl bg-neutral-50 border border-black/10 flex items-center justify-center overflow-hidden">
                    <img
                      src={`/products/${p.slug}.svg`}
                      alt={p.title}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <a href={`/produkt/${p.slug}`} className="font-black hover:underline">
                          {p.title}
                        </a>
                        <div className="text-xs opacity-70 mt-1">
                          Lagerstatus: 0 • Levering: ubestemt
                        </div>
                        <div className="mt-1 text-[11px] font-semibold opacity-60 truncate">
                          SYS: {p.leak}

                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs line-through opacity-50">{p.before},-</div>
                        <div className="text-lg font-black text-red-600">{p.now},-</div>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-neutral-50 px-3 py-2 text-sm">
                        <span className="opacity-70">Antall</span>

                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
  const next = Math.max(1, qty - 1);
  setQty(p.slug, next);

  ledger.append("Avrunding (begrunnet)", -(p.now * 0.07));
  ledger.append(`Antall justert: ${p.title}`, -(p.now * 0.12));
}}
                            className="h-7 w-7 rounded-md border border-black/10 bg-white font-black hover:bg-neutral-100"
                            aria-label="Mindre"
                          >
                            −
                          </button>
                          <span className="w-6 text-center font-black">{qty}</span>
                          <button
                            type="button"
                            onClick={() => {
  const next = qty + 1;
  setQty(p.slug, next);

  ledger.append("Midlertidig justering", +(p.now * 0.09));
  ledger.append(`Antall justert: ${p.title}`, +(p.now * 0.18));
}}
                            className="h-7 w-7 rounded-md border border-black/10 bg-white font-black hover:bg-neutral-100"
                            aria-label="Mer"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-xs opacity-60">(begrenset av virkeligheten)</span>
                      </div>

                      <span className="text-xs font-semibold rounded bg-yellow-300 px-2 py-1">
                        {p.badge}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
  remove(p.slug);

  ledger.append(`Linje fjernet: ${p.title}`, -(p.now * qty));
  ledger.append("Intern vurdering (0,-)", 0);
}}
                        className="ml-auto text-xs opacity-60 hover:opacity-90 underline decoration-2"
                      >
                        Fjern (utsolgt)
                      </button>
                    </div>

                    <div className="mt-3 text-xs opacity-70">{p.note}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="px-6 py-4 bg-neutral-50 border-t border-black/10 text-xs opacity-70">
            📣 Marked: “Kurv øker konvertering.” 🧾 Regnskap: “Kurv øker puls.”
          </div>
        </section>

        {/* Oppsummering */}
        <aside className="space-y-4">
          <div className="rounded-2xl bg-white border border-black/10 shadow-sm p-6">
            <div className="font-black text-lg">Oppsummering</div>

            <div className="mt-4 space-y-2 text-sm">
              <Row label="Delsum" value={`${subtotal},-`} />
              <Row label="Frakt" value={shipping === 0 ? "0,-*" : `${shipping},-`} />
              <Row label="Rabatt" value={`${discount},-`} />
              <div className="border-t border-black/10 my-3" />
              <Row
                label={<span className="font-black">Total</span>}
                value={<span className="font-black text-lg">{total},-</span>}
              />
            </div>

            <div className="mt-4 rounded-xl bg-yellow-300 border border-black/10 p-4">
              <div className="text-sm font-black">🎟 Rabattkode</div>
              <div className="mt-2 flex gap-2">
                <input
                  placeholder="KAMPANJEALLTID"
                  className="flex-1 rounded-lg border border-black/15 bg-white px-3 py-2 text-sm"
                />
                <a
                  href="/kampanjer"
                  className="rounded-lg bg-black text-white px-4 py-2 text-sm font-black hover:opacity-90"
                >
                  Bruk
                </a>
              </div>
              <div className="mt-2 text-xs opacity-70">
                Kode akseptert. Besparelse: 0,- (🧾 “som forventet”).
              </div>
            </div>

           <CheckoutGate total={total} itemsCount={itemCount} />


            <div className="mt-3 text-xs opacity-60">
              Betaling: Vipps/Klarna* • Trygg handel: nesten
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-black/10 shadow-sm p-6">
            <div className="text-sm font-black">Levering</div>
            <div className="mt-2 text-sm opacity-80">
              Standard levering: <span className="font-semibold">ubestemt</span>
              <br />
              Ekspress: <span className="font-semibold">fortsatt ubestemt</span>
            </div>
            <div className="mt-3 text-xs opacity-60">
              *Gratis frakt gjelder i teorien og ved totalsum over 499,-.
            </div>
            <LedgerPanel className="space-y-0" />
          </div>
        </aside>
      </div>
    </main>
  );
}

function Row(props: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="opacity-70">{props.label}</div>
      <div className="text-right">{props.value}</div>
    </div>
  );
}
