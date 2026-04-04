"use client";

import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { voices } from "../lib/voices";
import { Icon } from "./Icon";
import {
  Menu,
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
  { label: "Produkter", href: "/butikk", pill: "bg-red-600 text-white", pillText: "SALG" },
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

const SESSION_KEYS = {
  navSeed: "prh_nav_seed_v3",
  loginPitchBase: "prh_login_pitch_base_v3",
  menuTease: "prh_menu_tease_v3",
} as const;

type Kind = "generic" | "price" | "shipping" | "coupon" | "stock";
type FightItem = { text: string };

function hashString(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function getSessionSeed(key: string) {
  try {
    const existing = sessionStorage.getItem(key);
    if (existing) return existing;

    const seed = String(Math.floor(Math.random() * 1_000_000_000));
    sessionStorage.setItem(key, seed);
    return seed;
  } catch {
    return "0";
  }
}

function sessionIndex(key: string, length: number) {
  const seed = getSessionSeed(key);
  return hashString(seed) % length;
}

function deterministicPick<T>(arr: readonly T[], key: string) {
  return arr[sessionIndex(key, arr.length)];
}

function rotateIndex(base: number, offset: number, length: number) {
  return (base + offset) % length;
}

function fightIconFor(text?: string) {
  const t = (text ?? "").trim();
  if (t.startsWith("🧾")) return Receipt;
  if (t.startsWith("⚡")) return Zap;
  if (t.startsWith("📣")) return Megaphone;
  return Megaphone;
}

function stripLeadEmoji(text?: string) {
  if (!text) return "";
  return text.replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]+\s*/u, "");
}

function buildFightKind(seed: string, tick: number): Kind {
  const kinds: Kind[] = ["generic", "price", "shipping", "coupon", "stock"];
  const idx = hashString(`${seed}:${tick}:fight`) % kinds.length;
  return kinds[idx];
}

function normalizeFight(input: unknown): FightItem[] {
  if (!Array.isArray(input)) {
    return [
      { text: "📣 Marked: Alltid kampanje." },
      { text: "🧾 Regnskap: Alltid bekymret." },
    ];
  }

  const normalized = input
    .map((item) => {
      if (typeof item === "string") return { text: item };
      if (
        item &&
        typeof item === "object" &&
        "text" in item &&
        typeof (item as { text?: unknown }).text === "string"
      ) {
        return { text: (item as { text: string }).text };
      }
      return null;
    })
    .filter((item): item is FightItem => Boolean(item));

  if (normalized.length >= 2) return normalized.slice(0, 2);

  return [
    { text: normalized[0]?.text ?? "📣 Marked: Alltid kampanje." },
    { text: normalized[1]?.text ?? "🧾 Regnskap: Alltid bekymret." },
  ];
}

