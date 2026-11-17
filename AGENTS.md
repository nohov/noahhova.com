# Noah Hova site agent workflow

Challenge assumptions and report evidence plainly. A design score is a judgment, not proof of visual parity.

## Current scope

Build a narrow, portrait-first white Home with no header, decorative cards, or dividers: the approved 5:7 cobalt engraving from GitHub, compact links, a short personal intro, then a separate AI/philosophy blurb. Display the whole image without cropping and describe it accurately as a sculpture; Noah has not supplied a personal portrait. Selecting text in the AI blurb gradually reveals the Queens blue-hour artwork only under the selected text, across wrapped lines; selecting the intro does not. Keep Projects and the standalone AI-readable `/ai.html` and `/llms.txt` reachable. Project claims must come from public sources and distinguish prototypes from finished work.

## Roles and handoffs

1. **Visual critic (read-only):** inspect the current site and any reference. Report composition, content, navigation, and mobile gaps with concrete observations and suggested acceptance checks. Do not edit files.
2. **Implementer (single writer):** own source, styles, and acceptance tests. Resolve the critic's findings, run `npm test`, and provide the exact changed files for review.
3. **Independent QA (read-only):** review the implemented version without editing it. Run `npm test`; inspect desktop and 320–440px iPhone-sized views; check the text-selection reveal and clearing, keyboard access, links, overflow, deep links and Back, factual project copy, AI page without JavaScript, and console errors. Report evidence and scores for composition, iPhone layout, interaction, accessibility/performance, and project credibility. Identify every term below 9.5 with a reproducible issue.

Sequence: critic → implementer → independent QA → implementer fixes → independent QA retest. Keep source edits with the implementer so review stays independent. Work on the current `codex/` branch unless Noah requests another branch. No external push or deployment is implied by local review. When Noah explicitly requests publication, commit, check, and push each completed decision separately; do not batch decisions into one push or rewrite published history to simulate earlier pushes.

## Measurable release gates

- Home and Projects each show one visible main view, and every visible link has a working destination.
- `/#projects` and `/ai.html` open directly; Home and browser Back work. The AI page is readable without JavaScript and `/llms.txt` resolves.
- Home is white by default. Selecting a few blurb characters reveals Queens artwork only under those characters; extending selection reveals more of the same image, and clearing selection hides it. Reduced motion removes the reveal animation.
- No clipped title, copy, or contact controls and no horizontal overflow at 320×568, 375×667, 390×844, 430×932, 440×956, tablet, and desktop sizes.
- Primary phone navigation, contact, and project links are at least 44×44 CSS pixels, allowing one pixel for rounding.
- Production build and Chromium, Firefox, and WebKit browser tests pass with no page errors.

The Shopify Editions reference can inform visual direction. Do not claim Shopify 3D or pixel parity from these checks.

## Physical phone testing

During site development, use Tailscale Serve to check the running Vite site on Noah's iPhone when the phone is available. Start `npm run dev`, use the port Vite prints with `tailscale serve <port>`, and open the private `https://...ts.net` URL on the phone. Check Home, text selection, Projects, and `/ai.html`, navigation, and contact links. Keep the browser viewport tests above; report when a physical phone check was not possible. Use Funnel only when Noah asks for a public preview.
