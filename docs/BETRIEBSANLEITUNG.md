# Betriebsanleitung für den Messestand

## Start

1. Im Projektordner: `npm install` (einmalig, oder nach Änderungen an `package.json`).
2. `npm run demo`
   - Baut den Produktionsbuild (`dist/`) und startet einen schlanken lokalen Server auf Port 4173.
   - Auf macOS wird zusätzlich versucht, Google Chrome im Kiosk-Vollbild zu öffnen (`--kiosk`, privates Fenster). Ist Chrome nicht unter dem Standardpfad installiert, öffnet sich stattdessen der Standardbrowser in einem normalen Fenster — dann manuell mit `Cmd+Ctrl+F` in den Vollbildmodus wechseln.
   - Auf anderen Betriebssystemen (Windows, Linux) öffnet `npm run demo` nur den Server; die ausgegebene Adresse (`http://localhost:4173`) manuell im Browser öffnen und per `F11` in den Vollbildmodus wechseln.
3. Zum Beenden: im Terminal `Strg+C`.

Es gibt **keinen Dev-Overlay** in diesem Modus: `npm run demo` liefert ausschließlich den fertigen Produktionsbuild aus `dist/`, nie den Vite-Dev-Server.

## iPad-Bereitstellung (Standardempfehlung)

Ein eigener Build auf dem iPad ist nicht vorgesehen (kein Node auf iPadOS). Empfohlenes Vorgehen:

1. Laptop/Mac mit `npm run demo` im Stand-WLAN starten (Server läuft auf Port 4173 dieses Geräts).
2. Auf dem Laptop die lokale Netzwerkadresse ermitteln (z. B. `ipconfig getifaddr en0` auf macOS) statt `localhost`.
3. Auf dem iPad in Safari `http://<Laptop-IP>:4173` öffnen.
4. Auf dem iPad **Einstellungen → Bedienungshilfen → Zugriffsführung (Guided Access)** aktivieren und für Safari in dieser Seite starten. Das sperrt das iPad auf diese eine Seite (kein versehentliches Verlassen, keine Statusleiste), bis die Zugriffsführung per Code wieder beendet wird.
5. Reset über den sichtbaren "Zurücksetzen"-Knopf in der Oberfläche; ein komplettes Schließen/Neuladen ist für den normalen Messebetrieb nicht nötig.

Alternative, falls kein gemeinsames WLAN zur Verfügung steht: den `dist/`-Ordner direkt auf das iPad kopieren (AirDrop/Dateien-App) und mit einer lokalen Static-File-App öffnen, oder einen USB-Hotspot zwischen Laptop und iPad einrichten. Beides ist nicht Teil dieses Repos und müsste vor Ort geprüft werden.

## Reset

- Sichtbarer Knopf "Zurücksetzen" oben rechts auf jedem Bildschirm nach dem Start.
- Tastenkürzel **Umschalt+Escape** setzt von überall sofort zurück (für das Standpersonal, z. B. zwischen zwei Besuchern, ohne erst zum Knopf greifen zu müssen).
- Automatischer Rücksprung zum Start nach 90 Sekunden Inaktivität (Vorwarnung 10 Sekunden vorher).
- Beides löscht denselben In-Memory-Zustand vollständig: hochgeladene Dateien (Echt-Modus), ausgewählter Lieferant, Verhandlungsbriefing, Audit-Protokoll. Es gibt keine Persistenz (kein `localStorage`), ein Neuladen der Seite (`F5`) setzt ebenfalls vollständig zurück.

## Fehlersuche

| Symptom | Vermutliche Ursache | Vorgehen |
| --- | --- | --- |
| `npm run demo` bricht mit "Nicht gefunden" ab | `dist/` fehlt oder ist veraltet | `npm run build` manuell ausführen und auf Fehler prüfen |
| Schrift sieht falsch aus (Systemschrift statt Inter) | `public/brand/` fehlt (z. B. nach manuellem Löschen) | `npm run sync-brand` ausführen (läuft sonst automatisch vor `dev`/`build`) |
| Leere/weiße Seite | JavaScript-Fehler im Build | Browser-Konsole öffnen (`Cmd+Alt+I`), Fehlermeldung lesen; `npm run build` erneut ausführen |
| Demo reagiert nicht mehr auf Eingaben | Unwahrscheinlicher React-Zustandsfehler | "Zurücksetzen" klicken; hilft das nicht, Seite neu laden (`F5`) |
| iPad zeigt "Website nicht erreichbar" | Laptop und iPad nicht im selben WLAN, oder Laptop-Firewall blockiert eingehende Verbindungen | Beide Geräte im selben Netzwerk prüfen; macOS-Firewall-Eingabeaufforderung für Node bestätigen |
| Echt-Modus erkennt Spalten falsch | Ungewöhnliche Spaltenüberschriften in der hochgeladenen Datei | Im Zuordnungsdialog die Spalten manuell zuweisen (siehe Dropdown-Felder) |

## Vor der Messe prüfen

- `npm run test` (Vitest) grün.
- `npm run test:e2e` (Playwright, Chromium und iPad/WebKit) grün — baut automatisch frisch und testet den Produktionsbuild.
- `npm run demo` einmal real auf dem Messe-Laptop und mit dem tatsächlichen iPad durchspielen, inklusive WLAN-Test (Flugmodus/WLAN aus, Demo muss weiterlaufen).
- Backup: `dist/`-Ordner als ZIP sichern, zusätzlich ein zweites Gerät mit identischer Demo vorbereiten (siehe `docs/MESSE_CHECKLISTE.md`).
