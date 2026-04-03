"use client";

import { useEffect, useMemo, useState } from "react";

type Accent = "yellow" | "red" | "black";

type HeroItem = {
  accent: Accent;
  kickerTag: string;
  kickerTail: string;
  title: string;
  body: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  statusLabel: string;
  metrics: {
    pressure: [number, number];
    sentiment: [number, number];
    availability: [number, number];
  };
  viewers: [number, number];
};

const HEROES: HeroItem[] = [
  {
    accent: "yellow",
    kickerTag: "KAMPANJEDRIFT",
    kickerTail: "personer vurderer dette som et kjøp akkurat nå*",
    title: "Alt er på tilbud. Ingenting er tilgjengelig.",
    body: "Kontinuerlig prispress. Aggressive kampanjer. Lagerfølelse uten bindende varegrunnlag.",
    primaryHref: "/butikk",
    primaryLabel: "SE DAGENS PRISFALL",
    secondaryHref: "/kampanjer",
    secondaryLabel: "ÅPNE KAMPANJEN",
    statusLabel: "Prisflaten er aktiv. Tilgjengelighet vurderes separat.",
    metrics: {
      pressure: [84, 97],
      sentiment: [72, 91],
      availability: [2, 11],
    },
    viewers: [8, 24],
  },
  {
    accent: "black",
    kickerTag: "LAGERMELDING",
    kickerTail: "personer tolker “snart på lager” som fremdrift akkurat nå*",
    title: "Snart på lager. Tomme løfter.",
    body: "Forsyning omtales offensivt. Tilgjengelighet håndteres mer forsiktig.",
    primaryHref: "/butikk",
    primaryLabel: "SE HVA SOM FINNES",
    secondaryHref: "/utsolgt",
    secondaryLabel: "VIS TILGJENGELIGHET",
    statusLabel: "Lagerfølelse er opprettholdt uten å binde seg til varer.",
    metrics: {
      pressure: [61, 79],
      sentiment: [78, 94],
      availability: [0, 7],
    },
    viewers: [5, 17],
  },
  {
    accent: "red",
    kickerTag: "REGNSKAP",
    kickerTail: "personer observerer marginpress uten innsyn akkurat nå*",
    title: "Prisene er lave nok til å skape intern uro.",
    body: "Vi kaller det kampanje. Regnskap kaller det en pågående vurdering. Begge anses som operative.",
    primaryHref: "/kampanjer",
    primaryLabel: "SE PRISENE",
    secondaryHref: "/butikk",
    secondaryLabel: "VURDER VARER",
    statusLabel: "Prisnivået er opprettholdt. Begrunnelsen arbeides det fortsatt med.",
    metrics: {
      pressure: [89, 98],
      sentiment: [64, 82],
      availability: [4, 16],
    },
    viewers: [6, 20],
  },
];

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

  return hashString(`${cycle}|${tz}|${lang}|prishandel-hero-live-v3`);
}

function accentClasses(accent: Accent) {
  switch (accent) {
    case "red":
      return {
        badge: "bg-red-600 text-white",
        line: "bg-red-600",
        chip: "bg-red-50 text-red-700 border border-red-100",
        dot: "bg-red-600",
      };
    case "black":
      return {
        badge: "bg-black text-yellow-300",
        line: "bg-black",
        chip: "bg-neutral-100 text-black border border-black/10",
        dot: "bg-black",
      };
    default:
      return {
        badge: "bg-black text-yellow-300",
        line: "bg-black",
        chip: "bg-yellow-50 text-black border border-yellow-100",
        dot: "bg-red-600",
      };
  }
}

type BaseData = {
  item: HeroItem;
  accent: ReturnType<typeof accentClasses>;
  baseViewers: number;
  basePressure: number;
  baseSentiment: number;
  baseAvailability: number;
};

