"use client";

import { useMemo } from "react";
import { voices } from "../lib/voices";
import { useVisitVariant } from "../lib/useVisitVariant";
import { pick, h32 } from "../lib/visitSeed";

type Kind = "generic" | "price" | "shipping" | "coupon" | "stock";

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

const TEST_VARIANTS = [
  { label: "Variant A", tone: "Aggressiv", color: "bg-red-600 text-white" },
  { label: "Variant B", tone: "Trygg", color: "bg-black text-white" },
  { label: "Variant C", tone: "Norsk-billig", color: "bg-yellow-300 text-black" },
] as const;

function randIntSeed(seed: number, min: number, max: number) {
  const span = max - min + 1;
  return min + (seed % span);
}

export default function MarkedsavdelingClient() {
  const { mounted, visit, seed } = useVisitVariant("markedsavdeling");
  if (!mounted) return null;

  const kinds: Kind[] = ["generic", "price", "shipping", "coupon", "stock"];

  const k1 = useMemo(() => pick(kinds, seed), [seed]);
  const k2 = useMemo(() => pick(kinds, seed >>> 3), [seed]);

  const marketLine = useMemo(() => voices.market.say(k1), [k1]);
  const ledgerLine = useMemo(() => voices.ledger.say(k1), [k1]);

  const disclaimer = useMemo(() => pick(DISCLAIMERS, seed >>> 5), [seed]);
  const abSloganA = useMemo(() => pick(SLOGANS, seed >>> 7), [seed]);
  const abSloganB = useMemo(() => pick(SLOGANS, seed >>> 9), [seed]);

  // “Tall” som alltid er overdrevet, men stabilt per besøk
  const conversion = useMemo(() => randIntSeed(h32(`conv:${seed}`), 187, 642), [seed]);
  const urgency = useMemo(() => randIntSeed(h32(`urg:${seed}`), 91, 100), [seed]);
  const clicks = useMemo(() => randIntSeed(h32(`clk:${seed}`), 1203, 9321), [seed]);
  const complaints = useMemo(() => randIntSeed(h32(`cmp:${seed}`), 0, 3), [seed]);
  const campaigns = useMemo(() => randIntSeed(h32(`cam:${seed}`), 12, 28), [seed]);

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
      seed >>> 11,
    );
    return `${pick(SLOGANS, seed >>> 13)} ${noun}`;
  }, [seed]);

  const generatedBody = useMemo(() => voices.market.say(k2), [k2]);
  const generatedFoot = useMemo(() => `🧾 Regnskapsfører: ${voices.ledger.ps()}`, [seed]);

  // “Sist oppdatert”: føles live, men er bare en “intern” stamp
  const updatedAt = useMemo(() => {
    const hh = String(randIntSeed(h32(`hh:${seed}`), 8, 16)).padStart(2, "0");
    const mm = String(randIntSeed(h32(`mm:${seed}`), 0, 59)).padStart(2, "0");
    return `${hh}:${mm}`;
  }, [seed]);

  const scoreA = useMemo(() => randIntSeed(h32(`sa:${seed}`), 51, 99), [seed]);
  const scoreB = useMemo(() => randIntSeed(h32(`sb:${seed}`), 51, 99), [seed]);

  const pressure = useMemo(() => randIntSeed(h32(`press:${seed}`), 92, 100), [seed]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-300 text-black px-3 py-1 text-xs font-black border border-black/10">
            📣 MARKEDSAVDELING / KAMPANJELAB
          </div>
          <h1 className="mt-3 text-4xl font-black tracking-tight">Kampanje-generator</h1>
          <p className="mt-2 text-sm opacity-80 max-w-2xl">
            Denne siden er intern og bør ikke være synlig. Den brukes til å produsere kampanjer
            raskere enn virkeligheten.
          </p>
          <div className="mt-2 text-xs font-semibold opacity-60">
            Besøk: <span className="font-black">{visit}</span> • Modus: “produksjon”
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href="/kampanjer"
            className="rounded-xl bg-red-600 text-white px-4 py-2 font-black hover:opacity-90"
          >
            PUBLISER KAMPANJER →
          </a>
          <a
            href="/intern"
            className="rounded-xl bg-white text-black px-4 py-2 font-black border border-black/20 hover:bg-black/5"
          >
            Tilbake til intern →
          </a>
        </div>
      </div>

      {/* KPI row */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Kpi label="Konvertering" value={`${conversion}%`} hint="📣 Marked: fantastisk" />
        <Kpi label="Hastverk" value={`${urgency}%`} hint="📣 Marked: mer!" />
        <Kpi label="Klikk" value={clicks.toLocaleString("nb-NO")} hint="📣 Marked: høyere" />
        <Kpi label="Klagegrad" value={`${complaints}%`} hint="📣 Marked: lavt" />
        <Kpi label="Aktive kampanjer" value={campaigns.toString()} hint="🧾 Regnskap: nei" />
      </div>

      {/* split */}
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {/* propaganda */}
        <section className="rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-black/10 bg-red-600 text-white flex items-center justify-between">
            <div>
              <div className="text-xs font-black rounded bg-white/15 px-2 py-1 inline-block">
                LIVE PROPAGANDA
              </div>
              <div className="mt-2 text-lg font-black">Broadcast</div>
              <div className="text-xs opacity-90">Sist oppdatert: {updatedAt}*</div>
            </div>

            <span className="text-xs font-black rounded bg-white/15 px-2 py-1">AKTIV</span>
          </div>

          <div className="p-5 space-y-3">
            <div className="rounded-xl bg-yellow-300 border border-black/10 p-4">
              <div className="text-sm font-black">{marketLine}</div>
              <div className="mt-2 text-xs opacity-70">{disclaimer}</div>
              <div className="mt-2 text-[11px] opacity-60">{ledgerLine}</div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <FakeAction label="Start kampanje" tag="NÅ" tone="market" />
              <FakeAction label="Forleng kampanje" tag="IGJEN" tone="market" />
              <FakeAction label="Øk rabatt" tag="-90%*" tone="market" />
              <FakeAction label="Skru opp trykket" tag="100%" tone="market" />
            </div>

            <div className="rounded-xl bg-white border border-black/10 p-4">
              <div className="text-sm font-black">Intern note</div>
              <p className="mt-2 text-sm opacity-80">
                Husk: det viktigste er at det ser ut som det går fort. Hvis noe er utsolgt, er det et tegn
                på suksess.
              </p>
              <div className="mt-3 text-xs opacity-60">🧾 Regnskapsfører: Dette er notert.</div>
            </div>
          </div>
        </section>

        {/* A/B-test */}
        <section className="rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-black/10 bg-black text-white flex items-center justify-between">
            <div>
              <div className="text-xs font-black rounded bg-white/15 px-2 py-1 inline-block">
                A/B-TEST (uverifisert)
              </div>
              <div className="mt-2 text-lg font-black">Overskrift-duell</div>
              <div className="text-xs opacity-70">Vinner: alltid marked</div>
            </div>

            <a
              href="/kampanjer"
              className="text-xs font-black rounded bg-white/15 px-2 py-1 hover:opacity-90"
            >
              Se kampanjer →
            </a>
          </div>

          <div className="p-5 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <VariantCard
                title={abSloganA}
                label={TEST_VARIANTS[0].label}
                tone={TEST_VARIANTS[0].tone}
                badge={TEST_VARIANTS[0].color}
                score={scoreA}
              />
              <VariantCard
                title={abSloganB}
                label={TEST_VARIANTS[1].label}
                tone={TEST_VARIANTS[1].tone}
                badge={TEST_VARIANTS[1].color}
                score={scoreB}
              />
            </div>

            <div className="rounded-xl bg-neutral-50 border border-black/10 p-4">
              <div className="text-sm font-black">Resultat</div>
              <div className="mt-2 text-sm font-semibold">
                📣 Marked: “Begge vinner. Vi publiserer begge.”
              </div>
              <div className="mt-2 text-[11px] opacity-60">🧾 Regnskapsfører: Dette gir primært følelse.</div>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              <a
                href="/kampanjer"
                className="rounded-lg bg-red-600 text-white px-4 py-2 text-sm font-black hover:opacity-90 text-center"
              >
                Publiser A →
              </a>
              <a
                href="/kampanjer"
                className="rounded-lg bg-black text-white px-4 py-2 text-sm font-black hover:opacity-90 text-center"
              >
                Publiser B →
              </a>
              <a
                href="/kampanjer"
                className="rounded-lg bg-yellow-300 text-black px-4 py-2 text-sm font-black hover:opacity-90 text-center border border-black/10"
              >
                Publiser alt →
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Generated campaign */}
      <section className="mt-8 rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-black/10 bg-neutral-50 flex items-center justify-between">
          <div>
            <div className="text-lg font-black">Generert kampanje</div>
            <div className="text-xs opacity-70">Auto-produseres kontinuerlig • kvalitet uavklart</div>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href="/kampanjer"
              className="rounded-lg bg-red-600 text-white px-4 py-2 text-sm font-black hover:opacity-90"
            >
              Publiser →
            </a>
            <a
              href="/butikk"
              className="rounded-lg bg-white text-black px-4 py-2 text-sm font-black border border-black/20 hover:bg-black/5"
            >
              Se i butikk →
            </a>
          </div>
        </div>

        <div className="p-5 grid gap-4 lg:grid-cols-[1fr,340px]">
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <div className="text-xs font-black rounded bg-yellow-300 text-black px-2 py-1 inline-block border border-black/10">
              KAMPANJE
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-tight">{generatedHeadline}</h2>
            <p className="mt-2 text-sm opacity-80">{generatedBody}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="/kampanjer"
                className="rounded-lg bg-red-600 text-white px-4 py-2 text-sm font-black hover:opacity-90"
              >
                Kjøp nå →
              </a>
              <a
                href="/utsolgt"
                className="rounded-lg bg-white text-black px-4 py-2 text-sm font-black border border-black/20 hover:bg-black/5"
              >
                Sjekk lager (0)
              </a>
            </div>

            <div className="mt-4 text-xs opacity-60">
              *{disclaimer} <br />
              {generatedFoot}
            </div>
          </div>

          <div className="rounded-2xl bg-neutral-50 border border-black/10 p-4 space-y-3">
            <div className="text-sm font-black">Hurtigverktøy</div>

            <div className="rounded-xl bg-white border border-black/10 p-4">
              <div className="text-sm font-black">CTA-knapptekst</div>
              <div className="mt-2 grid gap-2">
                {["KJØP NÅ", "SE TILBUD", "HASTER", "MER KUPP"].map((t, i) => (
                  <div
                    key={t}
                    className="flex items-center justify-between rounded-lg border border-black/10 px-3 py-2 text-sm font-black"
                  >
                    <span>{t}</span>
                    <span className="text-[10px] rounded bg-black text-white px-2 py-0.5">
                      {i === (seed % 4) ? "VALGT" : "AKTIV"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-[11px] opacity-60">🧾 Regnskapsfører: Tallene er ikke konsultert.</div>
            </div>

            <div className="rounded-xl bg-white border border-black/10 p-4">
              <div className="text-sm font-black">Trykkmåler</div>
              <div className="mt-2 h-3 rounded-full bg-black/10 overflow-hidden">
                <div className="h-full bg-red-600" style={{ width: `${pressure}%` }} />
              </div>
              <div className="mt-2 text-xs opacity-70">📣 Marked: “maks” • 🧾 Regnskap: “nei”</div>
            </div>

            <div className="rounded-xl bg-white border border-black/10 p-4">
              <div className="text-sm font-black">Fotnote-generator</div>
              <div className="mt-2 text-sm opacity-80">{pick(DISCLAIMERS, seed >>> 15)}</div>
              <div className="mt-2 text-[11px] opacity-60">🧾 Regnskapsfører: {voices.ledger.ps()}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 text-xs opacity-60">
        *Denne siden er intern. Hvis du leser dette, har du sannsynligvis funnet den ved en feil.
        Markedsavdelingen kaller det “organisk trafikk”.
      </div>
    </main>
  );
}

function Kpi(props: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl bg-white border border-black/10 shadow-sm p-4">
      <div className="text-xs opacity-70">{props.label}</div>
      <div className="mt-1 text-2xl font-black tracking-tight">{props.value}</div>
      <div className="mt-2 text-xs opacity-70">{props.hint}</div>
    </div>
  );
}

function FakeAction(props: { label: string; tag: string; tone: "market" | "ledger" }) {
  const tagClasses =
    props.tone === "market"
      ? "bg-yellow-300 text-black border border-black/10"
      : "bg-black text-white border border-white/10";

  return (
    <button
      type="button"
      className="rounded-xl border border-black/10 bg-white px-4 py-3 text-left hover:bg-black/5 active:scale-[0.99]"
      aria-label={props.label}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="font-black">{props.label}</div>
        <span className={`shrink-0 text-[10px] font-black rounded px-2 py-0.5 ${tagClasses}`}>
          {props.tag}
        </span>
      </div>
      <div className="mt-1 text-xs opacity-60">Utføres umiddelbart* (på følelsen)</div>
    </button>
  );
}

function VariantCard(props: { title: string; label: string; tone: string; badge: string; score: number }) {
  const scoreLabel = props.score > 90 ? "KRITISK BRA" : props.score > 75 ? "BRA" : "OK";
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs opacity-70">{props.label}</div>
          <div className="mt-1 text-lg font-black">{props.title}</div>
          <div className="mt-1 text-xs opacity-60">{props.tone}</div>
        </div>
        <span className={`text-[10px] font-black rounded px-2 py-1 ${props.badge}`}>
          {scoreLabel}
        </span>
      </div>

      <div className="mt-3 h-2 rounded-full bg-black/10 overflow-hidden">
        <div className="h-full bg-green-600" style={{ width: `${props.score}%` }} />
      </div>

      <div className="mt-2 text-[11px] opacity-60">🧾 Regnskapsfører: Dette gir primært følelse.</div>
    </div>
  );
}
