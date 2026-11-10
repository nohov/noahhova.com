import { createRoot } from "react-dom/client";
import { useLayoutEffect, useRef } from "react";
import "./styles.css";

function App() {
  const heroRef = useRef(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
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
  }, []);

  return <>
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Noah Hova, home"><span className="brand-mark" aria-hidden="true">N</span><span>Noah Hova <small>Notes from the internet</small></span></a>
      <a className="contact-pill" href="mailto:me@noahhova.com">Get in touch</a>
    </header>

    <main>
      <section className="hero" id="top" ref={heroRef} aria-labelledby="hero-title">
        <div className="hero-landscape" aria-hidden="true" />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-grain" aria-hidden="true" />
        <div className="hero-frame">
          <p className="frame-label">An internet native from Queens</p>
          <h1 id="hero-title">Ideas<br />in <em>motion.</em></h1>
          <div className="frame-bottom">
            <p>Math, AI, and a lifelong curiosity about what comes next.</p>
            <nav className="hero-links" aria-label="Connect with Noah">
              <a href="mailto:me@noahhova.com">Email <span aria-hidden="true">↗</span></a>
              <a href="https://github.com/nohov" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
            </nav>
          </div>
        </div>
      </section>
    </main>
  </>;
}

createRoot(document.getElementById("root")).render(<App />);
