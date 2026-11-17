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
          await page.locator(".portrait").evaluate(img => img.decode());
          const home = await page.evaluate(() => ({
            sectionCount: document.querySelectorAll("main section").length,
            width: document.documentElement.scrollWidth,
            portrait: document.querySelector(".portrait").getBoundingClientRect().toJSON(),
            intro: document.querySelector(".intro").getBoundingClientRect().toJSON(),
            image: { width: document.querySelector(".portrait").naturalWidth, height: document.querySelector(".portrait").naturalHeight, alt: document.querySelector(".portrait").alt, source: document.querySelector(".portrait").currentSrc },
            bioTextLeft: (() => { const bio = document.querySelector(".bio"); const range = document.createRange(); range.setStart(bio.firstChild, 0); range.setEnd(bio.firstChild, 1); return range.getBoundingClientRect().left; })(),
            links: [...document.querySelectorAll(".site-links a")].map(a => ({ href: a.getAttribute("href"), rect: a.getBoundingClientRect().toJSON() })),
            email: document.querySelector(".site-links button").getBoundingClientRect().toJSON(),
            hasHeader: Boolean(document.querySelector("header")),
            reveal: getComputedStyle(document.querySelector(".bio")).backgroundImage,
            citations: [...document.querySelectorAll(".bio a")].map(a => a.href),
          }));
          const label = `${type.name()} ${size.width}`;
          assert.equal(home.sectionCount, 1);
          assert.equal(home.hasHeader, false);
          assert.ok(home.width <= size.width, `${label}: horizontal overflow`);
          assert.ok(home.portrait.width <= size.width, `${label}: portrait clips`);
          assert.ok(Math.abs(home.intro.left - home.portrait.left) < 1, `${label}: intro alignment`);
          assert.equal(home.image.width, 1080);
          assert.equal(home.image.height, 1512);
          assert.equal(home.image.alt, "Cobalt halftone sculpture with a raised hand");
          if (type === chromium) assert.match(home.image.source, /\.avif(?:\?|$)/, "modern browser did not use smaller image");
          assert.ok(Math.abs(home.portrait.width / home.portrait.height - 5 / 7) < .01, `${label}: portrait proportions`);
          assert.ok(Math.abs(home.bioTextLeft - home.portrait.left) < 1, `${label}: blurb alignment`);
          assert.equal(home.reveal, "none", `${label}: artwork visible by default`);
          assert.equal(home.citations.length, 2, `${label}: missing source links`);
          assert.equal(home.links.length, 3);
          for (const link of home.links) assert.ok(link.href && link.rect.width >= 43 && link.rect.height >= 43, `${label}: small or dead link`);
          assert.ok(home.email.width >= 43 && home.email.height >= 43, `${label}: small Email button`);
          await page.goto(base + "#projects");
          await page.locator("#projects-title").waitFor();
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        }
        await page.getByRole("button", { name: "Email" }).click();
        await page.waitForFunction(() => document.querySelector(".site-links button").textContent !== "Email");
        assert.equal(await page.locator(".site-links button").textContent(), "Copied", `${type.name()} Projects clipboard`);
        if (type === chromium) {
          await page.context().grantPermissions(["clipboard-read"]);
          assert.equal(await page.evaluate(() => navigator.clipboard.readText()), "me@noahhova.com");
        }
        assert.match(page.url(), /#projects$/, "Email opened another destination");
        await page.getByRole("link", { name: "Home" }).click();
        await page.getByRole("button", { name: "Email" }).focus();
        await page.keyboard.press("Enter");
        await page.waitForFunction(() => document.querySelector(".site-links button").textContent !== "Email");
        assert.equal(await page.locator(".site-links button").textContent(), "Copied", `${type.name()} Home clipboard`);
        await page.locator(".intro").evaluate(el => { const range = document.createRange(); range.selectNodeContents(el); const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range); });
        await page.waitForTimeout(80);
        assert.equal(await page.locator(".bio-reveal.is-backed").count(), 0, "intro selection reveals painting");
        await page.locator(".bio").waitFor();
        await page.locator(".bio").evaluate(el => { const range = document.createRange(); range.setStart(el.firstChild, 0); range.setEnd(el.firstChild, 8); const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range); });
        await page.waitForFunction(() => document.querySelector(".bio-reveal.is-backed.is-painted"));
        const reveal = await page.evaluate(() => {
          const bio = document.querySelector(".bio");
          const layer = document.querySelector(".bio-reveal");
          return { bio: bio.getBoundingClientRect().toJSON(), layer: layer.getBoundingClientRect().toJSON(), background: getComputedStyle(layer, "::before").backgroundImage, duration: getComputedStyle(layer, "::before").transitionDuration, animation: getComputedStyle(layer, "::before").animationName, strips: document.querySelectorAll(".bio-reveal-line").length };
        });
        assert.equal(reveal.strips, 0, "striped reveal remains");
        assert.ok(Math.abs(reveal.bio.width - reveal.layer.width) < 1 && Math.abs(reveal.bio.height - reveal.layer.height) < 1, "painting does not fill paragraph");
        assert.match(reveal.background, /queens-desktop/);
        assert.equal(reveal.animation, "none", "painting has a wipe or stagger animation");
        assert.equal(reveal.duration, "0.42s", "painting fade is not restrained");
        await page.waitForFunction(() => {
          const layer = document.querySelector(".bio-reveal");
          const opacity = Number(getComputedStyle(layer, "::before").opacity);
          return opacity > 0 && opacity < 1;
        });
        assert.equal(await page.locator(".bio-reveal").evaluate(el => getComputedStyle(el).opacity), "1", "dark backing is missing during fade-in");
        assert.equal(await page.locator(".bio").evaluate(el => getComputedStyle(el).color), "rgb(255, 255, 255)");
        await page.waitForFunction(() => getComputedStyle(document.querySelector(".bio-reveal"), "::before").opacity === "1");
        await page.evaluate(() => getSelection().removeAllRanges());
        await page.waitForFunction(() => !document.querySelector(".bio-reveal").classList.contains("is-painted"));
        assert.equal(await page.locator(".bio-reveal").evaluate(el => getComputedStyle(el).opacity), "1", "dark backing vanished before fade-out");
        assert.equal(await page.locator(".bio").evaluate(el => getComputedStyle(el).color), "rgb(255, 255, 255)");
        await page.waitForFunction(() => getComputedStyle(document.querySelector(".bio-reveal")).opacity === "0");
        assert.equal(await page.locator(".bio").evaluate(el => getComputedStyle(el).color), "rgb(23, 27, 24)");
        await page.setViewportSize({ width: 320, height: 568 });
        await page.locator(".bio").evaluate(el => { const range = document.createRange(); range.setStart(el.firstChild, 0); range.setEnd(el.firstChild, 5); const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range); });
        await page.waitForFunction(() => document.querySelector(".bio-reveal").classList.contains("is-backed"));
        assert.ok(await page.locator(".bio").evaluate(el => el.getBoundingClientRect().height > 200), "phone paragraph did not fill multiple lines");
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        await page.evaluate(() => getSelection().removeAllRanges());
        await page.waitForFunction(() => !document.querySelector(".bio-reveal").classList.contains("is-backed"));
        await page.locator(".bio a").first().evaluate(el => { const range = document.createRange(); range.selectNodeContents(el); const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range); });
        await page.waitForFunction(() => document.querySelector(".bio-reveal").classList.contains("is-backed"));
        await page.evaluate(() => { location.hash = "#projects"; });
        await page.locator("#projects-title").waitFor();
        await page.evaluate(() => { location.hash = "#top"; });
        await page.locator(".bio").waitFor();
        assert.equal(await page.locator(".bio-reveal.is-backed").count(), 0, "art persists after navigation");
        await page.evaluate(() => getSelection().removeAllRanges());
        await page.waitForFunction(() => !document.querySelector(".bio-reveal").classList.contains("is-backed"));
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
