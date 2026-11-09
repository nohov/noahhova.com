import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import "./styles.css";
import "./about.css";
import Statue from "./Statue";

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
              <CopyEmail
                className="contact-email"
                address="me@noahhova.com"
              />
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
            <a href="mailto:me@noahhova.com">me@noahhova.com</a>
          </div>
        </div>
      </aside>
    </>
  );
}

function App() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [panelView, setPanelView] = useState("contact");

  const openPanel = () => {
    setPanelView(window.matchMedia("(max-width: 680px)").matches ? "menu" : "contact");
    setAboutOpen(true);
  };

  return (
    <main>
      <section className="intro-stage" id="top">
        <header className="returning-header">
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
        <div className="intro-panel">
          <p>hey, i’m noah</p>
          <p>
            i grew up in queens. i study mathematics and applied math at
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
            <CopyEmail address="me@noahhova.com" />
          </p>
        </div>
        <figure className="intro-art">
          <Statue />
        </figure>
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
