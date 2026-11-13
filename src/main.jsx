import { createRoot } from "react-dom/client";
import { useLayoutEffect, useRef, useState } from "react";
import "./styles.css";

const requestedBackground = new URLSearchParams(location.search).get("background");
const background = ["original", "cloud", "queens", "topographic"].includes(requestedBackground) ? requestedBackground : "queens";

function App() {
  const heroRef = useRef(null);
  const [view, setView] = useState(location.hash === "#projects" ? "projects" : "home");

  useLayoutEffect(() => {
    const syncView = () => setView(location.hash === "#projects" ? "projects" : "home");
    addEventListener("hashchange", syncView);
    return () => removeEventListener("hashchange", syncView);
  }, []);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const move = (event) => {
      if (reducedMotion.matches) return;
      const point = event.touches?.[0] ?? event;
      const bounds = hero.getBoundingClientRect();
      const x = (point.clientX - bounds.left) / bounds.width - .5;
      const y = (point.clientY - bounds.top) / bounds.height - .5;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        hero.style.setProperty("--painting-x", `${(-x * 22).toFixed(1)}px`);
        hero.style.setProperty("--painting-y", `${(-y * 14).toFixed(1)}px`);
        frame = 0;
      });
    };

    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerdown", move);
    hero.addEventListener("touchstart", move, { passive: true });
    hero.addEventListener("touchmove", move, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerdown", move);
      hero.removeEventListener("touchstart", move);
      hero.removeEventListener("touchmove", move);
    };
  }, [view]);

  return <>
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Noah Hova, home" aria-current={view === "home" ? "page" : undefined}><span className="brand-mark" aria-hidden="true">N</span><span>Noah Hova <small>Notes from the internet</small></span></a>
      <nav className="site-nav" aria-label="Site">
        <a className="projects-nav" href="#projects" aria-current={view === "projects" ? "page" : undefined}>Projects <span aria-hidden="true">↗</span></a>
        <a className="contact-pill" href="mailto:me@noahhova.com">Get in touch</a>
      </nav>
    </header>

    <main>
      {view === "home" ? <section className="hero" id="top" ref={heroRef} aria-labelledby="hero-title" data-background={background}>
        <div className="hero-landscape" aria-hidden="true" />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-grain" aria-hidden="true" />
        <div className="hero-frame">
          <h1 id="hero-title">Noah<br /> <em>Hova</em></h1>
          <div className="frame-bottom">
            <p>Math, AI, and a lifelong curiosity about what comes next.</p>
            <nav className="hero-links" aria-label="Connect with Noah">
              <a href="mailto:me@noahhova.com">Email <span aria-hidden="true">↗</span></a>
              <a href="https://github.com/nohov" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
            </nav>
          </div>
        </div>
      </section> : <section className="projects" id="projects" aria-labelledby="projects-title">
        <div className="projects-intro">
          <p className="projects-kicker">Selected work / 01—02</p>
          <h1 id="projects-title">Projects in <em>progress.</em></h1>
          <p>Things I’m building and learning in public.</p>
        </div>
        <div className="project-grid">
          <article className="project-card">
            <div className="project-art project-art-scav" aria-hidden="true"><span>01</span><b>SCAV<br />SCRAP</b><i>↗</i></div>
            <div className="project-copy">
              <p className="project-meta">Hardware + AI <span>In progress</span></p>
              <h2>ScavScrap</h2>
              <p>Exploring a glasses-to-PC electronics guide. A camera relay and early recognition experiment are built; the guided lesson is still in development.</p>
              <a href="https://github.com/nohov/Sightcuit" target="_blank" rel="noreferrer">Explore the repository <span aria-hidden="true">↗</span></a>
            </div>
          </article>
          <article className="project-card">
            <div className="project-art project-art-ml" aria-hidden="true"><span>02</span><b>∑<br />ML</b><i>↗</i></div>
            <div className="project-copy">
              <p className="project-meta">Machine learning <span>Ongoing practice</span></p>
              <h2>Deep-ML</h2>
              <p>Five hand-written solutions to machine learning and math problems, collected in a public repository.</p>
              <a href="https://github.com/nohov/deep-ml" target="_blank" rel="noreferrer">Explore the repository <span aria-hidden="true">↗</span></a>
            </div>
          </article>
        </div>
        <p className="projects-foot"><a href="#top">Back to home ↖</a> · More experiments on <a href="https://github.com/nohov" target="_blank" rel="noreferrer">GitHub ↗</a> · <a href="mailto:me@noahhova.com">Get in touch ↗</a></p>
      </section>}
    </main>
  </>;
}

createRoot(document.getElementById("root")).render(<App />);
