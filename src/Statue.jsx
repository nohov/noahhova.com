import { useEffect, useRef, useState } from "react";
import photoUrl from "./assets/statue-photo.png";
import cutoutUrl from "./assets/statue-cutout.png";
import { renderDither } from "./dither";

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

export default function Statue() {
  const canvasRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all([loadImage(photoUrl), loadImage(cutoutUrl)]).then(
      ([photo, cutout]) => {
        if (cancelled || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) {
          setFailed(true);
          return;
        }
        const { width, height } = canvas;
        context.drawImage(photo, 0, 0, width, height);
        const source = context.getImageData(0, 0, width, height).data;
        context.clearRect(0, 0, width, height);
        // The existing cutout supplies the statue's alpha without the red wall.
        context.drawImage(cutout, 0, 0, width, height);
        const mask = context.getImageData(0, 0, width, height).data;
        const output = context.createImageData(width, height);
        output.data.set(renderDither(source, mask, width, height));
        context.putImageData(output, 0, 0);
      },
    ).catch(() => {
      if (!cancelled) setFailed(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <img
        className="statue-fallback"
        src={cutoutUrl}
        alt="A classical statue holding a ball"
        width="664"
        height="538"
        hidden={!failed}
      />
      <canvas
        ref={canvasRef}
        width="1328"
        height="1076"
        role="img"
        aria-label="A classical statue holding a ball, rendered in cobalt dither"
        hidden={failed}
      />
    </>
  );
}
