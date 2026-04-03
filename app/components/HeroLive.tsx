"use client";

import { useEffect, useMemo, useState } from "react";

type Accent = "yellow" | "red" | "black";

type HeroItem = {
  accent: Accent;
  kickerTag: string;
  kickerTail: string;
  title: string;
  body: string;
  highlight: string;
  footnote: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  statusLabel: string;
  statusNote: string;
  metrics: {
    pressure: [number, number];
    integrity: [number, number];
    availability: [number, number];
  };
  viewers: [number, number];
  codePrefix: string;
};

const HEROES: HeroItem[] = [
  {
    accent: "yellow",
    kickerTag: "KAMPANJEDRIFT",
    kickerTail: "personer følger prispress uten medvirkning akkurat nå*",
    title: "Alt er på tilbud. Ingenting er tilgjengelig.",
    body: "Kontinuerlig prispress. Aggressive kampanjer. Null lager.",
    highlight: "Alt må vekk.",
    footnote: "*Medvirkning kan være registrert uten å ha funnet sted.",
    primaryHref: "/butikk",
    primaryLabel: "SE VARER",
    secondaryHref: "/kampanjer",
    secondaryLabel: "GÅ TIL KAMPANJE",
    statusLabel: "Operativ kampanje",
    statusNote: "Prisflaten er aktiv. Tilgjengelighet vurderes separat.",
    metrics: {
      pressure: [74, 93],
      integrity: [81, 92],
      availability: [3, 18],
    },
    viewers: [8, 27],
    codePrefix: "K-LIVE",
  },
  {
    accent: "black",
    kickerTag: "LAGERMELDING",
    kickerTail: "personer vurderer “snart på lager” som informasjon akkurat nå*",
    title: "Snart på lager. Tomme løfter.",
    body: "Vi jobber hardt med å skaffe varer vi ikke har klart å stå inne for.",
    highlight: "Takk for tålmodigheten.",
    footnote: "*Informasjon kan opprettholdes selv når grunnlaget er svakt.",
    primaryHref: "/butikk",
    primaryLabel: "SE UTVALG",
    secondaryHref: "/utsolgt",
    secondaryLabel: "VIS TILGJENGELIGHET",
    statusLabel: "Forsyning under formulering",
    statusNote: "Lagerfølelse er opprettholdt uten å binde seg til varer.",
    metrics: {
      pressure: [52, 71],
      integrity: [84, 96],
      availability: [0, 9],
    },
    viewers: [5, 18],
    codePrefix: "L-STOCK",
  },
  {
    accent: "red",
    kickerTag: "REGNSKAP",
    kickerTail: "personer observerer marginarbeid uten innsyn akkurat nå*",
    title: "Prisene er satt lavt nok til å skape intern uro.",
    body: "Vi kaller det kampanje. Regnskap kaller det en pågående vurdering.",
    highlight: "Begge anses som gyldige.",
    footnote: "*Innsyn kan være begrenset av hensyn til flyt, tempo og stemning.",
    primaryHref: "/kampanjer",
    primaryLabel: "SE PRISENE",
    secondaryHref: "/butikk",
    secondaryLabel: "VURDER VARER",
    statusLabel: "Margintrykk registrert",
    statusNote: "Prisnivået er opprettholdt. Begrunnelsen arbeides det med.",
    metrics: {
      pressure: [81, 97],
      integrity: [72, 86],
      availability: [7, 22],
    },
    viewers: [6, 21],
    codePrefix: "R-MRGN",
  },
];

const STATUS_TICKERS = [
  "Oppdatering registrert",
  "Tilstand opprettholdt",
  "Manuell korrigering utsatt",
  "Internt notat oppdatert",
  "Prisflate under observasjon",
  "Begrunnelse under arbeid",
] as const;

function hashString(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i);
  }
  return Math.abs(h);
}

