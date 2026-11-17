# Site publication history

## November 16, 2026 — `codex/shopify-editions-recreation`

The original branch first moved from `62efe92` to `a14d493` in **one push**. That event cannot be retroactively split. To make the progression inspectable without rewriting it, seven annotated tags were then published in seven individual pushes. A dedicated `codex/site-progression` branch was also advanced one commit at a time, with a separate fast-forward push for every row below:

| Branch push | Tag snapshot | Commit | Decision |
| --- | --- | --- | --- |
| 1 | `site-decision/01-white-layout` | `66b44ca` | White Home with Human and AI views; later simplified. |
| 2 | `site-decision/02-portrait-home` | `6ee4953` | Portrait-first Home and Queens reveal on text selection. |
| 3 | `site-decision/03-five-seven-frame` | `ec259af` | 5:7 image frame matching the reference. |
| 4 | `site-decision/04-cobalt-email` | `2d0adcb` | Approved cobalt artwork, optimized delivery, and Email copy feedback. |
| 5 | `site-decision/05-philosophical-bio` | `a8052ba` | AI question with Aristotle and Marcus Aurelius source links. |
| 6 | `site-decision/06-closing-question` | `2473bfd` | First revised closing question. |
| 7 | `site-decision/07-final-bio` | `a14d493` | Plain, qualified closing hunch and question. |
| 8 | — | `9c0ccd1` | Corrected the publication record and set the one-decision-per-push rule. |

The tags are stable snapshots; the progression branch shows the actual sequence of branch pushes. This documentation update is pushed afterward as a separate step. Future approved decisions should be committed, checked, and pushed one at a time.

## November 17, 2026 — progressive text highlight

`28ca508` was pushed by itself after `6a6a9a8` on `codex/shopify-editions-recreation`, then advanced `codex/site-progression` in its own fast-forward push. The selected text now reveals matching pieces of one Queens painting over 650 ms; unselected text stays on white. The crop puts visible brick and window detail under the first selected words. The production build and Chromium, Firefox, and WebKit tests passed, and independent visual QA found no term below 9.5/10. A physical iPhone long-press check remains pending because the phone was offline.

## November 17, 2026 — separate personal intro

This decision adds a short Noah introduction between the link row and the AI/philosophy paragraph. The intro names the documented math and electronics work with a lighter voice. The Queens reveal remains attached only to the second paragraph. This entry ships with the decision in one branch push.

## November 17, 2026 — full painting reveal

The earlier text-sized strips were rejected after visual review. This decision replaces them with one Queens image behind the entire AI paragraph when any of its text is selected. Only the image fades; a dark backing keeps white text legible throughout. The separate Noah intro remains plain. This correction and its tests ship together in one decision push.
