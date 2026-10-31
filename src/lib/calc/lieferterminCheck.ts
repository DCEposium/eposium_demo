/**
 * Addiert Werktage (Montag–Freitag) auf ein Startdatum. Feiertage werden
 * bewusst nicht berücksichtigt (keine öffentlich verlässliche, offline
 * nutzbare Feiertagsquelle eingeplant) — das Ergebnis ist daher ein "ca."-Wert,
 * siehe Kennzeichnung in der Oberfläche.
 */
export function addiereWerktage(start: Date, anzahlWerktage: number): Date {
  const ergebnis = new Date(start);
  let verbleibend = anzahlWerktage;
  while (verbleibend > 0) {
    ergebnis.setDate(ergebnis.getDate() + 1);
    const wochentag = ergebnis.getDay(); // 0 = Sonntag, 6 = Samstag
    if (wochentag !== 0 && wochentag !== 6) {
      verbleibend -= 1;
    }
  }
  return ergebnis;
}

export interface LieferterminErgebnis {
  voraussichtlichesLieferdatum: Date;
  erreichtWunschtermin: boolean;
}

export function pruefeLiefertermin(
  bestelldatum: Date,
  lieferzeitWerktage: number,
  wunschtermin: Date
): LieferterminErgebnis {
  const voraussichtlichesLieferdatum = addiereWerktage(bestelldatum, lieferzeitWerktage);
  return {
    voraussichtlichesLieferdatum,
    erreichtWunschtermin: voraussichtlichesLieferdatum.getTime() <= wunschtermin.getTime(),
  };
}
