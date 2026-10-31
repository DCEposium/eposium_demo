# Abgleich: Marketingaussagen gegen den Prototyp

Grundlage: die wiederkehrenden Aussagen aus `brand/BRAND.md` (Plakat A3, Anzeige A5). Für jede Aussage: wird sie in diesem Prototyp gezeigt, und ist sie durch das belegt, was der Prototyp tatsächlich tut?

| Aussage | Im Prototyp gezeigt? | Eingelöst? | Einordnung |
| --- | --- | --- | --- |
| "Was kostet Ihren Einkauf die meisten Nerven?" | Ja, Attract-Screen | — | Frage, keine Tatsachenbehauptung. |
| "Ihre rechte Hand für die B2B Beschaffung." | Nein, nicht übernommen | — | Werbeslogan, nicht überprüfbar; bewusst weggelassen, um keine Erwartung an einen fertigen Assistenten zu wecken. |
| "Demo in 15 Minuten" | Nein | — | Nicht im UI-Text übernommen; der Standarddurchlauf ist bewusst auf 2–3 Minuten ausgelegt, ein Vertiefungsmodus (bis 15 Minuten) wurde nicht gebaut (siehe "Kann" in `RISIKEN_OFFENE_PUNKTE.md`). |
| Badge "DSGVO-konform" | **Nein** | — | Absichtlich nicht gezeigt. Ein lokaler Prototyp ohne eigene Datenverarbeitung ist kein Nachweis für DSGVO-Konformität eines künftigen Produkts. |
| Badge "EU-Hosting" | **Nein** | — | Absichtlich nicht gezeigt. Der Prototyp hat kein Hosting — er läuft vollständig im Browser des Besuchers. |
| "Endlich ein Tool, zu dem die IT Ja sagt." | Nein | — | Nicht übernommen; eine solche Aussage bräuchte eine echte Sicherheitsprüfung, nicht nur einen Prototyp. |
| "Läuft mit Excel, kein neues System" | Teilweise, im Echt-Modus | **Teilweise eingelöst** | Der Echt-Modus liest echte CSV- und XLSX-Dateien direkt im Browser ein (kein Import-Tool, kein Datenformat-Workshop). Das belegt die technische Kompatibilität mit Excel-Exporten, nicht die Aussage "kein neues System" im Sinne von Prozessintegration. |
| "Datenhaltung in der EU" | Nein | — | Der Prototyp hat keine Datenhaltung: alles bleibt im Arbeitsspeicher des Browsers, nichts wird gespeichert oder übertragen. Das ist strenger als "in der EU gehostet", aber etwas anderes — die Aussage selbst wird nicht gezeigt. |
| "Rollen, Rechte, Mandantentrennung" | Teilweise, im Freigabe-Schritt | **Nur ein Ausschnitt eingelöst** | Der Freigabe-Screen fragt Rolle (Einkäufer/Abteilungsleiter) und Name ab und protokolliert beides im Audit-Log. Das ist ein Rollen-Konzept für die Demo-Handlung, **keine echten Zugriffsrechte** (jede Rolle sieht und kann in diesem Prototyp dasselbe) und **keine Mandantentrennung** (es gibt nur eine Sitzung, keine Mehrbenutzerfähigkeit). |
| "Eigenes Modell je Kunde, strikt getrennt" | Nein | — | Es gibt in diesem Prototyp kein KI-Modell. Der Live-Modus-Schalter im Verhandlungsbriefing ist sichtbar, aber bewusst deaktiviert und als "in diesem Prototyp nicht aktiv" gekennzeichnet. |
| "Manipulationssicheres Audit-Log" | Ja, Audit-Protokoll-Screen | **Präzisiert, nicht wörtlich übernommen** | Die Oberfläche behauptet absichtlich nur **"verkettet und prüfbar"**, nicht "manipulationssicher" (siehe `CLAUDE.md`). Jeder Eintrag ist per SHA-256 an seinen Vorgänger gekettet; eine Änderung an einem Eintrag lässt sich durch Nachrechnen zuverlässig **erkennen** (siehe Manipulationsdemo-Knopf). Das ist etwas anderes als "manipulationssicher" im Wortsinn: Der Chain-Zustand liegt im Arbeitsspeicher des Browsers und könnte dort technisch verändert werden (z. B. über Entwicklerwerkzeuge) — das System *erkennt* eine solche Änderung zuverlässig, *verhindert* sie aber nicht. Eine echte "Manipulationssicherheit" bräuchte eine serverseitige, append-only Speicherung außerhalb des Clients. |
| "Pilotpartner gesucht" | Ja, Abschluss-Screen | — | Aufruf zum Handeln, keine Tatsachenbehauptung. QR-Ziel ist ein Platzhalter ("QR-Code folgt"), da kein echtes Ziel vorgegeben wurde. |

## Zusammenfassung für das Team

Die Demo zeigt bewusst **nur**, was sie tatsächlich tut: Angebote vergleichbar machen, Preise einordnen, eine Verhandlung vorbereiten, eine Freigabe mit Rolle/Name/Zeit festhalten und das Ganze lückenlos und prüfbar protokollieren. Alle Aussagen zu Datenschutz, Hosting, Modelltrennung und IT-Sicherheit aus dem Marketingmaterial werden **nicht** gezeigt, weil ein lokaler Prototyp sie nicht belegt. Wer diese Aussagen am Stand mündlich macht, sollte wissen, dass die App sie nicht beweist.
