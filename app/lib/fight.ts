// app/lib/fight.ts

export type FightSpeaker = "marked" | "regnskap";
export type FightTag = "campaign" | "shipping" | "stock" | "coupon" | "generic";

export type FightLine = {
  speaker: FightSpeaker;
  text: string;
  href?: string;
};

export type FightPair = {
  id: string;
  tag: FightTag;
  market: FightLine;
  ledger: FightLine;
  weight?: number;
};

export type FightOptions = {
  seed?: string;
  offset?: number;
};

const FIGHTS: readonly FightPair[] = [
  {
    id: "campaign-1",
    tag: "campaign",
    weight: 10,
    market: {
      speaker: "marked",
      text: "DETTE MÅ VEKK! (vi har bare ingenting)",
      href: "/kampanjer",
    },
    ledger: {
      speaker: "regnskap",
      text: "Kampanje godkjent under protest. (dokumentert)",
    },
  },
  {
    id: "campaign-2",
    tag: "campaign",
    weight: 8,
    market: {
      speaker: "marked",
      text: "KAMPANJEN ER LIVE. KONSEKVENSENE KOMMER SENERE.",
      href: "/kampanjer",
    },
    ledger: {
      speaker: "regnskap",
      text: "Konsekvensene er allerede her.",
    },
  },
  {
    id: "stock-1",
    tag: "stock",
    weight: 10,
    market: {
      speaker: "marked",
      text: "UTSOLGT NÅ — MEN DET ER TILBUD UANSETT",
      href: "/kampanjer",
    },
    ledger: {
      speaker: "regnskap",
      text: "Vi minner om lagerstatus: 0. Igjen.",
    },
  },
  {
    id: "stock-2",
    tag: "stock",
    weight: 8,
    market: {
      speaker: "marked",
      text: "PÅ LAGER I ÅNDEN. UTSOLGT I PRAKSIS.",
      href: "/butikk",
    },
    ledger: {
      speaker: "regnskap",
      text: "Ånden føres ikke som beholdning.",
    },
  },
  {
    id: "shipping-1",
    tag: "shipping",
    weight: 8,
    market: {
      speaker: "marked",
      text: "GRATIS FRAKT* (på følelsen)",
      href: "/kampanjer",
    },
    ledger: {
      speaker: "regnskap",
      text: "Fraktkostnad er ikke det samme som fraktro.",
    },
  },
  {
    id: "shipping-2",
    tag: "shipping",
    weight: 6,
    market: {
      speaker: "marked",
      text: "LEVERING SNART!* (som konsept)",
      href: "/butikk",
    },
    ledger: {
      speaker: "regnskap",
      text: "Konseptet er ikke koordinert med transport.",
    },
  },
  {
    id: "coupon-1",
    tag: "coupon",
    weight: 8,
    market: {
      speaker: "marked",
      text: "RABATTKODE AKTIV! EFFEKTEN ER EMOSJONELL!",
      href: "/kampanjer",
    },
    ledger: {
      speaker: "regnskap",
      text: "Kupongeffekt kan ikke bekreftes.",
    },
  },
  {
    id: "coupon-2",
    tag: "coupon",
    weight: 7,
    market: {
      speaker: "marked",
      text: "KODEN ER GOD NOK HVIS DU IKKE SER FOR NØYE ETTER.",
      href: "/kampanjer",
    },
    ledger: {
      speaker: "regnskap",
      text: "Det er nettopp det vi gjør.",
    },
  },
  {
    id: "generic-1",
    tag: "generic",
    weight: 9,
    market: {
      speaker: "marked",
      text: "SLUTTER I DAG!* (resettes ved refresh)",
      href: "/kampanjer",
    },
    ledger: {
      speaker: "regnskap",
      text: "Stopp. Vennligst les vilkår. (du kommer ikke til å gjøre det)",
    },
  },
  {
    id: "generic-2",
    tag: "generic",
    weight: 8,
    market: {
      speaker: "marked",
      text: "ALT SER KONTROLLERT UT FRA VÅR VINKEL.",
      href: "/butikk",
    },
    ledger: {
      speaker: "regnskap",
      text: "Vår vinkel er annerledes.",
    },
  },
] as const;

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i);
  }
  return Math.abs(h);
}

function normalizeOptions(options?: FightOptions) {
  return {
    seed: options?.seed ?? "default",
    offset: options?.offset ?? 0,
  };
}

function pickStable<T>(arr: readonly T[], seed: string, offset = 0): T {
  if (!arr.length) {
    throw new Error("pickStable called with empty array");
  }
  const idx = (hashString(seed) + offset) % arr.length;
  return arr[idx];
}

function weightedSort<T extends { weight?: number; id: string }>(
  items: readonly T[],
  seed: string
) {
  return [...items].sort((a, b) => {
    const weightDelta = (b.weight ?? 0) - (a.weight ?? 0);
    if (weightDelta !== 0) return weightDelta;
    return hashString(`${seed}|${a.id}`) - hashString(`${seed}|${b.id}`);
  });
}

export function tagForPath(pathname: string): FightTag {
  const p = pathname.toLowerCase();

  if (
    p.includes("kampanje") ||
    p.includes("deal") ||
    p.includes("tilbud")
  ) {
    return "campaign";
  }

  if (
    p.includes("frakt") ||
    p.includes("lever") ||
    p.includes("shipping")
  ) {
    return "shipping";
  }

  if (
    p.includes("lager") ||
    p.includes("utsolgt") ||
    p.includes("butikk") ||
    p.includes("produkt")
  ) {
    return "stock";
  }

  if (
    p.includes("kupong") ||
    p.includes("kode") ||
    p.includes("coupon")
  ) {
    return "coupon";
  }

  return "generic";
}

export function getFightForPath(pathname: string, options?: FightOptions) {
  const { seed, offset } = normalizeOptions(options);
  const tag = tagForPath(pathname);

  const tagged = FIGHTS.filter((f) => f.tag === tag);
  const pool = tagged.length ? tagged : FIGHTS;

  const sortedPool = weightedSort(pool, `${pathname}|${seed}|${tag}`);
  const selected = pickStable(
    sortedPool,
    `${pathname}|${seed}|${tag}|fight`,
    offset
  );

  return [selected.market, selected.ledger] as const;
}

export function getFightMetaForPath(pathname: string, options?: FightOptions) {
  const { seed, offset } = normalizeOptions(options);
  const tag = tagForPath(pathname);

  const tagged = FIGHTS.filter((f) => f.tag === tag);
  const pool = tagged.length ? tagged : FIGHTS;
  const sortedPool = weightedSort(pool, `${pathname}|${seed}|${tag}`);
  const selected = pickStable(
    sortedPool,
    `${pathname}|${seed}|${tag}|fight`,
    offset
  );

  return {
    id: selected.id,
    tag: selected.tag,
    market: selected.market,
    ledger: selected.ledger,
  } as const;
}