export const metadata = {
  title: "Utsolgt | Prishandel",
  description: "Dokumentasjon på kontinuerlig mangel. Og kontinuerlig kampanje.",
};

const STATS = [
  { label: "Utsolgt i dag", value: "100%", note: "Stabilt" },
  { label: "Varer tilgjengelig", value: "0", note: "Strategisk" },
  { label: "Leveringspresisjon", value: "0%", note: "Konsekvent" },
  { label: "Regnskapsfører-puls", value: "140 bpm", note: "Varierer" },
];

const SOLD_OUT_TOP = [
  { name: "Verdighet – Premium", reason: "Ble utsolgt før vi la den ut." },
  { name: "Mot (Limited Edition)", reason: "Fortsatt på ønskelista til alle." },
  { name: "Frisk luft – 0,5L", reason: "Transporteres via håp." },
  { name: "Sunn fornuft", reason: "Import stoppet av virkeligheten." },
  { name: "Tålmodighet – familiepakke", reason: "Forsvant i køen." },
  { name: "Indre ro – reiseutgave", reason: "Midlertidig fjernet grunnet ettertanke." },
];

const FEED = [
  "12 personer ser på «Verdighet» akkurat nå*",
  "Ny kampanje oppdaget. Regnskapsfører noterer.",
  "Gratis frakt* aktivert (på papiret).",
  "Kunde forsøkte å kjøpe Sunn fornuft. Systemet svarte «nei».",
  "Kampanje forlenget. Ingen vet hvorfor.",
  "Lagerstatus oppdatert: 0 (ingen endring).",
  "Kupongkode «HASTER» testet. Resultat: følelse.",
];

