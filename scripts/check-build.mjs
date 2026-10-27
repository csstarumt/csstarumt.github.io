import { readdir, readFile, stat } from "node:fs/promises";
import { resolve, join } from "node:path";
import assert from "node:assert/strict";
const root = resolve("dist");
async function walk(dir) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) result.push(...(await walk(path)));
    else result.push(path);
  }
  return result;
}
const files = await walk(root),
  pages = files.filter((f) => f.endsWith(".html"));
let links = 0;
const origin = "https://theycallmewinson.github.io";
for (const page of pages) {
  const html = await readFile(page, "utf8");
  assert.equal(
    (html.match(/<h1(?:\s|>)/g) || []).length,
    1,
    `${page}: exactly one H1`,
  );
  assert.match(html, /<html lang="en"/);
  assert.match(html, /<meta name="description"/);
  assert.match(html, /<link rel="canonical"/);
  const path =
    "/Css-website/" + page.slice(root.length + 1).replace(/index\.html$/, "");
  for (const match of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const raw = match[1].replaceAll("&amp;", "&");
    if (/^(?:mailto:|data:|tel:)/.test(raw)) continue;
    const u = new URL(raw, origin + path);
    if (u.origin !== origin) continue;
    assert.ok(
      u.pathname.startsWith("/Css-website/"),
      `Missing base prefix: ${raw} in ${path}`,
    );
    let file = join(
      root,
      decodeURIComponent(u.pathname.slice("/Css-website/".length)),
    );
    if ((await stat(file).catch(() => null))?.isDirectory())
      file = join(file, "index.html");
    assert.ok(files.includes(file), `Broken local target: ${raw} in ${path}`);
    if (u.hash && file.endsWith(".html")) {
      const target = await readFile(file, "utf8");
      assert.ok(
        target.includes(`id="${decodeURIComponent(u.hash.slice(1))}"`),
        `Missing anchor: ${raw}`,
      );
    }
    links++;
  }
}
const map = await readFile(join(root, "sitemap.xml"), "utf8");
assert.ok(!map.includes("tarumt-ctf-2026"));
assert.ok(!map.includes("ant-international-open-day-planned"));
assert.ok(!files.some((f) => f.includes("tarumt-ctf-2026")));
const old = await readFile(
  join(root, "events/github-workshop-2026/index.html"),
  "utf8",
);
assert.match(old, /This event has ended/);
assert.match(old, /<a[^>]*hidden[^>]*data-registration/);
console.log(
  `PASS: ${pages.length} HTML pages, ${links} internal links/assets/anchors, metadata, draft exclusion and archived registration.`,
);
