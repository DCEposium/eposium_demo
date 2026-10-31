import { describe, expect, it } from "vitest";
import { erzeugeBriefing } from "./briefing";
import { berechneVergleichsdaten } from "./vergleichsdaten";
import { BESTELLANFORDERUNG, LIEFERANTEN } from "./demodaten";

const EINTRAEGE = berechneVergleichsdaten(new Date("2026-10-31T00:00:00"));

describe("erzeugeBriefing", () => {
  it("erzeugt für Angebot B (mit Stolperstellen) Fragen zu allen nicht erfüllten Anforderungen", () => {
    const eintragB = EINTRAEGE.find((e) => e.angebot.lieferantId === "L-002")!;
    const lieferant = LIEFERANTEN.find((l) => l.id === "L-002")!;
    const briefing = erzeugeBriefing(eintragB, EINTRAEGE, lieferant, BESTELLANFORDERUNG);

    expect(briefing.fragenAnLieferant.length).toBe(eintragB.ergebnis.nichtVergleichbarHinweise.length);
    expect(briefing.argumente.some((a) => a.includes("Gewährleistung"))).toBe(true);
    expect(briefing.emailEntwurf).toContain(eintragB.lieferantName);
    expect(briefing.emailEntwurf).toContain(BESTELLANFORDERUNG.id);
  });

  it("schlägt für das günstigste, anforderungskonforme Angebot trotzdem einen Zielpreis vor", () => {
    const eintragC = EINTRAEGE.find((e) => e.angebot.lieferantId === "L-003")!;
    const lieferant = LIEFERANTEN.find((l) => l.id === "L-003")!;
    const briefing = erzeugeBriefing(eintragC, EINTRAEGE, lieferant, BESTELLANFORDERUNG);

    expect(briefing.zielpreisNetto).toBeGreaterThan(0);
    expect(briefing.ziele.length).toBeGreaterThan(0);
  });

  it("bietet einen Rahmenvertrag an, wenn noch keiner besteht", () => {
    const eintragC = EINTRAEGE.find((e) => e.angebot.lieferantId === "L-003")!;
    const lieferant = LIEFERANTEN.find((l) => l.id === "L-003")!;
    expect(lieferant.rahmenvertrag).toBe(false);
    const briefing = erzeugeBriefing(eintragC, EINTRAEGE, lieferant, BESTELLANFORDERUNG);
    expect(briefing.zugestaendnisse.some((z) => z.includes("Rahmenvertrag"))).toBe(true);
  });
});