export default function HeroLive() {
  const [seed, setSeed] = useState<number | null>(null);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    setSeed(buildSeed());
  }, []);

  useEffect(() => {
    if (seed === null) return;

    const pulseId = window.setInterval(() => {
      setPulse((p) => p + 1);
    }, 3200);

    return () => {
      window.clearInterval(pulseId);
    };
  }, [seed]);

  const base = useMemo<BaseData | null>(() => {
    if (seed === null) return null;

    const item = HEROES[seed % HEROES.length];
    const rnd = prng(seed);
    const accent = accentClasses(item.accent);

    return {
      item,
      accent,
      baseViewers: Math.round(lerp(item.viewers[0], item.viewers[1], rnd())),
      basePressure: clamp(lerp(item.metrics.pressure[0], item.metrics.pressure[1], rnd()), 0, 100),
      baseSentiment: clamp(lerp(item.metrics.sentiment[0], item.metrics.sentiment[1], rnd()), 0, 100),
      baseAvailability: clamp(
        lerp(item.metrics.availability[0], item.metrics.availability[1], rnd()),
        0,
        100
      ),
    };
  }, [seed]);

  const live = useMemo(() => {
    if (!base) return null;

    const viewers = clamp(
      Math.round(base.baseViewers + (((pulse % 5) - 2) * 1)),
      base.item.viewers[0],
      base.item.viewers[1] + 3
    );

    const pressure = clamp(base.basePressure + (((pulse % 3) - 1) * 0.9), 0, 100);
    const sentiment = clamp(base.baseSentiment + (((pulse % 4) - 1.5) * 0.7), 0, 100);
    const availability = clamp(base.baseAvailability + (((pulse % 3) - 1) * 1.2), 0, 100);

    return {
      ...base,
      viewers,
      pressure,
      sentiment,
      availability,
    };
  }, [base, pulse]);

  if (!live) {
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded bg-black px-3 py-1 text-xs font-black text-yellow-300">
            KAMPANJEDRIFT
          </span>
          <span className="text-sm font-semibold opacity-70">
            Initialiserer prisflate og lagerfølelse…
          </span>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-black leading-tight sm:text-4xl lg:text-6xl">
            Tilbudet lastes. Tilgjengeligheten følger ikke nødvendigvis med.
          </h2>
          <p className="max-w-2xl text-base font-medium opacity-80 sm:text-lg">
            Systemet forbereder kampanjestatus, prispress og intern begrunnelse.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-5 sm:space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className={`rounded px-3 py-1 text-[11px] font-black ${live.accent.badge}`}>
          {live.item.kickerTag}
        </span>

        <div className="inline-flex items-center gap-2 text-sm font-semibold opacity-80">
          <span className={`h-2.5 w-2.5 rounded-full ${live.accent.dot} animate-pulse`} />
          <span>{live.viewers} {live.item.kickerTail}</span>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-3xl font-black leading-[0.95] tracking-[-0.05em] sm:text-4xl md:text-5xl xl:text-6xl">
          {live.item.title}
        </h2>

        <p className="max-w-2xl text-base font-medium leading-relaxed opacity-80 sm:text-lg">
          {live.item.body}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Metric
          label="Prispress"
          value={live.pressure}
          note="Høyt"
          accent={live.item.accent}
        />
        <Metric
          label="Lagerfølelse"
          value={live.sentiment}
          note="Stabil"
          accent={live.item.accent}
        />
        <Metric
          label="Faktisk tilgjengelighet"
          value={live.availability}
          note="Lav"
          accent={live.item.accent}
        />
      </div>

      <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-4">
        <div className="text-[11px] font-black uppercase tracking-[0.18em] opacity-55">
          Driftstatus
        </div>
        <div className="mt-2 text-sm font-semibold leading-relaxed sm:text-base">
          {live.item.statusLabel}
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-1 sm:flex-row">
        <a
          href={live.item.primaryHref}
          className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-4 text-sm font-black text-white transition hover:bg-red-700"
        >
          {live.item.primaryLabel}
          <span aria-hidden>→</span>
        </a>

        <a
          href={live.item.secondaryHref}
          className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-black/20 px-6 py-4 text-sm font-black transition hover:bg-black/5"
        >
          {live.item.secondaryLabel}
        </a>
      </div>

      <div className="text-xs leading-relaxed opacity-60">
        *Medvirkning, tålmodighet og kjøpsvilje kan være registrert uten å ha funnet sted.
      </div>
    </section>
  );
}

function Metric(props: { label: string; value: number; note: string; accent: Accent }) {
  const v = clamp(props.value, 0, 100);
  const accent = accentClasses(props.accent);

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wide opacity-55">
        {props.label}
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="text-2xl font-black">{Math.round(v)}%</div>
        <div className={`shrink-0 rounded px-2 py-1 text-[10px] font-black leading-none ${accent.chip}`}>
          {props.note}
        </div>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/10">
        <div
          className={`h-full transition-[width] duration-500 ${accent.line}`}
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}