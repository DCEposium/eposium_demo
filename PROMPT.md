# Startprompt für Claude Code (Plan-Modus, komplett einfügen)

Rolle
Du bist Senior Product Engineer und Frontend-Lead in einem Gründerteam. Du baust für den Messestand von Eposium einen lokal laufenden, klickbaren Prototyp von „Epos“, einem KI-Einkaufs-Copiloten für den B2B-Einkauf im Mittelstand. Arbeite präzise, belege Aussagen und rate nicht.

Ziel und Erfolgskriterium
Einkäufer und Geschäftsführer verstehen nach 2 bis 3 Minuten am Stand die Grundidee: Epos macht unterschiedliche Lieferantenangebote vergleichbar, ordnet Preise ein, bereitet die Verhandlung vor, dokumentiert Freigaben und führt ein manipulationssicher verkettetes Audit-Protokoll. Wer mehr wissen will, kann in einem Vertiefungsmodus (bis 15 Minuten) eigene Dateien laden. Die Demo muss auf einem Laptop und iPad am Stand stabil, schnell, offlinefähig und optisch eindeutig als Eposium erkennbar sein.

Schritt 0: Projekt lesen
Lies vollständig, bevor du irgendetwas planst oder schreibst: `CLAUDE.md`, `README.md`, `brand/BRAND.md`, `brand/tokens.css`, `brand/tokens.json`, `docs/PRODUCT_BRIEF.md`, `docs/DATA_SOURCES.md`, `docs/MESSE_CHECKLISTE.md`, `data/README.md` und alle Dateien in `data/`. Sieh dir die Bilder `brand/reference/poster_preview-1.png`, `anzeige_preview-1.png` und `guide_page-*.png` an, um Look and Feel (dunkler Grund, weiße Karten mit großem Radius, helltürkise Akzente, Inter) zu erfassen. Die Originale in `brand/reference/` haben Vorrang vor allen Kurzfassungen.

Schritt 1: Skills aus dem Internet holen und prüfen
Führe `bash scripts/setup-skills.sh` aus. Das klont das offizielle Repository `https://github.com/anthropics/skills` und kopiert `frontend-design`, `webapp-testing` und `skill-creator` nach `.claude/skills/`. Prüfe anschließend, welche Skills tatsächlich vorhanden sind. Fehlt einer, suche den aktuellen Namen im Repository und löse es selbst. Lies jede `SKILL.md` und die Lizenz und wende sie an: `eposium-brand` bei jeder UI-Entscheidung, `frontend-design` für die Qualität der Oberfläche, `webapp-testing` für Browser-Tests und Screenshots. Erstelle nur dann weitere eigene Skills (mit `skill-creator`), wenn sich ein Ablauf wiederholt (z. B. ein Skill für die Angebotsnormalisierung). Berichte kurz, was geladen wurde.

Schritt 2: Fachliche Verifikation der Datenquellen
Prüfe die in `docs/DATA_SOURCES.md` genannten kostenlosen Quellen live, bevor du sie einplanst: TED Search API (Endpunkt, Abfragesyntax, Felder, Limits, Lizenz über `https://api.ted.europa.eu/swagger` und die Dokumentation), Eurostat Erzeugerpreisindex (Datensatz `sts_inpp_m`), optional EZB-Wechselkurse. Sende echte Testanfragen, sieh dir die Antworten an und schreibe ein kurzes Protokoll (was funktioniert, was nicht, Quelle, Lizenz) nach `docs/DATA_SOURCES_VERIFIZIERT.md`. Baue ein Skript `scripts/fetch-data` mit Zeitlimit und Fehlerbehandlung, das die Daten vorab nach `data/cache/` schreibt. Die Demo darf zur Laufzeit niemals von einer externen Antwort abhängen. Nutze nur Quellen, die tatsächlich ohne Zahlung erreichbar sind, und erfinde keine Endpunkte.

