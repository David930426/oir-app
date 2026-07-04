"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import dbConnect from "../dbConnect";
import Resource from "../models/Resource.model";
import User from "../models/User.model";
import { OIR_AUTH } from "@/constant";
import { verifyAuthToken } from "@/lib/jwt";
import { resourceInputSchema } from "@/lib/validations/resource.schema";
import { objectIdSchema } from "@/lib/validations/auth.schema";
import { logger } from "../logger";

export type ActionResult =
  | { success: true; message?: string }
  | { success: false; error: string };

// Shape consumed by the public resources page (matches the legacy Resource shape).
export interface PublicResource {
  id: string;
  title: string;
  category: string;
  description: string;
  fileType: string;
  url: string;
}

export interface AdminResource extends PublicResource {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

async function requireAdmin(): Promise<
  { ok: true; userId: string } | { ok: false; error: string }
> {
  const cookieStore = await cookies();
  const token = cookieStore.get(OIR_AUTH)?.value;
  if (!token) return { ok: false, error: "You must be signed in." };

  const payload = await verifyAuthToken(token);
  if (!payload?.userId) return { ok: false, error: "You must be signed in." };

  await dbConnect();
  const user = await User.findById(payload.userId)
    .select("role")
    .lean<{ role: string }>()
    .exec();
  if (!user) return { ok: false, error: "You must be signed in." };
  if (user.role !== "admin")
    return { ok: false, error: "Admin access required." };
  return { ok: true, userId: payload.userId };
}

function toFriendlyError(error: unknown): string {
  const err = error as {
    name?: string;
    errors?: Record<string, { message?: string }>;
    message?: string;
  };
  if (err?.name === "ValidationError" && err.errors) {
    const first = Object.values(err.errors)[0];
    return first?.message ?? "Validation failed.";
  }
  return "An unexpected error occurred.";
}

function toDateString(value: unknown): string {
  return value instanceof Date ? value.toISOString() : String(value);
}

function serializePublic(doc: any): PublicResource {
  return {
    id: doc._id.toString(),
    title: doc.title,
    category: doc.category,
    description: doc.description,
    fileType: doc.fileType,
    url: doc.url,
  };
}

function serializeAdmin(doc: any): AdminResource {
  return {
    ...serializePublic(doc),
    _id: doc._id.toString(),
    createdAt: toDateString(doc.createdAt),
    updatedAt: toDateString(doc.updatedAt),
  };
}

// --- Public: resources shown on the main page ---
export async function listResourcesPublic(): Promise<PublicResource[]> {
  await dbConnect();
  const rows = await Resource.find({}).sort({ createdAt: -1 }).lean().exec();
  return rows.map(serializePublic);
}

// --- Admin: list every resource ---
export async function listResourcesAdmin(): Promise<AdminResource[]> {
  const auth = await requireAdmin();
  if (!auth.ok) return [];

  await dbConnect();
  const rows = await Resource.find({}).sort({ createdAt: -1 }).lean().exec();
  return rows.map(serializeAdmin);
}

// --- Admin: fetch a single resource (for the edit page) ---
export async function getResourceAdmin(
  id: string,
): Promise<AdminResource | null> {
  const auth = await requireAdmin();
  if (!auth.ok) return null;

  const parsedId = objectIdSchema.safeParse(id);
  if (!parsedId.success) return null;

  await dbConnect();
  const doc = await Resource.findById(parsedId.data).lean().exec();
  return doc ? serializeAdmin(doc) : null;
}

// --- Admin: create resource ---
export async function createResource(data: unknown): Promise<ActionResult> {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return { success: false, error: auth.error };

    const parsed = resourceInputSchema.safeParse(data);
    if (!parsed.success)
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid resource data.",
      };

    await dbConnect();
    await Resource.create(parsed.data);
    revalidatePath("/dashboard/resources");
    revalidatePath("/main/resources");
    return { success: true, message: "Resource created." };
  } catch (error) {
    logger.error({ action: "createResource", error }, "Create resource failed");
    return { success: false, error: toFriendlyError(error) };
  }
}

// --- Admin: update resource ---
export async function updateResource(
  id: string,
  data: unknown,
): Promise<ActionResult> {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return { success: false, error: auth.error };

    const parsedId = objectIdSchema.safeParse(id);
    if (!parsedId.success)
      return { success: false, error: "Invalid resource id." };

    const parsed = resourceInputSchema.safeParse(data);
    if (!parsed.success)
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid resource data.",
      };

    await dbConnect();
    const updated = await Resource.findByIdAndUpdate(
      parsedId.data,
      parsed.data,
      { new: true, runValidators: true },
    ).select("_id");
    if (!updated) return { success: false, error: "Resource not found." };

    revalidatePath("/dashboard/resources");
    revalidatePath("/main/resources");
    return { success: true, message: "Resource updated." };
  } catch (error) {
    logger.error({ action: "updateResource", error }, "Update resource failed");
    return { success: false, error: toFriendlyError(error) };
  }
}

// --- Admin: delete resource ---
export async function deleteResource(id: string): Promise<ActionResult> {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return { success: false, error: auth.error };

    const parsedId = objectIdSchema.safeParse(id);
    if (!parsedId.success)
      return { success: false, error: "Invalid resource id." };

    await dbConnect();
    const result = await Resource.findByIdAndDelete(parsedId.data).select(
      "_id",
    );
    if (!result) return { success: false, error: "Resource not found." };

    revalidatePath("/dashboard/resources");
    revalidatePath("/main/resources");
    return { success: true, message: "Resource deleted." };
  } catch (error) {
    logger.error({ action: "deleteResource", error }, "Delete resource failed");
    return { success: false, error: toFriendlyError(error) };
  }
}

const idArraySchema = z
  .array(objectIdSchema)
  .min(1, "Select at least one resource.")
  .max(500, "Too many resources selected.");

// --- Admin: bulk delete resources ---
export async function bulkDeleteResources(
  ids: string[],
): Promise<ActionResult & { deletedCount?: number }> {
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
    const result = await Resource.deleteMany({ _id: { $in: parsed.data } });

    revalidatePath("/dashboard/resources");
    revalidatePath("/main/resources");
    return {
      success: true,
      message: `Deleted ${result.deletedCount} resource${result.deletedCount === 1 ? "" : "s"}.`,
      deletedCount: result.deletedCount,
    };
  } catch (error) {
    logger.error(
      { action: "bulkDeleteResources", error },
      "Bulk delete resources failed",
    );
    return { success: false, error: toFriendlyError(error) };
  }
}
