"use client";

import { useEffect, useMemo, useState } from "react";

type Accent = "yellow" | "red" | "black";
type CampaignKey = "active" | "review" | "adjusted" | "deviation";

type CampaignState = {
  key: CampaignKey;
  liveLabel: string;
  mode: string;
  headline: string;
  internalLine: string;
  riskTag: string;
  accent: Accent;
};

type MetricProfile = {
  pressure: [number, number];
  confidence: [number, number];
  deviation: [number, number];
};

const STATES: CampaignState[] = [
  {
    key: "active",
    liveLabel: "LIVE",
    mode: "Aggressiv modus",
    headline: "Prisfallet opprettholdes",
    internalLine: "Omfang opprettholdes uten å binde seg til merkbar lettelse.",
    riskTag: "Operativ",
    accent: "yellow",
  },
  {
    key: "review",
    liveLabel: "LIVE (AVVENTENDE)",
    mode: "Vurderingsmodus",
    headline: "Kampanjen fortsetter ved tvil",
    internalLine: "Rabatten vurderes løpende uten at retning anses som nødvendig.",
    riskTag: "Under vurdering",
    accent: "black",
  },
  {
    key: "adjusted",
    liveLabel: "DELVIS LIVE",
    mode: "Justert drift",
    headline: "Rabatten er fortsatt i omløp",
    internalLine: "Justering er gjennomført og omtales derfor som kontroll.",
    riskTag: "Justert",
    accent: "yellow",
  },
  {
    key: "deviation",
    liveLabel: "LIVE (BERØRT)",
    mode: "Avvikshåndtering",
    headline: "Avvik er registrert og videreført",
    internalLine: "Tilstand anses som håndtert når den er formulert internt.",
    riskTag: "Avvik",
    accent: "red",
  },
];

const PROFILES: Record<CampaignKey, MetricProfile> = {
  active: {
    pressure: [84, 97],
    confidence: [68, 88],
    deviation: [9, 24],
  },
  review: {
    pressure: [58, 76],
    confidence: [61, 82],
    deviation: [18, 34],
  },
  adjusted: {
    pressure: [71, 89],
    confidence: [56, 77],
    deviation: [24, 43],
  },
  deviation: {
    pressure: [81, 96],
    confidence: [48, 69],
    deviation: [42, 74],
  },
};

const STATUS_LINES = [
  "Kampanjestatus registrert. Intern tolkning pågår.",
  "Prisflate opprettholdt. Begrunnelse er fortsatt under arbeid.",
  "Tiltak vurderes som gjennomført inntil annet formuleres.",
  "Avvik håndteres fortløpende. Fortløpende er fortsatt ikke tidsfestet.",
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
        line: "bg-red-600",
        tint: "bg-red-500/10",
        chip: "bg-red-50 text-red-700 border border-red-200",
      };
    case "black":
      return {
        badge: "bg-black text-yellow-300",
        line: "bg-black",
        tint: "bg-black/5",
        chip: "bg-neutral-100 text-black border border-black/15",
      };
    default:
      return {
        badge: "bg-yellow-300 text-black",
        line: "bg-black",
        tint: "bg-yellow-400/10",
        chip: "bg-yellow-50 text-black border border-yellow-200",
      };
  }
}

function selectState(seed: number) {
  return STATES[seed % STATES.length];
}

type BaseData = {
  state: CampaignState;
  accent: ReturnType<typeof accentClasses>;
  pressure: number;
  confidence: number;
  deviation: number;
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

    const state = selectState(seed);
    const profile = PROFILES[state.key];
    const rnd = prng(seed);

    return {
      state,
      accent: accentClasses(state.accent),
      pressure: lerp(profile.pressure[0], profile.pressure[1], rnd()),
      confidence: lerp(profile.confidence[0], profile.confidence[1], rnd()),
      deviation: lerp(profile.deviation[0], profile.deviation[1], rnd()),
    };
  }, [seed]);

  const data = useMemo(() => {
    if (!base) return null;

    return {
      ...base,
      pressure: clamp(base.pressure + (((pulse % 3) - 1) * 0.9), 0, 100),
      confidence: clamp(base.confidence + (((pulse % 4) - 1.5) * 0.8), 0, 100),
      deviation: clamp(base.deviation + (((pulse % 3) - 1) * 1.2), 0, 100),
      statusLine: STATUS_LINES[statusTick % STATUS_LINES.length],
    };
  }, [base, pulse, statusTick]);

  if (!data) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-5">
        <div className="text-xs font-black uppercase tracking-wide opacity-60">
          Kampanjemotor
        </div>
        <div className="mt-3 rounded-2xl border border-black/10 p-4 text-sm opacity-60">
          Initialiserer kampanjelogikk…
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-black uppercase tracking-[0.18em] opacity-55">
            Kampanjemotor
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded bg-black px-2 py-1 text-[11px] font-black text-white">
              {data.state.liveLabel}
            </span>
            <span className="rounded border border-black/15 px-2 py-1 text-[11px] font-black">
              {data.state.mode}
            </span>
          </div>
        </div>

        <span className={`rounded px-2 py-1 text-[11px] font-black ${data.accent.badge}`}>
          {data.state.riskTag}
        </span>
      </div>

      <div className="mt-4 text-2xl font-black leading-tight sm:text-3xl">
        {data.state.headline}
      </div>

      <div className="mt-3 rounded-2xl border border-black/10 bg-black/[0.03] p-4 text-sm leading-relaxed">
        {data.state.internalLine}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiModule
          label="Prispress"
          value={data.pressure}
          note="Aktivt"
          accent={data.state.accent}
        />
        <KpiModule
          label="Begrunnelse"
          value={data.confidence}
          note="Formulert"
          accent={data.state.accent}
        />
        <KpiModule
          label="Avviksnivå"
          value={data.deviation}
          note="Løpende"
          accent={data.state.accent}
        />
      </div>

      <div className={`mt-4 rounded-2xl border border-black/10 p-4 ${data.accent.tint}`}>
        <div className="text-[11px] font-black uppercase tracking-[0.16em] opacity-55">
          Intern status
        </div>
        <div className="mt-2 text-sm font-semibold leading-relaxed sm:text-base">
          {data.statusLine}
        </div>
      </div>
    </div>
  );
}

function KpiModule(props: {
  label: string;
  value: number;
  note: string;
  accent: Accent;
}) {
  const v = clamp(props.value, 0, 100);
  const accent = accentClasses(props.accent);

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wide opacity-55">
        {props.label}
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="text-2xl font-black">{Math.round(v)}%</div>
        <div className={`rounded px-2 py-1 text-[10px] font-black ${accent.chip}`}>
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