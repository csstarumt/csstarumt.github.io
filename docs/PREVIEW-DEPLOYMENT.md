# CSS review deployment — 13 October 2026

Share URL: https://tarumt-css-preview.vercel.app/Css-website/

Independent Vercel project: `kongjiyus-projects/tarumt-css-preview` (`prj_NflsQ3CjW7GN6blhtnaulU9K5hOo`).
Deployment: `dpl_AsTP3rj91tHpRcrmyKhQCcn87x2A`, READY.

The CLI was invoked with target preview, but Vercel classified the first deployment of the new project as production and assigned its new project domain. This does not replace the society's existing GitHub Pages website. No GitHub push, merge, PR, or Pages setting change occurred. At the time of that deployment, the source was uncommitted on local branch `redesign/bright-community`.

Only static files copied from the tested local dist directory were uploaded. Deployment staging directory: `work/vercel-preview` in this chat workspace; its `.vercel/project.json` links to the isolated project. The `/Css-website/` base is retained. The root redirects there. The review copy carries X-Robots-Tag: noindex, nofollow and root robots.txt disallows crawlers.

Anonymous HTTP checks passed for 7 public pages and 8 homepage assets. No authentication cookie or token was sent. Browser check confirmed the read-only code field and Make it round effect work on the hosted homepage. The unique deployment URL is protected; share the project domain above instead. No deployment-protection setting was disabled.

Updates are manual snapshots; local changes will not appear on the shared site automatically. Future updates should verify the linked project before uploading new built output. The comparison lab pages have been removed from the current preview. Only the homepage Live Code Playground remains.

Cleanup redeployed successfully: anonymous homepage HTTP 200; /lab/components/ and /lab/playground/ HTTP 404.

## Repository integration — 27 October 2026

The redesign and GitHub Pages workflow are being submitted through a feature-branch PR. This Vercel snapshot is independent and does not include the newly selected album photographs. The new photographs were reviewed locally; use the PR branch build for the latest source. Pages requires the owner setup described in README.md.
