import { describe, expect, it } from "vitest";
import { erzeugeNaechstenEintrag, pruefeKette, zuJSON, zuCSV, GENESIS_HASH } from "./hashKette";
import type { AuditEintrag } from "../types";

async function baueBeispielkette(): Promise<AuditEintrag[]> {
  let kette: AuditEintrag[] = [];
  kette = [...kette, await erzeugeNaechstenEintrag(kette, "Verhandlungsbriefing abgeschlossen", { rolle: "System", name: "Epos" }, { lieferantId: "L-003" })];
  kette = [...kette, await erzeugeNaechstenEintrag(kette, "Freigabe erteilt", { rolle: "Abteilungsleiter", name: "M. Beispiel" }, { lieferantId: "L-003", gesamtkostenNetto: 1468 })];
  return kette;
}

describe("Hash-Kette", () => {
  it("verkettet den ersten Eintrag an den Genesis-Hash", async () => {
    const kette = await baueBeispielkette();
    expect(kette[0].hashVorgaenger).toBe(GENESIS_HASH);
    expect(kette[1].hashVorgaenger).toBe(kette[0].hashAktuell);
  });

  it("erzeugt 64-stellige Hex-Hashes (SHA-256)", async () => {
    const kette = await baueBeispielkette();
    expect(kette[0].hashAktuell).toMatch(/^[0-9a-f]{64}$/);
  });

  it("eine unveränderte Kette ist gültig", async () => {
    const kette = await baueBeispielkette();
    const ergebnis = await pruefeKette(kette);
    expect(ergebnis).toEqual({ gueltig: true, ersterFehlerIndex: null });
  });

  it("erkennt eine manipulierte Kette ab dem veränderten Eintrag", async () => {
    const kette = await baueBeispielkette();
    const manipuliert = kette.map((e, i) => (i === 1 ? { ...e, daten: { ...e.daten, gesamtkostenNetto: 1 } } : e));
    const ergebnis = await pruefeKette(manipuliert);
    expect(ergebnis.gueltig).toBe(false);
    expect(ergebnis.ersterFehlerIndex).toBe(1);
  });

  it("exportiert als JSON und CSV", async () => {
    const kette = await baueBeispielkette();
    const json = JSON.parse(zuJSON(kette));
    expect(json).toHaveLength(2);

    const csv = zuCSV(kette);
    const zeilen = csv.split("\n");
    expect(zeilen).toHaveLength(3); // Kopfzeile + 2 Einträge
    expect(zeilen[0]).toContain("hashAktuell");
  });
});
