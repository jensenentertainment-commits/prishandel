"use client";

import { useEffect, useMemo, useRef,useState } from "react";
import { voices } from "../lib/voices";
import { Icon } from "./Icon";
import {
  Menu,
  ShoppingCart,
  Truck,
  CreditCard,
  Receipt,
  Megaphone,
  Zap,
} from "lucide-react";
import CartNavItem from "./cart/CartNavItem";

const NAV_SUGGESTIONS = [
  "rabatt i teorien",
  "midlertidig løsning",
  "uavklart behov",
  "systemavvik",
  "lager (0)",
  "administrativ ro",
  "mild panikk",
  "kritisk bagatell",
  "forventningsbrudd",
  "påvirker systemet",
  "dokumentasjon (vagt)",
  "avventer vurdering",
  "ikke relevant",
] as const;

const NAV_SEARCH_SEED_KEY = "prh_nav_search_seed_v1";

function getSessionSeed(key: string) {
  try {
    const existing = sessionStorage.getItem(key);
    if (existing) return existing;
    const seed = String(Math.floor(Math.random() * 1_000_000_000));
    sessionStorage.setItem(key, seed);
    return seed;
  } catch {
    return String(Math.floor(Math.random() * 1_000_000_000));
  }
}

function hash(seed: string, s: string) {
  let h = 2166136261;
  const str = `${seed}:${s}`;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}


function fightIconFor(text?: string) {
  if (!text) return Megaphone;
  if (text.trim().startsWith("🧾")) return Receipt;
  if (text.trim().startsWith("⚡")) return Zap;
  return Megaphone;
}

function pick<T>(arr: readonly T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}


const LOGIN_PITCHES = [
  {
    title: "Innlogging er midlertidig utsolgt",
    body: "Men kampanjene er i full drift. Du trenger ikke konto for å bli fristet.",
    cta: "Se kampanjer →",
    href: "/kampanjer",
    badge: "UTSOLGT",
  },
  {
    title: "Logg inn (teoretisk)",
    body: "Systemet vurderer innlogging. Markedsavdelingen vurderer flere tilbud.",
    cta: "Se tilbud →",
    href: "/butikk",
    badge: "PÅGÅR",
  },
  {
    title: "Konto? Vi har kampanje",
    body: "Opprett konto for å få fordeler du allerede har. (Mentalt.)",
    cta: "Døgnets deals →",
    href: "/kampanjer",
    badge: "KUPP",
  },
  {
    title: "Tilkobling mislyktes (praktisk)",
    body: "Prøv igjen, eller gå direkte til noe som er utsolgt med én gang.",
    cta: "Utsolgt →",
    href: "/utsolgt",
    badge: "0 LAGER",
  },
] as const;

const CATS = [
  { label: "Butikk", href: "/butikk", pill: "bg-red-600 text-white", pillText: "SALG" },
  { label: "Kampanjer", href: "/kampanjer", pill: "bg-yellow-300 text-black", pillText: "NY" },
  { label: "Utsolgt", href: "/utsolgt", pill: "bg-black text-white", pillText: "100%" },
  { label: "Regnskapsfører", href: "/regnskapsforer", pill: "bg-green-600 text-white", pillText: "LIVE" },
] as const;

const MENU_SALES = [
  "Alt må vekk (inkl. marginene)",
  "Black Week (forlenget igjen)",
  "Medlemspris (uten medlemskap)",
  "Restlager-salg (uten restlager)",
] as const;

type Kind = "generic" | "price" | "shipping" | "coupon" | "stock";

export default function ShopNavbar() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [pitchIdx, setPitchIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
const [navQ, setNavQ] = useState("");
const [navSuggestOpen, setNavSuggestOpen] = useState(false);
const [navSeed, setNavSeed] = useState("0");
const navWrapRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  // seed kun på klient
  setNavSeed(getSessionSeed(NAV_SEARCH_SEED_KEY));
}, []);

useEffect(() => {
  const onDown = (e: MouseEvent) => {
    if (!navWrapRef.current) return;
    if (!navWrapRef.current.contains(e.target as Node)) setNavSuggestOpen(false);
  };
  window.addEventListener("mousedown", onDown);
  return () => window.removeEventListener("mousedown", onDown);
}, []);

useEffect(() => {
  setMounted(true);
}, []);

