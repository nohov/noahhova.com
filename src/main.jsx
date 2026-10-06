import { createRoot } from "react-dom/client";
import { useEffect, useRef, useState } from "react";
import "./styles.css";
import "./train.css";
import "./about.css";
import "./font.css";
import trainCutout from "./assets/train-cutout.png";

function TrainPass() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <section
      className="train-pass"
      aria-label="A silver subway train moving across a black background"
    >
      <div className="train-copy">
        <span>01 / original motion</span>
        <strong>
          New York
          <br />
          bound.
        </strong>
      </div>
      <button
        className="train-control"
        type="button"
        onClick={() => setIsPaused(!isPaused)}
        aria-pressed={isPaused}
      >
        {isPaused ? "Resume" : "Pause"}
      </button>
      <div className="skyline" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="track-bed" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className={`train-run ${isPaused ? "is-paused" : ""}`}>
        <img src={trainCutout} alt="" />
      </div>
    </section>
  );
}

function AsciiTrain({
  study = "02",
  title = (
    <>
      Signal
      <br />
      render.
    </>
  ),
  caption = "Live canvas → character mapping.",
  wheelMode = "base",
  wheelSize = 0.06,
  wheelSpokes = 4,
  wheelSpeed = 110,
}) {
  const art = useRef(null);
  const stage = useRef(null);

  useEffect(() => {
    const image = new Image();
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const ramp = " .,:;+*?%S#@";
    let frame;
    let started;
    let lastDraw = 0;

    const draw = (now) => {
      if (!started) started = now;
      if (now - lastDraw > 32 && art.current && stage.current) {
        lastDraw = now;
        const bounds = stage.current.getBoundingClientRect();
        const cols = Math.max(46, Math.floor(bounds.width / 6.7));
        const rows = Math.max(18, Math.floor(bounds.height / 8.1));
        const width = cols * 2;
        const height = rows * 2;
        canvas.width = width;
        canvas.height = height;
        context.clearRect(0, 0, width, height);
        const scale = Math.min(
          (width * 1.12) / image.width,
          (height * 0.7) / image.height,
        );
        const trainWidth = image.width * scale;
        const trainHeight = image.height * scale;
        const progress = ((now - started) % 12000) / 12000;
        const x = -trainWidth + progress * (width + trainWidth * 2);
        const y = (height - trainHeight) / 2;
        context.drawImage(image, x, y, trainWidth, trainHeight);
        const pixels = context.getImageData(0, 0, width, height).data;
        const output = [];
        for (let row = 0; row < rows; row += 1) {
          for (let col = 0; col < cols; col += 1) {
            const index = ((row * 2 + 1) * width + (col * 2 + 1)) * 4;
            const alpha = pixels[index + 3] / 255;
            const lightness =
              (pixels[index] * 0.21 +
                pixels[index + 1] * 0.72 +
                pixels[index + 2] * 0.07) /
              255;
            const sourceX = (col * 2 + 1 - x) / trainWidth;
            const sourceY = (row * 2 + 1 - y) / trainHeight;
            const wheelX = [0.11, 0.39, 0.61, 0.89];
            const nearestWheel = wheelX.reduce(
              (nearest, center) =>
                Math.min(nearest, Math.hypot(sourceX - center, sourceY - 0.72)),
              Infinity,
            );
            const nearestCenter = wheelX.reduce(
              (closest, center) =>
                Math.abs(sourceX - center) < Math.abs(sourceX - closest)
                  ? center
                  : closest,
              wheelX[0],
            );
            const wheelAngle = Math.atan2(
              sourceY - 0.72,
              sourceX - nearestCenter,
            );
            let character =
              alpha < 0.08
                ? " "
                : ramp[Math.round(lightness * (ramp.length - 1))];
            if (wheelMode === "erase" && nearestWheel < 0.085) character = " ";
            if (
              wheelMode === "add" &&
              nearestWheel > 0.062 &&
              nearestWheel < 0.095
            )
              character = "@";
            if (wheelMode === "spin" && nearestWheel < wheelSize) {
              const spoke = Math.abs(
                Math.sin(wheelAngle * wheelSpokes + now / wheelSpeed),
              );
              character =
                nearestWheel > wheelSize * 0.72 || spoke > 0.72
                  ? spoke > 0.88
                    ? "@"
                    : "+"
                  : ".";
            }
            if (
              wheelMode === "rim" &&
              nearestWheel > wheelSize * 0.72 &&
              nearestWheel < wheelSize
            ) {
              character =
                Math.sin(wheelAngle * 8 + now / wheelSpeed) > 0 ? "@" : "+";
            }
            if (
              wheelMode === "tread" &&
              nearestWheel > wheelSize * 0.7 &&
              nearestWheel < wheelSize
            ) {
              character =
                Math.sin(wheelAngle * 12 - now / wheelSpeed) > 0.3 ? "#" : ".";
            }
            output.push(character);
          }
          output.push("\n");
        }
        art.current.textContent = output.join("");
      }
      frame = requestAnimationFrame(draw);
    };

    image.onload = () => {
      frame = requestAnimationFrame(draw);
    };
    image.src = trainCutout;
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section
      className="ascii-train"
      ref={stage}
      aria-label="An animated ASCII interpretation of the train"
    >
      <div className="train-copy">
        <span>{study} / ASCII train</span>
        <strong>{title}</strong>
      </div>
      <pre ref={art} aria-hidden="true" />
      <p>{caption}</p>
    </section>
  );
}

function TrainSolo() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <section
      className="train-solo"
      aria-label="An isolated animated silver subway train"
    >
      <div className="train-copy">
        <span>03 / isolated motion</span>
        <strong>
          Train
          <br />
          only.
        </strong>
      </div>
      <button
        className="train-control"
        type="button"
        onClick={() => setIsPaused(!isPaused)}
        aria-pressed={isPaused}
      >
        {isPaused ? "Resume" : "Pause"}
      </button>
      <div className={`train-run ${isPaused ? "is-paused" : ""}`}>
        <img src={trainCutout} alt="" />
      </div>
    </section>
  );
}

