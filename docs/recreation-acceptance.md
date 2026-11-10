# Editions-inspired recreation: acceptance criteria

This branch adapts the Winter 2026 Editions presentation style to Noah Hova's content on one scrolling page. The hero uses original desktop and portrait paintings. The previously added allegorical figure, statue, and installable PWA were removed at the user's request. This is an iPhone-sized responsive website, not a separate iOS app.

Run `npm ci`, `npm run test:setup`, and `npm test`. The test command builds the production site and runs the browser suite.

The suite checks Chromium, Firefox, and WebKit at 320×568, 375×667, 390×844, 430×932, 440×956, 768×1024, and 1440×900. Acceptance parameters:

1. The hero fills the first screen. The framed title and index fit, the mobile scroll cue stays visible, and no horizontal overflow occurs.
2. The header and actions do not overlap. Primary mobile touch targets are at least 44×44 CSS pixels, allowing one-pixel rounding.
3. Desktop and portrait paintings load. No decorative figure or install manifest is rendered.
4. The painting itself responds to pointer movement by at least 8 CSS pixels and to scroll by at least 30 pixels plus at least 1.05× scale.
5. The hero fades into About with a legible header; faded hero links leave the keyboard tab order.
6. The menu opens, closes with Escape, and navigates to Now; the contact copy action confirms completion.
7. Reduced-motion preference disables the painting transform and smooth scrolling. No uncaught page errors occur.

These tests establish layout and behavior constraints. They do not establish pixel identity with Shopify's proprietary 3D presentation. Independent visual scores from the earlier figure/PWA version are superseded and must not be applied to this version.

## Independent retest, November 10, 2026

| Term | Score / 10 |
| --- | ---: |
| Composition | 9.5 |
| Painting motion | 9.5 |
| One-page navigation | 9.6 |
| iPhone layouts | 9.6 |
| Accessibility and performance | 9.5 |

The tester inspected desktop and 320–430px iPhone-sized screenshots, checked pointer/scroll painting motion, keyboard menu behavior, reduced motion, and the inert state of fully faded hero links. The production build and Chromium/Firefox/WebKit suite passed. These scores assess this responsive one-page site; they are not Shopify pixel/3D parity or a comprehensive WCAG audit.
