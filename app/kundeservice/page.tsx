import Link from "next/link";

const CATS = [
  {
    title: "Levering",
    desc: "Sporing, leveringstid og forholdet mellom registrert ordre og faktisk fremdrift.",
    href: "/kundeservice/levering",
    badge: "POPULÆR",
  },
  {
    title: "Retur",
    desc: "Retur, refusjon og håndtering av varer med begrenset fysisk støtte.",
    href: "/kundeservice/retur",
    badge: "30 DAGER*",
  },
  {
    title: "Betaling",
    desc: "Betalingsgrunnlag, kvitteringer og behandling av transaksjoner med varierende støtte.",
    href: "/kundeservice/betaling",
    badge: "TRYGT*",
  },
  {
    title: "Kampanjer",
    desc: "Prispress, aktive tilbud og hvorfor enkelte løfter gjentas oftere enn de innfris.",
    href: "/kundeservice/kampanjer",
    badge: "LIVE",
  },
  {
    title: "Konto / innlogging",
    desc: "Tilgang, registrering og innloggingstilstander som ikke alltid opptrer samtidig.",
    href: "/kundeservice/konto",
    badge: "USTABIL",
  },
  {
    title: "Feil & systemmeldinger",
    desc: "Feilkoder, avvik og meldinger som krever mer tolkning enn løsning.",
    href: "/kundeservice/feil",
    badge: "E-KODER",
  },
] as const;

const TOP_FAQ = [
  {
    q: "Hvor er pakken min?",
    a: "Forsendelsen kan være registrert, forsinket, videresendt eller under vurdering samtidig. Se sporingsstatus for gjeldende versjon av sannheten.",
    cta: "Spor pakke →",
    href: "/sporing/PH-000000",
  },
  {
    q: "Når kommer varene inn igjen?",
    a: "Tilgjengelighet oppdateres fortløpende. I noen tilfeller oppdateres den også uten at varen blir mer tilgjengelig.",
    cta: "Se tilgjengelighet →",
    href: "/utsolgt",
  },
  {
    q: "Kan jeg angre kjøpet?",
    a: "Ja. Vi anbefaler å angre tidlig, tydelig og helst før ordren oppnår intern momentum.",
    cta: "Retur & angrerett →",
    href: "/kundeservice/retur",
  },
  {
    q: "Hvordan kontakter jeg dere?",
    a: "Henvendelser behandles fortløpende. Svartid påvirkes av kapasitet, kampanjenivå og øvrige forhold som måtte oppstå.",
    cta: "Se kontaktinfo →",
    href: "/kontakt",
  },
] as const;

export default function KundeservicePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Kundeservice</h1>
          <p className="text-sm opacity-70">
            Vi behandler henvendelser fortløpende og prioriterer saker med tydelig fremdriftspotensial.
          </p>
        </div>

        <Link href="/intern" className="text-sm font-black underline decoration-2">
          Driftsstatus →
        </Link>
      </div>

      <div className="mt-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1">
            <label className="text-xs font-semibold opacity-70">
              Søk i hjelpesenteret
            </label>
            <input
              placeholder='Prøv “levering”, “retur”, “betaling”, “utsolgt” …'
              className="mt-1 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm font-semibold placeholder:opacity-60"
            />
          </div>

          <div className="flex gap-2">
            <Link
              href="/kundeservice/levering"
              className="rounded-xl bg-black px-4 py-3 text-center font-black text-white hover:opacity-90"
            >
              Start med levering →
            </Link>
            <Link
              href="/utsolgt"
              className="rounded-xl border border-black/20 bg-white px-4 py-3 font-black hover:bg-black/5"
            >
              Sjekk tilgjengelighet
            </Link>
          </div>
        </div>

        <div className="mt-3 text-xs opacity-60">
          Søket brukes veiledende. Treff kan rangeres etter relevans, alvorlighetsgrad og kampanjepotensial.
        </div>
      </div>

      <section className="mt-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-black">Kategorier</h2>
            <p className="text-sm opacity-70">
              Velg hva saken gjelder. Videre behandling tilpasses problemets form og tempo.
            </p>
          </div>

          <Link href="/faq" className="text-sm font-black underline decoration-2">
            Se alle spørsmål →
          </Link>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATS.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-black">{c.title}</div>
                  <div className="mt-1 text-sm opacity-80">{c.desc}</div>
                </div>

                <span className="rounded border border-black/10 bg-yellow-300 px-2 py-1 text-[10px] font-black">
                  {c.badge}
                </span>
              </div>

              <div className="mt-4 text-sm font-black underline decoration-2">
                Åpne →
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-black">Mest spurt om</h2>
            <p className="text-sm opacity-70">
              De vanligste spørsmålene, samlet og sortert etter hvor ofte de vender tilbake.
            </p>
          </div>

          <Link href="/kampanjer" className="text-sm font-black underline decoration-2">
            Se aktive kampanjer →
          </Link>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {TOP_FAQ.map((f) => (
            <div
              key={f.q}
              className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
            >
              <div className="font-black">{f.q}</div>
              <div className="mt-2 text-sm opacity-80">{f.a}</div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={f.href}
                  className="rounded-xl bg-black px-4 py-2 font-black text-white hover:opacity-90"
                >
                  {f.cta}
                </Link>
                <Link
                  href="/faq"
                  className="rounded-xl border border-black/20 bg-white px-4 py-2 font-black hover:bg-black/5"
                >
                  Flere svar →
                </Link>
              </div>

              <div className="mt-3 text-xs opacity-60">
                🧾 Regnskap: “notert” • ⚖️ System: “under vurdering”
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="rounded-2xl border border-black/10 bg-yellow-300 p-6">
          <div className="text-sm font-black">Videre behandling</div>
          <div className="mt-1 text-xl font-black">
            Enkelte saker løses best ved å justere forventningene før de justerer deg.
          </div>
          <div className="mt-2 text-sm opacity-80">
            Dersom saken gjelder pris, tilgjengelighet eller generell uro, kan kampanjesidene gi et tydeligere bilde av situasjonen enn kundeservice alene.
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/kampanjer"
              className="rounded-xl bg-red-600 px-5 py-3 font-black text-white hover:opacity-90"
            >
              Se kampanjer →
            </Link>
            <Link
              href="/butikk"
              className="rounded-xl border border-black/20 bg-white px-5 py-3 font-black hover:bg-black/5"
            >
              Til butikken →
            </Link>
            <Link
              href="/intern"
              className="rounded-xl bg-black px-5 py-3 font-black text-white hover:opacity-90"
            >
              Se driftstatus →
            </Link>
          </div>

          <div className="mt-3 text-xs opacity-60">
            Hjelp kan forekomme. Resultat kan variere. Tilgjengelighet vurderes løpende.
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="text-sm font-black">Andre henvendelser</div>
        <div className="mt-2 text-sm opacity-80">
          Henvendelser uten klar kategori behandles manuelt, fortløpende og med varierende grad av støtte.
        </div>
        <div className="mt-3 text-sm font-semibold">kontakt@prishandel.no</div>
        <div className="mt-2 text-xs opacity-60">
          Svar kan forekomme i forbindelse med kapasitet, systemavvik eller kampanjerelatert aktivitet.
        </div>
      </section>
    </main>
  );
}