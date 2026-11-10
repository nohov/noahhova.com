import test from "node:test";
import assert from "node:assert/strict";
import { chromium, firefox, webkit } from "playwright";
import { createServer } from "vite";

const viewports = [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 440, height: 956 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

test("single page fits iPhone frames and keeps the painting interactive", async () => {
  const server = await createServer({ server: { host: "127.0.0.1", port: 0 } });
  await server.listen();
  let browser;
  try {
    const { port } = server.httpServer.address();
    for (const browserType of [chromium, firefox, webkit]) {
      browser = await browserType.launch();
      const page = await browser.newPage();
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(`http://127.0.0.1:${port}/`);

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
        const result = await page.evaluate(() => {
          const rect = selector => {
            const { x, y, width, height } = document.querySelector(selector).getBoundingClientRect();
            return { x, y, width, height };
          };
          return {
            hero: rect(".hero"), frame: rect(".hero-frame"), heading: rect(".hero h1"),
            frameBottom: rect(".frame-bottom"), prompt: rect(".scroll-prompt"),
            brand: rect(".brand"), actions: rect(".header-actions"),
            landscape: getComputedStyle(document.querySelector(".hero-landscape")).backgroundImage,
            scrollWidth: document.documentElement.scrollWidth,
            figures: document.querySelectorAll(".hero-statue, .hero-allegory, .hero figure, .hero img").length,
            manifest: document.querySelector('link[rel="manifest"]')?.href,
          };
        });
        const name = `${browserType.name()} ${viewport.width}×${viewport.height}`;
        assert.ok(result.hero.height >= viewport.height - 1, `${name}: hero does not fill frame`);
        assert.ok(result.frame.x >= 0 && result.frame.x + result.frame.width <= viewport.width, `${name}: frame clips`);
        assert.ok(result.heading.y >= result.frame.y && result.heading.y + result.heading.height <= result.frame.y + result.frame.height, `${name}: title clips`);
        assert.ok(result.frameBottom.y + result.frameBottom.height <= result.frame.y + result.frame.height, `${name}: index clips`);
        assert.ok(result.actions.x > result.brand.x + result.brand.width, `${name}: header overlaps`);
        assert.ok(result.actions.x + result.actions.width <= viewport.width, `${name}: header clips`);
        assert.ok(result.scrollWidth <= viewport.width, `${name}: horizontal overflow`);
        assert.ok(result.landscape.includes("renaissance-landscape"), `${name}: painting missing`);
        if (viewport.width <= 600) {
          assert.ok(result.landscape.includes("renaissance-landscape-mobile"), `${name}: portrait painting missing`);
          assert.ok(result.prompt.y >= 0 && result.prompt.y + result.prompt.height <= viewport.height, `${name}: scroll cue clips`);
        }
        assert.equal(result.figures, 0, `${name}: unwanted figure remains`);
        assert.equal(result.manifest, undefined, `${name}: install manifest remains`);
      }

      await page.setViewportSize({ width: 390, height: 844 });
      const targets = await page.evaluate(() => [...document.querySelectorAll(".brand, .contact-pill, .menu-trigger, .hero-index a, .scroll-prompt, .chapter-next, .copy-email, .email-link, .social-links a, .back-to-top")].map(element => ({
        name: element.className || element.textContent.trim(),
        width: element.getBoundingClientRect().width,
        height: element.getBoundingClientRect().height,
      })));
      for (const target of targets) assert.ok(target.width >= 43 && target.height >= 43, `${browserType.name()}: ${target.name} is smaller than 44px (${target.width}×${target.height})`);

      await page.setViewportSize({ width: 1440, height: 900 });
      await page.mouse.move(100, 200);
      const beforePointer = await page.locator(".hero-landscape").evaluate(element => getComputedStyle(element).transform);
      await page.mouse.move(1350, 700);
      await page.waitForFunction(before => getComputedStyle(document.querySelector(".hero-landscape")).transform !== before, beforePointer);
      const afterPointer = await page.locator(".hero-landscape").evaluate(element => getComputedStyle(element).transform);
      const pointerTravel = await page.evaluate(([a, b]) => Math.hypot(new DOMMatrixReadOnly(a).m41 - new DOMMatrixReadOnly(b).m41, new DOMMatrixReadOnly(a).m42 - new DOMMatrixReadOnly(b).m42), [beforePointer, afterPointer]);
      assert.ok(pointerTravel >= 8, `${browserType.name()}: painting pointer motion is too subtle (${pointerTravel}px)`);
      await page.evaluate(() => scrollTo({ top: document.querySelector(".hero-sequence").offsetHeight - innerHeight, behavior: "instant" }));
      await page.waitForFunction(() => Number(document.querySelector(".hero").dataset.progress) >= .99);
      const transition = await page.evaluate(() => ({
        transform: getComputedStyle(document.querySelector(".hero-landscape")).transform,
        exit: Number(getComputedStyle(document.querySelector(".hero-exit")).opacity),
        prompt: Number(getComputedStyle(document.querySelector(".scroll-prompt")).opacity),
        headerTone: document.body.dataset.headerTone,
        frameInert: document.querySelector(".hero-frame").inert,
        promptInert: document.querySelector(".scroll-prompt").inert,
      }));
      const scrollMotion = await page.evaluate(([before, after]) => {
        const a = new DOMMatrixReadOnly(before);
        const b = new DOMMatrixReadOnly(after);
        return { distance: Math.hypot(a.m41 - b.m41, a.m42 - b.m42), scale: b.m11 };
      }, [afterPointer, transition.transform]);
      assert.ok(scrollMotion.distance >= 30 && scrollMotion.scale >= 1.05, `${browserType.name()}: painting scroll motion is too subtle`);
      assert.ok(transition.exit >= .95 && transition.prompt <= .05 && transition.headerTone === "dark", `${browserType.name()}: About transition is illegible`);
      assert.ok(transition.frameInert && transition.promptInert, `${browserType.name()}: faded hero links remain keyboard reachable`);

      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForFunction(() => !document.querySelector(".hero-frame").inert && !document.querySelector(".scroll-prompt").inert);
      await page.getByRole("button", { name: "Open menu" }).click();
      assert.equal(await page.locator("dialog").evaluate(dialog => dialog.open), true);
      await page.keyboard.press("Escape");
      await page.waitForFunction(() => !document.querySelector("dialog").open);
      assert.equal(await page.locator("dialog").evaluate(dialog => dialog.open), false);
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.getByRole("navigation", { name: "Menu navigation" }).getByRole("link", { name: /Now/ }).click();
      await page.waitForURL(/#now$/);
      await page.waitForFunction(() => document.body.dataset.activeSection === "now");
      assert.equal(await page.locator("dialog").evaluate(dialog => dialog.open), false);
      await page.locator("#contact").scrollIntoViewIfNeeded();
      await page.getByRole("button", { name: "Copy email" }).click();
      await page.getByRole("button", { name: "Copied to clipboard" }).waitFor();
      assert.deepEqual(errors, [], `${browserType.name()}: browser errors`);

      const reducedPage = await browser.newPage({ reducedMotion: "reduce" });
      await reducedPage.goto(`http://127.0.0.1:${port}/`);
      await reducedPage.locator(".hero-landscape").waitFor();
      assert.deepEqual(await reducedPage.evaluate(() => ({
        scroll: getComputedStyle(document.documentElement).scrollBehavior,
        painting: getComputedStyle(document.querySelector(".hero-landscape")).transform,
      })), { scroll: "auto", painting: "none" }, `${browserType.name()}: reduced motion is ignored`);
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
