import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: process.env.PLAYWRIGHT_USE_EXISTING_BUILD
      ? "python3 -m http.server 4173 --bind 127.0.0.1 --directory apps/web/out"
      : "npm run build -w packages/domain && npm run build -w apps/web && python3 -m http.server 4173 --bind 127.0.0.1 --directory apps/web/out",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
