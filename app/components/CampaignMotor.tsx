"use client";

import { useEffect, useMemo, useState } from "react";

type Accent = "yellow" | "red" | "black";
type CampaignKey = "active" | "review" | "adjusted" | "deviation";

type CampaignState = {
  key: CampaignKey;
  liveLabel: string;
  mode: string;
  headline: string;
  bullets: string[];
  marketLine: string;
  financeLine: string;
  riskTag: string;
  accent: Accent;
};

type MetricProfile = {
  lift: [number, number];
  integrity: [number, number];
  deviation: [number, number];
  coverage: [number, number];
  tolerance: {
    lift: [number, number];
    integrity: [number, number];
    deviation: [number, number];
  };
};

const STATES: CampaignState[] = [
  {
    key: "active",
    liveLabel: "LIVE",
    mode: "Aggressiv modus",
    headline: "Kampanje pågår",
    bullets: [
      "Utvalgte varer omfattes etter gjeldende stemning.",
      "Prisjustering er gjennomført og opprettholdt.",
      "Avslutning vurderes som unødvendig.",
    ],
    marketLine: "📣 Marked: “Dette er en gave.”",
    financeLine: "🧾 Regnskap: “Dette er et spor.”",
    riskTag: "Operativ",
    accent: "yellow",
  },
  {
    key: "review",
    liveLabel: "LIVE (AVVENTENDE)",
    mode: "Vurderingsmodus",
    headline: "Kampanje vurderes",
    bullets: [
      "Omfang avklares fortløpende uten å begrense seg.",
      "Rabatt kan forekomme uten merkbar lettelse.",
      "Ingen handling er nødvendig fra deres side.",
    ],
    marketLine: "📣 Marked: “Folk responderer godt på uskarpt eierskap.”",
    financeLine: "🧾 Regnskap: “Uskarpt eierskap er fortsatt eierskap.”",
    riskTag: "Under vurdering",
    accent: "black",
  },
  {
    key: "adjusted",
    liveLabel: "DELVIS LIVE",
    mode: "Justert drift",
    headline: "Kampanje er justert",
    bullets: [
      "Effekt er beregnet internt og omtales deretter.",
      "Endring gjelder umiddelbart samt i ettertid.",
      "Kampanje kan oppleves ulikt uten at systemet korrigerer for det.",
    ],
    marketLine: "📣 Marked: “Det viktigste er at noe er justert.”",
    financeLine: "🧾 Regnskap: “Justert er en form for kontroll.”",
    riskTag: "Justert",
    accent: "yellow",
  },
  {
    key: "deviation",
    liveLabel: "LIVE (BERØRT)",
    mode: "Avvikshåndtering",
    headline: "Avvik registrert",
    bullets: [
      "Kampanjen opprettholdes inntil motsatt stemning foreligger.",
      "Forbehold gjelder uten nærmere begrunnelse.",
      "Tilstand anses som håndtert når den er formulert.",
    ],
    marketLine: "📣 Marked: “Avvik skaper trykk.”",
    financeLine: "🧾 Regnskap: “Avvik skaper dokumentasjon.”",
    riskTag: "Avvik",
    accent: "red",
  },
];

const PROFILES: Record<CampaignKey, MetricProfile> = {
  active: {
    lift: [6.2, 10.4],
    integrity: [0.88, 0.97],
    deviation: [1.2, 3.8],
    coverage: [62, 89],
    tolerance: {
      lift: [54, 84],
      integrity: [18, 36],
      deviation: [42, 58],
    },
  },
  review: {
    lift: [2.4, 5.8],
    integrity: [0.91, 0.99],
    deviation: [2.0, 4.7],
    coverage: [38, 63],
    tolerance: {
      lift: [28, 46],
      integrity: [10, 22],
      deviation: [36, 52],
    },
  },
  adjusted: {
    lift: [4.4, 7.2],
    integrity: [0.84, 0.91],
    deviation: [3.6, 6.8],
    coverage: [49, 76],
    tolerance: {
      lift: [48, 68],
      integrity: [24, 40],
      deviation: [54, 78],
    },
  },
  deviation: {
    lift: [3.0, 6.0],
    integrity: [0.79, 0.88],
    deviation: [6.1, 8.9],
    coverage: [57, 92],
    tolerance: {
      lift: [44, 66],
      integrity: [31, 51],
      deviation: [72, 96],
    },
  },
};

