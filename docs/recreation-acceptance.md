# White site acceptance

The current branch presents a white, type-led Home, a Projects view, a Human view with a clearly marked portrait placeholder, and a standalone AI-readable profile at `/ai.html`. Home places Human and AI choices near its bottom. The AI page uses semantic HTML and JSON-LD, and `/llms.txt` offers a plain-text summary. These are structured public facts, not vector embeddings or a chat endpoint. Noah will provide the portrait later.

Project descriptions are based on the public [ScavScrap README](https://github.com/nohov/Sightcuit/blob/main/README.md) and [Deep-ML README](https://github.com/nohov/deep-ml/blob/main/README.md). The ScavScrap guide remains in progress; its relay and early recognition experiment exist today.

Run `npm test`. It builds the production site and checks Chromium, Firefox, and WebKit at 320×568, 375×667, 390×844, 430×932, 440×956, 768×1024, and 1440×900. Checks cover white surfaces, no painting/image request, one visible Home view, no Home scroll or horizontal overflow, 44px links, Human and Projects deep links, browser Back, and an AI profile readable without JavaScript. An independent reviewer also inspects screenshots, keyboard focus, link destinations, and page errors. Review scores are judgments about this scope, not proof of resemblance to Ramp or Slow Ventures.

## Physical phone check

Use Tailscale Serve for a private iPhone preview when Noah's phone and the Tailscale CLI are available. Check Home, Human, Projects, and AI views, including touch targets and contact links. Do not use Funnel without a request for a public preview. Record when a physical phone check was unavailable.

## Independent QA, November 15, 2026

The production build and three browser tests pass. Independent QA inspected Home at 320×568 through 1440×900 and the other views at phone and desktop widths. It found no clipping, horizontal overflow, painting requests, or page errors. All checked links meet the 44px phone target; small label contrast is at least 4.91:1. The AI page and `/llms.txt` respond without JavaScript. Home, Human, Projects, AI, and Back navigation work.

| Term | Score / 10 |
| --- | ---: |
| Composition | 9.5 |
| iPhone layout | 9.5 |
| Interaction | 9.5 |
| Accessibility and performance | 9.5 |
| Project credibility | 9.5 |

The physical iPhone check was unavailable: Tailscale showed the iOS device offline. Browser viewport tests are not a substitute for that check.
