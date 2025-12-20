export const metadata = {
  title: "Kampanjer | Prishandel",
  description: "Kontinuerlige kampanjer som avsluttes snart. På en måte.",
};

const CAMPAIGNS = [
  {
    tag: "PÅGÅR NÅ",
    tagClass: "bg-yellow-300 text-black",
    title: "BLACK WEEK (forlenget)",
    subtitle: "Varer i 7 dager. Har vart siden sist uke.",
    highlights: ["Opptil -90%*", "Gratis frakt* over 499,-", "Kun i dag*"],
    cta: "SE BLACK WEEK-DEALS →",
    note: "*vilkår gjelder der det passer oss",
    timer: "Slutter om: 03:14:22",
    box: "bg-white border-black/10",
  },
  {
    tag: "DØGNETS DEAL",
    tagClass: "bg-red-600 text-white",
    title: "NATTKUPP (hele døgnet)",
    subtitle: "Nattkupp, dagkupp, mellomkupp. Alt er kupp.",
    highlights: ["Lynrabatt*", "Stjernepris*", "Begrenset lager (0)"],
    cta: "SE NATTKUPP →",
    note: "*rabatt kan oppleves mentalt",
    timer: "Neste kupp: 00:00:00",
    box: "bg-neutral-50 border-black/10",
  },
  {
    tag: "RESSURSOPTIMALISERT",
    tagClass: "bg-black text-white",
    title: "RESTLAGER-SALG",
    subtitle: "Alt må vekk. Vi har bare glemt å få det inn først.",
    highlights: ["-70% på alt vi ikke har", "Ryddesalg*", "Sluttpris*"],
    cta: "SE RESTLAGER →",
    note: "*restlager kan avvike fra lager",
    timer: "Slutter om: 01:59:59",
    box: "bg-white border-black/10",
  },
  {
    tag: "ØKONOMIAVDELINGEN",
    tagClass: "bg-green-600 text-white",
    title: "REGNSKAPSFØRER-RABATT",
    subtitle: "Rabatten er ikke godkjent. Men den er der.",
    highlights: ["-10% på ting som er utsolgt", "Ekstra kampanje*", "Ingen kontroll"],
    cta: "SE RABATT →",
    note: "*rabatt gjelder ikke produkter, bare prinsipper",
    timer: "Slutter om: snart",
    box: "bg-white border-black/10",
  },
  {
    tag: "KUN I DAG",
    tagClass: "bg-yellow-300 text-black",
    title: "ALT MÅ VEKK (inkl. marginene)",
    subtitle: "En kampanje for deg som liker tall uten sammenheng.",
    highlights: ["Opptil -87%*", "Førpriser justert*", "Anbefalt av ingen"],
    cta: "SE ALT MÅ VEKK →",
    note: "*førpris kan være hypotetisk",
    timer: "Slutter om: 00:47:11",
    box: "bg-neutral-50 border-black/10",
  },
  {
    tag: "EKSKLUSIVT",
    tagClass: "bg-red-600 text-white",
    title: "MEDLEMSPRIS (uten medlemskap)",
    subtitle: "Du kvalifiserer automatisk. Vi vet ikke hvorfor.",
    highlights: ["Kun i dag*", "Medlemsfordel*", "Standard manipulasjon"],
    cta: "SE MEDLEMSPRIS →",
    note: "*medlemskap er mentalt",
    timer: "Slutter om: 02:02:02",
    box: "bg-white border-black/10",
  },
];

const TERMS = [
  "Tilbud gjelder så lenge tilbud gjelder.",
  "Stjerne (*) betyr at vi har skrevet noe lite et sted.",
  "Gratis frakt* gjelder når frakt er gratis.",
  "Lagerstatus kan avvike fra virkeligheten.",
  "Regnskapsfører er informert. Ikke enig.",
];