export default function ShopNavbar() {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const [navQ, setNavQ] = useState("");
  const [navSuggestOpen, setNavSuggestOpen] = useState(false);

  const [navSeed, setNavSeed] = useState("0");
  const [tick, setTick] = useState(0);
  const [loginPitchOffset, setLoginPitchOffset] = useState(0);

  const navWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    setNavSeed(getSessionSeed(SESSION_KEYS.navSeed));
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!navWrapRef.current) return;
      if (!navWrapRef.current.contains(e.target as Node)) {
        setNavSuggestOpen(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLoginOpen(false);
        setMenuOpen(false);
        setNavSuggestOpen(false);
      }
    };

    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!mounted) return;
    const id = window.setInterval(() => {
      setTick((t) => t + 1);
    }, 4500);
    return () => window.clearInterval(id);
  }, [mounted]);

  const fight = useMemo<FightItem[]>(() => {
    if (!mounted) {
      return [
        { text: "📣 Marked: Alltid kampanje." },
        { text: "🧾 Regnskap: Alltid bekymret." },
      ];
    }

    return normalizeFight(voices.duel(buildFightKind(navSeed, tick)));
  }, [mounted, navSeed, tick]);

  const navSuggestions = useMemo(() => {
    const t = navQ.trim().toLowerCase();

    if (t.length === 0) {
      return ["rabatt i teorien", "lager (0)", "midlertidig løsning"];
    }

    if (t.length < 2) return [];

    const matches = NAV_SUGGESTIONS.filter((s) => s.toLowerCase().includes(t));
    const pool = [...NAV_SUGGESTIONS].sort(
      (a, b) => hashString(`${navSeed}:${a}`) - hashString(`${navSeed}:${b}`)
    );

    return [...matches, ...pool.filter((x) => !matches.includes(x))].slice(0, 3);
  }, [navQ, navSeed]);

  const loginPitchBaseIndex = useMemo(
    () => sessionIndex(SESSION_KEYS.loginPitchBase, LOGIN_PITCHES.length),
    []
  );

  const loginPitch = useMemo(() => {
    const idx = rotateIndex(
      loginPitchBaseIndex,
      loginPitchOffset,
      LOGIN_PITCHES.length
    );
    return LOGIN_PITCHES[idx];
  }, [loginPitchBaseIndex, loginPitchOffset]);

  const menuTease = useMemo(
    () => deterministicPick(MENU_SALES, SESSION_KEYS.menuTease),
    []
  );

  function openLogin() {
    setLoginPitchOffset(0);
    setLoginOpen(true);
  }

  function nextLoginPitch() {
    setLoginPitchOffset((prev) => prev + 1);
  }

  function submitSearch(value: string) {
    const q = value.trim();
    if (!q) return;
    window.location.href = `/butikk?q=${encodeURIComponent(q)}`;
  }

  return (
    <div className="sticky top-0 z-[55]">
      <NavFightBar fight={fight} />

      <header className="border-b border-black/10 bg-white text-black">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2">
          <button
            onClick={() => setMenuOpen(true)}
            className="rounded-lg border border-black/20 px-3 py-2 text-sm font-black hover:bg-black/5 md:hidden"
            aria-label="Åpne meny"
            title="Meny"
          >
            <Icon icon={Menu} intent="noted" />
          </button>

          <a href="/" className="group flex shrink-0 items-center gap-2">
            <div className="hidden leading-tight sm:block">
              <img src="/logo.PNG" alt="Prishandel" className="h-8" />
              <div className="-mt-0.5 text-[11px] opacity-70">
                Alltid kampanje • Alltid utsolgt
              </div>
            </div>
          </a>

          <NavSearch
            ref={navWrapRef}
            value={navQ}
            onChange={setNavQ}
            suggestOpen={navSuggestOpen}
            setSuggestOpen={setNavSuggestOpen}
            suggestions={navSuggestions}
            onPick={(s) => {
              setNavQ(s);
              setNavSuggestOpen(false);
              submitSearch(s);
            }}
            onSubmit={() => submitSearch(navQ)}
          />

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={openLogin}
              className="hidden rounded-lg border border-black/20 px-3 py-2 text-sm font-black hover:bg-black/5 sm:inline-flex"
              title="Logg inn"
            >
              Logg inn
            </button>

            <CartNavItem />
          </div>
        </div>

        <NavCategories />
      </header>

      <MobileMenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenLogin={() => {
          setMenuOpen(false);
          openLogin();
        }}
        menuTease={menuTease}
      />

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onNextPitch={nextLoginPitch}
        pitch={loginPitch}
      />
    </div>
  );
}

function NavFightBar(props: { fight: FightItem[] }) {
  const first = props.fight[0] ?? { text: "📣 Marked: Alltid kampanje." };
  const second = props.fight[1] ?? { text: "🧾 Regnskap: Alltid bekymret." };

  return (
    <div className="border-b border-black/10 bg-yellow-300 text-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-1.5">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 truncate text-xs font-black">
            <Icon icon={fightIconFor(first.text)} intent="active" />
            {stripLeadEmoji(first.text)}
          </div>
          <div className="inline-flex items-center gap-2 truncate text-[11px] font-semibold opacity-70">
            <Icon icon={fightIconFor(second.text)} intent="passive" />
            {stripLeadEmoji(second.text)}
          </div>
        </div>

        <a
          href="/kampanjer"
          className="shrink-0 rounded bg-red-600 px-2.5 py-1 text-xs font-black text-white hover:opacity-90"
        >
          KAMPANJER →
        </a>
      </div>
    </div>
  );
}

