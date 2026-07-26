# Implementation Notes

## Design direction
- The gallery is a clean-room recreation inspired by the dark, cinematic feel of
  Lighthouse (near-black background, a diagonal "god-ray" gradient, soft shadows,
  serif display type, centered single-image compositions). No assets, fonts, or
  code were copied from any reference site.
- Display type uses system serif fallbacks (`Iowan Old Style` / `Palatino` /
  `Georgia`) so no web fonts are downloaded. Body copy uses the system sans stack.

## Data pipeline
- `content/cases.json` is the curated, hand-authored manifest (bilingual copy,
  prompts, parameters, notes, and the private `sources` map).
- `tools/build_gallery_index.py` validates the manifest, copies only the
  explicitly listed artifacts into `public/cases/<slug>/`, and writes
  `generated/cases.json` (consumed by the app) plus `generated/index-report.json`
  (an audit of what was published). Run logs, metadata, and credentials are never
  copied.
- Only `.html`, `.png`, `.jpg`, `.jpeg`, `.webp`, and `.svg` files can be
  published; sources are constrained to the repository root.

## Recovery event (2026-07)
- An external drive unmounted mid-session and destroyed the uncommitted gallery
  source (React components, pages, `lib/gallery.ts`, `content/cases.json`, and the
  index tool). The surviving `out/` build and `generated/index-report.json` were
  used to reconstruct the bilingual case data and source mapping, and the rebuild
  was combined with the dark redesign. Commit early and often to avoid a repeat.

## Known limitations
- Model versioning is recorded loosely as "Gemini · configured backend" because
  the exact backend is defined in `config.yaml` and may change; results are frozen
  regardless of which model produced them.
- HTML results are shown in a sandboxed `<iframe>` (`allow-scripts
  allow-same-origin`). Pages that require network access or a specific origin may
  render differently than in their original runtime.
- Static export (`output: "export"`) means there is no server; the "coding agent
  comparison" only compares pre-generated, frozen outputs and never runs live
  generation.
- `npm audit` may report advisories from transitive dev dependencies; they do not
  affect the exported static site.
