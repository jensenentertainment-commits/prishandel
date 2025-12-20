import InfoPage from "../components/InfoPage";

export default function PressePage() {
  return (
    <InfoPage
      title="Presse"
      lead="Her finner du pressemateriell, sitater og et visst nivå av selvtillit."
      sections={[
        {
          heading: "Pressekontakt",
          body: "📣 Marked: tilgjengelig. 🧾 Regnskap: opptatt.",
        },
        {
          heading: "Logo og profil",
          body: "Logo kan lastes ned i teorien. Bruk med varsomhet.",
        },
      ]}
    />
  );
}
