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

test("Queens home fits desktop and iPhone frames", async () => {
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
      await page.locator(".hero-frame").waitFor();
      assert.equal(await page.title(), "Noah Hova", `${browserType.name()}: old page title remains`);
      assert.equal(await page.locator("#hero-title").innerText(), "Noah\nHova", `${browserType.name()}: wrong hero title`);
      assert.equal(await page.getByText(/Ideas in motion|An internet native from Queens/i).count(), 0, `${browserType.name()}: old hero copy remains`);

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        const result = await page.evaluate(() => {
          const rect = selector => {
            const { x, y, width, height } = document.querySelector(selector).getBoundingClientRect();
            return { x, y, width, height };
          };
          return {
            hero: rect(".hero"), frame: rect(".hero-frame"), heading: rect(".hero h1"),
            bottom: rect(".frame-bottom"), brand: rect(".brand"), projectsLink: rect(".projects-nav"), contact: rect(".contact-pill"),
            painting: getComputedStyle(document.querySelector(".hero-landscape")).backgroundImage,
            sectionCount: document.querySelectorAll("main section").length,
            hashes: [...document.querySelectorAll('a[href^="#"]')].map(a => a.hash),
            scrollWidth: document.documentElement.scrollWidth,
            scrollHeight: document.documentElement.scrollHeight,
            links: [...document.querySelectorAll(".site-nav a, .hero-links a")].filter(a => getComputedStyle(a).display !== "none").map(a => ({ href: a.getAttribute("href"), width: a.getBoundingClientRect().width, height: a.getBoundingClientRect().height })),
          };
        });
        const name = `${browserType.name()} ${viewport.width}×${viewport.height}`;
        assert.equal(result.sectionCount, 1, `${name}: more than the hero is present`);
        assert.deepEqual(result.hashes, ["#top", "#projects"], `${name}: unexpected navigation targets`);
        assert.ok(result.hero.height >= viewport.height - 1, `${name}: hero does not fill viewport`);
        assert.ok(result.scrollHeight <= viewport.height + 2, `${name}: hero creates unwanted scrolling`);
        assert.ok(result.scrollWidth <= viewport.width, `${name}: horizontal overflow`);
        assert.ok(result.frame.x >= 0 && result.frame.x + result.frame.width <= viewport.width, `${name}: frame clips`);
        assert.ok(result.heading.y >= result.frame.y && result.heading.y + result.heading.height <= result.frame.y + result.frame.height, `${name}: heading clips`);
        assert.ok(result.bottom.y >= result.heading.y + result.heading.height, `${name}: hero copy overlaps title`);
        assert.ok(result.bottom.y + result.bottom.height <= result.frame.y + result.frame.height, `${name}: hero links clip`);
        assert.ok(result.projectsLink.x >= result.brand.x + result.brand.width, `${name}: header overlaps`);
        if (viewport.width > 600) assert.ok(result.contact.x >= result.projectsLink.x + result.projectsLink.width, `${name}: header contact overlaps`);
        assert.ok(result.painting.includes(`queens-${viewport.width <= 600 ? "mobile" : "desktop"}`), `${name}: wrong painting`);
        assert.equal(await page.locator(".hero").getAttribute("data-background"), "queens", `${name}: Queens is not default`);
        for (const link of result.links) {
          assert.ok(link.href, `${name}: link has no destination`);
          assert.ok(link.width >= 43 && link.height >= 43, `${name}: link is smaller than 44px`);
        }
      }

      await page.setViewportSize({ width: 1440, height: 900 });
      await page.mouse.move(120, 180);
      await page.waitForFunction(() => getComputedStyle(document.querySelector(".hero")).getPropertyValue("--painting-x").trim() !== "0px");
      const before = await page.locator(".hero").evaluate(element => getComputedStyle(element).getPropertyValue("--painting-x"));
      await page.mouse.move(1300, 700);
      await page.waitForFunction(previous => getComputedStyle(document.querySelector(".hero")).getPropertyValue("--painting-x") !== previous, before);
      const after = await page.locator(".hero").evaluate(element => getComputedStyle(element).getPropertyValue("--painting-x"));
      assert.ok(Math.abs(parseFloat(after) - parseFloat(before)) >= 8, `${browserType.name()}: painting pointer motion is too small`);
      assert.deepEqual(errors, [], `${browserType.name()}: page errors`);

      const reducedPage = await browser.newPage({ reducedMotion: "reduce" });
      await reducedPage.goto(`http://127.0.0.1:${port}/`);
      await reducedPage.locator(".hero-landscape").waitFor();
      assert.deepEqual(await reducedPage.locator(".hero-landscape").evaluate(element => ({
        animation: getComputedStyle(element).animationName,
        transform: getComputedStyle(element).transform,
      })), { animation: "none", transform: "none" }, `${browserType.name()}: reduced motion is ignored`);
      await reducedPage.close();
      await page.close();
      await browser.close();
      browser = undefined;
    }

    browser = await webkit.launch();
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const phone = await context.newPage();
    await phone.goto(`http://127.0.0.1:${port}/`);
    await phone.locator(".hero").waitFor();
    await phone.touchscreen.tap(70, 420);
    await phone.waitForFunction(() => getComputedStyle(document.querySelector(".hero")).getPropertyValue("--painting-x").trim() !== "0px");
    const touchBefore = await phone.locator(".hero").evaluate(element => getComputedStyle(element).getPropertyValue("--painting-x"));
    await phone.touchscreen.tap(310, 420);
    await phone.waitForFunction(previous => getComputedStyle(document.querySelector(".hero")).getPropertyValue("--painting-x") !== previous, touchBefore);
    const touchAfter = await phone.locator(".hero").evaluate(element => getComputedStyle(element).getPropertyValue("--painting-x"));
    assert.ok(Math.abs(parseFloat(touchAfter) - parseFloat(touchBefore)) >= 8, "iPhone touch does not move the painting");
    await context.close();
    await browser.close();
    browser = undefined;
  } finally {
    await browser?.close();
    await server.close();
  }
});

