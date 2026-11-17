# White site acceptance

The current branch presents a narrow Home with Noah's approved cobalt engraving from GitHub, compact links, a short personal intro, and a separate AI/philosophy blurb, plus Projects and a standalone AI-readable profile at `/ai.html`. The image is a dithered sculpture, not a personal portrait. Browsers that support AVIF receive a 248 KB version; the original PNG remains the fallback. Selecting any AI-blurb text fades the Queens blue-hour painting behind the entire paragraph; selecting the intro does not. The AI page uses semantic HTML and JSON-LD, and `/llms.txt` offers a plain-text summary.

Project descriptions are based on the public [ScavScrap README](https://github.com/nohov/Sightcuit/blob/main/README.md) and [Deep-ML README](https://github.com/nohov/deep-ml/blob/main/README.md). The ScavScrap guide remains in progress; its relay and early recognition experiment exist today.

Run `npm test`. It builds the production site and checks Chromium, Firefox, and WebKit at phone and desktop widths. Checks cover the white default, the full 1080×1512 image, one visible Home view, no horizontal overflow, 44px controls, Projects navigation, Email copying with visible feedback, full-paragraph artwork fade from even a short AI-blurb selection, and an AI profile readable without JavaScript. An independent reviewer also inspects screenshots, keyboard/touch selection, link destinations, and page errors. Physical iPhone selection behavior remains to be verified when the phone is available.

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
