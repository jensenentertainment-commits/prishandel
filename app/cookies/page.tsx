import InfoPage from "../components/InfoPage";

export default function CookiesPage() {
  return (
    <InfoPage
      title="Informasjonskapsler"
      lead="Prishandel bruker informasjonskapsler for å opprettholde grunnleggende funksjoner, måle kampanjetrykk og forbedre opplevelsen der forbedring anses hensiktsmessig."
      sections={[
        {
          heading: "Hva brukes cookies til?",
          body: (
            <>
              <p>
                Informasjonskapsler brukes for å huske valg, registrere aktivitet og
                forstå hvordan besøkende beveger seg mellom produkter, kampanjer og
                beslutninger de kanskje ikke var helt klare for å ta.
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>Huske handlekurv og midlertidige valg</li>
                <li>Måle kampanjeeffekt og generell påvirkelighet</li>
                <li>Registrere besøk, klikk og avvikende ro</li>
              </ul>
            </>
          ),
        },
        {
          heading: "Nødvendige cookies",
          body: (
            <>
              <p>
                Enkelte informasjonskapsler er nødvendige for at siden skal fungere som
                tilsiktet, eller i det minste fortsette å fremstå som fungerende.
              </p>
              <p className="mt-3">
                Dette inkluderer blant annet lagring av handlekurv, navigasjonstilstand
                og grunnleggende støtte for videre behandling.
              </p>
            </>
          ),
        },
        {
          heading: "Analyse og kampanjemåling",
          body: (
            <>
              <p>
                Vi bruker cookies til å forstå hvilke produkter som vekker interesse,
                hvilke kampanjer som skaper trykk, og hvor ofte en besøkende trenger å
                se den samme oppfordringen før den oppleves som uunngåelig.
              </p>
              <p className="mt-3">
                Disse dataene brukes til løpende vurdering av prisnivå, synlighet og
                videre kommersiell innsats.
              </p>
            </>
          ),
        },
        {
          heading: "Samtykke",
          body: (
            <>
              <p>
                Ved å bruke nettstedet godtar du at enkelte informasjonskapsler kan bli
                vurdert som nødvendige før du nødvendigvis har rukket å danne deg en
                fullstendig mening om dem.
              </p>
              <p className="mt-3">
                Du kan begrense bruk av cookies i nettleseren din, men dette kan påvirke
                funksjonalitet, kampanjeopplevelse og evnen til å holde fast ved egne valg.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}