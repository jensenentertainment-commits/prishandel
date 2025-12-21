"use client";

import { useMemo } from "react";
import { PRODUCTS, getLeaks, type Product } from "../lib/products";
import { pick, h32 } from "../lib/visitSeed";
import { useVisitVariant } from "../lib/useVisitVariant";

type StockStatus =
  | "Til tildeling"
  | "Reservert"
  | "På vei"
  | "Avstemt"
  | "Kvalitetssjekk"
  | "Feilplassert"
  | "Midlertidig utilgjengelig";

type Zone =
  | "Sone A (Kampanje)"
  | "Sone B (Retur)"
  | "Sone C (Tvil)"
  | "Terminal (På vei)"
  | "Ukjent (Systemet)";

type Row = {
  p: Product;
  status: StockStatus;
  zone: Zone;
  physical: number;
  alloc: number;
  available: number; // alltid 0
  eta: string;
  note: string;
  ref: string;
};

const STATUSES: readonly StockStatus[] = [
  "Til tildeling",
  "Reservert",
  "På vei",
  "Avstemt",
  "Kvalitetssjekk",
  "Feilplassert",
  "Midlertidig utilgjengelig",
] as const;

const ZONES: readonly Zone[] = [
  "Sone A (Kampanje)",
  "Sone B (Retur)",
  "Sone C (Tvil)",
  "Terminal (På vei)",
  "Ukjent (Systemet)",
] as const;

const ETA_OPTIONS = [
  "Ubestemt",
  "Innen 2–4 virkedager*",
  "Neste uke (i teorien)",
  "Så snart markedet er klar",
  "Avventer speditørens humør",
  "Etter intern avklaring",
] as const;

const NOTE_OPTIONS = [
  "Høy etterspørsel. Null tilgjengelighet.",
  "Kampanjelager låst av marked.",
  "Avrundet ned av regnskap.",
  "Plukkbar, men ikke lov å plukke.",
  "Registrert som “tilgjengelig”, men ikke i praksis.",
  "Avhenger av virkeligheten.",
  "Midlertidig hold pga. forventninger.",
] as const;

const MARKET_LINES = [
  "📣 Marked: “Lager er et signal. Null tilgjengelighet betyr høy interesse.”",
  "📣 Marked: “Lageret er stabilt. Stabilt utilgjengelig.”",
  "📣 Marked: “Hvis det er tomt, er det populært.”",
  "📣 Marked: “Vi har mye lager. Bare ikke til deg.”",
] as const;

const ACCOUNTING_LINES = [
  "🧾 Regnskap: “Lager er et tall. Null tilgjengelighet betyr lav risiko.”",
  "🧾 Regnskap: “Tallene stemmer (i snitt).”",
  "🧾 Regnskap: “Avvik registrert. Tiltak utsatt.”",
  "🧾 Regnskap: “Dette er notert.”",
] as const;

function pad2(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

function nowStamp() {
  const d = new Date();
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()} ${pad2(
    d.getHours(),
  )}:${pad2(d.getMinutes())}`;
}

function sum(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0);
}

function makeBaseRow(p: Product): Row {
  const seed = h32(p.slug);

  const status = pick(STATUSES, seed);
  const zone = pick(ZONES, seed >>> 3);

  const physical = 1 + ((seed >>> 7) % 38);
  const allocBase = 1 + ((seed >>> 11) % 14);
  const alloc = Math.min(physical, allocBase + (status === "Reservert" ? 7 : 0));

  const available = 0;

  const eta = pick(ETA_OPTIONS, seed >>> 2);
  const leak = getLeaks(p.slug, 1)[0] ?? "Avventer systemmelding";
  const note = `${pick(NOTE_OPTIONS, seed >>> 5)} • SYS: ${leak}`;

  const ref = `LG-${(seed % 900000) + 100000}`;

  return { p, status, zone, physical, alloc, available, eta, note, ref };
}

function StatusPill({ s }: { s: StockStatus }) {
  const cls =
    s === "Reservert"
      ? "bg-black text-white"
      : s === "På vei"
        ? "bg-yellow-300 text-black"
        : s === "Kvalitetssjekk"
          ? "bg-green-600 text-white"
          : s === "Feilplassert"
            ? "bg-red-600 text-white"
            : "bg-white text-black border border-black/15";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-black ${cls}`}
      title="Status kan avvike fra virkeligheten"
    >
      {s}
    </span>
  );
}

function MetricCard(props: {
  title: string;
  value: string;
  sub?: string;
  tone?: "neutral" | "hot" | "ok";
}) {
  const tone =
    props.tone === "hot"
      ? "bg-red-600 text-white"
      : props.tone === "ok"
        ? "bg-green-600 text-white"
        : "bg-white text-black";

  return (
    <div className={`rounded-2xl border border-black/10 shadow-sm p-5 ${tone}`}>
      <div className="text-xs font-black opacity-80">{props.title}</div>
      <div className="mt-1 text-2xl font-black tabular-nums">{props.value}</div>
      {props.sub && <div className="mt-1 text-xs opacity-80">{props.sub}</div>}
    </div>
  );
}

