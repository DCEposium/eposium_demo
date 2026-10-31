import { test, expect, type Page } from "@playwright/test";

function sammleKonsolenfehler(page: Page): string[] {
  const fehler: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") fehler.push(msg.text());
  });
  page.on("pageerror", (err) => fehler.push(String(err)));
  return fehler;
}

test("kompletter Standarddurchlauf von Attract bis Abschluss", async ({ page }) => {
  const konsolenfehler = sammleKonsolenfehler(page);

  await page.goto("/");
  await expect(page.getByText("Prototyp, Beispieldaten")).toBeVisible();
  await page.getByRole("button", { name: "Demo starten" }).click();

  await expect(page.getByText("Was wird gebraucht?")).toBeVisible();
  await expect(page.getByText("40 Stück")).toBeVisible();
  await page.getByRole("button", { name: "Angebote einlesen" }).click();

  await expect(page.getByText("Drei Angebote, drei Formate")).toBeVisible();
  await page.getByRole("button", { name: "Zum Vergleich" }).click();

  // Die drei von Hand nachgerechneten Gesamtkosten aus dem Plan.
  await expect(page.locator(".vergleich-karte-summe")).toHaveText(["1.647,50 €", "1.743,70 €", "1.468,00 €"]);
  await page.getByRole("button", { name: /Preis-Check/ }).click();

  await expect(page.getByText("Ist der Preis wirklich fair?")).toBeVisible();
  const verhandlungsKnoepfe = page.getByRole("button", { name: "Verhandlung vorbereiten" });
  await expect(verhandlungsKnoepfe).toHaveCount(3);
  await verhandlungsKnoepfe.nth(2).click(); // Nordsee, das günstigste Angebot

  await expect(page.getByText("Verhandlung mit Nordsee Components B.V.")).toBeVisible();
  await expect(page.locator(".briefing-email")).toContainText("BA-2026-0412");
  await page.getByRole("button", { name: "Weiter zur Freigabe" }).click();

  await expect(page.getByText("Wer gibt frei?")).toBeVisible();
  await page.getByRole("radio", { name: "Abteilungsleiter" }).check();
  await page.getByPlaceholder("Vor- und Nachname").fill("Dennis Czernicki");
  await page.getByRole("button", { name: "Freigeben" }).click();

  await expect(page.getByText("Lückenlos verkettet")).toBeVisible();
  await expect(page.locator(".audit-eintrag")).toHaveCount(2);

  await page.getByRole("button", { name: "Kette prüfen" }).click();
  await expect(page.getByText("Kette gültig")).toBeVisible();

  await page.getByRole("button", { name: "Manipulation an Eintrag #0 simulieren" }).click();
  await page.getByRole("button", { name: "Kette prüfen" }).click();
  await expect(page.getByText("Kette verletzt ab Eintrag #0")).toBeVisible();

  await page.getByRole("button", { name: "Zum Abschluss" }).click();
  await expect(page.getByText("Das war Epos in wenigen Minuten.")).toBeVisible();
  await expect(page.getByText("Freigabe erteilt von Dennis Czernicki")).toBeVisible();

  expect(konsolenfehler, `Konsolenfehler aufgetreten: ${konsolenfehler.join(" | ")}`).toHaveLength(0);
});

async function biszurFreigabeDurchklicken(page: Page) {
  await page.getByRole("button", { name: "Demo starten" }).click();
  await page.getByRole("button", { name: "Angebote einlesen" }).click();
  await page.getByRole("button", { name: "Zum Vergleich" }).click();
  await page.getByRole("button", { name: /Preis-Check/ }).click();
  await page.getByRole("button", { name: "Verhandlung vorbereiten" }).first().click();
  await page.getByRole("button", { name: "Weiter zur Freigabe" }).click();
}

test("Zurücksetzen löscht auch bereits protokollierte Audit-Einträge", async ({ page }) => {
  await page.goto("/");
  await biszurFreigabeDurchklicken(page);
  await expect(page.getByText("Wer gibt frei?")).toBeVisible();

  // An dieser Stelle existiert bereits ein Audit-Eintrag ("Verhandlungsbriefing
  // abgeschlossen"). Zurücksetzen muss ihn mitlöschen, nicht nur den Bildschirm wechseln.
  await page.getByRole("button", { name: "Demo zurücksetzen" }).click();
  await expect(page.getByText("Was kostet Ihren Einkauf die meisten Nerven?")).toBeVisible();

  await biszurFreigabeDurchklicken(page);
  await page.getByRole("radio", { name: "Einkäufer" }).check();
  await page.getByPlaceholder("Vor- und Nachname").fill("Zweite Sitzung");
  await page.getByRole("button", { name: "Freigeben" }).click();
  await page.getByRole("button", { name: "Zum Abschluss" }).click();

  // Nur die zwei Ereignisse dieser (zweiten) Sitzung, keine Reste der ersten.
  await expect(page.getByText("2 Ereignisse lückenlos im Audit-Protokoll verkettet.")).toBeVisible();
});