function HeroAsciiTrain({ headerRef, introRef }) {
  const art = useRef(null);
  const train = useRef(null);

  useEffect(() => {
    const image = new Image();
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const ramp = " .,:;+*?%S#@";
    let frame;
    let lastDraw = 0;

    image.onload = () => {
      const cols = 120;
      const rows = 24;
      const width = cols * 2;
      const height = rows * 2;
      canvas.width = width;
      canvas.height = height;
      const scale = Math.min(
        width / image.width,
        (height * 0.9) / image.height,
      );
      const trainWidth = image.width * scale;
      const trainHeight = image.height * scale;
      const render = (now) => {
        if (now - lastDraw > 48) {
          lastDraw = now;
          context.clearRect(0, 0, width, height);
          const x = (width - trainWidth) / 2;
          const y = (height - trainHeight) / 2;
          context.drawImage(image, x, y, trainWidth, trainHeight);
          const pixels = context.getImageData(0, 0, width, height).data;
          const output = [];
          for (let row = 0; row < rows; row += 1) {
            for (let col = 0; col < cols; col += 1) {
              const px = col * 2 + 1;
              const py = row * 2 + 1;
              const index = (py * width + px) * 4;
              const alpha = pixels[index + 3] / 255;
              const lightness =
                (pixels[index] * 0.21 +
                  pixels[index + 1] * 0.72 +
                  pixels[index + 2] * 0.07) /
                255;
              const sourceX = (px - x) / trainWidth;
              const sourceY = (py - y) / trainHeight;
              const wheelX = [0.11, 0.39, 0.61, 0.89];
              const nearestCenter = wheelX.reduce(
                (closest, center) =>
                  Math.abs(sourceX - center) < Math.abs(sourceX - closest)
                    ? center
                    : closest,
                wheelX[0],
              );
              const distance = Math.hypot(
                sourceX - nearestCenter,
                sourceY - 0.72,
              );
              let character =
                alpha < 0.08
                  ? " "
                  : ramp[Math.round(lightness * (ramp.length - 1))];
              if (distance > 0.048 * 0.72 && distance < 0.048) {
                const angle = Math.atan2(
                  sourceY - 0.72,
                  sourceX - nearestCenter,
                );
                character = Math.sin(angle * 8 + now / 76) > 0 ? "@" : "+";
              }
              output.push(character);
            }
            output.push("\n");
          }
          if (art.current) art.current.textContent = output.join("");
        }
        frame = requestAnimationFrame(render);
      };
      frame = requestAnimationFrame(render);
    };
    image.src = trainCutout;
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return undefined;
    let frame;
    let started;
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const animate = (now) => {
      if (!started) started = now;
      const elapsed = now - started;
      const viewport = window.innerWidth;
      const trainWidth = train.current?.offsetWidth || 730;
      const introBottom = introRef.current
        ? introRef.current.offsetTop + introRef.current.offsetHeight
        : 0;
      const parkedY =
        viewport <= 680
          ? Math.max(window.innerHeight * 0.74, introBottom + 48)
          : clamp(window.innerHeight * 0.74, 470, 570);
      let x;
      let y = 0;

      if (elapsed < 4800) {
        const progress = elapsed / 4800;
        x = -trainWidth + (viewport + trainWidth + 24) * progress;
        y = -28;
        headerRef.current?.style.setProperty(
          "--reveal-x",
          `${clamp(x + 80, 0, viewport)}px`,
        );
      } else if (elapsed < 9500) {
        const progress = (elapsed - 4800) / 4700;
        x =
          viewport +
          24 +
          (viewport / 2 - trainWidth / 2 - (viewport + 24)) * progress;
        y = parkedY;
        headerRef.current?.style.setProperty("--reveal-x", `${viewport}px`);
      } else {
        x = viewport / 2 - trainWidth / 2;
        y = parkedY;
        headerRef.current?.style.setProperty("--reveal-x", `${viewport}px`);
      }

      if (train.current)
        train.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [headerRef, introRef]);

  return (
    <div
      className="hero-ascii-train"
      ref={train}
      aria-label="An ASCII subway train moving into its parked position"
    >
      <pre ref={art} />
    </div>
  );
}

function GlyphText({ text }) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [frame, setFrame] = useState(0);
  const accentedLetters = "åæçðéëíñøößüýžłþ";
  const diacritics = [
    "\u0301",
    "\u0300",
    "\u0308",
    "\u0302",
    "\u0303",
    "\u0304",
    "\u0323",
    "\u0324",
    "\u0327",
  ];

  useEffect(() => {
    if (activeIndex < 0) return undefined;
    let animationFrame;
    let lastFrame = -1;
    const animate = (time) => {
      const nextFrame = Math.floor(time / 45);
      if (nextFrame !== lastFrame) {
        lastFrame = nextFrame;
        setFrame(nextFrame);
      }
      animationFrame = window.requestAnimationFrame(animate);
    };
    animationFrame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [activeIndex]);

  return (
    <span className="glyph-text" onPointerLeave={() => setActiveIndex(-1)}>
      {[...text].map((character, index) => (
        <span
          className="glyph-character"
          key={`${character}-${index}`}
          onPointerEnter={() => {
            if (character !== " ") setActiveIndex(index);
          }}
        >
          {activeIndex >= 0 &&
          /[a-z]/i.test(character) &&
          Math.abs(activeIndex - index) <= 1
            ? (index + activeIndex + frame) % 2 === 0
              ? accentedLetters[(index + activeIndex + frame) % accentedLetters.length]
              : `${character}${diacritics[(index + activeIndex + frame) % diacritics.length]}`
            : character}
        </span>
      ))}
    </span>
  );
}

function CopyEmail({ address, className = "", label = address }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const reset = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(reset);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      const scratch = document.createElement("textarea");
      scratch.value = address;
      scratch.setAttribute("readonly", "");
      scratch.style.position = "fixed";
      scratch.style.opacity = "0";
      document.body.appendChild(scratch);
      scratch.select();
      document.execCommand("copy");
      document.body.removeChild(scratch);
    }
    setCopied(true);
  };

  return (
    <button
      className={`copy-email ${className}`}
      type="button"
      onClick={copy}
      title="Click to copy"
    >
      <span aria-hidden="true">{copied ? "copied!" : label}</span>
      <span className="visually-hidden" aria-live="polite">
        {copied
          ? `${address} copied to clipboard`
          : `Copy ${address} to clipboard`}
      </span>
    </button>
  );
}

