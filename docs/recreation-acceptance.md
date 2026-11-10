# Hero-only acceptance

The current branch presents one viewport-filling hero. It has a desktop and portrait painting, a framed headline, short introduction, and direct email/GitHub links. It has no later chapters, menu, scroll cue, statue, allegorical figure, or installable app. Painting motion is pointer and touch driven, with a subtle idle drift; scroll choreography will make sense only after another section exists.

Run `npm ci`, `npm run test:setup`, then `npm test`. The test command builds the production site and checks Chromium, Firefox, and WebKit at 320×568, 375×667, 390×844, 430×932, 440×956, 768×1024, and 1440×900. It checks one-section structure, valid links, no page overflow, visible text/links, 44px contact targets, pointer motion of at least 8px, iPhone touch response, reduced motion, and browser errors.

An independent QA agent must also inspect desktop and iPhone-sized screenshots and report evidence for composition, painting motion, iPhone layout, interaction, and accessibility/performance. Automated tests and subjective scores do not establish pixel or 3D parity with Shopify Editions.

## Independent QA, November 10, 2026

| Term | Score / 10 |
| --- | ---: |
| Composition | 9.6 |
| Painting motion | 9.7 |
| iPhone layout | 9.6 |
| Interaction and links | 9.6 |
| Accessibility and performance | 9.5 |

The QA agent ran the build and Chromium/Firefox/WebKit suite, inspected screenshots at all listed sizes, and confirmed no clipping, overlap, or unwanted scrolling. Painting movement measured 19.4px across desktop pointer positions and 15.2px across WebKit iPhone taps. Reduced motion disabled animation and transform; keyboard focus reached every link. `mailto:` links were checked as intents, not as delivered email. This is not a physical-device assistive-technology audit.