const NavSearch = forwardRef<
  HTMLDivElement,
  {
    value: string;
    onChange: (value: string) => void;
    suggestOpen: boolean;
    setSuggestOpen: (open: boolean) => void;
    suggestions: string[];
    onPick: (value: string) => void;
    onSubmit: () => void;
  }
>(function NavSearch(
  { value, onChange, suggestOpen, setSuggestOpen, suggestions, onPick, onSubmit },
  ref
) {
  function onKeyDown(e: ReactKeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      setSuggestOpen(false);
      onSubmit();
    }
  }

  return (
    <div ref={ref} className="relative flex-1">
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setSuggestOpen(true);
        }}
        onFocus={() => setSuggestOpen(true)}
        onKeyDown={onKeyDown}
        className="w-full rounded-lg border border-black/15 bg-white py-2 pl-3 pr-16 text-sm font-semibold placeholder:opacity-60"
        placeholder="Søk i butikken…"
      />

      <div className="absolute right-2 top-1.5 flex items-center gap-2">
        <span className="rounded border border-black/10 bg-yellow-300 px-2 py-0.5 text-[10px] font-black">
          -90%*
        </span>
      </div>

      {suggestOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 z-[80] mt-2 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onPick(s)}
              className="block w-full px-4 py-2 text-left text-sm font-semibold hover:bg-black/5"
            >
              {s}
            </button>
          ))}
          <div className="border-t border-black/10 px-4 py-2 text-[11px] font-semibold opacity-50">
            Forslag generert av systemet
          </div>
        </div>
      )}
    </div>
  );
});

