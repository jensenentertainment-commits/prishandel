"use client";

import { useEffect, useState } from "react";

const SLIDES = [
  {
    kicker: "12 personer ser på “Verdighet” akkurat nå*",
    title: "Vi selger varer så billig at regnskapsføreren fikk hjerteinfarkt",
    body: "Kontinuerlig prispress. Aggressive kampanjer. Null lager.",
    highlight: "Alt må vekk.",
  },
  {
    kicker: "Markedet melder: “snart på lager”*",
    title: "Snart på lager. Tomme løfter.",
    body: "Vi jobber hardt med å skaffe varer vi aldri har hatt.",
    highlight: "Takk for tålmodigheten.",
  },
  {
    kicker: "Regnskap: “ikke skriv dette”",
    title: "Alt er på tilbud. Ingenting er tilgjengelig.",
    body: "Vi kaller det balanse. Regnskap kaller det panikk.",
    highlight: "Begge har rett.",
  },
  {
    kicker: "Nyhet i butikken: Vær (beta)",
    title: "Bestill vær i dag.",
    body: "Velg mellom sol, regn og “ustabilt”. Leveringstid:",
    highlight: "ubestemt.",
  },
];

function useHero() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(t);
  }, []);

  return SLIDES[idx];
}

export function HeroKicker() {
  const s = useHero();
  return <span className="text-sm font-semibold">{s.kicker}</span>;
}

export function HeroCopy() {
  const s = useHero();
  return (
    <>
      <h1 className="text-4xl md:text-5xl font-black leading-tight">
        {s.title}
      </h1>

      <p className="text-lg font-medium opacity-80">
        {s.body} <span className="font-bold">{s.highlight}</span>
      </p>
    </>
  );
}