const STATUS_LINES = [
  "Kampanjestatus registrert. Intern tolkning pågår.",
  "Prisflate opprettholdt. Begrunnelse er ikke blokkert.",
  "Tiltak vurderes som gjennomført inntil annet formuleres.",
  "Avvik håndteres fortløpende. Fortløpende er fortsatt ikke tidsfestet.",
  "Omfang oppdateres uten garanti for merkbar effekt.",
  "Systemet er rolig. Markedet er mindre rolig.",
] as const;

function hashString(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i);
  }
  return Math.abs(h);
}

function prng(seed: number) {
  let x = seed || 1;
  return () => {
    x = Math.imul(48271, x) % 0x7fffffff;
    if (x <= 0) x += 0x7fffffff - 1;
    return x / 0x7fffffff;
  };
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function lerp(min: number, max: number, t: number) {
  return min + (max - min) * t;
}

function toPercent(value: number, min: number, max: number) {
  return ((value - min) / (max - min)) * 100;
}

function formatMetric(value: number, decimals = 1) {
  return value.toFixed(decimals).replace(".", ",");
}

function buildStableSeed() {
  const now = new Date();
  const cycle = Math.floor(now.getTime() / (1000 * 60 * 43));
  const base =
    typeof window !== "undefined"
      ? `${cycle}|${navigator.language}|${Intl.DateTimeFormat().resolvedOptions().timeZone}`
      : `${cycle}|server`;
  return hashString(base);
}

function accentClasses(accent: Accent) {
  switch (accent) {
    case "red":
      return {
        badge: "bg-red-600 text-white",
        soft: "bg-red-50",
        line: "bg-red-600",
        text: "text-red-700",
        border: "border-red-200",
        tint: "bg-red-500/10",
      };
    case "black":
      return {
        badge: "bg-black text-yellow-300",
        soft: "bg-neutral-100",
        line: "bg-black",
        text: "text-black",
        border: "border-black/15",
        tint: "bg-black/5",
      };
    default:
      return {
        badge: "bg-yellow-300 text-black",
        soft: "bg-yellow-50",
        line: "bg-black",
        text: "text-black",
        border: "border-yellow-200",
        tint: "bg-yellow-400/10",
      };
  }
}

function buildSeries(kind: CampaignKey, rnd: () => number, length = 12) {
  switch (kind) {
    case "active":
      return Array.from({ length }, (_, i) => 48 + i * 2.6 + rnd() * 10);

    case "review":
      return Array.from(
        { length },
        (_, i) => 58 + Math.sin(i / 1.7) * 6 + rnd() * 4
      );

    case "adjusted":
      return Array.from({ length }, (_, i) => {
        const pivot =
          i < length / 2 ? 68 - i * 2.2 : 46 + (i - length / 2) * 3.2;
        return pivot + rnd() * 6;
      });

    case "deviation":
      return Array.from({ length }, (_, i) => {
        if (i === length - 3) return 92 + rnd() * 4;
        if (i === length - 2) return 54 + rnd() * 5;
        if (i === length - 1) return 78 + rnd() * 7;
        return 44 + rnd() * 18 + i * 1.2;
      });
  }
}

function driftSeries(values: number[], pulse: number, kind: CampaignKey) {
  return values.map((value, i) => {
    let delta = 0;

    if (kind === "active") delta = ((pulse + i) % 3) - 1;
    if (kind === "review") delta = Math.sin((pulse + i) / 2.2) * 0.6;
    if (kind === "adjusted") delta = i > values.length / 2 ? ((pulse + i) % 2) * 0.8 : -0.4;
    if (kind === "deviation") delta = i >= values.length - 3 ? ((pulse + i) % 3) * 1.2 : 0.5;

    return value + delta;
  });
}

function sparkPath(values: number[], w = 180, h = 48, pad = 4) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = (w - pad * 2) / (values.length - 1);

  const pts = values.map((v, i) => {
    const x = pad + i * step;
    const y = pad + (1 - (v - min) / span) * (h - pad * 2);
    return { x, y };
  });

  return "M " + pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L ");
}

function selectState(seed: number) {
  return STATES[seed % STATES.length];
}

type BaseData = {
  state: CampaignState;
  accent: ReturnType<typeof accentClasses>;
  lift: number;
  integrity: number;
  deviation: number;
  coverage: number;
  series: number[];
  tolLift: number;
  tolIntegrity: number;
  tolDeviation: number;
};

