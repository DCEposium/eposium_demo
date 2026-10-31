import { describe, expect, it } from "vitest";
import { leiteVergleichsvorgabenAb } from "./anforderungen";
import { BESTELLANFORDERUNG } from "./demodaten";

describe("leiteVergleichsvorgabenAb", () => {
  it("liest Mindestgewährleistung und gewünschten Incoterm aus der Bestellanforderung", () => {
    const vorgaben = leiteVergleichsvorgabenAb(BESTELLANFORDERUNG);
    expect(vorgaben.mindestGewaehrleistungMonate).toBe(24);
    expect(vorgaben.gewuenschterIncoterm).toBe("DAP Werk");
  });
});
