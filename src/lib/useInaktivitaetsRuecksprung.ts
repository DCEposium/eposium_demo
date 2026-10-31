import { useEffect, useState } from "react";

// Dauer per URL-Parameter überschreibbar (?inaktivitaetMs=3000&vorwarnungMs=1000),
// damit Playwright den Ablauf nicht 90 echte Sekunden lang abwarten muss. Für
// Messe-Besucher harmlos: niemand tippt diese Parameter versehentlich ein,
// Standardverhalten bleibt 90 s / 10 s Vorwarnung (siehe MESSE_CHECKLISTE.md).
function leseDauerParameter(name: string, standard: number): number {
  const wert = new URLSearchParams(window.location.search).get(name);
  const zahl = wert ? Number.parseInt(wert, 10) : NaN;
  return Number.isFinite(zahl) && zahl > 0 ? zahl : standard;
}

const GESAMT_MS = leseDauerParameter("inaktivitaetMs", 90_000);
const VORWARNUNG_MS = leseDauerParameter("vorwarnungMs", 10_000);
const AKTIVITAETS_EREIGNISSE = ["pointerdown", "keydown", "touchstart", "wheel"] as const;

/**
 * Springt nach GESAMT_MS ohne Interaktion zurück zum Start (Reset), mit einer
 * Vorwarnung in den letzten VORWARNUNG_MS. `aktiv=false` auf dem Attract-
 * Screen selbst, dort ist ein Rücksprung sinnlos.
 */
export function useInaktivitaetsRuecksprung(aktiv: boolean, rücksprung: () => void): number | null {
  const [verbleibendeSekunden, setVerbleibendeSekunden] = useState<number | null>(null);

  useEffect(() => {
    if (!aktiv) {
      setVerbleibendeSekunden(null);
      return;
    }

    let letzteAktivitaet = Date.now();
    const aufAktivitaet = () => {
      letzteAktivitaet = Date.now();
    };
    for (const ereignis of AKTIVITAETS_EREIGNISSE) {
      window.addEventListener(ereignis, aufAktivitaet);
    }

    const intervall = window.setInterval(() => {
      const rest = GESAMT_MS - (Date.now() - letzteAktivitaet);
      if (rest <= 0) {
        rücksprung();
      } else if (rest <= VORWARNUNG_MS) {
        setVerbleibendeSekunden(Math.ceil(rest / 1000));
      } else {
        setVerbleibendeSekunden(null);
      }
    }, 250);

    return () => {
      for (const ereignis of AKTIVITAETS_EREIGNISSE) {
        window.removeEventListener(ereignis, aufAktivitaet);
      }
      window.clearInterval(intervall);
    };
  }, [aktiv, rücksprung]);

  return verbleibendeSekunden;
}