export default function KampanjerPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* Top */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2">
            <span className="rounded bg-black text-yellow-300 px-3 py-1 text-xs font-black">
              KAMPANJESENTER
            </span>
            <span className="text-sm font-semibold opacity-80">
              Oppdatert kontinuerlig uten forvarsel
            </span>
          </div>

          <h1 className="mt-3 text-3xl md:text-4xl font-black">Kampanjer</h1>
          <p className="mt-2 text-sm md:text-base opacity-75 max-w-2xl">
            Her finner du alle kampanjer som avsluttes snart, forlenges straks, og
            gjenoppstår ved refresh. Klikk deg rundt som om dette fungerer.
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
            href="/regnskapsforer"
            className="rounded-lg bg-white text-black px-5 py-3 font-black border border-black/20 hover:bg-black/5"
          >
            REGNSKAPSFØRER
          </a>
        </div>
      </div>

      {/* Global banner */}
      <section className="mt-8">
        <div className="rounded-2xl bg-yellow-300 border border-black/10 shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-xs font-black rounded bg-black text-yellow-300 px-2 py-1 inline-block">
              MEGASALG
            </div>
            <h2 className="mt-2 text-2xl font-black">
              Kampanje pågår. Den har alltid pågått.
            </h2>
            <p className="mt-1 text-sm font-semibold opacity-80">
              Regnskapsfører anbefaler ro. Markedsavdelingen anbefaler mer.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/butikk"
              className="rounded-lg bg-red-600 text-white px-5 py-3 font-black hover:opacity-90"
            >
              HANDLE NÅ →
            </a>
            <button
              disabled
              className="rounded-lg bg-white text-black px-5 py-3 font-black border border-black/20 opacity-50 cursor-not-allowed"
            >
              STOPP KAMPANJE
            </button>
          </div>
        </div>
      </section>

      {/* Campaign grid */}
      <section className="mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black">Aktive kampanjer</h2>
            <p className="text-sm opacity-70">
              Alle kampanjer er aktive. Noen er mer aktive enn andre.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-semibold">
            <span className="rounded bg-white border border-black/10 px-2 py-1">
              ✔ Prispress
            </span>
            <span className="rounded bg-white border border-black/10 px-2 py-1">
              ✔ Stjerner
            </span>
            <span className="rounded bg-white border border-black/10 px-2 py-1">
              ✔ Utsolgt
            </span>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {CAMPAIGNS.map((c) => (
            <div
              key={c.title}
              className={`rounded-2xl border shadow-sm p-6 ${c.box}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className={`text-xs font-black rounded px-2 py-1 ${c.tagClass}`}>
                    {c.tag}
                  </span>
                  <h3 className="mt-3 text-xl md:text-2xl font-black">{c.title}</h3>
                  <p className="mt-1 text-sm opacity-80">{c.subtitle}</p>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black rounded bg-neutral-900 text-white px-2 py-1 inline-block">
                    {c.timer}
                  </div>
                  <div className="mt-2 text-xs opacity-60">
                    (resettes ved refresh)
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {c.highlights.map((h) => (
                  <div
                    key={h}
                    className="rounded-lg bg-neutral-50 border border-black/10 px-3 py-2 text-xs font-semibold"
                  >
                    {h}
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href="/butikk"
                  className="rounded-lg bg-red-600 text-white px-5 py-3 font-black hover:opacity-90"
                >
                  {c.cta}
                </a>
                <button
                  disabled
                  className="rounded-lg bg-green-600 text-white px-5 py-3 font-black opacity-50 cursor-not-allowed"
                >
                  AKTIVER KUPONG
                </button>
                <span className="text-xs opacity-70">{c.note}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coupon box */}
      <section className="mt-10 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-black/10 shadow-sm p-6">
          <h2 className="text-2xl font-black">Kupongkode</h2>
          <p className="mt-1 text-sm opacity-70">
            Skriv inn en kode. Få en følelse. Resultat kan variere.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <input
              className="w-72 max-w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm"
              placeholder="Skriv kupongkode…"
              defaultValue="REGNSKAP"
            />
            <button
              disabled
              className="rounded-lg bg-black text-white px-5 py-2 font-black opacity-50 cursor-not-allowed"
            >
              BRUK KODE
            </button>
            <span className="text-xs opacity-60 self-center">
              Kode ble vurdert av regnskapsfører (negativt).
            </span>
          </div>

          <div className="mt-5 rounded-lg bg-neutral-50 border border-black/10 p-4">
            <div className="font-black text-sm">Tips:</div>
            <p className="mt-1 text-sm opacity-80">
              Prøv “TILBUD”, “SALG”, “HASTER” eller “HJE” (forkortelse for hjerteinfarkt).
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-yellow-300 border border-black/10 shadow-sm p-6">
          <div className="font-black">Kampanjevarsler</div>
          <p className="mt-2 text-sm font-semibold opacity-90">
            Få varsler når vi starter nye kampanjer.
          </p>
          <p className="mt-1 text-xs opacity-70">
            (Vi starter dem uansett.)
          </p>

          <div className="mt-4 space-y-2">
            <input
              className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm"
              placeholder="E-post"
            />
            <button
              disabled
              className="w-full rounded-lg bg-red-600 text-white py-3 font-black opacity-50 cursor-not-allowed"
            >
              ABONNER (MIDLERTIDIG UTSOLGT)
            </button>
          </div>

          <div className="mt-3 text-xs opacity-60">
            Ved å abonnere godtar du å bli minnet på kampanjer du allerede ser.
          </div>
        </div>
      </section>

      {/* Terms */}
      <section className="mt-10">
        <div className="rounded-2xl bg-white border border-black/10 shadow-sm p-6">
          <h2 className="text-xl font-black">Vilkår (utdrag)</h2>
          <p className="mt-1 text-sm opacity-70">
            Leses sjelden. Skrives ofte.
          </p>

          <ul className="mt-4 space-y-2 text-sm opacity-80 list-disc pl-5">
            {TERMS.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="/butikk"
              className="rounded-lg bg-red-600 text-white px-5 py-3 font-black hover:opacity-90"
            >
              JEG GODTAR (HANDLE) →
            </a>
            <a
              href="/regnskapsforer"
              className="rounded-lg bg-white text-black px-5 py-3 font-black border border-black/20 hover:bg-black/5"
            >
              SPØR REGNSKAPSFØRER
            </a>
          </div>
        </div>

        <div className="mt-4 text-xs opacity-50">
          Prishandel forbeholder seg retten til å forlenge, forkorte, gjenta eller
          rebrande kampanjer etter humør.
        </div>
      </section>
    </main>
  );
}
