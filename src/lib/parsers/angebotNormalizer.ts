import { parseZeilen } from "./csvParser";
import { parseZahl, parseErsteGanzzahl } from "../calc/zahlenformat";
import type { NormalisiertesAngebot } from "../types";

/** Erste Zeile, bei der zelle[spalte] mit `muster` beginnt (ohne Beachtung von Groß-/Kleinschreibung). */
function findeZeile(zeilen: string[][], spalte: number, muster: string): string[] | undefined {
  return zeilen.find((zeile) => zeile[spalte]?.toLowerCase().startsWith(muster.toLowerCase()));
}

function erwarteZeile(zeilen: string[][], spalte: number, muster: string, kontext: string): string[] {
  const zeile = findeZeile(zeilen, spalte, muster);
  if (!zeile) {
    throw new Error(`${kontext}: Zeile mit "${muster}" in Spalte ${spalte} nicht gefunden`);
  }
  return zeile;
}

/** Angebot A: Nordhaus Antriebstechnik — Semikolon/deutsches Komma, Staffelpreis, Werkszeugnis kostenpflichtig. */
export function normalisiereAngebotA(dateiname: string, text: string): NormalisiertesAngebot {
  const zeilen = parseZeilen(text);

  const hauptzeile = erwarteZeile(zeilen, 0, "1", "Angebot A");
  const staffelzeile = findeZeile(zeilen, 0, "1a");
  const versandzeile = erwarteZeile(zeilen, 1, "Versandkostenpauschale", "Angebot A");
  const lieferzeitzeile = erwarteZeile(zeilen, 1, "Lieferzeit", "Angebot A");
  const zahlungzeile = erwarteZeile(zeilen, 1, "Zahlungsbedingungen", "Angebot A");
  const gewaehrleistungzeile = erwarteZeile(zeilen, 1, "Gewährleistung", "Angebot A");
  const werkszeugniszeile = erwarteZeile(zeilen, 1, "Werkszeugnis 3.1", "Angebot A");

  const annahmen: string[] = [
    "Werkszeugnis 3.1 wird 1x je Bestellung berechnet (Rohtext nennt nur einen Preis je Zeugnis, keine Stückzahl).",
  ];

  const preisstaffeln = [{ abMenge: 1, stueckpreisNetto: parseZahl(hauptzeile[4]) }];
  if (staffelzeile) {
    preisstaffeln.push({ abMenge: parseZahl(staffelzeile[2]), stueckpreisNetto: parseZahl(staffelzeile[4]) });
  }

  // "auf Anfrage, 6,50 EUR je Zeugnis": die Zelle ist ein Fließtext mit eingebettetem
  // Preis, nicht direkt mit parseZahl auswertbar (das stünde dann im "Anfrage,"-Komma).
  const werkszeugnisTreffer = werkszeugniszeile[4].match(/([\d.,]+)\s*EUR/);
  if (!werkszeugnisTreffer) {
    throw new Error("Angebot A: Werkszeugnis-Preis nicht erkannt");
  }

  return {
    lieferantId: "L-001",
    angebotsnummer: extrahiereAngebotsnummer(text, /Angebotsnr\.\s*([^\s,]+)/),
    preisstaffeln,
    incoterm: "DAP Werk",
    lieferzeitWerktage: parseErsteGanzzahl(lieferzeitzeile[4]),
    zahlungszielTage: parseErsteGanzzahl(zahlungzeile[4]),
    gewaehrleistungMonate: parseErsteGanzzahl(gewaehrleistungzeile[4]),
    zertifikat31: { verfuegbar: true, inklusive: false, kostenNetto: parseZahl(werkszeugnisTreffer[1]) },
    versandkostenNetto: parseZahl(versandzeile[4]),
    annahmen,
    rohquelle: { dateiname, text },
  };
}

