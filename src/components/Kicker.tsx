import "./Kicker.css";

interface KickerProps {
  children: string;
}

// Kicker-Zeile wie auf Plakat/Anzeige: Helltürkis, normale Groß-/Kleinschreibung
// (kein Tracking/ALL-CAPS — das ist dort nicht so gestaltet).
export function Kicker({ children }: KickerProps) {
  return <p className="kicker">{children}</p>;
}
