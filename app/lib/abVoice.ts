export type Voice = "strict" | "meh" | "hype";

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
      cart_status: `Status: ${v.status}`,
      cart_empty: "Status: Avventer initiering",
      checkout_ready: "Kasse er tilgjengelig. Konsekvenser er ukjente.",
      checkout_running: "Behandling pågår. Ikke avbryt uten grunn.",
      order_received: "Ordre mottatt. Videre behandling vurderes.",
    },
    meh: {
      cart_status: `Status: ${v.status}`,
      cart_empty: "Status: Avventer initiering",
      checkout_ready: "Kasse (simulert).",
      checkout_running: "Behandler…",
      order_received: "Ordre mottatt (teoretisk).",
    },
    hype: {
      cart_status: `Status: ${v.status} ✨`,
      cart_empty: "Status: Klar for fristelse ✨",
      checkout_ready: "Kasse er klar (mentalt).",
      checkout_running: "Nå skjer det! (nesten)",
      order_received: "Ordre mottatt! (systemet jubler lavt)",
    },
  };

  return table[voice][key] ?? table.meh[key] ?? "";
}
