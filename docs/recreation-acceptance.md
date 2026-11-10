# Home and Projects acceptance

The current branch presents a viewport-filling Home hero with Queens blue hour as the default painting and a separate Projects view at `/#projects`. Home has a framed headline, short introduction, and direct email/GitHub links. Projects presents two verified public projects: ScavScrap is in progress, and Deep-ML is a collection of hand-written practice solutions. The site has no statue, allegorical figure, or installable app. Home painting motion is pointer and touch driven, with a subtle idle drift.

Project copy is based on the public [ScavScrap README](https://github.com/nohov/Sightcuit/blob/main/README.md) and [Deep-ML README](https://github.com/nohov/deep-ml/blob/main/README.md). ScavScrap's repository name is still `Sightcuit`; its README names the current project ScavScrap and separates working prototypes from the planned guided lesson.

Run `npm ci`, `npm run test:setup`, then `npm test`. The test command builds the production site and checks Chromium, Firefox, and WebKit at 320×568, 375×667, 390×844, 430×932, 440×956, 768×1024, and 1440×900. It checks one visible section per view, no horizontal overflow, visible hero text/links, 44px links, Queens as the default painting, all background query previews, pointer motion of at least 8px, iPhone touch response, reduced motion, direct Projects loading, Home/Back navigation, and browser errors.

An independent QA agent must also inspect desktop and iPhone-sized screenshots and report evidence for composition, painting motion, iPhone layout, interaction, accessibility/performance, and project credibility. Automated tests and subjective scores do not establish pixel or 3D parity with Shopify Editions.

## Home and Projects independent QA, November 10, 2026

`npm test` passed 3/3 after review fixes. Chromium and WebKit screenshots at desktop, 320×568, 390×844, and 440×956 showed no clipping or horizontal overflow. QA verified direct Projects loading, Home, footer return, browser Back, visible focus in Chromium, 44px phone links, and HTTP 200 for both project repositories and the GitHub profile. A README-linked Deep-ML portfolio URL returned 404, so the site links to the live repository instead. The ScavScrap card describes its working prototype and planned lesson separately.

| Term | Score / 10 |
| --- | ---: |
| Composition | 9.6 |
| Painting motion | 9.6 |
| iPhone layout | 9.5 |
| Interaction and links | 9.5 |
| Accessibility and performance | 9.5 |
| Project credibility | 9.5 |

These scores are independent visual judgments for this scope, not proof of Shopify parity or a physical-device assistive-technology audit.

## Earlier hero-only QA, November 10, 2026

| Term | Score / 10 |
| --- | ---: |
| Composition | 9.6 |
| Painting motion | 9.7 |
| iPhone layout | 9.6 |
| Interaction and links | 9.6 |
| Accessibility and performance | 9.5 |

The QA agent ran the build and Chromium/Firefox/WebKit suite, inspected screenshots at all listed sizes, and confirmed no clipping, overlap, or unwanted scrolling. Painting movement measured 19.4px across desktop pointer positions and 15.2px across WebKit iPhone taps. Reduced motion disabled animation and transform; keyboard focus reached every link. `mailto:` links were checked as intents, not as delivered email. This is not a physical-device assistive-technology audit.
