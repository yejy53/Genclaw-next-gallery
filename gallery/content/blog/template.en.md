---
draft: true
title: "Research Post Template: Every Block a Long Read Needs"
summary: A placeholder post that exercises every block element the template supports. Replace the body and publish.
date: 2026-07-28
kicker: Research
variant: x3
hero: /blog/placeholder-wide.svg
heroAlt: Placeholder banner
ctaLabel: Browse the visual archive
ctaHref: /en
tags: template, typography
---

The opening paragraph carries the lede, and usually states the conclusion up front: this layout holds body text at 760px, widens media and tables to 1040px, then widens the footnote zone again to 1280px. Rhythm comes from those three column widths rather than from changes in type size.

Paragraphs sit 16px apart and sections sit 80px apart. Continuous prose reads as one block, while every second-level heading creates an unmistakable pause.

## A Section Heading Opens a New Chapter

Section headings are 28px at weight 450 — not bold. Almost nothing in the piece is bold; emphasis comes from whitespace, column width, and sequence instead of weight contrast. That is why reports set this way read quietly.

Inline elements all work: **emphasis** only lifts the weight to 450, `inline code` switches to a monospace face, and [internal links](/en) are distinguished from [external links](https://example.com), which get `target="_blank"` automatically.

### Subheadings Divide a Section

Subheadings are 22px, and the gap above them tightens to 48px so they read as part of the preceding section rather than as a new one.

- Unordered lists use a hand-drawn 6px dot instead of the browser marker
- Items sit 10px apart to stay compact
- List text matches body size exactly, with no reduction

1. Ordered lists keep their numerals
2. Use them for steps, rankings, or anything that needs to be cited by number
3. The gap between numeral and text stays fixed

> Blockquotes get a 4px accent rule on the left, a faint fill, and rounded corners on the right. Good for a conclusion, a citation, or one line that needs to be seen on its own.

## Media, Tables, and Code

A paragraph containing nothing but an image becomes a `figure` at the 1040px width, and the image's markdown title renders as its caption.

![Placeholder](/blog/placeholder-wide.svg "Figure 1. Captions are 14px at weight 330, centered beneath the media")

Tables use the same wide column and carry a horizontal scroll container, so narrow screens never blow out the layout.

| Element | Size / Line | Weight | Column |
| --- | --- | --- | --- |
| Title | 32 / 38 | 450 | 1040 |
| Section heading | 28 / 36 | 450 | 760 |
| Subheading | 22 / 28 | 450 | 760 |
| Body | 17 / 28 | 330 | 760 |
| Caption | 14 / 23 | 330 | 1040 |

Code blocks stay at body width, in a monospace face on a faint fill:

```python
def render(markdown: str) -> str:
    """Code blocks carry no syntax highlighting, only rhythm and legibility."""
    return to_html(markdown)
```

## A Note on Behavior

The vertical line at the middle right is the outline. At rest it shows only a 2px scroll-progress rail; on hover it expands into the full section list and blurs the page behind it. It hides itself on narrow screens.

## Footnotes {#footnotes}

Everything after the footnotes heading switches to a 1280px column and a serif face — the original reserves this zone for large tables and references.

1. **First footnote.** Footnote text is set in a serif face, for data sources, evaluation setups, and other notes that should read as separate from the body.
2. **Second footnote.** This zone is wide enough to hold a full comparison table.
