#!/usr/bin/env node
// Holt die in docs/DATA_SOURCES_VERIFIZIERT.md geprüften Quellen einmalig ab und
// schreibt sie nach data/cache/. Die Demo liest zur Laufzeit NUR aus data/cache/,
// nie live (siehe CLAUDE.md: offlinefähig). Aufruf: node scripts/fetch-data/index.mjs
//
// Jede Quelle ist unabhängig: schlägt eine fehl (Timeout, Netzwerk, Formatänderung),
// bleibt der bestehende Cache-Stand unangetastet und die anderen Quellen laufen weiter.

import { writeFile, mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.resolve(__dirname, "../../data/cache");
const TIMEOUT_MS = 10_000;
const now = () => new Date().toISOString();

async function fetchJson(url, init) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function writeCache(filename, payload) {
  await mkdir(CACHE_DIR, { recursive: true });
  const target = path.join(CACHE_DIR, filename);
  await writeFile(target, JSON.stringify(payload, null, 2) + "\n", "utf-8");
  return target;
}

// Lässt bei Fehlern den vorhandenen Cache-Stand unverändert, statt eine leere/kaputte Datei zu schreiben.
async function hasExistingCache(filename) {
  try {
    await readFile(path.join(CACHE_DIR, filename), "utf-8");
    return true;
  } catch {
    return false;
  }
}

// --- Quelle 1: TED Search API (Vergabebekanntmachungen, CPV 44440000 Bearings) ---
async function fetchTed() {
  const filename = "ted_kontext.json";
  const query = "classification-cpv=44440000 AND publication-date>=20250101";
  const body = {
    query,
    fields: ["publication-number", "notice-title", "buyer-name", "buyer-country", "publication-date"],
    limit: 10,
  };
  const data = await fetchJson("https://api.ted.europa.eu/v3/notices/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const notices = (data.notices ?? []).map((n) => ({
    nummer: n["publication-number"] ?? null,
    titel: n["notice-title"]?.deu ?? n["notice-title"]?.eng ?? Object.values(n["notice-title"] ?? {})[0] ?? null,
    kaeufer: Object.values(n["buyer-name"] ?? {}).flat()[0] ?? null,
    land: (n["buyer-country"] ?? [])[0] ?? null,
    datum: n["publication-date"] ?? null,
  }));
  return writeCache(filename, {
    quelle: "TED (Tenders Electronic Daily), Amt für Veröffentlichungen der EU",
    lizenz: "Bekanntmachungen frei nutzbar (kommerziell/nicht-kommerziell); Metadaten CC0, redaktionelle Inhalte CC BY 4.0",
    abgerufen_am: now(),
    parameter: { query, hinweis: "CPV 44440000 = Bearings, als Näherung für den Demo-Artikel Linearführungswagen" },
    gesamtanzahl_treffer: data.totalNoticeCount ?? null,
    notizen: "total-value ist bei TED-Bekanntmachungen oft nicht gepflegt und wird daher nicht angezeigt.",
    daten: notices,
  });
}

// --- Quelle 2: Eurostat sts_inpp_m (Erzeugerpreisindex Industrie) ---
async function fetchEurostat() {
  const filename = "eurostat_erzeugerpreise.json";
  const params = "format=JSON&lang=de&geo=DE&sinceTimePeriod=2023-01&nace_r2=MIG_CAG&unit=I21";
  const url = `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sts_inpp_m?${params}`;
  const data = await fetchJson(url);

  // JSON-stat 2.0: Werte liegen flach in data.value, Zeitachsen-Labels in dimension.time.category.label
  const timeLabels = data.dimension?.time?.category?.label ?? {};
  const timeIndex = data.dimension?.time?.category?.index ?? {};
  const reihe = Object.entries(timeIndex)
    .sort((a, b) => a[1] - b[1])
    .map(([code]) => ({ monat: timeLabels[code] ?? code, index_2021_100: data.value?.[timeIndex[code]] ?? null }));

  return writeCache(filename, {
    quelle: "Eurostat, Datensatz sts_inpp_m (Erzeugerpreise Industrie, monatlich)",
    lizenz: "CC BY 4.0, freie Weiterverwendung mit Namensnennung (Beschluss 2011/833/EU)",
    abgerufen_am: now(),
    parameter: {
      geo: "DE",
      nace_r2: "MIG_CAG (Investitionsgüter, grober Branchenkontext, keine Einzelprodukt-Aufschlüsselung)",
      unit: "I21 (Index, 2021=100)",
      seit: "2023-01",
    },
    hinweis: "Grober Markttrend-Kontext, kein exakter Index für Linearführungswagen. Nicht als falsche Präzision darstellen.",
    daten: reihe,
  });
}

// --- Quelle 3: Wechselkurse (nicht im Pflichtumfang, nur Vertiefungsmodus bei Fremdwährung) ---
async function fetchWechselkurse() {
  const filename = "wechselkurse.json";
  const url = "https://api.frankfurter.dev/v1/latest?base=EUR&symbols=USD,GBP";
  const data = await fetchJson(url);
  return writeCache(filename, {
    quelle: "Frankfurter API (frankfurter.dev), Referenzkurse u. a. aus EZB-Meldungen",
    lizenz: "Open Source, freie Nutzung, keine Mengenbegrenzung dokumentiert",
    abgerufen_am: now(),
    parameter: { base: "EUR", symbols: ["USD", "GBP"] },
    hinweis: "Im Standard-Beispieldatensatz sind alle Angebote bereits in EUR; diese Datei wird nur im Echt-/Vertiefungsmodus bei Fremdwährungs-Uploads verwendet.",
    daten: data,
  });
}

async function run() {
  const quellen = [
    { name: "TED Search API", fn: fetchTed, filename: "ted_kontext.json" },
    { name: "Eurostat sts_inpp_m", fn: fetchEurostat, filename: "eurostat_erzeugerpreise.json" },
    { name: "Frankfurter Wechselkurse", fn: fetchWechselkurse, filename: "wechselkurse.json" },
  ];

  let fehlerAufgetreten = false;
  for (const { name, fn, filename } of quellen) {
    try {
      const target = await fn();
      console.log(`OK    ${name} -> ${path.relative(process.cwd(), target)}`);
    } catch (err) {
      fehlerAufgetreten = true;
      const hatteVorherCache = await hasExistingCache(filename);
      console.error(
        `FEHLER ${name}: ${err.message}. ` +
          (hatteVorherCache
            ? `Bestehender Cache-Stand (${filename}) bleibt unverändert.`
            : `Kein vorheriger Cache-Stand vorhanden, Demo läuft für diese Quelle ohne Daten.`)
      );
    }
  }

  if (fehlerAufgetreten) {
    console.error("\nMindestens eine Quelle konnte nicht aktualisiert werden. Siehe Meldungen oben.");
    process.exitCode = 1;
  } else {
    console.log("\nAlle Quellen aktualisiert.");
  }
}

run();