function prng(seed: number) {
  const M = 0x7fffffff;
  let x = seed % M;
  if (x <= 0) x += M - 1;

  return () => {
    x = Math.imul(48271, x) % M;
    if (x <= 0) x += M - 1;
    return x / M;
  };
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function lerp(min: number, max: number, t: number) {
  return min + (max - min) * t;
}

function buildSeed() {
  const now = new Date();
  const cycle = Math.floor(now.getTime() / (1000 * 60 * 59));
  const tz =
    typeof window !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown"
      : "server";
  const lang =
    typeof window !== "undefined" ? navigator.language || "no-NO" : "server";

  return hashString(`${cycle}|${tz}|${lang}|prishandel-hero-live-v2`);
}

function formatCode(prefix: string, n: number) {
  return `${prefix}-${String(n).padStart(3, "0")}`;
}

function accentClasses(accent: Accent) {
  switch (accent) {
    case "red":
      return {
        badge: "bg-red-600 text-white",
        line: "bg-red-600",
        tint: "bg-red-500/[0.08]",
        chip: "bg-red-50 text-red-700 border border-red-100",
      };
    case "black":
      return {
        badge: "bg-black text-yellow-300",
        line: "bg-black",
        tint: "bg-black/[0.05]",
        chip: "bg-neutral-100 text-black border border-black/10",
      };
    default:
      return {
        badge: "bg-black text-yellow-300",
        line: "bg-black",
        tint: "bg-yellow-400/[0.10]",
        chip: "bg-yellow-50 text-black border border-yellow-100",
      };
  }
}

type BaseData = {
  item: HeroItem;
  accent: ReturnType<typeof accentClasses>;
  code: string;
  baseViewers: number;
  basePressure: number;
  baseIntegrity: number;
  baseAvailability: number;
  baseCoverage: number;
  baseFriction: number;
};

export default function HeroLive() {
  const [seed, setSeed] = useState<number | null>(null);
  const [pulse, setPulse] = useState(0);
  const [statusTick, setStatusTick] = useState(0);

  useEffect(() => {
    setSeed(buildSeed());
  }, []);

  useEffect(() => {
    if (seed === null) return;

    const pulseId = window.setInterval(() => {
      setPulse((p) => p + 1);
    }, 4200);

    const statusId = window.setInterval(() => {
      setStatusTick((s) => s + 1);
    }, 9000);

    return () => {
      window.clearInterval(pulseId);
      window.clearInterval(statusId);
    };
  }, [seed]);

  const base = useMemo<BaseData | null>(() => {
    if (seed === null) return null;

    const item = HEROES[seed % HEROES.length];
    const rnd = prng(seed);
    const accent = accentClasses(item.accent);

    const baseViewers = Math.round(lerp(item.viewers[0], item.viewers[1], rnd()));
    const basePressure = clamp(
      lerp(item.metrics.pressure[0], item.metrics.pressure[1], rnd()),
      0,
      100
    );
    const baseIntegrity = clamp(
      lerp(item.metrics.integrity[0], item.metrics.integrity[1], rnd()),
      0,
      100
    );
    const baseAvailability = clamp(
      lerp(item.metrics.availability[0], item.metrics.availability[1], rnd()),
      0,
      100
    );

    const baseCoverage = 38 + Math.floor(rnd() * 53);
    const baseFriction = 12 + Math.floor(rnd() * 78);
    const code = formatCode(item.codePrefix, 100 + Math.floor(rnd() * 900));

    return {
      item,
      accent,
      code,
      baseViewers,
      basePressure,
      baseIntegrity,
      baseAvailability,
      baseCoverage,
      baseFriction,
    };
  }, [seed]);

  const live = useMemo(() => {
    if (!base) return null;

    const viewerDrift = ((pulse % 5) - 2); // -2 til +2
    const pressureDrift = ((pulse % 3) - 1) * 0.8; // -0.8, 0, +0.8
    const integrityDrift = ((pulse % 4) - 1.5) * 0.45; // små bevegelser
    const availabilityDrift = ((pulse % 3) - 1) * 1.2;
    const coverageDrift = ((pulse % 4) - 1.5) * 1.5;
    const frictionDrift = ((pulse % 5) - 2) * 1.2;

    const viewers = clamp(
      Math.round(base.baseViewers + viewerDrift),
      base.item.viewers[0],
      base.item.viewers[1] + 3
    );

    const pressure = clamp(base.basePressure + pressureDrift, 0, 100);
    const integrity = clamp(base.baseIntegrity + integrityDrift, 0, 100);
    const availability = clamp(base.baseAvailability + availabilityDrift, 0, 100);

    const coverage = clamp(Math.round(base.baseCoverage + coverageDrift), 0, 100);
    const friction = clamp(Math.round(base.baseFriction + frictionDrift), 0, 100);

    const tickerA = STATUS_TICKERS[statusTick % STATUS_TICKERS.length];
    const tickerB = STATUS_TICKERS[(statusTick + 2) % STATUS_TICKERS.length];
    const tickerC = STATUS_TICKERS[(statusTick + 4) % STATUS_TICKERS.length];

    const meta = [
      { label: "Intern kode", value: base.code },
      { label: "Dekning", value: `${coverage}%` },
      { label: "Friksjon", value: `${friction}%` },
      { label: "Status", value: base.item.statusLabel },
    ];

    return {
      ...base,
      viewers,
      pressure,
      integrity,
      availability,
      meta,
      ticker: [tickerA, tickerB, tickerC],
    };
  }, [base, pulse, statusTick]);

  if (!live) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded bg-black px-3 py-1 text-xs font-black text-yellow-300">
            KAMPANJEDRIFT
          </span>
          <span className="text-sm font-semibold opacity-70">
            Initialiserer prisflate og formulert trygghet…
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-black leading-tight md:text-5xl lg:text-7xl">
            Tilbudet lastes. Tilgjengeligheten følger ikke nødvendigvis med.
          </h1>
          <p className="max-w-2xl text-lg font-medium opacity-80">
            Systemet forbereder kampanjestatus, lagerfølelse og intern begrunnelse.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className={`rounded px-3 py-1 text-xs font-black ${live.accent.badge}`}>
          {live.item.kickerTag}
        </span>
        <span className="text-sm font-semibold opacity-80 transition-opacity duration-300">
          {live.viewers} {live.item.kickerTail}
        </span>
      </div>

      <div className="space-y-3">
        <h1 className="text-4xl font-black leading-tight md:text-5xl lg:text-7xl">
          {live.item.title}
        </h1>

        <p className="max-w-2xl text-lg font-medium opacity-80">
          {live.item.body} <span className="font-bold">{live.item.highlight}</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <a
          href={live.item.primaryHref}
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-4 text-sm font-black text-white transition hover:bg-red-700"
        >
          {live.item.primaryLabel}
          <span aria-hidden>→</span>
        </a>

        <a
          href={live.item.secondaryHref}
          className="inline-flex items-center gap-2 rounded-xl border border-black/20 px-6 py-4 text-sm font-black transition hover:bg-black/5"
        >
          {live.item.secondaryLabel}
        </a>
      </div>

      <div className="flex flex-wrap gap-2">
        {live.meta.map((item) => (
          <div
            key={`${item.label}-${item.value}`}
            className="rounded-lg border border-black/10 bg-white/70 px-3 py-2 text-[11px] transition-all duration-300"
          >
            <span className="font-semibold opacity-50">{item.label}:</span>{" "}
            <span className="font-black">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="text-xs opacity-60">{live.item.footnote}</div>

      <div className={`rounded-2xl border border-black/10 p-4 ${live.accent.tint}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-black uppercase tracking-wide opacity-60">
              Intern driftstatus
            </div>
            <div className="mt-1 text-base font-black">{live.item.statusNote}</div>
          </div>

          <span className={`rounded px-2 py-1 text-[11px] font-black ${live.accent.badge}`}>
            Notert
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Metric
            label="Prispress"
            value={live.pressure}
            note="Aktiv"
            accent={live.item.accent}
          />
          <Metric
            label="Integritet"
            value={live.integrity}
            note="Notert"
            accent={live.item.accent}
          />
          <Metric
            label="Tilgjengelighet"
            value={live.availability}
            note="Lav"
            accent={live.item.accent}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide opacity-55">
          <span>{live.ticker[0]}</span>
          <span>•</span>
          <span>{live.ticker[1]}</span>
          <span>•</span>
          <span>{live.ticker[2]}</span>
        </div>
      </div>
    </section>
  );
}

function Metric(props: { label: string; value: number; note: string; accent: Accent }) {
  const v = clamp(props.value, 0, 100);
  const accent = accentClasses(props.accent);

  return (
    <div className="rounded-xl border border-black/10 bg-white/65 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
        {props.label}
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="text-2xl font-black">{Math.round(v)}%</div>
        <div
          className={`shrink-0 rounded px-2 py-1 text-[10px] font-black leading-none ${accent.chip}`}
        >
          {props.note}
        </div>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/10">
        <div
          className={`h-full transition-[width] duration-500 ${accent.line}`}
          style={{ width: `${v}%` }}
        />
      </div>

      <div className="mt-3 text-[11px] leading-relaxed opacity-60">
        {props.label === "Tilgjengelighet"
          ? "Tilgjengelighet må ikke forveksles med vilje til salg."
          : props.label === "Integritet"
          ? "Verdien opprettholdes innenfor formulert trygghet."
          : "Prispress anses som stabilt så lenge det merkes internt."}
      </div>
    </div>
  );
}