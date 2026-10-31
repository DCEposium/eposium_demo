# Daten

Alles in diesem Ordner ist **fiktiv** (Messe-Demo). Die drei Rohangebote sind bewusst unterschiedlich aufgebaut (Währungs-/Mengen-/Einheitenformate, brutto/netto, Mindestmengen, Kartoneinheiten, Incoterms, Skonto, Zertifikate), damit der Demo-Effekt "Angebote sind nicht vergleichbar, Epos macht sie vergleichbar" echt nachvollziehbar ist.

Erwartete Stolperstellen, die die Demo erkennen und erklären soll (Claude Code soll die Rechnung selbst und nachvollziehbar durchführen, die Ergebnisse stehen hier absichtlich nicht):
- Angebot B nennt Bruttopreise und Mindestabnahme 50 bei Bedarf 40.
- Angebot C bietet nur volle Kartons zu je 10 Stück, Frachtkosten separat, Incoterm FCA statt Lieferung DAP Werk.
- Angebot A hat Staffelpreis ab 100 Stück (Bedarf 40), Werkszeugnis kostenpflichtig, Versandpauschale.
- Gewährleistung unterscheidet sich (12 oder 24 Monate), Zahlungsziele unterscheiden sich (Skonto, 30, 60 Tage), Lieferzeiten 5 bis 21 Werktage gegen Wunschtermin 20.11.
- Historische Preise liefern den Referenzpreis für "Ist der Preis wirklich fair?".

Für den Echt-Modus lädt der Besucher eigene Dateien (CSV/XLSX). Es werden keine echten Besucherdaten im Repo abgelegt (siehe `.gitignore`).
