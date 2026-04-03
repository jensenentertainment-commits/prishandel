import InfoPage from "../components/InfoPage";

export default function MetodikkPage() {
  return (
    <InfoPage
      title="Metodikk"
      lead="Prishandel opererer etter en dokumentert metodikk. Den er konsistent, ufravikelig og vurderes som tilstrekkelig."
      sections={[
        {
          heading: "Metodisk rammeverk",
          body: (
            <>
              <p>
                Alle vurderinger, priser og beslutninger behandles etter en fastsatt
                metodikk. Denne sikrer fremdrift uavhengig av utfall.
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-1">
                <li>Trinn 1: Fastslå prisens intensjon</li>
                <li>Trinn 2: Juster forventning ved behov</li>
                <li>Trinn 3: Godkjenn i teorien</li>
                <li>Trinn 4: Arkiver som gjennomført</li>
              </ul>
            </>
          ),
        },
        {
          heading: "Måleparametere",
          body: (
            <>
              <p>
                Resultater vurderes løpende basert på et sett parametere som gir et
                tilstrekkelig bilde av situasjonen.
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-1">
                <li>Prisavvik (± 0,00–99,99)</li>
                <li>Tilgjengelighet: antatt</li>
                <li>Behandlingsgrad: moderat</li>
                <li>Resultat: nær ved å være endelig</li>
              </ul>
            </>
          ),
        },
        {
          heading: "Kvalitet og trygghet",
          body: (
            <>
              <p>
                Metodikken er utformet for å sikre en opplevelse av struktur, kontroll
                og fremdrift. Dette oppnås gjennom konsekvent bruk av etablerte steg,
                uavhengig av om de fører til avklaring.
              </p>
              <p className="mt-3">
                Ved usikkerhet anbefales videre handel som stabiliserende tiltak.
              </p>
            </>
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
              <li>*Trygghet vurderes løpende</li>
              <li>**Rask betyr administrativt rask</li>
              <li>Metodikken kan være korrekt selv når den ikke er det</li>
            </ul>
          ),
        },
      ]}
    />
  );
}