export default function CampaignMotor() {
  const [seed, setSeed] = useState<number | null>(null);
  const [pulse, setPulse] = useState(0);
  const [statusTick, setStatusTick] = useState(0);

  useEffect(() => {
    setSeed(buildStableSeed());
  }, []);

  useEffect(() => {
    if (seed === null) return;

    const pulseId = window.setInterval(() => {
      setPulse((p) => p + 1);
    }, 4600);

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

    const state = selectState(seed);
    const profile = PROFILES[state.key];
    const rnd = prng(seed);

    const lift = lerp(profile.lift[0], profile.lift[1], rnd());
    const integrity = lerp(profile.integrity[0], profile.integrity[1], rnd());
    const deviation = lerp(profile.deviation[0], profile.deviation[1], rnd());

    const coverage = Math.round(
      lerp(profile.coverage[0], profile.coverage[1], rnd())
    );

    const tolLift = lerp(profile.tolerance.lift[0], profile.tolerance.lift[1], rnd());
    const tolIntegrity = lerp(
      profile.tolerance.integrity[0],
      profile.tolerance.integrity[1],
      rnd()
    );
    const tolDeviation = lerp(
      profile.tolerance.deviation[0],
      profile.tolerance.deviation[1],
      rnd()
    );

    const series = buildSeries(state.key, rnd);
    const accent = accentClasses(state.accent);

    return {
      state,
      accent,
      lift,
      integrity,
      deviation,
      coverage,
      series,
      tolLift,
      tolIntegrity,
      tolDeviation,
    };
  }, [seed]);

  const data = useMemo(() => {
    if (!base) return null;

    const liftDrift = ((pulse % 3) - 1) * 0.15;
    const integrityDrift = ((pulse % 4) - 1.5) * 0.004;
    const deviationDrift = ((pulse % 3) - 1) * 0.18;
    const coverageDrift = ((pulse % 5) - 2) * 1.2;

    const liveLift = clamp(base.lift + liftDrift, 0, 100);
    const liveIntegrity = clamp(base.integrity + integrityDrift, 0, 1.2);
    const liveDeviation = clamp(base.deviation + deviationDrift, 0, 9.5);
    const liveCoverage = clamp(
      Math.round(base.coverage + coverageDrift),
      0,
      100
    );

    const liveSeries = driftSeries(base.series, pulse, base.state.key);
    const path = sparkPath(liveSeries);

    return {
      ...base,
      lift: liveLift,
      integrity: liveIntegrity,
      deviation: liveDeviation,
      coverage: liveCoverage,
      path,
      series: liveSeries,
      liftPct: toPercent(liveLift, 2.0, 10.5),
      integrityPct: toPercent(liveIntegrity, 0.78, 1.0),
      deviationPct: toPercent(liveDeviation, 0, 9.0),
      statusLine: STATUS_LINES[statusTick % STATUS_LINES.length],
    };
  }, [base, pulse, statusTick]);

  if (!data) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-xs font-black uppercase tracking-wide opacity-60">
          Kampanjemotor
        </div>
        <div className="mt-3 rounded-xl border border-black/10 p-4 text-sm opacity-60">
          Initialiserer kampanjelogikk…
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-black uppercase tracking-wide opacity-60">
            Kampanjemotor
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="rounded bg-black px-2 py-1 text-[11px] font-black text-white">
              {data.state.liveLabel}
            </span>
            <span className="rounded border border-black/15 px-2 py-1 text-[11px] font-black">
              {data.state.mode}
            </span>
          </div>
        </div>

        <span
          className={`rounded px-2 py-1 text-[11px] font-black ${data.accent.badge}`}
        >
          {data.state.riskTag}
        </span>
      </div>

      <div className="mt-3 text-lg font-black">{data.state.headline}</div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <KpiModule
          label="Kampanjelift"
          value={`${formatMetric(data.lift)}%`}
          note="Antatt effekt"
          percent={data.liftPct}
          rangeValue={data.tolLift}
          rangeLabel="Toleranse er låst av hensyn til gjennomføring."
          accent={data.state.accent}
          tone="primary"
        />

        <KpiModule
          label="Integritet"
          value={formatMetric(data.integrity, 2)}
          note="Systemindeks"
          percent={data.integrityPct}
          rangeValue={data.tolIntegrity}
          rangeLabel="Innenfor akseptabelt avvik. Definisjon er unntatt innsyn."
          accent={data.state.accent}
          tone="neutral"
        />

        <KpiModule
          label="Avvik"
          value={formatMetric(data.deviation)}
          note="Løpende nivå"
          percent={data.deviationPct}
          rangeValue={data.tolDeviation}
          rangeLabel="Avvik håndteres fortløpende. Fortløpende er ikke tidsfestet."
          accent={data.state.accent}
          tone="risk"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className={`rounded-xl border border-black/10 p-3 ${data.accent.tint}`}>
          <div className="text-xs font-semibold opacity-60">Utvikling (intern)</div>

          <svg className="mt-2 w-full" viewBox="0 0 180 48" aria-hidden="true">
            <path
              d={data.path}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              opacity="0.88"
            />
          </svg>

          <div className="mt-2 flex items-center justify-between text-[11px] opacity-60">
            <span>Referanseperiode</span>
            <span>Ikke spesifisert</span>
          </div>
        </div>

        <div className="rounded-xl border border-black/10 p-3">
          <div className="text-xs font-semibold opacity-60">Dekning</div>

          <div className="mt-2 flex items-center justify-between text-sm font-black">
            <span>Omfang</span>
            <span>{data.coverage}%</span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/10">
            <div
              className={`h-full transition-[width] duration-500 ${data.accent.line}`}
              style={{ width: `${data.coverage}%` }}
            />
          </div>

          <div className="mt-2 text-[11px] opacity-60">
            Omfang kan avvike fra faktisk omfang uten at tiltak utløses.
          </div>
        </div>
      </div>

      <ul className="mt-4 space-y-1 text-sm opacity-80">
        {data.state.bullets.map((bullet) => (
          <li key={bullet}>• {bullet}</li>
        ))}
      </ul>

      <div className="mt-4 rounded-xl border border-black/10 bg-black/5 p-3 text-sm">
        <div>{data.state.marketLine}</div>
        <div>{data.state.financeLine}</div>
      </div>

      <div className="mt-3 text-xs opacity-60">{data.statusLine}</div>
    </div>
  );
}

