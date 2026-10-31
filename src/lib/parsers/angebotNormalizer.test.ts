import { describe, expect, it } from "vitest";
import { normalisiereAngebotA, normalisiereAngebotB, normalisiereAngebotC } from "./angebotNormalizer";
import { ROH_ANGEBOTE } from "../demodaten";

describe("normalisiereAngebotA (Nordhaus)", () => {
  const angebot = normalisiereAngebotA(ROH_ANGEBOTE.A.dateiname, ROH_ANGEBOTE.A.text);

  it("liest den Basispreis und den Staffelpreis", () => {
    expect(angebot.preisstaffeln).toEqual([
      { abMenge: 1, stueckpreisNetto: 38.9 },
      { abMenge: 100, stueckpreisNetto: 36.4 },
    ]);
  });

  it("liest Lieferzeit, Zahlungsziel, Gewährleistung, Versand", () => {
    expect(angebot.lieferzeitWerktage).toBe(14);
    expect(angebot.zahlungszielTage).toBe(30);
    expect(angebot.gewaehrleistungMonate).toBe(24);
    expect(angebot.versandkostenNetto).toBeCloseTo(85.0);
  });

  it("erkennt das kostenpflichtige Werkszeugnis 3.1 und macht die Annahme sichtbar", () => {
    expect(angebot.zertifikat31).toEqual({ verfuegbar: true, inklusive: false, kostenNetto: 6.5 });
    expect(angebot.annahmen.length).toBeGreaterThan(0);
  });

  it("liest die Angebotsnummer aus der Kommentarzeile", () => {
    expect(angebot.angebotsnummer).toBe("ANG-77310");
  });
});

describe("normalisiereAngebotB (Rheinwerk)", () => {
  const angebot = normalisiereAngebotB(ROH_ANGEBOTE.B.dateiname, ROH_ANGEBOTE.B.text);

  it("rechnet brutto in netto um", () => {
    expect(angebot.preisstaffeln[0].stueckpreisNetto).toBeCloseTo(34.87, 2);
  });

  it("erkennt die Mindestabnahme über dem späteren Bedarf", () => {
    expect(angebot.mindestmenge).toBe(50);
  });

  it("liest Skonto und Zahlungsziel", () => {
    expect(angebot.skontoProzent).toBe(2);
    expect(angebot.skontoFristTage).toBe(14);
    expect(angebot.zahlungszielTage).toBe(30);
  });

  it("erkennt die Versandkosten-Freigrenze und rechnet sie auf netto um", () => {
    expect(angebot.versandkostenfreiAbWarenwert).toBeCloseTo(500 / 1.19, 2);
    expect(angebot.versandkostenNetto).toBeCloseTo(12.9 / 1.19, 2);
  });

  it("erkennt die nur 12 Monate Gewährleistung und das fehlende Werkszeugnis 3.1", () => {
    expect(angebot.gewaehrleistungMonate).toBe(12);
    expect(angebot.zertifikat31.verfuegbar).toBe(false);
  });
});

describe("normalisiereAngebotC (Nordsee)", () => {
  const angebot = normalisiereAngebotC(ROH_ANGEBOTE.C.dateiname, ROH_ANGEBOTE.C.text);

  it("rechnet den Kartonpreis auf einen Stückpreis um", () => {
    expect(angebot.kartoneinheit).toBe(10);
    expect(angebot.preisstaffeln[0].stueckpreisNetto).toBeCloseTo(33.2, 2);
  });

  it("liest die separate Fracht und den abweichenden Incoterm", () => {
    expect(angebot.versandkostenNetto).toBeCloseTo(140.0);
    expect(angebot.incoterm).toBe("FCA Venlo");
  });

  it("erkennt das inklusive Werkszeugnis 3.1 und die 24 Monate Gewährleistung", () => {
    expect(angebot.zertifikat31).toEqual({ verfuegbar: true, inklusive: true });
    expect(angebot.gewaehrleistungMonate).toBe(24);
  });

  it("liest die längste Lieferzeit der drei Angebote", () => {
    expect(angebot.lieferzeitWerktage).toBe(21);
  });
});
