import InfoPage from "../components/InfoPage";

export default function MetodikkPage() {
  return (
    <InfoPage
      title="Metodikk"
      lead="Prishandel opererer etter en dokumentert metodikk. Den er effektiv, ufravikelig og sannsynligvis riktig."
      sections={[
        {
          heading: "Metodisk rammeverk",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Trinn 1: Fastslå prisens intensjon</li>
              <li>Trinn 2: Juster forventning (ved behov)</li>
              <li>Trinn 3: Godkjenn i teorien</li>
              <li>Trinn 4: Arkiver som gjennomført</li>
            </ul>
          ),
        },
        {
          heading: "Måleparametere",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Prisavvik (± 0,00–99,99)</li>
              <li>Tilgjengelighet: Antatt</li>
              <li>Behandlingsgrad: Moderat</li>
              <li>Resultat: Nær ved å være endelig</li>
            </ul>
          ),
        },
        {
          heading: "Kvalitet og trygghet",
          body: (
            <p>
              Metodikken er utformet for å skape trygg handel* og rask avklaring**.
              Ved usikkerhet anbefales videre handel.
            </p>
          ),
        },
        {
          heading: "Anbefalt fremgangsmåte (salg)",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Legg varen i handlekurv for å signalisere alvor</li>
              <li>Øk antall for å redusere tvil</li>
              <li>Fullfør bestilling for å igangsette interne prosesser</li>
              <li>Gjenta ved tegn til ro</li>
            </ul>
          ),
        },
        {
          heading: "Merknader",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>*Trygghet vurderes løpende.</li>
              <li>**Rask betyr administrativt rask.</li>
              <li>Metodikken kan være korrekt selv når den ikke er det.</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
