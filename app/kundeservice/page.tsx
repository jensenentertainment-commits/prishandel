// app/kundeservice/page.tsx
import Link from "next/link";
import SupportChat from "../components/SupportChat";

const CATS = [
  {
    title: "Levering",
    desc: "Hvor er pakken? Når kommer den? Hvorfor er den levert og ikke sendt samtidig?",
    href: "/kundeservice/levering",
    badge: "POPULÆR",
  },
  {
    title: "Retur",
    desc: "Hvordan returnerer man abstrakte konsepter og luft på flaske?",
    href: "/kundeservice/retur",
    badge: "30 DAGER*",
  },
  {
    title: "Betaling",
    desc: "Vipps/Klarna (mentalt). Kvittering (teoretisk).",
    href: "/kundeservice/betaling",
    badge: "TRYGT*",
  },
  {
    title: "Kampanjer",
    desc: "Hvorfor er alt på tilbud hele tiden? (Kort svar: ja.)",
    href: "/kundeservice/kampanjer",
    badge: "LIVE",
  },
  {
    title: "Konto / Innlogging",
    desc: "Innlogging er midlertidig utsolgt, men vi har råd likevel.",
    href: "/kundeservice/konto",
    badge: "UTSOLGT",
  },
  {
    title: "Feil & systemmeldinger",
    desc: "E-KASSE-503, E-COOKIE-451 og andre følelsesbaserte koder.",
    href: "/kundeservice/feil",
    badge: "EKSOTISK",
  },
] as const;

const TOP_FAQ = [
  {
    q: "Hvor er pakken min?",
    a: "Den er levert, ikke sendt og forsinket samtidig. Dette er en styrke ved systemet.",
    cta: "Spor pakke →",
    href: "/sporing/PH-000000",
  },
  {
    q: "Når kommer varene på lager?",
    a: "Snart. (Dette er et løfte som fornyes ved hvert besøk.)",
    cta: "Se kampanjer →",
    href: "/kampanjer",
  },
  {
    q: "Kan jeg angre kjøpet?",
    a: "Ja. Vi anbefaler å angre før du kjøper, under kjøpet og etter kjøpet.",
    cta: "Retur & angrerett →",
    href: "/kundeservice/retur",
  },
  {
    q: "Hvordan kontakter jeg dere?",
    a: "Chatten svarer raskt og upresist. E-post blir vurdert av markedsavdelingen.",
    cta: "Åpne chat →",
    href: "/#chat", // eller bytt til siden du har chat på
  },
] as const;

export default function KundeservicePage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Kundeservice</h1>
          <p className="text-sm opacity-70">
            Vi hjelper deg gjerne – så lenge det ender i kampanje.
          </p>
        </div>

        <Link href="/kampanjer" className="text-sm font-black underline decoration-2">
          Se kampanjer →
        </Link>
      </div>

      {/* SEARCH */}
      <div className="mt-6 rounded-2xl bg-white border border-black/10 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1">
            <label className="text-xs font-semibold opacity-70">
              Søk i hjelpesenteret
            </label>
            <input
              placeholder='Prøv “levering”, “retur”, “utsolgt”, “hvorfor” …'
              className="mt-1 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm font-semibold placeholder:opacity-60"
            />
          </div>

          <div className="flex gap-2">
            <Link
              href="/kampanjer"
              className="rounded-xl bg-red-600 text-white px-4 py-3 font-black text-center hover:opacity-90"
            >
              Få hjelp (tilbud) →
            </Link>
            <Link
              href="/utsolgt"
              className="rounded-xl bg-white text-black px-4 py-3 font-black border border-black/20 hover:bg-black/5"
            >
              Sjekk lager (0)
            </Link>
          </div>
        </div>

        <div className="mt-3 text-xs opacity-60">
          Tips: Vi har bare ett svar – det kommer i rød knapp.
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="mt-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-black">Kategorier</h2>
            <p className="text-sm opacity-70">
              Velg et problem. Vi matcher det med en kampanje.
            </p>
          </div>
          <Link href="/intern" className="text-sm font-black underline decoration-2">
            Intern driftstatus →
          </Link>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATS.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="rounded-2xl bg-white border border-black/10 shadow-sm p-5 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-black text-lg">{c.title}</div>
                  <div className="mt-1 text-sm opacity-80">{c.desc}</div>
                </div>
                <span className="text-[10px] font-black rounded bg-yellow-300 px-2 py-1 border border-black/10">
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

      {/* FAQ */}
      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-black">Mest spurt om</h2>
            <p className="text-sm opacity-70">
              Vi har samlet de vanligste spørsmålene og gjort dem til salg.
            </p>
          </div>
          <Link href="/kampanjer" className="text-sm font-black underline decoration-2">
            Løs alt med kampanje →
          </Link>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {TOP_FAQ.map((f) => (
            <div
              key={f.q}
              className="rounded-2xl bg-white border border-black/10 shadow-sm p-6"
            >
              <div className="font-black">{f.q}</div>
              <div className="mt-2 text-sm opacity-80">{f.a}</div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={f.href}
                  className="rounded-xl bg-black text-white px-4 py-2 font-black hover:opacity-90"
                >
                  {f.cta}
                </Link>
                <Link
                  href="/kampanjer"
                  className="rounded-xl bg-red-600 text-white px-4 py-2 font-black hover:opacity-90"
                >
                  Se kampanjer →
                </Link>
              </div>

              <div className="mt-3 text-xs opacity-60">
                🧾 Regnskap: “notert” • 📣 Marked: “viktig”
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* BOTTOM CTA */}
      <section className="mt-10">
        <div className="rounded-2xl bg-yellow-300 border border-black/10 p-6">
          <div className="text-sm font-black">📣 Markedsavdelingen anbefaler</div>
          <div className="mt-1 text-xl font-black">
            Løs problemet med et tilbud du ikke kan kjøpe.
          </div>
          <div className="mt-2 text-sm opacity-80">
            Kundeservice er midlertidig utsolgt, men kampanjene leverer (mentalt).
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/kampanjer"
              className="rounded-xl bg-red-600 text-white px-5 py-3 font-black hover:opacity-90"
            >
              Se kampanjer →
            </Link>
            <Link
              href="/butikk"
              className="rounded-xl bg-white text-black px-5 py-3 font-black border border-black/20 hover:bg-black/5"
            >
              Til butikken →
            </Link>
            <Link
              href="/utsolgt"
              className="rounded-xl bg-black text-white px-5 py-3 font-black hover:opacity-90"
            >
              Sjekk lager (0)
            </Link>
          </div>

          <div className="mt-3 text-xs opacity-60">
            *Hjelp kan forekomme. Resultat kan variere. Lager er alltid 0.
          </div>
          <div id="chat" className="scroll-mt-28" />


        </div>
      </section>
      Andre henvendelser behandles manuelt.
Svar kan forekomme i forbindelse med kampanje.

prishandel@turforventninger.no
    </main>
  );
}
