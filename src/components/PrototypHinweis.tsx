import "./PrototypHinweis.css";

// Pflicht auf jeder Seite laut CLAUDE.md. Echt-Modus bekommt in M6 den
// abweichenden Text "Ihre Daten bleiben im Browser" über die Prop `echtModus`.
export function PrototypHinweis({ echtModus = false }: { echtModus?: boolean }) {
  return (
    <p className="prototyp-hinweis">
      {echtModus ? "Ihre Daten bleiben im Browser" : "Prototyp, Beispieldaten"}
    </p>
  );
}
