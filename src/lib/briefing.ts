import type { Bestellanforderung, Lieferant } from "./types";
import type { VergleichsEintrag } from "./vergleichsdaten";
import { formatEuro, formatZahl } from "./calc/zahlenformat";

export interface Verhandlungsbriefing {
  zielpreisNetto: number;
  ziele: string[];
  argumente: string[];
  zugestaendnisse: string[];
  fragenAnLieferant: string[];
  emailEntwurf: string;
}

/**
 * Erzeugt ein deterministisches Verhandlungsbriefing aus den bereits
 * berechneten Fakten (keine KI, kein Zufall) — siehe PROMPT.md: "Standard
 * sind deterministische, aus den berechneten Fakten erzeugte Texte."
 */
export function erzeugeBriefing(
  eintrag: VergleichsEintrag,
  alleEintraege: VergleichsEintrag[],
  lieferant: Lieferant,
  ba: Bestellanforderung
): Verhandlungsbriefing {
  const { angebot, ergebnis, preisEinschaetzung, lieferantName } = eintrag;
  const aktuellerPreis = angebot.preisstaffeln[0].stueckpreisNetto;

  const guenstigsterAndererPreis = Math.min(
    ...alleEintraege
      .filter((e) => e.angebot.lieferantId !== angebot.lieferantId)
      .map((e) => e.angebot.preisstaffeln[0].stueckpreisNetto)
  );

  const zielpreisNetto = Math.min(
    preisEinschaetzung.letzterHistorischerPreis ?? aktuellerPreis,
    guenstigsterAndererPreis,
    aktuellerPreis
  );

  const ziele: string[] = [
    `Stückpreis auf ca. ${formatEuro(zielpreisNetto)} senken (aktuell ${formatEuro(aktuellerPreis)}).`,
    `Gesamtkosten für ${ba.menge} Stück unter ${formatEuro(ergebnis.gesamtkostenNetto)} bringen.`,
  ];
  if (!ergebnis.erreichtWunschtermin) {
    ziele.push(`Lieferung bis ${ba.wunschtermin.split("-").reverse().join(".")} absichern.`);
  }

  const argumente: string[] = [];
  if (preisEinschaetzung.anzahlHistorischerDatenpunkte > 0) {
    argumente.push(`Preis-Check: ${preisEinschaetzung.einschaetzung}`);
  }
  if (aktuellerPreis > guenstigsterAndererPreis) {
    argumente.push(
      `Andere Angebote liegen bei ${formatEuro(guenstigsterAndererPreis)} je Stück (netto, vor Zusatzkosten).`
    );
  }
  for (const hinweis of ergebnis.nichtVergleichbarHinweise) {
    argumente.push(`${hinweis.feld}: ${hinweis.hinweis}`);
  }
  if (argumente.length === 0) {
    argumente.push("Dieses Angebot erfüllt bereits alle Anforderungen — Verhandlung zielt auf den Preis.");
  }

  const zugestaendnisse: string[] = [];
  if (angebot.skontoProzent) {
    zugestaendnisse.push(
      `Zahlung innerhalb von ${angebot.skontoFristTage} Tagen zusichern (Skonto bereits im Angebot enthalten).`
    );
  } else {
    zugestaendnisse.push("Schnellere Zahlung anbieten, falls das einen zusätzlichen Nachlass ermöglicht.");
  }
  if (angebot.preisstaffeln.length > 1) {
    const staffel = angebot.preisstaffeln[angebot.preisstaffeln.length - 1];
    zugestaendnisse.push(
      `Perspektivisch größere Mengen in Aussicht stellen (ab ${staffel.abMenge} Stück bietet der Lieferant selbst ${formatEuro(staffel.stueckpreisNetto)} je Stück).`
    );
  }
  zugestaendnisse.push(
    lieferant.rahmenvertrag
      ? "Auf den bestehenden Rahmenvertrag verweisen, um Konditionen zu sichern."
      : "Einen Rahmenvertrag für künftige Bestellungen als Gegenleistung anbieten."
  );

  const fragenAnLieferant: string[] = ergebnis.nichtVergleichbarHinweise.map((hinweis) => {
    switch (hinweis.feld) {
      case "Werkszeugnis 3.1":
        return "Können Sie das Werkszeugnis 3.1 ohne Aufpreis im Angebot ergänzen?";
      case "Gewährleistung":
        return `Ist eine Verlängerung der Gewährleistung auf ${ba.anforderungen.find((a) => /Gewährleistung/i.test(a))?.match(/\d+/)?.[0] ?? "24"} Monate möglich?`;
      case "Incoterm":
        return `Ist eine Lieferung "${ba.anforderungen.find((a) => /^Lieferung/i.test(a))?.replace(/^Lieferung\s+/i, "")}" statt "${angebot.incoterm}" darstellbar, und zu welchen Kosten?`;
      case "Menge":
        return `Ist eine Abnahme von genau ${ba.menge} Stück ohne Mehrkosten möglich?`;
      case "Liefertermin":
        return "Ist eine Express-Lieferung bis zum Wunschtermin möglich, und zu welchen Mehrkosten?";
      default:
        return `${hinweis.feld}: Gibt es hier Spielraum?`;
    }
  });
  if (fragenAnLieferant.length === 0) {
    fragenAnLieferant.push("Gibt es einen besseren Preis bei einer schnelleren Zahlung unsererseits?");
  }

  const emailEntwurf = [
    `Betreff: Anfrage zu Angebot ${angebot.angebotsnummer} — ${ba.artikel}`,
    "",
    `Sehr geehrte Damen und Herren von ${lieferantName},`,
    "",
    `vielen Dank für Ihr Angebot ${angebot.angebotsnummer} über ${ba.menge} Stück "${ba.artikel}" (Bestellanforderung ${ba.id}).`,
    `Wir haben Ihr Angebot mit den uns vorliegenden Alternativen verglichen und möchten vor der Beauftragung noch folgende Punkte klären:`,
    "",
    ...fragenAnLieferant.map((f) => `- ${f}`),
    "",
    `Bei einem Stückpreis von ca. ${formatEuro(zielpreisNetto)} und der Zusage des Liefertermins ${ba.wunschtermin
      .split("-")
      .reverse()
      .join(".")} sind wir an einer kurzfristigen Beauftragung interessiert.`,
    "",
    "Mit freundlichen Grüßen",
    ba.besteller,
  ].join("\n");

  return { zielpreisNetto, ziele, argumente, zugestaendnisse, fragenAnLieferant, emailEntwurf };
}

export function formatiereZielpreisDelta(aktuellerPreis: number, zielpreis: number): string {
  const deltaProzent = ((aktuellerPreis - zielpreis) / aktuellerPreis) * 100;
  return `${formatZahl(deltaProzent, 1)} % unter dem aktuellen Angebotspreis`;
}
