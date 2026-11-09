function noise(x, y) {
  let value = Math.imul(x + 1, 374761393) + Math.imul(y + 1, 668265263);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967296;
}

export function renderDither(source, mask, width, height) {
  const output = new Uint8ClampedArray(width * height * 4);
  const luminance = new Float32Array(width * height);

  for (let pixel = 0; pixel < luminance.length; pixel += 1) {
    const offset = pixel * 4;
    luminance[pixel] =
      source[offset] * 0.2126 +
      source[offset + 1] * 0.7152 +
      source[offset + 2] * 0.0722;
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const pixel = y * width + x;
      const offset = pixel * 4;
      if (mask[offset + 3] < 16) continue;

      const light = luminance[pixel];
      const left = luminance[y * width + Math.max(0, x - 4)];
      const right = luminance[y * width + Math.min(width - 1, x + 4)];
      const top = luminance[Math.max(0, y - 4) * width + x];
      const bottom = luminance[Math.min(height - 1, y + 4) * width + x];
      const detail = light + (light - (left + right + top + bottom) / 4);
      const coverage = Math.max(0.12, Math.min(0.98, 0.32 + (detail - 70) * 0.0046));
      const threshold = noise(Math.floor(x / 4), y) * 0.8 + noise(x, y) * 0.2;
      if (coverage <= threshold) continue;

      output[offset] = 59;
      output[offset + 1] = 57;
      output[offset + 2] = 191;
      output[offset + 3] = mask[offset + 3];
    }
  }

  return output;
}
