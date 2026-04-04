"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import jsPDF from "jspdf";
import { Share2, Download, Copy } from "lucide-react";

type Audience =
  | "alle"
  | "prisbevisste"
  | "stressede"
  | "lojale"
  | "uklare"
  | "desperate";

type Pressure = "lav" | "aktiv" | "aggressiv" | "desperat";

type Verdict =
  | "godkjent_marked"
  | "avvist_regnskap"
  | "midlertidig_godkjent"
  | "aktivert_ved_risiko";

type CampaignResult = {
  verdict: Verdict;
  verdictLabel: string;
  verdictTone: "black" | "red" | "yellow";
  title: string;
  summary: string;
  marketLine: string;
  financeLine: string;
  controlId: string;
  scores: {
    pricePressure: number;
    marginRisk: number;
    customerIllusion: number;
    internalDisagreement: number;
  };
  notes: string[];
  classification: string;
  consequenceLevel: string;
};

function hashString(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i);
  }
  return Math.abs(h);
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function pct(n: number) {
  return `${Math.round(n)}%`;
}

function toneClass(tone: "black" | "red" | "yellow") {
  if (tone === "red") return "bg-red-600 text-white";
  if (tone === "yellow") return "bg-yellow-300 text-black";
  return "bg-black text-yellow-300";
}

function audienceLabel(audience: Audience) {
  switch (audience) {
    case "prisbevisste":
      return "Prisbevisste";
    case "stressede":
      return "Stressede";
    case "lojale":
      return "Lojale";
    case "uklare":
      return "Uklare";
    case "desperate":
      return "Desperate";
    default:
      return "Alle";
  }
}

function pressureLabel(pressure: Pressure) {
  switch (pressure) {
    case "lav":
      return "Lavt trykk";
    case "aktiv":
      return "Aktivt trykk";
    case "aggressiv":
      return "Aggressivt trykk";
    case "desperat":
      return "Desperat trykk";
  }
}

function generateCampaignName(
  product: string,
  discount: number,
  pressure: Pressure,
  audience: Audience
) {
  const base =
    product.trim().length > 0 ? product.trim() : "Uspesifisert varegrunnlag";

  if (pressure === "desperat") return `${base} – Siste forsøk`;
  if (discount >= 70) return `${base} – Kritisk prisfall`;
  if (audience === "desperate") return `${base} – Emosjonell utsalgshendelse`;
  if (pressure === "aggressiv") return `${base} – Operativ kampanje`;
  return `${base} – Midlertidig kampanje`;
}

