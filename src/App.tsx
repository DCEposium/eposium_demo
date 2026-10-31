import { useEffect } from "react";
import { DemoProvider, useDemo } from "./state/DemoContext";
import { Attract } from "./screens/Attract";
import { Bedarf } from "./screens/Bedarf";
import { AngeboteEinlesen } from "./screens/AngeboteEinlesen";
import { Vergleich } from "./screens/Vergleich";
import { PreisCheck } from "./screens/PreisCheck";
import { Verhandlungsbriefing } from "./screens/Verhandlungsbriefing";
import { Freigabe } from "./screens/Freigabe";
import { AuditProtokoll } from "./screens/AuditProtokoll";
import { EchtModus } from "./screens/EchtModus";

function Bildschirm() {
  const { state } = useDemo();

  // Ohne das würde ein neuer Bildschirm an der Scrollposition des vorherigen
  // erscheinen (gleiches Dokument, kein Seitenwechsel) und der Kopfbereich
  // könnte verdeckt sein.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [state.screen]);

  switch (state.screen) {
    case "attract":
      return <Attract />;
    case "bedarf":
      return <Bedarf />;
    case "angebote":
      return <AngeboteEinlesen />;
    case "vergleich":
      return <Vergleich />;
    case "preischeck":
      return <PreisCheck />;
    case "briefing":
      return <Verhandlungsbriefing />;
    case "freigabe":
      return <Freigabe />;
    case "audit":
      return <AuditProtokoll />;
    case "echtModus":
      return <EchtModus />;
  }
}

export default function App() {
  return (
    <DemoProvider>
      <Bildschirm />
    </DemoProvider>
  );
}
