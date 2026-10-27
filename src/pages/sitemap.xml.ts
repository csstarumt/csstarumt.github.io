import { getCollection } from "astro:content";
import { url } from "../lib/site";
export async function GET() {
  const pages = [
    "",
    "about/",
    "events/",
    "gallery/",
    "join/",
    ...(await getCollection("events", ({ data }) => !data.draft)).map(
      (e) => `events/${e.id}/`,
    ),
  ];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map((p) => `<url><loc>https://csstarumt.github.io${url(p)}</loc></url>`).join("")}</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
}
