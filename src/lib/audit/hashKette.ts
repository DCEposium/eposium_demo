import type { Akteur, AuditEintrag } from "../types";

/** Hash-Vorgänger des allerersten Eintrags (kein echter Hash, nur ein fester Startwert). */
export const GENESIS_HASH = "0".repeat(64);

function zuHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

interface EintragOhneHash {
  index: number;
  zeitstempel: string;
  ereignis: string;
  akteur: Akteur;
  daten: Record<string, unknown>;
  hashVorgaenger: string;
}

/**
 * SHA-256 über die kanonischen Felder des Eintrags (Web Crypto, läuft lokal
 * im Browser). Das ist die gesamte Zusicherung: verkettet und mit dieser
 * Prüfung nachweisbar manipuliert — nicht mehr, siehe CLAUDE.md.
 */
async function berechneHash(eintrag: EintragOhneHash): Promise<string> {
  const payload = JSON.stringify({
    index: eintrag.index,
    zeitstempel: eintrag.zeitstempel,
    ereignis: eintrag.ereignis,
    akteur: eintrag.akteur,
    daten: eintrag.daten,
    hashVorgaenger: eintrag.hashVorgaenger,
  });
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(payload));
  return zuHex(digest);
}

export async function erzeugeNaechstenEintrag(
  bisherigeKette: AuditEintrag[],
  ereignis: string,
  akteur: Akteur,
  daten: Record<string, unknown>
): Promise<AuditEintrag> {
  const index = bisherigeKette.length;
  const hashVorgaenger = bisherigeKette.length > 0 ? bisherigeKette[bisherigeKette.length - 1].hashAktuell : GENESIS_HASH;
  const basis: EintragOhneHash = { index, zeitstempel: new Date().toISOString(), ereignis, akteur, daten, hashVorgaenger };
  const hashAktuell = await berechneHash(basis);
  return { ...basis, hashAktuell };
}

export interface PruefErgebnis {
  gueltig: boolean;
  ersterFehlerIndex: number | null;
}

/** Rechnet jeden Hash unabhängig nach und prüft die Verkettung — für den Verifikations- und Manipulationsdemo-Knopf. */
export async function pruefeKette(kette: AuditEintrag[]): Promise<PruefErgebnis> {
  let erwarteterVorgaenger = GENESIS_HASH;
  for (const eintrag of kette) {
    if (eintrag.hashVorgaenger !== erwarteterVorgaenger) {
      return { gueltig: false, ersterFehlerIndex: eintrag.index };
    }
    const neuBerechnet = await berechneHash({
      index: eintrag.index,
      zeitstempel: eintrag.zeitstempel,
      ereignis: eintrag.ereignis,
      akteur: eintrag.akteur,
      daten: eintrag.daten,
      hashVorgaenger: eintrag.hashVorgaenger,
    });
    if (neuBerechnet !== eintrag.hashAktuell) {
      return { gueltig: false, ersterFehlerIndex: eintrag.index };
    }
    erwarteterVorgaenger = eintrag.hashAktuell;
  }
  return { gueltig: true, ersterFehlerIndex: null };
}

export function zuJSON(kette: AuditEintrag[]): string {
  return JSON.stringify(kette, null, 2);
}

function csvFeld(wert: unknown): string {
  const text = typeof wert === "string" ? wert : JSON.stringify(wert);
  return `"${text.replace(/"/g, '""')}"`;
}

export function zuCSV(kette: AuditEintrag[]): string {
  const kopf = ["index", "zeitstempel", "ereignis", "rolle", "name", "daten", "hashVorgaenger", "hashAktuell"];
  const zeilen = kette.map((e) =>
    [e.index, e.zeitstempel, e.ereignis, e.akteur.rolle, e.akteur.name, JSON.stringify(e.daten), e.hashVorgaenger, e.hashAktuell]
      .map(csvFeld)
      .join(";")
  );
  return [kopf.map(csvFeld).join(";"), ...zeilen].join("\n");
}
