"use client";

import { useEffect, useMemo, useState } from "react";
import { getVisitNumber, h32 } from "./visitSeed";

export function useVisitVariant(pageKey: string) {
  const [mounted, setMounted] = useState(false);
  const [visit, setVisit] = useState(1);

  useEffect(() => {
    setMounted(true);
    setVisit(getVisitNumber(`prh_visit_${pageKey}`));
  }, [pageKey]);

  const seed = useMemo(() => h32(`${pageKey}:${visit}`), [pageKey, visit]);

  return { mounted, visit, seed };
}
