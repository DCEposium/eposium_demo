import { Kicker } from "../components/Kicker";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { ScreenLayout } from "../components/ScreenLayout";
import { useDemo } from "../state/DemoContext";
import { BESTELLANFORDERUNG } from "../lib/demodaten";
import { formatDatum, formatEuro, formatZahl } from "../lib/calc/zahlenformat";
import "./Bedarf.css";

export function Bedarf() {
  const { geheZu } = useDemo();
  const ba = BESTELLANFORDERUNG;

  return (
    <ScreenLayout>
      <div className="bedarf">
        <Kicker>Schritt 1 von 3</Kicker>
        <h1 className="bedarf-titel">Was wird gebraucht?</h1>

        <Card titel={ba.artikel} fuss={`Bestellanforderung ${ba.id} vom ${formatDatum(ba.datum)}`}>
          <dl className="bedarf-fakten">
            <div>
              <dt>Menge</dt>
              <dd>
                {formatZahl(ba.menge, 0)} {ba.einheit}
              </dd>
            </div>
            <div>
              <dt>Wunschtermin</dt>
              <dd>{formatDatum(ba.wunschtermin)}</dd>
            </div>
            <div>
              <dt>Lieferort</dt>
              <dd>{ba.lieferort}</dd>
            </div>
            <div>
              <dt>Besteller</dt>
              <dd>{ba.besteller}</dd>
            </div>
            <div>
              <dt>Budgetrahmen</dt>
              <dd>{formatEuro(ba.budgetrahmen_netto_eur)} netto</dd>
            </div>
          </dl>

          <p className="bedarf-anforderungen-titel">Anforderungen</p>
          <ul className="bedarf-anforderungen">
            {ba.anforderungen.map((anforderung) => (
              <li key={anforderung}>{anforderung}</li>
            ))}
          </ul>
        </Card>

        <Button onClick={() => geheZu("angebote")}>Angebote einlesen</Button>
      </div>
    </ScreenLayout>
  );
}
