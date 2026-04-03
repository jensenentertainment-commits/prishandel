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
  emoji?: string;
  weight?: number;
  featured?: boolean;
  replyTo?: string;
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
  weight?: number;
  featured?: boolean;
};

const SLACK: SlackMsg[] = [
  {
    id: "s1",
    ts: "09:12",
    channel: "#incident",
    user: "Ole Raymond",
    role: "Drift",
    emoji: "🚨",
    text: "Incident trigget: E-KASSE-503. Kasse flyter som vanlig (dvs. ikke).",
    links: [{ label: "Feilside", href: "/systemfeil/E-KASSE-503" }],
    weight: 10,
    featured: true,
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
    weight: 8,
    replyTo: "s1",
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
    weight: 9,
    replyTo: "s2",
  },
  {
    id: "s4",
    ts: "09:21",
    channel: "#drift",
    user: "Sofia",
    role: "Kundeservice",
    emoji: "🤝",
    text: "Fikk 6 henvendelser. Svarte ‘midlertidig utsolgt’ som avtalt. Føler meg som en FAQ.",
    links: [{ label: "Kontakt", href: "/kontakt" }],
    weight: 6,
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
    weight: 9,
    featured: true,
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
    weight: 7,
  },
  {
    id: "s7",
    ts: "10:04",
    channel: "#regnskap",
    user: "Rune",
    role: "Regnskap",
    emoji: "🧾",
    text: "Nei.",
    weight: 10,
    featured: true,
    replyTo: "s6",
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
    weight: 8,
  },
  {
    id: "s9",
    ts: "10:13",
    channel: "#marked",
    user: "Marius",
    role: "Marked",
    emoji: "🛒",
    text: "Kunden trenger ikke checkout hvis kunden allerede føler at varen nesten er kjøpt.",
    weight: 5,
  },
  {
    id: "s10",
    ts: "10:16",
    channel: "#regnskap",
    user: "Rune",
    role: "Regnskap",
    emoji: "📉",
    text: "Følelse er fortsatt ikke oppgjør.",
    weight: 7,
    replyTo: "s9",
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
    weight: 10,
    featured: true,
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
    weight: 9,
    featured: true,
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
    weight: 8,
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
    weight: 5,
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
    weight: 6,
  },
  {
    key: "PRIS-131",
    title: "Margintrykk beskrives fortsatt som kampanjegevinst",
    type: "Incident",
    status: "Blocked",
    priority: "P1",
    owner: "Marked",
    code: "E-MARGIN-999",
    notes: [
      "Marked ønsker å opprettholde språkføringen.",
      "Regnskap ønsker å opprettholde pusten.",
    ],
    links: [{ label: "Systemfeil", href: "/systemfeil/E-MARGIN-999" }],
    weight: 9,
  },
];

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function score(seed: string, value: string) {
  return hashString(`${seed}:${value}`);
}

function rotateArray<T>(arr: T[], steps: number) {
  if (arr.length === 0) return arr;
  const rot = ((steps % arr.length) + arr.length) % arr.length;
  return arr.slice(rot).concat(arr.slice(0, rot));
}

function uniqueBy<T, K>(items: T[], getKey: (item: T) => K) {
  const seen = new Set<K>();
  const out: T[] = [];
  for (const item of items) {
    const key = getKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function formatDeterministicTime(seed: string, id: string, baseHour = 9, spanMinutes = 95) {
  const n = score(seed, id) % spanMinutes;
  const hour = baseHour + Math.floor(n / 60);
  const minute = n % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function withDynamicSlackTimes(seed: string, items: SlackMsg[]) {
  return items.map((item) => ({
    ...item,
    ts: formatDeterministicTime(seed, item.id),
  }));
}

function buildSlackFeed(seed: string, limit = 8) {
  const featured = SLACK.filter((m) => m.featured);
  const coded = SLACK.filter((m) => Boolean(m.links?.some((l) => l.href.includes("/systemfeil"))));
  const rest = SLACK.filter((m) => !m.featured);

  const sortedRest = [...rest].sort((a, b) => {
    const aw = (b.weight ?? 0) - (a.weight ?? 0);
    if (aw !== 0) return aw;
    return score(seed, a.id) - score(seed, b.id);
  });

  const rotatedRest = rotateArray(sortedRest, score(seed, "slack-rot") % Math.max(sortedRest.length, 1));

  const chosen = uniqueBy(
    [
      featured[score(seed, "featured-a") % featured.length],
      coded[score(seed, "coded-a") % coded.length],
      ...rotatedRest,
    ].filter(Boolean) as SlackMsg[],
    (m) => m.id
  ).slice(0, limit);

  return withDynamicSlackTimes(seed, chosen).sort((a, b) => a.ts.localeCompare(b.ts));
}

function buildJiraFeed(seed: string) {
  const featured = JIRA.filter((i) => i.featured);
  const critical = JIRA.filter(
    (i) => i.priority === "P0" || i.status === "Blocked" || i.type === "Incident"
  );
  const rest = JIRA.filter((i) => !i.featured);

  const sortedRest = [...rest].sort((a, b) => {
    const weightDelta = (b.weight ?? 0) - (a.weight ?? 0);
    if (weightDelta !== 0) return weightDelta;
    return score(seed, a.key) - score(seed, b.key);
  });

  const rotatedRest = rotateArray(sortedRest, score(seed, "jira-rot") % Math.max(sortedRest.length, 1));

  const merged = uniqueBy(
    [
      featured[score(seed, "jira-featured") % featured.length],
      critical[score(seed, "jira-critical") % critical.length],
      ...rotatedRest,
      ...featured,
    ].filter(Boolean) as JiraIssue[],
    (i) => i.key
  );

  return merged;
}

/**
 * Deterministisk intern-feed:
 * - stabil for samme seed
 * - føles mer kuratert enn bare rotert
 * - viser alltid noen sentrale saker
 */
export function getInternalFeed(seed = "intern") {
  return {
    slack: buildSlackFeed(seed, 8),
    jira: buildJiraFeed(seed),
  };
}