# Datenquellen, Live-Verifikation (Schritt 2)

Geprüft am 31.10.2026 mit echten Testanfragen (curl/WebFetch). Alle drei Quellen sind frei erreichbar, ohne Key, ohne Zahlung. Rohantworten lagen während der Prüfung vor; keine Endpunkte erfunden.

## 1. TED Search API (Tenders Electronic Daily)

- **Endpunkt:** `POST https://api.ted.europa.eu/v3/notices/search`, JSON-Body `{"query": "<Expert-Query>", "fields": [...], "limit": n}`.
- **Kein API-Key nötig** (laut `docs.ted.europa.eu/api/latest`: "The Search API does not require a key", anonymer Zugriff).
- **Abfragesyntax:** Expertensyntax mit Feldname, Operator, Wert. `OR` zwischen zwei Werten desselben Felds muss als `(feld=wertA OR feld=wertB)` geschrieben werden, nicht als `feld IN (wertA OR wertB)` — letzteres liefert `400 QUERY_UNSUPPORTED_FIELD_VALUE` (live getestet).
- **Getestete Query:** `classification-cpv=44440000 AND publication-date>=20250101` (CPV 44440000 = "Bearings", einschlägig für den Demo-Artikel Linearführungswagen) → `totalNoticeCount: 330`, Antwort `200`, echte Bekanntmachungen (z. B. "România – Rulmenti...", "Litauen – Guoliai..."), Felder `notice-title` (mehrsprachiges Objekt inkl. `deu`/`eng`), `buyer-name`, `buyer-country`, `publication-date`. Feld `total-value`/`total-value-cur` war in den Testergebnissen leer (nicht bei jeder Bekanntmachung gepflegt) — für die Demo daher **nicht als verlässlich darstellen**, nur Titel/Käufer/Land/Datum verwenden.
- **Limits:** In der Dokumentation nicht beziffert (keine Angabe zu Requests/Minute oder Tag). Vorsichtshalber: Abruf nur einmal vorab (Caching), kein Live-Polling, kleine `limit`-Werte (5–10).
- **Lizenz:** Laut `ted.europa.eu/en/legal-notice`: Vergabebekanntmachungen "can be freely reused, for commercial or non-commercial purposes". Redaktionelle Inhalte der SIMAP-Seiten unter CC BY 4.0 (Namensnennung + Kennzeichnung von Änderungen), Metadaten unter CC0. Logos der EU/Publications Office dürfen nicht ohne Zustimmung verwendet werden. **Quellenangabe in der Oberfläche Pflicht: "Quelle: TED (Tenders Electronic Daily), Amt für Veröffentlichungen der EU, CC BY 4.0, abgerufen am 31.10.2026".**
- **Status: verifiziert, einsetzbar** für die optionale TED-Kontextkarte ("Kann"-Feature).

## 2. Eurostat Dissemination API, Datensatz `sts_inpp_m`

- **Endpunkt:** `GET https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sts_inpp_m?format=JSON&lang=en&geo=DE&sinceTimePeriod=2024-01` → `200`, echtes JSON-stat-2.0-Format mit Werten (Index 2021=100 und Prozent-Veränderungen).
- **Kein API-Key nötig.**
- **Dimensionen (live geprüft):** `freq=M`, `indic_bt=PRC_PRR` (Erzeugerpreise), `nace_r2` (u. a. `B-E36` Industrie gesamt, `MIG_CAG` Investitionsgüter, `MIG_ING` Vorleistungsgüter — **keine Aufschlüsselung auf Einzelprodukte wie Lagerelemente**, nur Branchenaggregate), `s_adj=NSA` (nicht saisonbereinigt), `unit` (`I21` Index 2021=100, `PCH_PRE` Veränderung Vormonat, `PCH_SM` Veränderung zum Vorjahresmonat), `geo`, `time`.
- **Für die Demo relevant:** `nace_r2=MIG_CAG` (Investitionsgüter, am ehesten passend zu Maschinenbau-Komponenten) oder `B-E36_X_FOOD` (Industrie gesamt ohne Nahrungsmittel) als grober Markttrend-Kontext, **nicht** als exakter Index für "Linearführungswagen" — das muss die Oberfläche als groben Kontext kennzeichnen, keine falsche Präzision.
- **Limits:** In der offiziellen Kurzanleitung nicht mit konkreten Zahlen dokumentiert (kein Hinweis auf Requests/Minute gefunden). Eurostat empfiehlt generell, Daten zu cachen statt wiederholt live abzurufen.
- **Lizenz:** Freie Weiterverwendung, kommerziell und nicht-kommerziell, unter Namensnennung (Beschluss 2011/833/EU, CC BY 4.0). **Quellenangabe Pflicht: "Quelle: Eurostat, sts_inpp_m, CC BY 4.0, abgerufen am 31.10.2026".**
- **Status: verifiziert, einsetzbar.**

## 3. Wechselkurse (Frankfurter API)

- **Hinweis zur Domain:** `api.frankfurter.app` liefert `301` (Cloudflare-Weiterleitung) und war im Test nicht direkt erreichbar; `api.frankfurter.dev` funktioniert direkt (`GET https://api.frankfurter.dev/v1/latest?base=EUR&symbols=USD,GBP` → `200`, echte Kurse). Für `scripts/fetch-data` wird **ausschließlich `api.frankfurter.dev`** verwendet.
- **Kein API-Key nötig.** Laut `frankfurter.dev`: "There are no quotas. Requests are rate-limited to prevent abuse, but there are no monthly or daily caps." Caching wird empfohlen.
- **Datenbasis:** Referenzkurse aus täglichen Meldungen diverser Zentralbanken (u. a. EZB), Projekt ist Open Source.
- **Relevanz für die Demo:** Im mitgelieferten Beispieldatensatz sind alle drei Angebote bereits in EUR (Angebot C nennt zwar NL-Lieferant, aber Preise in EUR). Ein Wechselkurs wird für den Standard-Durchlauf **nicht gebraucht**; die Komponente bleibt vorbereitet (gecachte Datei vorhanden), wird aber im Pflichtumfang nicht verwendet, nur optional im Vertiefungsmodus, falls im Echt-Modus eine Fremdwährung hochgeladen wird.
- **Status: verifiziert, einsetzbar, aber im Standarddurchlauf nicht erforderlich.**

## Entscheidung für den Prototyp

1. Alle drei Quellen werden **vor der Messe** einmalig per `scripts/fetch-data` abgerufen und als JSON in `data/cache/` abgelegt (mit Metadaten: Quelle, Abrufdatum, Lizenz, verwendete Filterparameter).
2. Die Demo liest zur Laufzeit **ausschließlich aus `data/cache/`**, nie live. Ein Live-Nachladen ist nicht Teil des Pflichtumfangs (passt zu "offlinefähig" in `CLAUDE.md`).
3. `scripts/fetch-data` hat ein Zeitlimit (10 s je Quelle) und Fehlerbehandlung: schlägt eine Quelle fehl, wird das protokolliert und der vorhandene Cache-Stand bleibt unangetastet; das Skript bricht nicht komplett ab.
4. Jede Anzeige von TED- oder Eurostat-Daten in der Oberfläche zeigt Quelle, Lizenz und Abrufdatum sichtbar, aber klein (siehe `brand/BRAND.md`, Hinweis zu Marketingaussagen).
