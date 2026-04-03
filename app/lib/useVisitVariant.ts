"use client";

import { useEffect, useState } from "react";
import { bumpVisitNumber, h32 } from "./visitSeed";

function normalizeKey(key: string) {
  return key.toLowerCase().trim();
}

export function useVisitVariant(pageKey: string) {
  const key = normalizeKey(pageKey);

  const [visit, setVisit] = useState<number | null>(null);

  useEffect(() => {
    setVisit(bumpVisitNumber(`prh_visit_${key}`));
  }, [key]);

  const seed = visit === null ? 0 : h32(`${key}:${visit}`);

  return {
    mounted: visit !== null,
    visit: visit ?? 1,
    seed,
  };
}