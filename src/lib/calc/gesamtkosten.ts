import type { GesamtkostenEingabe, Gesamtkostenergebnis, NormalisiertesAngebot } from "../types";
import { formatEuro, formatZahl, formatDatumAusDate } from "./zahlenformat";
import { pruefeLiefertermin } from "./lieferterminCheck";

function waehleStueckpreis(angebot: NormalisiertesAngebot, bestellmenge: number): number {
  const passende = angebot.preisstaffeln
    .filter((stufe) => stufe.abMenge <= bestellmenge)
    .sort((a, b) => b.abMenge - a.abMenge);
  return passende[0].stueckpreisNetto;
}

/**
 * Rechnet ein normalisiertes Angebot auf die Gesamtkosten für eine konkrete
 * Bedarfsmenge hoch. Jeder Schritt wird als lesbarer Rechenweg-Text mitgeführt
 * (siehe CLAUDE.md: "Rechnen statt behaupten", Formel sichtbar in der
 * Oberfläche). Erwartungswerte für die drei mitgelieferten Angebote stehen im
 * Plan und in gesamtkosten.test.ts.
 */
export function berechneGesamtkosten(
  angebot: NormalisiertesAngebot,
  eingabe: GesamtkostenEingabe
): Gesamtkostenergebnis {
  const rechenweg: string[] = [];
  const { bedarfsmenge } = eingabe;

  // 1) Bestellmenge: Kartonrundung zuerst, dann Mindestabnahme sicherstellen.
  let bestellmenge = bedarfsmenge;
  if (angebot.kartoneinheit) {
    bestellmenge = Math.ceil(bedarfsmenge / angebot.kartoneinheit) * angebot.kartoneinheit;
    rechenweg.push(
      `Nur volle Kartons à ${angebot.kartoneinheit} Stück möglich: ${bedarfsmenge} Stück benötigt → ${bestellmenge} Stück bestellt.`
    );
  }
  if (angebot.mindestmenge && bestellmenge < angebot.mindestmenge) {
    bestellmenge = angebot.mindestmenge;
    rechenweg.push(`Mindestabnahme ${angebot.mindestmenge} Stück > Bedarf ${bedarfsmenge} Stück → ${bestellmenge} Stück bestellt.`);
  }
  const ueberschussmenge = bestellmenge - bedarfsmenge;

  // 2) Artikelkosten mit dem für die Bestellmenge gültigen Staffelpreis.
  const stueckpreisNetto = waehleStueckpreis(angebot, bestellmenge);
  const artikelkostenNetto = bestellmenge * stueckpreisNetto;
  rechenweg.push(
    `Artikelkosten: ${bestellmenge} Stück × ${formatZahl(stueckpreisNetto)} € = ${formatEuro(artikelkostenNetto)}.`
  );

  // 3) Versandkosten, ggf. Freigrenze.
  let versandkostenNetto = angebot.versandkostenNetto;
  if (angebot.versandkostenfreiAbWarenwert !== undefined && artikelkostenNetto >= angebot.versandkostenfreiAbWarenwert) {
    rechenweg.push(
      `Versand entfällt: Warenwert ${formatEuro(artikelkostenNetto)} erreicht die Freigrenze ${formatEuro(angebot.versandkostenfreiAbWarenwert)}.`
    );
    versandkostenNetto = 0;
  } else if (versandkostenNetto > 0) {
    rechenweg.push(`Versandkosten: ${formatEuro(versandkostenNetto)}.`);
  }

  // 4) Zertifikatskosten (nur wenn verfügbar, nicht inklusive und bepreist).
  let zertifikatskostenNetto = 0;
  if (angebot.zertifikat31.verfuegbar && !angebot.zertifikat31.inklusive && angebot.zertifikat31.kostenNetto) {
    zertifikatskostenNetto = angebot.zertifikat31.kostenNetto;
    rechenweg.push(`Werkszeugnis 3.1 zusätzlich: ${formatEuro(zertifikatskostenNetto)}.`);
  }

  const gesamtkostenNetto = artikelkostenNetto + versandkostenNetto + zertifikatskostenNetto;
  rechenweg.push(`Gesamtkosten netto: ${formatEuro(gesamtkostenNetto)}.`);

  // 5) Skonto als optionale Zahlungsvariante, nicht Teil der Gesamtkosten-Kopfzahl.
  let skontoEffektNetto: number | undefined;
  if (angebot.skontoProzent) {
    skontoEffektNetto = gesamtkostenNetto * (1 - angebot.skontoProzent / 100);
    rechenweg.push(
      `Bei Zahlung in ${angebot.skontoFristTage} Tagen: ${angebot.skontoProzent} % Skonto → ${formatEuro(skontoEffektNetto)}.`
    );
  }

  const kostenJeBenoetigtemStueck = gesamtkostenNetto / bedarfsmenge;
  if (ueberschussmenge > 0) {
    rechenweg.push(
      `Bezogen auf den Bedarf von ${bedarfsmenge} Stück: ${formatEuro(gesamtkostenNetto)} / ${bedarfsmenge} = ${formatZahl(kostenJeBenoetigtemStueck)} € je benötigtem Stück.`
    );
  }

  // 6) Liefertermin.
  const { voraussichtlichesLieferdatum, erreichtWunschtermin } = pruefeLiefertermin(
    eingabe.bestelldatum,
    angebot.lieferzeitWerktage,
    eingabe.wunschtermin
  );
  rechenweg.push(
    `Lieferzeit ${angebot.lieferzeitWerktage} Werktage ab Bestellung → ca. ${formatDatumAusDate(
      voraussichtlichesLieferdatum
    )} (Wunschtermin ${formatDatumAusDate(eingabe.wunschtermin)}).`
  );

  // 7) Nicht-vergleichbar-Hinweise.
  const nichtVergleichbarHinweise: Gesamtkostenergebnis["nichtVergleichbarHinweise"] = [];
  if (ueberschussmenge > 0) {
    nichtVergleichbarHinweise.push({
      feld: "Menge",
      hinweis: `${ueberschussmenge} Stück mehr als benötigt wegen ${angebot.kartoneinheit ? "Kartoneinheit" : "Mindestabnahme"}.`,
    });
  }
  if (!angebot.zertifikat31.verfuegbar) {
    nichtVergleichbarHinweise.push({
      feld: "Werkszeugnis 3.1",
      hinweis: "Nicht lieferbar. Anforderung aus der Bestellanforderung wird nicht erfüllt.",
    });
  }
  if (angebot.gewaehrleistungMonate < eingabe.mindestGewaehrleistungMonate) {
    nichtVergleichbarHinweise.push({
      feld: "Gewährleistung",
      hinweis: `Nur ${angebot.gewaehrleistungMonate} Monate, gewünscht sind mindestens ${eingabe.mindestGewaehrleistungMonate} Monate.`,
    });
  }
  if (angebot.incoterm !== eingabe.gewuenschterIncoterm) {
    nichtVergleichbarHinweise.push({
      feld: "Incoterm",
      hinweis: `Angebot nennt "${angebot.incoterm}", gewünscht ist "${eingabe.gewuenschterIncoterm}".`,
    });
  }
  if (!erreichtWunschtermin) {
    nichtVergleichbarHinweise.push({
      feld: "Liefertermin",
      hinweis: "Voraussichtliches Lieferdatum liegt nach dem Wunschtermin (ca.-Wert, ohne Feiertage gerechnet).",
    });
  }

  return {
    lieferantId: angebot.lieferantId,
    bedarfsmenge,
    bestellmenge,
    ueberschussmenge,
    stueckpreisNetto,
    artikelkostenNetto,
    versandkostenNetto,
    zertifikatskostenNetto,
    gesamtkostenNetto,
    skontoEffektNetto,
    kostenJeBenoetigtemStueck,
    voraussichtlichesLieferdatum,
    erreichtWunschtermin,
    rechenweg,
    nichtVergleichbarHinweise,
  };
}
