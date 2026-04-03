"use client";

import { useVisitVariant } from "@/app/lib/useVisitVariant";
import { pick } from "@/app/lib/visitSeed";

const BANNERS = [
  "Lager er et signal.",
  "Lager er en følelse.",
  "Lager er nesten klart.",
] as const;

const NOTES = [
  "Tallene stemmer nok.",
  "Tallene stemmer (i snitt).",
  "Tallene stemmer hvis du ikke spør.",
] as const;

export default function LagerDynamicBits() {
  const { mounted, visit, seed } = useVisitVariant("lager");
  const stableSeed = mounted ? seed : 0;

  const banner = pick(BANNERS, stableSeed);
  const note = pick(NOTES, stableSeed >>> 2);
  const stableVisit = mounted ? visit : "—";

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-black/10 bg-neutral-50 px-3 py-2 text-xs font-semibold text-black/80">
      <span className="rounded bg-yellow-300 px-2 py-1 font-black text-black">
        📣 MARKED
      </span>
      <span>{banner}</span>

      <span className="opacity-30">•</span>

      <span className="rounded bg-white px-2 py-1 font-black text-black border border-black/10">
        🧾 REGNSKAP
      </span>
      <span>{note}</span>

      <span className="ml-auto opacity-60">Besøk: {stableVisit}</span>
    </div>
  );
}