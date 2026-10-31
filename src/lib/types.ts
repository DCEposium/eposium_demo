// Datenmodell der Epos-Demo. Siehe Plan docs/.. / /Users/.../greedy-puzzling-shannon.md
// für die Herleitung und die von Hand nachgerechneten Beispielwerte.

export interface Bestellanforderung {
  id: string;
  datum: string;
  besteller: string;
  artikel: string;
  menge: number;
  einheit: string;
  wunschtermin: string;
  lieferort: string;
  anforderungen: string[];
  budgetrahmen_netto_eur: number;
}

export interface Lieferant {
  id: string;
  name: string;
  land: string;
  zahlungsmoral_hinweis: string;
  rahmenvertrag: boolean;
}

export interface Zertifikat31 {
  /** true = im Angebot genannt verfügbar/geliefert */
  verfuegbar: boolean;
  /** true = ohne gesonderte Berechnung enthalten */
  inklusive: boolean;
  kostenNetto?: number;
}

export interface Preisstaffel {
  /** Ab dieser Stückzahl gilt stueckpreisNetto */
  abMenge: number;
  /** Nettopreis je Stück nach Umrechnung (brutto→netto, Karton→Stück o. Ä.) */
  stueckpreisNetto: number;
}

export interface NormalisiertesAngebot {
  lieferantId: string;
  angebotsnummer: string;
  /** Mindestens ein Eintrag (abMenge: 1), bei Staffelpreisen mehrere, aufsteigend sortiert */
  preisstaffeln: Preisstaffel[];
  mindestmenge?: number;
  kartoneinheit?: number;
  incoterm: string;
  lieferzeitWerktage: number;
  zahlungszielTage: number;
  skontoProzent?: number;
  skontoFristTage?: number;
  gewaehrleistungMonate: number;
  zertifikat31: Zertifikat31;
  versandkostenNetto: number;
  versandkostenfreiAbWarenwert?: number;
  annahmen: string[];
  rohquelle: { dateiname: string; text: string };
}
