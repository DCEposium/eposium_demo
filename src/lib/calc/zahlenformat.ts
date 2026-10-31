/**
 * Erkennt und parst eine Zahl aus Rohtext in beiden in den Angeboten
 * vorkommenden Schreibweisen: deutsch ("38,90") und englisch ("332.00").
 * Regel: Kommt sowohl "," als auch "." vor, ist das letzte Zeichen das
 * Dezimaltrennzeichen, das davor liegende ein Tausendertrenner.
 */
export function parseZahl(roh: string): number {
  const bereinigt = roh.trim().replace(/[^\d,.\-]/g, "");
  const letztesKomma = bereinigt.lastIndexOf(",");
  const letzterPunkt = bereinigt.lastIndexOf(".");

  let normalisiert: string;
  if (letztesKomma > letzterPunkt) {
    // Deutsch: "." ist Tausendertrenner, "," ist Dezimaltrennzeichen
    normalisiert = bereinigt.replace(/\./g, "").replace(",", ".");
  } else if (letzterPunkt > letztesKomma) {
    // Englisch: "," ist Tausendertrenner, "." ist Dezimaltrennzeichen
    normalisiert = bereinigt.replace(/,/g, "");
  } else {
    normalisiert = bereinigt;
  }

  const zahl = Number.parseFloat(normalisiert);
  if (Number.isNaN(zahl)) {
    throw new Error(`Konnte Zahl nicht lesen: "${roh}"`);
  }
  return zahl;
}

/** Erste Ganzzahl in einem Text, z. B. "14 Werktage ab Bestellung" -> 14 */
export function parseErsteGanzzahl(roh: string): number {
  const treffer = roh.match(/\d+/);
  if (!treffer) {
    throw new Error(`Keine Zahl gefunden in: "${roh}"`);
  }
  return Number.parseInt(treffer[0], 10);
}

/** Deutsche Formatierung: 1234.5 -> "1.234,50 €" */
export function formatEuro(betrag: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(betrag);
}

/** Deutsche Formatierung ohne Währungssymbol: 1234.5 -> "1.234,50" */
export function formatZahl(betrag: number, nachkommastellen = 2): string {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: nachkommastellen,
    maximumFractionDigits: nachkommastellen,
  }).format(betrag);
}

/** ISO-Datum ("2026-11-20") -> "20.11.2026" */
export function formatDatum(isoDatum: string): string {
  const [jahr, monat, tag] = isoDatum.split("-");
  return `${tag}.${monat}.${jahr}`;
}

/**
 * Lokales Kalenderdatum als "YYYY-MM-DD", ohne über UTC zu gehen.
 * `Date.toISOString()` würde in Zeitzonen vor UTC (z. B. MEZ) Mitternacht auf
 * den Vortag verschieben — hier bewusst vermieden.
 */
export function zuLokalemISODatum(datum: Date): string {
  const jahr = datum.getFullYear();
  const monat = String(datum.getMonth() + 1).padStart(2, "0");
  const tag = String(datum.getDate()).padStart(2, "0");
  return `${jahr}-${monat}-${tag}`;
}

/** Date-Objekt (lokale Zeit) -> deutsches Datumsformat, z. B. 20.11.2026 */
export function formatDatumAusDate(datum: Date): string {
  return formatDatum(zuLokalemISODatum(datum));
}

/**
 * "YYYY-MM-DD" -> Date um Mitternacht LOKALER Zeit. `new Date("YYYY-MM-DD")`
 * würde als UTC-Mitternacht interpretiert, was in Zeitzonen hinter UTC den
 * Kalendertag beim Anzeigen zurückverschieben kann — hier bewusst vermieden.
 */
export function parseLokalesDatum(isoDatum: string): Date {
  const [jahr, monat, tag] = isoDatum.split("-").map(Number);
  return new Date(jahr, monat - 1, tag);
}
