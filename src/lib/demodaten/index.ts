// Bündelt alle mitgelieferten Beispieldaten als Bundle-Imports (kein fetch()).
// Damit funktioniert die Demo auch ohne Netzwerk und ohne lokalen Server
// (siehe CLAUDE.md: offlinefähig). Dieselben Rohtexte laufen durch dieselben
// Parser wie ein Echt-Modus-Upload.

import angebotARoh from "../../../data/angebote_roh/angebot_A_nordhaus.csv?raw";
import angebotBRoh from "../../../data/angebote_roh/angebot_B_rheinwerk.csv?raw";
import angebotCRoh from "../../../data/angebote_roh/angebot_C_nordsee.csv?raw";
import bestellanforderungJson from "../../../data/bestellanforderung.json";
import lieferantenJson from "../../../data/lieferanten.json";
import historischePreiseRoh from "../../../data/historische_preise.csv?raw";
import tedKontextJson from "../../../data/cache/ted_kontext.json";
import eurostatJson from "../../../data/cache/eurostat_erzeugerpreise.json";
import wechselkurseJson from "../../../data/cache/wechselkurse.json";

import type { Bestellanforderung, Lieferant } from "../types";

export const ROH_ANGEBOTE = {
  A: { dateiname: "angebot_A_nordhaus.csv", text: angebotARoh },
  B: { dateiname: "angebot_B_rheinwerk.csv", text: angebotBRoh },
  C: { dateiname: "angebot_C_nordsee.csv", text: angebotCRoh },
} as const;

export const BESTELLANFORDERUNG = bestellanforderungJson as Bestellanforderung;
export const LIEFERANTEN = (lieferantenJson as { lieferanten: Lieferant[] }).lieferanten;
export const HISTORISCHE_PREISE_ROH = historischePreiseRoh;
export const TED_KONTEXT_CACHE = tedKontextJson;
export const EUROSTAT_CACHE = eurostatJson;
export const WECHSELKURSE_CACHE = wechselkurseJson;
