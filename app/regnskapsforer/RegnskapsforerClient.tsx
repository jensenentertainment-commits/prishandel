"use client";

import { useMemo } from "react";
import { useVisitVariant } from "../lib/useVisitVariant";
import { pick, h32 } from "../lib/visitSeed";

const STATUS = [
  {
    label: "BEKYMRET",
    desc: "Ny kampanje oppdaget. Tiltak: sukk.",
    pill: "bg-yellow-300 text-black",
    box: "bg-yellow-300 border-black/10",
  },
  {
    label: "FORHANDLINGSMODUS",
    desc: "Prøver å forklare marginer til markedsavdelingen.",
    pill: "bg-red-600 text-white",
    box: "bg-white border-black/10",
  },
  {
    label: "FRAVÆRENDE",
    desc: "På pause. Mentalt. Fysisk til stede i Excel.",
    pill: "bg-black text-white",
    box: "bg-neutral-50 border-black/10",
  },
  {
    label: "AKSEPT",
    desc: "Har sluttet å kjempe. Nå logges alt.",
    pill: "bg-yellow-300 text-black",
    box: "bg-white border-black/10",
  },
] as const;

const EVENTS_BASE = [
  { time: "08:01", text: "Kampanje: «Alt må vekk» startet (uten varsel)." },
  { time: "08:02", text: "Regnskapsfører åpnet regneark. Lukket regneark." },
  { time: "09:14", text: "Førpriser ble «justert» for å se mer seriøse ut." },
  { time: "10:07", text: "Nytt produkt registrert: «Sunn fornuft». Avvist av systemet." },
  { time: "11:33", text: "Gratis frakt* aktivert. Stjerneforklaring oppdatert." },
  { time: "12:05", text: "Tiltak: sukk (igjen)." },
  { time: "13:22", text: "Forslag: «slutt med kampanjer». Avvist av kampanje." },
  { time: "14:48", text: "Klarna* lagt til. Mentalt." },
  { time: "15:01", text: "Ny e-post: «kan vi ha -90% på alt?» (ja)." },
] as const;

const EVENTS_EXTRA = [
  { time: "08:09", text: "Excel åpnet i protestmodus. Protest avvist." },
  { time: "09:02", text: "Kampanjeperiode forlenget (igjen) uten budsjett." },
  { time: "10:44", text: "Avvik oppdaget. Avvik godkjent." },
  { time: "11:11", text: "Kundeservice spurte «er dette lov?». Svar: *." },
  { time: "12:59", text: "Margin ble forsøkt innført. Ble fjernet av marked." },
  { time: "14:14", text: "Intern vurdering: «ser bra ut». Ekstern: «hjelp»." },
] as const;

const KPI_VARIANTS = {
  lager: ["0%", "0%*", "0.0%", "0% (konsekvent)"] as const,
  kampanjegrad: ["100%", "100%*", "100% (kronisk)", "99% (avrundet opp)"] as const,
  margin: ["Symbolsk", "Teoretisk", "Følelsesbasert", "I praksis: nei"] as const,
  suksess: ["Høy", "Overraskende høy", "Høy (til tross)", "Høy nok til å fortsette"] as const,
} as const;

const KPI_NOTES = {
  lager: ["Konsekvent", "Stabilt", "Dokumentert", "Strategisk"] as const,
  kampanjegrad: ["Kronisk", "Permanent", "Vedvarende", "Selvforsterkende"] as const,
  margin: ["Følelsesbasert", "Skjønnsmessig", "Midlertidig", "Avtalt i teorien"] as const,
  suksess: ["Til tross", "Mot bedre vitende", "På papiret", "I kampanjemodus"] as const,
} as const;

