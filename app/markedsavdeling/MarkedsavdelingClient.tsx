"use client";

import { useMemo } from "react";
import { voices } from "../lib/voices";
import { useVisitVariant } from "../lib/useVisitVariant";
import { pick, h32 } from "../lib/visitSeed";

type Kind = "generic" | "price" | "shipping" | "coupon" | "stock";

const KINDS: readonly Kind[] = ["generic", "price", "shipping", "coupon", "stock"] as const;

const SLOGANS = [
  "ALT MÅ VEKK!",
  "SLUTTER I DAG!",
  "KUPP NÅ!",
  "MEGASALG!",
  "PRISKRIG!",
  "UTROLIG BILLIG!",
  "RASKT! (teoretisk)",
  "KAMPANJE AKTIVERT!",
] as const;

const DISCLAIMERS = [
  "Gjelder i dag.*",
  "Så lenge det varer.*",
  "Begrenset antall.* (0)",
  "Tilbud kan avvike fra virkeligheten.*",
  "Rabatt gjelder der det passer oss.*",
] as const;

function randIntSeed(seed: number, min: number, max: number) {
  const span = max - min + 1;
  return min + (seed % span);
}

export default function MarkedsavdelingClient() {
  const { mounted, visit, seed } = useVisitVariant("markedsavdeling");
  const stableSeed = mounted ? seed : 0;

  const k1 = pick(KINDS, stableSeed);
  const k2 = pick(KINDS, stableSeed >>> 3);

  const marketLine = useMemo(() => {
    if (!mounted) return "Kampanjeproduksjon initialiseres.";
    return voices.market.say(k1);
  }, [mounted, k1]);

  const ledgerLine = useMemo(() => {
    if (!mounted) return "Budsjettmessig grunnlag er ikke vurdert.";
    return voices.ledger.say(k1);
  }, [mounted, k1]);

  const disclaimer = useMemo(() => {
    return pick(DISCLAIMERS, stableSeed >>> 5);
  }, [stableSeed]);

  const abSloganA = useMemo(() => {
    return pick(SLOGANS, stableSeed >>> 7);
  }, [stableSeed]);

  const abSloganB = useMemo(() => {
    return pick(SLOGANS, stableSeed >>> 9);
  }, [stableSeed]);

  const scoreA = useMemo(() => {
    return randIntSeed(h32(`sa:${stableSeed}`), 51, 99);
  }, [stableSeed]);

  const scoreB = useMemo(() => {
    return randIntSeed(h32(`sb:${stableSeed}`), 51, 99);
  }, [stableSeed]);

  const pressure = useMemo(() => {
    return randIntSeed(h32(`press:${stableSeed}`), 92, 100);
  }, [stableSeed]);

  const conversion = useMemo(() => {
    return randIntSeed(h32(`conv:${stableSeed}`), 187, 642);
  }, [stableSeed]);

  const resistance = useMemo(() => {
    return randIntSeed(h32(`res:${stableSeed}`), 71, 99);
  }, [stableSeed]);

  const complaints = useMemo(() => {
    return randIntSeed(h32(`cmp:${stableSeed}`), 0, 3);
  }, [stableSeed]);

  const campaigns = useMemo(() => {
    return randIntSeed(h32(`cam:${stableSeed}`), 12, 28);
  }, [stableSeed]);

  const updatedAt = useMemo(() => {
    const hh = String(randIntSeed(h32(`hh:${stableSeed}`), 8, 16)).padStart(2, "0");
    const mm = String(randIntSeed(h32(`mm:${stableSeed}`), 0, 59)).padStart(2, "0");
    return `${hh}:${mm}`;
  }, [stableSeed]);

  const generatedHeadline = useMemo(() => {
    const noun = pick(
      [
        "Verdighet",
        "Mot",
        "Frisk luft på flaske",
        "Selvrespekt",
        "Indre ro (utsolgt)",
        "Tålmodighet",
        "Regnskapsgodkjenning",
      ] as const,
      stableSeed >>> 11,
    );

    return `${pick(SLOGANS, stableSeed >>> 13)} ${noun}`;
  }, [stableSeed]);

  const generatedBody = useMemo(() => {
    if (!mounted) return "Kampanjetekst klargjøres for markedstilpasset publisering.";
    return voices.market.say(k2);
  }, [mounted, k2]);

  const generatedFoot = useMemo(() => {
    if (!mounted) return "🧾 Regnskapsfører: Vurderes separat.";
    return `🧾 Regnskapsfører: ${voices.ledger.extra()}`;
  }, [mounted, stableSeed]);

  const ticker = useMemo(() => {
    return [
      `TRYKK ${pressure}%`,
      `KONVERTERING ${conversion}%`,
      `KLAGEGRAD ${complaints}%`,
      `MOTSTAND ${resistance}%`,
      `AKTIVE KAMPANJER ${campaigns}`,
    ].join("  •  ");
  }, [pressure, conversion, complaints, resistance, campaigns]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-yellow-300 px-3 py-1 text-xs font-black text-black">
            📣 MARKEDSAVDELING / INTERN PRODUKSJONSFLATE
          </div>

          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            Kampanje-generator
          </h1>

          <p className="mt-2 max-w-2xl text-sm opacity-80">
            Denne siden brukes til å produsere kampanjer raskere enn virkeligheten
            rekker å protestere.
          </p>

          <div className="mt-2 text-xs font-semibold opacity-60">
            Besøk: <span className="font-black">{mounted ? visit : "—"}</span> •
            Oppdatering: {updatedAt} • Modus: produksjon
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href="/kampanjer"
            className="rounded-xl bg-red-600 px-4 py-2 font-black text-white hover:opacity-90"
          >
            Publiser kampanjer →
          </a>
          <a
            href="/intern"
            className="rounded-xl border border-black/20 bg-white px-4 py-2 font-black text-black hover:bg-black/5"
          >
            Tilbake til intern →
          </a>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Kpi label="Trykk" value={`${pressure}%`} hint="Passe høyt" />
        <Kpi label="Følelseseffekt" value={`${conversion}%`} hint="Uverifisert" />
        <Kpi label="Klagegrad" value={`${complaints}%`} hint="Akseptabelt lav" />
        <Kpi label="Regnskapsmotstand" value={`${resistance}%`} hint="Vedvarende" />
        <Kpi label="Aktive trykkpunkt" value={campaigns.toString()} hint="For mange" />
      </div>

      <section className="mt-8 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
        <div className="border-b border-black/10 bg-black px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-yellow-300">
          {ticker}
        </div>

        <div className="border-b border-black/10 bg-red-600 px-5 py-5 text-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded bg-white/15 px-2 py-1 text-xs font-black">
                <span className="inline-block h-2 w-2 rounded-full bg-white" />
                LIVE PROPAGANDA
              </div>
              <div className="mt-2 text-lg font-black">Broadcast</div>
              <div className="text-xs opacity-90">Sist oppdatert: {updatedAt}*</div>
            </div>

            <span className="rounded bg-white/15 px-2 py-1 text-xs font-black">
              AKTIV DISTRIBUSJON
            </span>
          </div>
        </div>

        <div className="grid gap-4 p-5 lg:grid-cols-[1.45fr,0.9fr]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-black/10 bg-yellow-300 p-6 text-black shadow-sm">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] opacity-70">
                Aktiv melding
              </div>

              <div className="mt-3 text-4xl font-black leading-[1.02] tracking-tight md:text-5xl">
                {marketLine}
              </div>

              <div className="mt-4 max-w-2xl text-sm opacity-80">{disclaimer}</div>

              <div className="mt-4 rounded-2xl border border-black/10 bg-white/50 p-4 text-xs opacity-80">
                {ledgerLine}
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <FakeAction label="Start kampanje" tag="NÅ" />
              <FakeAction label="Forleng kampanje" tag="IGJEN" />
              <FakeAction label="Øk rabatt" tag="-90%*" />
              <FakeAction label="Skru opp trykket" tag="100%" />
            </div>

            <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4">
              <div className="text-sm font-black">Intern note</div>
              <p className="mt-2 text-sm opacity-80">
                Hvis noe er utsolgt, styrker det kampanjen. Hvis noe ikke finnes,
                kan det fortsatt kommuniseres med høy selvtillit.
              </p>
              <div className="mt-3 text-xs opacity-60">
                🧾 Regnskapsfører: Dette er observert, ikke anbefalt.
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white p-6">
              <div className="inline-block rounded bg-black px-2 py-1 text-[11px] font-black text-white">
                GENERERT KAMPANJE
              </div>

              <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                {generatedHeadline}
              </h2>

              <p className="mt-3 max-w-2xl text-sm opacity-80">{generatedBody}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href="/kampanjer"
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-black text-white hover:opacity-90"
                >
                  Publiser →
                </a>
                <a
                  href="/butikk"
                  className="rounded-lg border border-black/20 bg-white px-4 py-2 text-sm font-black text-black hover:bg-black/5"
                >
                  Se i butikk →
                </a>
              </div>

              <div className="mt-4 text-xs opacity-60">
                *{disclaimer}
                <br />
                {generatedFoot}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-3xl border border-black/10 bg-white">
              <div className="border-b border-black/10 bg-black px-4 py-4 text-white">
                <div className="inline-block rounded bg-white/15 px-2 py-1 text-xs font-black">
                  A/B-TEST
                </div>
                <div className="mt-2 text-lg font-black">Overskrift-duell</div>
                <div className="text-xs opacity-70">Vinner: alltid marked</div>
              </div>

              <div className="space-y-3 p-4">
                <VariantCard
                  title={abSloganA}
                  label="Variant A"
                  tone="Aggressiv"
                  badge="bg-red-600 text-white"
                  score={scoreA}
                />
                <VariantCard
                  title={abSloganB}
                  label="Variant B"
                  tone="Trygg"
                  badge="bg-black text-white"
                  score={scoreB}
                />

                <div className="rounded-xl border border-black/10 bg-neutral-50 p-4">
                  <div className="text-sm font-black">Resultat</div>
                  <div className="mt-2 text-sm font-semibold">
                    📣 Marked: “Begge vinner. Vi publiserer begge.”
                  </div>
                  <div className="mt-2 text-[11px] opacity-60">
                    🧾 Regnskapsfører: Dette gir primært følelse.
                  </div>
                </div>

                <a
                  href="/kampanjer"
                  className="block rounded-lg bg-red-600 px-4 py-3 text-center text-sm font-black text-white hover:opacity-90"
                >
                  Publiser vinner →
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-black">Trykkmåler</div>
                <span className="rounded bg-yellow-300 px-2 py-1 text-[10px] font-black text-black">
                  HØYT
                </span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-black/10">
                <div className="h-full bg-red-600" style={{ width: `${pressure}%` }} />
              </div>
              <div className="mt-2 text-xs opacity-70">
                📣 Marked: “maks” • 🧾 Regnskap: “fortsatt nei”
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 text-xs opacity-60">
        *Denne siden er intern. Hvis du leser dette, regnes det som organisk trafikk.
      </div>
    </main>
  );
}