function KpiModule(props: {
  label: string;
  value: string;
  note: string;
  percent: number;
  rangeValue: number;
  rangeLabel: string;
  accent: Accent;
  tone: "primary" | "neutral" | "risk";
}) {
  const p = clamp(props.percent, 0, 100);
  const r = clamp(props.rangeValue, 0, 100);
  const accent = accentClasses(props.accent);

  const toneClasses =
    props.tone === "primary"
      ? "bg-black/[0.03]"
      : props.tone === "risk"
      ? props.accent === "red"
        ? "bg-red-50"
        : "bg-black/[0.02]"
      : "";

  return (
    <div className={`rounded-xl border border-black/10 p-3 ${toneClasses}`}>
      <div className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
        {props.label}
      </div>

      <div className="mt-1 flex items-end justify-between gap-3">
        <div className="text-lg font-black">{props.value}</div>
        <div className="text-[11px] opacity-60">{props.note}</div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-[11px] font-semibold opacity-60">
          <span>Indikator</span>
          <span>{Math.round(p)}%</span>
        </div>

        <div className="mt-1 h-2 overflow-hidden rounded-full bg-black/10">
          <div
            className={`h-full transition-[width] duration-500 ${accent.line}`}
            style={{ width: `${p}%` }}
          />
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-[11px] font-semibold opacity-60">
          <span>Toleranse</span>
          <span>{Math.round(r)}%</span>
        </div>

        <LockedToleranceRail value={r} accent={props.accent} />

        <div className="mt-1 text-[11px] opacity-60">{props.rangeLabel}</div>
      </div>
    </div>
  );
}

function LockedToleranceRail(props: { value: number; accent: Accent }) {
  const value = clamp(props.value, 0, 100);
  const accent = accentClasses(props.accent);

  return (
    <div className="mt-1">
      <div className="relative h-5">
        <div className="absolute left-0 right-0 top-1/2 h-[6px] -translate-y-1/2 rounded-full bg-black/10" />
        <div
          className={`absolute top-1/2 h-[6px] -translate-y-1/2 rounded-full ${accent.line}`}
          style={{ width: `${value}%` }}
        />
        <div
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white bg-black shadow-sm"
          style={{ left: `calc(${value}% - 8px)` }}
        />
      </div>

      <div className="mt-1 flex items-center justify-between text-[10px] uppercase tracking-wide opacity-50">
        <span>Låst</span>
        <span>Manuell åpning utilgjengelig</span>
      </div>
    </div>
  );
}