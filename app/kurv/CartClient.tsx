"use client";

import { useMemo, useRef, useEffect, useState, type ReactNode } from "react";
import CheckoutGate from "../components/CheckoutGate";
import { useCart } from "../components/cart/CartProvider";
import LedgerPanel from "../components/ledger/LedgerPanel";
import { useLedger } from "../components/ledger/useLedger";
import { getVoice, say } from "../lib/abVoice";

type Product = {
  slug: string;
  title: string;
  now: number;
  before: number;
  badge: string;
  note: string;
  leak: string;
};

function hashString(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i);
  return Math.abs(h);
}

function prng(seed: number) {
  let x = seed || 1;
  return () => {
    x = Math.imul(48271, x) % 0x7fffffff;
    return x / 0x7fffffff;
  };
}

function makeSessionSeed(extra: string) {
  const now = new Date();
  const cycle = Math.floor(now.getTime() / (1000 * 60 * 41));
  return hashString(`cart|${cycle}|${extra}`);
}

function pick<T>(arr: readonly T[], rnd: () => number) {
  return arr[Math.floor(rnd() * arr.length)];
}

function getBadge(now: number, before: number) {
  const diff = Math.max(0, before - now);
  if (diff <= 0) return "Pris vurdert";
  if (diff < 100) return "Mildt prisfall";
  if (diff < 300) return "Aktivt prisfall";
  return "Aggressivt prisfall";
}

const HEADER_SUBLINES = [
  "Systemet registrerer tilstedeværelse.",
  "Kurven holdes åpen inntil videre.",
  "Kjøpsintensjon er observert.",
  "Videre behandling avhenger av mot og metode.",
] as const;

const EMPTY_LINES = [
  "Kurven er tom. Systemet har ingen innvendinger.",
  "Ingen varer registrert. Markedet reagerer moderat.",
  "Tom kurv. Dette tolkes som tilbakeholdenhet.",
  "Ingen linjer. Ingen fremdrift. Foreløpig.",
] as const;

const CONTINUE_LINKS = [
  "Fortsett å handle →",
  "Gå tilbake til varene →",
  "Returner til butikken →",
  "Fortsett behandlingen →",
] as const;

const PAYMENT_LINES = [
  "Betaling: behandles ved behov • Trygg handel: ikke bestridt",
  "Betaling: tilgjengelig i prinsippet • Trygg handel: løpende vurdert",
  "Betaling: registrert • Trygg handel: uavklart",
  "Betaling: mulig • Trygg handel: utilstrekkelig dokumentert",
] as const;

const CART_FOOTERS = [
  "📣 Marked: “Kurv øker sannsynlighet.” 🧾 Regnskap: “Kurv øker spørsmål.”",
  "📣 Marked: “Legg til mer.” 🧾 Regnskap: “Legg til grunnlag.”",
  "📣 Marked: “Dette kan fortsatt bli noe.” 🧾 Regnskap: “Det er nettopp risikoen.”",
  "📣 Marked: “Fremdrift er fremdrift.” 🧾 Regnskap: “Ikke all fremdrift er god.”",
] as const;

const STOCK_LINES = [
  "Lagerstatus: uavklart • Levering: ubestemt",
  "Lagerstatus: ikke bekreftet • Levering: til vurdering",
  "Lagerstatus: teoretisk • Levering: fortsatt åpen",
] as const;

const SHIPPING_ZERO_LINES = [
  "0,- (midlertidig)",
  "0,- (forutsatt forståelse)",
  "0,- (registrert)",
  "0,- (inntil videre)",
] as const;

function getCartStatus(itemCount: number, total: number) {
  if (itemCount === 0) return "Avventer initiering";
  if (itemCount === 1) return "Midlertidig oppdatert";
  if (itemCount >= 2 && total < 1000) return "Avventer videre vurdering";
  if (total >= 1000) return "Påvirker systemet";
  return "Status uavklart";
}