function AboutPanel({ isOpen, onClose, view, onShowContact }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen, onClose]);

  return (
    <>
      <button
        className={`about-backdrop ${isOpen ? "is-open" : ""}`}
        aria-label="Close about panel"
        tabIndex={isOpen ? 0 : -1}
        onClick={onClose}
      />
      <aside
        id="about-panel"
        className={`about-panel view-${view} ${isOpen ? "is-open" : ""}`}
        aria-hidden={!isOpen}
        aria-label="About Noah"
      >
        <header className="about-panel-header">
          <span className="panel-contact-label">contact</span>
          <span className="panel-menu-label">menu</span>
          <button type="button" onClick={onClose}>
            <GlyphText text="close" />
          </button>
        </header>
        <div className="about-panel-content">
          <section className="about-contact">
            <h2>General contacts</h2>
            <div className="contact-details">
              <span>emails</span>
              <a className="contact-email" href="mailto:noah.hova@stonybrook.edu">
                noah.hova@stonybrook.edu
              </a>
              <a className="contact-email" href="mailto:noahhova3@gmail.com">
                noahhova3@gmail.com
              </a>
            </div>
          </section>
          <section className="about-follow">
            <nav className="about-links" aria-label="Social links">
              <a
                href="https://www.linkedin.com/in/noahhova/"
                target="_blank"
                rel="noreferrer"
              >
                <GlyphText text="linkedin" />
              </a>
              <a href="https://x.com/NoahHova" target="_blank" rel="noreferrer">
                <GlyphText text="x / @noahhova" />
              </a>
              <a
                href="https://github.com/nohov"
                target="_blank"
                rel="noreferrer"
              >
                <GlyphText text="github" />
              </a>
            </nav>
          </section>
          <nav className="mobile-menu-links" aria-label="Site menu">
            <a href="#top" onClick={onClose}>
              work
            </a>
            <a href="#top" onClick={onClose}>
              now
            </a>
            <button type="button" onClick={onShowContact}>
              contact
            </button>
          </nav>
          <div className="mobile-menu-business">
            <span>new business</span>
            <span>noah hova</span>
            <a href="mailto:noahhova3@gmail.com">noahhova3@gmail.com</a>
          </div>
        </div>
      </aside>
    </>
  );
}

