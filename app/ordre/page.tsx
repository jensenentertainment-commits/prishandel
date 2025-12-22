// app/ordre/page.tsx
import Link from "next/link";

type Row = {
  id: string;
  status: string;
  handler: string;
  payment: string;
  delivery: string;
  severity: string;
  bucket: string;
};

function slugify(s: string) {
  return (s ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/(^-|-$)/g, "");
}

function deriveRows(): Row[] {
  // Statisk “register”: ingen random, ingen tid.
  // Føles som data, men er bare et lukket rom.
  const base = [
    { id: "PRH-1047", outcome: "normal" },
    { id: "PRH-1182", outcome: "normal" },
    { id: "PRH-1311", outcome: "systemfeil" },
    { id: "PRH-1460", outcome: "normal" },
    { id: "PRH-1599", outcome: "normal" },
    { id: "PRH-1703", outcome: "systemfeil" },
    { id: "PRH-1844", outcome: "normal" },
    { id: "PRH-1980", outcome: "normal" },
    { id: "PRH-2056", outcome: "normal" },
    { id: "PRH-2199", outcome: "systemfeil" },
    { id: "PRH-2331", outcome: "normal" },
    { id: "PRH-2470", outcome: "normal" },
  ];

  return base.map((b, idx) => {
    const payment =
      b.outcome === "systemfeil"
        ? "Avvist av mellomlag (midlertidig)"
        : "Godkjent i teorien";

    const status =
      b.outcome === "systemfeil"
        ? "Avventer manuell tolkning"
        : "Behandles (mentalt)";

    const delivery =
      idx % 3 === 0
        ? "Ubestemt"
        : idx % 3 === 1
          ? "Under vurdering"
          : "Avklart tidligere";

    const handler =
      idx % 4 === 0
        ? "Markedsavdelingen"
        : idx % 4 === 1
          ? "Regnskap"
          : idx % 4 === 2
            ? "Kundeservice"
            : "Virkeligheten";

    const severity =
      b.outcome === "systemfeil"
        ? "Betydelig"
        : idx % 5 === 0
          ? "Moderat"
          : "Lav";

    const bucket =
      idx % 4 === 0
        ? "Midlertidig"
        : idx % 4 === 1
          ? "Under vurdering"
          : idx % 4 === 2
            ? "Avklart tidligere"
            : "Uavklart";

    return {
      id: b.id,
      status,
      handler,
      payment,
      delivery,
      severity,
      bucket,
    };
  });
}