function getHeaderLine(itemCount: number) {
  if (itemCount === 0) return "Du har 0 varer i kurven.";
  if (itemCount === 1) return "Du har 1 vare i kurven.";
  return `Du har ${itemCount} varer i kurven.`;
}

function getHeaderSecondLine(itemCount: number, total: number, fallback: string) {
  if (itemCount === 0) return fallback;
  if (total >= 1000) {
    return "Dette kan påvirke systemet. Systemet foretrekker begrenset påvirkning.";
  }
  if (itemCount >= 3) return "Saken har utviklet seg. Utviklingen er notert.";
  return fallback;
}

function getAvailabilityLabel(itemCount: number, total: number) {
  if (itemCount === 0) return "Tilgjengelighet: ikke testet";
  if (total >= 1400) return "Tilgjengelighet: sensitiv";
  if (itemCount >= 3) return "Tilgjengelighet: ustabil";
  return "Tilgjengelighet: uavklart";
}

function getPressureLabel(itemCount: number, total: number) {
  if (itemCount === 0) return "Lavt trykk";
  if (total >= 1800) return "Kritisk trykk";
  if (total >= 1000) return "Forhøyet trykk";
  if (itemCount >= 3) return "Vedvarende trykk";
  return "Moderat trykk";
}

function getCheckoutWarning(itemCount: number, total: number) {
  if (itemCount === 0) return "Ingen behandling tilgjengelig uten varer.";
  if (total >= 1800) return "Regnskap vil sannsynligvis involveres.";
  if (itemCount >= 3) return "Ordren kan bli sendt til videre intern vurdering.";
  return "Betaling, lager og virkelighet behandles separat.";
}

