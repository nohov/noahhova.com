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
  const [revealed, setRevealed] = useState(false);
  const bioRef = useRef(null);

  useEffect(() => {
    const syncView = () => { setRevealed(false); setView(currentView()); };
    addEventListener("hashchange", syncView);
    return () => removeEventListener("hashchange", syncView);
  }, []);

  useEffect(() => {
    const checkSelection = () => {
      const selection = getSelection();
      setRevealed(Boolean(bioRef.current && selection && !selection.isCollapsed && selection.rangeCount && selection.getRangeAt(0).intersectsNode(bioRef.current)));
    };
    document.addEventListener("selectionchange", checkSelection);
    return () => document.removeEventListener("selectionchange", checkSelection);
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
      <p className={`bio${revealed ? " is-revealed" : ""}`} ref={bioRef}>I’m Noah Hova. I think AI may eventually do most of our work better than we can. That leaves an older question: what makes a life good when ability is no longer rare? <a href="https://aristotle.johnhboyer.com/EN/book/1/" target="_blank" rel="noreferrer">Aristotle</a> located the good life in virtuous activity; <a href="https://texts.stoameditation.com/read/meditations/8/59" target="_blank" rel="noreferrer">Marcus Aurelius</a> wrote that we exist for one another. I suspect helping someone matters for more than the result. If a machine can do the job better, what are we still doing for each other?</p>
    </section> : <section className="projects" id="projects" aria-labelledby="projects-title">
      <h1 id="projects-title">Projects</h1>
      <article><h2>ScavScrap</h2><p>A glasses-to-PC electronics guide in progress. The relay and early recognition experiment are built; the guided lesson is still planned.</p><a href="https://github.com/nohov/Sightcuit" target="_blank" rel="noreferrer">Repository</a></article>
      <article><h2>Deep-ML</h2><p>Hand-written machine learning and math practice solutions.</p><a href="https://github.com/nohov/deep-ml" target="_blank" rel="noreferrer">Repository</a></article>
      <nav className="site-links" aria-label="Links"><a href="#top">Home</a><CopyEmail /><a href="/ai.html">AI profile</a></nav>
    </section>}
  </main>;
}

createRoot(document.getElementById("root")).render(<App />);
