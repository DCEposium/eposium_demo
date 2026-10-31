import { useMemo, useState } from "react";
import { Kicker } from "../components/Kicker";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { ScreenLayout } from "../components/ScreenLayout";
import { useDemo } from "../state/DemoContext";
import { berechneVergleichsdaten } from "../lib/vergleichsdaten";
import { formatEuro, formatZahl } from "../lib/calc/zahlenformat";
import type { Rolle } from "../lib/types";
import "./Freigabe.css";

const ROLLEN: Rolle[] = ["Einkäufer", "Abteilungsleiter"];

export function Freigabe() {
  const { state, protokolliereUndGeheZu } = useDemo();
  const eintraege = useMemo(() => berechneVergleichsdaten(), []);
  const eintrag = eintraege.find((e) => e.angebot.lieferantId === state.ausgewaehlterLieferantId);

  const [rolle, setRolle] = useState<Rolle>("Abteilungsleiter");
  const [name, setName] = useState("");

  if (!eintrag) {
    return (
      <ScreenLayout>
        <div className="freigabe">
          <Kicker>Freigabe</Kicker>
          <h1 className="freigabe-titel">Kein Lieferant ausgewählt</h1>
          <p>Bitte den Ablauf ab dem Preis-Check erneut durchlaufen.</p>
        </div>
      </ScreenLayout>
    );
  }

  const nameIstGueltig = name.trim().length > 1;

  function entscheide(entscheidung: "freigegeben" | "abgelehnt") {
    protokolliereUndGeheZu(
      entscheidung === "freigegeben" ? "Freigabe erteilt" : "Freigabe abgelehnt",
      { rolle, name: name.trim() },
      {
        lieferantId: eintrag!.angebot.lieferantId,
        lieferantName: eintrag!.lieferantName,
        bestellmenge: eintrag!.ergebnis.bestellmenge,
        gesamtkostenNetto: eintrag!.ergebnis.gesamtkostenNetto,
        entscheidung,
      },
      "audit"
    );
  }

  return (
    <ScreenLayout>
      <div className="freigabe">
        <Kicker>Freigabe</Kicker>
        <h1 className="freigabe-titel">Wer gibt frei?</h1>
        <p className="freigabe-unterzeile">
          Rolle und Name werden mit Zeitstempel im Audit-Protokoll festgehalten.
        </p>

        <Card
          titel={eintrag.lieferantName}
          fuss={`${formatZahl(eintrag.ergebnis.bestellmenge, 0)} Stück für ${formatEuro(eintrag.ergebnis.gesamtkostenNetto)} netto`}
        >
          <div className="freigabe-formular">
            <fieldset className="freigabe-rollen">
              <legend>Rolle</legend>
              {ROLLEN.map((r) => (
                <label key={r} className="freigabe-rolle-option">
                  <input type="radio" name="rolle" checked={rolle === r} onChange={() => setRolle(r)} />
                  {r}
                </label>
              ))}
            </fieldset>

            <label className="freigabe-name-feld">
              Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Vor- und Nachname"
              />
            </label>
          </div>
        </Card>

        <div className="freigabe-aktionen">
          <Button onClick={() => entscheide("freigegeben")} disabled={!nameIstGueltig}>
            Freigeben
          </Button>
          <Button variante="sekundaer" onClick={() => entscheide("abgelehnt")} disabled={!nameIstGueltig}>
            Ablehnen
          </Button>
        </div>
      </div>
    </ScreenLayout>
  );
}