export default function CartClient({ products }: { products: Product[] }) {
  const { state, setQty, remove, itemCount } = useCart();
  const ledger = useLedger();
  const voice = useMemo(() => getVoice(), []);
  const prevStatusRef = useRef<string | null>(null);

  const productMap = useMemo(
    () => new Map(products.map((p) => [p.slug, p])),
    [products]
  );

  const linesWithProduct = useMemo(
    () =>
      state.lines
        .map((l) => {
          const p = productMap.get(l.slug);
          return p ? { p, qty: l.qty } : null;
        })
        .filter(Boolean) as { p: Product; qty: number }[],
    [state.lines, productMap]
  );

  const subtotal = useMemo(
    () => linesWithProduct.reduce((sum, x) => sum + x.p.now * x.qty, 0),
    [linesWithProduct]
  );

  const shipping = subtotal >= 499 ? 0 : subtotal === 0 ? 0 : 49;
  const discount = 0;
  const total = subtotal + shipping - discount;
  const status = getCartStatus(itemCount, total);

  const pageSeed = useMemo(
    () => makeSessionSeed(`${itemCount}|${total}|${status}`),
    [itemCount, total, status]
  );

  const headerRnd = useMemo(() => prng(pageSeed + 11), [pageSeed]);
  const footerRnd = useMemo(() => prng(pageSeed + 29), [pageSeed]);
  const uiRnd = useMemo(() => prng(pageSeed + 47), [pageSeed]);

  const headerSub = useMemo(() => pick(HEADER_SUBLINES, headerRnd), [headerRnd]);
  const emptyLine = useMemo(() => pick(EMPTY_LINES, headerRnd), [headerRnd]);
  const continueLabel = useMemo(() => pick(CONTINUE_LINKS, uiRnd), [uiRnd]);
  const paymentLine = useMemo(() => pick(PAYMENT_LINES, footerRnd), [footerRnd]);
  const cartFooter = useMemo(() => pick(CART_FOOTERS, footerRnd), [footerRnd]);
  const shippingZeroLine = useMemo(() => pick(SHIPPING_ZERO_LINES, uiRnd), [uiRnd]);
  const availabilityLabel = useMemo(
    () => getAvailabilityLabel(itemCount, total),
    [itemCount, total]
  );

  const pressureLabel = useMemo(
    () => getPressureLabel(itemCount, total),
    [itemCount, total]
  );

  const checkoutWarning = useMemo(
    () => getCheckoutWarning(itemCount, total),
    [itemCount, total]
  );

  const topLine = useMemo(() => getHeaderLine(itemCount), [itemCount]);
  const topSecondLine = useMemo(
    () => getHeaderSecondLine(itemCount, total, headerSub),
    [itemCount, total, headerSub]
  );

  useEffect(() => {
    const prev = prevStatusRef.current;

    if (prev === null) {
      prevStatusRef.current = status;
      return;
    }

    if (prev !== status) {
      ledger.append(`Status endret: ${prev} → ${status}`, 0);
      prevStatusRef.current = status;
    }
  }, [status, ledger]);

  const shippingValue =
    shipping === 0 ? (subtotal === 0 ? "ikke aktuelt" : shippingZeroLine) : `${shipping},-`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black sm:text-4xl">Handlekurv</h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed opacity-70">
            {topLine} {topSecondLine}
          </p>
        </div>

        <a href="/butikk" className="text-sm font-black underline decoration-2">
          {continueLabel}
        </a>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
          <div className="border-b border-black/10 px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="font-black">Varer</div>
                <div className="mt-1 text-xs font-semibold opacity-60">
                  {availabilityLabel} • {pressureLabel}
                </div>
              </div>

              <div className="inline-flex w-fit rounded bg-black px-2 py-1 text-xs font-semibold text-white">
                {status}
              </div>
            </div>

            <div className="mt-3 text-xs font-semibold opacity-60">
              {say(voice, itemCount === 0 ? "cart_empty" : "cart_status")}
            </div>
          </div>

          {linesWithProduct.length === 0 ? (
            <div className="p-8 text-sm opacity-70 sm:p-10">{emptyLine}</div>
          ) : (
            <div className="divide-y divide-black/10">
              {linesWithProduct.map(({ p, qty }) => {
                const lineSeed = makeSessionSeed(`${p.slug}|${qty}`);
                const lineRnd = prng(lineSeed);

                const stockLine = pick(STOCK_LINES, lineRnd);
                const lineState =
                  qty >= 3
                    ? "Linjen vurderes fortløpende."
                    : qty === 2
                    ? "Linjen er registrert med moderat friksjon."
                    : "Linjen er registrert.";

                return (
                  <div key={p.slug} className="p-4 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-neutral-50">
                        <img
                          src={`/products/${p.slug}.svg`}
                          alt={p.title}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <a
                              href={`/produkt/${p.slug}`}
                              className="block font-black hover:underline"
                            >
                              {p.title}
                            </a>

                            <div className="mt-1 text-xs leading-relaxed opacity-70">
                              {stockLine}
                            </div>
                            <div className="mt-1 text-[11px] font-semibold opacity-60">
                              SYS: {p.leak}
                            </div>
                          </div>

                          <div className="text-left sm:text-right">
                            <div className="text-xs opacity-50 line-through">
                              {p.before},-
                            </div>
                            <div className="text-lg font-black text-red-600">
                              {p.now},-
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                          <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-black/10 bg-neutral-50 px-3 py-2 text-sm">
                            <span className="opacity-70">Antall</span>

                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  const next = Math.max(1, qty - 1);
                                  setQty(p.slug, next);
                                  ledger.append(`Antall justert: ${p.title}`, -(p.now * 0.12));
                                }}
                                className="h-8 w-8 rounded-md border border-black/10 bg-white font-black hover:bg-neutral-100"
                                aria-label="Mindre"
                              >
                                −
                              </button>

                              <span className="w-7 text-center font-black">{qty}</span>

                              <button
                                type="button"
                                onClick={() => {
                                  const next = qty + 1;
                                  setQty(p.slug, next);
                                  ledger.append(`Antall justert: ${p.title}`, +(p.now * 0.18));
                                }}
                                className="h-8 w-8 rounded-md border border-black/10 bg-white font-black hover:bg-neutral-100"
                                aria-label="Mer"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <span className="inline-flex w-fit rounded bg-yellow-300 px-2 py-1 text-xs font-semibold">
                            {getBadge(p.now, p.before)}
                          </span>

                          <span className="text-xs opacity-60">{lineState}</span>

                          <button
                            type="button"
                            onClick={() => {
                              remove(p.slug);
                              ledger.append(`Linje fjernet: ${p.title}`, -(p.now * qty));
                            }}
                            className="text-left text-xs opacity-60 underline decoration-2 hover:opacity-90 sm:ml-auto"
                          >
                            Fjern linje
                          </button>
                        </div>

                        <div className="mt-3 text-xs leading-relaxed opacity-70">{p.note}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="border-t border-black/10 bg-neutral-50 px-4 py-4 text-xs leading-relaxed opacity-70 sm:px-6">
            {cartFooter}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
            <div className="text-lg font-black">Oppsummering</div>

            <div className="mt-4 space-y-2 text-sm">
              <Row label="Delsum" value={`${subtotal},-`} />
              <Row label="Frakt" value={shippingValue} />
              <Row label="Rabatt" value={`${discount},-`} />
              <div className="my-3 border-t border-black/10" />
              <Row
                label={<span className="font-black">Sum å forholde seg til</span>}
                value={<span className="text-lg font-black">{total},-</span>}
              />
            </div>

            <div className="mt-4 rounded-2xl border border-black/10 bg-yellow-50 p-4">
              <div className="text-xs font-black uppercase tracking-wide opacity-60">
                Før behandling
              </div>
              <div className="mt-2 text-sm leading-relaxed">
                {checkoutWarning}
              </div>
              <div className="mt-2 text-xs opacity-65">
                God samvittighet kan legges til i neste steg uten å forbedre utfallet.
              </div>
            </div>

            <DiscountBox />

            <CheckoutGate total={total} itemsCount={itemCount} />

            <div className="mt-3 text-xs leading-relaxed opacity-60">{paymentLine}</div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
            <div className="text-sm font-black">Levering og behandling</div>
            <div className="mt-2 text-sm leading-relaxed opacity-80">
              Standard levering: <span className="font-semibold">ubestemt</span>
              <br />
              Ekspress: <span className="font-semibold">fortsatt ubestemt</span>
            </div>
            <div className="mt-3 text-xs leading-relaxed opacity-60">
              Gratis frakt gjelder ved totalsum over 499,-, inntil videre og uten
              forpliktende presedens.
            </div>

            <div className="mt-4 rounded-2xl border border-black/10 bg-neutral-50 p-4">
              <div className="text-xs font-black uppercase tracking-wide opacity-60">
                Intern logg
              </div>
              <div className="mt-3">
                <LedgerPanel className="space-y-0" />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function DiscountBox() {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(false);

  const message =
    applied && code.trim()
      ? `Kode "${code.trim()}" registrert. Ingen prisendring funnet for denne tilstanden.`
      : applied
      ? "Kode registrert. Ingen prisendring funnet for denne tilstanden."
      : "Koder behandles fortløpende og uten garanti for effekt.";

  return (
    <div className="mt-4 rounded-2xl border border-black/10 bg-neutral-50 p-4">
      <div className="text-sm font-black">Rabattkode</div>

      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="KAMPANJEALLTID"
          className="flex-1 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => setApplied(true)}
          className="rounded-xl bg-black px-4 py-2 text-sm font-black text-white hover:opacity-90"
        >
          Bruk
        </button>
      </div>

      <div className="mt-2 text-xs leading-relaxed opacity-70">{message}</div>
    </div>
  );
}

function Row(props: { label: ReactNode; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="opacity-70">{props.label}</div>
      <div className="text-right">{props.value}</div>
    </div>
  );
}