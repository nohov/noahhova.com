import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import "./styles.css";

const getView = () => ["projects", "human"].includes(location.hash.slice(1)) ? location.hash.slice(1) : "home";

function App() {
  const [view, setView] = useState(getView);

  useEffect(() => {
    const syncView = () => setView(getView());
    addEventListener("hashchange", syncView);
    return () => removeEventListener("hashchange", syncView);
  }, []);

  return <>
    <header className="site-header">
      <a className="brand" href="#top" aria-current={view === "home" ? "page" : undefined}>Noah Hova<span aria-hidden="true">.</span></a>
      <nav className="site-nav" aria-label="Site">
        <a href="#projects" aria-current={view === "projects" ? "page" : undefined}>Projects</a>
        <a href="mailto:me@noahhova.com">Email <span aria-hidden="true">↗</span></a>
      </nav>
    </header>

    <main>
      {view === "home" && <section className="home page-shell" id="top" aria-labelledby="home-title">
        <div className="home-intro">
          <h1 id="home-title">Noah Hova</h1>
          <p>Math, AI, and a lifelong curiosity about what comes next.</p>
          <div className="home-actions">
            <a className="button button-primary" href="#projects">View projects <span aria-hidden="true">↗</span></a>
            <a className="button button-secondary" href="mailto:me@noahhova.com">Get in touch <span aria-hidden="true">↗</span></a>
          </div>
        </div>

        <div className="who-choice" aria-labelledby="who-title">
          <div className="who-copy">
            <p className="eyebrow">Two ways in</p>
            <h2 id="who-title">Who?</h2>
            <p>Explore the person or the structured profile.</p>
          </div>
          <nav className="choice-links" aria-label="Choose a view">
            <a href="#human" className="choice-link">
              <span className="choice-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="3.2" /><path d="M5.5 20c.5-4 2.7-6 6.5-6s6 2 6.5 6" /></svg></span>
              <span><strong>Human</strong><small>Portrait coming soon</small></span>
              <span className="choice-arrow" aria-hidden="true">↗</span>
            </a>
            <a href="/ai.html" className="choice-link choice-link-ai">
              <span className="choice-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="3" /><circle cx="4" cy="5" r="1.5" /><circle cx="20" cy="5" r="1.5" /><circle cx="4" cy="19" r="1.5" /><circle cx="20" cy="19" r="1.5" /><path d="m6 6.5 3.7 3.4m8.3-3.4-3.7 3.4M6 17.5l3.7-3.4m8.3 3.4-3.7-3.4" /></svg></span>
              <span><strong>AI</strong><small>Readable profile</small></span>
              <span className="choice-arrow" aria-hidden="true">↗</span>
            </a>
          </nav>
        </div>
      </section>}

      {view === "human" && <section className="human page-shell content-page" id="human" aria-labelledby="human-title">
        <div className="human-copy">
          <p className="eyebrow">Human view</p>
          <h1 id="human-title">Hi, I’m Noah.</h1>
          <p>Math, AI, and a lifelong curiosity about what comes next.</p>
          <a className="button button-primary" href="#projects">See my projects <span aria-hidden="true">↗</span></a>
        </div>
        <div className="portrait-placeholder" role="img" aria-label="Portrait coming soon"><span>Portrait coming soon</span></div>
      </section>}

      {view === "projects" && <section className="projects page-shell content-page" id="projects" aria-labelledby="projects-title">
        <div className="page-heading">
          <p className="eyebrow">Selected work</p>
          <h1 id="projects-title">Projects</h1>
          <p>Things I’m building and learning in public.</p>
        </div>
        <div className="project-list">
          <article className="project-row">
            <p className="project-number">01 <span>In progress</span></p>
            <div><h2>ScavScrap</h2><p>Exploring a glasses-to-PC electronics guide. A camera relay and early recognition experiment are built; the guided lesson is still in development.</p><span className="project-tag">Hardware + AI</span></div>
            <a href="https://github.com/nohov/Sightcuit" target="_blank" rel="noreferrer">View project <span aria-hidden="true">↗</span></a>
          </article>
          <article className="project-row">
            <p className="project-number">02 <span>Ongoing practice</span></p>
            <div><h2>Deep-ML</h2><p>Five hand-written solutions to machine learning and math problems, collected in a public repository.</p><span className="project-tag">Machine learning</span></div>
            <a href="https://github.com/nohov/deep-ml" target="_blank" rel="noreferrer">View project <span aria-hidden="true">↗</span></a>
          </article>
        </div>
        <p className="page-foot"><a href="#top">Back home</a> <a href="https://github.com/nohov" target="_blank" rel="noreferrer">More on GitHub</a></p>
      </section>}
    </main>
  </>;
}

createRoot(document.getElementById("root")).render(<App />);
