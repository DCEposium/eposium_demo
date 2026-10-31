# Kostenlose Datenquellen für den Echt-Modus

Stand der Recherche: 31.10.2026. Alles mit "zu prüfen" muss Claude Code vor dem Einbau live verifizieren (Request senden, Antwort ansehen, Lizenz lesen). Kein Eintrag ersetzt echte Lieferantenangebote: dafür gibt es keine freie Schnittstelle. Für echte Angebote gilt der Upload (CSV/XLSX) im Browser.

| Quelle | Nutzen in der Demo | Zugang | Status |
| --- | --- | --- | --- |
| TED, Tenders Electronic Daily (EU Amtsblatt, Bekanntmachungen öffentlicher Aufträge) | Echte Beschaffungsvorgänge als Kontext: Ausschreibungen, Zuschläge, Auftragswerte, Käufer, CPV-Codes. Zeigt "echte Daten" ohne Kundenbezug. | Search API, laut Dokumentation (docs.ted.europa.eu/api/latest) kein API-Key nötig, Basis `https://api.ted.europa.eu/{version}/{resource}/{action}`, Swagger unter `https://api.ted.europa.eu/swagger` | Endpunkt-Schema, Abfragesyntax, Felder, Limits und Lizenz zu prüfen (Dokuseite nennt sie nicht) |
| Eurostat, Erzeugerpreisindex Industrie (Datensatz sts_inpp_m, monatlich) | Marktindex als Plausibilitätskontext für "Ist der Preis fair?" (Preistrend je Branche/Land) | Eurostat Dissemination API (JSON/SDMX), kein Key | Datensatzcode bestätigt, genaue API-URL und Filter zu prüfen; Quelle angeben |
| Destatis GENESIS-Online, Erzeugerpreisindex gewerblicher Produkte (Tabelle 61241) | Deutsche Preisindizes nach Güterklassen | Kostenlose Registrierung nötig | zu prüfen; nur falls Eurostat nicht reicht |
| Wechselkurse (EZB-Referenzkurse, z. B. über frankfurter.app/api.frankfurter.dev) | Fremdwährungsangebote vergleichen | kein Key | zu prüfen |

Regeln:
1. Daten werden **vor der Messe** abgerufen und als JSON in `data/cache/` abgelegt. Die Demo läuft damit auch ohne Internet. Live-Abruf nur optional (Schalter), mit Zeitlimit und Fallback auf Cache.
2. Quellenangabe und Abrufdatum in der Oberfläche (klein, aber sichtbar).
3. Keine personenbezogenen Daten aus TED anzeigen, die für die Demo nicht nötig sind.
4. Rate Limits respektieren, nicht scrapen.
