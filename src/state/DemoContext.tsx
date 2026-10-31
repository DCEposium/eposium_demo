import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";

// Nur In-Memory (RAM). Kein localStorage/sessionStorage, keine Persistenz, keine
// Netzwerkübertragung — siehe CLAUDE.md: "Besucherdaten: nur im Browserspeicher,
// nicht persistieren, nicht senden. Reset löscht alles."

export type Screen = "attract" | "bedarf" | "angebote" | "vergleich";

interface DemoState {
  screen: Screen;
}

type DemoAction = { type: "GEHE_ZU"; screen: Screen } | { type: "RESET" };

const ANFANGSZUSTAND: DemoState = { screen: "attract" };

function reducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "GEHE_ZU":
      return { ...state, screen: action.screen };
    case "RESET":
      return ANFANGSZUSTAND;
    default:
      return state;
  }
}

interface DemoContextValue {
  state: DemoState;
  geheZu: (screen: Screen) => void;
  reset: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, ANFANGSZUSTAND);

  const value = useMemo<DemoContextValue>(
    () => ({
      state,
      geheZu: (screen) => dispatch({ type: "GEHE_ZU", screen }),
      reset: () => dispatch({ type: "RESET" }),
    }),
    [state]
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
