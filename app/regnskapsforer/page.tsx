export const metadata = {
  title: "Regnskapsfører | Prishandel",
  description: "Status, hendelseslogg og offisiell vurdering av kampanjer.",
};

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
];

// enkel pseudo-random basert på dag/klokke (uten client hooks)
function pickStatus() {
  const n = new Date().getMinutes();
  return STATUS[n % STATUS.length];
}

const EVENTS = [
  { time: "08:01", text: "Kampanje: «Alt må vekk» startet (uten varsel)." },
  { time: "08:02", text: "Regnskapsfører åpnet regneark. Lukket regneark." },
  { time: "09:14", text: "Førpriser ble «justert» for å se mer seriøse ut." },
  { time: "10:07", text: "Nytt produkt registrert: «Sunn fornuft». Avvist av systemet." },
  { time: "11:33", text: "Gratis frakt* aktivert. Stjerneforklaring oppdatert." },
  { time: "12:05", text: "Tiltak: sukk (igjen)." },
  { time: "13:22", text: "Forslag: «slutt med kampanjer». Avvist av kampanje." },
  { time: "14:48", text: "Klarna* lagt til. Mentalt." },
  { time: "15:01", text: "Ny e-post: «kan vi ha -90% på alt?» (ja)." },
];

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
];

export default function RegnskapsforerPage() {
  const s = pickStatus();

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

          <h1 className="mt-3 text-3xl md:text-4xl font-black">
            Regnskapsfører
          </h1>
          <p className="mt-2 text-sm md:text-base opacity-75 max-w-2xl">
            Status, hendelseslogg og vurderinger knyttet til kontinuerlig prispress.
            Dette er ikke en klageside. Det er en dokumentasjon.
          </p>
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
            <Kpi label="Lagerstatus" value="0%" note="Konsekvent" />
            <Kpi label="Kampanjegrad" value="100%" note="Kronisk" />
            <Kpi label="Margin" value="Symbolsk" note="Følelsesbasert" />
            <Kpi label="Suksessrate" value="Høy" note="Til tross" />
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
            <RiskBar label="Prispress" value={96} />
            <RiskBar label="Etterpåklokskap" value={12} />
            <RiskBar label="Kundetilfredshet" value={88} />
            <RiskBar label="Regnskapsfører-puls" value={140} unit=" bpm" />
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
            <p className="text-sm opacity-70">
              Dette er ikke drama. Dette er drift.
            </p>
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
            {EVENTS.map((e) => (
              <div key={e.time + e.text} className="grid grid-cols-12 px-4 py-3">
                <div className="col-span-2 text-sm font-black">{e.time}</div>
                <div className="col-span-10 text-sm opacity-80">{e.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 text-xs opacity-60">
          Loggen er automatisk. Ansvar er teoretisk.
        </div>
      </section>

      {/* FAQ + contact */}
      <section className="mt-10 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-black/10 shadow-sm p-6">
          <h2 className="text-2xl font-black">Spørsmål & svar</h2>
          <p className="mt-1 text-sm opacity-70">
            Standard spørsmål. Ustandard svar.
          </p>

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
            <input
              className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm"
              placeholder="Navn"
            />
            <input
              className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm"
              placeholder="E-post"
            />
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

          <div className="mt-3 text-xs opacity-60">
            *Videresending kan avvike fra virkeligheten.
          </div>

          <div className="mt-5 rounded-lg bg-neutral-50 border border-black/10 p-4">
            <div className="font-black text-sm">Regnskapsfører sier:</div>
            <p className="mt-1 text-sm opacity-80">
              “Jeg kan ikke stoppe dette. Jeg kan bare logge det.”
            </p>
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
            <h3 className="mt-2 text-2xl font-black">
              Prisene gir seg aldri. Det gjør lageret.
            </h3>
            <p className="mt-1 text-sm opacity-90">
              Se tilbudene før de blir enda mer uansvarlige.
            </p>
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
    <span className="text-xs opacity-60">
      Arkivert. Deling frarådes.
    </span>
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
        <div
          className="h-full bg-red-600"
          style={{ width: `${Math.min(display, 100)}%` }}
        />
      </div>
    </div>
    
  );
}
