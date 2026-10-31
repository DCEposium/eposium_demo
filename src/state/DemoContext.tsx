import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from "react";
import type { Akteur, AuditEintrag } from "../lib/types";
import { erzeugeNaechstenEintrag } from "../lib/audit/hashKette";

// Nur In-Memory (RAM). Kein localStorage/sessionStorage, keine Persistenz, keine
// Netzwerkübertragung — siehe CLAUDE.md: "Besucherdaten: nur im Browserspeicher,
// nicht persistieren, nicht senden. Reset löscht alles."

export type Screen =
  | "attract"
  | "bedarf"
  | "angebote"
  | "vergleich"
  | "preischeck"
  | "briefing"
  | "freigabe"
  | "audit";

interface DemoState {
  screen: Screen;
  ausgewaehlterLieferantId: string | null;
  auditKette: AuditEintrag[];
}

type DemoAction =
  | { type: "GEHE_ZU"; screen: Screen }
  | { type: "WAEHLE_LIEFERANT_UND_GEHE_ZU"; lieferantId: string; screen: Screen }
  | { type: "AUDIT_HINZUFUEGEN_UND_GEHE_ZU"; eintrag: AuditEintrag; screen: Screen }
  | { type: "AUDIT_MANIPULIEREN"; index: number }
  | { type: "RESET" };

const ANFANGSZUSTAND: DemoState = { screen: "attract", ausgewaehlterLieferantId: null, auditKette: [] };

function reducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "GEHE_ZU":
      return { ...state, screen: action.screen };
    case "WAEHLE_LIEFERANT_UND_GEHE_ZU":
      return { ...state, screen: action.screen, ausgewaehlterLieferantId: action.lieferantId };
    case "AUDIT_HINZUFUEGEN_UND_GEHE_ZU":
      return { ...state, screen: action.screen, auditKette: [...state.auditKette, action.eintrag] };
    case "AUDIT_MANIPULIEREN":
      return {
        ...state,
        auditKette: state.auditKette.map((eintrag, i) =>
          i === action.index
            ? { ...eintrag, daten: { ...eintrag.daten, manipuliert: "von der Messe-Demo absichtlich verändert" } }
            : eintrag
        ),
      };
    case "RESET":
      return ANFANGSZUSTAND;
    default:
      return state;
  }
}

interface DemoContextValue {
  state: DemoState;
  geheZu: (screen: Screen) => void;
  waehleLieferantUndGeheZu: (lieferantId: string, screen: Screen) => void;
  protokolliereUndGeheZu: (ereignis: string, akteur: Akteur, daten: Record<string, unknown>, screen: Screen) => Promise<void>;
  manipuliereAuditEintrag: (index: number) => void;
  reset: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, ANFANGSZUSTAND);

  const protokolliereUndGeheZu = useCallback(
    async (ereignis: string, akteur: Akteur, daten: Record<string, unknown>, screen: Screen) => {
      const eintrag = await erzeugeNaechstenEintrag(state.auditKette, ereignis, akteur, daten);
      dispatch({ type: "AUDIT_HINZUFUEGEN_UND_GEHE_ZU", eintrag, screen });
    },
    [state.auditKette]
  );

  const value = useMemo<DemoContextValue>(
    () => ({
      state,
      geheZu: (screen) => dispatch({ type: "GEHE_ZU", screen }),
      waehleLieferantUndGeheZu: (lieferantId, screen) =>
        dispatch({ type: "WAEHLE_LIEFERANT_UND_GEHE_ZU", lieferantId, screen }),
      protokolliereUndGeheZu,
      manipuliereAuditEintrag: (index) => dispatch({ type: "AUDIT_MANIPULIEREN", index }),
      reset: () => dispatch({ type: "RESET" }),
    }),
    [state, protokolliereUndGeheZu]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) {
    throw new Error("useDemo muss innerhalb von <DemoProvider> verwendet werden");
  }
  return ctx;
}
