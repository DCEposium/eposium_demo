import { useState } from "react";
import { Kicker } from "../components/Kicker";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { ScreenLayout } from "../components/ScreenLayout";
import { useDemo } from "../state/DemoContext";
import { pruefeKette, zuJSON, zuCSV, type PruefErgebnis } from "../lib/audit/hashKette";
import "./AuditProtokoll.css";

function ladeDatei(inhalt: string, dateiname: string, typ: string) {
  const blob = new Blob([inhalt], { type: typ });
  const url = URL.createObjectURL(blob);
  const anker = document.createElement("a");
  anker.href = url;
  anker.download = dateiname;
  anker.click();
  URL.revokeObjectURL(url);
}

function kurzerHash(hash: string): string {
  return `${hash.slice(0, 8)}…${hash.slice(-8)}`;
}

export function AuditProtokoll() {
  const { state, manipuliereAuditEintrag } = useDemo();
  const [pruefErgebnis, setPruefErgebnis] = useState<PruefErgebnis | null>(null);
  const [prueftGerade, setPrueftGerade] = useState(false);

  async function pruefen() {
    setPrueftGerade(true);
    const ergebnis = await pruefeKette(state.auditKette);
    setPruefErgebnis(ergebnis);
    setPrueftGerade(false);
  }

  return (
    <ScreenLayout>
      <div className="audit">
        <Kicker>Audit-Protokoll</Kicker>
        <h1 className="audit-titel">Lückenlos verkettet</h1>
        <p className="audit-unterzeile">
          Jeder Eintrag ist mit SHA-256 an den vorherigen gekettet (Web Crypto, lokal im Browser).
          Verkettet und prüfbar — mehr wird hier nicht behauptet.
        </p>

        <div className="audit-liste">
          {state.auditKette.map((eintrag) => (
            <div className="audit-eintrag" key={eintrag.index}>
              <div className="audit-eintrag-kopf">
                <span className="audit-eintrag-index">#{eintrag.index}</span>
                <span className="audit-eintrag-ereignis">{eintrag.ereignis}</span>
                <span className="audit-eintrag-zeit">{new Date(eintrag.zeitstempel).toLocaleString("de-DE")}</span>
              </div>
              <p className="audit-eintrag-akteur">
                {eintrag.akteur.rolle}: {eintrag.akteur.name}
              </p>
              <p className="audit-eintrag-hash">Hash: {kurzerHash(eintrag.hashAktuell)}</p>
            </div>
          ))}
          {state.auditKette.length === 0 && <p className="audit-leer">Noch keine Ereignisse protokolliert.</p>}
        </div>

        <div className="audit-pruefung">
          <Button onClick={pruefen} disabled={prueftGerade || state.auditKette.length === 0}>
            {prueftGerade ? "Prüft …" : "Kette prüfen"}
          </Button>
          <Button
            variante="sekundaer"
            onClick={() => manipuliereAuditEintrag(0)}
            disabled={state.auditKette.length === 0}
          >
            Manipulation an Eintrag #0 simulieren
          </Button>
          {pruefErgebnis && (
            <Badge variante={pruefErgebnis.gueltig ? "erfuellt" : "hinweis"}>
              {pruefErgebnis.gueltig
                ? "Kette gültig: kein Eintrag wurde verändert."
                : `Kette verletzt ab Eintrag #${pruefErgebnis.ersterFehlerIndex}: Hash stimmt nicht mehr überein.`}
            </Badge>
          )}
        </div>

        <div className="audit-export">
          <Button
            variante="sekundaer"
            onClick={() => ladeDatei(zuJSON(state.auditKette), "audit-protokoll.json", "application/json")}
            disabled={state.auditKette.length === 0}
          >
            Export JSON
          </Button>
          <Button
            variante="sekundaer"
            onClick={() => ladeDatei(zuCSV(state.auditKette), "audit-protokoll.csv", "text/csv")}
            disabled={state.auditKette.length === 0}
          >
            Export CSV
          </Button>
        </div>

        <Button disabled>Abschluss folgt in Meilenstein 7</Button>
      </div>
    </ScreenLayout>
  );
}
