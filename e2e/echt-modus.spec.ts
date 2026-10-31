import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test("Echt-Modus: eigene Datei laden, zuordnen, auswerten — ohne externe Anfrage", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Oder gleich Ihre eigene Datei testen" }).click();
  await expect(page.getByText("Ihre Daten bleiben im Browser")).toBeVisible();

  const externeAnfragen: string[] = [];
  page.on("request", (req) => {
    const url = new URL(req.url());
    if (url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
      externeAnfragen.push(req.url());
    }
  });

  const fixture = path.resolve(__dirname, "fixtures/eigenes_angebot.csv");
  await page.locator('input[type="file"]').setInputFiles(fixture);

  await expect(page.getByText("Prüfen Sie die vorgeschlagene Zuordnung")).toBeVisible();
  await page.getByRole("button", { name: "Übernehmen" }).click();

  await expect(page.locator(".echtmodus-tabelle tbody tr")).toHaveCount(3);
  await expect(page.locator("tr.ist-unsicher")).toHaveCount(1);
  await expect(page.getByText("Menge nicht als Zahl erkannt")).toBeVisible();

  expect(externeAnfragen, `Externe Anfragen im Echt-Modus: ${externeAnfragen.join(", ")}`).toHaveLength(0);
});
