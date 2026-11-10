# Editions-inspired recreation: acceptance criteria

This branch adapts the Winter 2026 Editions presentation style to Noah Hova's content on one scrolling page. It uses original desktop and portrait mobile paintings, an original allegorical figure, and the site's existing dithered statue. It does not reproduce Shopify's proprietary 3D assets or shader transitions, so literal visual parity is outside this branch's scope.

Run `npm ci`, `npm run test:setup`, and `npm test`. The test command builds the production site, then runs browser and offline checks.

The browser suite checks Chromium, Firefox, and WebKit at 280×620, 320×640, 390×844, 768×1024, 1440×900, and 1920×1080. Its acceptance parameters are:

1. The hero fills the first screen, the framed title and index fit, the compact mobile scroll prompt is visible, and no horizontal overflow occurs.
2. The header remains separate from its actions; mobile figure artwork covers neither the heading nor the copy. Primary mobile tap targets measure at least 44×44 CSS pixels (one-pixel rounding tolerance).
3. Desktop and portrait mobile paintings load, the dithered statue paints nontransparent pixels, and the desktop allegorical figure loads.
4. Painting pointer movement travels at least 8 CSS pixels. Scroll travels at least 30 pixels and scales the painting at least 1.05×. The two desktop figures move independently toward each other; the mobile figure responds to pointer and scroll.
5. The hero fades into About; the figure and scroll cue disappear before the section boundary. Header color stays legible through About→Now. About→Now→Contact use continuous color transitions.
6. The full-screen menu opens, closes with Escape, and navigates to the selected chapter; the contact copy action confirms completion.
7. Reduced-motion preference removes all artwork transforms and smooth scrolling. The browser reports no uncaught page errors.
8. The production build exposes a standalone mobile app manifest with 192px and 512px icons, registers a service worker, and reloads offline after the first visit.

The independent visual review covers desktop and mobile screenshots of the hero, chapter boundaries, About, and Now. Its rubric scores composition, painting motion, figure motion, one-page flow, mobile web/PWA experience, and accessibility/performance separately. Automated checks verify behavior and layout constraints; they cannot prove pixel identity with Shopify's live page.

## Independent retest, November 9, 2026

| Term | Score / 10 |
| --- | ---: |
| Composition | 9.5 |
| Painting motion | 9.6 |
| Figure motion | 9.5 |
| One-page navigation and continuity | 9.5 |
| Mobile web/PWA | 9.6 |
| Accessibility and performance | 9.5 |

The tester independently reran the production build and all three test suites, inspected desktop and compact mobile screenshots, verified keyboard and reduced-motion behavior, and reloaded the installed web experience offline. These scores assess the Noah-branded adaptation. The tester estimated strict Shopify 3D/pixel parity at about 8/10 because this version uses 2D layers and CSS fades rather than rigged GLBs and shader transitions.
