# Committee content guide

## Add an event

1. Upload your original image to `image/` using a short, stable filename.
2. Copy `docs/event-template.md.example` to `src/content/events/your-event-name.md`.
3. Replace the example data. Keep `draft: true` until the details are confirmed.
4. Run `npm run check && npm test && npm run build && npm run test:build` locally. In a future GitHub workflow, the check must pass before merging.
5. Preview the homepage, Events and detail page. Set `draft: false` only when ready.

Changing the Markdown title does not require changing the filename. Do not rename a published file without preserving its old URL.

## Fields

- `title`, `summary`: real event name and a short explanation; body below the frontmatter contains the longer description.
- `category`: Workshop, Industry Visit, Conference or Competition.
- `status`: scheduled, tba, past or cancelled. Scheduled needs `start`.
- `start`/`end`: quoted `YYYY-MM-DD` if only a day is known, or `YYYY-MM-DDTHH:mm:ss+08:00` for Malaysia time. Unknown dates stay absent; optional `year` is allowed for archives.
- `draft`: true hides the event from every page, search and sitemap.
- `cover`: exact filename in `image/`; use an actual event photo when available. `coverAlt` describes that photo.
- `poster`: optional original poster filename. If the poster is the only available image, it can also be the cover; it will be displayed without cropping.
- `albumUrl`: confirmed Google Photos album. Both Gallery and the event detail page will use it.
- `registrationOpen`: false by default. To open registration, the event must be scheduled with a start date and a `registrationUrl`.
- `registrationDeadline`: optional date/time; registration closes at that instant. A date-only deadline remains open through the end of that Malaysia calendar day.
- `featured`: available for editorial use. Homepage archive stories are intentionally curated; edit the homepage selection to change those two highlighted stories.

## Close or cancel registration

Set `registrationOpen: false` to close manually. Set `status: cancelled` for a cancelled event. Past events never display a registration button, even if the URL remains in the record. Date-only events turn past after 23:59:59.999 Malaysia time. Do not leave an event marked scheduled when you know it was cancelled.

The static HTML uses build time. Browser code refreshes status while a page is open. After deployment is authorized, the example daily build updates static listings too; scheduled runs can be delayed. A client's incorrect clock can affect its live status display. This site does not test whether Google Forms itself is accepting responses.

## Membership, contact and images

Change membership URL, email and social links in `src/lib/site.ts`. Joining the society and registering for an event are separate actions.

Keep original images. Astro builds responsive WebP images automatically. Avoid text over photos, stretched logos, invented dates or unverified participation numbers. Use the existing award images only for their stated 2025/2026 awards.

## Troubleshooting

A schema error names the offending file. Check image spelling/case, valid dates, end after start, and https links. Filenames are slugs; use lowercase letters, numbers and hyphens. A successful local build does not mean the live site has been published.
