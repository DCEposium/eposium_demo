import { useMemo } from "react";
import { Kicker } from "../components/Kicker";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { ScreenLayout } from "../components/ScreenLayout";
import { useDemo } from "../state/DemoContext";
import { berechneVergleichsdaten } from "../lib/vergleichsdaten";
import { erzeugeBriefing } from "../lib/briefing";
import { BESTELLANFORDERUNG, LIEFERANTEN } from "../lib/demodaten";
import { formatEuro } from "../lib/calc/zahlenformat";
import "./Verhandlungsbriefing.css";

export function Verhandlungsbriefing() {
  const { state, geheZu, protokolliereUndGeheZu } = useDemo();
  const eintraege = useMemo(() => berechneVergleichsdaten(), []);

  const eintrag = eintraege.find((e) => e.angebot.lieferantId === state.ausgewaehlterLieferantId);
  const lieferant = LIEFERANTEN.find((l) => l.id === state.ausgewaehlterLieferantId);

  if (!eintrag || !lieferant) {
    return (
      <ScreenLayout>
        <div className="briefing">
          <Kicker>Verhandlungsbriefing</Kicker>
          <h1 className="briefing-titel">Kein Lieferant ausgewählt</h1>
          <p>Bitte zuerst im Preis-Check "Verhandlung vorbereiten" bei einem Angebot wählen.</p>
          <Button onClick={() => geheZu("preischeck")}>Zurück zum Preis-Check</Button>
        </div>
      </ScreenLayout>
    );
  }

  const briefing = erzeugeBriefing(eintrag, eintraege, lieferant, BESTELLANFORDERUNG);

  return (
    <ScreenLayout>
      <div className="briefing">
        <Kicker>Verhandlungsbriefing</Kicker>
        <h1 className="briefing-titel">Verhandlung mit {eintrag.lieferantName}</h1>
        <p className="briefing-unterzeile">
          Vorgefertigt aus den berechneten Fakten — kein Live-Modell beteiligt.
        </p>

        <div className="briefing-grid">
          <Card titel="Ziele">
            <ul className="briefing-liste">
              {briefing.ziele.map((z, i) => (
                <li key={i}>{z}</li>
              ))}
            </ul>
          </Card>

          <Card titel="Argumente">
            <ul className="briefing-liste">
              {briefing.argumente.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </Card>

          <Card titel="Mögliche Zugeständnisse">
            <ul className="briefing-liste">
              {briefing.zugestaendnisse.map((z, i) => (
                <li key={i}>{z}</li>
              ))}
            </ul>
          </Card>

          <Card titel="Fragen an den Lieferanten">
            <ul className="briefing-liste">
              {briefing.fragenAnLieferant.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </Card>
        </div>

        <Card titel="E-Mail-Entwurf" fuss={`Zielpreis ${formatEuro(briefing.zielpreisNetto)} je Stück, netto`}>
          <pre className="briefing-email">{briefing.emailEntwurf}</pre>
        </Card>

        <div className="briefing-live-modus">
          <label className="briefing-live-modus-schalter">
            <input type="checkbox" disabled aria-disabled="true" />
            Live-Modus (echter KI-Aufruf)
          </label>
          <p className="briefing-live-modus-hinweis">
            In diesem Prototyp nicht aktiv. Alle Texte oben sind vorgefertigt und aus den berechneten
            Zahlen erzeugt, nicht von einem Sprachmodell geschrieben.
          </p>
        </div>

        <Button
          onClick={() =>
            protokolliereUndGeheZu(
              "Verhandlungsbriefing abgeschlossen",
              { rolle: "System", name: "Epos" },
              {
                lieferantId: eintrag.angebot.lieferantId,
                lieferantName: eintrag.lieferantName,
                zielpreisNetto: briefing.zielpreisNetto,
                gesamtkostenNetto: eintrag.ergebnis.gesamtkostenNetto,
              },
              "freigabe"
            )
          }
        >
          Weiter zur Freigabe
        </Button>
      </div>
    </ScreenLayout>
  );
}
