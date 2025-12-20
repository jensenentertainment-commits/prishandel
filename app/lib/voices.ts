// app/lib/voices.ts

export type VoiceKind = "generic" | "price" | "shipping" | "coupon" | "stock";
export type Voice = "market" | "ledger";

export type VoiceLine = {
  voice: Voice;
  text: string;
};

export type VoiceBlock = {
  prefix: string;
  lines: Record<VoiceKind, readonly string[]>;
};

export type VoiceActor = VoiceBlock & {
  say: (kind?: VoiceKind) => string;
  aside?: () => string;
  ps?: () => string;
};

function pick<T>(arr: readonly T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export type LedgerActor = VoiceActor & {
  ps: () => string;
};


function say(block: VoiceBlock, kind: VoiceKind = "generic") {
  const list = block.lines[kind]?.length ? block.lines[kind] : block.lines.generic;
  return `${block.prefix} ${pick(list)}`;
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
      "KUPONG? SELVFØLGELIG!* 👉 /kampanjer",
      "BRUK KODEN «HASTER»!* 👉 /kampanjer",
      "KUPONG AKTIVERT! EFFEKT: SYMBOLSK! 👉 /kampanjer",
      "RABATTKODE GODKJENT AV DEG! 👉 /kampanjer",
    ],
    stock: [
      "PÅ LAGER!* (i teorien) 👉 /kampanjer",
      "UTSOLGT MENS DU LESTE DETTE! 👉 /kampanjer",
      "SISTE SJANSE!* (det er alltid siste sjanse) 👉 /kampanjer",
      "LAGER: 0 — ENTHUSIASME: 100! 👉 /kampanjer",
    ],
  },
};

const MARKET: VoiceActor = {
  ...MARKET_BLOCK,
  say: (kind = "generic") => say(MARKET_BLOCK, kind),
  aside: () =>
    pick(["Gjelder i dag.*", "Kun nå.*", "Så lenge det varer.*", "Dette er en mulighet.*"] as const),
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
    shipping: ["Leveringsdato er ubestemt.", "Fraktvilkår er uavklart.", "Dette er ikke koordinert.", "Jeg anbefaler ro."],
    coupon: ["Kupongeffekt er symbolsk.", "Koden er ikke godkjent.", "Dette gir primært følelse.", "Dette vil dukke opp i avvik."],
    stock: ["Lagerstatus er 0.", "Utsolgt er forventet.", "Dette er i tråd med historikk.", "Dette endrer ingenting."],
  },
};

export const LEDGER: LedgerActor = {
  ...LEDGER_BLOCK,
  say: (kind = "generic") => say(LEDGER_BLOCK, kind),
  ps: () => pick(["Notert.", "Arkivert.", "Bekymringsfullt.", "Som forventet."] as const),
};

// ---- Exportert API ----
export const voices: {
  market: VoiceActor;
  ledger: LedgerActor;
  duel: (kind?: VoiceKind) => readonly VoiceLine[];
  one: (voice: Voice, kind?: VoiceKind) => VoiceLine;
} = {
  market: MARKET,
  ledger: LEDGER,

  duel(kind = "generic") {
    return [
      { voice: "market", text: MARKET.say(kind) },
      { voice: "ledger", text: LEDGER.say(kind) },
    ] as const;
  },

  one(voice, kind = "generic") {
    return voice === "market"
      ? { voice, text: MARKET.say(kind) }
      : { voice, text: LEDGER.say(kind) };
  },
};
