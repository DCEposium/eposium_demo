# Eposium Messe-Demo, Startpaket

Dieser Ordner ist die Grundlage für Claude Code. Er enthält Marke, Daten, Regeln und den Startprompt. Es ist noch keine App enthalten: die baut Claude Code.

## Schnellstart
1. Ordner an einen festen Ort legen (z. B. `~/Projekte/eposium-demo`) und im Terminal öffnen.
2. `git init` (empfohlen) und `bash scripts/setup-skills.sh` ausführen. Das lädt die Skills `frontend-design`, `webapp-testing`, `skill-creator` aus dem Anthropic-Repository nach `.claude/skills/`. Der eigene Skill `eposium-brand` liegt schon bei.
3. `claude` starten, mit Shift+Tab in den Plan-Modus wechseln.
4. Den kompletten Text aus `PROMPT.md` einfügen. Claude Code liest zuerst alle Dateien, stellt höchstens 5 Rückfragen und zeigt einen Plan. Erst nach deiner Freigabe wird gebaut.

## Inhalt
| Pfad | Inhalt |
| --- | --- |
| `PROMPT.md` | Startprompt zum Einfügen |
| `CLAUDE.md` | Dauerhafte Projektregeln (liest Claude Code automatisch) |
| `brand/` | Logos (SVG), Inter-Schrift, Farben (`tokens.css`/`.json`), Kurzguide, Originale und Vorschaubilder von Guide, Plakat, Anzeige |
| `data/` | Fiktive Bestellanforderung, drei Rohangebote, Preishistorie, Lieferanten |
| `docs/` | Produktbrief, Datenquellen (kostenlose APIs), Messe-Checkliste |
| `scripts/setup-skills.sh` | Skills aus dem Internet holen |
| `.claude/skills/eposium-brand/` | Eigener Skill für das Corporate Design |

## Offene Punkte (von dir zu klären)
- Domain/Mail auf dem Plakat (eposium.de) und die QR-Ziele (Umfrage, Pilotpartner) bereitstellen.
- Logos Dritter (Hochschule Bochum, Start-up Center) nicht verwenden, solange keine Freigabe da ist.
- Freigabe der Marketingaussagen (DSGVO-konform, EU-Hosting) vor Messe prüfen lassen.
- Namensrisiko "Epos" (siehe Markenrecherche) vor breiter öffentlicher Nutzung mit Patentanwalt klären.
# eposium_demo
