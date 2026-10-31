import {
  ROH_ANGEBOTE,
  LIEFERANTEN,
  BESTELLANFORDERUNG,
  HISTORISCHE_PREISE_ROH,
  EUROSTAT_CACHE,
} from "./demodaten";
import {
  normalisiereAngebotA,
  normalisiereAngebotB,
  normalisiereAngebotC,
} from "./parsers/angebotNormalizer";
import { parseHistorischePreise } from "./parsers/historischePreiseParser";
import { berechneGesamtkosten } from "./calc/gesamtkosten";
import { pruefePreis, berechneBranchentrend, type PreisEinschaetzung, type Branchentrend } from "./calc/preisCheck";
import { leiteVergleichsvorgabenAb } from "./anforderungen";
import { parseLokalesDatum } from "./calc/zahlenformat";
import type { Gesamtkostenergebnis, NormalisiertesAngebot } from "./types";

export interface VergleichsEintrag {
  angebot: NormalisiertesAngebot;
  lieferantName: string;
  ergebnis: Gesamtkostenergebnis;
  preisEinschaetzung: PreisEinschaetzung;
}

export function lieferantName(lieferantId: string): string {
  return LIEFERANTEN.find((l) => l.id === lieferantId)?.name ?? lieferantId;
}

/**
 * Einmalige Berechnungsgrundlage für Vergleich, Preis-Check und Briefing, damit
 * alle drei Bildschirme mit denselben Zahlen arbeiten. bestelldatum ist
 * injizierbar für deterministische Tests, Standard ist "heute".
 */
export function berechneVergleichsdaten(bestelldatum: Date = new Date()): VergleichsEintrag[] {
  const vorgaben = leiteVergleichsvorgabenAb(BESTELLANFORDERUNG);
  const eingabe = {
    bedarfsmenge: BESTELLANFORDERUNG.menge,
    mindestGewaehrleistungMonate: vorgaben.mindestGewaehrleistungMonate,
    gewuenschterIncoterm: vorgaben.gewuenschterIncoterm,
    bestelldatum,
    wunschtermin: parseLokalesDatum(BESTELLANFORDERUNG.wunschtermin),
  };
  const historie = parseHistorischePreise(HISTORISCHE_PREISE_ROH);

  const angebote = [
    normalisiereAngebotA(ROH_ANGEBOTE.A.dateiname, ROH_ANGEBOTE.A.text),
    normalisiereAngebotB(ROH_ANGEBOTE.B.dateiname, ROH_ANGEBOTE.B.text),
    normalisiereAngebotC(ROH_ANGEBOTE.C.dateiname, ROH_ANGEBOTE.C.text),
  ];

  return angebote.map((angebot) => {
    const ergebnis = berechneGesamtkosten(angebot, eingabe);
    const preisEinschaetzung = pruefePreis(
      angebot.lieferantId,
      lieferantName(angebot.lieferantId),
      angebot.preisstaffeln[0].stueckpreisNetto,
      historie
    );
    return { angebot, lieferantName: lieferantName(angebot.lieferantId), ergebnis, preisEinschaetzung };
  });
}

export function branchentrendKontext(): Branchentrend | null {
  return berechneBranchentrend(EUROSTAT_CACHE.daten);
}
