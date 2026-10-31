import type { ReactNode } from "react";
import { PrototypHinweis } from "./PrototypHinweis";
import { ResetButton } from "./ResetButton";

interface ScreenLayoutProps {
  children: ReactNode;
  /** true im Echt-Modus: zeigt "Ihre Daten bleiben im Browser" statt "Prototyp, Beispieldaten". */
  echtModus?: boolean;
}

// Gemeinsamer Rahmen für alle Bildschirme nach Attract: Logo + Reset oben,
// PrototypHinweis unten. Siehe Plan, Bildschirm-Ablauf.
export function ScreenLayout({ children, echtModus = false }: ScreenLayoutProps) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <img className="logo-eposium" src="/brand/logo/eposium-logo-on-dark.svg" alt="Eposium" />
        <ResetButton />
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-header">
        <PrototypHinweis echtModus={echtModus} />
      </footer>
    </div>
  );
}
