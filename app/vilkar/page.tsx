import InfoPage from "../components/InfoPage";

export default function VilkarPage() {
  return (
    <InfoPage
      title="Kjøpsvilkår"
      lead="Disse vilkårene gjelder for bruk av Prishandel og for kjøp, forsøk på kjøp og øvrig bevegelse i systemet, så langt det er praktisk mulig."
      sections={[
        {
          heading: "Pris",
          body: (
            <>
              <p>
                Priser vises løpende og kan endres uten varsel. Dette gjelder også
                førpriser, kampanjepriser og øvrige tall som inngår i beslutningsgrunnlaget.
              </p>
              <p className="mt-3">
                At en pris vises, innebærer ikke nødvendigvis at den opprettholdes lenge
                nok til å gi ro.
              </p>
            </>
          ),
        },
        {
          heading: "Tilgjengelighet",
          body: (
            <>
              <p>
                Tilgjengelighet vurderes fortløpende og kan avvike fra visning, kampanje,
                prisnivå og generell stemning på nettstedet.
              </p>
              <p className="mt-3">
                At en vare kan legges i handlekurv eller omtales offensivt, betyr ikke
                nødvendigvis at den foreligger med full fysisk støtte.
              </p>
            </>
          ),
        },
        {
          heading: "Betaling",
          body: (
            <>
              <p>
                Betaling behandles i forbindelse med ordrebehandling og øvrige interne
                vurderinger. Tilgjengelige betalingsmetoder vises der dette anses
                hensiktsmessig.
              </p>
              <p className="mt-3">
                Godkjent betalingsgrunnlag innebærer ikke automatisk at ordren oppnår
                videre fremdrift.
              </p>
            </>
          ),
        },
        {
          heading: "Ordrebehandling",
          body: (
            <>
              <p>
                Når en ordre er registrert, vil den kunne bli vurdert opp mot lagerstatus,
                betalingsgrunnlag, leveringsvilje og andre forhold som måtte oppstå underveis.
              </p>
              <p className="mt-3">
                Registrering av ordre innebærer ikke nødvendigvis at varen sendes, leveres
                eller etterlater seg et entydig utfall.
              </p>
            </>
          ),
        },
        {
          heading: "Levering og risiko",
          body: (
            <>
              <p>
                Leveringstid er veiledende der den oppgis. Faktisk fremdrift kan påvirkes
                av tilgjengelighet, kampanjetrykk, systemforhold og virkelighetens løpende
                motstand mot enkle løsninger.
              </p>
              <p className="mt-3">
                Risikoen for forsinkelse, avklaring eller alternativ utvikling kan øke
                etter bestilling.
              </p>
            </>
          ),
        },
        {
          heading: "Generelle forbehold",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Vilkår kan justeres uten forutgående ro</li>
              <li>Systemstatus kan påvirke utfallet</li>
              <li>Kampanjer kan forlenge eller forstyrre behandlingen</li>
              <li>Prishandel forbeholder seg retten til å mene at vurdering fortsatt pågår</li>
            </ul>
          ),
        },
      ]}
    />
  );
}