export default function LagerClient() {
  const { mounted, visit, seed } = useVisitVariant("lager");

  const stamp = useMemo(() => (mounted ? nowStamp() : ""), [mounted, visit]);

  const rows = useMemo(() => {
    // base rows (stabile per produkt)
    let base = PRODUCTS.map(makeBaseRow);

    // “levende” justering: plukk noen rader og gi nye status/zone/eta per besøk
    const changeCount = 4 + (seed % 4); // 4..7 rader
    const idxs = new Set<number>();

    while (idxs.size < changeCount && idxs.size < base.length) {
      const i = (h32(`pick:${seed}:${idxs.size}`) % base.length) >>> 0;
      idxs.add(i);
    }

    const changed = base.map((r, i) => {
      if (!idxs.has(i)) return r;

      const s = h32(`chg:${seed}:${r.p.slug}`);

      // nye “forklaringer”
      const status = pick(STATUSES, s);
      const zone = pick(ZONES, s >>> 2);
      const eta = pick(ETA_OPTIONS, s >>> 4);

      // behold tall, men gjør det litt “intern avstemming”
      const physical = r.physical;
      const alloc = Math.min(physical, r.alloc + ((s >>> 6) % 3)); // 0..2 ekstra “reservert”
      const available = 0;

      const leak = getLeaks(r.p.slug, 1)[0] ?? "Avventer systemmelding";
      const note = `${pick(NOTE_OPTIONS, s >>> 8)} • SYS: ${leak}`;

      return { ...r, status, zone, eta, physical, alloc, available, note };
    });

    return changed;
  }, [seed]);

  const totals = useMemo(() => {
    const totalPhysical = sum(rows.map((r) => r.physical));
    const totalAlloc = sum(rows.map((r) => r.alloc));
    const totalAvailable = sum(rows.map((r) => r.available));

    const byStatus = rows.reduce<Record<string, number>>((acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      return acc;
    }, {});
    const topStatus = Object.entries(byStatus).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Avstemt";

    return { totalPhysical, totalAlloc, totalAvailable, topStatus };
  }, [rows]);

  const marketLine = useMemo(() => pick(MARKET_LINES, seed), [seed]);
  const accountingLine = useMemo(() => pick(ACCOUNTING_LINES, seed >>> 3), [seed]);

  // unngå mismatch: vent til mounted
  if (!mounted) return null;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Lager (konsolidert)</h1>
          <p className="mt-2 text-sm opacity-80 max-w-2xl">
            Dette er et salgsdrevet lagerbilde: tallene er korrekte nok til å friste deg, og
            utilstrekkelige nok til å levere.
          </p>
          <div className="mt-2 text-xs font-semibold opacity-60">
            Oppdatert: <span className="font-black">{stamp}</span> • Kilde: “systemet” •
            Nøyaktighet: rimelig • Besøk: <span className="font-black">{visit}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <a
            href="/kampanjer"
            className="rounded-xl bg-red-600 text-white px-4 py-2 font-black hover:opacity-90"
          >
            Aktiver kampanjer →
          </a>
          <a
            href="/butikk"
            className="rounded-xl bg-white text-black px-4 py-2 font-black border border-black/20 hover:bg-black/5"
          >
            Tilbake til butikk
          </a>
        </div>
      </div>

      {/* KPI row */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Tilgjengelig nå" value={`${totals.totalAvailable}`} sub="Gjelder i praksis." tone="hot" />
        <MetricCard title="Fysisk registrert" value={`${totals.totalPhysical}`} sub="Gjelder i systemet." />
        <MetricCard title="Reservert / tildelt" value={`${totals.totalAlloc}`} sub="Gjelder for forventninger." />
        <MetricCard title="Primær status" value={totals.topStatus} sub="Mest brukt forklaring." tone="ok" />
      </div>

      {/* Selling banner */}
      <div className="mt-6 rounded-2xl bg-yellow-300 border border-black/10 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-black">Intern kommunikasjon</div>
            <div className="mt-1 text-sm font-semibold">{marketLine}</div>
            <div className="mt-1 text-[11px] font-semibold opacity-70">{accountingLine}</div>
          </div>
          <a
            href="/kampanjer"
            className="shrink-0 rounded-xl bg-black text-white px-5 py-3 font-black hover:opacity-90"
          >
            Se kampanjer som uansett er utsolgt →
          </a>
        </div>
      </div>

      {/* Table */}
      <section className="mt-6 rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden">
        <div className="border-b border-black/10 px-6 py-4 flex items-center justify-between gap-3">
          <div className="font-black">Beholdning per vare</div>
          <div className="text-[11px] font-semibold opacity-70">
            Visning: intern • Utløp: aldri • Levering: ubestemt
          </div>
        </div>

        <div className="overflow-auto">
          <table className="min-w-[980px] w-full text-sm">
            <thead className="bg-neutral-50 border-b border-black/10">
              <tr className="text-left">
                <th className="px-6 py-3 font-black">Vare</th>
                <th className="px-4 py-3 font-black">Status</th>
                <th className="px-4 py-3 font-black">Lokasjon</th>
                <th className="px-4 py-3 font-black text-right">Fysisk</th>
                <th className="px-4 py-3 font-black text-right">Reservert</th>
                <th className="px-4 py-3 font-black text-right">Tilgjengelig</th>
                <th className="px-4 py-3 font-black">ETA</th>
                <th className="px-6 py-3 font-black">Notat</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-black/10">
              {rows.map((r) => (
                <tr key={r.p.slug} className="hover:bg-black/[0.02]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-neutral-50 border border-black/10 overflow-hidden grid place-items-center">
                        <img
                          src={`/products/${r.p.slug}.svg`}
                          alt={r.p.title}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <a
                          href={`/produkt/${r.p.slug}`}
                          className="font-black hover:underline truncate block"
                        >
                          {r.p.title}
                        </a>
                        <div className="text-[11px] opacity-60">
                          Ref: <span className="font-semibold">{r.ref}</span> • Pris:{" "}
                          <span className="font-semibold tabular-nums">{r.p.now},-</span> • Lager:{" "}
                          <span className="font-semibold">0</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <StatusPill s={r.status} />
                  </td>

                  <td className="px-4 py-4">
                    <div className="font-semibold">{r.zone}</div>
                  </td>

                  <td className="px-4 py-4 text-right tabular-nums font-black">{r.physical}</td>
                  <td className="px-4 py-4 text-right tabular-nums font-black">{r.alloc}</td>

                  <td className="px-4 py-4 text-right tabular-nums font-black text-red-600">
                    {r.available}
                  </td>

                  <td className="px-4 py-4">
                    <div className="text-xs font-semibold opacity-80">{r.eta}</div>
                    <div className="text-[11px] opacity-60">*kan avvike</div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-xs font-semibold opacity-80">{r.note}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-neutral-50 border-t border-black/10 text-xs opacity-70">
          *“Fysisk” viser registrert antall. “Reservert” viser salgsforventning. “Tilgjengelig”
          viser virkelighet. Disse tre er ikke kompatible.
        </div>
      </section>

      {/* Footer blocks */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-white border border-black/10 shadow-sm p-6">
          <div className="text-sm font-black">Salgsprotokoll (kort)</div>
          <ul className="mt-3 space-y-2 text-sm opacity-80">
            <li><span className="font-semibold">1.</span> Vis stort tall.</li>
            <li><span className="font-semibold">2.</span> Selg følelsen av tilgjengelighet.</li>
            <li><span className="font-semibold">3.</span> Lever “ubestemt”.</li>
          </ul>
          <div className="mt-3 text-xs opacity-60">*Protokollen er godkjent i teorien.</div>
        </div>

        <div className="rounded-2xl bg-white border border-black/10 shadow-sm p-6">
          <div className="text-sm font-black">Vanlige spørsmål (internt)</div>
          <div className="mt-3 space-y-3 text-sm opacity-80">
            <div>
              <div className="font-semibold">Hvorfor står det 0 tilgjengelig?</div>
              <div className="text-xs opacity-70 mt-0.5">Fordi tilgjengelighet er en følelse, ikke en verdi.</div>
            </div>
            <div>
              <div className="font-semibold">Kan vi åpne for bestilling?</div>
              <div className="text-xs opacity-70 mt-0.5">Ja. Bestilling kan avvike fra virkeligheten.</div>
            </div>
            <div>
              <div className="font-semibold">Hva gjør regnskap?</div>
              <div className="text-xs opacity-70 mt-0.5">Noterer. Avrunder. Bekrefter.</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-yellow-300 border border-black/10 p-6">
          <div className="text-sm font-black">Kampanjer basert på lager</div>
          <div className="mt-2 text-sm font-semibold">
            Når lageret er tomt, øker kampanjeverdien. Systemet anbefaler derfor kampanje nå.
          </div>
          <div className="mt-3 grid gap-2">
            <a
              href="/kampanjer"
              className="rounded-xl bg-red-600 text-white px-4 py-3 font-black text-center hover:opacity-90"
            >
              Start kampanje →
            </a>
            <a
              href="/utsolgt"
              className="rounded-xl bg-white text-black px-4 py-3 font-black text-center border border-black/20 hover:bg-black/5"
            >
              Bekreft utsolgt →
            </a>
          </div>
          <div className="mt-3 text-xs opacity-70">
            *Kampanjer gjelder i teorien og ved høy nok forventning.
          </div>
        </div>
      </div>
    </main>
  );
}
