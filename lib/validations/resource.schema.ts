import { z } from "zod";

export const resourceInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title is too long"),
  category: z.enum(["Essential", "Guideline", "Form", "Other"]),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(1000, "Description is too long"),
  fileType: z.enum(["PDF", "Link", "Doc"]),
  url: z
    .string()
    .trim()
    .min(1, "URL is required")
    .max(2000, "URL is too long"),
});

export type ResourceInput = z.infer<typeof resourceInputSchema>;
