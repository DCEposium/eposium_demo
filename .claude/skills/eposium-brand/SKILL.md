---
name: eposium-brand
description: Eposium Corporate Design für jede UI, Folie, Grafik oder Textausgabe der Eposium-Demo. Nutzen bei allen visuellen und sprachlichen Entscheidungen (Farben, Inter, Logo, Karten, Ton, Claims).
---

# Eposium Brand

Bei jeder Oberfläche, Grafik oder jedem Text für Eposium zuerst `brand/BRAND.md` lesen und `brand/tokens.css` einbinden. Originale: `brand/reference/` (Corporate Design Guide, Plakat A3, Anzeige A5). Bei Widerspruch gewinnt der Guide.

## Muss
- Farben ausschließlich aus den Tokens: Dunkelblau #00021D, Türkis #047C85, Helltürkis #7DBEB7, Weiß, Lichtgrau #F2F4F5. Keine weiteren Farbtöne einführen. Aufhellung/Transparenz dieser Farben ist erlaubt.
- Schrift: Inter (lokal aus `brand/fonts/`), keine externen Font-Aufrufe. Headline Bold, Zwischenüberschrift Medium, Fließtext Regular. Größenverhältnisse H1 2,71 : H2 1,79 : H3 1,33 : Fließtext 1.
- Logo: nur die SVG-Dateien in `brand/logo/`. Auf dunklem Grund `eposium-logo-on-dark.svg`, auf hellem Grund `eposium-logo-color.svg`, auf Türkis `eposium-logo-white.svg`. Nicht verzerren, umfärben, mit Effekten versehen oder nachbauen. Freiraum mindestens Höhe des "E".
- Layout wie auf Plakat/Anzeige: dunkler Grund mit weißer Headline, Kicker in Helltürkis, weiße Karten mit Radius ca. 20 px, Icon links, Titel Medium, Fußleiste mit sehr hellem Türkis-Ton und Nutzenaussage. Großzügiger Weißraum, klares Raster.
- Texte: Deutsch, Sie-Form, direkt, konkret, kurze Sätze, keine Superlative, keine Emojis. Zahlen deutsch formatiert (1.234,56 €, 20.11.2026).
- Kontrast mindestens WCAG AA. Helltürkis nur auf dunklem Grund, Türkis auf hellem Grund für Text ab 18 px oder fett.

## Nicht
- Keine Stockfotos, keine Logos Dritter (Hochschule Bochum, Start-up Center usw.) ohne ausdrückliche Freigabe.
- Keine Marketingaussagen (DSGVO-konform, EU-Hosting, manipulationssicher, eigenes Modell je Kunde, läuft mit Excel) als erfüllt darstellen, wenn der Prototyp sie nicht einlöst. Im Zweifel "Prototyp" und was tatsächlich umgesetzt ist.
- Keine ®-/™-Zeichen.
- Namen von echten Firmen nur als echte Daten aus öffentlichen Quellen mit Quellenangabe, nie als erfundene Lieferanten.

## Prüfliste vor jedem Abschluss
1. Nur Markenfarben, nur Inter, Logo-Variante passend zum Grund.
2. Kontrast und Schriftgröße auf 1920x1080 und iPad (1180x820) lesbar aus 1 m.
3. Alle Texte Sie-Form, ohne Emojis, ohne unbelegte Versprechen.
4. Screenshot gegen `brand/reference/poster_preview-1.png` und `anzeige_preview-1.png` vergleichen: wirkt es wie dieselbe Marke?
