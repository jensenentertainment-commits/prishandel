import InfoPage from "../components/InfoPage";

export default function FaqPage() {
  return (
    <InfoPage
      title="Ofte stilte spørsmål"
      lead="Svarene er korrekte i teorien."
      sections={[
        {
          heading: "Har dere varen på lager?",
          body: "Nei. Men den er på kampanje.",
        },
        {
          heading: "Når kommer den inn igjen?",
          body: "Når markedet er ferdig å love ting.",
        },
        {
          heading: "Hvorfor er alt utsolgt?",
          body: "Fordi vi tar prispress på alvor.",
        },
        {
          heading: "Er dette en ekte nettbutikk?",
          body: "🧾 Regnskap: Dette er et spørsmål. 📣 Marked: Ja.",
        },
      ]}
    />
  );
}
