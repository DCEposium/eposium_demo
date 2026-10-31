import { test, expect } from "@playwright/test";

test("Tastenkürzel Umschalt+Escape setzt zurück", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Demo starten" }).click();
  await expect(page.getByText("Was wird gebraucht?")).toBeVisible();

  await page.keyboard.press("Shift+Escape");
  await expect(page.getByText("Was kostet Ihren Einkauf die meisten Nerven?")).toBeVisible();
});

test("läuft nach dem ersten Laden vollständig offline weiter (WLAN aus)", async ({ page, context }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Demo starten" }).click();
  await expect(page.getByText("Was wird gebraucht?")).toBeVisible();

  await context.setOffline(true);

  await page.getByRole("button", { name: "Angebote einlesen" }).click();
  await expect(page.getByText("Drei Angebote, drei Formate")).toBeVisible();
  await page.getByRole("button", { name: "Zum Vergleich" }).click();
  await expect(page.locator(".vergleich-karte-summe").first()).toBeVisible();

  await context.setOffline(false);
});

test("Inaktivität: Vorwarnung erscheint, danach automatischer Rücksprung", async ({ page }) => {
  await page.goto("/?inaktivitaetMs=3000&vorwarnungMs=2000");
  await page.getByRole("button", { name: "Demo starten" }).click();
  await expect(page.getByText("Was wird gebraucht?")).toBeVisible();

  await expect(page.getByText(/startet die Demo neu/)).toBeVisible({ timeout: 2500 });
  await expect(page.getByText("Was kostet Ihren Einkauf die meisten Nerven?")).toBeVisible({ timeout: 3000 });
});

test("Inaktivität: laufende Interaktion verhindert den Rücksprung", async ({ page }) => {
  await page.goto("/?inaktivitaetMs=3000&vorwarnungMs=2000");
  await page.getByRole("button", { name: "Demo starten" }).click();
  await expect(page.getByText("Was wird gebraucht?")).toBeVisible();

  for (let i = 0; i < 4; i++) {
    await page.waitForTimeout(1000);
    await page.mouse.move(100 + i * 5, 100);
    await page.mouse.down();
    await page.mouse.up();
  }

  await expect(page.getByText("Was wird gebraucht?")).toBeVisible();
});
