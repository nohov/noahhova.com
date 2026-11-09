# Shopify Editions Winter 2026: implementation deconstruction

Target: [Shopify Editions Winter 2026](https://www.shopify.com/editions/winter2026)  
Method: [REA](https://github.com/morluto/rea) 6.8.0, attached to the live page through Chrome DevTools Protocol on November 9, 2026. I inspected the delivered JavaScript, page data, Theatre.js state, and a publicly served GLB. This is a reconstruction of the shipped implementation, not Shopify's original source project.

## What creates the hero

The hero combines a painted texture with animated 3D assets. The page data names a [high-resolution KTX2 background](https://cdn.shopify.com/s/files/1/0951/3130/4218/files/Hero-bg-hires-optimized.ktx2?v=1787919794), two GLB variants, and [JPEG fallbacks](https://cdn.shopify.com/s/files/1/0951/3130/4218/files/herofallback.jpg?v=1764633806). The inspected [GLB variant](https://editions-winter-2026.myshopify.com/cdn/shop/3d/models/o/843b7bb45340b0c3/EW26_Hero_251207v3_compressed-optimized.glb) contains rigs for the robed figures, shopping bags, a skateboard, and a cup. Its `Scene` animation has 552 channels. The file declares Draco mesh compression and Basis Universal textures. The exact art authoring software is not exposed.

The [HeroScene module](https://cdn.shopify.com/oxygen-v2/47215/49013/102837/5000422/assets/HeroScene-D9Cb4icn.js) creates a Theatre.js sheet named `Scene`, then attaches a camera, effects, particles, lights, and each asset from the page data. It loads the [published Theatre.js state](https://cdn.shopify.com/s/files/1/0951/3130/4218/files/HeroScene.theatre-project-state_15.json?v=1787919811), whose sequence is ten units long. The state animates camera position, rotation, field of view and target; asset visibility and animation progress; lighting; bloom; and particle opacity.

## How scrolling controls it

The [Effects module](https://cdn.shopify.com/oxygen-v2/47215/49013/102837/5000422/assets/Effects-DD2ol1vW.js) first plays a five-second intro with an ease-out curve. After that, section scroll progress sets the Theatre.js sequence position. The page's [route bundle](https://cdn.shopify.com/oxygen-v2/47215/49013/102837/5000422/assets/%28_locale%29.editions.winter2026-DG12qb9q.js) maintains a section map and uses Lenis for smooth scrolling on supported devices. The camera also reacts gently to pointer position, so its motion is not solely scroll driven.

## How scenes reach the screen

The [Background renderer](https://cdn.shopify.com/oxygen-v2/47215/49013/102837/5000422/assets/Background-B_FZ-1J0.js) mounts one sticky React Three Fiber canvas behind the page's HTML content. It lazily loads scene modules, including `HeroScene` and `SidekickScene`. It renders the active and incoming scenes into separate Three.js render targets. A custom GLSL `CrossFade` effect mixes their textures using noise, a mud normal texture, edge detection, and a reveal mask. A separate effect controls bloom and an overlay. The headings, navigation and product copy are ordinary page elements over the canvas.

The [Butterflies module](https://cdn.shopify.com/oxygen-v2/47215/49013/102837/5000422/assets/Butterflies-C-faHt_p.js) also contains custom GPU particles and instanced butterflies with vertex-shader wing motion. `HeroScene` mounts these components, but their Theatre.js `enabled` settings determine whether they appear at a given moment. Other sections use Rive animations and video alongside regular HTML content.

## Performance and fallback path

The page detects GPU capability and selects low, medium or high rendering quality. It limits device pixel ratio by quality, monitors frame rate and can downgrade quality. Mobile devices and the lowest GPU tier select optimized image assets. If WebGL2 is unavailable, the renderer switches to sticky static images with opacity transitions. These paths are visible in the [route](https://cdn.shopify.com/oxygen-v2/47215/49013/102837/5000422/assets/%28_locale%29.editions.winter2026-DG12qb9q.js) and [Background renderer](https://cdn.shopify.com/oxygen-v2/47215/49013/102837/5000422/assets/Background-B_FZ-1J0.js).

## Build map

1. Prepare the painted background, rigged GLBs, compressed textures, and static fallbacks.
2. Build the accessible HTML layout and place a sticky React Three Fiber canvas behind it.
3. Give each section a scene and a Theatre.js timeline.
4. Convert measured scroll progress into timeline position; add restrained pointer response.
5. Render adjacent scenes to textures and blend them in a custom fragment shader.
6. Add GPU quality selection, frame-rate downgrade, and image fallbacks.

The published JavaScript source maps returned HTTP 404. REA's static pass parsed 22 of 24 captured scripts; two large bundles exceeded its per-script deadline. I inspected the relevant delivered bundles directly, so the findings above rely on observable code and assets, while Shopify's internal source structure and art production process remain unknown.
