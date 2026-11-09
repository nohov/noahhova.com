import test from "node:test";
import assert from "node:assert/strict";
import { chromium, firefox, webkit } from "playwright";
import { createServer } from "vite";

const viewports = [
  { width: 320, height: 640 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

test("editorial landing page meets layout and interaction targets", async () => {
  const server = await createServer({ server: { host: "127.0.0.1", port: 0 } });
  await server.listen();
  let browser;

  try {
    const { port } = server.httpServer.address();
    for (const browserType of [chromium, firefox, webkit]) {
      browser = await browserType.launch();
      const page = await browser.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(`http://127.0.0.1:${port}/`);
      await page.locator(".hero-statue canvas").waitFor({ state: "visible" });
      await page.waitForFunction(() => {
        const canvas = document.querySelector(".hero-statue canvas");
        if (!canvas?.width || !canvas?.height) return false;
        const pixels = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
        for (let i = 3; i < pixels.length; i += 4) if (pixels[i]) return true;
        return false;
      });

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
        const result = await page.evaluate(() => {
          const rect = (selector) => {
            const { x, y, width, height } = document.querySelector(selector).getBoundingClientRect();
            return { x, y, width, height };
          };
          const canvas = document.querySelector(".hero-statue canvas");
          const pixels = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
          let painted = false;
          for (let i = 3; i < pixels.length; i += 4) if (pixels[i]) { painted = true; break; }
          return {
            hero: rect(".hero"), frame: rect(".hero-frame"), heading: rect(".hero h1"), statue: rect(".hero-statue"),
            frameBottom: rect(".frame-bottom"), brand: rect(".brand"), actions: rect(".header-actions"),
            landscape: getComputedStyle(document.querySelector(".hero-landscape")).backgroundImage,
            statueTransform: getComputedStyle(document.querySelector(".hero-statue")).transform,
            painted, scrollWidth: document.documentElement.scrollWidth,
          };
        });
        const name = `${browserType.name()} ${viewport.width}x${viewport.height}`;
        assert.ok(result.hero.height >= viewport.height - 1, `${name}: hero ${result.hero.height}px does not fill viewport`);
        assert.ok(result.frame.x >= 0 && result.frame.x + result.frame.width <= viewport.width, `${name}: frame clips horizontally`);
        assert.ok(result.heading.y >= result.frame.y && result.heading.y + result.heading.height <= result.frame.y + result.frame.height, `${name}: heading clips frame`);
        assert.ok(result.frameBottom.y + result.frameBottom.height <= result.frame.y + result.frame.height, `${name}: index clips frame`);
        assert.ok(result.actions.x > result.brand.x + result.brand.width, `${name}: header overlaps`);
        assert.ok(result.actions.x + result.actions.width <= viewport.width, `${name}: header clips`);
        assert.ok(result.scrollWidth <= viewport.width, `${name}: horizontal overflow`);
        assert.ok(result.landscape.includes("renaissance-landscape"), `${name}: landscape missing`);
        assert.ok(result.painted, `${name}: statue canvas is empty`);
        assert.notEqual(result.statueTransform, "none", `${name}: visual response is inactive`);
        if (viewport.width <= 600) assert.ok(result.statue.y + result.statue.height < result.frameBottom.y, `${name}: statue covers the hero copy`);
      }

      await page.setViewportSize({ width: 390, height: 844 });
      const beforeMove = await page.locator(".hero-statue").evaluate((element) => getComputedStyle(element).transform);
      await page.mouse.move(350, 300);
      const afterMove = await page.locator(".hero-statue").evaluate((element) => getComputedStyle(element).transform);
      assert.notEqual(afterMove, beforeMove, `${browserType.name()}: pointer parallax does not respond`);
      await page.getByRole("button", { name: "Open menu" }).click();
      assert.equal(await page.locator("dialog").evaluate((dialog) => dialog.open), true);
      assert.equal(await page.getByRole("button", { name: "Open menu" }).getAttribute("aria-expanded"), "true");
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("dialog").evaluate((dialog) => dialog.open), false);
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.getByRole("navigation", { name: "Menu navigation" }).getByRole("link", { name: /Now/ }).click();
      await page.waitForURL(/#now$/);
      await page.waitForFunction(() => document.body.dataset.activeSection === "now");
      assert.equal(await page.locator("dialog").evaluate((dialog) => dialog.open), false);
      await page.locator(".back-to-top").click();
      await page.waitForFunction(() => document.body.dataset.activeSection === "top");
      await page.evaluate(() => scrollTo({ top: document.querySelector(".hero").offsetHeight * .6, behavior: "instant" }));
      await page.waitForFunction(() => Number(document.querySelector(".hero").dataset.progress) >= .55);
      await page.locator("#contact").scrollIntoViewIfNeeded();
      await page.getByRole("button", { name: "Copy email" }).click();
      await page.getByRole("button", { name: "Copied to clipboard" }).waitFor();
      assert.deepEqual(errors, [], `${browserType.name()}: browser errors`);

      const reducedPage = await browser.newPage({ reducedMotion: "reduce" });
      await reducedPage.goto(`http://127.0.0.1:${port}/`);
      await reducedPage.locator(".hero-landscape").waitFor();
      const reduced = await reducedPage.evaluate(() => ({
        scroll: getComputedStyle(document.documentElement).scrollBehavior,
        landscape: getComputedStyle(document.querySelector(".hero-landscape")).transform,
        statue: getComputedStyle(document.querySelector(".hero-statue")).transform,
      }));
      assert.deepEqual(reduced, { scroll: "auto", landscape: "none", statue: "none" }, `${browserType.name()}: reduced motion is not honored`);
      await reducedPage.close();
      await page.close();
      await browser.close();
      browser = undefined;
    }
  } finally {
    await browser?.close();
    await server.close();
  }
});
