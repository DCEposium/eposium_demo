# Epos — Eposium Messe-Demo

Klickbarer Prototyp des KI-Einkaufs-Copiloten "Epos" für den Messestand. Vite + React +
TypeScript, läuft vollständig offline im Browser, keine Persistenz von Besucherdaten.

## Schnellstart

```
npm install
npm run demo
```

`npm run demo` baut den Produktionsbuild und startet ihn lokal (Port 4173), auf macOS
zusätzlich im Kiosk-Vollbild. Details, iPad-Bereitstellung und Fehlersuche:
[`docs/BETRIEBSANLEITUNG.md`](docs/BETRIEBSANLEITUNG.md).

Für die Entwicklung: `npm run dev` (Vite-Dev-Server mit Hot Reload — nicht für den
Messe-Betrieb, siehe Betriebsanleitung).

## Tests

```
npm run test       # Vitest: Parser, Normalisierung, Gesamtkosten, Hash-Kette, Preis-Check
npm run test:e2e   # Playwright: kompletter Durchlauf, Echt-Modus, Reset, Inaktivität, Offline
```

## Projektstand

Alle sieben Meilensteine aus dem Bau-Plan sind umgesetzt (Gerüst, Daten/Parser,
Vergleichslogik, Preis-Check/Briefing, Freigabe/Audit, Echt-Modus, Härtung). Siehe:

- [`docs/BETRIEBSANLEITUNG.md`](docs/BETRIEBSANLEITUNG.md) — Start, Reset, Fehlersuche, iPad.
- [`docs/RISIKEN_OFFENE_PUNKTE.md`](docs/RISIKEN_OFFENE_PUNKTE.md) — Annahmen, Risiken, was bewusst nicht gebaut wurde.
- [`docs/MARKETINGAUSSAGEN_ABGLEICH.md`](docs/MARKETINGAUSSAGEN_ABGLEICH.md) — welche Aussagen aus dem Marketingmaterial die Demo belegt.
- [`docs/DATA_SOURCES_VERIFIZIERT.md`](docs/DATA_SOURCES_VERIFIZIERT.md) — live geprüfte externe Datenquellen (TED, Eurostat, Wechselkurse).
- [`docs/MESSE_CHECKLISTE.md`](docs/MESSE_CHECKLISTE.md) — Abnahmestatus.

## Inhalt

| Pfad | Inhalt |
| --- | --- |
| `src/` | Die App: Screens, Komponenten, Berechnungslogik, Parser, State |
| `e2e/` | Playwright-Testsuite (Chromium + iPad/WebKit) |
| `brand/` | Logos, Inter-Schrift, Farben (`tokens.css`/`.json`), Originale in `brand/reference/` |
| `data/` | Fiktive Bestellanforderung, drei Rohangebote, Preishistorie, Lieferanten, `data/cache/` (vorab abgerufene externe Daten) |
| `docs/` | Produktbrief, Betriebsanleitung, Risiken, Marketingaussagen-Abgleich, Screenshots |
| `scripts/` | `sync-brand.mjs`, `fetch-data/`, `demo.mjs` (Kiosk-Start), `setup-skills.sh` |
| `.claude/skills/` | `eposium-brand` (eigen), `frontend-design`/`webapp-testing`/`skill-creator` (Anthropic, Apache-2.0) |

## Offene Punkte (außerhalb des Baubereichs, von Eposium zu klären)

- Domain/Mail auf dem Plakat (eposium.de) und echte QR-Ziele (Umfrage, Pilotpartner) bereitstellen — der Abschluss-Screen zeigt bewusst einen Platzhalter statt eines erfundenen Links.
- Logos Dritter (Hochschule Bochum, Start-up Center) nicht verwenden, solange keine Freigabe da ist.
- Freigabe der Marketingaussagen (DSGVO-konform, EU-Hosting) vor Messe prüfen lassen (siehe `docs/MARKETINGAUSSAGEN_ABGLEICH.md` für den technischen Stand).
- Namensrisiko "Epos" vor breiter öffentlicher Nutzung mit Patentanwalt klären.
