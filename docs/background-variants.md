# Archived hero background candidates

These assets document an earlier direction. The current white site does not load them or offer background query previews.

Queens blue hour was the default Home painting in the earlier version. The original pastoral painting, cloud ridgeline, and ink topography were query previews. Each new direction has a separately art-directed desktop and portrait image. All six new JPGs were generated with the built-in imagegen tool, then optimized to 169–253 KB per file. The JPGs live in [`src/assets/background-variants`](../src/assets/background-variants).

| Direction | Desktop preview | iPhone preview | Rationale |
| --- | --- | --- | --- |
| Original pastoral | [Desktop](background-previews/original-desktop.jpg) | [iPhone](background-previews/original-iphone.jpg) | Earlier painting; cinematic but little direct connection to Queens. |
| Cloud ridgeline | [Desktop](background-previews/cloud-desktop.jpg) | [iPhone](background-previews/cloud-iphone.jpg) | Closest to the earlier atmosphere, with simpler open space. |
| Queens blue hour | [Desktop](background-previews/queens-desktop.jpg) | [iPhone](background-previews/queens-iphone.jpg) | Interpretive original artwork, not an exact geographic depiction. |
| Ink topography | [Desktop](background-previews/topographic-desktop.jpg) | [iPhone](background-previews/topographic-iphone.jpg) | Quiet abstract terrain suggested mathematical curiosity. |

The following QA notes describe the archived painting implementation. Current tests cover the white design in [recreation-acceptance.md](recreation-acceptance.md).

## Independent QA

The production build and both browser suites passed (`npm test`: 2/2). All four backgrounds fit desktop and iPhone frames. After a topographic desktop shade adjustment, its composition and legibility both scored 9.5/10; the other tested functional and visual terms scored at least 9.5/10. These scores do not establish Shopify pixel or 3D parity.

Personal relevance is a separate judgment. QA scored the original pastoral scene 8.0, cloud ridgeline 7.6, Queens blue hour 9.2, and ink topography 8.5 out of 10. Queens is the strongest fit to the known Queens biography, but Noah should choose the direction. None of these scores is evidence that the artwork depicts a specific real location.

## Exact imagegen prompts

The existing pastoral image was not regenerated. The following prompts produced the six new originals (one built-in call per asset).

### Cloud ridgeline: desktop

```text
Use case: stylized-concept. Asset type: original desktop website hero background, wide 16:9 landscape composition. Primary request: an atmospheric painterly cloud-and-ridgeline study, calm blue-green dawn, soft layered mountain silhouettes and low dark foreground, broad quiet sky occupying upper two thirds for white typography. Medium: richly textured contemporary oil painting, refined brushwork, not a copy of any existing artwork. Composition: distant horizon in lower third, main visual interest toward edges and bottom, center-left and lower-left areas dark and uncluttered enough for overlaid white title and links; art-directed specifically for a wide browser viewport. Subtle depth and warm light in clouds, restrained palette. No people, figures, statues, flags, buildings, monuments, westward-frontier motifs, text, logos, watermarks, circuit patterns, or UI elements. Output image only.
```

### Cloud ridgeline: portrait

```text
Use case: stylized-concept. Asset type: original portrait mobile website hero background, 9:16 composition paired with a blue-green atmospheric ridgeline desktop variant. Primary request: a quiet painterly sky at dawn with soft clouds and distant layered mountain ridges in the bottom third. Medium: richly textured contemporary oil painting, refined brushwork, original artwork. Composition: vertical phone viewport, expansive calm sky occupying upper two thirds; darker low foreground supports white copy near bottom; no defining forms lost when cropped to 390x844. Restrained teal, slate, and warm amber cloud light. No people, figures, statues, flags, buildings, monuments, frontier motifs, text, logos, watermarks, circuit patterns, or UI. Output image only.
```

### Queens blue hour: desktop

```text
Use case: stylized-concept. Asset type: original desktop website hero background, wide 16:9 composition. Primary request: a painterly Queens, New York low-rise neighborhood at blue hour, viewed from a rooftop: modest brick apartment buildings and row houses, water towers only if subtle, leafy street trees, a broad luminous indigo sky. Medium: richly textured contemporary oil painting, atmospheric but grounded in everyday Queens, not a famous landmark. Composition: rooftops and tree canopy occupy lower third, calm dark sky upper two thirds, dark and uncluttered area behind a framed white headline near center-left and white links near lower-center. No people, figures, statues, flags, triumphal arches, monuments, Manhattan skyline, frontier imagery, text, logos, watermarks, circuit patterns, or UI. Output image only.
```

### Queens blue hour: portrait

```text
Use case: stylized-concept. Asset type: original portrait mobile website hero background, 9:16 companion to a Queens New York blue-hour rooftop desktop variant. Primary request: painterly outer-borough Queens rooftops and leafy street trees viewed at blue hour under an expansive indigo and muted rose sky. Medium: richly textured contemporary oil painting, everyday neighborhood character without caricature or landmark. Composition: quiet sky occupies upper two thirds for a framed white headline; low-rise brick roofs and foliage appear in lower third but remain dark and simple behind white copy and links. Art-directed for 390x844 phone frame; no subject cutoff. No people, figures, statues, flags, triumphal arches, monuments, Manhattan skyline, frontier imagery, text, logos, watermarks, circuit patterns, or UI. Output image only.
```

### Ink topography: desktop

```text
Use case: stylized-concept. Asset type: original desktop website hero background, wide 16:9. Primary request: a restrained abstract topographic terrain made with deep indigo ink, charcoal mineral wash, and subtle hand-drawn contour lines. No literal map labels, no circuit board. Medium: fine-art ink and gouache on textured paper, atmospheric and tactile. Composition: large calm nearly-black navy upper two thirds and center-left for white framed typography; layered flowing terrain ridges and gently curving contour lines gather in the lower third and toward right edge, creating quiet depth. The image should feel like mathematical curiosity expressed through landscape, not an infographic. No people, figures, statues, flags, monuments, westward frontier motifs, buildings, text, logos, watermarks, UI, glowing AI iconography, grids, or circuitry. Output image only.
```

### Ink topography: portrait

```text
Use case: stylized-concept. Asset type: original portrait mobile website hero background, 9:16 companion to dark abstract topographic ink desktop hero. Primary request: deep indigo ink and charcoal mineral wash forming soft layered terrain, with barely-visible hand-drawn contour lines flowing through lower third. Medium: fine-art ink and gouache on textured paper, tactile and restrained. Composition: portrait phone art direction with calm dark navy upper two thirds and center-left for white headline, darker simple lower third for white links, visual topography legible but not busy at 390x844. Math connection should be subtle and organic, not literal data art. No people, figures, statues, flags, monuments, westward frontier motifs, buildings, text, logos, watermarks, UI, grids, or circuitry. Output image only.
```
