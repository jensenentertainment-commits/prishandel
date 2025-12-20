// app/lib/internal.ts
import type { ErrorCode } from "./systemErrors";

export type SlackMsg = {
  id: string;
  ts: string; // "10:42"
  channel: "#marked" | "#regnskap" | "#drift" | "#incident";
  user: string;
  role: "Marked" | "Regnskap" | "Drift" | "Kundeservice";
  text: string;
  links?: { label: string; href: string }[];
  emoji?: string; // behold emoji HER (tekst), ikke i UI
};

export type JiraIssue = {
  key: string; // PRIS-101
  title: string;
  type: "Bug" | "Incident" | "Task" | "Epic";
  status: "To do" | "In progress" | "Blocked" | "Done" | "Won't fix";
  priority: "P0" | "P1" | "P2" | "P3";
  owner: "Marked" | "Regnskap" | "Drift" | "Kundeservice";
  code?: ErrorCode;
  notes: string[];
  links?: { label: string; href: string }[];
};

const SLACK: SlackMsg[] = [
  {
    id: "s1",
    ts: "09:12",
    channel: "#incident",
    user: "Anne-L",
    role: "Drift",
    emoji: "🚨",
    text: "Incident trigget: E-KASSE-503. Kasse flyter som vanlig (dvs. ikke).",
    links: [{ label: "Feilside", href: "/systemfeil/E-KASSE-503" }],
  },
  {
    id: "s2",
    ts: "09:14",
    channel: "#marked",
    user: "Marius",
    role: "Marked",
    emoji: "📣",
    text: "E-KASSE-503 = mer friksjon = mer FOMO. Jeg kaller det ‘interaktiv checkout’.",
    links: [{ label: "Kampanjer", href: "/kampanjer" }],
  },
  {
    id: "s3",
    ts: "09:16",
    channel: "#regnskap",
    user: "Rune",
    role: "Regnskap",
    emoji: "🧾",
    text: "Dette er ikke interaktivt. Dette er manglende funksjon. Notert.",
    links: [{ label: "Regnskapsfører", href: "/regnskapsforer" }],
  },
  {
    id: "s4",
    ts: "09:21",
    channel: "#kundeservice",
    user: "Sofia",
    role: "Kundeservice",
    emoji: "🤝",
    text: "Fikk 6 henvendelser. Svarte ‘midlertidig utsolgt’ som avtalt. Føler meg som en FAQ.",
    links: [{ label: "Kontakt", href: "/kontakt" }],
  },
  {
    id: "s5",
    ts: "09:33",
    channel: "#drift",
    user: "Anne-L",
    role: "Drift",
    emoji: "🔧",
    text: "Lagerfeed rapporterer 0 igjen. E-LAGER-0. Dette er tydeligvis ‘steady state’.",
    links: [{ label: "Feilside", href: "/systemfeil/E-LAGER-0" }],
  },
  {
    id: "s6",
    ts: "10:02",
    channel: "#marked",
    user: "Marius",
    role: "Marked",
    emoji: "⚡",
    text: "Kan vi skru på en kampanje til? Marginene føles for stabile.",
    links: [{ label: "E-MARGIN-999", href: "/systemfeil/E-MARGIN-999" }],
  },
  {
    id: "s7",
    ts: "10:04",
    channel: "#regnskap",
    user: "Rune",
    role: "Regnskap",
    emoji: "🧾",
    text: "Nei.",
  },
  {
    id: "s8",
    ts: "10:08",
    channel: "#incident",
    user: "Anne-L",
    role: "Drift",
    emoji: "📌",
    text: "Oppsummering: Kasse feiler, lager er null, marked jubler, regnskap protesterer. Alt normalt.",
    links: [{ label: "Systemfeil-katalog", href: "/systemfeil" }],
  },
];

const JIRA: JiraIssue[] = [
  {
    key: "PRIS-101",
    title: "Checkout fullfører aldri (men ser ekte ut)",
    type: "Incident",
    status: "In progress",
    priority: "P0",
    owner: "Drift",
    code: "E-KASSE-503",
    notes: [
      "Reproduserbar på alle produkter.",
      "Marked ønsker å ‘A/B-teste frustrasjon’.",
      "Regnskap ønsker å ‘A/B-teste stillhet’.",
    ],
    links: [{ label: "Feilside", href: "/systemfeil/E-KASSE-503" }],
  },
  {
    key: "PRIS-104",
    title: "Lagerstatus er alltid 0 (vurdert som feature)",
    type: "Bug",
    status: "Won't fix",
    priority: "P1",
    owner: "Regnskap",
    code: "E-LAGER-0",
    notes: [
      "Foreslått løsning: kjøpe varer.",
      "Avvist av: virkeligheten.",
    ],
    links: [{ label: "Feilside", href: "/systemfeil/E-LAGER-0" }],
  },
  {
    key: "PRIS-108",
    title: "Prisrobot får følelser rundt margin (418)",
    type: "Bug",
    status: "Blocked",
    priority: "P2",
    owner: "Regnskap",
    code: "E-PRIS-418",
    notes: [
      "Prisrobot nekter enkelte avslag.",
      "Marked kaller det ‘brand voice’.",
    ],
    links: [{ label: "Feilside", href: "/systemfeil/E-PRIS-418" }],
  },
  {
    key: "PRIS-112",
    title: "Kundeservice svarer alltid ‘utsolgt’ (oppleves ærlig)",
    type: "Task",
    status: "Done",
    priority: "P3",
    owner: "Kundeservice",
    notes: [
      "Standardtekst ferdigstilt.",
      "Oppfølging: legg inn flere svar for å virke menneskelig.",
    ],
    links: [{ label: "Utsolgt", href: "/utsolgt" }],
  },
  {
    key: "PRIS-120",
    title: "Statusportal for feilkoder (ser seriøst ut)",
    type: "Epic",
    status: "Done",
    priority: "P2",
    owner: "Drift",
    notes: [
      "Feilkatalog publisert.",
      "Påstår at dette er ‘observability’.",
    ],
    links: [{ label: "Systemfeil", href: "/systemfeil" }],
  },
];

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Deterministisk “dagens intern-feed” basert på path (kan også være dato) */
export function getInternalFeed(seed = "intern") {
  const h = hashString(seed);
  const slack = [...SLACK].sort((a, b) => (a.id > b.id ? 1 : -1));
  const jira = [...JIRA];

  // liten deterministisk rotasjon så det føles “live” men er stabilt
  const rot = h % slack.length;
  const rotatedSlack = slack.slice(rot).concat(slack.slice(0, rot));

  const rotJ = h % jira.length;
  const rotatedJira = jira.slice(rotJ).concat(jira.slice(0, rotJ));

  return {
    slack: rotatedSlack.slice(0, 8),
    jira: rotatedJira,
  };
}
