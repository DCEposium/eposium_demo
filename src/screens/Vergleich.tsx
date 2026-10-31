import { useMemo } from "react";
import { Kicker } from "../components/Kicker";
import { Badge } from "../components/Badge";
import { Rechenweg } from "../components/Rechenweg";
import { Button } from "../components/Button";
import { ScreenLayout } from "../components/ScreenLayout";
import { useDemo } from "../state/DemoContext";
import { ROH_ANGEBOTE, LIEFERANTEN, BESTELLANFORDERUNG } from "../lib/demodaten";
import {
  normalisiereAngebotA,
  normalisiereAngebotB,
  normalisiereAngebotC,
} from "../lib/parsers/angebotNormalizer";
import { berechneGesamtkosten } from "../lib/calc/gesamtkosten";
import { leiteVergleichsvorgabenAb } from "../lib/anforderungen";
import { formatEuro, formatZahl, formatDatumAusDate, parseLokalesDatum } from "../lib/calc/zahlenformat";
import "./Vergleich.css";

function lieferantName(lieferantId: string): string {
  return LIEFERANTEN.find((l) => l.id === lieferantId)?.name ?? lieferantId;
}

export function Vergleich() {
  const { geheZu } = useDemo();

  const ergebnisse = useMemo(() => {
    const vorgaben = leiteVergleichsvorgabenAb(BESTELLANFORDERUNG);
    const eingabe = {
      bedarfsmenge: BESTELLANFORDERUNG.menge,
      mindestGewaehrleistungMonate: vorgaben.mindestGewaehrleistungMonate,
      gewuenschterIncoterm: vorgaben.gewuenschterIncoterm,
      bestelldatum: new Date(),
      wunschtermin: parseLokalesDatum(BESTELLANFORDERUNG.wunschtermin),
    };

    const angebote = [
      normalisiereAngebotA(ROH_ANGEBOTE.A.dateiname, ROH_ANGEBOTE.A.text),
      normalisiereAngebotB(ROH_ANGEBOTE.B.dateiname, ROH_ANGEBOTE.B.text),
      normalisiereAngebotC(ROH_ANGEBOTE.C.dateiname, ROH_ANGEBOTE.C.text),
    ];

    return angebote.map((angebot) => berechneGesamtkosten(angebot, eingabe));
  }, []);

  const guenstigsteGesamtkosten = Math.min(...ergebnisse.map((e) => e.gesamtkostenNetto));

  return (
    <ScreenLayout>
      <div className="vergleich">
        <Kicker>Schritt 3 von 3</Kicker>
        <h1 className="vergleich-titel">Der Vergleich</h1>
        <p className="vergleich-unterzeile">
          Gesamtkosten für {formatZahl(BESTELLANFORDERUNG.menge, 0)} Stück, inklusive Versand und
          Zertifikatskosten. Alle Zahlen werden aus den Rohdaten berechnet.
        </p>

        <div className="vergleich-grid">
          {ergebnisse.map((ergebnis) => (
            <div className="vergleich-karte" key={ergebnis.lieferantId}>
              <p className="vergleich-karte-lieferant">{lieferantName(ergebnis.lieferantId)}</p>

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

        <Button onClick={() => geheZu("vergleich")} disabled>
          Preis-Check folgt in Meilenstein 4
        </Button>
      </div>
    </ScreenLayout>
  );
}
