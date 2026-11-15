# White site acceptance

The current branch presents a narrow Home with a large portrait slot, compact links, and one blurb, plus Projects and a standalone AI-readable profile at `/ai.html`. The dithered Noah portrait is still in Figma on his MacBook; the slot is explicitly marked until he exports it. Selecting blurb text temporarily reveals the Queens blue-hour painting behind the paragraph. The AI page uses semantic HTML and JSON-LD, and `/llms.txt` offers a plain-text summary.

Project descriptions are based on the public [ScavScrap README](https://github.com/nohov/Sightcuit/blob/main/README.md) and [Deep-ML README](https://github.com/nohov/deep-ml/blob/main/README.md). The ScavScrap guide remains in progress; its relay and early recognition experiment exist today.

Run `npm test`. It builds the production site and checks Chromium, Firefox, and WebKit at phone and desktop widths. Checks cover the white default, one visible Home view, no horizontal overflow, 44px links, Projects navigation, artwork appearing only during blurb selection, and an AI profile readable without JavaScript. An independent reviewer also inspects screenshots, keyboard/touch selection, link destinations, and page errors. The portrait and physical iPhone selection behavior remain to be verified after the asset is available.

## Physical phone check

Use Tailscale Serve for a private iPhone preview when Noah's phone is available. Check Home, long-press text selection, Projects, and AI, including touch targets and contact links. Do not use Funnel without a request for a public preview. Record when a physical phone check was unavailable.

## Previous white-layout QA, November 15, 2026

The following scores describe the previous Home with Human / AI cards, before the portrait-first redesign. They are retained for history and do not validate the current layout.

| Term | Score / 10 |
| --- | ---: |
| Composition | 9.5 |
| iPhone layout | 9.5 |
| Interaction | 9.5 |
| Accessibility and performance | 9.5 |
| Project credibility | 9.5 |

The physical iPhone check was unavailable: Tailscale showed the iOS device offline. Browser viewport tests are not a substitute for that check.
