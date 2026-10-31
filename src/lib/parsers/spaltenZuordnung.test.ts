import { describe, expect, it } from "vitest";
import { schlageSpaltenZuordnungVor, werteAlleZeilenAus } from "./spaltenZuordnung";

describe("schlageSpaltenZuordnungVor", () => {
  it("erkennt deutsche Kopfzeilen", () => {
    const zuordnung = schlageSpaltenZuordnungVor(["Pos", "Bezeichnung", "Menge", "Einheit", "Preis_netto_EUR"]);
    expect(zuordnung).toEqual({ bezeichnung: 1, menge: 2, einheit: 3, preis: 4 });
  });

  it("erkennt englische Kopfzeilen teilweise", () => {
    const zuordnung = schlageSpaltenZuordnungVor(["item_code", "description", "qty", "unit_price_eur"]);
    expect(zuordnung.bezeichnung).toBe(1);
    expect(zuordnung.menge).toBe(2);
    expect(zuordnung.preis).toBe(3);
  });

  it("erkennt zusammengesetzte Wörter wie 'Artikelbezeichnung'", () => {
    const zuordnung = schlageSpaltenZuordnungVor(["Artikelbezeichnung", "Anzahl", "Einheit", "Stückpreis", "Währung"]);
    expect(zuordnung).toEqual({ bezeichnung: 0, menge: 1, einheit: 2, preis: 3, waehrung: 4 });
  });

  it("lässt unbekannte Spalten unzugeordnet", () => {
    const zuordnung = schlageSpaltenZuordnungVor(["Kommentar", "Interner Code"]);
    expect(zuordnung.bezeichnung).toBeUndefined();
    expect(zuordnung.preis).toBeUndefined();
  });
});

describe("werteAlleZeilenAus", () => {
  const zuordnung = schlageSpaltenZuordnungVor(["Bezeichnung", "Menge", "Preis"]);

  it("wertet saubere Zeilen ohne Unsicherheit aus", () => {
    const [zeile] = werteAlleZeilenAus([["Schraube M6", "100", "0,12"]], zuordnung);
    expect(zeile.unsicher).toBe(false);
    expect(zeile.werte.bezeichnung).toBe("Schraube M6");
  });

  it("markiert Zeilen mit nicht lesbarer Zahl als unsicher", () => {
    const [zeile] = werteAlleZeilenAus([["Schraube M6", "auf Anfrage", "0,12"]], zuordnung);
    expect(zeile.unsicher).toBe(true);
    expect(zeile.unsicherGrund).toContain("Menge");
  });

  it("markiert Zeilen ohne zugeordnete Bezeichnung als unsicher", () => {
    const ohneBezeichnung = schlageSpaltenZuordnungVor(["Menge", "Preis"]);
    const [zeile] = werteAlleZeilenAus([["100", "0,12"]], ohneBezeichnung);
    expect(zeile.unsicher).toBe(true);
    expect(zeile.unsicherGrund).toContain("Bezeichnung");
  });
});
