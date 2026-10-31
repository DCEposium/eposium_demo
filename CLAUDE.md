# Projekt: Eposium Messe-Demo (Prototyp von "Epos", KI-Einkaufs-Copilot)

Sprache der Oberfläche und aller Texte: Deutsch, Sie-Form. Code, Kommentare und Commit-Messages: Englisch ist erlaubt, Dokumentation Deutsch.

## Zweck
Interaktive Demo für einen Messestand. Besucher: Einkäufer und Geschäftsführer im Mittelstand. Sie sollen in 2 bis 3 Minuten die Grundidee verstehen: Angebote vergleichbar machen, Preise einordnen, Verhandlung vorbereiten, Freigabe und Audit-Protokoll. Details: `docs/PRODUCT_BRIEF.md`.

## Vorrang der Quellen
1. Diese Datei und `docs/MESSE_CHECKLISTE.md`
2. `brand/BRAND.md`, `brand/tokens.css`, Originale in `brand/reference/`
3. `docs/PRODUCT_BRIEF.md`, `docs/DATA_SOURCES.md`, `data/README.md`
Bei Lücken: nicht raten, im Plan als offene Frage nennen.

## Harte Regeln
- Design nur nach Corporate Design: Markenfarben, Inter lokal, Logo-SVGs aus `brand/logo/`. Skill `eposium-brand` bei jeder UI-Arbeit nutzen.
- Offline-fähig: keine externen CDNs, Fonts oder Skripte zur Laufzeit. Externe Daten nur per Vorab-Abruf in `data/cache/`.
- Jede Seite zeigt "Prototyp, Beispieldaten" (bei Echt-Modus: "Ihre Daten bleiben im Browser").
- Beispieldaten sind fiktiv (`data/`). Keine erfundenen Aussagen zu echten Firmen. Keine ®/™.
- Marketingaussagen (DSGVO-konform, EU-Hosting, manipulationssicher, eigenes Modell je Kunde) nur anzeigen, wenn der Prototyp sie belegbar einlöst. Das Audit-Log ist verkettet (SHA-256), mehr nicht behaupten.
- Besucherdaten: nur im Browserspeicher (RAM), nicht persistieren, nicht senden. Reset löscht alles.
- Keine Secrets im Code. `.env` nur für optionalen Live-Modus, Key nur serverseitig.
- Keine destruktiven Befehle ohne Rückfrage. Keine Änderung außerhalb dieses Projektordners.

## Standard-Tech (änderbar, aber im Plan begründen)
Vite + React + TypeScript, reines CSS mit `brand/tokens.css`, `papaparse` (CSV) und `xlsx` (XLSX) lokal gebündelt, Vitest für Logik, Playwright für Browser-Tests und Screenshots. Optional kleiner Node-Server nur für Cache-Skripte und Live-Modus-Proxy.

## Arbeitsweise
- Zuerst Plan (Plan-Modus), Freigabe abwarten. Dann in kleinen Meilensteinen, jeweils testen und kurz berichten.
- Rechnen statt behaupten: Alle Zahlen im Vergleich werden aus den Rohdaten berechnet und in der Oberfläche nachvollziehbar erklärt (Formel sichtbar).
- Vor "fertig": `docs/MESSE_CHECKLISTE.md` abarbeiten und Screenshots (1920x1080 und 1180x820) gegen `brand/reference/*preview*.png` prüfen.
