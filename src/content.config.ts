import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { assets } from "./lib/assets";
const imageName = z
  .string()
  .refine((name) => !!assets[name], "Image must exist in image/");
const date = z.union([
  z.iso.date(),
  z.iso
    .datetime({ offset: true })
    .refine(
      (value) => value.endsWith("+08:00"),
      "Use Malaysia +08:00 timezone",
    ),
]);
const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: z
    .object({
      title: z.string(),
      category: z.enum([
        "Workshop",
        "Industry Visit",
        "Conference",
        "Competition",
      ]),
      summary: z.string(),
      status: z.enum(["scheduled", "tba", "past", "cancelled"]),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      start: date.optional(),
      end: date.optional(),
      location: z.string().optional(),
      year: z.number().optional(),
      cover: imageName,
      coverAlt: z.string(),
      poster: imageName.optional(),
      registrationOpen: z.boolean().default(false),
      registrationUrl: z.url().optional(),
      registrationDeadline: date.optional(),
      albumUrl: z.url().optional(),
    })
    .superRefine((v, ctx) => {
      if (v.status === "scheduled" && !v.start)
        ctx.addIssue({
          code: "custom",
          message: "Scheduled events need a start date",
        });
      if (v.end && (!v.start || Date.parse(v.end) < Date.parse(v.start)))
        ctx.addIssue({ code: "custom", message: "End must follow start" });
      if (
        v.registrationOpen &&
        (!v.registrationUrl || v.status !== "scheduled")
      )
        ctx.addIssue({
          code: "custom",
          message: "Open registration needs a scheduled event and URL",
        });
    }),
});
export const collections = { events };