function App() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [panelView, setPanelView] = useState("contact");
  const headerRef = useRef(null);
  const introRef = useRef(null);

  const openPanel = () => {
    setPanelView(window.matchMedia("(max-width: 680px)").matches ? "menu" : "contact");
    setAboutOpen(true);
  };

  return (
    <main>
      <section className="intro-stage" id="top">
        <HeroAsciiTrain headerRef={headerRef} introRef={introRef} />
        <header className="returning-header" ref={headerRef}>
          <span aria-hidden="true" />
          <nav aria-label="Primary navigation">
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <GlyphText text="work" />
            </button>
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <GlyphText text="now" />
            </button>
          </nav>
          <button
            className="about-trigger"
            type="button"
            onClick={openPanel}
            aria-expanded={aboutOpen}
            aria-controls="about-panel"
          >
            <span className="desktop-trigger-label"><GlyphText text="contact" /></span>
            <span className="mobile-trigger-label"><GlyphText text="menu" /></span>
          </button>
        </header>
        <div className="intro-panel" ref={introRef}>
          <p>hey, i’m noah</p>
          <p>
            i grew up in queens. i study applied mathematics and economics at
            stony brook university.
          </p>
          <p>
            i believe ai will change society as much as every previous
            technological revolution if not more. as cgp grey puts it, first
            machines replaced muscle, now they’re replacing minds.
          </p>
          <p>
            i’m online pretty much all the time. most of what i know, i learned
            from the internet, and most of what i build lives there too.
          </p>
          <p>
            <CopyEmail address="noahhova3@gmail.com" />
          </p>
        </div>
      </section>
      <AboutPanel
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
        view={panelView}
        onShowContact={() => setPanelView("contact")}
      />
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
