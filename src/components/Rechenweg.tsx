import "./Rechenweg.css";

interface RechenwegProps {
  schritte: string[];
}

// Aufklappen für die nachvollziehbare Formel hinter einer Zahl.
// Siehe CLAUDE.md: "Rechnen statt behaupten ... Formel sichtbar".
export function Rechenweg({ schritte }: RechenwegProps) {
  return (
    <details className="rechenweg">
      <summary>Wie wurde das berechnet?</summary>
      <ol className="rechenweg-liste">
        {schritte.map((schritt, index) => (
          <li key={index}>{schritt}</li>
        ))}
      </ol>
    </details>
  );
}
