
export type ProductCollection = "main" | "recommended";

export type Product = {
  slug: string;
  title: string;
  now: number;
  before: number;
  note: string;
  short: string;
  details: string[];
  collection: ProductCollection;
};

export type ProductComputed = Product & {
  badge: string;
};

const MAIN_PRODUCTS: Product[] = [
  {
    slug: "verdighet-premium",
    title: "Verdighet – Premium",
    now: 399,
    before: 2999,
    short: "En grunnleggende egenskap som forsvinner i møte med kampanje.",
    note: "Anbefales ikke av økonomiavdelingen.",
    details: [
      "Lagerstatus: 0",
      "Levering: ubestemt",
      "Retur: gjelder ikke abstrakte konsepter",
      "Passer for: kundeservice, møter, familie",
    ],
    collection: "main",
  },
  {
    slug: "mot-limited",
    title: "Mot (Limited Edition)",
    now: 199,
    before: 1499,
    short: "For vanskelige telefonsamtaler og åpne kontorlandskap.",
    note: "Kjøpes ofte sammen med Tålmodighet.",
    details: ["Lagerstatus: 0", "Levering: når du minst venter det"],
    collection: "main",
  },
  {
    slug: "frisk-luft-05l",
    title: "Frisk luft – 0,5L på flaske",
    now: 79,
    before: 499,
    short: "Urban luft, tappet i hast og uten dokumentasjon.",
    note: "Opprinnelse: ikke dokumentert.",
    details: ["Lagerstatus: 0", "Miljømerking: kommer snart"],
    collection: "main",
  },
  {
    slug: "talmodighet-familie",
    title: "Tålmodighet – familiepakke",
    now: 249,
    before: 1899,
    short: "Holder sjelden så lenge som beskrevet.",
    note: "Kun tilgjengelig i teorien.",
    details: ["Lagerstatus: 0", "Bruksanvisning: gi det tid"],
    collection: "main",
  },
  {
    slug: "sunn-fornuft",
    title: "Sunn fornuft",
    now: 99,
    before: 999,
    short: "Maks 1 per kunde. Dessverre ikke leverbar i praksis.",
    note: "Kan dessverre ikke leveres til Norge.",
    details: ["Lagerstatus: 0", "Frakt: avhenger av virkeligheten"],
    collection: "main",
  },
  {
    slug: "indre-ro-reise",
    title: "Indre ro – reiseutgave",
    now: 129,
    before: 1199,
    short: "Midlertidig fjernet grunnet ettertanke.",
    note: "Tilgjengelig i korte øyeblikk.",
    details: ["Lagerstatus: 0", "Levering: tilfeldig"],
    collection: "main",
  },
];

const RECOMMENDED_PRODUCTS: Product[] = [
  {
    slug: "sjalusi-storpakke",
    title: "Sjalusi – storpakke",
    now: 149,
    before: 1299,
    short: "Passer perfekt til sosiale medier og familieselskap.",
    note: "Regnskap: ikke fradragsberettiget.",
    details: ["Lagerstatus: 0", "Levering: etter siste like", "Retur: nei"],
    collection: "recommended",
  },
  {
    slug: "selvrespekt-mini",
    title: "Selvrespekt – mini",
    now: 59,
    before: 599,
    short: "Praktisk størrelse. Forsvinner lett i lommen.",
    note: "Marked: lettsolgt. Regnskap: lett borte.",
    details: ["Lagerstatus: 0", "Levering: ved anledning", "Bruksområde: møter"],
    collection: "recommended",
  },
  {
    slug: "tidsklemme-pro",
    title: "Tidsklemme – Pro",
    now: 199,
    before: 1999,
    short: "For deg som vil ha mindre tid på alt.",
    note: "Regnskap: allerede implementert.",
    details: ["Lagerstatus: 0", "Levering: alltid i går", "Garanti: ingen"],
    collection: "recommended",
  },
  {
    slug: "beslutningsvegring-xl",
    title: "Beslutningsvegring – XL",
    now: 129,
    before: 999,
    short: "Gjør alle valg enklere ved å unngå dem.",
    note: "Marked: anbefales. Regnskap: anbefaler pause.",
    details: ["Lagerstatus: 0", "Levering: senere", "Anbefalt: ja/nei"],
    collection: "recommended",
  },
  {
    slug: "fomo-abonnement",
    title: "FOMO – abonnement",
    now: 99,
    before: 899,
    short: "Månedlig påfyll av dårlig magefølelse.",
    note: "Regnskap: månedlig irritasjon.",
    details: ["Lagerstatus: 0", "Binding: alltid", "Oppsigelse: vanskelig"],
    collection: "recommended",
  },
  {
    slug: "pauseknapp-v1",
    title: "Pauseknapp (beta)",
    now: 79,
    before: 799,
    short: "En knapp du aldri finner når du trenger den.",
    note: "Regnskap: mangler dokumentasjon.",
    details: ["Lagerstatus: 0", "Levering: ukjent", "Kompatibilitet: mennesker"],
    collection: "recommended",
  },
];

