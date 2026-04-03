export type Voice = "strict" | "meh" | "hype";

type VoiceKey =
  | "checkout_init"
  | "checkout_validating"
  | "checkout_conflict"
  | "checkout_failure"
  | "checkout_fake_success"
  | "checkout_ready"
  | "checkout_running"
  | "ledger_update"
  | "final_note"
  | "cart_empty"
  | "cart_status";

const KEY = "prh_voice_v1";

export function getVoice(): Voice {
  try {
    const v = sessionStorage.getItem(KEY) as Voice | null;
    if (v === "strict" || v === "meh" || v === "hype") return v;

    const pick: Voice[] = ["strict", "meh", "hype"];
    const chosen = pick[Math.floor(Math.random() * pick.length)];
    sessionStorage.setItem(KEY, chosen);
    return chosen;
  } catch {
    return "meh";
  }
}

export function say(voice: Voice, key: VoiceKey) {
  const table: Record<Voice, Record<VoiceKey, string>> = {
    strict: {
  checkout_init: "Starter behandling.",
  checkout_validating: "Validerer kjøpsgrunnlag.",
  checkout_conflict: "Avvik oppdaget mellom marked og regnskap.",
  checkout_failure: "Transaksjon kan ikke fullføres.",
  checkout_fake_success: "Ordre registrert uten effekt.",
  checkout_ready: "Kasse er tilgjengelig.",
  checkout_running: "Behandling pågår.",
  ledger_update: "Intern logg oppdatert.",
  final_note: "Du eier nå en intensjon.",
  cart_empty: "Kurven er tom.",
  cart_status: "Kurv oppdatert.",
},

meh: {
  checkout_init: "Starter…",
  checkout_validating: "Sjekker noe…",
  checkout_conflict: "Dette ser litt rart ut.",
  checkout_failure: "Dette gikk ikke.",
  checkout_fake_success: "Ordre finnes kanskje.",
  checkout_ready: "Kasse er klar.",
  checkout_running: "Dette pågår fortsatt…",
  ledger_update: "Notert.",
  final_note: "Dette ble ikke noe av.",
  cart_empty: "Tomt her.",
  cart_status: "Noe ligger i kurven.",
},

hype: {
  checkout_init: "Dette skjer nå!",
  checkout_validating: "Vi er i gang! (tror vi)",
  checkout_conflict: "Oj! Litt motstand i systemet!",
  checkout_failure: "NEI! (men også ja?)",
  checkout_fake_success: "Ordre registrert! (på en måte)",
  checkout_ready: "Kasse klar! Dette kan nesten bli ekte!",
  checkout_running: "Dette ruller! Systemet lever!",
  ledger_update: "Systemet jobber!",
  final_note: "Du har kjøpt en følelse",
  cart_empty: "Kurven er tom, men mulighetene lever!",
  cart_status: "Kurven lever!",
},
  };

  const line = table[voice][key];

  if (!line) {
    console.warn(`Missing voice key: ${key} for ${voice}`);
    return table.meh[key];
  }

  return line;
}