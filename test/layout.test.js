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
            frameBottom: rect(".frame-bottom"), prompt: rect(".scroll-prompt"), brand: rect(".brand"), actions: rect(".header-actions"),
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
        if (viewport.width <= 600) assert.ok(result.landscape.includes("renaissance-landscape-mobile"), `${name}: portrait painting missing`);
        assert.ok(result.painted, `${name}: statue canvas is empty`);
        assert.notEqual(result.statueTransform, "none", `${name}: visual response is inactive`);
        if (viewport.width <= 600) {
          assert.ok(result.statue.y >= result.heading.y + result.heading.height, `${name}: statue starts at ${result.statue.y}, heading ends at ${result.heading.y + result.heading.height}`);
          assert.ok(result.statue.y + result.statue.height < result.frameBottom.y, `${name}: statue covers the hero copy`);
          assert.ok(result.prompt.y >= 0 && result.prompt.y + result.prompt.height <= viewport.height, `${name}: scroll prompt is below the first screen`);
        }
      }

      await page.setViewportSize({ width: 1440, height: 900 });
      await page.locator(".hero-allegory").waitFor({ state: "visible" });
      await page.waitForFunction(() => document.querySelector(".hero-allegory").naturalWidth > 0);
      await page.mouse.move(100, 200);
      const allegoryBefore = await page.locator(".hero-allegory").evaluate((element) => getComputedStyle(element).transform);
      const statueBefore = await page.locator(".hero-statue").evaluate((element) => getComputedStyle(element).transform);
      await page.mouse.move(1350, 700);
      await page.waitForFunction((before) => getComputedStyle(document.querySelector(".hero-allegory")).transform !== before, allegoryBefore);
      const allegoryAfter = await page.locator(".hero-allegory").evaluate((element) => getComputedStyle(element).transform);
      const statueAfter = await page.locator(".hero-statue").evaluate((element) => getComputedStyle(element).transform);
      assert.notEqual(statueAfter, statueBefore, `${browserType.name()}: cobalt figure does not respond to pointer`);
      const pointerDirections = await page.evaluate(([a, b, c, d]) => ({
        left: new DOMMatrixReadOnly(b).m41 - new DOMMatrixReadOnly(a).m41,
        right: new DOMMatrixReadOnly(d).m41 - new DOMMatrixReadOnly(c).m41,
      }), [allegoryBefore, allegoryAfter, statueBefore, statueAfter]);
      assert.ok(pointerDirections.left > 8 && pointerDirections.right > 12, `${browserType.name()}: both figures need perceptible independent pointer motion (${JSON.stringify(pointerDirections)})`);
      await page.evaluate(() => scrollTo({ top: (document.querySelector(".hero-sequence").offsetHeight - innerHeight) * .55, behavior: "instant" }));
      await page.waitForFunction(() => Number(document.querySelector(".hero").dataset.progress) >= .5);
      const scrollDirections = await page.evaluate(() => ({
        left: new DOMMatrixReadOnly(getComputedStyle(document.querySelector(".hero-allegory")).transform).m41,
        right: new DOMMatrixReadOnly(getComputedStyle(document.querySelector(".hero-statue")).transform).m41,
      }));
      assert.ok(scrollDirections.left > pointerDirections.left + 50 && scrollDirections.right < pointerDirections.right - 35, `${browserType.name()}: figures do not converge independently on scroll (${JSON.stringify(scrollDirections)})`);
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForFunction(() => document.querySelector(".hero").dataset.progress === "0.000");
      await page.setViewportSize({ width: 390, height: 844 });
      await page.mouse.move(20, 200);
      const tapTargets = await page.evaluate(() => [...document.querySelectorAll(".brand, .contact-pill, .menu-trigger, .hero-index a, .scroll-prompt, .chapter-next, .copy-email, .email-link, .social-links a, .back-to-top")].map((element) => ({ name: element.className || element.textContent.trim(), height: element.getBoundingClientRect().height, width: element.getBoundingClientRect().width })));
      for (const target of tapTargets) assert.ok(target.height >= 43 && target.width >= 43, `${browserType.name()}: ${target.name} is smaller than a 44px tap target (${target.width}×${target.height})`);
      const beforeMove = await page.locator(".hero-statue").evaluate((element) => getComputedStyle(element).transform);
      const beforeLandscapeMove = await page.locator(".hero-landscape").evaluate((element) => getComputedStyle(element).transform);
      await page.mouse.move(350, 300);
      await page.waitForFunction((before) => getComputedStyle(document.querySelector(".hero-landscape")).transform !== before, beforeLandscapeMove);
      const afterMove = await page.locator(".hero-statue").evaluate((element) => getComputedStyle(element).transform);
      const afterLandscapeMove = await page.locator(".hero-landscape").evaluate((element) => getComputedStyle(element).transform);
      assert.notEqual(afterMove, beforeMove, `${browserType.name()}: pointer parallax does not respond`);
      assert.notEqual(afterLandscapeMove, beforeLandscapeMove, `${browserType.name()}: painting pointer parallax does not respond`);
      const pointerTravel = await page.evaluate(([before, after]) => {
        const a = new DOMMatrixReadOnly(before); const b = new DOMMatrixReadOnly(after);
        return Math.hypot(a.m41 - b.m41, a.m42 - b.m42);
      }, [beforeLandscapeMove, afterLandscapeMove]);
      assert.ok(pointerTravel >= 8, `${browserType.name()}: painting pointer motion is imperceptible (${pointerTravel}px)`);
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
      const afterLandscapeScroll = await page.locator(".hero-landscape").evaluate((element) => getComputedStyle(element).transform);
      assert.notEqual(afterLandscapeScroll, afterLandscapeMove, `${browserType.name()}: painting does not respond to scroll`);
      const scrollTravel = await page.evaluate(([before, after]) => {
        const a = new DOMMatrixReadOnly(before); const b = new DOMMatrixReadOnly(after);
        return { distance: Math.hypot(a.m41 - b.m41, a.m42 - b.m42), scale: b.m11 };
      }, [afterLandscapeMove, afterLandscapeScroll]);
      assert.ok(scrollTravel.distance >= 30 && scrollTravel.scale >= 1.05, `${browserType.name()}: painting scroll motion is too subtle (${JSON.stringify(scrollTravel)})`);
      const transition = await page.evaluate(() => ({
        exit: Number(getComputedStyle(document.querySelector(".hero-exit")).opacity),
        statue: Number(getComputedStyle(document.querySelector(".hero-statue")).opacity),
        prompt: Number(getComputedStyle(document.querySelector(".scroll-prompt")).opacity),
        headerTone: document.body.dataset.headerTone,
      }));
      assert.ok(transition.exit >= .95 && transition.statue <= .05 && transition.prompt <= .05 && transition.headerTone === "dark", `${browserType.name()}: hero does not fade into About with a legible header (${JSON.stringify(transition)})`);
      await page.locator("#contact").scrollIntoViewIfNeeded();
      await page.getByRole("button", { name: "Copy email" }).click();
      await page.getByRole("button", { name: "Copied to clipboard" }).waitFor();
      await page.evaluate(() => scrollTo({ top: document.getElementById("now").offsetTop - innerHeight * .5, behavior: "instant" }));
      await page.waitForFunction(() => document.body.dataset.activeSection === "now");
      assert.equal(await page.evaluate(() => document.body.dataset.headerTone), "dark", `${browserType.name()}: header changes before About leaves the header area`);
      await page.evaluate(() => scrollTo({ top: document.getElementById("now").offsetTop - 40, behavior: "instant" }));
      await page.waitForFunction(() => document.body.dataset.headerTone === "light");
      assert.deepEqual(errors, [], `${browserType.name()}: browser errors`);

      const reducedPage = await browser.newPage({ reducedMotion: "reduce" });
      await reducedPage.goto(`http://127.0.0.1:${port}/`);
      await reducedPage.locator(".hero-landscape").waitFor();
      const reduced = await reducedPage.evaluate(() => ({
        scroll: getComputedStyle(document.documentElement).scrollBehavior,
        landscape: getComputedStyle(document.querySelector(".hero-landscape")).transform,
        statue: getComputedStyle(document.querySelector(".hero-statue")).transform,
        allegory: getComputedStyle(document.querySelector(".hero-allegory")).transform,
      }));
      assert.deepEqual(reduced, { scroll: "auto", landscape: "none", statue: "none", allegory: "none" }, `${browserType.name()}: reduced motion is not honored`);
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
