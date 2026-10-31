#!/usr/bin/env node
// Startet die Demo für den Messestand: statischer Server auf dist/, danach
// Versuch, Chrome im Kiosk-Vollbild zu öffnen (macOS). Kein Dev-Overlay, da
// ausschließlich der Produktionsbuild (dist/) ausgeliefert wird.
//
// npm run demo führt vorher "vite build" aus (siehe package.json).
// DEMO_KEIN_BROWSER=1 node scripts/demo.mjs startet nur den Server, ohne
// einen Browser zu öffnen (für Tests dieses Skripts selbst).

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "../dist");
const PORT = Number(process.env.PORT ?? 4173);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
};

async function sendeDatei(res, dateipfad) {
  const inhalt = await readFile(dateipfad);
  res.writeHead(200, { "Content-Type": MIME[path.extname(dateipfad)] ?? "application/octet-stream" });
  res.end(inhalt);
}

const server = createServer(async (req, res) => {
  const angefragterPfad = decodeURIComponent((req.url ?? "/").split("?")[0]);
  const zielpfad = path.join(DIST, angefragterPfad === "/" ? "index.html" : angefragterPfad);
  // Innerhalb von dist/ bleiben (kein Pfad-Escape über ..).
  if (!zielpfad.startsWith(DIST)) {
    res.writeHead(400);
    res.end("Ungültiger Pfad");
    return;
  }
  try {
    await sendeDatei(res, zielpfad);
  } catch {
    // SPA-Fallback für unbekannte Pfade (hier nicht zwingend nötig, da die
    // App keine eigenen URL-Routen nutzt, aber als Absicherung vorhanden).
    try {
      await sendeDatei(res, path.join(DIST, "index.html"));
    } catch {
      res.writeHead(404);
      res.end("Nicht gefunden. Wurde \"npm run build\" ausgeführt?");
    }
  }
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Epos läuft lokal unter ${url}`);
  console.log("Beenden mit Strg+C.");

  if (process.env.DEMO_KEIN_BROWSER) {
    return;
  }
  oeffneImVollbild(url);
});

function oeffneImVollbild(url) {
  if (process.platform !== "darwin") {
    console.log("Automatisches Vollbild ist nur für macOS eingerichtet.");
    console.log(`Bitte manuell öffnen und in den Vollbildmodus wechseln: ${url}`);
    return;
  }
  const chromePfad = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const chrome = spawn(chromePfad, ["--kiosk", "--incognito", url], { stdio: "ignore", detached: true });
  chrome.on("error", () => {
    console.log("Google Chrome wurde nicht unter dem Standardpfad gefunden.");
    console.log(`Bitte manuell öffnen und mit Cmd+Ctrl+F in den Vollbildmodus wechseln: ${url}`);
    spawn("open", [url], { stdio: "ignore", detached: true });
  });
  chrome.unref();
}
