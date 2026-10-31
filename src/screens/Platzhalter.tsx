import { Card } from "../components/Card";
import { PrototypHinweis } from "../components/PrototypHinweis";
import { ResetButton } from "../components/ResetButton";
import "./Platzhalter.css";

// Navigationsgerüst für M1. Wird in M2 durch den echten Bedarf-Screen ersetzt
// (Anzeige von data/bestellanforderung.json).
export function Platzhalter() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <img className="logo-eposium" src="/brand/logo/eposium-logo-on-dark.svg" alt="Eposium" />
        <ResetButton />
      </header>
      <main className="app-main platzhalter-main">
        <Card titel="Nächster Schritt folgt" fuss="Bedarf, Angebote und Vergleich kommen in Meilenstein 2 und 3">
          <p>Das Navigationsgerüst steht. Hier erscheint als Nächstes die Bestellanforderung.</p>
        </Card>
      </main>
      <footer className="app-header">
        <PrototypHinweis />
      </footer>
    </div>
  );
}
