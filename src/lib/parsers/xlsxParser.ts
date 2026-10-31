import * as XLSX from "xlsx";

/**
 * Liest die erste Tabelle einer XLSX-Datei als Zeilen aus Zellen (wie
 * csvParser.parseZeilen). Läuft vollständig im Browser, keine Netzwerk- oder
 * Dateisystemzugriffe (SheetJS arbeitet nur auf dem übergebenen Puffer).
 */
export function parseXlsxZeilen(daten: ArrayBuffer): string[][] {
  const arbeitsmappe = XLSX.read(daten, { type: "array" });
  const ersterBlattname = arbeitsmappe.SheetNames[0];
  if (!ersterBlattname) return [];
  const blatt = arbeitsmappe.Sheets[ersterBlattname];
  const zeilen = XLSX.utils.sheet_to_json<string[]>(blatt, { header: 1, raw: false, defval: "" });
  return zeilen.map((zeile) => zeile.map((zelle) => String(zelle ?? "").trim()));
}