const ALL_PRODUCTS: Product[] = [...MAIN_PRODUCTS, ...RECOMMENDED_PRODUCTS];

export function getDiscountPercent(now: number, before: number) {
  if (before <= 0) return 0;
  return Math.max(0, Math.round((1 - now / before) * 100));
}

export function getBadge(now: number, before: number) {
  return `-${getDiscountPercent(now, before)}%`;
}

export function withComputedProduct(product: Product): ProductComputed {
  return {
    ...product,
    badge: getBadge(product.now, product.before),
  };
}

export function formatNok(n: number) {
  return new Intl.NumberFormat("nb-NO").format(n) + ",-";
}

export function getAllProducts() {
  return ALL_PRODUCTS;
}

export function getMainProducts() {
  return MAIN_PRODUCTS;
}

export function getRecommendedProducts() {
  return RECOMMENDED_PRODUCTS;
}

export function getProduct(slug: string) {
  return ALL_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

// --- Lekkasjer / interne linjer (deterministisk per produkt) ---

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pickFrom<T>(arr: readonly T[], n: number) {
  return arr[n % arr.length];
}

const LEAK_LINES = [
  "Intern SKU: PRS-%SLUG%",
  "Margin: -%MARGIN%% (godkjent av marked)",
  "Lagerfeed: NaN (kilde: følelser)",
  "Fraktklasse: HÅP • ETA: ubestemt",
  "Returpolicy: gjelder ikke abstrakte konsepter",
  "Prisrobot: aktiv • samvittighet: deaktivert",
  "Kampanjeflagg: ALWAYS_ON • avslag: %OFF%%",
  "Godkjenning: regnskap i protest (dokumentert)",
  "Produktgruppe: %COLLECTION%",
  "Notat: %NOTE%",
] as const;

export function getLeaks(productOrSlug: Product | string, count = 2) {
  const product =
    typeof productOrSlug === "string"
      ? getProduct(productOrSlug)
      : productOrSlug;

  const slug = product?.slug ?? String(productOrSlug);
  const h = hashString(slug);

  const off = product
    ? getDiscountPercent(product.now, product.before)
    : 80 + (h % 19);

  const margin = product
    ? 100 + Math.round((product.before - product.now) * 0.12)
    : 120 + (h % 401);

  const code = slug.toUpperCase().replace(/[^A-Z0-9]+/g, "-").slice(0, 16);
  const note = product?.note ?? "ikke dokumentert";
  const collection = product?.collection === "recommended" ? "RECOMMENDED" : "MAIN";

  const a = pickFrom(LEAK_LINES, h);
  const b = pickFrom(LEAK_LINES, h + 3);
  const c = pickFrom(LEAK_LINES, h + 6);

  const fmt = (line: string) =>
    line
      .replaceAll("%SLUG%", code)
      .replaceAll("%OFF%", String(off))
      .replaceAll("%MARGIN%", String(margin))
      .replaceAll("%NOTE%", note)
      .replaceAll("%COLLECTION%", collection);

  const list = [fmt(a), fmt(b), fmt(c)];

  return list.slice(0, Math.max(1, Math.min(3, count)));
}

// Midlertidig kompatibilitet hvis du fortsatt importerer disse navnene:
export const PRODUCTS = MAIN_PRODUCTS;
export const RECOMMENDED = RECOMMENDED_PRODUCTS;