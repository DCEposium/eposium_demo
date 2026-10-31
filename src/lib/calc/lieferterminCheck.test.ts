import { describe, expect, it } from "vitest";
import { addiereWerktage, pruefeLiefertermin } from "./lieferterminCheck";
import { zuLokalemISODatum } from "./zahlenformat";

describe("addiereWerktage", () => {
  it("überspringt Wochenenden", () => {
    // Montag 2026-11-02 + 5 Werktage = Montag 2026-11-09
    const ergebnis = addiereWerktage(new Date("2026-11-02T00:00:00"), 5);
    expect(zuLokalemISODatum(ergebnis)).toBe("2026-11-09");
  });
});

describe("pruefeLiefertermin", () => {
  it("erkennt, wenn der Wunschtermin erreicht wird", () => {
    const ergebnis = pruefeLiefertermin(
      new Date("2026-10-31T00:00:00"),
      5,
      new Date("2026-11-20T00:00:00")
    );
    expect(ergebnis.erreichtWunschtermin).toBe(true);
  });

  it("erkennt, wenn der Wunschtermin nicht erreicht wird", () => {
    const ergebnis = pruefeLiefertermin(
      new Date("2026-10-31T00:00:00"),
      21,
      new Date("2026-11-05T00:00:00")
    );
    expect(ergebnis.erreichtWunschtermin).toBe(false);
  });
});
