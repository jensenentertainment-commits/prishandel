import InfoPage from "../components/InfoPage";

export default function OmPage() {
  return (
    <InfoPage
      title="Om oss"
      lead="Prishandel er en prisorientert nettbutikk bygget på høy aktivitet, raske kampanjer og en praktisk fleksibel forståelse av tilgjengelighet."
      sections={[
        {
          heading: "Hva vi gjør",
          body: (
            <>
              <p>
                Prishandel arbeider for å holde prisnivået lavt, trykket høyt og
                beslutningstempoet høyere enn det tilgjengeligheten alltid tilsier.
              </p>
              <p className="mt-3">
                Vi tilbyr varer, kampanjer og kjøpsmuligheter i et system der marked,
                regnskap og virkelighet løpende forsøker å komme til enighet.
              </p>
            </>
          ),
        },
        {
          heading: "Vår visjon",
          body: (
            <>
              <p>
                Vår visjon er å gjøre aggressive priser tilgjengelige for flest mulig,
                også i tilfeller der produktenes faktiske tilstedeværelse fortsatt er
                under vurdering.
              </p>
              <p className="mt-3">
                Vi mener et godt tilbud ikke nødvendigvis må være enkelt å fullføre for
                å oppleves sterkt i markedet.
              </p>
            </>
          ),
        },
        {
          heading: "Hvordan vi jobber",
          body: (
            <ul className="list-disc space-y-1 pl-5">
              <li>Vi identifiserer prisrom før vi identifiserer trygghet.</li>
              <li>Vi lanserer kampanjer tidlig for å bevare moment.</li>
              <li>Vi vurderer lagerstatus fortløpende og med nødvendig ro.</li>
              <li>Vi dokumenterer avvik når avvikene blir store nok til å fortjene språk.</li>
              <li>Vi skiller tydelig mellom markedsmessig fremdrift og regnskapsmessig støtte.</li>
            </ul>
          ),
        },
        {
          heading: "Hvorfor prisene er så lave",
          body: (
            <>
              <p>
                Våre priser reflekterer først og fremst vilje. I enkelte tilfeller
                reflekterer de også varer.
              </p>
              <p className="mt-3">
                Ved å redusere forventninger til friksjonsfri leveranse kan vi holde et
                offensivt prisnivå over tid, inntil videre og så langt forholdene tillater det.
              </p>
            </>
          ),
        },
        {
          heading: "Vårt forhold til lager",
          body: (
            <>
              <p>
                Prishandel arbeider ikke med lager på en tradisjonell måte. Vi arbeider
                med lager som en bevegelig størrelse, et signal og tidvis en ambisjon.
              </p>
              <p className="mt-3">
                Dette gjør oss mer fleksible, men også mer avhengige av intern vurdering,
                ekstern forståelse og et visst rom for fortolkning.
              </p>
            </>
          ),
        },
        {
          heading: "Marked, regnskap og virkelighet",
          body: (
            <>
              <p>
                Prishandel styres i praksis av tre hovedhensyn: markedets behov for
                fremdrift, regnskapets behov for kontroll og virkelighetens vedvarende
                motstand mot enkle løsninger.
              </p>
              <p className="mt-3">
                Når disse tre trekker i samme retning, oppstår handel. Når de ikke gjør
                det, oppstår dokumentasjon.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}