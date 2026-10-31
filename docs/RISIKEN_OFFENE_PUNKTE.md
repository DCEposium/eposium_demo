# Risiken und offene Punkte

Stand: nach Meilenstein 7 (Härtung). Diese Liste ersetzt nicht die Prüfung vor Ort.

## Außerhalb des Baubereichs (laut README.md, von Eposium zu klären)

- **Domain/QR-Ziele**: Die Abschluss-Seite zeigt "eposium.de" als Text (aus dem Marketingmaterial übernommen) und einen Platzhalter "QR-Code folgt" statt eines erfundenen Links. Echte QR-Ziele (Umfrage, Pilotpartner-Formular) müssen vor der Messe eingesetzt werden — dafür bräuchte es echte URLs, die dieser Prototyp nicht erfinden darf.
- **Logos Dritter** (Hochschule Bochum, Start-up Center NRW): nicht verwendet, wie in `brand/BRAND.md` gefordert.
- **Markenname "Epos"**: Rechtsrisiko laut README nicht geprüft, liegt außerhalb der technischen Umsetzung.
- **Freigabe der Marketingaussagen** (DSGVO-konform, EU-Hosting) vor Messe-Einsatz: siehe `docs/MARKETINGAUSSAGEN_ABGLEICH.md` für den technischen Stand, die rechtliche/organisatorische Freigabe ist gesondert zu klären.

## Fachliche Annahmen in der Berechnungslogik (in der Oberfläche sichtbar gekennzeichnet)

- **Angebot A, Werkszeugnis 3.1**: Rohtext nennt nur einen Preis je Zeugnis ("6,50 EUR je Zeugnis"), keine Stückzahl. Angenommen: 1 Zeugnis je Bestellung, nicht je Stück. Als Annahme im UI sichtbar.
- **Angebot B, Skonto und Versandkostenfreigrenze**: Rohtext nennt nur Bruttowerte ("Preise inkl. 19 % MwSt."). Angenommen: Skonto und die 500-€-Freigrenze beziehen sich auf denselben (aus brutto umgerechneten) Nettobetrag wie der Rest der Rechnung. Als Annahme im UI sichtbar.
- **Lieferzeit-Berechnung**: Werktage ohne Feiertage gerechnet (Mo–Fr). Das voraussichtliche Lieferdatum ist daher ein "ca."-Wert. Keine öffentliche, offline nutzbare Feiertagsquelle war im Scope dieses Prototyps eingeplant.
- **TED-Kontextkarte** (falls künftig eingebaut, siehe "Kann" im Plan): `total-value` ist bei vielen TED-Bekanntmachungen nicht gepflegt. Nicht als verlässliche Zahl verwenden, nur Titel/Käufer/Land/Datum.

## Technische Risiken

- **Bundle-Größe**: Der Produktionsbuild liegt bei ca. 575 KB minifiziert (ca. 192 KB gzip), hauptsächlich durch die SheetJS-Bibliothek (XLSX-Parsing im Echt-Modus). Für den lokalen Messe-Betrieb unkritisch (kein Internet-Download, lädt von Platte/LAN), aber bei einem künftigen Ausbau sollte `xlsx` ggf. per dynamischem `import()` nachgeladen werden, damit der Standarddurchlauf nicht davon betroffen ist.
- **Kiosk-Vollbild nur für macOS automatisiert** (`scripts/demo.mjs` sucht Google Chrome unter dem Standardpfad). Auf einem Windows- oder Linux-Gerät am Stand müsste der Vollbildmodus manuell aktiviert werden (siehe `BETRIEBSANLEITUNG.md`).
- **Kein Node auf iPadOS**: Das iPad kann die Demo nicht selbst bauen oder servieren, sondern braucht ein zweites Gerät im selben Netzwerk (siehe Betriebsanleitung). Ein Netzwerkausfall zwischen beiden Geräten legt die iPad-Ansicht lahm, auch wenn die Demo selbst offlinefähig ist.
- **Datums-/Zeitzonenlogik**: Während der Entwicklung wurden zwei echte Zeitzonen-Fehler gefunden und behoben (`Date.toISOString()` verschiebt lokale Mitternacht vor UTC auf den Vortag). Die Korrektur (`zuLokalemISODatum`/`parseLokalesDatum`) ist getestet, aber nur für Zeitzonen vor UTC (wie MEZ/MESZ) praxisrelevant geprüft.
- **Inaktivitäts-Timer per `setInterval`**: Läuft zuverlässig im Vordergrund-Tab. Wird der Browser-Tab in den Hintergrund gelegt (z. B. anderes Fenster aktiv), drosseln manche Browser Timer — der Rücksprung könnte dann leicht verzögert erfolgen. Für den Kiosk-Betrieb (ein Vollbild-Tab, kein Wechsel) unkritisch.

## Bewusst zurückgestellt (Nutzerentscheidung während der Planung)

- **Live-Modus** (echter KI-Aufruf für das Verhandlungsbriefing über einen serverseitigen Proxy): nicht gebaut. Der Schalter ist sichtbar, aber fest deaktiviert und als "in diesem Prototyp nicht aktiv" gekennzeichnet. Kein Server-Code, kein `.env`-Handling in diesem Durchlauf.

## Nicht umgesetzt ("Kann", laut PROMPT.md optional)

- Vertiefungsmodus mit allen sechs Schmerzpunkten als Kartenübersicht.
- TED-Kontextkarte ("So kaufen öffentliche Auftraggeber in Ihrer Warengruppe") — Datenquelle ist verifiziert und gecacht (`data/cache/ted_kontext.json`), aber nicht in die Oberfläche eingebaut.
- PDF-Export des Vergleichs.
- Englische Sprachumschaltung.

## Vor der Messe zwingend zu tun

- `npm run demo` einmal auf dem tatsächlichen Messe-Laptop und mit dem tatsächlichen iPad durchspielen (siehe `BETRIEBSANLEITUNG.md`, Abschnitt "Vor der Messe prüfen").
- Backup-Gerät mit identischem `dist/`-Stand vorbereiten.
- Echte QR-Ziele einsetzen, sobald verfügbar (ersetzt den Platzhalter im Abschluss-Screen).