function evaluateCampaign(input: {
  product: string;
  discount: number;
  audience: Audience;
  pressure: Pressure;
}): CampaignResult {
  const seed = hashString(
    `${input.product}|${input.discount}|${input.audience}|${input.pressure}`
  );

  const pricePressure =
    input.discount * 0.95 +
    (input.pressure === "lav"
      ? 6
      : input.pressure === "aktiv"
      ? 14
      : input.pressure === "aggressiv"
      ? 22
      : 31);

  const marginRisk =
    input.discount * 0.8 +
    (input.audience === "prisbevisste"
      ? 8
      : input.audience === "lojale"
      ? 4
      : input.audience === "uklare"
      ? 11
      : input.audience === "stressede"
      ? 15
      : input.audience === "desperate"
      ? 24
      : 10);

  const customerIllusion =
    (input.pressure === "lav"
      ? 42
      : input.pressure === "aktiv"
      ? 58
      : input.pressure === "aggressiv"
      ? 73
      : 88) +
    (input.audience === "uklare" ? 8 : input.audience === "desperate" ? 6 : 0);

  const internalDisagreement =
    (input.discount >= 70 ? 32 : input.discount >= 50 ? 23 : 14) +
    (input.pressure === "desperat"
      ? 26
      : input.pressure === "aggressiv"
      ? 18
      : input.pressure === "aktiv"
      ? 10
      : 4);

  const scores = {
    pricePressure: clamp(pricePressure, 0, 100),
    marginRisk: clamp(marginRisk, 0, 100),
    customerIllusion: clamp(customerIllusion, 0, 100),
    internalDisagreement: clamp(internalDisagreement, 0, 100),
  };

  let verdict: Verdict = "midlertidig_godkjent";

  if (scores.marginRisk >= 82 || scores.internalDisagreement >= 55) {
    verdict = "avvist_regnskap";
  } else if (scores.pricePressure >= 88 && scores.customerIllusion >= 75) {
    verdict = "aktivert_ved_risiko";
  } else if (scores.pricePressure <= 45 && scores.marginRisk <= 45) {
    verdict = "godkjent_marked";
  }

  const controlId = `KMP-${String(seed % 900000 + 100000)}`;

  if (verdict === "godkjent_marked") {
    return {
      verdict,
      verdictLabel: "Godkjent i markedet",
      verdictTone: "black",
      title: "Kampanjen anses som gjennomførbar",
      summary:
        "Prisnivået vurderes som aggressivt nok til å skape bevegelse, men ikke så aggressivt at regnskapet må reise seg umiddelbart.",
      marketLine: "Markedsvurdering: Kampanjen kan stå.",
      financeLine: "Økonomisk vurdering: Kampanjen kan stå, men ikke komfortabelt.",
      controlId,
      scores,
      notes: [
        "Kampanjen kan publiseres uten full intern enighet.",
        "Prisnivået anses som salgbart i nåværende stemning.",
        "Tilgjengelighet bør fortsatt omtales forsiktig.",
      ],
      classification: "Kontrollert kampanje",
      consequenceLevel: "Moderat",
    };
  }

  if (verdict === "avvist_regnskap") {
    return {
      verdict,
      verdictLabel: "Avvist av regnskap",
      verdictTone: "red",
      title: "Kampanjen skaper for mye intern uro",
      summary:
        "Markedet ønsker å publisere, men regnskapet vurderer konsekvensene som unødvendig konkrete.",
      marketLine: "Markedsvurdering: Kampanjen ville fungert.",
      financeLine: "Økonomisk vurdering: Kampanjen bør ikke aktiveres i nåværende form.",
      controlId,
      scores,
      notes: [
        "Rabattnivået vurderes som emosjonelt sterkt og økonomisk svekket.",
        "Kampanjen kan skape høy ekstern respons og lav intern ro.",
        "Videre publisering anbefales kun ved svekket dømmekraft eller sterkt kvartalspress.",
      ],
      classification: "Regnskapskritisk",
      consequenceLevel: "Betydelig",
    };
  }

  if (verdict === "aktivert_ved_risiko") {
    return {
      verdict,
      verdictLabel: "Aktivert ved risiko",
      verdictTone: "yellow",
      title: "Kampanjen er operativt mulig",
      summary:
        "Prispresset er høyt, kundeillusjonen anses som tilstrekkelig og intern motstand er registrert uten å få siste ord.",
      marketLine: "Markedsvurdering: Kampanjen bør aktiveres raskt.",
      financeLine: "Økonomisk vurdering: Risiko er notert som et aktivt valg.",
      controlId,
      scores,
      notes: [
        "Kampanjen bør publiseres raskt før støttegrunnlaget svekkes.",
        "Marginfare er kjent og delvis akseptert.",
        "Eventuelle konsekvenser kan omtales som aktivitet.",
      ],
      classification: "Høytrykk-kampanje",
      consequenceLevel: "Høy",
    };
  }

  return {
    verdict,
    verdictLabel: "Midlertidig godkjent",
    verdictTone: "yellow",
    title: "Kampanjen kan brukes med forbehold",
    summary:
      "Kampanjen oppfyller krav til synlighet og bevegelse, men krever fleksibel intern tolkning over tid.",
    marketLine: "Markedsvurdering: Kampanjen er tilstrekkelig.",
    financeLine: "Økonomisk vurdering: Kampanjen kan brukes med forbehold.",
    controlId,
    scores,
    notes: [
      "Kampanjen kan publiseres i begrenset trygghet.",
      "Prisnivået krever vedvarende språkstøtte.",
      "Interne spørsmål kan forventes uten at dette stopper fremdriften.",
    ],
    classification: "Betinget kampanje",
    consequenceLevel: "Moderat til høy",
  };
}

function buildShareText(campaignName: string, result: CampaignResult) {
  return `Kampanjen min "${campaignName}" ble vurdert som ${result.verdictLabel.toLowerCase()} i Prishandel. Kontroll-ID: ${result.controlId}.`;
}

function drawSectionTitle(doc: jsPDF, text: string, x: number, y: number) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(70, 70, 70);
  doc.text(text.toUpperCase(), x, y);
}

