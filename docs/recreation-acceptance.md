# Editions-inspired recreation: acceptance criteria

This branch adapts the Winter 2026 Editions presentation style to Noah Hova's content. It uses original artwork and the site's existing dithered statue. It does not reproduce Shopify's proprietary 3D assets or shader transitions, so literal visual parity is outside this branch's scope.

Run `npm ci`, `npm run test:setup`, `npm test`, and `npm run build`.

The browser suite checks Chromium, Firefox, and WebKit at 320×640, 390×844, 768×1024, 1440×900, and 1920×1080. Its acceptance parameters are:

1. The hero fills at least the viewport height, the framed title and index fit, and no horizontal overflow occurs.
2. The header remains separate from its actions, and the mobile statue does not cover the hero copy.
3. The landscape loads and the dithered statue paints nontransparent pixels.
4. Pointer movement changes the statue transform; scrolling advances the hero progress value and active chapter.
5. The full-screen menu opens, closes with Escape, and navigates to the selected chapter; the contact copy action confirms completion.
6. Reduced-motion preference removes the artwork transforms and smooth scrolling.
7. The browser reports no uncaught page errors.

The visual review also covers desktop and mobile screenshots of the hero, About, and Now chapters. The suite verifies behavior and layout constraints; it cannot prove pixel identity with Shopify's live page.
