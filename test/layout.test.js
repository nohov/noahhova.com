import test from "node:test";
import assert from "node:assert/strict";
import { chromium, firefox, webkit } from "playwright";
import { createServer } from "vite";

test("the artwork and copy fit resized and full-screen browser windows", async () => {
  const server = await createServer({ server: { host: "127.0.0.1", port: 0 } });
  await server.listen();
  let browser;

  try {
    const { port } = server.httpServer.address();
    for (const browserType of [chromium, firefox, webkit]) {
      browser = await browserType.launch();
      const page = await browser.newPage({ viewport: { width: 320, height: 640 } });
      await page.goto(`http://127.0.0.1:${port}/`);
      await page.waitForFunction(() => {
        const canvas = document.querySelector(".intro-art canvas");
        const pixels = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
        for (let i = 3; i < pixels.length; i += 4) if (pixels[i]) return true;
        return false;
      });
      for (const [width, height] of [
        [320, 640], [390, 844], [540, 700], [681, 720], [768, 1024],
        [681, 350], [900, 400], [900, 500], [1207, 713],
        [1280, 800], [1366, 768], [1440, 600], [1440, 900],
        [1512, 780], [1512, 861], [1512, 982], [1920, 800], [1920, 1080],
        [2560, 1440], [3440, 1440], [3840, 2160], [390, 844],
      ]) {
        await page.setViewportSize({ width, height });
        const layout = await page.evaluate(() => {
          const art = document.querySelector(".intro-art canvas").getBoundingClientRect();
          const copy = document.querySelector(".intro-panel").getBoundingClientRect();
          const heading = document.querySelector(".intro-panel p:first-child");
          return {
            art: { left: art.left, top: art.top, right: art.right, bottom: art.bottom },
            copy: { left: copy.left, top: copy.top, right: copy.right, bottom: copy.bottom },
            headingSize: parseFloat(getComputedStyle(heading).fontSize),
            bodySize: parseFloat(getComputedStyle(document.querySelector(".intro-panel")).fontSize),
            scrollWidth: document.documentElement.scrollWidth,
          };
        });

        const size = `${browserType.name()} ${width}x${height}`;
        assert.ok(layout.art.left >= 0 && layout.art.top >= 0, `${size}: art starts outside the viewport`);
        assert.ok(layout.art.right <= width && layout.art.bottom <= height, `${size}: art ends outside the viewport`);
        if (width >= 1280 && height >= 700) assert.ok(layout.copy.top >= 0 && layout.copy.bottom <= height, `${size}: copy is clipped in a full-screen window`);
        if (width >= 3000) assert.ok(layout.art.right - layout.art.left >= width * 0.22, `${size}: art is too small in a full-screen window`);
        if (width >= 2500 && height >= 1000) assert.ok(layout.bodySize >= 20, `${size}: text is too small in a full-screen window`);
        assert.ok(layout.scrollWidth <= width, `${size}: horizontal overflow`);
        assert.ok(layout.headingSize <= 28, `${size}: heading is too large`);

      }
      await page.setViewportSize({ width: 1207, height: 713 });
      await page.locator(".intro-panel").evaluate((panel) => { panel.style.fontSize = "32px"; });
      await page.locator(".intro-panel p:first-child").evaluate((heading) => { heading.style.fontSize = "56px"; });
      const enlargedArt = await page.locator(".intro-art canvas").boundingBox();
      assert.ok(enlargedArt.y >= 0 && enlargedArt.y + enlargedArt.height <= 713, `${browserType.name()}: enlarged text clips the art`);
      await page.locator(".intro-panel .copy-email").scrollIntoViewIfNeeded();
      const email = await page.locator(".intro-panel .copy-email").boundingBox();
      assert.ok(email.y >= 0 && email.y + email.height <= 713, `${browserType.name()}: enlarged copy cannot be reached`);
      await page.close();
      await browser.close();
      browser = undefined;
    }
  } finally {
    await browser?.close();
    await server.close();
  }
});
