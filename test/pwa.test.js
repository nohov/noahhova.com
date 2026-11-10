import test from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { preview } from "vite";

test("mobile site installs as one offline-capable page", async () => {
  const server = await preview({ preview: { host: "127.0.0.1", port: 0 } });
  const browser = await chromium.launch();
  try {
    const { port } = server.httpServer.address();
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: "allow" });
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:${port}/`);
    const manifestUrl = await page.locator('link[rel="manifest"]').getAttribute("href");
    assert.ok(manifestUrl, "install manifest is missing");
    const manifestResponse = await page.request.get(new URL(manifestUrl, page.url()).href);
    assert.equal(manifestResponse.status(), 200);
    const manifest = await manifestResponse.json();
    assert.equal(manifest.display, "standalone");
    assert.equal(manifest.start_url, "/");
    assert.ok(manifest.icons.some((icon) => icon.sizes === "192x192"));
    assert.ok(manifest.icons.some((icon) => icon.sizes === "512x512"));
    for (const icon of manifest.icons) assert.equal((await page.request.get(new URL(icon.src, page.url()).href)).status(), 200);
    await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
    await page.reload();
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
    await context.setOffline(true);
    await page.reload();
    assert.equal(await page.getByRole("heading", { level: 1 }).innerText(), "Ideas\nin motion.");
    assert.ok((await page.locator(".hero-landscape").evaluate((element) => getComputedStyle(element).backgroundImage)).includes("renaissance-landscape-mobile"));
    await context.close();
  } finally {
    await browser.close();
    await new Promise((resolve) => server.httpServer.close(resolve));
  }
});
