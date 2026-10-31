import { describe, expect, it } from "vitest";
import { pruefePreis, berechneBranchentrend } from "./preisCheck";
import { parseHistorischePreise } from "../parsers/historischePreiseParser";
import { HISTORISCHE_PREISE_ROH, EUROSTAT_CACHE } from "../demodaten";

const HISTORIE = parseHistorischePreise(HISTORISCHE_PREISE_ROH);

describe("pruefePreis", () => {
  it("erkennt den Aufwärtstrend bei Nordhaus (Angebot A, 38,90 € vs. zuletzt 37,90 €)", () => {
    const ergebnis = pruefePreis("L-001", "Nordhaus Antriebstechnik GmbH", 38.9, HISTORIE);
    expect(ergebnis.anzahlHistorischerDatenpunkte).toBe(3);
    expect(ergebnis.veraenderungProzent).toBeCloseTo(2.6, 1);
  });

  it("erkennt den nahezu unveränderten Preis bei Rheinwerk (34,87 € vs. 34,90 €)", () => {
    const ergebnis = pruefePreis("L-002", "Rheinwerk Industriebedarf KG", 34.87, HISTORIE);
    expect(ergebnis.anzahlHistorischerDatenpunkte).toBe(1);
    expect(Math.abs(ergebnis.veraenderungProzent ?? 100)).toBeLessThan(1);
    expect(ergebnis.einschaetzung).toContain("einzelner Vergleichswert");
  });

  it("erkennt den leichten Anstieg bei Nordsee (33,20 € vs. 32,40 €)", () => {
    const ergebnis = pruefePreis("L-003", "Nordsee Components B.V.", 33.2, HISTORIE);
    expect(ergebnis.veraenderungProzent).toBeCloseTo(2.5, 1);
  });

  it("meldet fehlende Historie für unbekannte Lieferanten ehrlich", () => {
    const ergebnis = pruefePreis("L-999", "Unbekannt GmbH", 10, HISTORIE);
    expect(ergebnis.anzahlHistorischerDatenpunkte).toBe(0);
  });
});

describe("berechneBranchentrend", () => {
  it("berechnet die Veränderung über die gecachte Eurostat-Reihe", () => {
    const trend = berechneBranchentrend(EUROSTAT_CACHE.daten);
    expect(trend).not.toBeNull();
    expect(trend!.veraenderungProzent).toBeGreaterThan(0);
  });
});
