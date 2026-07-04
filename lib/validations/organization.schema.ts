import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .max(500, "Link is too long")
  .optional()
  .or(z.literal(""));

export const organizationInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(200, "Name is too long"),
  category: z.enum(["International", "Nationality", "Social", "Hobby"]),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(1000, "Description is too long"),
  socialLinks: z.object({
    line: optionalUrl,
    instagram: optionalUrl,
    facebook: optionalUrl,
  }),
  upcomingEvents: z.array(z.string().trim().min(1).max(200)).max(50),
  membersCount: z.coerce.number().int().min(0, "Members count can't be negative"),
});

export type OrganizationInput = z.infer<typeof organizationInputSchema>;