const QUOTES = [
  "“Jeg kan ikke stoppe dette. Jeg kan bare logge det.”",
  "“Tallene er fine. Konsekvensene er uklare.”",
  "“Hvis du ser dette, er det allerede notert.”",
  "“Det er ikke svindel. Det er kampanje.”",
] as const;

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function RegnskapsforerClient() {
  const { mounted, visit, seed } = useVisitVariant("regnskapsforer");
  const stableSeed = mounted ? seed : 0;

  const status = useMemo(() => pick(STATUS, stableSeed), [stableSeed]);

  const kpis = useMemo(() => {
    const s1 = h32(`kpi:${stableSeed}:1`);
    const s2 = h32(`kpi:${stableSeed}:2`);
    const s3 = h32(`kpi:${stableSeed}:3`);
    const s4 = h32(`kpi:${stableSeed}:4`);

    return {
      lager: {
        value: pick(KPI_VARIANTS.lager, s1),
        note: pick(KPI_NOTES.lager, s1 >>> 1),
      },
      kampanjegrad: {
        value: pick(KPI_VARIANTS.kampanjegrad, s2),
        note: pick(KPI_NOTES.kampanjegrad, s2 >>> 1),
      },
      margin: {
        value: pick(KPI_VARIANTS.margin, s3),
        note: pick(KPI_NOTES.margin, s3 >>> 1),
      },
      suksess: {
        value: pick(KPI_VARIANTS.suksess, s4),
        note: pick(KPI_NOTES.suksess, s4 >>> 1),
      },
    };
  }, [stableSeed]);

  const risk = useMemo(() => {
    const a = h32(`risk:${stableSeed}:a`);
    const b = h32(`risk:${stableSeed}:b`);
    const c = h32(`risk:${stableSeed}:c`);
    const d = h32(`risk:${stableSeed}:d`);

    return {
      prispress: clamp(92 + (a % 9), 85, 99),
      etterpaklokskap: clamp(8 + (b % 14), 0, 30),
      kundetilfredshet: clamp(78 + (c % 18), 50, 96),
      puls: clamp(128 + (d % 28), 90, 160),
    };
  }, [stableSeed]);

  const events = useMemo(() => {
    const nExtra = 2 + (stableSeed % 2);
    const extras: typeof EVENTS_EXTRA[number][] = [];

    for (let i = 0; i < nExtra; i++) {
      extras.push(pick(EVENTS_EXTRA, h32(`extra:${stableSeed}:${i}`)));
    }

    const merged = [...EVENTS_BASE, ...extras];

    const scored = merged.map((e) => ({
      e,
      s: h32(`evt:${stableSeed}:${e.time}:${e.text}`),
    }));

    scored.sort((x, y) => (x.s % 97) - (y.s % 97));

    return scored.slice(0, 10).map((x) => x.e);
  }, [stableSeed]);

  const quote = useMemo(() => pick(QUOTES, stableSeed >>> 2), [stableSeed]);

  const updatedAt = useMemo(() => {
    const hh = String(8 + (h32(`hh:${stableSeed}`) % 9)).padStart(2, "0");
    const mm = String(h32(`mm:${stableSeed}`) % 60).padStart(2, "0");
    return `${hh}:${mm}`;
  }, [stableSeed]);

  const criticalEvent = useMemo(() => {
    return pick(
      [
        "KRITISK AVVIK: Kampanje forlenget uten økonomisk grunnlag.",
        "KRITISK AVVIK: Prispress videreføres til tross for motstand.",
        "KRITISK AVVIK: Margin forsøkt innført og umiddelbart fjernet.",
        "KRITISK AVVIK: Drift følger markedets stemning, ikke tallgrunnlag.",
      ] as const,
      stableSeed >>> 4,
    );
  }, [stableSeed]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2">
            <span className="rounded bg-black px-3 py-1 text-xs font-black text-yellow-300">
              OFFISIELL
            </span>
            <span className="text-sm font-semibold opacity-80">
              Økonomiavdelingens informasjonsflate
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-black md:text-5xl">Regnskapsfører</h1>

          <p className="mt-2 max-w-2xl text-sm opacity-75 md:text-base">
            Status, logg og vurderinger knyttet til kontinuerlig prispress.
            Dette er ikke en protest. Det er dokumentasjon.
          </p>

          <div className="mt-2 text-xs font-semibold opacity-60">
            Besøk: <span className="font-black">{mounted ? visit : "—"}</span> •
            Oppdatering: {updatedAt} • samtykke: nei
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="/butikk"
            className="rounded-lg bg-red-600 px-5 py-3 font-black text-white hover:opacity-90"
          >
            Tilbake til butikk →
          </a>
          <a
            href="/kampanjer"
            className="rounded-lg border border-black/20 bg-white px-5 py-3 font-black text-black hover:bg-black/5"
          >
            Se kampanjer
          </a>
        </div>
      </div>

      <section className="mt-8 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
        <div className="border-b border-black/10 bg-black px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-yellow-300">
          ØKONOMISK TILSTAND  •  PRISPRESS HØYT  •  MOTSTAND REGISTRERT  •  STANS IKKE TILGJENGELIG
        </div>

        <div className="border-b border-black/10 bg-red-600 px-5 py-4 text-white">
          <div className="inline-flex items-center gap-2 rounded bg-white/15 px-2 py-1 text-xs font-black">
            <span className="inline-block h-2 w-2 rounded-full bg-white" />
            KRITISK HENDELSE
          </div>
          <div className="mt-2 text-xl font-black md:text-2xl">{criticalEvent}</div>
          <div className="mt-1 text-xs opacity-90">
            Tiltak foreslått. Tiltak ignorert.
          </div>
        </div>

        <div className="grid gap-4 p-5 lg:grid-cols-[1.02fr,1.45fr]">
          <div className="space-y-4">
            <div className={`rounded-3xl border p-6 shadow-sm ${status.box}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="font-black">Status</div>
                <span className={`rounded px-2 py-1 text-xs font-black ${status.pill}`}>
                  {status.label}
                </span>
              </div>

              <p className="mt-3 text-sm font-semibold opacity-90">{status.desc}</p>

              <div className="mt-4 text-xs opacity-70">
                Sist oppdatert: automatisk, uten samtykke.
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  disabled
                  className="cursor-not-allowed rounded-lg bg-black px-4 py-2 font-black text-white opacity-40"
                >
                  Godkjenn kampanje
                </button>
                <button
                  disabled
                  className="cursor-not-allowed rounded-lg border border-black/20 bg-white px-4 py-2 font-black opacity-40"
                >
                  Stans kampanje
                </button>
              </div>

              <div className="mt-2 text-xs opacity-60">
                Begge knapper er deaktivert av markedsavdelingen.
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="font-black">Nøkkeltall</div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Kpi label="Lagerstatus" value={kpis.lager.value} note={kpis.lager.note} />
                <Kpi label="Kampanjegrad" value={kpis.kampanjegrad.value} note={kpis.kampanjegrad.note} />
                <Kpi label="Margin" value={kpis.margin.value} note={kpis.margin.note} />
                <Kpi label="Suksessrate" value={kpis.suksess.value} note={kpis.suksess.note} />
              </div>

              <div className="mt-4 text-xs opacity-60">
                Tall kan avvike fra virkeligheten. Virkeligheten ble ikke konsultert.
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="font-black">Risikobånd</div>
                <span className="rounded bg-red-600 px-2 py-1 text-xs font-black text-white">
                  HØY
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <RiskBar label="Prispress" value={risk.prispress} />
                <RiskBar label="Etterpåklokskap" value={risk.etterpaklokskap} />
                <RiskBar label="Kundetilfredshet" value={risk.kundetilfredshet} />
                <RiskBar label="Regnskapsfører-puls" value={risk.puls} unit=" bpm" />
              </div>

              <div className="mt-4 rounded-2xl border border-black/10 bg-yellow-300 p-4">
                <div className="text-sm font-black">Tiltak</div>
                <p className="mt-1 text-sm opacity-90">
                  Anbefaling: Reduser kampanjer.
                  <span className="font-black"> Status: ignorert.</span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <section className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-black/10 bg-black px-5 py-4 text-white">
                <div>
                  <div className="inline-block rounded bg-white/15 px-2 py-1 text-xs font-black">
                    HENDELSESLOGG
                  </div>
                  <div className="mt-2 text-lg font-black">Driftsovervåkning</div>
                  <div className="text-xs opacity-70">
                    Dette er ikke drama. Dette er drift.
                  </div>
                </div>

                <button
                  disabled
                  className="cursor-not-allowed rounded bg-white/15 px-3 py-2 text-xs font-black opacity-50"
                >
                  Eksporter
                </button>
              </div>

              <div className="grid grid-cols-12 border-b border-black/10 bg-neutral-50 px-4 py-3 text-xs font-black">
                <div className="col-span-2">Tid</div>
                <div className="col-span-10">Hendelse</div>
              </div>

              <div className="divide-y divide-black/10">
                {events.map((e, index) => {
                  const emphasized = index === 1 || index === 4;

                  return (
                    <div
                      key={e.time + e.text}
                      className={[
                        "grid grid-cols-12 px-4 py-3",
                        emphasized ? "bg-red-50" : "bg-white",
                      ].join(" ")}
                    >
                      <div className="col-span-2 text-sm font-black">{e.time}</div>
                      <div className="col-span-10 text-sm opacity-80">{e.text}</div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-black/10 px-4 py-3 text-xs opacity-60">
                Loggen er automatisk. Ansvar er teoretisk.
              </div>
            </section>

            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-sm font-black">Regnskapsfører sier</div>
              <p className="mt-2 text-xl font-black leading-relaxed">{quote}</p>
              <div className="mt-3 text-xs opacity-60">
                Intern bemerkning: Hvis du ser dette, er det allerede notert.
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-red-600 p-6 text-white shadow-sm">
              <div className="inline-block rounded bg-white/15 px-2 py-1 text-xs font-black">
                KAMPANJE PÅGÅR
              </div>

              <h3 className="mt-2 text-2xl font-black md:text-3xl">
                Prisene gir seg aldri. Det gjør lageret.
              </h3>

              <p className="mt-1 text-sm opacity-90">
                Se tilbudene før de blir ytterligere begrunnet i etterkant.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/butikk"
                  className="rounded-lg bg-white px-5 py-3 font-black text-black hover:opacity-90"
                >
                  Se tilbudene →
                </a>
                <a
                  href="/kampanjer"
                  className="rounded-lg border border-white/30 px-5 py-3 font-black hover:bg-white/10"
                >
                  Kampanjer
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 text-xs opacity-50">
        Prishandel tar økonomi på alvor. Derfor outsources den til regnskapsfører.
      </div>
    </main>
  );
}

function Kpi({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-xl border border-black/10 bg-neutral-50 p-4">
      <div className="text-xs font-black opacity-70">{label}</div>
      <div className="mt-1 text-lg font-black">{value}</div>
      <div className="text-xs opacity-60">{note}</div>
    </div>
  );
}

function RiskBar({
  label,
  value,
  unit = "%",
}: {
  label: string;
  value: number;
  unit?: string;
}) {
  const display = Math.min(value, 999);

  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold opacity-80">
        <span>{label}</span>
        <span className="font-black">
          {display}
          {unit}
        </span>
      </div>
      <div className="mt-1 h-3 overflow-hidden rounded-full border border-black/10 bg-neutral-200">
        <div
          className="h-full bg-red-600"
          style={{ width: `${Math.min(display, 100)}%` }}
        />
      </div>
    </div>
  );
}