import { createRoot } from "react-dom/client";
import { useEffect, useRef, useState } from "react";
import "./styles.css";

const email = "me@noahhova.com";

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return undefined;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const field = document.createElement("textarea");
      field.value = email;
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(true);
  }

  return <button className="copy-email" type="button" onClick={copy}>{copied ? "Copied to clipboard" : "Copy email"}</button>;
}

function App() {
  const heroRef = useRef(null);
  const sequenceRef = useRef(null);
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    const sequence = sequenceRef.current;
    const frameContent = hero.querySelector(".hero-frame");
    const scrollCue = hero.querySelector(".scroll-prompt");
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let pointerX = 0;
    let pointerY = 0;
    let frame = 0;
    const update = () => {
      frame = 0;
      const travel = Math.max(1, sequence.offsetHeight - innerHeight);
      const progress = Math.min(1, Math.max(0, (scrollY - sequence.offsetTop) / travel));
      const mobile = innerWidth <= 600;
      hero.style.setProperty("--hero-progress", progress.toFixed(3));
      hero.style.setProperty("--painting-x", `${(-pointerX * 1.1 - progress * (mobile ? 14 : 38)).toFixed(1)}px`);
      hero.style.setProperty("--painting-y", `${(-pointerY * .9 - progress * (mobile ? 40 : 86)).toFixed(1)}px`);
      hero.style.setProperty("--painting-scale", (1 + progress * (mobile ? .07 : .14)).toFixed(3));
      frameContent.inert = progress >= .63;
      scrollCue.inert = progress >= .77;
      hero.dataset.progress = progress.toFixed(3);
      for (const section of document.querySelectorAll("main section")) {
        if (section.getBoundingClientRect().top <= innerHeight * .5) document.body.dataset.activeSection = section.id;
      }
      const active = document.body.dataset.activeSection;
      const aboutBounds = document.getElementById("about").getBoundingClientRect();
      const headerOverAbout = aboutBounds.top <= 50 && aboutBounds.bottom > 50;
      document.body.dataset.headerTone = headerOverAbout || (active === "top" && progress >= .82) ? "dark" : "light";
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const move = (event) => {
      if (reducedMotion.matches) return;
      pointerX = (event.clientX / innerWidth - .5) * 22;
      pointerY = (event.clientY / innerHeight - .5) * 14;
      schedule();
    };
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    hero.addEventListener("pointermove", move);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      hero.removeEventListener("pointermove", move);
    };
  }, []);

  useEffect(() => {
    const dialog = menuRef.current;
    if (menuOpen && !dialog.open) dialog.showModal();
    if (!menuOpen && dialog.open) dialog.close();
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  function menuNavigate(event) {
    event.preventDefault();
    const target = event.currentTarget.getAttribute("href");
    setMenuOpen(false);
    requestAnimationFrame(() => {
      document.querySelector(target)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      history.replaceState(null, "", target);
    });
  }

  return <>
    <a className="skip-link" href="#about">Skip to content</a>
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Noah Hova, back to top"><span className="brand-mark" aria-hidden="true">N</span><span>Noah Hova <small>Notes from the internet</small></span></a>
      <div className="header-actions">
        <a className="contact-pill" href="#contact">Get in touch</a>
        <button className="menu-trigger" type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-haspopup="dialog" aria-expanded={menuOpen}><span /><span /></button>
      </div>
    </header>

    <main>
      <div className="hero-sequence" ref={sequenceRef}>
      <section className="hero" id="top" ref={heroRef} aria-labelledby="hero-title" data-progress="0.000">
        <div className="hero-landscape" aria-hidden="true" /><div className="hero-shade" aria-hidden="true" /><div className="hero-grain" aria-hidden="true" /><div className="hero-exit" aria-hidden="true" />
        <div className="hero-frame">
          <p className="frame-label">An internet native from Queens</p>
          <h1 id="hero-title">Ideas<br />in <em>motion.</em></h1>
          <div className="frame-bottom">
            <p>Math, AI, and a lifelong curiosity about what comes next.</p>
            <nav className="hero-index" aria-label="Explore sections">
              <a href="#about">About <span>01</span></a><a href="#now">Now <span>02</span></a><a href="#contact">Contact <span>03</span></a>
            </nav>
          </div>
        </div>
        <span className="hero-issue" aria-hidden="true">NO. 001 / 2026</span>
        <a className="scroll-prompt" href="#about">Scroll to explore <span aria-hidden="true">↓</span></a>
      </section>
      </div>

      <section className="chapter chapter-about" id="about" aria-labelledby="about-title">
        <div className="chapter-topline"><span>01 / About</span><span>Noah Hova</span></div>
        <div className="chapter-grid">
          <h2 id="about-title">From Queens<br />to <em>everywhere.</em></h2>
          <div className="chapter-copy"><p className="chapter-lead">I grew up in Queens and study mathematics and applied math at Stony Brook University.</p><p>Most of what I know, I learned from the internet. Most of what I build lives there too.</p><a className="chapter-next" href="#now">What I’m thinking about <span aria-hidden="true">↘</span></a></div>
        </div>
        <span className="chapter-ornament" aria-hidden="true">N<span>✦</span>H</span>
      </section>

      <section className="chapter chapter-now" id="now" aria-labelledby="now-title">
        <div className="chapter-topline"><span>02 / Now</span><span>Always in progress</span></div>
        <div className="now-layout"><p className="now-kicker">A working hypothesis</p><h2 id="now-title">The next<br /><em>big shift</em><br />is already here.</h2><p>I believe AI will change society as much as earlier technological revolutions. I’m learning, building, and trying to understand what that means in practice.</p><a className="chapter-next" href="#contact">Continue the conversation <span aria-hidden="true">↘</span></a></div>
        <div className="now-orbit" aria-hidden="true"><span /></div>
      </section>

      <section className="chapter chapter-contact" id="contact" aria-labelledby="contact-title">
        <div className="chapter-topline"><span>03 / Contact</span><span>Open to conversation</span></div>
        <div className="contact-content"><p>Have an idea?</p><h2 id="contact-title">Let’s talk<br /><em>about it.</em></h2><div className="contact-row"><a className="email-link" href={`mailto:${email}`}>{email}</a><CopyEmail /></div><nav className="social-links" aria-label="Social links"><a href="https://www.linkedin.com/in/noahhova/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://x.com/NoahHova" target="_blank" rel="noreferrer">X ↗</a><a href="https://github.com/nohov" target="_blank" rel="noreferrer">GitHub ↗</a></nav></div>
        <a className="back-to-top" href="#top">Back to top ↑</a>
      </section>
    </main>

    <dialog className="site-menu" ref={menuRef} onClose={() => setMenuOpen(false)} aria-label="Site menu">
      <div className="menu-heading"><span>Noah Hova / Index</span><button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu">Close ×</button></div>
      <nav aria-label="Menu navigation"><a href="#top" onClick={menuNavigate}><span>00</span> Home <span>↗</span></a><a href="#about" onClick={menuNavigate}><span>01</span> About <span>↗</span></a><a href="#now" onClick={menuNavigate}><span>02</span> Now <span>↗</span></a><a href="#contact" onClick={menuNavigate}><span>03</span> Contact <span>↗</span></a></nav>
      <p className="menu-footer">Queens, New York · Online everywhere</p>
    </dialog>
  </>;
}

createRoot(document.getElementById("root")).render(<App />);
