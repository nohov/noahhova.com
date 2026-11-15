import test from "node:test";
import assert from "node:assert/strict";
import { chromium, firefox, webkit } from "playwright";
import { createServer } from "vite";

const sizes = [{ width: 320, height: 568 }, { width: 375, height: 667 }, { width: 390, height: 844 }, { width: 430, height: 932 }, { width: 440, height: 956 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }];

test("portrait-first Home and Projects stay simple and usable", async () => {
  const server = await createServer({ server: { host: "127.0.0.1", port: 0 } });
  await server.listen();
  const base = `http://127.0.0.1:${server.httpServer.address().port}/`;
  try {
    for (const type of [chromium, firefox, webkit]) {
      const browser = await type.launch();
      try {
        const page = await browser.newPage();
        const errors = [];
        page.on("pageerror", e => errors.push(e.message));
        for (const size of sizes) {
          await page.setViewportSize(size);
          await page.goto(base);
          await page.locator(".portrait").waitFor();
          const home = await page.evaluate(() => ({
            sectionCount: document.querySelectorAll("main section").length,
            width: document.documentElement.scrollWidth,
            portrait: document.querySelector(".portrait").getBoundingClientRect().toJSON(),
            links: [...document.querySelectorAll(".site-links a")].map(a => ({ href: a.getAttribute("href"), rect: a.getBoundingClientRect().toJSON() })),
            hasHeader: Boolean(document.querySelector("header")),
            reveal: getComputedStyle(document.querySelector(".bio")).backgroundImage,
          }));
          const label = `${type.name()} ${size.width}`;
          assert.equal(home.sectionCount, 1);
          assert.equal(home.hasHeader, false);
          assert.ok(home.width <= size.width, `${label}: horizontal overflow`);
          assert.ok(home.portrait.width <= size.width, `${label}: portrait clips`);
          assert.equal(home.reveal, "none", `${label}: artwork visible by default`);
          assert.equal(home.links.length, 4);
          for (const link of home.links) assert.ok(link.href && link.rect.width >= 43 && link.rect.height >= 43, `${label}: small or dead link`);
          await page.goto(base + "#projects");
          await page.locator("#projects-title").waitFor();
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        }
        await page.getByRole("link", { name: "Home" }).click();
        await page.locator(".bio").waitFor();
        await page.locator(".bio").evaluate(el => { const range = document.createRange(); range.selectNodeContents(el); const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range); });
        await page.waitForFunction(() => document.querySelector(".bio").classList.contains("is-revealed"));
        assert.match(await page.locator(".bio").evaluate(el => getComputedStyle(el).backgroundImage), /queens-desktop/);
        await page.evaluate(() => { location.hash = "#projects"; });
        await page.locator("#projects-title").waitFor();
        await page.evaluate(() => { location.hash = "#top"; });
        await page.locator(".bio").waitFor();
        assert.equal(await page.locator(".bio").evaluate(el => el.classList.contains("is-revealed")), false, "art persists after navigation");
        await page.evaluate(() => getSelection().removeAllRanges());
        await page.waitForFunction(() => !document.querySelector(".bio").classList.contains("is-revealed"));
        assert.deepEqual(errors, []);
      } finally { await browser.close(); }
    }
  } finally { await server.close(); }
});

test("AI profile and plain-text source remain available", async () => {
  const server = await createServer({ server: { host: "127.0.0.1", port: 0 } });
  await server.listen();
  const base = `http://127.0.0.1:${server.httpServer.address().port}/`;
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ javaScriptEnabled: false });
    await page.goto(base + "ai.html");
    assert.equal(await page.getByRole("heading", { name: "Noah Hova", level: 1 }).count(), 1);
    assert.equal((await page.request.get(base + "llms.txt")).status(), 200);
  } finally { await browser.close(); await server.close(); }
});
