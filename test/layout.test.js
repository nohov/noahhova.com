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

test("white Home and its Human / AI choices fit every target viewport", async () => {
  const server = await createServer({ server: { host: "127.0.0.1", port: 0 } });
  await server.listen();
  const base = `http://127.0.0.1:${server.httpServer.address().port}/`;
  try {
    for (const browserType of [chromium, firefox, webkit]) {
      const browser = await browserType.launch();
      try {
        const page = await browser.newPage();
        const errors = [];
        const images = [];
        page.on("pageerror", error => errors.push(error.message));
        page.on("request", request => { if (request.resourceType() === "image") images.push(request.url()); });
        await page.goto(base);
        await page.locator("#home-title").waitFor();
        assert.equal(await page.title(), "Noah Hova");
        assert.equal(await page.locator("h1").innerText(), "Noah Hova");
        assert.equal(await page.locator(".hero-landscape, .hero-frame").count(), 0, "old painting remains");

        for (const viewport of viewports) {
          await page.setViewportSize(viewport);
          const state = await page.evaluate(() => {
            const bounds = selector => {
              const { x, y, width, height, bottom } = document.querySelector(selector).getBoundingClientRect();
              return { x, y, width, height, bottom };
            };
            return {
              background: getComputedStyle(document.documentElement).backgroundColor,
              heading: bounds("#home-title"), who: bounds(".who-choice"),
              sections: document.querySelectorAll("main section").length,
              width: document.documentElement.scrollWidth,
              height: document.documentElement.scrollHeight,
              anchors: [...document.querySelectorAll(".site-header a, main a")].map(a => {
                const { width, height } = a.getBoundingClientRect();
                return { href: a.getAttribute("href"), width, height };
              }),
            };
          });
          const label = `${browserType.name()} ${viewport.width}×${viewport.height}`;
          assert.equal(state.background, "rgb(255, 255, 255)", `${label}: background is not white`);
          assert.equal(state.sections, 1, `${label}: wrong section count`);
          assert.ok(state.width <= viewport.width, `${label}: horizontal overflow`);
          assert.ok(state.height <= viewport.height + 2, `${label}: Home has unwanted scrolling`);
          assert.ok(state.heading.x >= 0 && state.heading.x + state.heading.width <= viewport.width, `${label}: heading clips`);
          assert.ok(state.who.y > state.heading.bottom && state.who.bottom <= viewport.height + 1, `${label}: chooser clips or overlaps`);
          assert.equal(state.anchors.length, 7, `${label}: missing link`);
          for (const anchor of state.anchors) {
            assert.ok(anchor.href && anchor.width >= 43 && anchor.height >= 43, `${label}: link missing destination or 44px target`);
          }
        }
        assert.deepEqual(images, [], `${browserType.name()}: painting or other image was requested`);
        assert.deepEqual(errors, [], `${browserType.name()}: Home page error`);
        await page.close();
      } finally {
        await browser.close();
      }
    }
  } finally {
    await server.close();
  }
});

test("Human and Projects views navigate without losing the white layout", async () => {
  const server = await createServer({ server: { host: "127.0.0.1", port: 0 } });
  await server.listen();
  const base = `http://127.0.0.1:${server.httpServer.address().port}/`;
  try {
    for (const browserType of [chromium, firefox, webkit]) {
      const browser = await browserType.launch();
      try {
        const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
        const errors = [];
        page.on("pageerror", error => errors.push(error.message));
        await page.goto(base);
        await page.locator(".choice-link[href='#human']").click();
        await page.locator("#human-title").waitFor();
        assert.equal(new URL(page.url()).hash, "#human");
        assert.equal(await page.getByRole("img", { name: "Portrait coming soon" }).count(), 1);
        await page.getByRole("link", { name: /Noah Hova/ }).click();
        await page.locator("#home-title").waitFor();
        await page.getByRole("link", { name: /View projects/ }).click();
        await page.locator("#projects-title").waitFor();
        assert.equal(new URL(page.url()).hash, "#projects");
        assert.equal(await page.locator(".project-row").count(), 2);
        assert.deepEqual(await page.locator(".project-row > a").evaluateAll(links => links.map(a => a.href)), ["https://github.com/nohov/Sightcuit", "https://github.com/nohov/deep-ml"]);
        await page.goBack();
        await page.locator("#home-title").waitFor();
        for (const viewport of [viewports[0], viewports[4], viewports[6]]) {
          await page.setViewportSize(viewport);
          for (const hash of ["#human", "#projects"]) {
            await page.goto(base + hash);
            await page.locator(hash).waitFor();
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${browserType.name()} ${viewport.width}px ${hash}: horizontal overflow`);
            assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor), "rgb(255, 255, 255)");
          }
        }
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

test("AI profile is readable without JavaScript and has a plain-text version", async () => {
  const server = await createServer({ server: { host: "127.0.0.1", port: 0 } });
  await server.listen();
  const base = `http://127.0.0.1:${server.httpServer.address().port}/`;
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 320, height: 568 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(base + "ai.html");
    assert.equal(await page.getByRole("heading", { name: "Noah Hova", level: 1 }).count(), 1);
    assert.equal(await page.getByRole("heading", { name: "Public projects" }).count(), 1);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, "AI page horizontal overflow");
    const smallLinks = await page.locator("a").evaluateAll(links => links.filter(link => {
      const { width, height } = link.getBoundingClientRect();
      return width < 43 || height < 43;
    }).map(link => link.textContent));
    assert.deepEqual(smallLinks, [], "AI page has phone links smaller than 44px");
    const schema = await page.locator('script[type="application/ld+json"]').textContent();
    assert.equal(JSON.parse(schema).mainEntity.name, "Noah Hova");
    const response = await page.request.get(base + "llms.txt");
    assert.equal(response.status(), 200);
    assert.match(await response.text(), /ScavScrap[\s\S]*Deep-ML/);
    assert.deepEqual(errors, [], "AI page errors");
  } finally {
    await browser.close();
    await server.close();
  }
});
