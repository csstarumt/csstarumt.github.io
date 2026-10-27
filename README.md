# TARUMT CSS — Interactive Tech Lab

Bright, interactive, multi-page society website built with Astro and TypeScript. Content is English and edited in Markdown. Changes are reviewed through pull requests. A separately hosted review snapshot is available at https://tarumt-css-preview.vercel.app/Css-website/; it is not automatically synchronized with this repository.

## Local preview

Requires Node.js 22.12+ and npm 9.6+.

```sh
npm ci
npm run dev -- --port 4321
```

Open **http://127.0.0.1:4321/**. Astro 7 may keep its dev server running in the background. Use `npx astro dev status`, `npx astro dev logs`, and `npx astro dev stop` to manage it.

For the production output: `npm run build`, then `npm run preview -- --port 4322`. Open http://127.0.0.1:4322/.

## Verify

```sh
npm run check
npm test
npm run build
npm run test:build
```

The tests cover event lifecycle, Malaysian time boundaries, registration closure, generated links/anchors/assets, metadata and draft exclusion. Interactive browser QA and limitations are recorded in `docs/QA.md`.

## What's here

- Home, About, Events, seven event detail pages, Gallery, Join & Contact, and a custom 404.
- Read-only, syntax-highlighted live CSS playground with Shape, Orbit, Type and Sculpture examples. Visitors use effect buttons; the code and preview update together. Includes Reset, Pause and Expand. Repeated effects replace earlier settings instead of adding endless code. Preview scripts and external resources remain blocked.
- Keyboard-accessible activity tabs, photo deck, event filters with shareable URLs, and command search (Cmd/Ctrl+K).
- Scroll reveals, animated marquee, magnetic button feedback and native cross-document view transitions where supported.
- Pause motion control and OS reduced-motion support. The playground respects both the page motion control and the device reduced-motion preference.
- Original society imagery with build-time responsive WebP versions. Local fonts retain their package licenses.

## Update content

See `docs/CONTENT-GUIDE.md`. Events live in `src/content/events/`; shared membership/contact URLs live in `src/lib/site.ts`. Keep event filenames stable: they are the public slugs.

The original `image/` directory is authoritative. The old root `index.html`, `styles.css`, and `script.js` are preserved for reference but are not the Astro site's entrypoints. The original baseline is commit `001a18e873d27c99bdf8f6281cd561554af1be65`.

## Deployment — GitHub Pages

`.github/workflows/check.yml` runs the checks above on pull requests and main pushes. It uploads `dist` as a review artifact without publishing it.

`.github/workflows/pages.yml` runs the same checks and deploys only the resulting `dist` artifact on a push to main, manual main-branch dispatch, or daily refresh (00:17 Malaysia time; GitHub schedules can be delayed). The branch guard prevents manual publication from feature branches. The build job has Pages read permission for configuration lookup; Pages write and OIDC permissions are limited to the deploy job. No custom secret is required.

Before merging the first redesign PR, a repository administrator must set **Settings → Pages → Build and deployment → Source → GitHub Actions**. The current legacy branch publishing mode serves the original root HTML and cannot publish the Astro build. Review any `github-pages` environment approval requirements as well. This change cannot be made with write-only repository access.

After merging, verify the **Deploy GitHub Pages** workflow succeeds and open https://csstarumt.github.io/ . Check the homepage playground, Events, a nested event URL, Gallery photos and mobile navigation. A passing PR check is not evidence of a live deployment.

The site is configured for the root of `https://csstarumt.github.io/`, using the `csstarumt/csstarumt.github.io` repository. For a custom domain, update Astro `site`/`base`, robots and sitemap origin together, then update and rerun the build-link check.

The independent Vercel review site has no Git integration, backend, database or CMS; it serves a manually uploaded build snapshot. See `docs/PREVIEW-DEPLOYMENT.md` for its scope.

Rollback: revert the problematic commit through a PR to main and let the Pages workflow publish the rebuilt artifact. To restore the original legacy site, a repository administrator can switch Pages Source back to **Deploy from a branch → main → / (root)**; the original root files and images remain intact. Do not reset over uncommitted work.
