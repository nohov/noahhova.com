import test from "node:test";
import assert from "node:assert/strict";
import { chromium, webkit } from "playwright";
import { createServer } from "vite";

const variants = ["original", "cloud", "queens", "topographic"];

test("all background previews load and preserve the hero at phone and desktop sizes", async () => {
  const server = await createServer({ server: { host: "127.0.0.1", port: 0 } });
  await server.listen();
  const { port } = server.httpServer.address();
  const base = `http://127.0.0.1:${port}/`;

  try {
    for (const { engine, viewport, mobile } of [
      { engine: chromium, viewport: { width: 1440, height: 900 }, mobile: false },
      { engine: webkit, viewport: { width: 390, height: 844 }, mobile: true },
    ]) {
      const browser = await engine.launch();
      try {
        const context = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile });
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", error => errors.push(error.message));

        for (const variant of variants) {
          await page.goto(`${base}?background=${variant}`);
          await page.locator(".hero-landscape").waitFor();
          const state = await page.evaluate(() => {
            const hero = document.querySelector(".hero");
            const image = getComputedStyle(document.querySelector(".hero-landscape")).backgroundImage;
            const frame = document.querySelector(".hero-frame").getBoundingClientRect();
            const bottom = document.querySelector(".frame-bottom").getBoundingClientRect();
            return {
              variant: hero.dataset.background, image,
              frameRight: frame.right, bottomRight: bottom.right,
              overflowX: document.documentElement.scrollWidth > innerWidth,
              overflowY: document.documentElement.scrollHeight > innerHeight + 2,
            };
          });
          const label = `${engine.name()} ${viewport.width}px ${variant}`;
          assert.equal(state.variant, variant, `${label}: wrong variant selected`);
          assert.ok(state.image.includes(variant === "original" ? "renaissance-landscape" : `${variant}-${mobile ? "mobile" : "desktop"}`), `${label}: wrong painting asset`);
          assert.ok(state.frameRight <= viewport.width && state.bottomRight <= viewport.width && !state.overflowX && !state.overflowY, `${label}: artwork/layout overflows`);

          const assetUrl = state.image.match(/url\(["']?([^"')]+)["']?\)/)?.[1];
          assert.ok(assetUrl, `${label}: missing image URL`);
          const response = await page.request.get(assetUrl);
          assert.equal(response.status(), 200, `${label}: image request failed`);
          assert.ok((await response.body()).length > 100_000, `${label}: image is unexpectedly empty`);

          if (mobile) {
            await page.touchscreen.tap(70, 420);
            await page.waitForFunction(() => getComputedStyle(document.querySelector(".hero")).getPropertyValue("--painting-x").trim() !== "0px");
            const before = await page.locator(".hero").evaluate(element => parseFloat(getComputedStyle(element).getPropertyValue("--painting-x")));
            await page.touchscreen.tap(310, 420);
            await page.waitForFunction(previous => parseFloat(getComputedStyle(document.querySelector(".hero")).getPropertyValue("--painting-x")) !== previous, before);
            const after = await page.locator(".hero").evaluate(element => parseFloat(getComputedStyle(element).getPropertyValue("--painting-x")));
            assert.ok(Math.abs(after - before) >= 8, `${label}: touch does not move painting`);
          } else {
            await page.mouse.move(120, 180);
            await page.waitForFunction(() => getComputedStyle(document.querySelector(".hero")).getPropertyValue("--painting-x").trim() !== "0px");
            const before = await page.locator(".hero").evaluate(element => parseFloat(getComputedStyle(element).getPropertyValue("--painting-x")));
            await page.mouse.move(1300, 700);
            await page.waitForFunction(previous => parseFloat(getComputedStyle(document.querySelector(".hero")).getPropertyValue("--painting-x")) !== previous, before);
            const after = await page.locator(".hero").evaluate(element => parseFloat(getComputedStyle(element).getPropertyValue("--painting-x")));
            assert.ok(Math.abs(after - before) >= 8, `${label}: pointer does not move painting`);
          }
        }

        assert.deepEqual(errors, [], `${engine.name()}: page errors`);
        await context.close();
      } finally {
        await browser.close();
      }
    }
  } finally {
    await server.close();
  }
});