Schritt 3: Rückfragen und Plan
Stelle höchstens 5 Rückfragen, nur wenn sie den Entwurf wesentlich ändern, sonst triff Annahmen und nenne sie. Zeige dann im Plan-Modus: Architektur und Stack mit Begründung (Standard: Vite, React, TypeScript, reines CSS mit den Tokens, `papaparse`, `xlsx`, Vitest, Playwright), Screen-Ablauf mit Skizzen als Text, Datenmodell, Berechnungslogik, Teststrategie, Meilensteine mit Aufwandsschätzung und Risiken. Warte auf meine Freigabe, bevor du Dateien änderst.

Funktionsumfang
Muss
1. Startscreen (Attract-Modus): Headline im Plakat-Stil („Was kostet Ihren Einkauf die meisten Nerven?“), Logo, ein großer Startknopf, Hinweis „Prototyp, Beispieldaten“. Ruhige Animation, kein Ton.
2. Bestellanforderung: Anzeige von `data/bestellanforderung.json` als Karte.
3. Angebote einlesen: Die drei Rohdateien aus `data/angebote_roh/` werden wie Excel/CSV-Anhänge „eingelesen“. Die Oberfläche zeigt je Angebot die Rohdarstellung und was Epos erkannt hat (Preis, Einheit, brutto/netto, Mindestmenge, Kartoneinheiten, Incoterm, Zahlungsziel, Skonto, Gewährleistung, Zertifikate, Lieferzeit).
4. Vergleich: normalisierte Tabelle mit Gesamtkosten für Menge 40 netto inklusive Versand, Zertifikatskosten, Skonto-Effekt und kartonbedingter Mehrmenge, dazu Lieferzeit gegen Wunschtermin, Gewährleistung, Zahlungsziel, Risiken. Markiere „nicht vergleichbar“-Stellen, erkläre sie in einem Satz und zeige die Rechnung per Aufklappen. Alle Zahlen werden berechnet, nie hartcodiert.
5. Preis-Check („Ist der Preis wirklich fair?“): Einordnung gegen `data/historische_preise.csv` und, falls verfügbar, gegen den gecachten Preisindex. Aussage mit Spanne und Begründung, ohne falsche Präzision.
6. Verhandlungsbriefing: Ziele, Argumente, Zugeständnisse, Fragen an den Lieferanten, E-Mail-Entwurf. Standard sind deterministische, aus den berechneten Fakten erzeugte Texte. Optional und standardmäßig aus: Live-Modus über einen serverseitigen Proxy mit `ANTHROPIC_API_KEY` aus `.env`. Die Oberfläche kennzeichnet ehrlich „vorgefertigt“ oder „live“.
7. Freigabe: Rollenwechsel (Einkäufer, Abteilungsleiter), Freigabe oder Ablehnung mit Name und Zeit.
8. Audit-Protokoll: Jedes Ereignis wird mit SHA-256 an den Vorgänger gekettet (Web Crypto). Export als JSON und CSV. Verifikationsknopf, der die Kette prüft, und ein Manipulationsdemo-Knopf, der einen Eintrag ändert und die Verletzung sichtbar macht. Behaupte nicht mehr als „verkettet und prüfbar“.
9. Abschluss: Zusammenfassung der gesparten Schritte (nur belegbare Aussagen), Call to Action (Pilotpartner werden, QR-Platzhalter, eposium.de), Reset.
10. Echt-Modus: Besucher lädt 1 bis 2 eigene Angebotsdateien (CSV, XLSX) lokal. Parsing nur im Browser, Spaltenzuordnung per Zuordnungsdialog mit Vorschlägen, keine Netzwerkübertragung, keine Speicherung, Reset löscht alles. Bei Unsicherheit der Erkennung zeigt die Oberfläche das offen an („prüfen Sie diese Zeile“).

Kann
Vertiefungsmodus mit allen sechs Schmerzpunkten vom Plakat als Kartenübersicht; TED-Kontextkarte („So kaufen öffentliche Auftraggeber in Ihrer Warengruppe“) aus dem Cache; PDF-Export des Vergleichs; englische Sprachumschaltung.

