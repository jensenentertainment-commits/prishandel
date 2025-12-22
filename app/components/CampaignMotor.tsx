"use client";

type CampaignState = {
  key: "active" | "review" | "adjusted" | "deviation";
  liveLabel: string;
  mode: string;
  headline: string;
  bullets: string[];
  marketLine: string;
  financeLine: string;
  riskTag: string;
  accent: "yellow" | "red" | "black";
};

const STATES: CampaignState[] = [
  {
    key: "active",
    liveLabel: "LIVE",
    mode: "Aggressiv modus",
    headline: "Kampanje pågår",
    bullets: [
      "Utvalgte varer omfattes (etter skjønn).",
      "Prisjustering er gjennomført.",
      "Avslutning er ikke planlagt.",
    ],
    marketLine: "📣 Marked: “Dette er en gave.”",
    financeLine: "🧾 Regnskap: “Dette er et avvik.”",
    riskTag: "Operativ",
    accent: "yellow",
  },
  {
    key: "review",
    liveLabel: "LIVE (AVVENTENDE)",
    mode: "Vurderingsmodus",
    headline: "Kampanje vurderes",
    bullets: [
      "Omfang avklares fortløpende.",
      "Rabatt kan forekomme uten lettelse.",
      "Ingen handling er nødvendig.",
    ],
    marketLine: "📣 Marked: “Folk elsker utydelighet.”",
    financeLine: "🧾 Regnskap: “Folk elsker kvittering.”",
    riskTag: "Under vurdering",
    accent: "black",
  },
  {
    key: "adjusted",
    liveLabel: "DELVIS LIVE",
    mode: "Justert drift",
    headline: "Kampanje er justert",
    bullets: [
      "Effekt er beregnet (internt).",
      "Endring gjelder umiddelbart og tidligere.",
      "Kampanje kan oppleves ulikt.",
    ],
    marketLine: "📣 Marked: “Dette går bra.”",
    financeLine: "🧾 Regnskap: “Dette går.”",
    riskTag: "Justert",
    accent: "yellow",
  },
  {
    key: "deviation",
    liveLabel: "LIVE (BERØRT)",
    mode: "Avvikshåndtering",
    headline: "Avvik registrert",
    bullets: [
      "Kampanje er fortsatt gyldig.",
      "Forbehold gjelder uten nærmere grunn.",
      "Tilstand kan være korrekt eller strategisk.",
    ],
    marketLine: "📣 Marked: “Avvik skaper trykk.”",
    financeLine: "🧾 Regnskap: “Avvik skaper papir.”",
    riskTag: "Avvik",
    accent: "red",
  },
];

function hashString(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i);
  }
  return Math.abs(h);
}

// deterministisk pseudo-random
function prng(seed: number) {
  let x = seed || 1;
  return () => {
    x = Math.imul(48271, x) % 0x7fffffff;
    return x / 0x7fffffff;
  };
}

function pickSeed() {
  const now = new Date();
  const cycle = Math.floor(now.getTime() / (1000 * 60 * 47));
  const env =
    typeof window !== "undefined"
      ? `${navigator.userAgent}|${window.innerWidth}x${window.innerHeight}|${navigator.language}`
      : "server";
  return hashString(`${cycle}|${env}`);
}


function badgeClass(accent: CampaignState["accent"]) {
  if (accent === "red") return "bg-red-600 text-white";
  if (accent === "black") return "bg-black text-yellow-300";
  return "bg-yellow-300 text-black";
}

