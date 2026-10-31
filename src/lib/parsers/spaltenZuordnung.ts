import { parseZahl } from "../calc/zahlenformat";

export type Vergleichsfeld = "bezeichnung" | "menge" | "einheit" | "preis" | "waehrung";

export interface Feldinfo {
  feld: Vergleichsfeld;
  label: string;
  suchbegriffe: string[];
}

// Reihenfolge ist Priorität: zuerst eindeutigere Felder zuordnen, damit z. B.
// "Unit Price" nicht fälschlich als Einheit statt als Preis erkannt wird.
export const VERGLEICHSFELDER: Feldinfo[] = [
  { feld: "bezeichnung", label: "Bezeichnung", suchbegriffe: ["bezeichnung", "artikel", "beschreibung", "description", "produkt"] },
  { feld: "menge", label: "Menge", suchbegriffe: ["menge", "qty", "quantity", "anzahl", "stück", "stueck"] },
  { feld: "preis", label: "Preis", suchbegriffe: ["preis", "price", "kosten", "cost", "stückpreis"] },
  { feld: "waehrung", label: "Währung", suchbegriffe: ["währung", "waehrung", "currency", "curr"] },
  { feld: "einheit", label: "Einheit", suchbegriffe: ["einheit", "maßeinheit", "uom"] },
];

export type Spaltenzuordnung = Partial<Record<Vergleichsfeld, number>>;

export interface ErkannteZeile {
  werte: Partial<Record<Vergleichsfeld, string>>;
  unsicher: boolean;
  unsicherGrund?: string;
}

/**
 * Schlägt für eine Kopfzeile unbekannter Herkunft (Echt-Modus-Upload) eine
 * Spaltenzuordnung vor, per Stichwortabgleich auf den Spaltennamen
 * (Teilstring-Suche, damit auch zusammengesetzte Wörter wie
 * "Artikelbezeichnung" erkannt werden). Jede Spalte wird höchstens einem Feld
 * zugeordnet (eine bereits vergebene Spalte scheidet für die übrigen Felder
 * aus). Die Suchbegriffe sind bewusst spezifisch genug gehalten, um nicht
 * zufällig in anderen Wörtern vorzukommen (kein "me" für Einheit, das sonst
 * in "Menge" anschlagen würde; kein "item" für Bezeichnung, das sonst
 * "item_code" statt "description" träfe). Liefert nur Vorschläge — bestätigt
 * wird im Zuordnungsdialog durch die Besucherin oder den Besucher, nie
 * automatisch übernommen.
 */
export function schlageSpaltenZuordnungVor(headerZeile: string[]): Spaltenzuordnung {
  const zuordnung: Spaltenzuordnung = {};
  const vergebeneSpalten = new Set<number>();
  const headerKlein = headerZeile.map((h) => h.toLowerCase());

  for (const { feld, suchbegriffe } of VERGLEICHSFELDER) {
    const treffer = headerKlein.findIndex(
      (h, index) => !vergebeneSpalten.has(index) && suchbegriffe.some((begriff) => h.includes(begriff))
    );
    if (treffer !== -1) {
      zuordnung[feld] = treffer;
      vergebeneSpalten.add(treffer);
    }
  }
  return zuordnung;
}

/**
 * Wertet eine Datenzeile anhand der bestätigten Zuordnung aus und kennzeichnet
 * offen, wenn eine erwartete Zahl nicht lesbar ist oder keine Bezeichnung
 * zugeordnet wurde — siehe PROMPT.md: "Bei Unsicherheit der Erkennung zeigt
 * die Oberfläche das offen an."
 */
export function werteZeileAus(zeile: string[], zuordnung: Spaltenzuordnung): ErkannteZeile {
  const werte: Partial<Record<Vergleichsfeld, string>> = {};
  for (const feld of Object.keys(zuordnung) as Vergleichsfeld[]) {
    const index = zuordnung[feld];
    if (index !== undefined) {
      werte[feld] = zeile[index] ?? "";
    }
  }

  const gruende: string[] = [];
  if (zuordnung.menge !== undefined) {
    try {
      parseZahl(werte.menge ?? "");
    } catch {
      gruende.push("Menge nicht als Zahl erkannt");
    }
  }
  if (zuordnung.preis !== undefined) {
    try {
      parseZahl(werte.preis ?? "");
    } catch {
      gruende.push("Preis nicht als Zahl erkannt");
    }
  }
  if (zuordnung.bezeichnung === undefined || !werte.bezeichnung) {
    gruende.push("Keine Bezeichnung zugeordnet");
  }

  return { werte, unsicher: gruende.length > 0, unsicherGrund: gruende.join("; ") || undefined };
}

export function werteAlleZeilenAus(datenzeilen: string[][], zuordnung: Spaltenzuordnung): ErkannteZeile[] {
  return datenzeilen.map((zeile) => werteZeileAus(zeile, zuordnung));
}