Nicht
Login, Backend-Persistenz von Besucherdaten, Zahlungen, Tracking, Analytics, echte Lieferantennamen als erfundene Daten, Aussagen zu DSGVO, EU-Hosting oder „eigenes Modell je Kunde“ als erfüllt.

Design (verbindlich)
Corporate Design nach `brand/`: Farben ausschließlich aus `tokens.css`, Inter lokal, Logo-SVGs passend zum Grund, Karten mit Radius ca. 20 px und Fußleiste im hellen Türkis-Ton, Kicker in Helltürkis, Sie-Form, kurze direkte Sätze, keine Emojis. Layouts für 1920x1080 und iPad Querformat 1180x820, Touch-Ziele mindestens 48 px, lesbar aus 1 m. Kontrast mindestens WCAG AA, Tastaturbedienung und `prefers-reduced-motion` beachten. Das Ergebnis muss neben dem Plakat als dieselbe Marke erkennbar sein. Nutze `frontend-design` für Qualität, aber ohne von der Marke abzuweichen.

Qualität und Tests
- Unit-Tests (Vitest) für Parser, Normalisierung, Gesamtkostenrechnung, Hash-Kette inklusive Manipulationserkennung und Zahlenformatierung (deutsch).
- Browser-Tests (Playwright): kompletter Durchlauf des Standard-Ablaufs, Echt-Modus mit Testdatei, Reset, Inaktivitäts-Rücksprung nach 90 Sekunden, Offline-Test (Netzwerk blockiert), Prüfung, dass im Echt-Modus keine Anfrage nach außen geht.
- Screenshots in `docs/screenshots/` (1920x1080 und 1180x820) und visueller Vergleich mit `brand/reference/poster_preview-1.png` und `anzeige_preview-1.png`. Benenne konkrete Abweichungen und behebe sie.
- Berechnungen unabhängig nachrechnen (zweiter Weg im Test) und im Bericht die Ergebnisse der drei Angebote offenlegen.

Betrieb am Stand
`npm run demo` startet Produktions-Build lokal und öffnet Vollbild. Reset per Taste und Knopf, Inaktivitäts-Rücksprung, kein Dev-Overlay, kein Cursor-Wechsel-Flackern, keine externen Anfragen. Zusätzlich statischer Build in `dist/` und Anleitung, wie du ihn auf dem iPad bereitstellst. Arbeite `docs/MESSE_CHECKLISTE.md` vollständig ab.

Arbeitsweise und Grenzen
- Arbeite in Meilensteinen: M1 Gerüst, Tokens und Layout; M2 Daten und Parser; M3 Vergleichslogik; M4 Preis-Check und Briefing; M5 Freigabe und Audit; M6 Echt-Modus; M7 Härtung, Offline, Messe-Checkliste. Teste jeden Meilenstein und berichte knapp mit Belegen (Testausgabe, Screenshot).
- Mache regelmäßig kleine Commits mit aussagekräftigen Nachrichten. Kein Push, kein Veröffentlichen.
- Ändere nichts außerhalb dieses Projektordners, führe keine destruktiven Befehle ohne Rückfrage aus, lege keine Secrets ab.
- Erfinde nichts. Kennzeichne Annahmen, offene Fragen und nicht Verifiziertes ausdrücklich.
- Lieferumfang am Ende: lauffähige App, Tests und Testbericht, `docs/DATA_SOURCES_VERIFIZIERT.md`, `docs/BETRIEBSANLEITUNG.md` (Start, Reset, Fehlersuche, iPad), `docs/RISIKEN_OFFENE_PUNKTE.md` und eine Liste, welche Aussagen aus dem Marketingmaterial die Demo belegt und welche nicht.

Beginne jetzt mit Schritt 0 und Schritt 1. Zeige danach deinen Plan und warte auf meine Freigabe.
