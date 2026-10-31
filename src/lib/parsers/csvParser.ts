import Papa from "papaparse";

/**
 * Parst Rohtext (CSV/semikolon-getrennt) in Zeilen aus Zellen. Kommentarzeilen,
 * die mit "#" beginnen (siehe FIKTIV-Hinweis in den Rohangeboten), werden
 * übersprungen. Das Trennzeichen wird automatisch erkannt, da die drei
 * mitgelieferten Angebote bewusst unterschiedliche Formate nutzen
 * (Semikolon+Komma-Dezimal vs. Komma+Punkt-Dezimal).
 */
export function parseZeilen(text: string): string[][] {
  const ergebnis = Papa.parse<string[]>(text, {
    delimiter: "",
    comments: "#",
    skipEmptyLines: true,
  });
  return ergebnis.data.map((zeile) => zeile.map((zelle) => zelle.trim()));
}
