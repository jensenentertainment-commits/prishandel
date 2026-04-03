import InfoPage from "../components/InfoPage";

export default function LeveringPage() {
  return (
    <InfoPage
      title="Levering"
      lead="Prishandel arbeider for rask og tilgjengelig levering, innenfor rammene av lagerstatus, intern behandling og øvrige forhold som måtte oppstå underveis."
      sections={[
        {
          heading: "Leveringstid",
          body: (
            <>
              <p>
                Leveringstid vurderes individuelt for hver ordre. I de fleste tilfeller
                vil standard levering være ubestemt, mens ekspresslevering fortsatt vil
                være ubestemt, men med høyere forventningsnivå.
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>Standard: ubestemt</li>
                <li>Ekspress: fortsatt ubestemt</li>
                <li>Hent i butikk: avhenger av butikk, vare og virkelighet</li>
              </ul>
            </>
          ),
        },
        {
          heading: "Frakt og kostnader",
          body: (
            <>
              <p>
                Frakt beregnes fortløpende og vises i kassen før behandlingen går videre.
                Gratis frakt kan forekomme ved totalsum over 499,-, forutsatt at ordren
                når et nivå der frakt faktisk blir relevant.
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>Standard frakt: 49,-</li>
                <li>Gratis frakt: mulig over 499,-</li>
                <li>Særskilte fraktforhold kan vurderes uten varsel</li>
              </ul>
            </>
          ),
        },
        {
          heading: "Sporing",
          body: (
            <>
              <p>
                Når en ordre kan spores, vil dette fremgå av ordresiden. Når en ordre
                ikke kan spores, skyldes dette normalt at forsendelsen fortsatt er under
                vurdering, intern sirkulasjon eller begrenset fysisk støtte.
              </p>
              <p className="mt-3">
                Vanlige sporingsstatuser inkluderer blant annet «registrert», «under
                behandling», «videresendt internt» og «ubestemt».
              </p>
            </>
          ),
        },
        {
          heading: "Når levering ikke lar seg gjennomføre",
          body: (
            <>
              <p>
                I enkelte tilfeller vil en ordre kunne bli stoppet før levering. Dette
                kan skyldes lagerforhold, regnskapsmessige hensyn, systemmessige avvik
                eller manglende enighet mellom marked og virkelighet.
              </p>
              <p className="mt-3">
                Dersom levering ikke kan gjennomføres, vil ordren normalt bli stående som
                registrert, vurdert eller behandlet uten at dette nødvendigvis fører til
                mottak av vare.
              </p>
            </>
          ),
        },
        {
          heading: "Tilgjengelighet og leveringsvilje",
          body: (
            <>
              <p>
                Prishandel arbeider med tilgjengelighet som en løpende vurdering, ikke som
                en absolutt tilstand. At en vare kan legges i handlekurven, betyr derfor
                ikke alltid at varen har oppnådd full leveringsklarhet.
              </p>
              <p className="mt-3">
                Vi anbefaler kunder å skille mellom pris, kjøpsmulighet og faktisk
                fremdrift.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}