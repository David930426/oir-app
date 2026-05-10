import { z } from "zod";

export const loginSchema = z.object({
  batchId: z
    .string()
    .trim()
    .min(1, "Student ID is required")
    .max(64, "Student ID is too long"),
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
    .min(1, "Student ID is required")
    .max(64, "Student ID is too long"),
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
