# GenClaw-Next Visual Archive

A static gallery of generative visual experiments — interactive web pages, posters,
slides, and infographics. Each case keeps its original prompt, the model and
parameters used, and a frozen, reproducible result. Web cases are embedded as live
pages, so 3D models and looping video run in the browser rather than as screenshots.

The site is a fully static Next.js export: there is no server, no live generation,
and no credentials involved.

## Local development

```bash
cd gallery
npm install
npm run dev            # http://localhost:3000
```

Other useful scripts, all run from `gallery/`:

```bash
npm run build          # static export into gallery/out
npm run typecheck
npm run lint
npm run index          # rebuild the public case index from content/cases.json
```

To preview the production build exactly as it is deployed:

```bash
npm run build
python3 -m http.server 8000 --directory out
```

## Updating content

`gallery/content/cases.json` is the curated manifest. `npm run index` copies the
referenced sources into `gallery/public/cases/` and regenerates
`gallery/generated/cases.json`, which the app reads at build time.

Cases whose sources are not present on the current machine are skipped and their
already-published output under `gallery/public/cases/` is preserved, so the index
can be rebuilt on a checkout that does not carry the private source tree.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the static
export and publishes it to GitHub Pages.

One-time setup in the repository: **Settings → Pages → Build and deployment →
Source: GitHub Actions**.

The base path is resolved automatically. `actions/configure-pages` reports the path
the site is served from, which is passed to the build as `NEXT_PUBLIC_BASE_PATH`.
A project site (`https://<user>.github.io/<repo>/`) therefore works without editing
any configuration, and so does a user site or a custom domain at the root.

### Why paths are prefixed by hand

`next/link` applies the base path on its own, but `next/image` with `unoptimized`
and raw `iframe` / `img` / `a` targets do not. Published asset paths are therefore
routed through `assetUrl()` in `gallery/lib/gallery.ts`. New code that points at
anything under `/cases/` should use it too.

`gallery/public/.nojekyll` is required: without it GitHub Pages runs Jekyll, which
skips underscore-prefixed directories and would drop the entire `_next/` bundle.

## Note on size

The 3D cases ship uncompressed GLB models (roughly 40 MB each, about 280 MB total).
That is within GitHub's 100 MB per-file limit, but it makes the repository heavy and
a single 3D case view transfers over 100 MB. Running the models through Draco or
meshopt compression would cut this by close to an order of magnitude.
