import { useMemo, useState } from "react";
import { Kicker } from "../components/Kicker";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { ScreenLayout } from "../components/ScreenLayout";
import { parseZeilen } from "../lib/parsers/csvParser";
import { parseXlsxZeilen } from "../lib/parsers/xlsxParser";
import {
  VERGLEICHSFELDER,
  schlageSpaltenZuordnungVor,
  werteAlleZeilenAus,
  type Spaltenzuordnung,
  type Vergleichsfeld,
} from "../lib/parsers/spaltenZuordnung";
import "./EchtModus.css";

type Phase = "upload" | "zuordnen" | "ergebnis";

export function EchtModus() {
  const [phase, setPhase] = useState<Phase>("upload");
  const [dateiname, setDateiname] = useState<string | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const [alleZeilen, setAlleZeilen] = useState<string[][]>([]);
  const [zuordnung, setZuordnung] = useState<Spaltenzuordnung>({});

  const headerZeile = alleZeilen[0] ?? [];
  const datenzeilen = useMemo(() => alleZeilen.slice(1), [alleZeilen]);
  const erkannteZeilen = useMemo(() => werteAlleZeilenAus(datenzeilen, zuordnung), [datenzeilen, zuordnung]);

  // Lesen passiert ausschließlich im Browser (File-API). Es gibt in diesem
  // Bildschirm keinen einzigen fetch()/XMLHttpRequest-Aufruf — siehe
  // CLAUDE.md: "Ihre Daten bleiben im Browser".
  async function dateiAuswaehlen(datei: File) {
    setFehler(null);
    try {
      let zeilen: string[][];
      if (datei.name.toLowerCase().endsWith(".xlsx") || datei.name.toLowerCase().endsWith(".xls")) {
        zeilen = parseXlsxZeilen(await datei.arrayBuffer());
      } else {
        zeilen = parseZeilen(await datei.text());
      }
      if (zeilen.length < 2) {
        setFehler("Die Datei enthält keine Kopfzeile mit mindestens einer Datenzeile.");
        return;
      }
      setDateiname(datei.name);
      setAlleZeilen(zeilen);
      setZuordnung(schlageSpaltenZuordnungVor(zeilen[0]));
      setPhase("zuordnen");
    } catch {
      setFehler("Datei konnte nicht gelesen werden. Unterstützt werden CSV und XLSX.");
    }
  }

  function zuruecksetzen() {
    setPhase("upload");
    setDateiname(null);
    setFehler(null);
    setAlleZeilen([]);
    setZuordnung({});
  }

  return (
    <ScreenLayout echtModus>
      <div className="echtmodus">
        <Kicker>Echt-Modus</Kicker>
        <h1 className="echtmodus-titel">Testen Sie es mit Ihrer eigenen Datei</h1>
        <p className="echtmodus-unterzeile">
          CSV oder XLSX, ein bis zwei Dateien. Das Lesen passiert ausschließlich in diesem Browser.
        </p>

        {phase === "upload" && (
          <div className="echtmodus-upload">
            <label className="echtmodus-dropzone">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => {
                  const datei = e.target.files?.[0];
                  if (datei) void dateiAuswaehlen(datei);
                }}
              />
              Datei auswählen (CSV oder XLSX)
            </label>
            {fehler && <Badge variante="hinweis">{fehler}</Badge>}
          </div>
        )}

        {phase === "zuordnen" && (
          <div className="echtmodus-zuordnung">
            <p className="echtmodus-dateiname">{dateiname}</p>
            <p className="echtmodus-hinweis">
              Prüfen Sie die vorgeschlagene Zuordnung und passen Sie sie bei Bedarf an.
            </p>
            <div className="echtmodus-zuordnung-grid">
              {VERGLEICHSFELDER.map(({ feld, label }) => (
                <label key={feld} className="echtmodus-zuordnung-feld">
                  {label}
                  <select
                    value={zuordnung[feld] ?? ""}
                    onChange={(e) => {
                      const wert = e.target.value;
                      setZuordnung((z: Spaltenzuordnung) => {
                        const kopie: Spaltenzuordnung = { ...z };
                        if (wert === "") {
                          delete kopie[feld as Vergleichsfeld];
                        } else {
                          kopie[feld as Vergleichsfeld] = Number(wert);
                        }
                        return kopie;
                      });
                    }}
                  >
                    <option value="">— keine —</option>
                    {headerZeile.map((spalte, index) => (
                      <option key={index} value={index}>
                        {spalte || `Spalte ${index + 1}`}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <Button onClick={() => setPhase("ergebnis")}>Übernehmen</Button>
          </div>
        )}

        {phase === "ergebnis" && (
          <div className="echtmodus-ergebnis">
            <p className="echtmodus-dateiname">{dateiname}</p>
            <div className="echtmodus-tabelle-rahmen">
              <table className="echtmodus-tabelle">
                <thead>
                  <tr>
                    {VERGLEICHSFELDER.filter(({ feld }) => zuordnung[feld] !== undefined).map(({ feld, label }) => (
                      <th key={feld}>{label}</th>
                    ))}
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {erkannteZeilen.map((zeile, index) => (
                    <tr key={index} className={zeile.unsicher ? "ist-unsicher" : ""}>
                      {VERGLEICHSFELDER.filter(({ feld }) => zuordnung[feld] !== undefined).map(({ feld }) => (
                        <td key={feld}>{zeile.werte[feld] ?? ""}</td>
                      ))}
                      <td>
                        {zeile.unsicher ? (
                          <Badge variante="hinweis">Prüfen Sie diese Zeile: {zeile.unsicherGrund}</Badge>
                        ) : (
                          <Badge variante="erfuellt">erkannt</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button variante="sekundaer" onClick={zuruecksetzen}>
              Andere Datei laden
            </Button>
          </div>
        )}
      </div>
    </ScreenLayout>
  );
}
