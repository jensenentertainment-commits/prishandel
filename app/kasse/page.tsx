"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../components/cart/CartProvider";

function hashString(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i);
  return Math.abs(h);
}

function makeOrderId(total: number, itemsCount: number) {
  const now = new Date();
  const cycle = Math.floor(now.getTime() / (1000 * 60 * 41));
  const seed = hashString(`kasse|${cycle}|${total}|${itemsCount}`);
  return `ORD-PH-${String(seed % 900000 + 100000)}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { state } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<"vipps" | "klarna">("vipps");

  const itemCount = useMemo(
    () => state.lines.reduce((sum, line) => sum + line.qty, 0),
    [state.lines]
  );

  const estimatedTotal = useMemo(() => {
    return state.lines.reduce((sum, line) => sum + line.qty * 199, 0);
  }, [state.lines]);

  function handleFinish() {
    const id = makeOrderId(estimatedTotal, itemCount);
    router.push(
      `/ordre/${encodeURIComponent(id)}?from=kasse&items=${itemCount}&total=${estimatedTotal}&payment=${paymentMethod}`
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Ordregrunnlag</h1>
          <p className="text-sm opacity-70">
            Opplysninger registreres fortløpende. Registrering innebærer ikke nødvendigvis fremdrift.
          </p>
        </div>

        <a href="/kurv" className="text-sm font-black underline decoration-2">
          Tilbake til kurv →
        </a>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,380px]">
        <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="text-lg font-black">Kundeopplysninger</div>
          <div className="mt-1 text-sm opacity-70">
            Opplysningene brukes ved vurdering, behandling og eventuell stillhet.
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Fornavn" placeholder="Kampanje" />
            <Field label="Etternavn" placeholder="Kunde" />
            <Field label="E-post" placeholder="kunde@eksempel.no" />
            <Field label="Telefon" placeholder="99 99 99 99" />
            <div className="sm:col-span-2">
              <Field label="Adresse" placeholder="Ubestemt 0" />
            </div>
            <Field label="Postnummer" placeholder="0000" />
            <Field label="Poststed" placeholder="Teori" />
          </div>

          <div className="mt-6 text-lg font-black">Betalingsgrunnlag</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <PayOption
              title="Vipps"
              note="Tilgjengelig som signal"
              active={paymentMethod === "vipps"}
              onClick={() => setPaymentMethod("vipps")}
            />
            <PayOption
              title="Klarna"
              note="Tilgjengelig i prinsippet"
              active={paymentMethod === "klarna"}
              onClick={() => setPaymentMethod("klarna")}
            />
          </div>

          <div className="mt-6 rounded-xl border border-black/10 bg-neutral-50 p-4">
            <div className="text-sm font-black">Intern merknad</div>
            <div className="mt-1 text-sm opacity-80">
              Opplysningene over styrker dokumentasjonen, men påvirker ikke nødvendigvis
              lagerstatus, leveringsvilje eller systemets endelige vurdering.
            </div>
          </div>

          <button
            type="button"
            onClick={handleFinish}
            className="mt-6 block w-full rounded-xl bg-black px-4 py-3 text-center font-black text-white hover:opacity-90"
          >
            SEND TIL BEHANDLING →
          </button>

          <div className="mt-3 text-xs opacity-60">
            Ved å gå videre godtar du vilkår, personvern og en praktisk fleksibel forståelse av fremdrift.
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="font-black">Ordresammendrag</div>
            <div className="mt-2 text-sm opacity-80">
              {itemCount} varer • Foreløpig total: {estimatedTotal},- • Status: under vurdering
            </div>

            <div className="mt-4 rounded-xl border border-black/10 bg-yellow-300 p-4">
              <div className="text-sm font-black">Behandlingsforløp</div>
              <div className="mt-1 text-sm">
                Ordren vil vurderes opp mot betaling, lager, frakt og øvrige forhold før eventuell støtte opprettholdes.
              </div>
            </div>

            <div className="mt-3 text-xs opacity-60">
              Kampanjer kan fortsatt påvirke beslutningsgrunnlaget, uten å forbedre utfallet.
            </div>

            <a
              href="/kampanjer"
              className="mt-4 block rounded-xl bg-red-600 px-4 py-3 text-center font-black text-white hover:opacity-90"
            >
              TIL KAMPANJER →
            </a>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Field(props: { label: string; placeholder: string }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-semibold">{props.label}</span>
      <input
        placeholder={props.placeholder}
        className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm"
      />
    </label>
  );
}

function PayOption(props: {
  title: string;
  note: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={[
        "rounded-xl border p-4 text-left transition",
        props.active
          ? "border-black bg-neutral-50"
          : "border-black/10 bg-white hover:bg-neutral-50",
      ].join(" ")}
    >
      <div className="font-black">{props.title}</div>
      <div className="mt-1 text-xs opacity-70">{props.note}</div>
      <div className="mt-3 rounded-lg border border-black/10 bg-neutral-100 px-3 py-2 text-xs font-semibold">
        {props.active ? "Valgt for vurdering" : "Velg"}
      </div>
    </button>
  );
}