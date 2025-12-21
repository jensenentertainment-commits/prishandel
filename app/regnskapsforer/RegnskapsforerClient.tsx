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
    pill: "bg-green-600 text-white",
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

const FAQ = [
  {
    q: "Er regnskapsfører en ekte person?",
    a: "Ja. Dessverre. Vedkommende er også den eneste som leser vilkår.",
  },
  {
    q: "Hvorfor er alt utsolgt?",
    a: "Strategisk knapphet. Også kjent som «null lager».",
  },
  {
    q: "Hvorfor kjører dere konstant tilbud?",
    a: "Fordi det fungerer. Og fordi det aldri ble stoppet.",
  },
  {
    q: "Hva betyr stjernen (*)?",
    a: "At løftet gjelder der det passer oss og vår mentale tilstand.",
  },
  {
    q: "Kan jeg kontakte regnskapsfører?",
    a: "Du kan prøve. Regnskapsfører svarer når marginene er positive.",
  },
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
  if (!mounted) return null;

  const s = useMemo(() => pick(STATUS, seed), [seed]);

  const kpis = useMemo(() => {
    const s1 = h32(`kpi:${seed}:1`);
    const s2 = h32(`kpi:${seed}:2`);
    const s3 = h32(`kpi:${seed}:3`);
    const s4 = h32(`kpi:${seed}:4`);

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
  }, [seed]);

  const risk = useMemo(() => {
    // Små drift per besøk, men alltid “rimelig”
    const a = h32(`risk:${seed}:a`);
    const b = h32(`risk:${seed}:b`);
    const c = h32(`risk:${seed}:c`);
    const d = h32(`risk:${seed}:d`);

    return {
      prispress: clamp(92 + (a % 9), 85, 99),
      etterpaklokskap: clamp(8 + (b % 14), 0, 30),
      kundetilfredshet: clamp(78 + (c % 18), 50, 96),
      puls: clamp(128 + (d % 28), 90, 160),
    };
  }, [seed]);

  const events = useMemo(() => {
    // Base + 2–3 ekstra, og “rotér” litt
    const nExtra = 2 + (seed % 2); // 2..3
    const extras: typeof EVENTS_EXTRA[number][] = [];
    for (let i = 0; i < nExtra; i++) {
      extras.push(pick(EVENTS_EXTRA, h32(`extra:${seed}:${i}`)));
    }

    const merged = [...EVENTS_BASE, ...extras];

    // liten “shuffle” som føles systematisk
    const scored = merged.map((e) => ({
      e,
      s: h32(`evt:${seed}:${e.time}:${e.text}`),
    }));
    scored.sort((x, y) => (x.s % 97) - (y.s % 97));

    // behold et “logg-lengde” som ser ekte ut
    return scored.slice(0, 10).map((x) => x.e);
  }, [seed]);

  const quote = useMemo(() => pick(QUOTES, seed >>> 2), [seed]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2">
            <span className="rounded bg-black text-yellow-300 px-3 py-1 text-xs font-black">
              OFFISIELL
            </span>
            <span className="text-sm font-semibold opacity-80">
              Økonomiavdelingens informasjonsflate
            </span>
          </div>

          <h1 className="mt-3 text-3xl md:text-4xl font-black">Regnskapsfører</h1>
          <p className="mt-2 text-sm md:text-base opacity-75 max-w-2xl">
            Status, hendelseslogg og vurderinger knyttet til kontinuerlig prispress.
            Dette er ikke en klageside. Det er en dokumentasjon.
          </p>
          <div className="mt-2 text-xs font-semibold opacity-60">
            Besøk: <span className="font-black">{visit}</span> • Oppdatering: automatisk, uten samtykke.
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="/butikk"
            className="rounded-lg bg-red-600 text-white px-5 py-3 font-black hover:opacity-90"
          >
            TILBAKE TIL BUTIKK →
          </a>
          <a
            href="/kampanjer"
            className="rounded-lg bg-white text-black px-5 py-3 font-black border border-black/20 hover:bg-black/5"
          >
            SE KAMPANJER
          </a>
        </div>
      </div>

      {/* status + KPI */}
      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className={`rounded-2xl border shadow-sm p-6 ${s.box}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="font-black">Status</div>
            <span className={`text-xs font-black rounded px-2 py-1 ${s.pill}`}>
              {s.label}
            </span>
          </div>
          <p className="mt-3 text-sm font-semibold opacity-90">{s.desc}</p>

          <div className="mt-4 text-xs opacity-70">
            Sist oppdatert: automatisk, uten samtykke.
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              disabled
              className="rounded-lg bg-black text-white px-4 py-2 font-black opacity-40 cursor-not-allowed"
            >
              GODKJENN KAMPANJE
            </button>
            <button
              disabled
              className="rounded-lg border border-black/20 bg-white px-4 py-2 font-black opacity-40 cursor-not-allowed"
            >
              STANS KAMPANJE
            </button>
          </div>
          <div className="mt-2 text-xs opacity-60">
            Begge knapper er deaktivert av markedsavdelingen.
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-black/10 shadow-sm p-6">
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

        <div className="rounded-2xl bg-white border border-black/10 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="font-black">Risikobånd</div>
            <span className="text-xs font-black rounded bg-red-600 text-white px-2 py-1">
              HØY
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <RiskBar label="Prispress" value={risk.prispress} />
            <RiskBar label="Etterpåklokskap" value={risk.etterpaklokskap} />
            <RiskBar label="Kundetilfredshet" value={risk.kundetilfredshet} />
            <RiskBar label="Regnskapsfører-puls" value={risk.puls} unit=" bpm" />
          </div>

          <div className="mt-4 rounded-lg bg-yellow-300 border border-black/10 p-4">
            <div className="font-black text-sm">Tiltak</div>
            <p className="mt-1 text-sm opacity-90">
              Anbefaling: Reduser kampanjer.
              <span className="font-black"> Status: ignorert.</span>
            </p>
          </div>
        </div>
      </section>

      {/* log */}
      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black">Hendelseslogg</h2>
            <p className="text-sm opacity-70">Dette er ikke drama. Dette er drift.</p>
          </div>
          <button
            disabled
            className="rounded-lg bg-green-600 text-white px-4 py-2 font-black opacity-40 cursor-not-allowed"
          >
            EKSPORTER TIL EXCEL
          </button>
        </div>

        <div className="mt-4 rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 bg-neutral-50 border-b border-black/10 px-4 py-3 text-xs font-black">
            <div className="col-span-2">Tid</div>
            <div className="col-span-10">Hendelse</div>
          </div>

          <div className="divide-y divide-black/10">
            {events.map((e) => (
              <div key={e.time + e.text} className="grid grid-cols-12 px-4 py-3">
                <div className="col-span-2 text-sm font-black">{e.time}</div>
                <div className="col-span-10 text-sm opacity-80">{e.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 text-xs opacity-60">Loggen er automatisk. Ansvar er teoretisk.</div>
      </section>

      {/* FAQ + contact */}
      <section className="mt-10 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-black/10 shadow-sm p-6">
          <h2 className="text-2xl font-black">Spørsmål & svar</h2>
          <p className="mt-1 text-sm opacity-70">Standard spørsmål. Ustandard svar.</p>

          <div className="mt-6 space-y-4">
            {FAQ.map((item) => (
              <div key={item.q} className="rounded-xl border border-black/10 p-4">
                <div className="font-black">{item.q}</div>
                <div className="mt-1 text-sm opacity-80">{item.a}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-black/10 shadow-sm p-6">
          <h2 className="text-xl font-black">Kontakt</h2>
          <p className="mt-1 text-sm opacity-70">
            Dette skjemaet videresendes til økonomiavdelingen.*
          </p>

          <form className="mt-4 space-y-3">
            <input className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm" placeholder="Navn" />
            <input className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm" placeholder="E-post" />
            <select className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-semibold">
              <option>Henvendelse: Pris</option>
              <option>Henvendelse: Lager</option>
              <option>Henvendelse: Angrerett</option>
              <option>Henvendelse: Regnskapsfører</option>
            </select>
            <textarea
              className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm"
              placeholder="Melding (valgfritt, blir ignorert med stil)"
              rows={5}
            />
            <button
              type="button"
              disabled
              className="w-full rounded-lg bg-red-600 text-white py-3 font-black opacity-40 cursor-not-allowed"
            >
              SEND INN (MIDLERTIDIG UTILGJENGELIG)
            </button>
          </form>

          <div className="mt-3 text-xs opacity-60">*Videresending kan avvike fra virkeligheten.</div>

          <div className="mt-5 rounded-lg bg-neutral-50 border border-black/10 p-4">
            <div className="font-black text-sm">Regnskapsfører sier:</div>
            <p className="mt-1 text-sm opacity-80">{quote}</p>
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="mt-10">
        <div className="rounded-2xl bg-red-600 text-white border border-black/10 shadow-sm p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-xs font-black rounded bg-white/15 px-2 py-1 inline-block">
              KAMPANJE PÅGÅR
            </div>
            <h3 className="mt-2 text-2xl font-black">Prisene gir seg aldri. Det gjør lageret.</h3>
            <p className="mt-1 text-sm opacity-90">Se tilbudene før de blir enda mer uansvarlige.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/butikk"
              className="rounded-lg bg-white text-black px-5 py-3 font-black hover:opacity-90"
            >
              SE TILBUDENE →
            </a>
            <a
              href="/kampanjer"
              className="rounded-lg border border-white/30 px-5 py-3 font-black hover:bg-white/10"
            >
              KAMPANJER
            </a>
          </div>
        </div>
      </section>

      <div className="mt-8 rounded-2xl border border-black/10 bg-white p-4">
        <div className="text-xs font-black opacity-70">🧾 Intern referanse</div>
        <div className="mt-1 text-sm opacity-80">
          Driftstatus (ikke offentlig). Hvis du ser dette, er det notert.
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <a
            href="/intern"
            className="inline-flex rounded-lg bg-white text-black px-4 py-2 text-sm font-black border border-black/20 hover:bg-black/5"
          >
            Åpne intern status →
          </a>
          <span className="text-xs opacity-60">Arkivert. Deling frarådes.</span>
        </div>
      </div>

      <div className="mt-6 text-xs opacity-50">
        Prishandel tar økonomi på alvor. Derfor outsources den til regnskapsfører.
      </div>
    </main>
  );
}

function Kpi({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-xl bg-neutral-50 border border-black/10 p-4">
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
      <div className="mt-1 h-3 rounded-full bg-neutral-200 overflow-hidden border border-black/10">
        <div className="h-full bg-red-600" style={{ width: `${Math.min(display, 100)}%` }} />
      </div>
    </div>
  );
}
