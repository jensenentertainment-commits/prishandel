export type Voice = "strict" | "meh" | "hype";
type VoiceKey =
  | "checkout_init"
  | "checkout_validating"
  | "checkout_conflict"
  | "checkout_failure"
  | "checkout_fake_success"
  | "ledger_update"
  | "final_note";
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
    // fallback hvis sessionStorage ikke er tilgjengelig
    return "meh";
  }
}

export function say(voice: Voice, key: string, vars?: Record<string, any>) {
  const v = vars ?? {};

  const table: Record<Voice, Record<string, string>> = {
  strict: {
    checkout_init: "Starter behandling.",
    checkout_validating: "Validerer kjøpsgrunnlag.",
    checkout_conflict: "Avvik oppdaget mellom marked og regnskap.",
    checkout_failure: "Transaksjon kan ikke fullføres.",
    checkout_fake_success: "Ordre registrert uten effekt.",
    ledger_update: "Intern logg oppdatert.",
    final_note: "Du eier nå en intensjon.",
  },

  meh: {
    checkout_init: "Starter…",
    checkout_validating: "Sjekker noe…",
    checkout_conflict: "Dette ser litt rart ut.",
    checkout_failure: "Dette gikk ikke.",
    checkout_fake_success: "Ordre finnes kanskje.",
    ledger_update: "Notert.",
    final_note: "Dette ble ikke noe av.",
  },

  hype: {
    checkout_init: "Dette skjer nå! ✨",
    checkout_validating: "Vi er i gang! (tror vi)",
    checkout_conflict: "Oj! Litt motstand i systemet!",
    checkout_failure: "NEI! (men også ja?)",
    checkout_fake_success: "Ordre registrert! (på en måte)",
    ledger_update: "Systemet jobber! ✨",
    final_note: "Du har kjøpt en følelse 💫",
  },
};

  return table[voice][key] ?? table.meh[key] ?? "";
}