/** Angebot B: Rheinwerk — Preise brutto, Mindestabnahme über Bedarf, Skonto, Zertifikat nicht lieferbar. */
export function normalisiereAngebotB(dateiname: string, text: string): NormalisiertesAngebot {
  const zeilen = parseZeilen(text);

  const hauptzeile = zeilen[1]; // erste Datenzeile nach der Kopfzeile
  const zahlungzeile = erwarteZeile(zeilen, 0, "Zahlung", "Angebot B");
  const gewaehrleistungzeile = erwarteZeile(zeilen, 0, "Gewährleistung", "Angebot B");
  const zertifikatzeile = erwarteZeile(zeilen, 0, "Zertifikate", "Angebot B");

  const mwstFaktor = 1.19; // "Preise inkl. 19% MwSt." laut Rohtext
  const preisBrutto = parseZahl(hauptzeile[3]);
  const preisNetto = preisBrutto / mwstFaktor;

  const skontoTreffer = zahlungzeile[1].match(/(\d+)\s*Tage\s*(\d+)\s*%\s*Skonto/i);
  const nettoTreffer = zahlungzeile[1].match(/(\d+)\s*Tage\s*netto/i);

  const versandTreffer = hauptzeile[5].match(/frei ab\s*([\d.,]+)\s*EUR.*sonst\s*([\d.,]+)\s*EUR/i);
  if (!versandTreffer) {
    throw new Error("Angebot B: Versandregel nicht erkannt");
  }

  const zertifikatVerfuegbar = !/nicht lieferbar/i.test(zertifikatzeile[1]);

  return {
    lieferantId: "L-002",
    angebotsnummer: extrahiereAngebotsnummer(text, /Angebot (\d{4}\/\d{2}-\d+)/),
    preisstaffeln: [{ abMenge: 1, stueckpreisNetto: preisNetto }],
    mindestmenge: parseZahl(hauptzeile[2]),
    incoterm: "ab Lager Rheinwerk (nicht spezifiziert)",
    lieferzeitWerktage: parseErsteGanzzahl(hauptzeile[4]),
    zahlungszielTage: nettoTreffer ? Number.parseInt(nettoTreffer[1], 10) : 0,
    skontoProzent: skontoTreffer ? Number.parseInt(skontoTreffer[2], 10) : undefined,
    skontoFristTage: skontoTreffer ? Number.parseInt(skontoTreffer[1], 10) : undefined,
    gewaehrleistungMonate: parseErsteGanzzahl(gewaehrleistungzeile[1]),
    zertifikat31: { verfuegbar: zertifikatVerfuegbar, inklusive: false },
    versandkostenNetto: parseZahl(versandTreffer[2]) / mwstFaktor,
    versandkostenfreiAbWarenwert: parseZahl(versandTreffer[1]) / mwstFaktor,
    annahmen: [
      "Skonto und Versandkostenfreigrenze werden auf den aus brutto umgerechneten Nettobetrag angewendet (Rohtext nennt nur Bruttowerte).",
    ],
    rohquelle: { dateiname, text },
  };
}

/** Angebot C: Nordsea Components — englisch, Komma-getrennt, Kartonpreis, Fracht separat, FCA statt DAP. */
export function normalisiereAngebotC(dateiname: string, text: string): NormalisiertesAngebot {
  const zeilen = parseZeilen(text);

  const hauptzeile = zeilen[1];
  const frachtzeile = erwarteZeile(zeilen, 0, "freight", "Angebot C");
  const lieferzeitzeile = erwarteZeile(zeilen, 0, "lead_time", "Angebot C");
  const zahlungzeile = erwarteZeile(zeilen, 0, "payment_terms", "Angebot C");
  const gewaehrleistungzeile = erwarteZeile(zeilen, 0, "warranty", "Angebot C");
  const zertifikatzeile = erwarteZeile(zeilen, 0, "certificates", "Angebot C");

  const kartoneinheit = parseZahl(hauptzeile[3]);
  const preisJeKarton = parseZahl(hauptzeile[4]);

  return {
    lieferantId: "L-003",
    angebotsnummer: extrahiereAngebotsnummer(text, /Quote\s*([^\s,]+)/),
    preisstaffeln: [{ abMenge: 1, stueckpreisNetto: preisJeKarton / kartoneinheit }],
    kartoneinheit,
    incoterm: hauptzeile[5],
    lieferzeitWerktage: parseErsteGanzzahl(lieferzeitzeile[1]),
    zahlungszielTage: parseErsteGanzzahl(zahlungzeile[1]),
    gewaehrleistungMonate: parseErsteGanzzahl(gewaehrleistungzeile[1]),
    zertifikat31: { verfuegbar: true, inklusive: /included/i.test(zertifikatzeile[1]) },
    versandkostenNetto: parseZahl(frachtzeile[4]),
    annahmen: [
      "Lieferung nur in vollen Kartons à " + kartoneinheit + " Stück möglich; bei Bedarfsmengen ohne Rest ergibt sich kein Überschuss.",
    ],
    rohquelle: { dateiname, text },
  };
}

// Die Angebotsnummer steht in der mit "#" beginnenden Kommentarzeile, die
// papaparse (comments: "#") beim Parsen der Datenzeilen bewusst entfernt.
// Deshalb hier auf dem Rohtext suchen, nicht auf den geparsten Zeilen.
function extrahiereAngebotsnummer(text: string, muster: RegExp): string {
  const treffer = text.match(muster);
  return treffer ? treffer[1] : "unbekannt";
}