function sparkPath(values: number[], w = 160, h = 44, pad = 3) {
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

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function CampaignMotor() {
  const seed = pickSeed();
  const state = STATES[seed % STATES.length];
  const rnd = prng(seed);

  // KPI-verdier
  const lift = 2.0 + rnd() * 8.5;
  const integrity = 0.86 + rnd() * 0.12;
  const deviation = rnd() * 9.0;

  // Normalisert (0–100)
  const liftPct = ((lift - 2.0) / 8.5) * 100;
  const integrityPct = ((integrity - 0.8) / 0.2) * 100;
  const deviationPct = (deviation / 9.0) * 100;

  // Toleranse (låst)
  const tolLift = 30 + rnd() * 60;
  const tolIntegrity = 10 + rnd() * 40;
  const tolDeviation = 40 + rnd() * 50;

  // Dekning
  const coverage = 35 + Math.floor(rnd() * 55);

  // Graf
  const series = Array.from({ length: 12 }, () => 40 + rnd() * 60);
  const path = sparkPath(series);

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-black uppercase tracking-wide opacity-60">
            Kampanjemotor
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[11px] font-black rounded px-2 py-1 bg-black text-white">
              {state.liveLabel}
            </span>
            <span className="text-[11px] font-black rounded px-2 py-1 border border-black/15">
              {state.mode}
            </span>
          </div>
        </div>
        <span
          className={`text-[11px] font-black rounded px-2 py-1 ${badgeClass(
            state.accent
          )}`}
        >
          {state.riskTag}
        </span>
      </div>

      <div className="mt-3 text-lg font-black">{state.headline}</div>

      {/* KPI-moduler */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <KpiModule
          label="Kampanjelift"
          value={`${lift.toFixed(1)}%`}
          note="Antatt"
          percent={liftPct}
          rangeValue={tolLift}
          rangeLabel="Toleranse er låst av hensyn til ro."
        />
        <KpiModule
          label="Integritet"
          value={integrity.toFixed(2)}
          note="Indeks"
          percent={integrityPct}
          rangeValue={tolIntegrity}
          rangeLabel="Innenfor akseptabelt avvik (definisjon utelatt)."
        />
        <KpiModule
          label="Avvik"
          value={deviation.toFixed(1)}
          note="Pågående"
          percent={deviationPct}
          rangeValue={tolDeviation}
          rangeLabel="Avvik håndteres fortløpende. Fortløpende er ikke tidsfestet."
        />
      </div>

      {/* Graf + dekning */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-black/10 p-3">
          <div className="text-xs font-semibold opacity-60">
            Utvikling (intern)
          </div>
          <svg className="mt-2 w-full" viewBox="0 0 160 44">
            <path
              d={path}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.8"
            />
          </svg>
          <div className="mt-1 text-[11px] opacity-60">
            Referanseperiode: ikke spesifisert
          </div>
        </div>

        <div className="rounded-xl border border-black/10 p-3">
          <div className="text-xs font-semibold opacity-60">Dekning</div>
          <div className="mt-2 flex justify-between text-sm font-black">
            <span>Omfang</span>
            <span>{coverage}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-black/10 overflow-hidden">
            <div className="h-full bg-black" style={{ width: `${coverage}%` }} />
          </div>
          <div className="mt-2 text-[11px] opacity-60">
            Omfang kan avvike fra faktisk omfang.
          </div>
        </div>
      </div>

      <ul className="mt-4 space-y-1 text-sm opacity-80">
        {state.bullets.map((b) => (
          <li key={b}>• {b}</li>
        ))}
      </ul>

      <div className="mt-4 rounded-xl border border-black/10 bg-black/5 p-3 text-sm">
        <div>{state.marketLine}</div>
        <div>{state.financeLine}</div>
      </div>

      <div className="mt-3 text-xs opacity-60">
        Kampanjestatus kan avvike fra opplevd kampanje. Begge anses gyldige.
      </div>
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
}) {
  const p = clamp(props.percent, 0, 100);
  const r = clamp(props.rangeValue, 0, 100);

  return (
    <div className="rounded-xl border border-black/10 p-3">
      <div className="text-[11px] font-semibold opacity-60">{props.label}</div>
      <div className="mt-1 text-lg font-black">{props.value}</div>
      <div className="mt-1 text-[11px] opacity-60">{props.note}</div>

      <div className="mt-3">
        <div className="flex justify-between text-[11px] font-semibold opacity-60">
          <span>Indikator</span>
          <span>{Math.round(p)}%</span>
        </div>
        <div className="mt-1 h-2 rounded-full bg-black/10 overflow-hidden">
          <div className="h-full bg-black" style={{ width: `${p}%` }} />
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-[11px] font-semibold opacity-60">
          <span>Toleranse</span>
          <span>{Math.round(r)}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={r}
          disabled
          className="w-full mt-1 opacity-70"
        />
        <div className="mt-1 text-[11px] opacity-60">{props.rangeLabel}</div>
      </div>
    </div>
  );
}
