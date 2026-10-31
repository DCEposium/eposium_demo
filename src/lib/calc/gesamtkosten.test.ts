import { describe, expect, it } from "vitest";
import { berechneGesamtkosten } from "./gesamtkosten";
import {
  normalisiereAngebotA,
  normalisiereAngebotB,
  normalisiereAngebotC,
} from "../parsers/angebotNormalizer";
import { ROH_ANGEBOTE } from "../demodaten";
import type { GesamtkostenEingabe } from "../types";

// Deckt sich mit der Bestellanforderung BA-2026-0412 und der Handrechnung im Plan.
const EINGABE: GesamtkostenEingabe = {
  bedarfsmenge: 40,
  mindestGewaehrleistungMonate: 24,
  gewuenschterIncoterm: "DAP Werk",
  bestelldatum: new Date("2026-10-31T00:00:00"),
  wunschtermin: new Date("2026-11-20T00:00:00"),
};

describe("Gesamtkosten Angebot A (Nordhaus)", () => {
  const angebot = normalisiereAngebotA(ROH_ANGEBOTE.A.dateiname, ROH_ANGEBOTE.A.text);
  const ergebnis = berechneGesamtkosten(angebot, EINGABE);

  it("bestellt genau die Bedarfsmenge, kein Staffelrabatt bei 40 Stück", () => {
    expect(ergebnis.bestellmenge).toBe(40);
    expect(ergebnis.stueckpreisNetto).toBeCloseTo(38.9);
  });

  it("kommt auf 1.647,50 € (Artikel + Versand + Werkszeugnis)", () => {
    expect(ergebnis.gesamtkostenNetto).toBeCloseTo(1647.5, 2);
  });

  it("hat keine Mengen- oder Zertifikats-Stolperstelle", () => {
    expect(ergebnis.nichtVergleichbarHinweise.find((h) => h.feld === "Menge")).toBeUndefined();
    expect(ergebnis.nichtVergleichbarHinweise.find((h) => h.feld === "Werkszeugnis 3.1")).toBeUndefined();
  });
});

describe("Gesamtkosten Angebot B (Rheinwerk)", () => {
  const angebot = normalisiereAngebotB(ROH_ANGEBOTE.B.dateiname, ROH_ANGEBOTE.B.text);
  const ergebnis = berechneGesamtkosten(angebot, EINGABE);

  it("muss wegen Mindestabnahme 50 statt 40 Stück bestellen", () => {
    expect(ergebnis.bestellmenge).toBe(50);
    expect(ergebnis.ueberschussmenge).toBe(10);
  });

  it("kommt auf ca. 1.743,70 € (50 × 34,87 €, versandkostenfrei)", () => {
    expect(ergebnis.gesamtkostenNetto).toBeCloseTo(1743.7, 1);
    expect(ergebnis.versandkostenNetto).toBe(0);
  });

  it("kostet bezogen auf den Bedarf von 40 Stück ca. 43,59 € je Stück", () => {
    expect(ergebnis.kostenJeBenoetigtemStueck).toBeCloseTo(43.59, 1);
  });

  it("zeigt den Skonto-Effekt separat (ca. 1.708,83 €)", () => {
    expect(ergebnis.skontoEffektNetto).toBeCloseTo(1708.83, 1);
  });

  it("markiert Mengen-, Gewährleistungs- und Zertifikats-Stolperstellen", () => {
    const felder = ergebnis.nichtVergleichbarHinweise.map((h) => h.feld);
    expect(felder).toContain("Menge");
    expect(felder).toContain("Gewährleistung");
    expect(felder).toContain("Werkszeugnis 3.1");
  });
});

describe("Gesamtkosten Angebot C (Nordsee)", () => {
  const angebot = normalisiereAngebotC(ROH_ANGEBOTE.C.dateiname, ROH_ANGEBOTE.C.text);
  const ergebnis = berechneGesamtkosten(angebot, EINGABE);

  it("bestellt genau 4 volle Kartons ohne Überschuss", () => {
    expect(ergebnis.bestellmenge).toBe(40);
    expect(ergebnis.ueberschussmenge).toBe(0);
  });

  it("kommt auf 1.468,00 € (4 × 332,00 € + 140,00 € Fracht)", () => {
    expect(ergebnis.gesamtkostenNetto).toBeCloseTo(1468.0, 2);
  });

  it("ist von den drei Angeboten am günstigsten", () => {
    const a = berechneGesamtkosten(normalisiereAngebotA(ROH_ANGEBOTE.A.dateiname, ROH_ANGEBOTE.A.text), EINGABE);
    const b = berechneGesamtkosten(normalisiereAngebotB(ROH_ANGEBOTE.B.dateiname, ROH_ANGEBOTE.B.text), EINGABE);
    expect(ergebnis.gesamtkostenNetto).toBeLessThan(a.gesamtkostenNetto);
    expect(ergebnis.gesamtkostenNetto).toBeLessThan(b.gesamtkostenNetto);
  });

  it("markiert den abweichenden Incoterm als Stolperstelle", () => {
    expect(ergebnis.nichtVergleichbarHinweise.find((h) => h.feld === "Incoterm")).toBeDefined();
  });

  it("hat keine Gewährleistungs- oder Zertifikats-Stolperstelle", () => {
    expect(ergebnis.nichtVergleichbarHinweise.find((h) => h.feld === "Gewährleistung")).toBeUndefined();
    expect(ergebnis.nichtVergleichbarHinweise.find((h) => h.feld === "Werkszeugnis 3.1")).toBeUndefined();
  });
});
