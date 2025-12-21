"use client";

import { useEffect, useMemo, useState } from "react";

type State = {
  n: number;
  t: number; // last update timestamp
  freezeUntil?: number;
};

const KEY = "prh_visitors_now_v1";

function clamp(n: number) {
  return Math.max(7, Math.min(9999, Math.floor(n)));
}

function load(): State | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as State;
    if (typeof s?.n !== "number") return null;
    if (typeof s?.t !== "number") return null;
    return s;
  } catch {
    return null;
  }
}

function save(s: State) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // silent
  }
}

function seedBase() {
  // “ser ut som ekte trafikk”, men er bare estetikk
  const d = new Date();
  const h = d.getHours(); // 0-23
  const weekday = d.getDay(); // 0 søn - 6 lør

  let base = 180;

  // litt døgnrytme
  if (h >= 0 && h <= 5) base -= 60;
  if (h >= 6 && h <= 9) base += 40;
  if (h >= 10 && h <= 14) base += 120;
  if (h >= 15 && h <= 19) base += 80;
  if (h >= 20 && h <= 23) base += 30;

  // helg litt “rarere”
  if (weekday === 0) base += 90; // søndag
  if (weekday === 6) base += 50; // lørdag

  // litt støy
  base += Math.floor(Math.random() * 80) - 40;

  return clamp(base);
}

function nextValue(prev: State): State {
  const now = Date.now();

  // noen ganger “henger systemet”
  if (prev.freezeUntil && now < prev.freezeUntil) {
    return { ...prev, t: now };
  }

  const roll = Math.random();

  // 7%: frys i 8–25 sek
  if (roll < 0.07) {
    return {
      ...prev,
      t: now,
      freezeUntil: now + (8000 + Math.floor(Math.random() * 17000)),
    };
  }

  // 5%: stor feil/hopp
  if (roll < 0.12) {
    const big = prev.n + (Math.random() < 0.5 ? -1 : 1) * (120 + Math.floor(Math.random() * 700));
    return { n: clamp(big), t: now };
  }

  // ellers: små naturlige bevegelser
  const drift = Math.floor(Math.random() * 9) - 4; // -4..+4
  const wobble = Math.random() < 0.2 ? (Math.random() < 0.5 ? -12 : 12) : 0;

  return { n: clamp(prev.n + drift + wobble), t: now };
}

export default function VisitorsNow(props: { className?: string }) {
  const [n, setN] = useState<number>(0);

  const initial = useMemo(() => seedBase(), []);

  useEffect(() => {
    const existing = load();
    if (existing) {
      setN(existing.n);
      return;
    }
    const s: State = { n: initial, t: Date.now() };
    save(s);
    setN(s.n);
  }, [initial]);

  useEffect(() => {
    const tick = () => {
      const s = load() ?? { n: initial, t: Date.now() };
      const next = nextValue(s);
      save(next);
      setN(next.n);
    };

    // “uformell” rytme
    const ms = () => 5000 + Math.floor(Math.random() * 9000); // 5–14s

    let timer: any = null;
    const schedule = () => {
      timer = setTimeout(() => {
        tick();
        schedule();
      }, ms());
    };

    schedule();
    return () => timer && clearTimeout(timer);
  }, [initial]);

  return (
    <div className={props.className}>
      <div className="text-[11px] font-semibold opacity-60">Besøkende akkurat nå</div>
      <div className="text-sm font-black tabular-nums">{n}</div>
    </div>
  );
}
