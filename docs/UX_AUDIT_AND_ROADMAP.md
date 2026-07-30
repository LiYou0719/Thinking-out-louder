# UX audit and implementation roadmap

Last updated: 2026-07-30

This document is the source of truth for the reading-experience redesign. It keeps high-ROI opportunities, implementation order, and completed work in one place.

## Baseline

- Five long-form essays, approximately 1,800–4,200 words each.
- Articles contain enough H2/H3 structure to benefit from section navigation.
- Current presentation is based on the default Cayman project-page theme.
- The existing article shell has no table of contents, reading progress, reading time, previous/next navigation, or dedicated mobile reading controls.
- Existing body typography is Open Sans at 16–17.6px, line-height 1.5, with a comparatively wide desktop measure.
- The canonical domain and internal links are split between `guanjie.li` and `liyou0719.github.io`.

## ROI-ranked opportunities

| Priority | Opportunity | Experience impact | Effort | ROI | Status |
| --- | --- | --- | --- | --- | --- |
| P0 | Improve reading measure, type size, line-height, and paragraph rhythm | Very high | XS | Very high | Complete |
| P0 | Replace the large gradient project banner with an editorial article header | Very high | S | Very high | Complete |
| P0 | Establish reusable color, typography, spacing, and surface tokens | High | XS | Very high | Complete |
| P0 | Remove GitHub-template header/footer language | Medium-high | XS | Very high | Complete |
| P0 | Unify canonical URLs and internal links on `guanjie.li` | Medium | XS | Very high | Complete |
| P0 | Load MathJax only on articles that contain equations | Medium, especially mobile | XS | Very high | Complete |
| P1 | Add a sticky desktop table of contents with active-section tracking | Very high | M | High | Complete |
| P1 | Add a reading progress indicator | High | S | High | Complete |
| P1 | Add a compact mobile table of contents | High | S–M | High | Complete |
| P1 | Add date and reading-time metadata | Medium-high | XS–S | High | Complete |
| P1 | Add heading anchors, active states, and return-to-opening support | Medium-high | S | High | Complete |
| P2 | Upgrade the writing index from a plain link list | High | S–M | High | Complete: initial editorial index |
| P2 | Add unambiguous chronological article navigation | Medium-high | S | High | Complete |
| P2 | Reuse TLDR/lead copy as discovery summaries | High | XS–S | High | Complete |
| P2 | Improve chart behavior for touch, small screens, and assistive technology | High but localized | M | Medium-high | Planned |
| P3 | Add dark mode, search, tags, and richer motion | Medium-low | M–L | Low | Backlog |
| Avoid | Migrate frameworks solely for the redesign | Low | Very high | Very low | Not planned |

## Implementation phases

### Phase 1 — Reading foundation

- [x] Adopt Instrument Sans as the core brand and reading typeface.
- [x] Define tokens so the article body can later switch to a serif without changing components.
- [x] Set a comfortable article measure, type scale, line-height, and vertical rhythm.
- [x] Replace the Cayman banner with a compact personal-site header and editorial article header.
- [x] Restyle TLDR blocks, links, headings, figures, tables, and code.
- [x] Replace the generated-by-GitHub footer.
- [x] Add date and calculated reading time.
- [x] Use `guanjie.li` for canonical and internal URLs.
- [x] Load MathJax only on posts that explicitly opt in with `math: true`.
- [x] Verify the Jekyll build and responsive CSS.

### Phase 2 — Orientation and progress

- [x] Generate a table of contents from H2/H3 headings.
- [x] Add sticky desktop section navigation.
- [x] Track the active section with `IntersectionObserver`.
- [x] Add a page-level reading progress bar.
- [x] Add a compact mobile “On this page” control.
- [x] Hide the table of contents when an article has fewer than three eligible headings.

### Phase 3 — Discovery and content components

- [x] Add `Published earlier` / `Published later` navigation with dates, titles, and summaries.
- [x] Reuse TLDR or opening copy for index and navigation summaries without duplicating front matter.
- [ ] Improve interactive-chart touch behavior and provide an accessible fallback.
- [ ] Refine the writing index around themes and series as the archive grows.
- [ ] Consider series navigation once the archive is large enough to support stable groupings. (Deferred by design.)

## Typography decision

Serif is not a requirement for comfortable long-form reading. Phase 1 uses Instrument Sans throughout because it is more suitable for body copy than Montserrat while retaining some of the approachable, precise character associated with Avenir. Typography roles are tokenized:

- `--font-brand` for identity and navigation
- `--font-reading` for article copy
- `--font-mono` for data and code

Initially, `--font-brand` and `--font-reading` both resolve to Instrument Sans. A future article-only serif can be introduced by changing `--font-reading`, preserving the site's overall hierarchy and components.

## Progress log

### 2026-07-30

- Completed the initial repository and reading-experience audit.
- Agreed to prioritize small-engineering, high-impact improvements before advanced features.
- Selected Instrument Sans as the Phase 1 working typeface; serif remains an optional article-level direction.
- Started Phase 1 on branch `codex/reading-experience-phase-1`.
- Completed the Phase 1 reading foundation and initial writing-index treatment.
- Verified a successful Jekyll 3.10 build, responsive breakpoint rules, canonical URLs, calculated reading times, and conditional MathJax loading.
- Clarified article navigation by replacing the repeated publication kicker with an explicit `← All writing` link.
- Refined the writing-index introduction to use a colon rather than an em dash.
- Started Phase 2: responsive table of contents, active-section tracking, and article reading progress.
- Completed Phase 2 with a sticky desktop TOC, responsive mobile `On this page` control, active-section labels, and an article-level progress bar.
- Verified all five essays expose 5–8 eligible headings, the navigation script passes syntax checks, and generated pages include the expected responsive navigation structure.
- Added an automatic `Overview` section when meaningful content exists before the first H2, keeping desktop and mobile TOCs consistent and making the opening content directly reachable.
- Started the discovery and continuity pass: TLDR-derived summaries plus explicit chronological navigation. Series UI is deferred until the archive grows.
- Completed chronological article navigation. `Published earlier` always points to an older publication date; `Published later` always points to a newer one.
- Added TLDR-derived summaries to the writing index and navigation cards. The earliest essay currently has no TLDR in source, so it correctly falls back to opening copy.
- Replaced mechanically extracted TLDR sentences with five hand-authored editorial deks. Article headers, the writing index, and chronological navigation now share the same concise framing; first-sentence extraction remains only as a fallback for future posts without a description.
- Reviewed and incorporated the author-edited deks, including broader measurement framing for the evaluation essay and parallel phrasing for the transcript-retrieval essay.
- Removed the two-line clamp from chronological navigation cards so each `Published earlier` / `Published later` option presents its complete dek. The writing index remains compact, while end-of-article navigation prioritizes an informed next-read decision.
- Tightened the evaluation essay dek so its full premise remains visible in the compact writing index.

## ROI completion snapshot

As of 2026-07-30:

- 14 of 14 opportunities rated **High** or **Very high ROI** are complete.
- The remaining chart touch/accessibility work is rated **Medium-high ROI** because it materially improves one article but does not affect the whole archive.
- Dark mode, search, tags, richer motion, and framework migration remain intentionally deferred because their current return is low.
- Series navigation remains intentionally deferred until the archive is large enough to support meaningful, stable groupings.