function applyFilters(rows: Row[], sp?: Record<string, string | string[] | undefined>) {
  const get = (k: string) => {
    const v = sp?.[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const q = (get("q") ?? "").trim().toLowerCase();
  const bucket = (get("bucket") ?? "").trim().toLowerCase();
  const severity = (get("severity") ?? "").trim().toLowerCase();
  const status = (get("status") ?? "").trim().toLowerCase();

  return rows.filter((r) => {
    if (q) {
      const hay = `${r.id} ${r.status} ${r.handler} ${r.payment} ${r.delivery} ${r.bucket} ${r.severity}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (bucket && r.bucket.toLowerCase() !== bucket) return false;
    if (severity && r.severity.toLowerCase() !== severity) return false;
    if (status && r.status.toLowerCase() !== status) return false;
    return true;
  });
}

function buildHref(current: Record<string, string>, patch: Record<string, string | undefined>) {
  const next = { ...current, ...patch };
  // fjern tomme
  Object.keys(next).forEach((k) => {
    if (!next[k]) delete next[k];
  });
  const usp = new URLSearchParams(next);
  const qs = usp.toString();
  return qs ? `/ordre?${qs}` : `/ordre`;
}

export default async function OrdersIndexPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = searchParams ? await searchParams : undefined;

  const rows = deriveRows();
  const filtered = applyFilters(rows, sp);

  const get = (k: string) => {
    const v = sp?.[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const current = {
    q: (get("q") ?? "").toString(),
    bucket: (get("bucket") ?? "").toString(),
    severity: (get("severity") ?? "").toString(),
    status: (get("status") ?? "").toString(),
  };

  const buckets = ["", "Midlertidig", "Under vurdering", "Avklart tidligere", "Uavklart"];
  const severities = ["", "Lav", "Moderat", "Betydelig"];
  const statuses = ["", "Behandles (mentalt)", "Avventer manuell tolkning"];

  return (
    <main className="max-w-5xl mx-auto px-4 py-16">
      <div className="rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="bg-black text-yellow-300 px-6 py-5">
          <div className="text-xs font-black uppercase tracking-wide">
            Ordreoversikt (intern visning)
          </div>
          <h1 className="mt-1 text-2xl font-black text-white">Register</h1>
          <div className="mt-1 text-sm text-white/80">
            Oversikten kan avvike fra faktiske forhold. Begge anses gyldige.
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">
          {/* FILTERS */}
          <div className="rounded-xl border border-black/10 bg-white p-4">
            <div className="font-black">Filtre</div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <div className="text-xs font-semibold opacity-60">Søk</div>
                <div className="mt-1 flex gap-2">
                  <Link
                    href={buildHref(current, { q: "prh" })}
                    className="text-sm font-black underline decoration-black/30 hover:decoration-black"
                  >
                    PRH
                  </Link>
                  <Link
                    href={buildHref(current, { q: "vurdering" })}
                    className="text-sm font-black underline decoration-black/30 hover:decoration-black"
                  >
                    vurdering
                  </Link>
                  <Link
                    href={buildHref(current, { q: "virkeligheten" })}
                    className="text-sm font-black underline decoration-black/30 hover:decoration-black"
                  >
                    virkeligheten
                  </Link>
                </div>
                <div className="mt-2 text-xs opacity-60">
                  Manuell inntasting er tilgjengelig ved behov.
                </div>
              </div>

              <FilterGroup
                title="Kategori"
                current={current}
                keyName="bucket"
                values={buckets}
              />
              <FilterGroup
                title="Alvor"
                current={current}
                keyName="severity"
                values={severities}
              />
              <FilterGroup
                title="Status"
                current={current}
                keyName="status"
                values={statuses}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/ordre"
                className="rounded-lg bg-white text-black px-4 py-2 font-black border border-black/20 hover:bg-black/5"
              >
                Nullstill filtre
              </Link>
              <Link
                href={buildHref(current, { q: current.q || "PRH" })}
                className="rounded-lg bg-black text-white px-4 py-2 font-black hover:opacity-90"
              >
                Bruk filtrering →
              </Link>
              <Link
                href="/kundeservice"
                className="rounded-lg bg-red-600 text-white px-4 py-2 font-black hover:opacity-90"
              >
                Eskaler til kundeservice →
              </Link>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Kpi title="Saker" value={`${filtered.length}`} note="Synlige" />
            <Kpi title="Avvik" value="2" note="Pågående" />
            <Kpi title="Behandling" value="Moderat" note="Antatt" />
            <Kpi title="Integritet" value="0,91" note="Indeks" />
          </div>

          {/* TABLE */}
          <div className="rounded-xl border border-black/10 overflow-hidden">
            <div className="bg-black/5 px-4 py-3 flex items-center justify-between">
              <div className="font-black">Saker</div>
              <div className="text-xs font-semibold opacity-60">
                Viser {filtered.length} av {rows.length}
              </div>
            </div>

            <div className="divide-y divide-black/10">
              {filtered.map((r) => (
                <div key={r.id} className="px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[11px] font-black rounded px-2 py-1 ${badgeFor(r.bucket)}`}>
                        {r.bucket}
                      </span>
                      <div className="font-black">
                        <Link
                          href={`/ordre/${encodeURIComponent(r.id)}?from=register&items=1&total=0&code=ikke-utstedt&outcome=${r.payment.includes("Avvist") ? "systemfeil" : "ok"}`}
                          className="underline decoration-black/20 hover:decoration-black"
                        >
                          {r.id}
                        </Link>
                      </div>
                      <span className="text-xs font-semibold opacity-60">
                        {r.severity}
                      </span>
                    </div>
                    <div className="mt-1 text-xs opacity-70">
                      Status: <span className="font-semibold">{r.status}</span> • Behandles av:{" "}
                      <span className="font-semibold">{r.handler}</span> • Levering:{" "}
                      <span className="font-semibold">{r.delivery}</span>
                    </div>
                  </div>

                  <div className="text-sm font-black opacity-80">
                    {r.payment}
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="px-4 py-10 text-sm opacity-70">
                  Ingen saker matcher filtrene. Dette kan skyldes at filtrene fungerer.
                </div>
              )}
            </div>
          </div>

          {/* FOOTNOTE */}
          <div className="text-xs opacity-60">
            *Registeret viser et utvalg av tilgjengelige saker. Øvrige saker kan være arkivert, utilgjengelige eller
            under vurdering.
          </div>
        </div>
      </div>
    </main>
  );
}

function badgeFor(bucket: string) {
  const b = bucket.toLowerCase();
  if (b.includes("midlertidig")) return "bg-yellow-300 text-black";
  if (b.includes("under vurdering")) return "bg-red-600 text-white";
  if (b.includes("avklart")) return "bg-black text-yellow-300";
  return "bg-neutral-900 text-white";
}

function Kpi(props: { title: string; value: string; note: string }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-4">
      <div className="text-xs font-semibold opacity-60">{props.title}</div>
      <div className="mt-1 text-xl font-black">{props.value}</div>
      <div className="mt-1 text-xs opacity-70">{props.note}</div>
    </div>
  );
}

function FilterGroup(props: {
  title: string;
  current: Record<string, string>;
  keyName: "bucket" | "severity" | "status";
  values: string[];
}) {
  const { title, current, keyName, values } = props;

  return (
    <div>
      <div className="text-xs font-semibold opacity-60">{title}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.map((v) => {
          const label = v || "Alle";
          const active = (current[keyName] || "").toLowerCase() === v.toLowerCase();

          const href = (() => {
            const next = { ...current, [keyName]: v };
            Object.keys(next).forEach((k) => {
              if (!next[k]) delete next[k];
            });
            const usp = new URLSearchParams(next);
            const qs = usp.toString();
            return qs ? `/ordre?${qs}` : `/ordre`;
          })();

          return (
            <Link
              key={`${keyName}:${slugify(label)}`}
              href={href}
              className={[
                "rounded-full px-3 py-1 text-xs font-black border",
                active ? "bg-black text-white border-black" : "bg-white text-black border-black/20 hover:bg-black/5",
              ].join(" ")}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
