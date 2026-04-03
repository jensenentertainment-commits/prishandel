import Link from "next/link";

type Outcome = "normal" | "systemfeil";

type Row = {
  id: string;
  outcome: Outcome;
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

function hashCode(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pickFrom<T>(items: readonly T[], seed: number): T {
  return items[seed % items.length];
}

function deriveRows(): Row[] {
  const ids = [
    "PRH-1047",
    "PRH-1182",
    "PRH-1311",
    "PRH-1460",
    "PRH-1599",
    "PRH-1703",
    "PRH-1844",
    "PRH-1980",
    "PRH-2056",
    "PRH-2199",
    "PRH-2331",
    "PRH-2470",
  ];

  return ids.map((id) => {
    const h = hashCode(id);

    const outcome: Outcome = h % 5 === 0 || h % 7 === 0 ? "systemfeil" : "normal";

    const payment =
      outcome === "systemfeil"
        ? "Avvist av mellomlag (midlertidig)"
        : "Godkjent i teorien";

    const status =
      outcome === "systemfeil"
        ? "Avventer manuell tolkning"
        : "Behandles (mentalt)";

    const delivery = pickFrom(
      ["Ubestemt", "Under vurdering", "Avklart tidligere"],
      h
    );

    const handler = pickFrom(
      ["Markedsavdelingen", "Regnskap", "Kundeservice", "Virkeligheten"],
      Math.floor(h / 3)
    );

    const severity =
      outcome === "systemfeil"
        ? "Betydelig"
        : pickFrom(["Lav", "Lav", "Moderat"], Math.floor(h / 5));

    const bucket = pickFrom(
      ["Midlertidig", "Under vurdering", "Avklart tidligere", "Uavklart"],
      Math.floor(h / 7)
    );

    return {
      id,
      outcome,
      status,
      handler,
      payment,
      delivery,
      severity,
      bucket,
    };
  });
}

function applyFilters(
  rows: Row[],
  sp?: Record<string, string | string[] | undefined>
) {
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
      const hay =
        `${r.id} ${r.status} ${r.handler} ${r.payment} ${r.delivery} ${r.bucket} ${r.severity}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (bucket && r.bucket.toLowerCase() !== bucket) return false;
    if (severity && r.severity.toLowerCase() !== severity) return false;
    if (status && r.status.toLowerCase() !== status) return false;
    return true;
  });
}

function buildHref(
  current: Record<string, string>,
  patch: Record<string, string | undefined>
) {
  const next = { ...current, ...patch };

  Object.keys(next).forEach((k) => {
    if (!next[k]) delete next[k];
  });

  const entries = Object.entries(next).filter(
    (kv): kv is [string, string] =>
      typeof kv[1] === "string" && kv[1].length > 0
  );

  const usp = new URLSearchParams(entries);
  const qs = usp.toString();

  return qs ? `/ordre?${qs}` : `/ordre`;
}

function badgeFor(bucket: string) {
  const b = bucket.toLowerCase().trim();

  if (b === "midlertidig") return "bg-yellow-300 text-black";
  if (b === "under vurdering") return "bg-red-600 text-white";
  if (b === "avklart tidligere") return "bg-black text-yellow-300";
  if (b === "uavklart") return "bg-neutral-900 text-white";
  return "bg-neutral-200 text-black";
}

function deriveKpis(rows: Row[]) {
  const avvik = rows.filter((r) => r.outcome === "systemfeil").length;
  const significant = rows.filter((r) => r.severity === "Betydelig").length;

  const behandling =
    significant >= 3 ? "Betydelig" : significant >= 1 ? "Moderat" : "Lav";

  const integritet =
    rows.length === 0
      ? "0,00"
      : (1 - avvik / rows.length).toFixed(2).replace(".", ",");

  return {
    saker: `${rows.length}`,
    avvik: `${avvik}`,
    behandling,
    integritet,
  };
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

  const kpis = deriveKpis(filtered);

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
        <div className="bg-black px-6 py-5 text-yellow-300">
          <div className="text-xs font-black uppercase tracking-wide">
            Ordreoversikt (intern visning)
          </div>
          <h1 className="mt-1 text-2xl font-black text-white">Register</h1>
          <div className="mt-1 text-sm text-white/80">
            Oversikten kan avvike fra faktiske forhold. Begge anses gyldige.
          </div>
        </div>

        <div className="space-y-6 p-6">
          <div className="rounded-xl border border-black/10 bg-white p-4">
            <div className="font-black">Filtre</div>

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-4">
              <div>
                <div className="text-xs font-semibold opacity-60">Søk i register</div>

                <form action="/ordre" className="mt-2 flex gap-2">
                  <input
                    type="text"
                    name="q"
                    defaultValue={current.q}
                    placeholder="Søk etter ID, avdeling eller tilstand"
                    className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-black"
                  />
                  {current.bucket && (
                    <input type="hidden" name="bucket" value={current.bucket} />
                  )}
                  {current.severity && (
                    <input type="hidden" name="severity" value={current.severity} />
                  )}
                  {current.status && (
                    <input type="hidden" name="status" value={current.status} />
                  )}
                  <button
                    type="submit"
                    className="rounded-lg bg-black px-4 py-2 text-sm font-black text-white hover:opacity-90"
                  >
                    Søk
                  </button>
                </form>

                <div className="mt-2 flex gap-2">
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
                  Søkeforslagene er veiledende og ikke bindende.
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
                className="rounded-lg border border-black/20 bg-white px-4 py-2 font-black text-black hover:bg-black/5"
              >
                Nullstill filtre
              </Link>
              <Link
                href="/kundeservice"
                className="rounded-lg bg-red-600 px-4 py-2 font-black text-white hover:opacity-90"
              >
                Eskaler til kundeservice →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Kpi title="Saker" value={kpis.saker} note="Synlige" />
            <Kpi title="Avvik" value={kpis.avvik} note="I utvalg" />
            <Kpi title="Behandling" value={kpis.behandling} note="Antatt nivå" />
            <Kpi title="Integritet" value={kpis.integritet} note="Indeks" />
          </div>

          <div className="overflow-hidden rounded-xl border border-black/10">
            <div className="flex items-center justify-between bg-black/5 px-4 py-3">
              <div className="font-black">Saker</div>
              <div className="text-xs font-semibold opacity-60">
                Viser {filtered.length} av {rows.length}
              </div>
            </div>

            <div className="divide-y divide-black/10">
              {filtered.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded px-2 py-1 text-[11px] font-black ${badgeFor(
                          r.bucket
                        )}`}
                      >
                        {r.bucket}
                      </span>

                      <div className="font-black">
                        <Link
                          href={`/ordre/${encodeURIComponent(r.id)}?from=register&items=1&total=0&code=ikke-utstedt&outcome=${r.outcome}`}
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
                      Status: <span className="font-semibold">{r.status}</span> •
                      Behandles av: <span className="font-semibold">{r.handler}</span> •
                      Levering: <span className="font-semibold">{r.delivery}</span>
                    </div>
                  </div>

                  <div className="text-sm font-black opacity-80">{r.payment}</div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="px-4 py-10 text-sm opacity-70">
                  Ingen saker matcher filtrene. Dette kan skyldes at filtrene fungerer.
                </div>
              )}
            </div>
          </div>

          <div className="text-xs opacity-60">
            * Registeret viser et utvalg av tilgjengelige saker. Øvrige saker kan være
            arkivert, utilgjengelige eller under vurdering.
          </div>
        </div>
      </div>
    </main>
  );
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
                "rounded-full border px-3 py-1 text-xs font-black",
                active
                  ? "border-black bg-black text-white"
                  : "border-black/20 bg-white text-black hover:bg-black/5",
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