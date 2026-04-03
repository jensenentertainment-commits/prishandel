// app/lib/voices.ts

export type VoiceKind = "generic" | "price" | "shipping" | "coupon" | "stock";
export type Voice = "market" | "ledger";

export type VoiceLine = {
  voice: Voice;
  text: string;
};

export type VoiceOptions = {
  seed?: string;
  offset?: number;
};

export type VoiceBlock = {
  prefix: string;
  lines: Record<VoiceKind, readonly string[]>;
  extras: readonly string[];
};

export type VoiceActor = VoiceBlock & {
  say: (kind?: VoiceKind, options?: VoiceOptions) => string;
  extra: (options?: VoiceOptions) => string;
  raw: (kind?: VoiceKind, options?: VoiceOptions) => string;
};

function hashString(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i);
  }
  return Math.abs(h);
}

function normalizeOptions(options?: VoiceOptions) {
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

function resolveList(block: VoiceBlock, kind: VoiceKind) {
  const list = block.lines[kind];
  return list.length ? list : block.lines.generic;
}

function rawLine(block: VoiceBlock, kind: VoiceKind = "generic", options?: VoiceOptions) {
  const { seed, offset } = normalizeOptions(options);
  const list = resolveList(block, kind);
  return pickStable(list, `${block.prefix}|${kind}|${seed}`, offset);
}

function sayLine(block: VoiceBlock, kind: VoiceKind = "generic", options?: VoiceOptions) {
  return `${block.prefix} ${rawLine(block, kind, options)}`;
}

function extraLine(block: VoiceBlock, options?: VoiceOptions) {
  const { seed, offset } = normalizeOptions(options);
  return pickStable(block.extras, `${block.prefix}|extra|${seed}`, offset);
}

// --- Markedsavdelingen (📣) ---
const MARKET_BLOCK: VoiceBlock = {
  prefix: "📣 Markedsavdelingen:",
  lines: {
    generic: [
      "MIDLERTIDIG UTSOLGT! MEN KAMPANJENE LEVER 🔥 👉 /kampanjer",
      "UTSOLGT NÅ – MEN DET ER TILBUD UANSETT ⚡ 👉 /kampanjer",
      "DETTE MÅ VEKK! (vi har bare ingenting) 👉 /kampanjer",
      "SLUTTER I DAG!* (resettes ved refresh) 👉 /kampanjer",
    ],
    price: [
      "PRISENE ER LAVE! LAGERET ER LAVERE! 👉 /kampanjer",
      "OPPTIL -90%* (på følelsen) 👉 /kampanjer",
      "KUPP NÅ! (resultat kan variere) 👉 /kampanjer",
      "RABATT AKTIVERT! PRODUKT DEAKTIVERT! 👉 /kampanjer",
    ],
    shipping: [
      "GRATIS FRAKT* (på papiret) 👉 /kampanjer",
      "LEVERING SNART!* (som konsept) 👉 /kampanjer",
      "POSTEN ER INFORMERT!* 👉 /kampanjer",
      "KJØP NÅ – VI FINNER EN MÅTE!* 👉 /kampanjer",
    ],
    coupon: [
      "KUPONG AKTIVERT! EFFEKT: SYMBOLSK! 👉 /kampanjer",
      "RABATTKODE REGISTRERT! DOKUMENTASJON FØLGER IKKE NØDVENDIGVIS! 👉 /kampanjer",
      "AVSLAG ER OGSÅ EN FORM FOR RABATT! 👉 /kampanjer",
      "KODEN ER MENTALT GODKJENT! 👉 /kampanjer",
    ],
    stock: [
      "PÅ LAGER!* (i teorien) 👉 /kampanjer",
      "UTSOLGT MENS DU LESTE DETTE! 👉 /kampanjer",
      "SISTE SJANSE!* (det er alltid siste sjanse) 👉 /kampanjer",
      "LAGER: 0 — ENTHUSIASME: 100! 👉 /kampanjer",
    ],
  },
  extras: [
    "Gjelder i dag.*",
    "Kun nå.*",
    "Så lenge det varer.*",
    "Dette er en mulighet.*",
  ],
};

const MARKET: VoiceActor = {
  ...MARKET_BLOCK,
  say: (kind = "generic", options) => sayLine(MARKET_BLOCK, kind, options),
  raw: (kind = "generic", options) => rawLine(MARKET_BLOCK, kind, options),
  extra: (options) => extraLine(MARKET_BLOCK, options),
};

// --- Regnskapsføreren (🧾) ---
const LEDGER_BLOCK: VoiceBlock = {
  prefix: "🧾 Regnskapsfører:",
  lines: {
    generic: [
      "Dette er notert.",
      "Dette er ikke godkjent.",
      "Dette er problematisk.",
      "Marginene er negative.",
      "Jeg har gjort mitt.",
      "Dette kan ikke fortsette.",
    ],
    price: [
      "Denne prisen er ikke bærekraftig.",
      "Førpris kan ikke bekreftes.",
      "Rabatten er ikke dokumentert.",
      "Tallene er ikke konsultert.",
    ],
    shipping: [
      "Leveringsdato er ubestemt.",
      "Fraktvilkår er uavklart.",
      "Dette er ikke koordinert.",
      "Jeg anbefaler ro.",
    ],
    coupon: [
      "Kupongeffekt er symbolsk.",
      "Koden er ikke godkjent.",
      "Dette gir primært følelse.",
      "Dette vil dukke opp i avvik.",
    ],
    stock: [
      "Lagerstatus er 0.",
      "Utsolgt er forventet.",
      "Dette er i tråd med historikk.",
      "Dette endrer ingenting.",
    ],
  },
  extras: [
    "Notert.",
    "Arkivert.",
    "Bekymringsfullt.",
    "Som forventet.",
  ],
};

const LEDGER: VoiceActor = {
  ...LEDGER_BLOCK,
  say: (kind = "generic", options) => sayLine(LEDGER_BLOCK, kind, options),
  raw: (kind = "generic", options) => rawLine(LEDGER_BLOCK, kind, options),
  extra: (options) => extraLine(LEDGER_BLOCK, options),
};

export const voices: {
  market: VoiceActor;
  ledger: VoiceActor;
  duel: (kind?: VoiceKind, options?: VoiceOptions) => readonly VoiceLine[];
  one: (voice: Voice, kind?: VoiceKind, options?: VoiceOptions) => VoiceLine;
  pair: (kind?: VoiceKind, options?: VoiceOptions) => {
    market: string;
    ledger: string;
  };
} = {
  market: MARKET,
  ledger: LEDGER,

  duel(kind: VoiceKind = "generic", options?: VoiceOptions): readonly VoiceLine[] {
    const normalized = normalizeOptions(options);

    return [
      {
        voice: "market",
        text: MARKET.say(kind, {
          seed: `${normalized.seed}|duel|market`,
          offset: normalized.offset,
        }),
      },
      {
        voice: "ledger",
        text: LEDGER.say(kind, {
          seed: `${normalized.seed}|duel|ledger`,
          offset: normalized.offset,
        }),
      },
    ] as const;
  },

  one(voice: Voice, kind: VoiceKind = "generic", options?: VoiceOptions): VoiceLine {
    return voice === "market"
      ? { voice, text: MARKET.say(kind, options) }
      : { voice, text: LEDGER.say(kind, options) };
  },

  pair(kind: VoiceKind = "generic", options?: VoiceOptions) {
    const normalized = normalizeOptions(options);

    return {
      market: MARKET.say(kind, {
        seed: `${normalized.seed}|pair|market`,
        offset: normalized.offset,
      }),
      ledger: LEDGER.say(kind, {
        seed: `${normalized.seed}|pair|ledger`,
        offset: normalized.offset,
      }),
    } as const;
  },
};
  