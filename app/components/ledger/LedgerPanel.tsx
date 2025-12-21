"use client";

import { useEffect, useState } from "react";
import { useLedger, type LedgerEntry } from "./useLedger";

export default function LedgerPanel(props: { className?: string }) {
  const ledger = useLedger();
  const [entries, setEntries] = useState<LedgerEntry[]>([]);

  // Init + lett polling (storage-event hjelper uansett ikke i samme tab)
  useEffect(() => {
    setEntries(ledger.read());

    const t = setInterval(() => {
      setEntries(ledger.read());
    }, 800);

    return () => clearInterval(t);
    // Viktig: IKKE legg "ledger" i deps (useLedger() gir nytt objekt hver render)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className={props.className}>
      <div className="rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden">
        <div className="border-b border-black/10 px-6 py-4 flex items-center justify-between">
          <div className="font-black">Regnskapslogg</div>
          <div className="text-xs font-semibold rounded bg-neutral-100 border border-black/10 px-2 py-1">
            INTERN
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="p-6 text-sm opacity-70">
            Ingen registreringer. Systemet har foreløpig ro.
          </div>
        ) : (
          <div className="max-h-[320px] overflow-auto">
            <div className="divide-y divide-black/10">
              {entries
                .slice()
                .reverse()
                .slice(0, 24)
                .map((e) => {
                  const f = ledger.format(e);
                  return (
                    <div
                      key={e.id}
                      className="px-6 py-3 flex items-start justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-black truncate">{e.text}</div>
                        <div className="text-[11px] opacity-60 mt-0.5">
                          {f.time} • Ref: {e.id.split("_")[0]}
                        </div>
                      </div>
                      <div className="text-sm font-black tabular-nums whitespace-nowrap">
                        {f.amount}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        <div className="px-6 py-4 bg-neutral-50 border-t border-black/10 text-xs opacity-70">
          Tallene kan avvike fra virkeligheten. Regnskap tar likevel notater.
        </div>
      </div>
    </section>
  );
}
