import { useMemo } from "react";
import { Kicker } from "../components/Kicker";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { ScreenLayout } from "../components/ScreenLayout";
import { useDemo } from "../state/DemoContext";
import { berechneVergleichsdaten, branchentrendKontext } from "../lib/vergleichsdaten";
import { EUROSTAT_CACHE } from "../lib/demodaten";
import { formatEuro, formatZahl } from "../lib/calc/zahlenformat";
import "./PreisCheck.css";

export function PreisCheck() {
  const { waehleLieferantUndGeheZu } = useDemo();
  const eintraege = useMemo(() => berechneVergleichsdaten(), []);
  const trend = useMemo(() => branchentrendKontext(), []);

  return (
    <ScreenLayout>
      <div className="preischeck">
        <Kicker>Preis-Check</Kicker>
        <h1 className="preischeck-titel">Ist der Preis wirklich fair?</h1>
        <p className="preischeck-unterzeile">
          Einordnung gegen frühere Preise desselben Lieferanten. Eine Spanne statt einer
          Scheingenauigkeit — mit wenigen Datenpunkten ist keine exakte Aussage möglich.
        </p>

        <div className="preischeck-grid">
          {eintraege.map(({ angebot, lieferantName, preisEinschaetzung }) => (
            <div className="preischeck-karte" key={angebot.lieferantId}>
              <p className="preischeck-karte-lieferant">{lieferantName}</p>
              <p className="preischeck-karte-preis">{formatEuro(preisEinschaetzung.aktuellerPreisNetto)}</p>
              <p className="preischeck-karte-je-stueck">je Stück, netto</p>

              {preisEinschaetzung.anzahlHistorischerDatenpunkte === 0 ? (
                <Badge variante="hinweis">{preisEinschaetzung.einschaetzung}</Badge>
              ) : (
                <Badge variante={Math.abs(preisEinschaetzung.veraenderungProzent ?? 0) < 3 ? "erfuellt" : "hinweis"}>
                  {preisEinschaetzung.einschaetzung}
                </Badge>
              )}

              <Button
                variante="sekundaer-hell"
                className="preischeck-karte-button"
                onClick={() => waehleLieferantUndGeheZu(angebot.lieferantId, "briefing")}
              >
                Verhandlung vorbereiten
              </Button>
            </div>
          ))}
        </div>

        {trend && (
          <p className="preischeck-branchenkontext">
            Zum Vergleich, als grober Kontext: der Eurostat-Erzeugerpreisindex für Investitionsgüter
            (Deutschland) stieg zwischen {trend.vonMonat} und {trend.bisMonat} um{" "}
            {formatZahl(trend.veraenderungProzent, 1)} %. Das ist ein allgemeiner Branchentrend, kein
            Index für dieses Produkt. Quelle: {EUROSTAT_CACHE.quelle}, {EUROSTAT_CACHE.lizenz}, abgerufen
            am {new Date(EUROSTAT_CACHE.abgerufen_am).toLocaleDateString("de-DE")}.
          </p>
        )}
      </div>
    </ScreenLayout>
  );
}