const navSuggestions = useMemo(() => {
  const t = navQ.trim().toLowerCase();

  // helt “system”: når feltet er tomt, vis tre forslag likevel
  if (t.length === 0) {
    return ["rabatt i teorien", "lager (0)", "midlertidig løsning"];
  }

  if (t.length < 2) return [];

  const matches = NAV_SUGGESTIONS.filter((s) => s.toLowerCase().includes(t));

  // hvis lite match: bruk deterministisk “absurd” sortering
  const pool = [...NAV_SUGGESTIONS].sort(
    (a, b) => hash(navSeed, a) - hash(navSeed, b),
  );

  const combined = [...matches, ...pool.filter((x) => !matches.includes(x))];
  return combined.slice(0, 3);
}, [navQ, navSeed]);

// fight ticker
const [kind, setKind] = useState<Kind>("generic");

// før mount: alltid generic (stabil SSR/hydration)
// etter mount: voices.duel(kind) roterer som før
const fight = useMemo(() => {
  return voices.duel(mounted ? kind : "generic");
}, [kind, mounted]);

// menuTease: før mount, ikke random
type MenuSale = (typeof MENU_SALES)[number];
const [menuTease, setMenuTease] = useState<MenuSale>(MENU_SALES[0]);


const pitch = useMemo(() => LOGIN_PITCHES[pitchIdx], [pitchIdx]);
useEffect(() => {
  if (!mounted) return;
  if (!menuOpen) return;
  setMenuTease(pick(MENU_SALES));
}, [menuOpen, mounted]);

useEffect(() => {
  if (!mounted) return;

  const kinds: Kind[] = ["generic", "price", "shipping", "coupon", "stock"];
  const id = setInterval(() => {
    setKind(pick(kinds));
  }, 4500);

  return () => clearInterval(id);
}, [mounted]);

  // esc closes
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
  setLoginOpen(false);
  setMenuOpen(false);
  setNavSuggestOpen(false);
}
    }
    setNavSuggestOpen(false);

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // lock scroll when menu open
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  function openLogin() {
    setPitchIdx(Math.floor(Math.random() * LOGIN_PITCHES.length));
    setLoginOpen(true);
  }
// ✅ PUNKT 6: helpers til fight ticker (legg disse her)
function fightIconFor(text?: string) {
  const t = (text ?? "").trim();
  if (t.startsWith("🧾")) return Receipt;
  if (t.startsWith("⚡")) return Zap;
  if (t.startsWith("📣")) return Megaphone;
  // fallback
  return Megaphone;
}

function stripLeadEmoji(text?: string) {
  if (!text) return "";
  return text.replace(
    /^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]+\s*/u,
    "",
  );
}
  return (
    <div className="sticky top-0 z-[55]">
      {/* TOPBAR over navbar (fight) */}
      <div className="bg-yellow-300 text-black border-b border-black/10">
        <div className="max-w-6xl mx-auto px-4 py-1.5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-black truncate inline-flex items-center gap-2">
  <Icon icon={fightIconFor(fight[0]?.text)} tone="strong" />
  {stripLeadEmoji(fight[0]?.text)}
</div>
<div className="text-[11px] font-semibold opacity-70 truncate inline-flex items-center gap-2">
  <Icon icon={fightIconFor(fight[1]?.text)} tone="muted" />
  {stripLeadEmoji(fight[1]?.text)}
</div>

          </div>

          <a
            href="/kampanjer"
            className="shrink-0 rounded bg-red-600 text-white px-2.5 py-1 text-xs font-black hover:opacity-90"
          >
            KAMPANJER →
          </a>
        </div>
      </div>

      <header className="bg-white text-black border-b border-black/10">
        {/* Main row */}
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-2">
          {/* baconburger (mobile) */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden rounded-lg border border-black/20 px-3 py-2 text-sm font-black hover:bg-black/5"
            aria-label="Åpne meny"
            title="Meny"
          >
            <Icon icon={Menu} className="opacity-70" />
          </button>

          {/* logo */}
          <a href="/" className="flex items-center gap-2 shrink-0 group">
            
            <div className="leading-tight hidden sm:block">
              <img src="/logo.svg" alt="Prishandel" className="h-8" />

              <div className="text-[11px] opacity-70 -mt-0.5">Alltid kampanje • Alltid utsolgt</div>
            </div>
          </a>

          {/* search */}
<div ref={navWrapRef} className="flex-1 relative">
  <input
    value={navQ}
    onChange={(e) => {
      setNavQ(e.target.value);
      setNavSuggestOpen(true);
    }}
    onFocus={() => setNavSuggestOpen(true)}
    className="w-full rounded-lg border border-black/15 bg-white pl-3 pr-16 py-2 text-sm font-semibold placeholder:opacity-60"
    placeholder="Søk i butikken…"
  />

  <div className="absolute right-2 top-1.5 flex items-center gap-2">
    <span className="text-[10px] font-black rounded bg-yellow-300 px-2 py-0.5 border border-black/10">
      -90%*
    </span>
  </div>

  {navSuggestOpen && navSuggestions.length > 0 && (
    <div className="absolute left-0 right-0 mt-2 rounded-xl border border-black/10 bg-white shadow-sm overflow-hidden z-[80]">
      {navSuggestions.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => {
            setNavQ(s);
            setNavSuggestOpen(false);

            // Valgfritt (hvis du vil): send til butikk med query
            // window.location.href = `/butikk?q=${encodeURIComponent(s)}`;
          }}
          className="block w-full text-left px-4 py-2 text-sm font-semibold hover:bg-black/5"
        >
          {s}
        </button>
      ))}
      <div className="px-4 py-2 text-[11px] font-semibold opacity-50 border-t border-black/10">
        Forslag generert av systemet
      </div>
    </div>
  )}
