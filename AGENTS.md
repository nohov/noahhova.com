# Noah Hova site agent workflow

Challenge assumptions and report evidence plainly. A design score is a judgment, not proof of visual parity.

## Current scope

Build and refine one viewport-filling hero only. Keep the painting, headline, short introduction, direct contact, and responsive iPhone-sized web layout. Do not add other sections, a menu, a scroll cue, an installable app, a statue, or allegorical figure unless Noah changes the scope.

## Roles and handoffs

1. **Visual critic (read-only):** inspect the current hero and any reference. Report composition, motion, content, and mobile gaps with concrete observations and suggested acceptance checks. Do not edit files.
2. **Implementer (single writer):** own source, styles, and acceptance tests. Resolve the critic's findings, run `npm test`, and provide the exact changed files for review.
3. **Independent QA (read-only):** review the implemented version without editing it. Run `npm test`; inspect desktop and 320–440px iPhone-sized views; check touch, pointer, reduced motion, keyboard access, contact links, overflow, and console errors. Report evidence and scores for composition, painting motion, iPhone layout, interaction, and accessibility/performance. Identify every term below 9.5 with a reproducible issue.

Sequence: critic → implementer → independent QA → implementer fixes → independent QA retest. Keep source edits with the implementer so review stays independent. Work on the current `codex/` branch unless Noah requests another branch. No external push or deployment is implied by local review.

## Measurable release gates

- Exactly one `<main>` section, and every visible link has a working destination.
- No clipped title, copy, or contact controls and no horizontal overflow at 320×568, 375×667, 390×844, 430×932, 440×956, tablet, and desktop sizes.
- Primary phone links are at least 44×44 CSS pixels, allowing one pixel for rounding.
- Painting position changes by at least 8 CSS pixels under pointer and iPhone touch input; reduced motion disables its animation and transform.
- Production build and Chromium, Firefox, and WebKit browser tests pass with no page errors.

The Shopify Editions reference can inform visual direction. Do not claim Shopify 3D or pixel parity from these checks.
