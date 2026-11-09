import test from "node:test";
import assert from "node:assert/strict";
import { renderDither } from "../src/dither.js";

test("dither preserves the cutout and uses only the reference cobalt", () => {
  const width = 128;
  const height = 64;
  const source = new Uint8ClampedArray(width * height * 4);
  const mask = new Uint8ClampedArray(source.length);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      source.fill(x < width / 2 ? 80 : 220, offset, offset + 3);
      mask[offset + 3] = y === 0 ? 0 : 255;
    }
  }

  const output = renderDither(source, mask, width, height);
  const bluePixels = [0, 0];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      if (y === 0) assert.equal(output[offset + 3], 0);
      if (!output[offset + 3]) continue;
      assert.deepEqual([...output.slice(offset, offset + 3)], [59, 57, 191]);
      bluePixels[x < width / 2 ? 0 : 1] += 1;
    }
  }
  assert.ok(bluePixels[1] > bluePixels[0] * 2);
});
