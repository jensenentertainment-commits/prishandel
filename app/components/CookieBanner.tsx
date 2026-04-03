"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type BannerMode = "idle" | "processing-decline" | "details";

export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<BannerMode>("idle");
  const router = useRouter();

  useEffect(() => {
    try {
      const seen = localStorage.getItem("prishandel-cookie-consent");
      if (!seen) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (mode !== "processing-decline") return;

    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem("prishandel-cookie-consent", "declined");
      } catch {}
      router.push("/utsolgt?code=E-COOKIE-451");
    }, 900);

    return () => window.clearTimeout(timer);
  }, [mode, router]);

  if (!open) return null;

  function acceptAll() {
    try {
      localStorage.setItem("prishandel-cookie-consent", "accepted");
    } catch {}
    setOpen(false);
  }

  function openDetails() {
    setMode((prev) => (prev === "details" ? "idle" : "details"));
  }

  function decline() {
    setMode("processing-decline");
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] border-t border-black/20 bg-white shadow-2xl">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-black px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                Samtykkelag aktivt
              </span>
              <span className="rounded border border-black/15 px-2 py-1 text-[10px] font-black uppercase tracking-wide">
                REG-COOKIE / NIVÅ 3
              </span>
            </div>

            <div className="mt-2 text-base font-black md:text-lg">
              Databruk pågår
            </div>

            <p className="mt-1 max-w-2xl text-sm leading-relaxed opacity-80">
              Vi bruker cookies for å opprettholde prisminne, tilbudskontinuitet
              og regulatorisk stemning. Noe samtykke anses som nødvendig for at
              tilbud skal kunne oppleves som tilbud.
            </p>

            {mode === "details" && (
              <div className="mt-3 rounded-xl border border-black/10 bg-black/5 p-3 text-xs leading-relaxed opacity-80">
                <div>• Nødvendige cookies: lagring, stabilitet, begrunnelse</div>
                <div>• Analyse-cookies: responsmåling, avvik, prisminne</div>
                <div>• Ytelse: forbedrer inntrykket av kontroll</div>
                <div>• Regelverk: etterleves i den grad det støtter flyt</div>
              </div>
            )}

            <div className="mt-2 text-[11px] uppercase tracking-wide opacity-50">
              Avslag kan påvirke tilgjengelighet, flyt og opplevd medvirkning.
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={openDetails}
              className="rounded-lg border border-black/20 bg-white px-4 py-2 text-sm font-black text-black hover:bg-black/5"
            >
              {mode === "details" ? "Skjul detaljer" : "Tilpass"}
            </button>

            <button
              type="button"
              onClick={decline}
              disabled={mode === "processing-decline"}
              className="rounded-lg border border-black/20 bg-white px-4 py-2 text-sm font-black text-black hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {mode === "processing-decline" ? "Behandler avslag…" : "Avslå"}
            </button>

            <button
              type="button"
              onClick={acceptAll}
              disabled={mode === "processing-decline"}
              className="rounded-lg bg-red-600 px-5 py-2 text-sm font-black text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Godta alt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}