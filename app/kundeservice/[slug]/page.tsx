// app/kundeservice/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";

const PAGES: Record<string, { title: string; lead: string; bullets: string[] }> = {
  levering: {
    title: "Levering",
    lead: "Pakken din er på vei, levert og ikke sendt samtidig.",
    bullets: [
      "Forventet levering: ubestemt",
      "Transportør: Virkeligheten (med underleverandør Marked)",
      "Sporing: motsier seg selv (som planlagt)",
    ],
  },
  retur: {
    title: "Retur",
    lead: "Du kan returnere alt – unntatt abstrakte konsepter og frisk luft.",
    bullets: [
      "Returfrist: 30 dager* (*definert av humør)",
      "Tilbakebetaling: mentalt",
      "Returadresse: Ubestemt 0, 0000 Teori",
    ],
  },
  betaling: {
    title: "Betaling",
    lead: "Vipps/Klarna støttes i teorien. I praksis støtter vi kampanjer.",
    bullets: [
      "Betalingsstatus: godkjent i teorien",
      "Kvittering: genereres når universet tillater det",
      "Valuta: NOK (følelser kan forekomme)",
    ],
  },
  kampanjer: {
    title: "Kampanjer",
    lead: "Alt er på tilbud hele tiden. Det er ikke et problem, det er en strategi.",
    bullets: [
      "Black Week: pågår",
      "Medlemspris: uten medlemskap",
      "Alt må vekk: inkludert marginene",
    ],
  },
  konto: {
    title: "Konto / Innlogging",
    lead: "Innlogging er midlertidig utsolgt, men vi heier på deg.",
    bullets: [
      "Passordkrav: minst 1 kampanje",
      "2FA: To Følelser Autentisering",
      "Brukernavn: ‘kunde’",
    ],
  },
  feil: {
    title: "Feil & systemmeldinger",
    lead: "Feilkoder er bare følelsene til et system som prøver sitt beste.",
    bullets: [
      "E-KASSE-503: Kasse emosjonelt utilgjengelig",
      "E-COOKIE-451: Avslag på cookies (modig)",
      "E-LAGER-000: Lagerstatus = sannhet",
    ],
  },
};

export default async function KundeserviceSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) return notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">{page.title}</h1>
          <p className="mt-2 text-sm opacity-70">{page.lead}</p>
        </div>
        <Link href="/kundeservice" className="text-sm font-black underline decoration-2">
          Tilbake →
        </Link>
      </div>

      <div className="mt-6 rounded-2xl bg-white border border-black/10 shadow-sm p-6">
        <div className="font-black">Kort fortalt</div>
        <ul className="mt-3 space-y-2 text-sm opacity-85 list-disc pl-5">
          {page.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/kampanjer" className="rounded-xl bg-red-600 text-white px-5 py-3 font-black hover:opacity-90">
            Se kampanjer →
          </Link>
          <Link href="/utsolgt" className="rounded-xl bg-black text-white px-5 py-3 font-black hover:opacity-90">
            Sjekk lager (0)
          </Link>
          <Link href="/sporing/PH-000000" className="rounded-xl bg-white text-black px-5 py-3 font-black border border-black/20 hover:bg-black/5">
            Spor pakke →
          </Link>
        </div>

        <div className="mt-3 text-xs opacity-60">
          🧾 Regnskap: “Notert.” • 📣 Marked: “Viktig!”
        </div>
      </div>
    </main>
  );
}
