import type { Bestellanforderung } from "./types";

/**
 * Liest die strukturierten Vergleichsvorgaben aus den freien Anforderungstexten
 * der Bestellanforderung (z. B. "Gewährleistung mindestens 24 Monate"). Passt
 * zur konkreten Formulierung in data/bestellanforderung.json — kein
 * allgemeiner Freitext-Parser, sondern bewusst auf dieses Dokument
 * zugeschnitten, damit nichts hartkodiert werden muss.
 */
export function leiteVergleichsvorgabenAb(ba: Bestellanforderung): {
  mindestGewaehrleistungMonate: number;
  gewuenschterIncoterm: string;
} {
  const gewaehrleistungstext = ba.anforderungen.find((a) => /Gewährleistung/i.test(a));
  const lieferungstext = ba.anforderungen.find((a) => /^Lieferung/i.test(a));

  const gewaehrleistungTreffer = gewaehrleistungstext?.match(/(\d+)\s*Monate/);
  if (!gewaehrleistungTreffer) {
    throw new Error("Gewährleistungs-Anforderung nicht in der Bestellanforderung gefunden");
  }
  if (!lieferungstext) {
    throw new Error("Liefer-/Incoterm-Anforderung nicht in der Bestellanforderung gefunden");
  }

  return {
    mindestGewaehrleistungMonate: Number.parseInt(gewaehrleistungTreffer[1], 10),
    gewuenschterIncoterm: lieferungstext.replace(/^Lieferung\s+/i, ""),
  };
}
