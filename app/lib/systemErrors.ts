// app/lib/systemErrors.ts

export type ErrorCode =
  | "E-KASSE-503"
  | "E-LAGER-0"
  | "E-PRIS-418"
  | "E-VIPPS-401"
  | "E-KLARNA-429"
  | "E-FRAKT-0"
  | "E-RETUR-204"
  | "E-MARGIN-999"
  | "E-COOKIE-451"
  | "E-SKJEMA-400";

export type SystemError = {
  code: ErrorCode;
  title: string;
  summary: string;
  whatHappened: string[];
  whatYouCanDo: { label: string; href: string; tone?: "primary" | "secondary" }[];
  market: string;
  accounting: string;
  severity: "P0" | "P1" | "P2" | "P3";
  tags: string[];
};

export const SYSTEM_ERRORS: SystemError[] = [
  {
    code: "E-KASSE-503",
    title: "Kasse utilgjengelig (midlertidig permanent)",
    summary: "Betalingsflyt startet. Virkeligheten svarte ikke.",
    whatHappened: [
      "Kassen forsøkte å finalisere en ordre med lagerstatus: 0.",
      "Betalingsleverandør ble kontaktet mentalt.",
      "Regnskap trykket “nei” med stor selvtillit.",
    ],
    whatYouCanDo: [
      { label: "Gå til kampanjer →", href: "/kampanjer", tone: "primary" },
      { label: "Tilbake til butikk", href: "/butikk", tone: "secondary" },
    ],
    market: "Dette er bra for konvertering. Folk klikker mer når de blir stoppet.",
    accounting: "Dette er dårlig for alt. Spesielt regnskap.",
    severity: "P0",
    tags: ["checkout", "betaling", "utsolgt"],
  },
  {
    code: "E-LAGER-0",
    title: "Lager: 0 (som planlagt)",
    summary: "Lagerstatus ble bekreftet av flere systemer samtidig.",
    whatHappened: [
      "Lagerfeed rapporterte 0.",
      "Backup-lagerfeed rapporterte også 0 (tilfeldigvis).",
      "Markedsavdelingen feiret: “Tydelig etterspørsel!”",
    ],
    whatYouCanDo: [
      { label: "Se “utsolgt” →", href: "/utsolgt", tone: "primary" },
      { label: "Sjekk kampanjer", href: "/kampanjer", tone: "secondary" },
    ],
    market: "Utsolgt skaper FOMO. FOMO skaper klikk. Klikk skaper… noe.",
    accounting: "Utsolgt skaper mindre arbeid. Fortsett sånn.",
    severity: "P1",
    tags: ["lager", "produkt"],
  },
  {
    code: "E-PRIS-418",
    title: "Prisrobot nekter (jeg er en tekanne)",
    summary: "Prisroboten har utviklet følelser rundt marginer.",
    whatHappened: [
      "Prisrobot forsøkte å sette “førpris” høyere enn anbefalt av virkeligheten.",
      "Regnskap oppdaget -% margin og ringte en venn.",
      "Systemet svarte med E-PRIS-418 for å beskytte seg selv.",
    ],
    whatYouCanDo: [
      { label: "Gå til butikk →", href: "/butikk", tone: "primary" },
      { label: "Les om prisgaranti*", href: "/vilkar", tone: "secondary" },
    ],
    market: "Dette er bare et tegn på at prisene våre er aggressive.",
    accounting: "Dette er et tegn på at noen må ta fra dere tastaturet.",
    severity: "P2",
    tags: ["pris", "kampanje"],
  },
  {
    code: "E-VIPPS-401",
    title: "Vipps avviste oss (mentalt)",
    summary: "Autentisering feilet fordi vi ikke hadde ekte autentisering.",
    whatHappened: [
      "Vipps ba om token.",
      "Systemet svarte med optimisme.",
      "Vipps svarte med 401.",
    ],
    whatYouCanDo: [
      { label: "Prøv igjen (meningsløst) →", href: "/kurv", tone: "primary" },
      { label: "Gå til kampanjer", href: "/kampanjer", tone: "secondary" },
    ],
    market: "Vipps er bare redd for tilbudene våre.",
    accounting: "Vipps har rett.",
    severity: "P1",
    tags: ["betaling", "vipps"],
  },
  {
    code: "E-KLARNA-429",
    title: "Klarna: for mange forsøk",
    summary: "Du prøvde å kjøpe noe som ikke finnes flere ganger.",
    whatHappened: [
      "Systemet registrerte høy motivasjon.",
      "Klarna registrerte høy risiko (for alt).",
      "Rate limit ble aktivert for å beskytte deg.",
    ],
    whatYouCanDo: [
      { label: "Ta en pause →", href: "/utsolgt", tone: "primary" },
      { label: "Se flere tilbud", href: "/butikk", tone: "secondary" },
    ],
    market: "Dette er bare engasjement. Vi elsker engasjement.",
    accounting: "Vi elsker pauser.",
    severity: "P2",
    tags: ["betaling", "klarna"],
  },
  {
    code: "E-FRAKT-0",
    title: "Frakt kan ikke beregnes (fornuften mangler)",
    summary: "Vi forsøkte å beregne frakt på abstrakte konsepter.",
    whatHappened: [
      "Fraktmotor fant ingen vekt.",
      "Fraktmotor fant ingen dimensjoner.",
      "Fraktmotor fant heller ingen mening.",
    ],
    whatYouCanDo: [
      { label: "Se fraktvilkår* →", href: "/vilkar", tone: "primary" },
      { label: "Tilbake til butikk", href: "/butikk", tone: "secondary" },
    ],
    market: "Gratis frakt* betyr at frakt er en følelse.",
    accounting: "Frakt er aldri en følelse.",
    severity: "P3",
    tags: ["frakt", "shipping"],
  },
  {
    code: "E-RETUR-204",
    title: "Retur: ingenting å returnere",
    summary: "Du kan ikke returnere det du aldri mottok.",
    whatHappened: [
      "Retursystemet mottok en forespørsel.",
      "Retursystemet lette etter ordren.",
      "Retursystemet fant bare stillhet (204).",
    ],
    whatYouCanDo: [
      { label: "Start ny retur* →", href: "/retur", tone: "primary" },
      { label: "Kontakt oss (teoretisk)", href: "/kontakt", tone: "secondary" },
    ],
    market: "Vi har verdens enkleste retur: ingen produkter.",
    accounting: "Det er første gang jeg er enig.",
    severity: "P2",
    tags: ["retur", "support"],
  },
  {
    code: "E-MARGIN-999",
    title: "Margin under minimum (marked vant)",
    summary: "Systemet fant en margin som ikke kan forklares i revisjon.",
    whatHappened: [
      "En kampanje ble aktivert.",
      "En annen kampanje ble aktivert.",
      "En tredje kampanje ble aktivert (av refleks).",
    ],
    whatYouCanDo: [
      { label: "Se kampanjer →", href: "/kampanjer", tone: "primary" },
      { label: "Les regnskapsførerens notat", href: "/regnskapsforer", tone: "secondary" },
    ],
    market: "Når marginen dør, lever volumet.",
    accounting: "Dette er ikke poesi. Dette er panikk.",
    severity: "P0",
    tags: ["pris", "margin", "kampanje"],
  },
  {
    code: "E-COOKIE-451",
    title: "Cookies nektet (lovlydig panikk)",
    summary: "Du sa nei til cookies. Vi tok det personlig.",
    whatHappened: [
      "Samtykke ble ikke gitt.",
      "Markedsavdelingen ble stille.",
      "Systemet fant en feilkode for å føle seg bedre.",
    ],
    whatYouCanDo: [
      { label: "Gå til kampanjer →", href: "/kampanjer", tone: "primary" },
      { label: "Tilbake til forsiden", href: "/", tone: "secondary" },
    ],
    market: "Uten cookies er vi bare… oss selv.",
    accounting: "Det er fint. Fortsett sånn.",
    severity: "P3",
    tags: ["compliance", "cookies"],
  },
  {
    code: "E-SKJEMA-400",
    title: "Skjema ugyldig (som forventet)",
    summary: "Vi mottok input. Vi valgte å ignorere den profesjonelt.",
    whatHappened: [
      "Et felt var tomt.",
      "Et annet felt var for ærlig.",
      "Systemet svarte 400 for å virke seriøst.",
    ],
    whatYouCanDo: [
      { label: "Prøv igjen →", href: "/kontakt", tone: "primary" },
      { label: "Gå til intern", href: "/intern", tone: "secondary" },
    ],
    market: "Skjemaer er bare en invitasjon til kampanje.",
    accounting: "Skjemaer er bevis. Vi liker ikke bevis.",
    severity: "P2",
    tags: ["skjema", "intern"],
  },
];

export function getSystemError(code: string) {
  const normalized = code.toUpperCase().trim() as ErrorCode;
  return SYSTEM_ERRORS.find((e) => e.code === normalized) ?? null;
}

// Deterministisk “sist observert” basert på kode
export function lastSeenFor(code: string) {
  const s = code.toUpperCase();
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  h = Math.abs(h);

  const minutesAgo = 3 + (h % 240); // 3–243 min
  const times = (h % 17) + 3; // 3–19
  return { minutesAgo, times };
}
