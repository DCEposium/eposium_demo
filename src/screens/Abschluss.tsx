import { useMemo } from "react";
import { Kicker } from "../components/Kicker";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { ScreenLayout } from "../components/ScreenLayout";
import { useDemo } from "../state/DemoContext";
import { berechneVergleichsdaten } from "../lib/vergleichsdaten";
import { formatEuro } from "../lib/calc/zahlenformat";
import "./Abschluss.css";

export function Abschluss() {
  const { state, reset } = useDemo();
  const eintraege = useMemo(() => berechneVergleichsdaten(), []);
  const gewaehlt = eintraege.find((e) => e.angebot.lieferantId === state.ausgewaehlterLieferantId);
  const freigabeEintrag = state.auditKette.find((e) => e.ereignis.startsWith("Freigabe"));

  return (
    <ScreenLayout>
      <div className="abschluss">
        <Kicker>Abschluss</Kicker>
        <h1 className="abschluss-titel">Das war Epos in wenigen Minuten.</h1>

        <Card titel="Was in diesem Durchlauf passiert ist" fuss="Alle Zahlen aus dieser Sitzung, nichts geschätzt">
          <ul className="abschluss-zusammenfassung">
            <li>{eintraege.length} Angebote eingelesen und automatisch vergleichbar gemacht.</li>
            {gewaehlt && (
              <li>
                Verhandlung für {gewaehlt.lieferantName} vorbereitet (Gesamtkosten {formatEuro(gewaehlt.ergebnis.gesamtkostenNetto)}
                ).
              </li>
            )}
            {freigabeEintrag && (
              <li>
                {freigabeEintrag.ereignis} von {freigabeEintrag.akteur.name} ({freigabeEintrag.akteur.rolle}).
              </li>
            )}
            <li>{state.auditKette.length} Ereignisse lückenlos im Audit-Protokoll verkettet.</li>
          </ul>
        </Card>

        <Card titel="Pilotpartner werden" fuss="eposium.de">
          <p className="abschluss-cta-text">
            Ihr Einkauf, Ihre IT, unser Prototyp. Sprechen Sie uns am Stand an.
          </p>
          <div className="abschluss-qr-platzhalter" role="img" aria-label="QR-Code folgt">
            QR-Code folgt
          </div>
        </Card>

        <Button onClick={reset}>Neue Demo starten</Button>
      </div>
    </ScreenLayout>
  );
}
