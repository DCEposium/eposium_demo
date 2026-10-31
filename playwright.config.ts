import { defineConfig, devices } from "@playwright/test";

// Läuft gegen den echten Produktionsbuild (dist/), nicht gegen den Dev-Server
// mit Hot-Reload-Overlay — das entspricht dem Zustand am Messestand.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:4173",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run build && npm run preview -- --port 4173 --strictPort",
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1920, height: 1080 } } },
    { name: "ipad-safari", use: { ...devices["iPad (gen 7) landscape"], viewport: { width: 1180, height: 820 } } },
  ],
});
