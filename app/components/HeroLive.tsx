"use client";

type HeroVariant = {
  kickerTag: string;
  kickerTail: string; // uten tall
  h1: string;
  lead: string;
  footnote: string;
};

type CtaVariant = {
  primary: string;
  secondary: string;
  note: string;
};

function hashString(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i);
  return Math.abs(h);
}

/**
 * Park–Miller LCG, gjort JS-sikkert:
 * - sørger for at x alltid er positiv (1..m-1)
 * - returnerer 0..1 (ikke negativ)
 */
function prng(seed: number) {
  const M = 0x7fffffff; // 2147483647
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

function pickSeed() {
  const now = new Date();
  // 53-minutters "syklus" (som før)
  const cycle = Math.floor(now.getTime() / (1000 * 60 * 53));

  const env =
    typeof window !== "undefined"
      ? `${navigator.userAgent}|${window.innerWidth}x${window.innerHeight}|${navigator.language}`
      : "server";

  return hashString(`${cycle}|${env}`);
}

const HERO_VARIANTS: HeroVariant[] = [
  {
    kickerTag: "SUPERDEAL",
    kickerTail: "personer ser på “Verdighet” akkurat nå*",
    h1: "Vi selger varer så billig at regnskapsføreren fikk hjerteinfarkt",
    lead: "Kontinuerlig prispress. Aggressive kampanjer. Null lager. Alt må vekk.",
    footnote: "*Tall kan være korrekte, feil eller motivasjon.",
  },
  {
    kickerTag: "KAMPANJE",
    kickerTail: "personer vurderer “Sparing” uten å spare*",
    h1: "Prisene er satt så lavt at systemet må forklare seg i etterkant",
    lead: "Kampanjedrift i flere lag. Avvik håndteres fortløpende. Lettelse kan utebli.",
    footnote: "*Vurdering er ikke en handling. Det anses likevel som aktivitet.",
  },
  {
    kickerTag: "UTVALGT",
    kickerTail: "personer ser på “Ansvar” akkurat nå*",
    h1: "Vi presser marginene til de blir administrative",
    lead: "Rask leveranse (noen ganger). Stabile vilkår (i teorien). Ingen garanti for ro.",
    footnote: "*Ansvar kan oppleves ulikt. Begge anses gyldige.",
  },
  {
    kickerTag: "DRIFT",
    kickerTail: "personer følger “Kontroll” uten innflytelse*",
    h1: "Vi har kampanjer som aldri slutter, bare endrer tilstand",
    lead: "Systemet justerer. Regnskap noterer. Marked presser. Du observerer.",
    footnote: "*Innflytelse kan være registrert uten å foreligge.",
  },
];

const CTA_VARIANTS: CtaVariant[] = [
  { primary: "SE TILBUDENE", secondary: "DØGNETS DEALS", note: "Regnskapsfører er informert." },
  { primary: "GÅ TIL KAMPANJE", secondary: "SE UTVALG", note: "Handling er frivillig." },
  { primary: "VURDER VARER", secondary: "SE PRISER", note: "Vurdering anses som aktivitet." },
  { primary: "FORTSETT TIL SYSTEMET", secondary: "VIS OVERSIKT", note: "Systemet er allerede i gang." },
];

function safePick<T>(arr: T[], idx: number, fallback: T): T {
  return arr.length ? arr[idx] ?? fallback : fallback;
}

export default function HeroLive() {
  const seed = pickSeed();
  const rnd = prng(seed);

  const hero = safePick(HERO_VARIANTS, seed % HERO_VARIANTS.length, HERO_VARIANTS[0]);
  const cta = safePick(
    CTA_VARIANTS,
    Math.floor(rnd() * CTA_VARIANTS.length),
    CTA_VARIANTS[0]
  );

  // deterministisk “viewers”
  const viewers = 3 + Math.floor(rnd() * 27); // 3–29

  // dot-illusjon
  const dots = 5;
  const active = 1 + Math.floor(rnd() * dots);

  // intern “status” (bare visuals)
  const drift = clamp(40 + rnd() * 55, 0, 100);
  const compliance = clamp(60 + rnd() * 35, 0, 100);
  const friction = clamp(10 + rnd() * 80, 0, 100);

  return (
    <div className="space-y-6">
      {/* KICKER */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="rounded bg-black text-yellow-300 text-xs font-black px-3 py-1">
          {hero.kickerTag}
        </span>
        <span className="text-sm font-semibold opacity-80">
          {viewers} {hero.kickerTail}
        </span>
      </div>

      {/* H1 */}
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.02]">
        {hero.h1}
      </h1>

      {/* LEAD */}
      <p className="text-base md:text-lg opacity-80 max-w-xl">{hero.lead}</p>

      {/* CTA */}
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <a
          href="/butikk"
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 text-white px-6 py-4 font-black text-sm hover:bg-red-700 transition"
        >
          {cta.primary} <span aria-hidden>→</span>
        </a>

        <a
          href="/kampanjer"
          className="inline-flex items-center gap-2 rounded-xl border border-black/20 px-6 py-4 font-black text-sm hover:bg-black/5 transition"
        >
          {cta.secondary}
        </a>
      </div>

      <div className="text-xs opacity-60">{cta.note}</div>

      {/* DOTS */}
      <div className="flex items-center gap-3 pt-1">
        <div className="flex items-center gap-2">
          {Array.from({ length: dots }).map((_, i) => {
            const on = i + 1 === active;
            return (
              <span
                key={i}
                className={`h-2 w-2 rounded-full ${on ? "bg-black" : "bg-black/25"}`}
              />
            );
          })}
        </div>
        <div className="text-xs opacity-60">*Sliderkontroll er midlertidig utsolgt</div>
      </div>

      <div className="text-xs opacity-60">{hero.footnote}</div>

      {/* EXTRA BOX */}
      <div className="rounded-xl border border-black/10 bg-white/70 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs font-black uppercase tracking-wide opacity-60">
            Intern driftstatus
          </div>
          <span className="text-[11px] font-black rounded px-2 py-1 bg-black text-yellow-300">
            Notert
          </span>
        </div>

        <div className="mt-3 space-y-3">
          <MiniBar label="Kampanjedrift" value={drift} />
          <MiniBar label="Integritet" value={compliance} />
          <MiniBar label="Avvik" value={friction} />
        </div>

        <div className="mt-3 text-[11px] opacity-60">
          Endringer er registrert. Parameterne er ikke endret.
        </div>
      </div>
    </div>
  );
}

function MiniBar(props: { label: string; value: number }) {
  const v = clamp(props.value, 0, 100);

  return (
    <div>
      <div className="flex items-center justify-between text-[11px] font-semibold opacity-60">
        <span>{props.label}</span>
        <span>{Math.round(v)}%</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-black/10 overflow-hidden">
        <div className="h-full bg-black" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
