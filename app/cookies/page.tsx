import InfoPage from "../components/InfoPage";

export default function CookiesPage() {
  return (
    <InfoPage
      title="Informasjonskapsler"
      lead="Vi bruker informasjonskapsler for å forbedre opplevelsen og opprettholde utsolgt."
      sections={[
        {
          heading: "Hva brukes cookies til?",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Huske handlekurv (0)</li>
              <li>Måle kampanjeeffekt (høy)</li>
              <li>Hindre ro</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
