import { createRoot } from "react-dom/client";
import { useEffect, useRef, useState } from "react";
import sculpture from "./assets/cobalt-engraving-1080x1512.png";
import sculptureAvif from "./assets/cobalt-engraving-1080x1512.avif";
import "./styles.css";

const currentView = () => location.hash === "#projects" ? "projects" : "home";

function CopyEmail() {
  const [label, setLabel] = useState("Email");
  const resetTimer = useRef();
  useEffect(() => () => clearTimeout(resetTimer.current), []);
  const copy = async () => {
    try {
      try {
        await navigator.clipboard.writeText("me@noahhova.com");
      } catch {
        const input = document.createElement("textarea");
        input.value = "me@noahhova.com";
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.append(input);
        input.select();
        const copied = document.execCommand("copy");
        input.remove();
        if (!copied) throw new Error("Copy failed");
      }
      setLabel("Copied");
    } catch {
      setLabel("Copy failed");
    }
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setLabel("Email"), 2000);
  };
  return <button type="button" onClick={copy} aria-live="polite">{label}</button>;
}

function App() {
  const [view, setView] = useState(currentView);
  const [reveal, setReveal] = useState({ lines: [], active: false, width: 0, height: 0 });
  const bioRef = useRef(null);
  const clearRevealTimer = useRef();

  useEffect(() => {
    const syncView = () => {
      clearTimeout(clearRevealTimer.current);
      setReveal({ lines: [], active: false, width: 0, height: 0 });
      setView(currentView());
    };
    addEventListener("hashchange", syncView);
    return () => removeEventListener("hashchange", syncView);
  }, []);

  useEffect(() => {
    const checkSelection = () => {
      const bio = bioRef.current;
      const selection = getSelection();
      const range = selection?.rangeCount && !selection.isCollapsed ? selection.getRangeAt(0) : null;
      const hide = () => {
        setReveal(previous => previous.active ? { ...previous, active: false } : previous);
        clearTimeout(clearRevealTimer.current);
        clearRevealTimer.current = setTimeout(() => setReveal({ lines: [], active: false, width: 0, height: 0 }), 220);
      };
      if (!bio || !range || !range.intersectsNode(bio)) return hide();

      const box = bio.getBoundingClientRect();
      const lines = [];
      for (const rect of range.getClientRects()) {
        const left = Math.max(0, rect.left - box.left);
        const right = Math.min(box.width, rect.right - box.left);
        const top = Math.max(0, rect.top - box.top);
        const bottom = Math.min(box.height, rect.bottom - box.top);
        if (right - left < 1 || bottom - top < 1) continue;
        const line = lines.find(item => Math.abs(item.top - top) < 3);
        if (line) {
          line.left = Math.min(line.left, left);
          line.right = Math.max(line.right, right);
          line.top = Math.min(line.top, top);
          line.bottom = Math.max(line.bottom, bottom);
        } else lines.push({ left, right, top, bottom });
      }
      if (!lines.length) return hide();
      clearTimeout(clearRevealTimer.current);
      setReveal({ lines, active: true, width: box.width, height: box.height });
    };
    document.addEventListener("selectionchange", checkSelection);
    addEventListener("resize", checkSelection);
    return () => {
      document.removeEventListener("selectionchange", checkSelection);
      removeEventListener("resize", checkSelection);
      clearTimeout(clearRevealTimer.current);
    };
  }, [view]);

  return <main>
    {view === "home" ? <section className="home" id="top" aria-labelledby="home-title">
      <picture><source srcSet={sculptureAvif} type="image/avif" /><img className="portrait" src={sculpture} width="1080" height="1512" alt="Cobalt halftone sculpture with a raised hand" /></picture>
      <h1 id="home-title" className="visually-hidden">Noah Hova</h1>
      <nav className="site-links" aria-label="Links">
        <a href="https://github.com/nohov" target="_blank" rel="noreferrer">GitHub</a>
        <CopyEmail />
        <a href="#projects">Projects</a>
        <a href="/ai.html">AI profile</a>
      </nav>
      <p className="intro">I’m Noah Hova. I like problems that fit on a page and projects that refuse to. Lately, that means working through machine-learning exercises by hand and prototyping a glasses-to-PC electronics guide.</p>
      <div className="bio-wrap">
        <div className={`bio-reveal${reveal.active ? " is-active" : ""}`} aria-hidden="true">
          {reveal.lines.map(line => <div className="bio-reveal-line" key={Math.round(line.top)} style={{ clipPath: `inset(${line.top}px ${Math.max(0, reveal.width - line.right)}px ${Math.max(0, reveal.height - line.bottom)}px ${line.left}px)` }} />)}
        </div>
        <p className={`bio${reveal.active ? " has-selection" : ""}`} ref={bioRef}>I think AI may eventually do most of our work better than we can. That leaves an older question: what makes a life good when ability is no longer rare? <a href="https://aristotle.johnhboyer.com/EN/book/1/" target="_blank" rel="noreferrer">Aristotle</a> located the good life in virtuous activity; <a href="https://texts.stoameditation.com/read/meditations/8/59" target="_blank" rel="noreferrer">Marcus Aurelius</a> wrote that we exist for one another. I suspect helping someone matters for more than the result. If a machine can do the job better, what are we still doing for each other?</p>
      </div>
    </section> : <section className="projects" id="projects" aria-labelledby="projects-title">
      <h1 id="projects-title">Projects</h1>
      <article><h2>ScavScrap</h2><p>A glasses-to-PC electronics guide in progress. The relay and early recognition experiment are built; the guided lesson is still planned.</p><a href="https://github.com/nohov/Sightcuit" target="_blank" rel="noreferrer">Repository</a></article>
      <article><h2>Deep-ML</h2><p>Hand-written machine learning and math practice solutions.</p><a href="https://github.com/nohov/deep-ml" target="_blank" rel="noreferrer">Repository</a></article>
      <nav className="site-links" aria-label="Links"><a href="#top">Home</a><CopyEmail /><a href="/ai.html">AI profile</a></nav>
    </section>}
  </main>;
}

createRoot(document.getElementById("root")).render(<App />);
