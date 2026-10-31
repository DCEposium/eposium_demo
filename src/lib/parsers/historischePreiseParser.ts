import { parseZeilen } from "./csvParser";
import { parseZahl } from "../calc/zahlenformat";

export interface HistorischerPreis {
  datum: string; // ISO YYYY-MM-DD
  lieferant: string;
  menge: number;
  preisNettoJeStueck: number;
}

/** Liest data/historische_preise.csv (deutsches Semikolon-Format). */
export function parseHistorischePreise(text: string): HistorischerPreis[] {
  const zeilen = parseZeilen(text);
  const [, ...datenzeilen] = zeilen; // erste Zeile ist die Kopfzeile
  return datenzeilen.map(([datum, lieferant, menge, preis]) => ({
    datum,
    lieferant,
    menge: parseZahl(menge),
    preisNettoJeStueck: parseZahl(preis),
  }));
}
