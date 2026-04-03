import Link from "next/link";
import { notFound } from "next/navigation";

type HelpPage = {
  title: string;
  lead: string;
  introTitle: string;
  summary: string;
  bullets: string[];
  note: string;
  panelTitle: string;
  panelItems: string[];
  ctas: {
    label: string;
    href: string;
    tone?: "red" | "black" | "white";
  }[];
};

const PAGES: Record<string, HelpPage> = {
  levering: {
    title: "Levering",
    lead: "Forsendelser behandles fortløpende og kan oppnå flere tilstander samtidig.",
    introTitle: "Hva dette betyr",
    summary:
      "Levering vurderes ut fra ordrestatus, tilgjengelighet, transportvilje og øvrige forhold som måtte oppstå etter at håpet allerede er etablert.",
    bullets: [
      "Forventet levering: ubestemt",
      "Transportør: ekstern, intern eller konseptuell",
      "Sporing: tilgjengelig når statusen tillater det",
      "Fremdrift kan avvike fra opplevd fremdrift",
    ],
    note: "⚖️ System: “Forsendelsen holdes åpen inntil videre.”",
    panelTitle: "Vanlige statuser",
    panelItems: [
      "Registrert",
      "Under behandling",
      "Videresendt internt",
      "Ubestemt",
    ],
    ctas: [
      { label: "Spor pakke →", href: "/sporing/PH-000000", tone: "black" },
      { label: "Se driftstatus →", href: "/intern", tone: "white" },
      { label: "Se kampanjer →", href: "/kampanjer", tone: "red" },
    ],
  },

  retur: {
    title: "Retur",
    lead: "Returer kan registreres så lenge kjøpet fortsatt lar seg forstå som et kjøp.",
    introTitle: "Før du går videre",
    summary:
      "Vi behandler retur, angrerett og ombestemmelse fortløpende. Utfallet påvirkes av varetype, dokumentasjon og hvor langt saken allerede har beveget seg internt.",
    bullets: [
      "Returfrist: 30 dager, med forbehold om tolkning",
      "Tilbakebetaling: behandles etter registrert mottak eller tilsvarende innsikt",
      "Returadresse: oppgis ved behov",
      "Abstrakt innhold vurderes særskilt",
    ],
    note: "🧾 Regnskap: “Retur er også en form for bevegelse.”",
    panelTitle: "Neste steg",
    panelItems: [
      "Finn ordreinformasjon",
      "Vurder angrerett",
      "Avklar returgrunnlag",
      "Avvent videre behandling",
    ],
    ctas: [
      { label: "Les FAQ →", href: "/faq", tone: "black" },
      { label: "Kontakt kundeservice →", href: "/kundeservice", tone: "white" },
      { label: "Se kjøpsvilkår →", href: "/vilkar", tone: "red" },
    ],
  },

  betaling: {
    title: "Betaling",
    lead: "Betalingsgrunnlag registreres fortløpende, med varierende grad av endelig støtte.",
    introTitle: "Behandlingsgrunnlag",
    summary:
      "Betaling behandles i forbindelse med ordrebehandling. Godkjent betalingsvilje innebærer ikke nødvendigvis leveringsklar ordre.",
    bullets: [
      "Betalingsstatus: under vurdering, registrert eller teoretisk godkjent",
      "Kvittering: genereres når behandlingen oppnår tilstrekkelig sammenheng",
      "Valuta: NOK",
      "Betalingsmetode kan bli valgt før utfallet er klart",
    ],
    note: "🧾 Regnskap: “Transaksjon er ikke det samme som trygghet.”",
    panelTitle: "Det vurderes nå",
    panelItems: [
      "Betalingsvilje",
      "Ordresammenheng",
      "Systemstøtte",
      "Videre fremdrift",
    ],
    ctas: [
      { label: "Se ordresammendrag →", href: "/ordre", tone: "black" },
      { label: "Les vilkår →", href: "/vilkar", tone: "white" },
      { label: "Kontakt kundeservice →", href: "/kundeservice", tone: "red" },
    ],
  },

  kampanjer: {
    title: "Kampanjer",
    lead: "Kampanjer er en sentral del av driften og opprettholdes med høy prioritet.",
    introTitle: "Slik fungerer det",
    summary:
      "Prispress brukes aktivt for å skape fremdrift, oppmerksomhet og beslutninger som senere kan kreve nærmere forklaring.",
    bullets: [
      "Aktive kampanjer kan overlappe med hverandre og med virkeligheten",
      "Medlemspris kan forekomme uten tydelig medlemskrav",
      "Avslag beregnes offensivt",
      "Varighet: så lenge trykket støttes",
    ],
    note: "📣 Marked: “Kampanje er også kundedialog.”",
    panelTitle: "Kampanjesignaler",
    panelItems: [
      "Aggressivt prisnivå",
      "Begrenset tilgjengelighet",
      "Høy synlighet",
      "Løpende fornyelse",
    ],
    ctas: [
      { label: "Se kampanjer →", href: "/kampanjer", tone: "red" },
      { label: "Til butikken →", href: "/butikk", tone: "black" },
      { label: "Les metodikk →", href: "/metodikk", tone: "white" },
    ],
  },

  konto: {
    title: "Konto / innlogging",
    lead: "Tilgang håndteres fortløpende og uten garanti for samtidig tilgjengelighet.",
    introTitle: "Tilgang akkurat nå",
    summary:
      "Konto, innlogging og brukerstatus kan påvirkes av systemforhold, vedlikehold eller manglende støtte mellom ønsket tilgang og faktisk kapasitet.",
    bullets: [
      "Innlogging: tilgjengelig i perioder",
      "Passordkrav: gjeldende krav vises når systemet tillater det",
      "Brukerstatus: aktiv, uavklart eller midlertidig ute av flyt",
      "Sesjon kan avsluttes uten dramatikk og med samme resultat",
    ],
    note: "⚖️ System: “Tilgang vurderes som en prosess, ikke en rettighet.”",
    panelTitle: "Typiske tilstander",
    panelItems: [
      "Aktiv",
      "Uavklart",
      "Midlertidig utilgjengelig",
      "Avsluttet uten konsekvens",
    ],
    ctas: [
      { label: "Gå til kundeservice →", href: "/kundeservice", tone: "black" },
      { label: "Se driftstatus →", href: "/intern", tone: "white" },
      { label: "Se FAQ →", href: "/faq", tone: "red" },
    ],
  },

  feil: {
    title: "Feil & systemmeldinger",
    lead: "Systemmeldinger er en del av driften og oppstår når flere sannheter forsøker å gjelde samtidig.",
    introTitle: "Hva meldingen betyr",
    summary:
      "Feilkoder brukes for å markere avvik mellom handling, forventning og støtte i underliggende systemer. Ikke alle koder innebærer at noe faktisk er galt.",
    bullets: [
      "E-KASSE-503: behandling utilgjengelig",
      "E-COOKIE-451: samtykke ikke etablert",
      "E-LAGER-000: tilgjengelighet ikke bekreftet",
      "E-INT-302: saken videresendt internt",
    ],
    note: "⚙️ Drift: “Feil er også informasjon, bare i mer komprimert form.”",
    panelTitle: "Vanlige koder",
    panelItems: [
      "E-KASSE-503",
      "E-COOKIE-451",
      "E-LAGER-000",
      "E-INT-302",
    ],
    ctas: [
      { label: "Se driftstatus →", href: "/intern", tone: "black" },
      { label: "Gå til kundeservice →", href: "/kundeservice", tone: "white" },
      { label: "Les FAQ →", href: "/faq", tone: "red" },
    ],
  },
};