function NavCategories() {
  return (
    <div className="border-t border-black/10 bg-neutral-50">
      <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-2">
        {CATS.map((c) => (
          <a
            key={c.href}
            href={c.href}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm font-black hover:bg-black/5"
          >
            <span>{c.label}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-black ${c.pill}`}
            >
              {c.pillText}
            </span>
          </a>
        ))}

        <div className="ml-auto hidden items-center gap-2 text-xs font-semibold opacity-80 md:flex">
          <span className="inline-flex items-center gap-1.5 rounded border border-black/10 bg-white px-2 py-1">
            <Icon icon={Truck} intent="passive" />
            Gratis frakt*
          </span>
          <span className="inline-flex items-center gap-1.5 rounded border border-black/10 bg-white px-2 py-1">
            <Icon icon={CreditCard} intent="passive" />
            Vipps/Klarna*
          </span>
          <span className="inline-flex items-center gap-1.5 rounded border border-black/10 bg-white px-2 py-1">
            <Icon icon={Receipt} intent="passive" />
            Prisgaranti*
          </span>
        </div>
      </div>
    </div>
  );
}

function MobileMenuDrawer(props: {
  open: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
  menuTease: string;
}) {
  if (!props.open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        className="absolute inset-0 bg-black/40"
        onClick={props.onClose}
        aria-label="Lukk meny"
      />

      <aside className="absolute left-0 top-0 h-full w-[320px] max-w-[86vw] border-r border-black/10 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-black/10 px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-red-600 font-black text-white">
              P
            </div>
            <div className="leading-tight">
              <div className="font-black">Meny</div>
              <div className="text-[11px] opacity-70">Baconburger-utgave</div>
            </div>
          </div>

          <button
            onClick={props.onClose}
            className="rounded-lg border border-black/20 px-3 py-2 text-sm font-black hover:bg-black/5"
          >
            Lukk
          </button>
        </div>

        <div className="space-y-3 px-4 py-4">
          <div className="rounded-xl border border-black/10 bg-yellow-300 p-4">
            <div className="inline-block rounded bg-black px-2 py-1 text-xs font-black text-yellow-300">
              KAMPANJE
            </div>
            <div className="mt-2 font-black">{props.menuTease}</div>
            <div className="mt-1 text-xs font-semibold opacity-80">
              Slutter snart* • låst per økt
            </div>
            <div className="mt-3 flex gap-2">
              <a
                href="/kampanjer"
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-black text-white hover:opacity-90"
                onClick={props.onClose}
              >
                Se kampanjer →
              </a>
              <a
                href="/butikk"
                className="rounded-lg border border-black/20 bg-white px-4 py-2 text-sm font-black text-black hover:bg-black/5"
                onClick={props.onClose}
              >
                Produkter
              </a>
            </div>
          </div>

          <div className="space-y-2">
            {CATS.map((c) => (
              <a
                key={c.href}
                href={c.href}
                onClick={props.onClose}
                className="flex items-center justify-between rounded-xl border border-black/10 bg-white px-4 py-3 font-black hover:bg-black/5"
              >
                <span>{c.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-black ${c.pill}`}
                >
                  {c.pillText}
                </span>
              </a>
            ))}
          </div>

          <div className="rounded-xl border border-black/10 bg-neutral-50 p-4">
            <div className="font-black">Konto</div>
            <p className="mt-1 text-sm opacity-80">
              Innlogging er midlertidig utsolgt, men vi kan late som.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={props.onOpenLogin}
                className="rounded-lg bg-black px-4 py-2 text-sm font-black text-white hover:opacity-90"
              >
                Logg inn
              </button>
              <a
                href="/utsolgt"
                onClick={props.onClose}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-black text-white hover:opacity-90"
              >
                Kurv (0)
              </a>
            </div>
            <div className="mt-2 text-xs opacity-60">
              *konto kan avvike fra virkeligheten.
            </div>
          </div>

          <div className="flex flex-col gap-1 text-xs opacity-60">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5">
                <Icon icon={Truck} intent="passive" /> Gratis frakt*
              </span>
              <span className="opacity-60">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Icon icon={CreditCard} intent="passive" /> Vipps/Klarna*
              </span>
              <span className="opacity-60">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Icon icon={Receipt} intent="passive" /> Prisgaranti*
              </span>
            </div>
            <div>*gjelder der det passer oss</div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function LoginModal(props: {
  open: boolean;
  onClose: () => void;
  onNextPitch: () => void;
  pitch: (typeof LOGIN_PITCHES)[number];
}) {
  if (!props.open) return null;

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center p-4">
      <button
        className="absolute inset-0 bg-black/40"
        onClick={props.onClose}
        aria-label="Lukk"
      />

      <div className="relative w-[520px] max-w-[96vw] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-3 bg-red-600 px-5 py-4 text-white">
          <div>
            <div className="font-black leading-tight">Logg inn</div>
            <div className="text-xs opacity-90">
              Autentisering: midlertidig utsolgt
            </div>
          </div>
          <span className="rounded bg-white/15 px-2 py-1 text-xs font-black">
            {props.pitch.badge}
          </span>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <div className="text-xl font-black">{props.pitch.title}</div>
            <div className="mt-1 text-sm opacity-80">{props.pitch.body}</div>
          </div>

          <div className="rounded-xl border border-black/10 bg-neutral-50 p-4">
            <div className="text-sm font-black">Innlogging (demo)</div>
            <div className="mt-3 grid gap-2">
              <input
                disabled
                className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm opacity-60"
                placeholder="E-post"
              />
              <input
                disabled
                className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm opacity-60"
                placeholder="Passord"
              />
              <button
                disabled
                className="cursor-not-allowed rounded-lg bg-black py-3 font-black text-white opacity-40"
              >
                LOGG INN (UTSOLGT)
              </button>
            </div>
            <div className="mt-2 text-xs opacity-60">
              Ved å logge inn godtar du at alt kan være utsolgt.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={props.pitch.href}
              className="rounded-lg bg-red-600 px-5 py-3 font-black text-white hover:opacity-90"
            >
              {props.pitch.cta}
            </a>
            <button
              onClick={props.onNextPitch}
              className="rounded-lg border border-black/20 bg-white px-5 py-3 font-black text-black hover:bg-black/5"
            >
              Ny forklaring
            </button>
            <button
              onClick={props.onClose}
              className="rounded-lg border border-black/20 bg-white px-5 py-3 font-black text-black hover:bg-black/5"
            >
              Lukk
            </button>
          </div>

          <div className="text-xs opacity-60">
            *Innlogging kan avvike fra virkeligheten.
          </div>
        </div>
      </div>
    </div>
  );
}