function drawMetricRow(
  doc: jsPDF,
  label: string,
  value: number,
  x: number,
  y: number,
  width = 220
) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(label, x, y);
  doc.setFont("helvetica", "bold");
  doc.text(pct(value), x + width, y, { align: "right" });

  const barY = y + 8;
  doc.setFillColor(235, 235, 235);
  doc.roundedRect(x, barY, width, 7, 3, 3, "F");
  doc.setFillColor(0, 0, 0);
  doc.roundedRect(x, barY, (width * value) / 100, 7, 3, 3, "F");
}

function downloadCampaignPdf(
  campaignName: string,
  audience: Audience,
  pressure: Pressure,
  discount: number,
  result: CampaignResult
) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const pageW = 595;
  const left = 46;
  const right = pageW - 46;
  let y = 52;

  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, pageW, 108, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 214, 0);
  doc.text("PRISHANDEL", left, y);

  y += 22;
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text("Kampanjevurdering", left, y);

  y += 18;
  doc.setFontSize(11);
  doc.setTextColor(220, 220, 220);
  doc.text(`Kontroll-ID: ${result.controlId}`, left, y);

  const badgeText = result.verdictLabel.toUpperCase();
  const badgeWidth = doc.getTextWidth(badgeText) + 26;
  const badgeX = right - badgeWidth;
  const badgeY = 38;

  if (result.verdictTone === "red") {
    doc.setFillColor(220, 38, 38);
    doc.setTextColor(255, 255, 255);
  } else if (result.verdictTone === "yellow") {
    doc.setFillColor(250, 204, 21);
    doc.setTextColor(0, 0, 0);
  } else {
    doc.setFillColor(0, 0, 0);
    doc.setDrawColor(250, 204, 21);
    doc.roundedRect(badgeX, badgeY, badgeWidth, 24, 10, 10, "FD");
    doc.setTextColor(250, 204, 21);
  }

  if (result.verdictTone !== "black") {
    doc.roundedRect(badgeX, badgeY, badgeWidth, 24, 10, 10, "F");
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(badgeText, badgeX + badgeWidth / 2, badgeY + 16, { align: "center" });

  y = 138;

  drawSectionTitle(doc, "Kampanje", left, y);
  y += 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  const nameLines = doc.splitTextToSize(campaignName, 500);
  doc.text(nameLines, left, y);
  y += nameLines.length * 20 + 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Målgruppe: ${audienceLabel(audience)}`, left, y);
  y += 16;
  doc.text(`Trykk: ${pressureLabel(pressure)}`, left, y);
  y += 16;
  doc.text(`Rabatt: ${discount}%`, left, y);

  y += 30;
  drawSectionTitle(doc, "Vurderingssammendrag", left, y);
  y += 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(result.title, left, y);
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const summaryLines = doc.splitTextToSize(result.summary, 500);
  doc.text(summaryLines, left, y);
  y += summaryLines.length * 14 + 22;

  const boxY = y;
  const colGap = 14;
  const colW = (pageW - left * 2 - colGap) / 2;

  doc.setFillColor(247, 244, 234);
  doc.roundedRect(left, boxY, colW, 72, 12, 12, "F");
  doc.roundedRect(left + colW + colGap, boxY, colW, 72, 12, 12, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.text("KLASSIFISERING", left + 14, boxY + 18);
  doc.text("KONSEKVENSNIVÅ", left + colW + colGap + 14, boxY + 18);

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(result.classification, left + 14, boxY + 42);
  doc.text(result.consequenceLevel, left + colW + colGap + 14, boxY + 42);

  y = boxY + 100;

  drawSectionTitle(doc, "Score", left, y);
  y += 20;

  drawMetricRow(doc, "Prispress", result.scores.pricePressure, left, y);
  y += 28;
  drawMetricRow(doc, "Marginfare", result.scores.marginRisk, left, y);
  y += 28;
  drawMetricRow(doc, "Kundeillusjon", result.scores.customerIllusion, left, y);
  y += 28;
  drawMetricRow(doc, "Intern uenighet", result.scores.internalDisagreement, left, y);

  y += 40;
  drawSectionTitle(doc, "Interne merknader", left, y);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const marketLines = doc.splitTextToSize(result.marketLine, 500);
  doc.text(marketLines, left, y);
  y += marketLines.length * 14 + 10;

  const financeLines = doc.splitTextToSize(result.financeLine, 500);
  doc.text(financeLines, left, y);
  y += financeLines.length * 14 + 18;

  drawSectionTitle(doc, "Notater", left, y);
  y += 20;

  result.notes.slice(0, 3).forEach((note) => {
    const lines = doc.splitTextToSize(`• ${note}`, 500);
    doc.text(lines, left, y);
    y += lines.length * 14 + 6;
  });

  y += 20;
  doc.setDrawColor(220, 220, 220);
  doc.line(left, y, right, y);
  y += 18;

  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.text(
    "Denne rapporten bekrefter kun at kampanjen er vurdert. Den bekrefter ikke effekt, lagergrunnlag eller intern ro.",
    left,
    y,
    { maxWidth: 500 }
  );

  const fileSafe = campaignName
    .toLowerCase()
    .replace(/[^a-z0-9æøå\- ]/gi, "")
    .trim()
    .replace(/\s+/g, "-");

  doc.save(`kampanjerapport-${fileSafe || "prishandel"}.pdf`);
}

function ResultMetricCard(props: {
  label: string;
  value: number;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 min-h-[168px] flex flex-col">
      <div className="text-[11px] font-black uppercase tracking-wide opacity-45">
        {props.label}
      </div>
      <div className="mt-2 text-2xl font-black">{pct(props.value)}</div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full bg-black"
          style={{ width: `${Math.max(0, Math.min(100, props.value))}%` }}
        />
      </div>
      <div className="mt-auto pt-3 text-xs leading-relaxed opacity-70">
        {props.note}
      </div>
    </div>
  );
}

function MetaCard(props: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/10 bg-[#f7f4ea] p-3 min-h-[92px] flex flex-col justify-between">
      <div className="text-[10px] font-black uppercase tracking-wide opacity-50">
        {props.label}
      </div>
      <div className="mt-2 text-sm font-black leading-relaxed">
        {props.value}
      </div>
    </div>
  );
}

export default function CampaignPage() {
  const [product, setProduct] = useState("");
  const [discount, setDiscount] = useState(40);
  const [audience, setAudience] = useState<Audience>("prisbevisste");
  const [pressure, setPressure] = useState<Pressure>("aktiv");
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const campaignName = useMemo(
    () => generateCampaignName(product, discount, pressure, audience),
    [product, discount, pressure, audience]
  );

  const result = useMemo(
    () =>
      evaluateCampaign({
        product,
        discount,
        audience,
        pressure,
      }),
    [product, discount, audience, pressure]
  );

  const shareText = useMemo(
    () => buildShareText(campaignName, result),
    [campaignName, result]
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  }

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Prishandel kampanjevurdering",
          text: shareText,
        });
        setShared(true);
        setTimeout(() => setShared(false), 1400);
      } else {
        await handleCopy();
      }
    } catch {}
  }

  return (
    <main className="bg-[#f5efcf] text-black">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="text-xs font-semibold opacity-70">
          <Link href="/" className="hover:underline">
            Hjem
          </Link>
          <span className="px-2">/</span>
          <span className="opacity-90">Kampanjevurdering</span>
        </div>

        <div className="mt-5 rounded-2xl border border-black/12 bg-yellow-400 px-4 py-3 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em]">
            <span className="rounded bg-black px-2 py-1 text-yellow-300">
              Kampanjeverktøy
            </span>
            <span>Marked aktivt</span>
            <span className="opacity-35">•</span>
            <span>Regnskap varslet</span>
            <span className="opacity-35">•</span>
            <span>Konsekvenser vurderes senere</span>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <section className="rounded-[2rem] border border-black/12 bg-white shadow-sm">
            <div className="border-b border-black/10 bg-[#f7f4ea] p-5 sm:p-6">
              <div className="text-[11px] font-black uppercase tracking-[0.22em] opacity-45">
                Bygg kampanje
              </div>
              <h1 className="mt-2 text-4xl font-black leading-[0.92] tracking-[-0.05em] sm:text-5xl">
                Få kampanjen
                <br />
                vurdert
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed opacity-80">
                Oppgi hva du selger, hvor hardt du kutter prisen og hvor desperat
                trykket er. Systemet avgjør om kampanjen kan leve.
              </p>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div>
                <label className="text-sm font-black">Hva selger du?</label>
                <input
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="Eksempel: Støydempende vannkoker"
                  className="mt-2 w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm font-medium"
                />
              </div>

              <div>
                <label className="text-sm font-black">
                  Rabatt: {discount}%
                </label>
                <input
                  type="range"
                  min={10}
                  max={90}
                  step={1}
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="mt-3 w-full"
                />
                <div className="mt-2 flex justify-between text-xs opacity-60">
                  <span>Forsiktig</span>
                  <span>Uansvarlig</span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-black">Målgruppe</label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value as Audience)}
                    className="mt-2 w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm font-medium"
                  >
                    <option value="alle">Alle</option>
                    <option value="prisbevisste">Prisbevisste</option>
                    <option value="stressede">Stressede</option>
                    <option value="lojale">Lojale</option>
                    <option value="uklare">Uklare</option>
                    <option value="desperate">Desperate</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-black">Trykk</label>
                  <select
                    value={pressure}
                    onChange={(e) => setPressure(e.target.value as Pressure)}
                    className="mt-2 w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm font-medium"
                  >
                    <option value="lav">Lavt</option>
                    <option value="aktiv">Aktivt</option>
                    <option value="aggressiv">Aggressivt</option>
                    <option value="desperat">Desperat</option>
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-[#f7f4ea] p-4">
                <div className="text-[11px] font-black uppercase tracking-wide opacity-60">
                  Generert kampanjenavn
                </div>
                <div className="mt-2 text-lg font-black leading-tight">
                  {campaignName}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-black/12 bg-white shadow-sm">
            <div className="border-b border-black/10 bg-[#f7f4ea] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.22em] opacity-45">
                    Resultat
                  </div>
                  <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                    Kampanjevurdering
                  </h2>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${toneClass(
                    result.verdictTone
                  )}`}
                >
                  {result.verdictLabel}
                </span>
              </div>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="rounded-2xl border border-black/10 bg-yellow-400 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-wide">
                      Kampanje
                    </div>
                    <div className="mt-2 text-xl font-black leading-tight">
                      {campaignName}
                    </div>
                    <div className="mt-2 text-sm opacity-80">
                      {audienceLabel(audience)} • {pressureLabel(pressure)} • {discount}% rabatt
                    </div>
                  </div>

                  <div className="rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-right">
                    <div className="text-[10px] font-black uppercase tracking-wide opacity-50">
                      Kontroll-ID
                    </div>
                    <div className="mt-1 text-sm font-black">{result.controlId}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4 min-h-[164px]">
                <div className="text-[11px] font-black uppercase tracking-wide opacity-60">
                  Konklusjon
                </div>
                <div className="mt-2 text-xl font-black leading-tight">
                  {result.title}
                </div>
                <div className="mt-3 text-sm leading-relaxed opacity-80">
                  {result.summary}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <ResultMetricCard
                  label="Prispress"
                  value={result.scores.pricePressure}
                  note="Hvor hardt kampanjen presser markedet."
                />
                <ResultMetricCard
                  label="Marginfare"
                  value={result.scores.marginRisk}
                  note="Hvor fort regnskapet mister roen."
                />
                <ResultMetricCard
                  label="Kundeillusjon"
                  value={result.scores.customerIllusion}
                  note="Hvor sannsynlig kampanjen er å oppleves som nødvendig."
                />
                <ResultMetricCard
                  label="Intern uenighet"
                  value={result.scores.internalDisagreement}
                  note="Hvor mye intern koordinasjon som nå må simuleres."
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <MetaCard label="Klassifisering" value={result.classification} />
                <MetaCard label="Konsekvensnivå" value={result.consequenceLevel} />
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4 min-h-[150px]">
                <div className="text-[11px] font-black uppercase tracking-wide opacity-60">
                  Interne kommentarer
                </div>
                <div className="mt-3 space-y-2 text-sm leading-relaxed opacity-85">
                  <div>{result.marketLine}</div>
                  <div>{result.financeLine}</div>
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4 min-h-[188px]">
                <div className="text-[11px] font-black uppercase tracking-wide opacity-60">
                  Notater
                </div>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed opacity-80">
                  {result.notes.slice(0, 3).map((note) => (
                    <li key={note} className="flex gap-2">
                      <span className="opacity-50">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-black text-white hover:opacity-90"
                >
                  <Share2 className="h-4 w-4" />
                  {shared ? "DELT" : "DEL"}
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-black px-4 py-3 text-sm font-black text-white hover:opacity-90"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "KOPIERT" : "KOPIER TEKST"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    downloadCampaignPdf(
                      campaignName,
                      audience,
                      pressure,
                      discount,
                      result
                    )
                  }
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-black/20 bg-white px-4 py-3 text-sm font-black hover:bg-black/5"
                >
                  <Download className="h-4 w-4" />
                  LAST NED PDF
                </button>
              </div>

              <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4 text-sm leading-relaxed opacity-75">
                Delingstekst: <span className="font-semibold">{shareText}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}