import { z } from "zod";

// A valid Student/Admin ID is a single uppercase letter followed by digits.
// Students must be S + exactly 8 digits (enforced separately in studentIdSchema).
// Admins are typically A + digits.
export const BATCH_ID_PATTERN = /^[A-Z]\d+$/;

export const loginSchema = z.object({
  batchId: z
    .string()
    .trim()
    .toUpperCase()
    .max(64, "Student ID is too long")
    .regex(
      BATCH_ID_PATTERN,
      "Student/Admin ID must start with a letter followed by numbers (e.g. S12350130).",
    ),
  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password is too long"),
  rememberMe: z.boolean(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const objectIdSchema = z
  .string()
  .regex(/^[a-fA-F0-9]{24}$/, "Invalid account id");

export const accountSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  batchId: z
    .string()
    .trim()
    .toUpperCase()
    .max(64, "Student ID is too long")
    .regex(
      BATCH_ID_PATTERN,
      "ID must start with a letter followed by numbers (e.g. S12350130 or A001).",
    ),
  email: z
    .email("Please enter a valid email")
    .trim()
    .toLowerCase(),
  role: z.enum(["student", "admin"]),
  password: z
    .string()
    .max(128, "Password is too long")
    .optional()
    .or(z.literal("")),
});

export type AccountInput = z.infer<typeof accountSchema>;
