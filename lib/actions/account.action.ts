"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import dbConnect from "../dbConnect";
import User from "../models/User.model";
import { OIR_AUTH } from "@/constant";
import { verifyAuthToken } from "@/lib/jwt";
import {
  accountSchema,
  objectIdSchema,
} from "@/lib/validations/auth.schema";
import { logger } from "../logger";

export type ActionResult =
  | { success: true; message?: string }
  | { success: false; error: string };

const idArraySchema = z
  .array(objectIdSchema)
  .min(1, "Select at least one account.")
  .max(500, "Too many accounts selected.");

async function requireAdmin(): Promise<
  { ok: true; userId: string } | { ok: false; error: string }
> {
  const cookieStore = await cookies();
  const token = cookieStore.get(OIR_AUTH)?.value;
  if (!token) return { ok: false, error: "You must be signed in." };

  const payload = await verifyAuthToken(token);
  if (!payload || !payload.userId || payload.role !== "admin") {
    return { ok: false, error: "You are not authorized to do that." };
  }
  return { ok: true, userId: payload.userId };
}

function toFriendlyError(error: unknown): string {
  const err = error as {
    code?: number;
    keyPattern?: Record<string, unknown>;
    name?: string;
    errors?: Record<string, { message?: string }>;
    message?: string;
  };
  if (err?.code === 11000) {
    const field = Object.keys(err.keyPattern ?? {})[0] ?? "field";
    return `An account with that ${field} already exists.`;
  }
  if (err?.name === "ValidationError" && err.errors) {
    const first = Object.values(err.errors)[0];
    return first?.message ?? "Validation failed.";
  }
  return "An unexpected error occurred. Please try again.";
}

export async function toggleApproveAccount(
  id: string,
  approved: boolean,
): Promise<ActionResult> {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return { success: false, error: auth.error };

    const parsed = objectIdSchema.safeParse(id);
    if (!parsed.success)
      return { success: false, error: "Invalid account id." };

    await dbConnect();
    const result = await User.findByIdAndUpdate(
      parsed.data,
      { approved },
      { new: true },
    ).select("_id");
    if (!result)
      return { success: false, error: "Account not found." };

    revalidatePath("/dashboard/accounts");
    return {
      success: true,
      message: approved ? "Account approved." : "Approval revoked.",
    };
  } catch (error) {
    logger.error({ action: "toggleApproveAccount", error }, "Toggle approve failed");
    return { success: false, error: toFriendlyError(error) };
  }
}

export async function bulkApproveAccounts(
  ids: string[],
): Promise<ActionResult> {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return { success: false, error: auth.error };

    const parsed = idArraySchema.safeParse(ids);
    if (!parsed.success)
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid selection.",
      };

    await dbConnect();
    const result = await User.updateMany(
      { _id: { $in: parsed.data }, approved: { $ne: true } },
      { $set: { approved: true } },
    );

    revalidatePath("/dashboard/accounts");
    return {
      success: true,
      message:
        result.modifiedCount === 0
          ? "No new accounts to approve."
          : `Approved ${result.modifiedCount} account${result.modifiedCount === 1 ? "" : "s"}.`,
    };
  } catch (error) {
    logger.error({ action: "bulkApproveAccounts", error }, "Bulk approve failed");
    return { success: false, error: toFriendlyError(error) };
  }
}

export async function deleteAccount(id: string): Promise<ActionResult> {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return { success: false, error: auth.error };

    const parsed = objectIdSchema.safeParse(id);
    if (!parsed.success)
      return { success: false, error: "Invalid account id." };

    if (auth.userId === parsed.data) {
      return {
        success: false,
        error: "You cannot delete your own account.",
      };
    }

    await dbConnect();
    const result = await User.findByIdAndDelete(parsed.data).select("_id");
    if (!result)
      return { success: false, error: "Account not found." };

    revalidatePath("/dashboard/accounts");
    return { success: true, message: "Account deleted." };
  } catch (error) {
    logger.error({ action: "deleteAccount", error }, "Delete failed");
    return { success: false, error: toFriendlyError(error) };
  }
}

export async function bulkDeleteAccounts(
  ids: string[],
): Promise<ActionResult> {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return { success: false, error: auth.error };

    const parsed = idArraySchema.safeParse(ids);
    if (!parsed.success)
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid selection.",
      };

    const safeIds = parsed.data.filter((targetId) => targetId !== auth.userId);
    if (safeIds.length === 0) {
      return {
        success: false,
        error: "You cannot delete your own account.",
      };
    }

    await dbConnect();
    const result = await User.deleteMany({ _id: { $in: safeIds } });

    revalidatePath("/dashboard/accounts");
    return {
      success: true,
      message: `Deleted ${result.deletedCount} account${result.deletedCount === 1 ? "" : "s"}.`,
    };
  } catch (error) {
    logger.error({ action: "bulkDeleteAccounts", error }, "Bulk delete failed");
    return { success: false, error: toFriendlyError(error) };
  }
}

export async function createOrUpdateAccount(
  id: string | null,
  data: unknown,
): Promise<ActionResult> {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return { success: false, error: auth.error };

    const parsed = accountSchema.safeParse(data);
    if (!parsed.success)
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid account data.",
      };

    const { name, batchId, email, role, password } = parsed.data;

    if (!id && (!password || password.length < 6)) {
      return {
        success: false,
        error: "Password must be at least 6 characters.",
      };
    }
    if (password && password.length > 0 && password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters.",
      };
    }

    const updatePayload: Record<string, unknown> = {
      name,
      batchId,
      email,
      role,
    };
    if (password) {
      updatePayload.password = await bcrypt.hash(password, 10);
    }

    await dbConnect();

    if (id) {
      const parsedId = objectIdSchema.safeParse(id);
      if (!parsedId.success)
        return { success: false, error: "Invalid account id." };

      if (auth.userId === parsedId.data && role !== "admin") {
        return {
          success: false,
          error: "You cannot remove your own admin role.",
        };
      }

      const updated = await User.findByIdAndUpdate(
        parsedId.data,
        updatePayload,
        { new: true, runValidators: true },
      ).select("_id");
      if (!updated)
        return { success: false, error: "Account not found." };

      revalidatePath("/dashboard/accounts");
      return { success: true, message: "Account updated." };
    }

    await User.create({ ...updatePayload, approved: true });
    revalidatePath("/dashboard/accounts");
    return { success: true, message: "Account created." };
  } catch (error) {
    logger.error({ action: "createOrUpdateAccount", error }, "Create/update failed");
    return { success: false, error: toFriendlyError(error) };
  }
}
