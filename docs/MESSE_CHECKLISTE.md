# Messe-Abnahme (Definition of Done für den Betrieb am Stand)

- [x] Start mit einem Befehl (`npm run demo`), öffnet Vollbild/Kiosk, ohne Dev-Overlay. *(Automatisches Kiosk-Vollbild ist für macOS eingerichtet, siehe `docs/BETRIEBSANLEITUNG.md`. Auf anderen Betriebssystemen startet derselbe Befehl den Server, Vollbild muss dort manuell aktiviert werden.)*
- [x] Läuft komplett ohne Internet (Cache vorhanden, keine externen Fonts/Skripte/CDNs). Test: WLAN aus. *(Playwright-Test `haertung.spec.ts` simuliert WLAN aus nach dem ersten Laden; `index.html`/`tokens.css` laden nur lokale Schriften, keine CDNs.)*
- [x] Reset-Taste (sichtbar und per Tastenkürzel) setzt auf Startzustand, löscht hochgeladene Dateien und Eingaben im Speicher. *(Sichtbarer Knopf plus Umschalt+Escape, per Test abgedeckt.)*
- [x] Automatischer Rücksprung zur Startseite nach 90 Sekunden Inaktivität (Hinweis 10 Sekunden vorher). *(Per Test mit beschleunigter Zeit abgedeckt, Standardwerte 90 s/10 s im Produktionsbuild unverändert.)*
- [x] Alle Texte Deutsch, Sie-Form, Markenfarben, Inter, Logo korrekt. *(Stichwortsuche nach Du-Form und hartkodierten Farben außerhalb der Tokens ergab keine Treffer.)*
- [x] Lesbar aus 1 m Abstand auf 1920x1080 und iPad 1180x820 (Querformat). *(Screenshots aller Bildschirme in beiden Auflösungen: `docs/screenshots/final/`.)*
- [x] Kennzeichnung "Prototyp, Beispieldaten" sichtbar auf jeder Seite. *(Im Echt-Modus stattdessen "Ihre Daten bleiben im Browser", wie in `CLAUDE.md` vorgesehen.)*
- [x] Echt-Modus: Datei lokal laden, parsen, keine Netzwerkübertragung (im Netzwerk-Tab geprüft), nach Reset weg. *(Playwright-Test zählt Netzwerkanfragen während des gesamten Uploads/Auswertens: null externe Anfragen.)*
- [x] Audit-Log: Verkettete Hashes, Export als JSON/CSV, Manipulationstest (eine Zeile ändern, Prüfung schlägt fehl). *(Manipulationsdemo-Knopf + Vitest- und Playwright-Tests.)*
- [x] Playwright-Tests grün, Screenshots in `docs/screenshots/`. *(14/14 Tests auf Chromium und iPad/WebKit, siehe `e2e/`.)*
- [ ] Backup: Build als statische Dateien (`dist/`) plus Aufnahme der Demo als MP4/GIF für den Notfall. *(`dist/` lässt sich jederzeit per `npm run build` erzeugen; die Video-/GIF-Aufnahme ist eine organisatorische Aufgabe vor Ort, kein Code-Artefakt dieses Repos.)*
- [ ] Strom, Ladekabel, zweites Gerät mit derselben Demo. *(Reine Logistik, außerhalb des Baubereichs.)*

Die beiden offenen Punkte sind bewusst nicht per Code abhakbar — sie gehören zur Vorbereitung vor Ort (siehe `docs/BETRIEBSANLEITUNG.md`, Abschnitt "Vor der Messe prüfen").
