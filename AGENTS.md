# Noah Hova site agent workflow

Challenge assumptions and report evidence plainly. A design score is a judgment, not proof of visual parity.

## Current scope

Build a restrained white personal site with Home, Projects, and Human views plus a standalone AI-readable profile at `/ai.html` and a plain-text `/llms.txt`. Home has a Human / AI choice near its bottom. The Human page reserves a portrait slot until Noah supplies his photo; do not substitute an invented portrait. Keep direct contact and responsive iPhone-sized web layout. Do not reintroduce painting, background variants, decorative figures, or an installable app unless Noah changes the scope. Project claims must come from public sources and distinguish prototypes from finished work. The AI page is structured source content, not a vector-search or chat product.

## Roles and handoffs

1. **Visual critic (read-only):** inspect the current site and any reference. Report composition, content, navigation, and mobile gaps with concrete observations and suggested acceptance checks. Do not edit files.
2. **Implementer (single writer):** own source, styles, and acceptance tests. Resolve the critic's findings, run `npm test`, and provide the exact changed files for review.
3. **Independent QA (read-only):** review the implemented version without editing it. Run `npm test`; inspect desktop and 320–440px iPhone-sized views; check Human / AI choices, keyboard access, contact and project links, overflow, deep links and Back, factual project copy, AI page without JavaScript, and console errors. Report evidence and scores for composition, iPhone layout, interaction, accessibility/performance, and project credibility. Identify every term below 9.5 with a reproducible issue.

Sequence: critic → implementer → independent QA → implementer fixes → independent QA retest. Keep source edits with the implementer so review stays independent. Work on the current `codex/` branch unless Noah requests another branch. No external push or deployment is implied by local review.

## Measurable release gates

- Home, Human, and Projects each show one visible main view, and every visible link has a working destination.
- `/#projects`, `/#human`, and `/ai.html` open directly; Home and browser Back work. The AI page is readable without JavaScript and `/llms.txt` resolves.
- Home and Projects have white backgrounds, with no painting image request or painting animation.
- No clipped title, copy, or contact controls and no horizontal overflow at 320×568, 375×667, 390×844, 430×932, 440×956, tablet, and desktop sizes.
- Primary phone navigation, contact, and project links are at least 44×44 CSS pixels, allowing one pixel for rounding.
- Production build and Chromium, Firefox, and WebKit browser tests pass with no page errors.

The Shopify Editions reference can inform visual direction. Do not claim Shopify 3D or pixel parity from these checks.

## Physical phone testing

During site development, use Tailscale Serve to check the running Vite site on Noah's iPhone when the phone is available. Start `npm run dev`, use the port Vite prints with `tailscale serve <port>`, and open the private `https://...ts.net` URL on the phone. Check Home, Human, Projects, and `/ai.html`, navigation, and contact links. Keep the browser viewport tests above; report when a physical phone check was not possible. Use Funnel only when Noah asks for a public preview.
