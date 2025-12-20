
export type Product = {
  slug: string;
  title: string;
  now: number;
  before: number;
  badge: string;
  note: string;
  short: string;
  details: string[];
};

export const PRODUCTS: Product[] = [
  {
    slug: "verdighet-premium",
    title: "Verdighet – Premium",
    now: 399,
    before: 2999,
    badge: "-87%",
    short: "En grunnleggende egenskap som forsvinner i møte med kampanje.",
    note: "Anbefales ikke av økonomiavdelingen.",
    details: [
      "Lagerstatus: 0",
      "Levering: ubestemt",
      "Retur: gjelder ikke abstrakte konsepter",
      "Passer for: kundeservice, møter, familie",
    ],
  },
  {
    slug: "mot-limited",
    title: "Mot (Limited Edition)",
    now: 199,
    before: 1499,
    badge: "-86%",
    short: "For vanskelige telefonsamtaler og åpne kontorlandskap.",
    note: "Kjøpes ofte sammen med Tålmodighet.",
    details: ["Lagerstatus: 0", "Levering: når du minst venter det"],
  },
  {
    slug: "frisk-luft-05l",
    title: "Frisk luft – 0,5L på flaske",
    now: 79,
    before: 499,
    badge: "-84%",
    short: "Urban luft, tappet i hast og uten dokumentasjon.",
    note: "Opprinnelse: ikke dokumentert.",
    details: ["Lagerstatus: 0", "Miljømerking: kommer snart"],
  },
  {
    slug: "talmodighet-familie",
    title: "Tålmodighet – familiepakke",
    now: 249,
    before: 1899,
    badge: "-86%",
    short: "Holder sjelden så lenge som beskrevet.",
    note: "Kun tilgjengelig i teorien.",
    details: ["Lagerstatus: 0", "Bruksanvisning: gi det tid"],
  },
  {
    slug: "sunn-fornuft",
    title: "Sunn fornuft",
    now: 99,
    before: 999,
    badge: "-90%",
    short: "Maks 1 per kunde. Dessverre ikke leverbar i praksis.",
    note: "Kan dessverre ikke leveres til Norge.",
    details: ["Lagerstatus: 0", "Frakt: avhenger av virkeligheten"],
  },
  {
    slug: "indre-ro-reise",
    title: "Indre ro – reiseutgave",
    now: 129,
    before: 1199,
    badge: "-89%",
    short: "Midlertidig fjernet grunnet ettertanke.",
    note: "Tilgjengelig i korte øyeblikk.",
    details: ["Lagerstatus: 0", "Levering: tilfeldig"],
  },
];

export const RECOMMENDED: Product[] = [
  {
    slug: "sjalusi-storpakke",
    title: "Sjalusi – storpakke",
    now: 149,
    before: 1299,
    badge: "-88%",
    short: "Passer perfekt til sosiale medier og familieselskap.",
    note: "Regnskap: ikke fradragsberettiget.",
    details: ["Lagerstatus: 0", "Levering: etter siste like", "Retur: nei"],
  },
  {
    slug: "selvrespekt-mini",
    title: "Selvrespekt – mini",
    now: 59,
    before: 599,
    badge: "-90%",
    short: "Praktisk størrelse. Forsvinner lett i lommen.",
    note: "Marked: lettsolgt. Regnskap: lett borte.",
    details: ["Lagerstatus: 0", "Levering: ved anledning", "Bruksområde: møter"],
  },
  {
    slug: "tidsklemme-pro",
    title: "Tidsklemme – Pro",
    now: 199,
    before: 1999,
    badge: "-90%",
    short: "For deg som vil ha mindre tid på alt.",
    note: "Regnskap: allerede implementert.",
    details: ["Lagerstatus: 0", "Levering: alltid i går", "Garanti: ingen"],
  },
  {
    slug: "beslutningsvegring-xl",
    title: "Beslutningsvegring – XL",
    now: 129,
    before: 999,
    badge: "-87%",
    short: "Gjør alle valg enklere ved å unngå dem.",
    note: "Marked: anbefales. Regnskap: anbefaler pause.",
    details: ["Lagerstatus: 0", "Levering: senere", "Anbefalt: ja/nei"],
  },
  {
    slug: "fomo-abonnement",
    title: "FOMO – abonnement",
    now: 99,
    before: 899,
    badge: "-89%",
    short: "Månedlig påfyll av dårlig magefølelse.",
    note: "Regnskap: månedlig irritasjon.",
    details: ["Lagerstatus: 0", "Binding: alltid", "Oppsigelse: vanskelig"],
  },
  {
    slug: "pauseknapp-v1",
    title: "Pauseknapp (beta)",
    now: 79,
    before: 799,
    badge: "-90%",
    short: "En knapp du aldri finner når du trenger den.",
    note: "Regnskap: mangler dokumentasjon.",
    details: ["Lagerstatus: 0", "Levering: ukjent", "Kompatibilitet: mennesker"],
  },
];

export function formatNok(n: number) {
  return new Intl.NumberFormat("nb-NO").format(n) + ",-";
}

export function getProduct(slug: string) {
  return (
    PRODUCTS.find((p) => p.slug === slug) ??
    RECOMMENDED.find((p) => p.slug === slug) ??
    null
  );
}
// --- Lekkasjer / interne linjer (deterministisk per slug) ---

function hashSlug(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pickFrom<T>(arr: readonly T[], n: number) {
  return arr[n % arr.length];
}

const LEAK_A = [
  "Intern SKU",
  "Margin",
  "Fraktklasse",
  "Returpolicy",
  "Godkjenning",
  "Lagerfeed",
  "Prisrobot",
  "Kampanjeflagg",
] as const;

const LEAK_B = [
  "PRS-%SLUG%",
  "NEG-%",
  "HÅP",
  "NEI",
  "MARKED",
  "REGNSKAP",
  "NA",
  "AUTO",
] as const;

const LEAK_LINES = [
  "Intern SKU: PRS-%SLUG%",
  "Margin: -%MARGIN%% (godkjent av marked)",
  "Lagerfeed: NaN (kilde: følelser)",
  "Fraktklasse: HÅP • ETA: ubestemt",
  "Returpolicy: gjelder ikke abstrakte konsepter",
  "Prisrobot: aktiv • samvittighet: deaktivert",
  "Kampanjeflagg: ALWAYS_ON • avslag: %OFF%%",
  "Godkjenning: regnskap i protest (dokumentert)",
] as const;

export function getLeaks(slug: string, count = 2) {
  const h = hashSlug(slug);

  // deterministiske tall
  const off = 80 + (h % 19); // 80–98
  const margin = 120 + (h % 401); // 120–520
  const code = slug.toUpperCase().replace(/[^A-Z0-9]+/g, "-").slice(0, 16);

  const a = pickFrom(LEAK_LINES, h);
  const b = pickFrom(LEAK_LINES, h + 3);
  const c = pickFrom(LEAK_LINES, h + 6);

  const fmt = (line: string) =>
    line
      .replaceAll("%SLUG%", code)
      .replaceAll("%OFF%", String(off))
      .replaceAll("%MARGIN%", String(margin));

  const list = [fmt(a), fmt(b), fmt(c)];

  return list.slice(0, Math.max(1, Math.min(3, count)));
}

export function getAllProducts() {
  return [...PRODUCTS, ...RECOMMENDED];
}

