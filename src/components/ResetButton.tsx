import { useDemo } from "../state/DemoContext";
import "./ResetButton.css";

// Sichtbarer Reset laut Messe-Checkliste. Tastenkürzel Umschalt+Escape siehe
// useResetTastenkuerzel (in App.tsx global registriert).
export function ResetButton() {
  const { reset } = useDemo();
  return (
    <button
      type="button"
      className="reset-button"
      onClick={reset}
      aria-label="Demo zurücksetzen"
      title="Tastenkürzel: Umschalt+Escape"
    >
      Zurücksetzen
    </button>
  );
}
