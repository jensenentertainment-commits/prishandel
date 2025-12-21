"use client";

import { useMemo } from "react";
import { useVisitVariant } from "@/app/lib/useVisitVariant";
import { pick } from "@/app/lib/visitSeed";

const BANNERS = [
  "📣 Marked: “Lager er et signal.”",
  "📣 Marked: “Lager er en følelse.”",
  "📣 Marked: “Lager er nesten klart.”",
] as const;

const NOTES = [
  "🧾 Regnskap: “Tallene stemmer nok.”",
  "🧾 Regnskap: “Tallene stemmer (i snitt).”",
  "🧾 Regnskap: “Tallene stemmer hvis du ikke spør.”",
] as const;

export default function LagerDynamicBits() {
  const { mounted, visit, seed } = useVisitVariant("lager");

  const banner = useMemo(() => pick(BANNERS, seed), [seed]);
  const note = useMemo(() => pick(NOTES, seed >>> 2), [seed]);

  if (!mounted) return null; // unngå hydration mismatch

  return (
    <div className="mt-2 text-xs font-semibold opacity-70">
      {banner} <span className="opacity-60">•</span> {note}{" "}
      <span className="opacity-60">•</span> Besøk: {visit}
    </div>
  );
}