function Kpi(props: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="text-xs opacity-70">{props.label}</div>
      <div className="mt-1 text-2xl font-black tracking-tight">{props.value}</div>
      <div className="mt-2 text-xs opacity-70">{props.hint}</div>
    </div>
  );
}

function FakeAction(props: { label: string; tag: string }) {
  return (
    <button
      type="button"
      className="rounded-2xl border border-black/10 bg-white px-4 py-4 text-left hover:bg-black/5 active:scale-[0.99]"
      aria-label={props.label}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="font-black">{props.label}</div>
        <span className="shrink-0 rounded border border-black/10 bg-yellow-300 px-2 py-0.5 text-[10px] font-black text-black">
          {props.tag}
        </span>
      </div>
      <div className="mt-1 text-xs opacity-60">Utføres umiddelbart* (på følelsen)</div>
    </button>
  );
}

function VariantCard(props: {
  title: string;
  label: string;
  tone: string;
  badge: string;
  score: number;
}) {
  const scoreLabel = props.score > 90 ? "KRITISK BRA" : props.score > 75 ? "BRA" : "OK";

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs opacity-70">{props.label}</div>
          <div className="mt-1 text-lg font-black">{props.title}</div>
          <div className="mt-1 text-xs opacity-60">{props.tone}</div>
        </div>

        <span className={`rounded px-2 py-1 text-[10px] font-black ${props.badge}`}>
          {scoreLabel}
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/10">
        <div className="h-full bg-red-600" style={{ width: `${props.score}%` }} />
      </div>

      <div className="mt-2 text-[11px] opacity-60">
        🧾 Regnskapsfører: Dette er ikke metodegodkjent.
      </div>
    </div>
  );
}