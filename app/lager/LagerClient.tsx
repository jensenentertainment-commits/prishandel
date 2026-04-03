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
  available: number;
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
  "📣 Marked: “Lager er et signal.”",
  "📣 Marked: “Lager er en følelse.”",
  "📣 Marked: “Lager er nesten klart.”",
  "📣 Marked: “Hvis det er tomt, er det populært.”",
] as const;

const ACCOUNTING_LINES = [
  "🧾 Regnskap: “Tallene stemmer nok.”",
  "🧾 Regnskap: “Tallene stemmer (i snitt).”",
  "🧾 Regnskap: “Tallene stemmer hvis du ikke spør.”",
  "🧾 Regnskap: “Avvik registrert. Tiltak utsatt.”",
] as const;

function sum(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0);
}

function pseudoStamp(seed: number) {
  const hh = String(8 + (h32(`lager:hh:${seed}`) % 9)).padStart(2, "0");
  const mm = String(h32(`lager:mm:${seed}`) % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function statusBadgeClasses(status: StockStatus) {
  switch (status) {
    case "Midlertidig utilgjengelig":
      return "bg-red-600 text-white";
    case "Feilplassert":
      return "bg-yellow-300 text-black";
    case "Kvalitetssjekk":
      return "bg-black text-yellow-300";
    case "Reservert":
      return "bg-black text-white";
    case "På vei":
      return "bg-neutral-200 text-black";
    case "Til tildeling":
      return "bg-white text-black border border-black/20";
    case "Avstemt":
      return "bg-neutral-100 text-black";
  }
}

function makeBaseRow(p: Product): Row {
  const seed = h32(p.slug);

  const status = pick(STATUSES, seed);
  const zone = pick(ZONES, seed >>> 3);

  const physical = 1 + ((seed >>> 7) % 38);
  const allocBase = 1 + ((seed >>> 11) % 14);
  const alloc = Math.min(physical, allocBase + (status === "Reservert" ? 7 : 0));

  const availableBase = seed % 11 === 0 ? 1 : 0;
  const available =
    status === "Feilplassert" || status === "Midlertidig utilgjengelig" || status === "Kvalitetssjekk"
      ? 0
      : Math.min(Math.max(physical - alloc, 0), availableBase);

  const eta = pick(ETA_OPTIONS, seed >>> 2);
  const leak = getLeaks(p.slug, 1)[0] ?? "Avventer systemmelding";
  const note = `${pick(NOTE_OPTIONS, seed >>> 5)} • SYS: ${leak}`;
  const ref = `LG-${(seed % 900000) + 100000}`;

  return { p, status, zone, physical, alloc, available, eta, note, ref };
}

export default function LagerClient() {
  const { mounted, visit, seed } = useVisitVariant("lager");
  const stableSeed = mounted ? seed : 0;
  const stableVisit = mounted ? visit : "—";
  const updatedAt = pseudoStamp(stableSeed);

  const rows = useMemo<Row[]>(() => {
    const base = PRODUCTS.map(makeBaseRow);
    const changeCount = 4 + (stableSeed % 4);
    const idxs = new Set<number>();

    while (idxs.size < changeCount && idxs.size < base.length) {
      idxs.add((h32(`pick:${stableSeed}:${idxs.size}`) % base.length) >>> 0);
    }

    return base.map((r, i) => {
      if (!idxs.has(i)) return r;

      const s = h32(`chg:${stableSeed}:${r.p.slug}`);
      const status = pick(STATUSES, s);
      const zone = pick(ZONES, s >>> 2);
      const eta = pick(ETA_OPTIONS, s >>> 4);

      const alloc = Math.min(r.physical, r.alloc + ((s >>> 6) % 3));
      const availableBase = s % 13 === 0 ? 1 : 0;
      const available =
        status === "Feilplassert" ||
        status === "Midlertidig utilgjengelig" ||
        status === "Kvalitetssjekk"
          ? 0
          : Math.min(Math.max(r.physical - alloc, 0), availableBase);

      const leak = getLeaks(r.p.slug, 1)[0] ?? "Avventer systemmelding";
      const note = `${pick(NOTE_OPTIONS, s >>> 8)} • SYS: ${leak}`;

      return { ...r, status, zone, eta, alloc, available, note };
    });
  }, [stableSeed]);

  const totals = useMemo(() => {
    const totalPhysical = sum(rows.map((r) => r.physical));
    const totalAlloc = sum(rows.map((r) => r.alloc));
    const totalAvailable = sum(rows.map((r) => r.available));
    const notPluckable = rows.filter(
      (r) => r.available === 0 && (r.physical > 0 || r.alloc > 0),
    ).length;

    const byStatus = rows.reduce<Record<string, number>>((acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      return acc;
    }, {});

    const topStatus =
      Object.entries(byStatus).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Avstemt";

    return {
      totalPhysical,
      totalAlloc,
      totalAvailable,
      notPluckable,
      topStatus,
    };
  }, [rows]);

  const marketLine = pick(MARKET_LINES, stableSeed);
  const accountingLine = pick(ACCOUNTING_LINES, stableSeed >>> 3);

  const criticalLine = useMemo(() => {
    return pick(
      [
        "KRITISK LAGERFORHOLD: Registrert fysisk beholdning kan ikke omsettes direkte.",
        "KRITISK LAGERFORHOLD: Tilgjengelighet er underordnet kampanjemessig behov.",
        "KRITISK LAGERFORHOLD: Lagerstatus og faktisk plukkbarhet avviker.",
        "KRITISK LAGERFORHOLD: Null tilgjengelighet opprettholdes med høy selvtillit.",
      ] as const,
      stableSeed >>> 5,
    );
  }, [stableSeed]);

  const ticker = [
    `TILGJENGELIG ${totals.totalAvailable}`,
    `FYSISK ${totals.totalPhysical}`,
    `RESERVERT ${totals.totalAlloc}`,
    `IKKE PLUKKBART ${totals.notPluckable}`,
    `PRIMÆR ${totals.topStatus.toUpperCase()}`,
  ].join("  •  ");

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded bg-black px-3 py-1 text-xs font-black text-yellow-300">
            INTERN LAGEROVERSIKT
          </div>

          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
            Lager (konsolidert)
          </h1>

          <p className="mt-2 max-w-3xl text-lg opacity-80">
            Registrert beholdning, tildeling og tilgjengelighet. Enkelte varer finnes
            fysisk uten å være praktisk oppnåelige.
          </p>

          <div className="mt-2 text-xs font-semibold opacity-60">
            Besøk: <span className="font-black">{stableVisit}</span> • Oppdatering:{" "}
            {updatedAt} • samtykke: nei
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href="/butikk"
            className="rounded-xl bg-red-600 px-4 py-3 font-black text-white hover:opacity-90"
          >
            Butikk →
          </a>
          <a
            href="/kampanjer"
            className="rounded-xl border border-black/20 bg-white px-4 py-3 font-black text-black hover:bg-black/5"
          >
            Kampanjer
          </a>
        </div>
      </div>

      <section className="mt-8 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
        <div className="border-b border-black/10 bg-black px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-yellow-300">
          {ticker}
        </div>

        <div className="border-b border-black/10 bg-red-600 px-5 py-4 text-white">
          <div className="inline-flex items-center gap-2 rounded bg-white/15 px-2 py-1 text-xs font-black">
            <span className="inline-block h-2 w-2 rounded-full bg-white" />
            KRITISK LAGERMELDING
          </div>
          <div className="mt-2 text-xl font-black md:text-2xl">{criticalLine}</div>
          <div className="mt-1 text-xs opacity-90">
            Tiltak foreslått. Videre oppfølging vurderes uten bindende framdrift.
          </div>
        </div>

        <div className="grid gap-3 border-b border-black/10 p-5 sm:grid-cols-2 xl:grid-cols-5">
          <Metric title="Tilgjengelig nå" value={`${totals.totalAvailable}`} tone="danger" />
          <Metric title="Fysisk registrert" value={`${totals.totalPhysical}`} />
          <Metric title="Reservert" value={`${totals.totalAlloc}`} />
          <Metric title="Ikke plukkbart" value={`${totals.notPluckable}`} tone="warning" />
          <Metric title="Primær tilstand" value={totals.topStatus} tone="dark" />
        </div>

        <div className="border-b border-black/10 bg-yellow-300 px-5 py-4 text-black">
          <div className="font-semibold">{marketLine}</div>
          <div className="mt-1 text-xs opacity-80">{accountingLine}</div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[980px]">
            <div className="grid grid-cols-12 border-b border-black/10 bg-neutral-50 px-4 py-3 text-xs font-black">
              <div className="col-span-3">Produkt</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Sone</div>
              <div className="col-span-1 text-right">Fysisk</div>
              <div className="col-span-1 text-right">Res.</div>
              <div className="col-span-1 text-right">Tilgj.</div>
              <div className="col-span-2">ETA</div>
            </div>

            <div className="divide-y divide-black/10">
              {rows.map((r, index) => {
                const emphasized =
                  r.status === "Midlertidig utilgjengelig" ||
                  r.status === "Feilplassert" ||
                  index === 1;

                return (
                  <div
                    key={r.p.slug}
                    className={["px-4 py-4", emphasized ? "bg-red-50" : "bg-white"].join(" ")}
                  >
                    <div className="grid grid-cols-12 items-start gap-3">
                      <div className="col-span-3 min-w-0">
                        <div className="font-black">{r.p.title}</div>
                        <div className="mt-1 text-xs opacity-60">{r.ref}</div>
                      </div>

                      <div className="col-span-2">
                        <span
                          className={`inline-flex rounded px-2 py-1 text-xs font-black ${statusBadgeClasses(
                            r.status,
                          )}`}
                        >
                          {r.status}
                        </span>
                      </div>

                      <div className="col-span-2 text-sm opacity-80">{r.zone}</div>

                      <div className="col-span-1 text-right text-sm font-black">
                        {r.physical}
                      </div>
                      <div className="col-span-1 text-right text-sm font-black">
                        {r.alloc}
                      </div>
                      <div className="col-span-1 text-right text-sm font-black">
                        {r.available}
                      </div>

                      <div className="col-span-2 text-sm opacity-80">{r.eta}</div>
                    </div>

                    <div className="mt-3 rounded-2xl border border-black/10 bg-neutral-50 px-3 py-3 text-sm opacity-80">
                      {r.note}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-black/10 bg-neutral-50 px-5 py-3 text-xs font-black">
          🧾 Regnskap: “Lageret er dokumentert.” <span className="opacity-40">•</span> 📣
          Marked: “Lageret er nesten klart.”
        </div>
      </section>

      <div className="mt-8 text-xs opacity-60">
        Registrert beholdning og faktisk tilgjengelighet kan avvike uten at dette
        anses som separat lagerfeil.
      </div>
    </main>
  );
}

function Metric({
  title,
  value,
  tone,
}: {
  title: string;
  value: string;
  tone?: "danger" | "warning" | "dark";
}) {
  const cls =
    tone === "danger"
      ? "bg-red-600 text-white"
      : tone === "warning"
        ? "bg-yellow-300 text-black"
        : tone === "dark"
          ? "bg-black text-yellow-300"
          : "bg-white text-black";

  return (
    <div className={`rounded-2xl border border-black/10 p-4 ${cls}`}>
      <div className="text-xs font-black opacity-70">{title}</div>
      <div className="mt-1 text-2xl font-black tracking-tight">{value}</div>
    </div>
  );
}