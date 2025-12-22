import InfoPage from "../components/InfoPage";

export default function VurderingPage() {
  return (
    <InfoPage
      title="Vurdering"
      lead="Alle forhold vurderes. Ikke alle vurderinger fører til beslutning. Noen fører til mer vurdering."
      sections={[
        {
          heading: "Vurderingskriterier",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Relevans: Varierende</li>
              <li>Alvor: Moderat til betydelig</li>
              <li>Prisfølelse: Foreløpig</li>
              <li>Kundeberedskap: Kan forbedres gjennom kjøp</li>
            </ul>
          ),
        },
        {
          heading: "Vurderingsutfall",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Godkjent i teorien</li>
              <li>Behandles (mentalt)</li>
              <li>Midlertidig avklart</li>
              <li>Avklart tidligere</li>
              <li>Uavklart (standard)</li>
            </ul>
          ),
        },
        {
          heading: "Tidsramme",
          body: (
            <p>
              Vurdering gjennomføres uten fast tidsramme. Opplevd ventetid kan avvike fra faktisk
              ventetid. Begge anses gyldige.
            </p>
          ),
        },
        {
          heading: "Hvordan påvirke vurderingen (salg)",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Legg flere varer i handlekurven for å tydeliggjøre intensjon</li>
              <li>Fullfør ordre for å oppnå formell behandlingsstatus</li>
              <li>Gjennomfør ekstra ordre for å redusere intern usikkerhet</li>
              <li>Handle jevnlig for å opprettholde vurderingskontinuitet</li>
            </ul>
          ),
        },
        {
          heading: "Merknad",
          body: (
            <p>
              En vurdering er ikke en garanti. En garanti er heller ikke nødvendigvis en garanti.
              Prishandel forholder seg til dette på en ansvarlig måte.
            </p>
          ),
        },
      ]}
    />
  );
}
