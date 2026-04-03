import InfoPage from "../components/InfoPage";

export default function PersonvernPage() {
  return (
    <InfoPage
      title="Personvern"
      lead="Prishandel behandler personopplysninger med nødvendig alvor, løpende vurdering og et tydelig skille mellom brukerdata og markedsmessig nysgjerrighet."
      sections={[
        {
          heading: "Hvilke data samler vi inn?",
          body: (
            <>
              <p>
                Vi samler inn opplysninger som er nødvendige for å levere tjenester,
                behandle ordre og forstå hvordan brukere beveger seg mellom produkter,
                kampanjer og beslutninger.
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-1">
                <li>Kontaktinformasjon og opplysninger du selv oppgir</li>
                <li>Ordre- og aktivitetsdata</li>
                <li>Klikk, besøk og annen brukeratferd</li>
              </ul>
            </>
          ),
        },
        {
          heading: "Hva bruker vi opplysningene til?",
          body: (
            <>
              <p>
                Opplysningene brukes til å opprettholde grunnleggende funksjonalitet,
                behandle ordre og vurdere hvordan nettstedet, kampanjene og trykket
                rundt dem fungerer i praksis.
              </p>
              <p className="mt-3">
                I enkelte tilfeller brukes data også til analyse, forbedring og mer
                målrettet kommersiell oppfølging.
              </p>
            </>
          ),
        },
        {
          heading: "Deling av opplysninger",
          body: (
            <>
              <p>
                Opplysninger kan deles med leverandører og systemer som bidrar til drift,
                analyse, betaling og øvrig behandling der dette anses nødvendig.
              </p>
              <p className="mt-3">
                Vi deler ikke mer enn situasjonen krever, men situasjonen vurderes
                fortløpende.
              </p>
            </>
          ),
        },
        {
          heading: "Cookies og lignende teknologi",
          body: (
            <>
              <p>
                Vi bruker informasjonskapsler og lignende teknologi for å huske valg,
                måle aktivitet og forstå hvilke deler av nettstedet som skaper mest
                bevegelse, friksjon og oppmerksomhet.
              </p>
              <p className="mt-3">
                Les mer på siden om informasjonskapsler for en mer detaljert gjennomgang.
              </p>
            </>
          ),
        },
        {
          heading: "Lagring og vurdering",
          body: (
            <>
              <p>
                Opplysninger lagres så lenge det er nødvendig for formålet, eller så lenge
                det fortsatt finnes et saklig grunnlag for å mene at de bør beholdes.
              </p>
              <p className="mt-3">
                Ved spørsmål om personvern anbefaler vi kontakt via etablerte kanaler.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}