function ctaClass(tone: HelpPage["ctas"][number]["tone"]) {
  switch (tone) {
    case "red":
      return "rounded-xl bg-red-600 px-5 py-3 font-black text-white hover:opacity-90";
    case "black":
      return "rounded-xl bg-black px-5 py-3 font-black text-white hover:opacity-90";
    default:
      return "rounded-xl border border-black/20 bg-white px-5 py-3 font-black text-black hover:bg-black/5";
  }
}

export default async function KundeserviceSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = PAGES[slug];

  if (!page) return notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">{page.title}</h1>
          <p className="mt-2 text-sm opacity-70">{page.lead}</p>
        </div>

        <Link href="/kundeservice" className="text-sm font-black underline decoration-2">
          Tilbake →
        </Link>
      </div>

      <div className="mt-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="font-black">{page.introTitle}</div>

        <p className="mt-3 text-sm opacity-80">{page.summary}</p>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm opacity-85">
          {page.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>

        <div className="mt-5 rounded-xl border border-black/10 bg-neutral-50 p-4 text-sm">
          {page.note}
        </div>

        <div className="mt-5 rounded-xl border border-black/10 bg-white p-4">
          <div className="text-sm font-black">{page.panelTitle}</div>
          <ul className="mt-3 space-y-2 text-sm opacity-80">
            {page.panelItems.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {page.ctas.map((cta) => (
            <Link key={cta.label} href={cta.href} className={ctaClass(cta.tone)}>
              {cta.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}