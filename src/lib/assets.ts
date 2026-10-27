import type { ImageMetadata } from "astro";
const files = import.meta.glob<{ default: ImageMetadata }>(
  "../../image/*.{png,jpg}",
  { eager: true },
);
export const assets = Object.fromEntries(
  Object.entries(files).map(([path, mod]) => [
    path.split("/").pop()!,
    mod.default,
  ]),
);
export function asset(name: string): ImageMetadata {
  const image = assets[name];
  if (!image) throw new Error(`Missing image: ${name}`);
  return image;
}