</div>


          {/* actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={openLogin}
              className="hidden sm:inline-flex rounded-lg border border-black/20 px-3 py-2 text-sm font-black hover:bg-black/5"
              title="Logg inn"
            >
              Logg inn
            </button>

           <CartNavItem />
          </div>
        </div>

        {/* category chips */}
        <div className="bg-neutral-50 border-t border-black/10">
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-2 overflow-x-auto">
            {CATS.map((c) => (
              <a
                key={c.href}
                href={c.href}
                className="shrink-0 inline-flex items-center gap-2 rounded-full bg-white border border-black/10 px-3 py-1.5 text-sm font-black hover:bg-black/5"
              >
                <span>{c.label}</span>
                <span className={`text-[10px] rounded-full px-2 py-0.5 font-black ${c.pill}`}>
                  {c.pillText}
                </span>
              </a>
            ))}

            <div className="shrink-0 ml-auto hidden md:flex items-center gap-2 text-xs font-semibold opacity-80">
              <span className="rounded bg-white border border-black/10 px-2 py-1 inline-flex items-center gap-1.5">
  <Icon icon={Truck} />
  Gratis frakt*
</span>
<span className="rounded bg-white border border-black/10 px-2 py-1 inline-flex items-center gap-1.5">
  <Icon icon={CreditCard} />
  Vipps/Klarna*
</span>
<span className="rounded bg-white border border-black/10 px-2 py-1 inline-flex items-center gap-1.5">
  <Icon icon={Receipt} />
  Prisgaranti*
