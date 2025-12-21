"use client";

import { useMemo } from "react";
import { PRODUCTS, getLeaks, type Product } from "../lib/products";
import { pick, h32 } from "../lib/visitSeed";
import { useVisitVariant } from "../lib/useVisitVariant";

/* ======================= TYPES ======================= */

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
  available: number;
  eta: string;
  note: string;
  ref: string;
};

/* ======================= CONSTANTS ======================= */

const STATUSES: readonly StockStatus[] = [
  "Til tildeling",
  "Reservert",
  "På vei",
  "Avstemt",
  "Kvalitetssjekk",
  "Feilplassert",
  "Midlertidig utilgjengelig",
];

const ZONES: readonly Zone[] = [
  "Sone A (Kampanje)",
  "Sone B (Retur)",
  "Sone C (Tvil)",
  "Terminal (På vei)",
  "Ukjent (Systemet)",
];

const ETA_OPTIONS = [
  "Ubestemt",
  "Innen 2–4 virkedager*",
  "Neste uke (i teorien)",
  "Så snart markedet er klar",
  "Avventer speditørens humør",
  "Etter intern avklaring",
];

const NOTE_OPTIONS = [
  "Høy etterspørsel. Null tilgjengelighet.",
  "Kampanjelager låst av marked.",
  "Avrundet ned av regnskap.",
  "Plukkbar, men ikke lov å plukke.",
  "Registrert som “tilgjengelig”, men ikke i praksis.",
  "Avhenger av virkeligheten.",
  "Midlertidig hold pga. forventninger.",
];

const MARKET_LINES = [
  "📣 Marked: “Lager er et signal. Null tilgjengelighet betyr høy interesse.”",
  "📣 Marked: “Lageret er stabilt. Stabilt utilgjengelig.”",
  "📣 Marked: “Hvis det er tomt, er det populært.”",
  "📣 Marked: “Vi har mye lager. Bare ikke til deg.”",
];

const ACCOUNTING_LINES = [
  "🧾 Regnskap: “Lager er et tall. Null tilgjengelighet betyr lav risiko.”",
  "🧾 Regnskap: “Tallene stemmer (i snitt).”",
  "🧾 Regnskap: “Avvik registrert. Tiltak utsatt.”",
  "🧾 Regnskap: “Dette er notert.”",
];

/* ======================= HELPERS ======================= */

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

/* ======================= COMPONENT ======================= */

export default function LagerClient() {
  const { mounted, visit, seed } = useVisitVariant("lager");

  // 🔹 Billig før mount
  const stamp = useMemo(() => (mounted ? nowStamp() : ""), [mounted]);

  const rows = useMemo<Row[]>(() => {
    if (!mounted) return [];

    const base = PRODUCTS.map(makeBaseRow);
    const changeCount = 4 + (seed % 4);
    const idxs = new Set<number>();

    while (idxs.size < changeCount && idxs.size < base.length) {
      idxs.add((h32(`pick:${seed}:${idxs.size}`) % base.length) >>> 0);
    }

    return base.map((r, i) => {
      if (!idxs.has(i)) return r;

      const s = h32(`chg:${seed}:${r.p.slug}`);
      const status = pick(STATUSES, s);
      const zone = pick(ZONES, s >>> 2);
      const eta = pick(ETA_OPTIONS, s >>> 4);

      const alloc = Math.min(r.physical, r.alloc + ((s >>> 6) % 3));
      const leak = getLeaks(r.p.slug, 1)[0] ?? "Avventer systemmelding";
      const note = `${pick(NOTE_OPTIONS, s >>> 8)} • SYS: ${leak}`;

      return { ...r, status, zone, eta, alloc, note };
    });
  }, [mounted, seed]);

  const totals = useMemo(() => {
    if (rows.length === 0) {
      return { totalPhysical: 0, totalAlloc: 0, totalAvailable: 0, topStatus: "Avstemt" };
    }

    const totalPhysical = sum(rows.map((r) => r.physical));
    const totalAlloc = sum(rows.map((r) => r.alloc));
    const totalAvailable = sum(rows.map((r) => r.available));

    const byStatus = rows.reduce<Record<string, number>>((acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      return acc;
    }, {});
    const topStatus =
      Object.entries(byStatus).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Avstemt";

    return { totalPhysical, totalAlloc, totalAvailable, topStatus };
  }, [rows]);

  const marketLine = useMemo(() => pick(MARKET_LINES, seed), [seed]);
  const accountingLine = useMemo(() => pick(ACCOUNTING_LINES, seed >>> 3), [seed]);

  if (!mounted) return null;

  /* ======================= RENDER ======================= */

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black">Lager (konsolidert)</h1>
      <div className="mt-2 text-xs opacity-60">
        Oppdatert: <span className="font-black">{stamp}</span> • Besøk:{" "}
        <span className="font-black">{visit}</span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric title="Tilgjengelig nå" value={`${totals.totalAvailable}`} hot />
        <Metric title="Fysisk registrert" value={`${totals.totalPhysical}`} />
        <Metric title="Reservert" value={`${totals.totalAlloc}`} />
        <Metric title="Primær status" value={totals.topStatus} ok />
      </div>

      <div className="mt-6 rounded-xl bg-yellow-300 p-4 border border-black/10">
        <div className="font-semibold">{marketLine}</div>
        <div className="text-xs opacity-70">{accountingLine}</div>
      </div>

      <div className="mt-6 text-sm opacity-70">
        Lageret er konsistent. Konsistent utilgjengelig.
      </div>
    </main>
  );
}

/* ======================= SMALL UI ======================= */

function Metric({
  title,
  value,
  hot,
  ok,
}: {
  title: string;
  value: string;
  hot?: boolean;
  ok?: boolean;
}) {
  const cls = hot
    ? "bg-red-600 text-white"
    : ok
      ? "bg-green-600 text-white"
      : "bg-white";

  return (
    <div className={`rounded-xl border border-black/10 p-4 ${cls}`}>
      <div className="text-xs font-black opacity-70">{title}</div>
      <div className="text-2xl font-black">{value}</div>
    </div>
  );
}
