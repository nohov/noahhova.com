import { createRoot } from 'react-dom/client'
import './styles.css'
import './font.css'

const courses = ['AMS 261 · Applied Calculus III', 'AMS 301 · Finite Mathematical Structures', 'ECO 110 · Introduction to Microeconomics', 'ECO 305 · Intermediate Macroeconomic Theory']

function App() {
  return <main>
    <header className="site-header">
      <a className="logo" href="#top">Noah<span>Hova</span></a>
      <nav aria-label="Primary navigation"><a href="#about">About</a><a href="#work">Work</a><a href="#now">Now</a></nav>
      <a className="connect" href="mailto:hello@noahhova.com">Connect <span>↗</span></a>
    </header>

    <section className="intro" id="top">
      <h1>Hi, I’m <span>Noah.</span></h1>
      <p className="lede">I study Applied Mathematics &amp; Statistics and Economics. I’m interested in finance, data, and software that helps people make better decisions.</p>
    </section>

    <section className="grid" id="about" aria-label="About Noah Hova">
      <article className="card card-about"><p className="label">About</p><h2>Building quantitative judgment, one real problem at a time.</h2><p>I’m drawn to the space where rigorous analysis meets useful products: finance, data, and human-centered software.</p></article>
      <article className="card card-school"><p className="label">Education</p><div className="sbu-mark">SBU</div><h2>Stony Brook University</h2><p>B.S. Applied Mathematics &amp; Statistics + Economics</p><small>Expected graduation · Spring 2029</small></article>
      <article className="card card-focus"><p className="label">Current focus</p><strong>Fintech<br/>Data<br/>Software</strong><p>Looking for hard, high-leverage problems worth learning from.</p></article>
      <article className="card card-fourier" id="work"><p className="label">2025 → now</p><h2>Fourier Fund</h2><p className="role">Investment Research Analyst</p><p>I build DCF and comparable-company models, research businesses, and contribute to buy/sell recommendations.</p><div className="mini-chart" aria-hidden="true"><i/><i/><i/><i/><svg viewBox="0 0 240 90"><path d="M0 76 L39 62 L70 70 L109 31 L147 47 L191 11 L240 27"/></svg></div></article>
      <article className="card card-respeak"><p className="label">2026 → now</p><span className="speech-mark">↗</span><h2>Respeak Therapy</h2><p className="role">Founder &amp; Developer</p><p>A speech-therapy app for adults with aphasia and stuttering, built with input from a licensed speech-language pathologist.</p></article>
      <article className="card card-lab"><p className="label">The lab</p><div className="formula">Σ<br/><span>f(x)</span></div><p>My coursework includes numerical analysis, data analysis, linear algebra, optimization, and numerical methods.</p></article>
      <article className="card card-courses" id="now"><p className="label">Fall 2026</p><h2>What I’m studying now</h2><ul>{courses.map((course) => <li key={course}>{course}</li>)}</ul></article>
      <article className="card card-lyon"><p className="label">2023</p><div className="location-mark">LYON<br/>FR</div><h2>AI Club Stony Brook University</h2><p className="role">Off-Cycle Business Analyst</p><p>Worked on brokerage and retail-banking process analysis in Lyon, France.</p></article>
      <article className="card card-next"><p className="label">Next</p><h2>Summer 2027</h2><p>Actively preparing for fintech internships, with New York City, San Francisco, and London as priority markets.</p><a href="mailto:hello@noahhova.com">Start a conversation <span>→</span></a></article>
    </section>
    <footer><span>© {new Date().getFullYear()} Noah Hova</span><span>Built from real work · <a href="#top">Back to top ↑</a></span></footer>
  </main>
}
createRoot(document.getElementById('root')).render(<App />)
