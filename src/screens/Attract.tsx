import { Kicker } from "../components/Kicker";
import { PrototypHinweis } from "../components/PrototypHinweis";
import { useDemo } from "../state/DemoContext";
import "./Attract.css";

// Attract-Modus: läuft am Stand, wenn niemand bedient. Großer Startknopf,
// ruhige Animation, kein Ton. Siehe PROMPT.md Funktionsumfang Punkt 1.
export function Attract() {
  const { geheZu } = useDemo();

  return (
    <div className="attract">
      <header className="app-header">
        <img className="logo-eposium" src="/brand/logo/eposium-logo-on-dark.svg" alt="Eposium" />
      </header>

      <main className="attract-mitte faehrt-ein">
        <Kicker>Live-Demo am Stand</Kicker>
        <h1 className="attract-headline">Was kostet Ihren Einkauf die meisten Nerven?</h1>
        <p className="attract-unterzeile">
          Epos vergleicht Angebote, prüft Preise und bereitet Ihre Verhandlung vor. In 2 bis 3
          Minuten sehen Sie, wie.
        </p>
        <button type="button" className="attract-start" onClick={() => geheZu("platzhalter")}>
          Demo starten
        </button>
      </main>

      <footer className="app-header">
        <PrototypHinweis />
      </footer>
    </div>
  );
}
