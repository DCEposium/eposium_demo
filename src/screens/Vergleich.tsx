import { useMemo } from "react";
import { Kicker } from "../components/Kicker";
import { Badge } from "../components/Badge";
import { Rechenweg } from "../components/Rechenweg";
import { Button } from "../components/Button";
import { ScreenLayout } from "../components/ScreenLayout";
import { useDemo } from "../state/DemoContext";
import { BESTELLANFORDERUNG } from "../lib/demodaten";
import { berechneVergleichsdaten } from "../lib/vergleichsdaten";
import { formatEuro, formatZahl, formatDatumAusDate } from "../lib/calc/zahlenformat";
import "./Vergleich.css";

export function Vergleich() {
  const { geheZu } = useDemo();

  const eintraege = useMemo(() => berechneVergleichsdaten(), []);
  const guenstigsteGesamtkosten = Math.min(...eintraege.map((e) => e.ergebnis.gesamtkostenNetto));

  return (
    <ScreenLayout>
      <div className="vergleich">
        <Kicker>Vergleich</Kicker>
        <h1 className="vergleich-titel">Der Vergleich</h1>
        <p className="vergleich-unterzeile">
          Gesamtkosten für {formatZahl(BESTELLANFORDERUNG.menge, 0)} Stück, inklusive Versand und
          Zertifikatskosten. Alle Zahlen werden aus den Rohdaten berechnet.
        </p>

        <div className="vergleich-grid">
          {eintraege.map(({ angebot, lieferantName, ergebnis }) => (
            <div className="vergleich-karte" key={angebot.lieferantId}>
              <p className="vergleich-karte-lieferant">{lieferantName}</p>

              <p className="vergleich-karte-summe">{formatEuro(ergebnis.gesamtkostenNetto)}</p>
              {ergebnis.gesamtkostenNetto === guenstigsteGesamtkosten && (
                <Badge variante="erfuellt">Niedrigste Gesamtkosten</Badge>
              )}
              {ergebnis.ueberschussmenge > 0 && (
                <p className="vergleich-karte-je-stueck">
                  {formatEuro(ergebnis.kostenJeBenoetigtemStueck)} je benötigtem Stück (
                  {ergebnis.bestellmenge} bestellt für {ergebnis.bedarfsmenge} benötigt)
                </p>
              )}
              {ergebnis.skontoEffektNetto && (
                <p className="vergleich-karte-skonto">
                  mit Skonto: {formatEuro(ergebnis.skontoEffektNetto)}
                </p>
              )}

              <p className="vergleich-karte-termin">
                Lieferung ca. {formatDatumAusDate(ergebnis.voraussichtlichesLieferdatum)}
                {!ergebnis.erreichtWunschtermin && " (nach Wunschtermin)"}
              </p>

              <div className="vergleich-karte-badges">
                {ergebnis.nichtVergleichbarHinweise.length === 0 ? (
                  <Badge variante="erfuellt">Erfüllt alle Anforderungen</Badge>
                ) : (
                  ergebnis.nichtVergleichbarHinweise.map((hinweis) => (
                    <Badge variante="hinweis" key={hinweis.feld}>
                      {hinweis.feld}: {hinweis.hinweis}
                    </Badge>
                  ))
                )}
              </div>

              <Rechenweg schritte={ergebnis.rechenweg} />
            </div>
          ))}
        </div>

        <Button onClick={() => geheZu("preischeck")}>Preis-Check: Ist der Preis wirklich fair?</Button>
      </div>
    </ScreenLayout>
  );
}