function Bar({ label, value, color = "bg-red-600" }: { label: string; value: number; color?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold opacity-80">
        <span>{label}</span>
        <span className="font-black">{value}%</span>
      </div>
      <div className="mt-1 h-3 rounded-full bg-neutral-200 overflow-hidden border border-black/10">
        <div className={`h-full ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  );
}

function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-xl bg-neutral-50 border border-black/10 p-4">
      <div className="text-xs font-black opacity-70">{label}</div>
      <div className="mt-1 text-lg font-black">{value}</div>
      <div className="text-xs opacity-60">{note}</div>
    </div>
  );
}

export default function UtsolgtPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2">
            <span className="rounded bg-red-600 text-white px-3 py-1 text-xs font-black">
              ALLTID UTSOLGT
            </span>
            <span className="text-sm font-semibold opacity-80">
              Dokumentasjon på mangel (og kampanje)
            </span>
          </div>

          <h1 className="mt-3 text-3xl md:text-4xl font-black">Utsolgt</h1>
          <p className="mt-2 text-sm md:text-base opacity-75 max-w-2xl">
            Noen butikker går tomme av og til. Prishandel har gjort det til en
            livsstil. Her er status, statistikk og et forsøk på forklaring.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="/butikk"
            className="rounded-lg bg-red-600 text-white px-5 py-3 font-black hover:opacity-90"
          >
            SE TILBUDENE →
          </a>
          <a
            href="/kampanjer"
            className="rounded-lg bg-white text-black px-5 py-3 font-black border border-black/20 hover:bg-black/5"
          >
            KAMPANJER
          </a>
        </div>
      </div>

      {/* top banner */}
      <section className="mt-8">
        <div className="rounded-2xl bg-yellow-300 border border-black/10 shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-xs font-black rounded bg-black text-yellow-300 px-2 py-1 inline-block">
              STATUS
            </div>
            <h2 className="mt-2 text-2xl font-black">
              Lagerstatus: 0. Men kampanjen: 100%.
            </h2>
            <p className="mt-1 text-sm font-semibold opacity-80">
              Regnskapsfører foreslår “mindre kampanje”. Markedsavdelingen foreslår “mer”.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/regnskapsforer"
              className="rounded-lg bg-white text-black px-5 py-3 font-black border border-black/20 hover:bg-black/5"
            >
              SPØR REGNSKAPSFØRER
            </a>
            <button
              disabled
              className="rounded-lg bg-black text-white px-5 py-3 font-black opacity-50 cursor-not-allowed"
            >
              FYLL OPP LAGER
            </button>
          </div>
        </div>
      </section>

      {/* stats + bars */}
      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-white border border-black/10 shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">Nøkkeltall</h2>
            <span className="text-xs font-black rounded bg-red-600 text-white px-2 py-1">
              KRITISK
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {STATS.map((s) => (
              <StatCard key={s.label} label={s.label} value={s.value} note={s.note} />
            ))}
          </div>

          <div className="mt-6 rounded-xl bg-neutral-50 border border-black/10 p-5">
            <div className="font-black">Lageranalyse</div>
            <p className="mt-1 text-sm opacity-80">
              Tallene er eksakte. Problemet er tallene.
            </p>
            <div className="mt-4 space-y-3">
              <Bar label="Lager (varer tilgjengelig)" value={0} color="bg-green-600" />
              <Bar label="Utsolgt (varer utilgjengelig)" value={100} color="bg-red-600" />
              <Bar label="Kampanjeintensitet" value={96} color="bg-black" />
              <Bar label="Etterpåklokskap" value={12} color="bg-yellow-300" />
            </div>

            <div className="mt-3 text-xs opacity-60">
              Etterpåklokskap kan variere med kaffe.
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-black/10 shadow-sm p-6">
          <h2 className="text-xl font-black">Livefeed*</h2>
          <p className="mt-1 text-sm opacity-70">
            Oppdateres jevnlig. Uten grunn.
          </p>

          <div className="mt-4 space-y-2">
            {FEED.map((f, i) => (
              <div key={i} className="rounded-lg bg-neutral-50 border border-black/10 p-3 text-sm">
                <div className="text-xs font-black opacity-60">
                  Akkurat nå
                </div>
                <div className="mt-1 opacity-85">{f}</div>
              </div>
            ))}
          </div>

          <div className="mt-3 text-xs opacity-60">
            *livefeed kan være forhåndsskrevet.
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="/butikk"
              className="rounded-lg bg-red-600 text-white px-4 py-2 text-sm font-black hover:opacity-90"
            >
              HANDLE →
            </a>
            <a
              href="/kampanjer"
              className="rounded-lg bg-white text-black px-4 py-2 text-sm font-black border border-black/20 hover:bg-black/5"
            >
              SE KAMPANJER
            </a>
          </div>
        </div>
      </section>

      {/* top list */}
      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black">Mest utsolgt</h2>
            <p className="text-sm opacity-70">
              Produkter som aldri var tilgjengelige, men likevel er populære.
            </p>
          </div>

          <button
            disabled
            className="rounded-lg bg-green-600 text-white px-4 py-2 font-black opacity-50 cursor-not-allowed"
          >
            VARSLE MEG
          </button>
        </div>

        <div className="mt-4 rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 bg-neutral-50 border-b border-black/10 px-4 py-3 text-xs font-black">
            <div className="col-span-5">Produkt</div>
            <div className="col-span-5">Hvorfor utsolgt</div>
            <div className="col-span-2 text-right">Status</div>
          </div>

          <div className="divide-y divide-black/10">
            {SOLD_OUT_TOP.map((x) => (
              <div key={x.name} className="grid grid-cols-12 px-4 py-3 items-center">
                <div className="col-span-5 font-black">{x.name}</div>
                <div className="col-span-5 text-sm opacity-80">{x.reason}</div>
                <div className="col-span-2 text-right">
                  <span className="text-xs font-black rounded bg-red-600 text-white px-2 py-1">
                    UTSOLGT
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 text-xs opacity-60">
          Rangeringen beregnes basert på ren entusiasme.
        </div>
      </section>

      {/* CTA bottom */}
      <section className="mt-10">
        <div className="rounded-2xl bg-red-600 text-white border border-black/10 shadow-sm p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-xs font-black rounded bg-white/15 px-2 py-1 inline-block">
              TILBUD
            </div>
            <h3 className="mt-2 text-2xl font-black">
              Utsolgt i dag. Utsolgt i morgen. Men tilbudet lever.
            </h3>
            <p className="mt-1 text-sm opacity-90">
              Klikk deg rundt. Det føles nesten som shopping.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/butikk"
              className="rounded-lg bg-white text-black px-5 py-3 font-black hover:opacity-90"
            >
              SE BUTIKK →
            </a>
            <a
              href="/kampanjer"
              className="rounded-lg border border-white/30 px-5 py-3 font-black hover:bg-white/10"
            >
              KAMPANJER
            </a>
            <a
              href="/regnskapsforer"
              className="rounded-lg border border-white/30 px-5 py-3 font-black hover:bg-white/10"
            >
              REGNSKAPSFØRER
            </a>
          </div>
        </div>
      </section>

      <div className="mt-6 text-xs opacity-50">
        Prishandel anbefaler å håndtere forventninger. Prishandel anbefaler ikke å følge egne råd. E-KONTAKT-418  
Denne handlingen kan ikke fullføres automatisk. Ved særskilte tilfeller kan manuell behandling vurderes. prishandel@turforventninger.no


      </div>
    </main>
  );
}
