import { describe, expect, it } from "vitest";
import { parseZahl, parseErsteGanzzahl, formatEuro, formatZahl, formatDatum } from "./zahlenformat";

describe("parseZahl", () => {
  it("liest deutsche Schreibweise (Komma als Dezimaltrennzeichen)", () => {
    expect(parseZahl("38,90")).toBeCloseTo(38.9);
    expect(parseZahl("1.234,56")).toBeCloseTo(1234.56);
  });

  it("liest englische Schreibweise (Punkt als Dezimaltrennzeichen)", () => {
    expect(parseZahl("332.00")).toBeCloseTo(332.0);
    expect(parseZahl("1,234.56")).toBeCloseTo(1234.56);
  });

  it("ignoriert Begleittext um die Zahl", () => {
    expect(parseZahl("500 EUR")).toBeCloseTo(500);
  });

  it("wirft bei nicht lesbaren Werten", () => {
    expect(() => parseZahl("auf Anfrage")).toThrow();
  });
});

describe("parseErsteGanzzahl", () => {
  it("findet die erste Zahl in einem Satz", () => {
    expect(parseErsteGanzzahl("14 Werktage ab Bestellung")).toBe(14);
    expect(parseErsteGanzzahl("21 working days")).toBe(21);
  });
});

describe("Formatierung (deutsch)", () => {
  it("formatiert Euro-Beträge", () => {
    // Je nach ICU-Version nutzt Intl ein schmales geschütztes Leerzeichen vor "€";
    // auf normales Leerzeichen vereinheitlichen, um nicht von der Node-Version abzuhängen.
    expect(formatEuro(1647.5).replace(/\s/g, " ")).toBe("1.647,50 €");
  });

  it("formatiert Zahlen ohne Währung", () => {
    expect(formatZahl(43.5912, 2)).toBe("43,59");
  });

  it("formatiert ISO-Daten deutsch", () => {
    expect(formatDatum("2026-11-20")).toBe("20.11.2026");
  });
});
