import InfoPage from "../components/InfoPage";

export default function PersonvernPage() {
  return (
    <InfoPage
      title="Personvern"
      lead="Vi tar personvern på alvor. Marked tar alt på alvor."
      sections={[
        {
          heading: "Hvilke data samler vi inn?",
          body: "Primært: håp. Sekundært: klikk.",
        },
        {
          heading: "Cookies",
          body: "Noen er ekte. Noen er kampanje.",
        },
      ]}
    />
  );
}
