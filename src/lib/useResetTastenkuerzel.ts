import { useEffect } from "react";

/**
 * Tastenkürzel Umschalt+Escape setzt die Demo zurück — zusätzlich zum
 * sichtbaren "Zurücksetzen"-Knopf (siehe docs/MESSE_CHECKLISTE.md: "Reset-
 * Taste sichtbar UND per Tastenkürzel"). Bewusst eine Kombination, die
 * Besucher nicht versehentlich beim Tippen auslösen.
 */
export function useResetTastenkuerzel(reset: () => void) {
  useEffect(() => {
    function aufTastendruck(ereignis: KeyboardEvent) {
      if (ereignis.key === "Escape" && ereignis.shiftKey) {
        reset();
      }
    }
    window.addEventListener("keydown", aufTastendruck);
    return () => window.removeEventListener("keydown", aufTastendruck);
  }, [reset]);
}
