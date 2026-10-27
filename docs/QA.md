# Local verification — 13 October 2026

Scope: local Astro production output on port 4322, base path `/Css-website/`. No push, deployment or remote settings change.

## Automated checks

- `npm run check`: 27 files, zero errors, warnings or hints.
- `npm test`: six event lifecycle/date/registration tests passed.
- `npm run build`: static output generated successfully.
- `npm run test:build`: 13 HTML pages and 436 local links/assets/anchors passed; metadata, draft exclusion and archived registration checked.
- Original tracked root source and image files have no changes.

## Browser checks

Performed in the Codex in-app browser against the production build:

- Home visual review at desktop and mobile sizes; no horizontal overflow at 360, 390, 768, 1024 and 1440 CSS pixels.
- Code/Connect shapes, static-mode rendering after navigation, arrow-key rotation and reset exercised. A blank canvas on returning with motion paused was found and fixed by drawing static frames synchronously.
- Motion toggle pauses decorative motion and persists between page navigations.
- Activity tabs switch panel content and matching archive links.
- Photo deck Next changes the active photo and live count.
- Search for GitHub returns two archives; ArrowDown and Enter opens the selected event.
- Mobile navigation opens; Escape closes it and returns focus.
- Upcoming filter produces zero-event state; Reset restores all seven. Workshop shows three. Browser Back restores all seven and the URL state.
- Archive detail displays the ended-event message and photo-album link.
- All six original photo-album destinations were opened read-only and matched their intended titles in the signed-in browser session.

## Limits and follow-up before public release

No Lighthouse score, measured frame-rate claim, automated accessibility audit, full Safari/Firefox matrix, real-phone test or anonymous album-access verification is claimed. OS reduced-motion and no-JavaScript fallbacks are implemented and source-reviewed; browser runtime tests used the manual motion control. Membership form validity and draft-event details still need committee confirmation (see CONTENT-AUDIT.md). Static HTML/link checks do not validate every external destination.

## Local preview

`npm run preview -- --port 4322` serves the tested build at http://127.0.0.1:4322/Css-website/ . To stop it: `npx astro preview stop`.

## Homepage playground integration

The approved Live Code Playground replaces the homepage particle lab. Astro check and production build passed; generated checks cover 14 pages and 464 internal links/assets/anchors. Homepage colour changes and Reset were exercised in-browser; 390px viewport had no horizontal overflow. Earlier particle checks above refer to the preceding concept.

## Editable CSS upgrade

Shape / Orbit / Type starters replace the earlier card controls. Browser-tested direct CSS input, live shape rendering, invalid property fallback, scene-switch draft retention, Orbit speed shortcut, Type outline shortcut, Reset, expanded dialog and Escape close. Preview uses a script-disabled sandbox with an outbound-blocking CSP. Ten unit tests cover lifecycle and the added CSS validation/defaults/preview isolation checks. CSS syntax validation is intentionally a supported-CSS subset; drafts are in memory and are cleared by page refresh.

## Read-only playground revision

User selected the Live Code Playground with direct editing disabled. The textarea is now read-only; editor prompts and example hints point to effect buttons. Presets are bounded per example, so repeated clicks replace overrides instead of accumulating unlimited CSS. Browser-confirmed readonly state, Make it round updating the generated code and preview, and Reset. Astro check/build and 15-page / 497-link artifact checks passed. Earlier direct-edit checks describe the prior version.

## Retired concept cleanup

Removed both standalone /lab/ comparison pages, the particle component and script, and their unused styles. Kept the homepage read-only Live Code Playground and its four examples. Original legacy root files and source photographs are unchanged. Astro check, ten tests, static build and checks of 13 pages / 437 internal links passed. Homepage Make it round was verified in the browser. Retired files are archived outside the repo in the local work directory; they are not included in the deployment.

## Logo display fix

Removed the oversized, translated image and clipping rules at all breakpoints. The header now presents the original complete logo through a viewBox around its artwork, excluding only surrounding whitespace. Original image is unchanged. Desktop and 360px browser review confirmed all logo lettering and the symbol are visible; mobile had no horizontal overflow. Astro check, build and generated link checks passed.

## PR preparation — 27 October 2026

- Fresh `npm ci`, Astro check (29 files), all 10 unit tests, static build and 13-page / 437-target build validation passed before dependency patching.
- Selected photographs from six albums were reviewed in the local desktop Gallery and 390px mobile Gallery/Join layouts. Original PNG assets are preserved.
- GitHub Pages workflow reviewed: only main can publish; PR checks have read-only permissions; deploy needs a successful checked build; uploaded artifact is `dist`; publishing uses the `github-pages` environment. Both workflow files parse as YAML.
- Pages is currently legacy main/root publishing. Current account has write access, not admin access. Owner must switch Pages Source to GitHub Actions before the first production rollout. No live Pages deployment is claimed by this PR.
- Patched transitive `fast-uri` and `undici` within their existing compatible ranges. Re-ran Astro check, all 10 tests, build and 437-target validation successfully; `npm audit` reports zero known vulnerabilities at preparation time.
