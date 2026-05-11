"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import dbConnect from "../dbConnect";
import User from "../models/User.model";
import { studentIdSchema } from "@/lib/validations/notice.schema";
import { logger } from "../logger";

const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  batchId: studentIdSchema,
  email: z.email("Please enter a valid email").trim().toLowerCase(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128),
});

export async function registerUser(data: unknown) {
  try {
    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message ?? "Invalid input.",
      };
    }
    const { name, batchId, email, password } = parsed.data;

    await dbConnect();

    const existingUser = await User.findOne({
      $or: [{ batchId }, { email }],
    }).select("_id");
    if (existingUser) {
      return { error: "An account with that Student ID or email already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      batchId,
      email,
      password: hashedPassword,
      role: "student",
    });

    return { success: true };
  } catch (error) {
    logger.error({ action: "registerUser", error }, "Register failed");
    const err = error as {
      code?: number;
      keyPattern?: Record<string, unknown>;
      name?: string;
      errors?: Record<string, { message?: string }>;
    };
    if (err?.code === 11000) {
      const field = Object.keys(err.keyPattern ?? {})[0] ?? "field";
      return { error: `An account with that ${field} already exists.` };
    }
    if (err?.name === "ValidationError" && err.errors) {
      const first = Object.values(err.errors)[0];
      return { error: first?.message ?? "Validation failed." };
    }
    return { error: "Failed to register account." };
  }
}
