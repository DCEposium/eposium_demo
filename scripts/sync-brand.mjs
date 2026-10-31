#!/usr/bin/env node
// Kopiert die verbindlichen Markendateien nach public/brand/, damit index.html
// brand/tokens.css direkt per <link> einbinden kann (relative Font-Pfade bleiben
// dadurch unverändert korrekt). Einzige Quelle der Wahrheit bleibt brand/.
// Läuft automatisch vor "dev" und "build" (siehe package.json).

import { cp, rm, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "brand");
const DEST = path.join(ROOT, "public", "brand");

const ITEMS = ["tokens.css", "fonts", "logo"];

async function main() {
  await rm(DEST, { recursive: true, force: true });
  await mkdir(DEST, { recursive: true });
  for (const item of ITEMS) {
    await cp(path.join(SRC, item), path.join(DEST, item), { recursive: true });
  }
  console.log(`Marke synchronisiert: ${ITEMS.join(", ")} -> public/brand/`);
}

main().catch((err) => {
  console.error("FEHLER beim Synchronisieren der Marke:", err.message);
  process.exitCode = 1;
});
