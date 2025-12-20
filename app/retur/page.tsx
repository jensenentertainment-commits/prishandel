import InfoPage from "../components/InfoPage";

export default function ReturPage() {
  return (
    <InfoPage
      title="Retur & reklamasjon"
      lead="Vi liker å si ja. Regnskap liker å si nei."
      sections={[
        {
          heading: "Angrerett",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>30 dager retur*</li>
              <li>Gjelder ikke: verdighet, ro, mot og sunn fornuft</li>
              <li>Tilstand: må returneres i original virkelighet</li>
            </ul>
          ),
        },
        {
          heading: "Reklamasjon",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Du kan reklamere på mangler</li>
              <li>Vi kan reklamere på forventninger</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
