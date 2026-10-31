# Messe-Abnahme (Definition of Done für den Betrieb am Stand)

- [ ] Start mit einem Befehl (`npm run demo`), öffnet Vollbild/Kiosk, ohne Dev-Overlay.
- [ ] Läuft komplett ohne Internet (Cache vorhanden, keine externen Fonts/Skripte/CDNs). Test: WLAN aus.
- [ ] Reset-Taste (sichtbar und per Tastenkürzel) setzt auf Startzustand, löscht hochgeladene Dateien und Eingaben im Speicher.
- [ ] Automatischer Rücksprung zur Startseite nach 90 Sekunden Inaktivität (Hinweis 10 Sekunden vorher).
- [ ] Alle Texte Deutsch, Sie-Form, Markenfarben, Inter, Logo korrekt.
- [ ] Lesbar aus 1 m Abstand auf 1920x1080 und iPad 1180x820 (Querformat).
- [ ] Kennzeichnung "Prototyp, Beispieldaten" sichtbar auf jeder Seite.
- [ ] Echt-Modus: Datei lokal laden, parsen, keine Netzwerkübertragung (im Netzwerk-Tab prüfen), nach Reset weg.
- [ ] Audit-Log: Verkettete Hashes, Export als JSON/CSV, Manipulationstest (eine Zeile ändern, Prüfung schlägt fehl).
- [ ] Playwright-Tests grün, Screenshots in `docs/screenshots/`.
- [ ] Backup: Build als statische Dateien (`dist/`) plus Aufnahme der Demo als MP4/GIF für den Notfall.
- [ ] Strom, Ladekabel, zweites Gerät mit derselben Demo.
