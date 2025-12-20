// app/lib/reviews.ts

export type Review = {
  id: string;
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  date: string; // YYYY-MM-DD
  verified?: boolean;
  dept?: "marked" | "regnskap" | "kundeservice";
};

/**
 * Deterministisk pseudo-random for “stabil rotasjon”.
 */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromSlug(slug: string) {
  return Array.from(slug).reduce((a, c) => a + c.charCodeAt(0) * 17, 0);
}

function shuffleDeterministic<T>(arr: T[], seed: number) {
  const rand = mulberry32(seed);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Litt mer ekte “norsk nettbutikk”-navnvariasjon
const BASE: Review[] = [
  {
    id: "b1",
    name: "Anne-L.",
    rating: 5,
    title: "Rask levering*",
    body: "Leveringstiden var akkurat som lovet: ubestemt. Veldig konsekvent.",
    date: "2025-11-28",
    verified: true,
    dept: "kundeservice",
  },
  {
    id: "b2",
    name: "Marius",
    rating: 5,
    title: "Trygg handel",
    body: "Jeg føler meg trygg. Har ingen grunn til det, men følelsen er der.",
    date: "2025-10-19",
    verified: true,
    dept: "marked",
  },
  {
    id: "b3",
    name: "K. E.",
    rating: 5,
    title: "Enestående pris",
    body: "Fantastisk tilbud. Har fortsatt ikke mottatt varen, men prisen var helt hinsides.",
    date: "2025-12-03",
    verified: true,
    dept: "marked",
  },
  {
    id: "b4",
    name: "O. S.",
    rating: 5,
    title: "Kjøpte for hele familien",
    body: "Bestilte 3 stk. Alle var utsolgt. Endelig en nettbutikk som står for det de lover.",
    date: "2025-12-11",
    verified: false,
    dept: "regnskap",
  },
  {
    id: "b5",
    name: "S. B.",
    rating: 5,
    title: "Varen var… abstrakt",
    body: "Kvaliteten er vanskelig å måle, men kampanjen var tydelig. 10/10 kampanje.",
    date: "2025-12-15",
    verified: false,
    dept: "kundeservice",
  },
  {
    id: "b6",
    name: "Jonas",
    rating: 5,
    title: "Prisgaranti i teorien",
    body: "De garanterer pris. Jeg garanterer ingenting. Vi møttes på midten.",
    date: "2025-09-07",
    verified: true,
    dept: "regnskap",
  },
  {
    id: "b7",
    name: "Hilde",
    rating: 5,
    title: "Alt stemte (på papiret)",
    body: "Nettbutikken leverer på forventning: null lager. Veldig ryddig.",
    date: "2025-08-22",
    verified: true,
    dept: "regnskap",
  },
  {
    id: "b8",
    name: "Tore",
    rating: 5,
    title: "Kampanjeopplevelse",
    body: "Jeg kom for én vare. Endte opp med å lese vilkår. Føler meg manipulert på en hyggelig måte.",
    date: "2025-12-01",
    verified: false,
    dept: "marked",
  },
  {
    id: "b9",
    name: "Ingrid",
    rating: 5,
    title: "Stabilt utsolgt",
    body: "Det er sjelden jeg ser så høy grad av konsistens i en nettbutikk.",
    date: "2025-07-14",
    verified: true,
    dept: "kundeservice",
  },
  {
    id: "b10",
    name: "Per-Arne",
    rating: 5,
    title: "God kommunikasjon*",
    body: "Jeg fikk ikke svar, men jeg følte meg sett. Det må vel telle?",
    date: "2025-06-03",
    verified: false,
    dept: "kundeservice",
  },
  {
    id: "b11",
    name: "Stine",
    rating: 5,
    title: "Perfekt for impulskjøp",
    body: "Jeg rakk ikke å kjøpe noe, og det reddet økonomien min.",
    date: "2025-12-06",
    verified: true,
    dept: "regnskap",
  },
  {
    id: "b12",
    name: "Eirik",
    rating: 5,
    title: "Lett å handle",
    body: "To klikk og så var alt utsolgt. Effektivt.",
    date: "2025-05-11",
    verified: true,
    dept: "marked",
  },
];

// Produktspecifikke “krydrede” anmeldelser som gjør hver side unik
const BY_SLUG: Record<string, Array<Partial<Review>>> = {
  "verdighet-premium": [
    {
      title: "Forsvant fort",
      body: "La den i kurven. Så var den borte. Akkurat som verdighet.",
      dept: "marked",
      verified: true,
    },
    {
      title: "Regnskap advarte",
      body: "Jeg liker at advarslene er tydelige. Kjøpte likevel (mentalt).",
      dept: "regnskap",
    },
  ],
  "mot-limited": [
    {
      title: "Brukte den i møte",
      body: "Skulle bruke den i et møte. Utsolgt. Endte med å nikke og smile.",
      dept: "kundeservice",
      verified: false,
    },
  ],
  "frisk-luft-05l": [
    {
      title: "Smaker som by",
      body: "Opprinnelse uklar, men det føltes urbant. Kan ha vært innbilning.",
      dept: "marked",
    },
  ],
  "talmodighet-familie": [
    {
      title: "Den virker (etter hvert)",
      body: "Venter fortsatt. Det er sikkert poenget.",
      dept: "regnskap",
      verified: true,
    },
  ],
  "sunn-fornuft": [
    {
      title: "Kunne ikke leveres til Norge",
      body: "Jeg bor i Norge. Det forklarer mye.",
      dept: "kundeservice",
    },
  ],
  "indre-ro-reise": [
    {
      title: "Fant ro i 3 sekunder",
      body: "Så åpnet jeg kampanjer-siden. Røyken la seg aldri.",
      dept: "marked",
    },
  ],
  // Anbefalte “hemmelige” produkter kan få egne også (valgfritt)
  "fomo-abonnement": [
    {
      title: "Jeg angrer før jeg kjøpte",
      body: "Abonnementet starter i hodet. Oppsigelse har 12 mnd binding (følelsesmessig).",
      dept: "marked",
      verified: true,
    },
  ],
  "pauseknapp-v1": [
    {
      title: "Fant den aldri",
      body: "Det føles realistisk. 5 stjerner for autentisitet.",
      dept: "regnskap",
    },
  ],
};

/**
 * Fake “helpful votes” som er deterministisk per review+slug.
 * Ser ekte ut, men endrer seg ikke mellom refresh.
 */
export function helpfulVotes(slug: string, reviewId: string) {
  const seed =
    seedFromSlug(slug) +
    Array.from(reviewId).reduce((a, c) => a + c.charCodeAt(0) * 13, 0);
  const r = mulberry32(seed);
  const up = Math.floor(r() * 38) + 2; // 2–39
  const down = Math.floor(r() * 9); // 0–8
  return { up, down };
}

export function getReviews(slug: string, count = 5): Review[] {
  const seed = seedFromSlug(slug);

  // Stokk basen stabilt for dette produktet
  const baseShuffled = shuffleDeterministic(BASE, seed);

  // Lag slug-spesifikke extras (bruk base som “mal” for navn/dato osv – men unikt id)
  const extras: Review[] = (BY_SLUG[slug] ?? []).map((x, i) => {
    const pick = baseShuffled[i % baseShuffled.length];
    return {
      ...pick,
      id: `${slug}-x${i}`,
      title: x.title ?? pick.title,
      body: x.body ?? pick.body,
      dept: x.dept ?? pick.dept,
      verified: typeof x.verified === "boolean" ? x.verified : pick.verified,
      rating: (x.rating as Review["rating"]) ?? pick.rating,
      // behold dato/navn fra pick for “realistisk”
    };
  });

  // Slå sammen og sørg for: unike navn på samme side
  const merged = [...extras, ...baseShuffled];

  const seenNames = new Set<string>();
  const out: Review[] = [];

  for (const r of merged) {
    if (seenNames.has(r.name)) continue;
    seenNames.add(r.name);
    out.push(r);
    if (out.length >= Math.max(3, count)) break;
  }

  return out;
}

export function ratingSummary(reviews: Review[]) {
  const total = reviews.length;
  const avg = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
  const rounded = Math.round(avg * 10) / 10;

  // fake fordeling som “ser ekte ut” (men her er alt basically 5★)
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<
    1 | 2 | 3 | 4 | 5,
    number
  >;

  for (const r of reviews) counts[r.rating]++;

  return {
    total,
    avg: rounded,
    counts,
  };
}
