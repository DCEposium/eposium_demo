import { useDemo } from "../state/DemoContext";
import "./ResetButton.css";

// Sichtbarer Reset laut Messe-Checkliste. Tastenkürzel folgt in M7 zusammen mit
// dem Inaktivitäts-Rücksprung (gleicher Reset-Pfad).
export function ResetButton() {
  const { reset } = useDemo();
  return (
    <button type="button" className="reset-button" onClick={reset} aria-label="Demo zurücksetzen">
      Zurücksetzen
    </button>
  );
}
