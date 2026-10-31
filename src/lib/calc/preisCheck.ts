import type { HistorischerPreis } from "../parsers/historischePreiseParser";
import { formatZahl, formatDatum } from "./zahlenformat";

export interface PreisEinschaetzung {
  lieferantId: string;
  aktuellerPreisNetto: number;
  letzterHistorischerPreis?: number;
  letztesHistorischesDatum?: string;
  anzahlHistorischerDatenpunkte: number;
  veraenderungProzent?: number;
  einschaetzung: string;
}

function klassifiziere(veraenderungProzent: number): string {
  const abs = Math.abs(veraenderungProzent);
  if (abs < 3) return "im Rahmen der bisherigen Preise";
  if (abs < 8) return veraenderungProzent > 0 ? "spürbar höher als bisher" : "spürbar niedriger als bisher";
  return veraenderungProzent > 0 ? "deutlich höher als bisher" : "deutlich niedriger als bisher";
}

/**
 * Ordnet einen aktuellen Stückpreis gegen die früheren Preise desselben
 * Lieferanten ein. Liefert eine Einschätzung mit Spanne/Einordnung statt
 * einer einzelnen scheingenauen Zahl (CLAUDE.md: keine falsche Präzision).
 */
export function pruefePreis(
  lieferantId: string,
  lieferantName: string,
  aktuellerPreisNetto: number,
  historie: HistorischerPreis[]
): PreisEinschaetzung {
  const eintraege = historie
    .filter((h) => h.lieferant === lieferantName)
    .sort((a, b) => a.datum.localeCompare(b.datum));

  if (eintraege.length === 0) {
    return {
      lieferantId,
      aktuellerPreisNetto,
      anzahlHistorischerDatenpunkte: 0,
      einschaetzung: "Keine früheren Preise dieses Lieferanten in den Beispieldaten vorhanden, keine Einordnung möglich.",
    };
  }

  const letzter = eintraege[eintraege.length - 1];
  const veraenderungProzent = ((aktuellerPreisNetto - letzter.preisNettoJeStueck) / letzter.preisNettoJeStueck) * 100;
  const hinweisWenigDaten = eintraege.length === 1 ? " (nur ein einzelner Vergleichswert vorhanden)" : "";

  return {
    lieferantId,
    aktuellerPreisNetto,
    letzterHistorischerPreis: letzter.preisNettoJeStueck,
    letztesHistorischesDatum: letzter.datum,
    anzahlHistorischerDatenpunkte: eintraege.length,
    veraenderungProzent,
    einschaetzung: `${formatZahl(Math.abs(veraenderungProzent), 1)} % ${
      veraenderungProzent >= 0 ? "höher" : "niedriger"
    } als der letzte bekannte Preis vom ${formatDatum(letzter.datum)} (${klassifiziere(veraenderungProzent)})${hinweisWenigDaten}.`,
  };
}

export interface Branchentrend {
  veraenderungProzent: number;
  vonMonat: string;
  bisMonat: string;
}

/**
 * Groben Branchentrend aus dem gecachten Eurostat-Erzeugerpreisindex ableiten
 * (erster vs. letzter Wert der Reihe). Nur als allgemeiner Kontext gedacht,
 * nicht als Index für dieses konkrete Produkt (siehe
 * docs/DATA_SOURCES_VERIFIZIERT.md).
 */
export function berechneBranchentrend(reihe: { monat: string; index_2021_100: number | null }[]): Branchentrend | null {
  const mitWert = reihe.filter((e) => e.index_2021_100 !== null);
  if (mitWert.length < 2) return null;
  const erster = mitWert[0];
  const letzter = mitWert[mitWert.length - 1];
  const veraenderungProzent = ((letzter.index_2021_100! - erster.index_2021_100!) / erster.index_2021_100!) * 100;
  return { veraenderungProzent, vonMonat: erster.monat, bisMonat: letzter.monat };
}