</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[80]">
          <button
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
            aria-label="Lukk meny"
          />

          <aside className="absolute left-0 top-0 h-full w-[320px] max-w-[86vw] bg-white border-r border-black/10 shadow-2xl">
            <div className="px-4 py-4 border-b border-black/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-red-600 text-white grid place-items-center font-black">
                  P
                </div>
                <div className="leading-tight">
                  <div className="font-black">Meny</div>
                  <div className="text-[11px] opacity-70">Baconburger-utgave</div>
                </div>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="rounded-lg border border-black/20 px-3 py-2 text-sm font-black hover:bg-black/5"
              >
                Lukk
              </button>
            </div>

            <div className="px-4 py-4 space-y-3">
              <div className="rounded-xl bg-yellow-300 border border-black/10 p-4">
                <div className="text-xs font-black rounded bg-black text-yellow-300 px-2 py-1 inline-block">
                  KAMPANJE
                </div>
                <div className="mt-2 font-black">{menuTease}</div>
                <div className="mt-1 text-xs font-semibold opacity-80">
                  Slutter snart* • resettes ved refresh
                </div>
                <div className="mt-3 flex gap-2">
                  <a
                    href="/kampanjer"
                    className="rounded-lg bg-red-600 text-white px-4 py-2 text-sm font-black hover:opacity-90"
                    onClick={() => setMenuOpen(false)}
                  >
                    Se kampanjer →
                  </a>
                  <a
                    href="/butikk"
                    className="rounded-lg bg-white text-black px-4 py-2 text-sm font-black border border-black/20 hover:bg-black/5"
                    onClick={() => setMenuOpen(false)}
                  >
                    Butikk
                  </a>
                </div>
              </div>

              <div className="space-y-2">
                {CATS.map((c) => (
                  <a
                    key={c.href}
                    href={c.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl bg-white border border-black/10 px-4 py-3 font-black hover:bg-black/5"
                  >
                    <span>{c.label}</span>
                    <span className={`text-[10px] rounded-full px-2 py-0.5 font-black ${c.pill}`}>
                      {c.pillText}
                    </span>
                  </a>
                ))}
              </div>

              <div className="rounded-xl bg-neutral-50 border border-black/10 p-4">
                <div className="font-black">Konto</div>
                <p className="mt-1 text-sm opacity-80">
                  Innlogging er midlertidig utsolgt, men vi kan late som.
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      openLogin();
                    }}
                    className="rounded-lg bg-black text-white px-4 py-2 text-sm font-black hover:opacity-90"
                  >
                    Logg inn
                  </button>
                  <a
                    href="/utsolgt"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg bg-green-600 text-white px-4 py-2 text-sm font-black hover:opacity-90"
                  >
                    Kurv (0)
                  </a>
                </div>
                <div className="mt-2 text-xs opacity-60">
                  *konto kan avvike fra virkeligheten.
                </div>
              </div>

             <div className="text-xs opacity-60 flex flex-col gap-1">
  <div className="flex flex-wrap items-center gap-2">
    <span className="inline-flex items-center gap-1.5">
      <Icon icon={Truck} /> Gratis frakt*
    </span>
    <span className="opacity-60">•</span>
    <span className="inline-flex items-center gap-1.5">
      <Icon icon={CreditCard} /> Vipps/Klarna*
    </span>
    <span className="opacity-60">•</span>
    <span className="inline-flex items-center gap-1.5">
      <Icon icon={Receipt} /> Prisgaranti*
    </span>
  </div>
  <div>*gjelder der det passer oss</div>
</div>

            </div>
          </aside>
        </div>
      )}

      {/* Login modal */}
      {loginOpen && (
        <div className="fixed inset-0 z-[90] grid place-items-center p-4">
          <button className="absolute inset-0 bg-black/40" onClick={() => setLoginOpen(false)} aria-label="Lukk" />
          <div className="relative w-[520px] max-w-[96vw] rounded-2xl bg-white border border-black/10 shadow-2xl overflow-hidden">
            <div className="bg-red-600 text-white px-5 py-4 flex items-center justify-between gap-3">
              <div>
                <div className="font-black leading-tight">Logg inn</div>
                <div className="text-xs opacity-90">Autentisering: midlertidig utsolgt</div>
              </div>
              <span className="text-xs font-black rounded bg-white/15 px-2 py-1">{pitch.badge}</span>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <div className="text-xl font-black">{pitch.title}</div>
                <div className="mt-1 text-sm opacity-80">{pitch.body}</div>
              </div>

              <div className="rounded-xl bg-neutral-50 border border-black/10 p-4">
                <div className="text-sm font-black">Innlogging (demo)</div>
                <div className="mt-3 grid gap-2">
                  <input disabled className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm opacity-60" placeholder="E-post" />
                  <input disabled className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm opacity-60" placeholder="Passord" />
                  <button disabled className="rounded-lg bg-black text-white py-3 font-black opacity-40 cursor-not-allowed">
                    LOGG INN (UTSOLGT)
                  </button>
                </div>
                <div className="mt-2 text-xs opacity-60">Ved å logge inn godtar du at alt kan være utsolgt.</div>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <a href={pitch.href} className="rounded-lg bg-red-600 text-white px-5 py-3 font-black hover:opacity-90">
                  {pitch.cta}
                </a>
                <button
                  onClick={() => setPitchIdx((i) => (i + 1) % LOGIN_PITCHES.length)}
                  className="rounded-lg bg-white text-black px-5 py-3 font-black border border-black/20 hover:bg-black/5"
                >
                  Ny forklaring
                </button>
                <button
                  onClick={() => setLoginOpen(false)}
                  className="rounded-lg bg-white text-black px-5 py-3 font-black border border-black/20 hover:bg-black/5"
                >
                  Lukk
                </button>
              </div>

              <div className="text-xs opacity-60">*Innlogging kan avvike fra virkeligheten.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
