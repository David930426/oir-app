import { z } from "zod";

export const categoryNameSchema = z
  .string()
  .trim()
  .min(1, "Category name is required")
  .max(60, "Category name is too long");

export const bulletinInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title is too long"),
  category: z
    .string()
    .trim()
    .min(1, "Category is required")
    .max(60, "Category is too long"),
  description: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(5000, "Content is too long"),
  published: z.boolean(),
});

export type BulletinInput = z.infer<typeof bulletinInputSchema>;
