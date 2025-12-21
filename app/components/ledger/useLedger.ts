"use client";

export type LedgerEntry = {
  id: string;
  ts: number;
  text: string;
  amount: number; // kan være 0 eller +/- (kun estetikk)
};

const KEY = "prh_ledger_v1";

function load(): LedgerEntry[] {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LedgerEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x) => typeof x?.id === "string" && typeof x?.ts === "number");
  } catch {
    return [];
  }
}

function save(entries: LedgerEntry[]) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(entries.slice(-200))); // cap
  } catch {
    // silent
  }
}

function id() {
  return `${Date.now()}_${Math.floor(Math.random() * 1e9)}`;
}

function fmtAmount(n: number) {
  const abs = Math.abs(Math.round(n));
  const sign = n < 0 ? "−" : "+";
  return `${sign} ${abs.toLocaleString("nb-NO")},-`;
}

export function useLedger() {
  const append = (text: string, amount = 0) => {
    const entries = load();
    const next: LedgerEntry = { id: id(), ts: Date.now(), text, amount };
    const updated = [...entries, next];
    save(updated);
    return next;
  };

  const read = () => load();

  const clear = () => save([]);

  const format = (e: LedgerEntry) => {
    return {
      amount: fmtAmount(e.amount),
      time: "nå", // med vilje. kan eskalere senere.
    };
  };

  return { append, read, clear, format };
}
