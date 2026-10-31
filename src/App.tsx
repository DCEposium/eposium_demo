import { DemoProvider, useDemo } from "./state/DemoContext";
import { Attract } from "./screens/Attract";
import { Platzhalter } from "./screens/Platzhalter";

function Bildschirm() {
  const { state } = useDemo();
  switch (state.screen) {
    case "attract":
      return <Attract />;
    case "platzhalter":
      return <Platzhalter />;
  }
}

export default function App() {
  return (
    <DemoProvider>
      <Bildschirm />
    </DemoProvider>
  );
}
