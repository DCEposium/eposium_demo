import { useMemo, useState } from "react";
import { Kicker } from "../components/Kicker";
import { Button } from "../components/Button";
import { ScreenLayout } from "../components/ScreenLayout";
import { useDemo } from "../state/DemoContext";
import { ROH_ANGEBOTE, LIEFERANTEN } from "../lib/demodaten";
import {
  normalisiereAngebotA,
  normalisiereAngebotB,
  normalisiereAngebotC,
} from "../lib/parsers/angebotNormalizer";
import type { NormalisiertesAngebot } from "../lib/types";
import { formatEuro, formatZahl } from "../lib/calc/zahlenformat";
import "./AngeboteEinlesen.css";

function lieferantName(lieferantId: string): string {
  return LIEFERANTEN.find((l) => l.id === lieferantId)?.name ?? lieferantId;
}

function AngebotKarte({ roh, angebot }: { roh: { dateiname: string; text: string }; angebot: NormalisiertesAngebot }) {
  const [ansicht, setAnsicht] = useState<"roh" | "erkannt">("erkannt");

  return (
    <div className="angebot-karte">
      <div className="angebot-karte-kopf">
        <div>
          <p className="angebot-karte-lieferant">{lieferantName(angebot.lieferantId)}</p>
          <p className="angebot-karte-dateiname">{roh.dateiname}</p>
        </div>
        <div className="angebot-karte-umschalter" role="tablist" aria-label="Ansicht wählen">
          <button
            type="button"
            role="tab"
            aria-selected={ansicht === "erkannt"}
            className={ansicht === "erkannt" ? "ist-aktiv" : ""}
            onClick={() => setAnsicht("erkannt")}
          >
            Was Epos erkannt hat
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={ansicht === "roh"}
            className={ansicht === "roh" ? "ist-aktiv" : ""}
            onClick={() => setAnsicht("roh")}
          >
            Rohdarstellung
          </button>
        </div>
      </div>

      {ansicht === "roh" ? (
        <pre className="angebot-karte-roh">{roh.text}</pre>
      ) : (
        <dl className="angebot-karte-fakten">
          <div>
            <dt>Preis je Stück (netto)</dt>
            <dd>{formatEuro(angebot.preisstaffeln[0].stueckpreisNetto)}</dd>
          </div>
          {angebot.mindestmenge && (
            <div>
              <dt>Mindestabnahme</dt>
              <dd>{formatZahl(angebot.mindestmenge, 0)} Stück</dd>
            </div>
          )}
          {angebot.kartoneinheit && (
            <div>
              <dt>Liefereinheit</dt>
              <dd>Kartons à {formatZahl(angebot.kartoneinheit, 0)} Stück</dd>
            </div>
          )}
          <div>
            <dt>Incoterm</dt>
            <dd>{angebot.incoterm}</dd>
          </div>
          <div>
            <dt>Lieferzeit</dt>
            <dd>{angebot.lieferzeitWerktage} Werktage</dd>
          </div>
          <div>
            <dt>Zahlungsziel</dt>
            <dd>
              {angebot.zahlungszielTage} Tage
              {angebot.skontoProzent ? ` (${angebot.skontoProzent} % Skonto bei ${angebot.skontoFristTage} Tagen)` : ""}
            </dd>
          </div>
          <div>
            <dt>Gewährleistung</dt>
            <dd>{angebot.gewaehrleistungMonate} Monate</dd>
          </div>
          <div>
            <dt>Werkszeugnis 3.1</dt>
            <dd>
              {!angebot.zertifikat31.verfuegbar
                ? "nicht lieferbar"
                : angebot.zertifikat31.inklusive
                  ? "inklusive"
                  : `verfügbar, ${formatEuro(angebot.zertifikat31.kostenNetto ?? 0)} zusätzlich`}
            </dd>
          </div>
          <div>
            <dt>Versand</dt>
            <dd>
              {formatEuro(angebot.versandkostenNetto)}
              {angebot.versandkostenfreiAbWarenwert
                ? `, frei ab ${formatEuro(angebot.versandkostenfreiAbWarenwert)} Warenwert`
                : ""}
            </dd>
          </div>
        </dl>
      )}

      {angebot.annahmen.length > 0 && (
        <p className="angebot-karte-annahme">
          Annahme: {angebot.annahmen.join(" ")}
        </p>
      )}
    </div>
  );
}

export function AngeboteEinlesen() {
  const { geheZu } = useDemo();

  const angebote = useMemo(
    () => [
      { roh: ROH_ANGEBOTE.A, angebot: normalisiereAngebotA(ROH_ANGEBOTE.A.dateiname, ROH_ANGEBOTE.A.text) },
      { roh: ROH_ANGEBOTE.B, angebot: normalisiereAngebotB(ROH_ANGEBOTE.B.dateiname, ROH_ANGEBOTE.B.text) },
      { roh: ROH_ANGEBOTE.C, angebot: normalisiereAngebotC(ROH_ANGEBOTE.C.dateiname, ROH_ANGEBOTE.C.text) },
    ],
    []
  );

  return (
    <ScreenLayout>
      <div className="angebote-einlesen">
        <Kicker>Angebote einlesen</Kicker>
        <h1 className="angebote-einlesen-titel">Drei Angebote, drei Formate</h1>
        <p className="angebote-einlesen-unterzeile">
          Epos liest jede Datei wie sie ist und zeigt, was erkannt wurde.
        </p>

        <div className="angebote-einlesen-grid">
          {angebote.map(({ roh, angebot }) => (
            <AngebotKarte key={angebot.lieferantId} roh={roh} angebot={angebot} />
          ))}
        </div>

        <Button onClick={() => geheZu("vergleich")}>Zum Vergleich</Button>
      </div>
    </ScreenLayout>
  );
}