test("Projects opens directly and navigation works across sizes and browsers", async () => {
  const server = await createServer({ server: { host: "127.0.0.1", port: 0 } });
  await server.listen();
  const { port } = server.httpServer.address();
  try {
    for (const browserType of [chromium, firefox, webkit]) {
      const browser = await browserType.launch();
      try {
        const page = await browser.newPage();
        const errors = [];
        page.on("pageerror", error => errors.push(error.message));
        for (const viewport of viewports) {
          await page.setViewportSize(viewport);
          await page.goto(`http://127.0.0.1:${port}/#projects`);
          await page.locator("#projects-title").waitFor();
          const result = await page.evaluate(() => ({
            heading: document.querySelector("h1")?.textContent,
            sectionCount: document.querySelectorAll("main section").length,
            selected: document.querySelector(".projects-nav").getAttribute("aria-current"),
            overflowX: document.documentElement.scrollWidth > innerWidth,
            cards: [...document.querySelectorAll(".project-card")].map(card => ({
              right: card.getBoundingClientRect().right,
              link: card.querySelector("a")?.href,
              linkHeight: card.querySelector("a")?.getBoundingClientRect().height,
            })),
          }));
          const name = `${browserType.name()} ${viewport.width}×${viewport.height}`;
          assert.match(result.heading, /Projects in progress/, `${name}: no Projects heading`);
          assert.equal(result.sectionCount, 1, `${name}: wrong number of views`);
          assert.equal(result.selected, "page", `${name}: Projects not marked current`);
          assert.equal(result.overflowX, false, `${name}: horizontal overflow`);
          assert.equal(result.cards.length, 2, `${name}: missing project`);
          assert.deepEqual(result.cards.map(card => card.link), ["https://github.com/nohov/Sightcuit", "https://github.com/nohov/deep-ml"], `${name}: unexpected project destination`);
          for (const card of result.cards) {
            assert.ok(card.right <= viewport.width + 1, `${name}: project card clips`);
            assert.ok(card.link?.startsWith("https://") && card.linkHeight >= 43, `${name}: project link invalid or too small`);
          }
        }
        await page.getByRole("link", { name: "Noah Hova, home" }).click();
        await page.locator(".hero").waitFor();
        assert.equal(new URL(page.url()).hash, "#top", `${browserType.name()}: Home link failed`);
        await page.getByRole("link", { name: /Projects/ }).click();
        await page.locator("#projects-title").waitFor();
        await page.goBack();
        await page.locator(".hero").waitFor();
        assert.equal(new URL(page.url()).hash, "#top", `${browserType.name()}: Back did not restore Home`);
        await page.getByRole("link", { name: /Projects/ }).click();
        await page.getByRole("link", { name: /Back to home/ }).click();
        await page.locator(".hero").waitFor();
        assert.equal(new URL(page.url()).hash, "#top", `${browserType.name()}: footer Home link failed`);
        assert.deepEqual(errors, [], `${browserType.name()}: page errors`);
        await page.close();
      } finally {
        await browser.close();
      }
    }
  } finally {
    await server.close();
  }
});
