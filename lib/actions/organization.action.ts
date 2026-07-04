"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import dbConnect from "../dbConnect";
import Organization from "../models/Organization.model";
import User from "../models/User.model";
import { OIR_AUTH } from "@/constant";
import { verifyAuthToken } from "@/lib/jwt";
import { organizationInputSchema } from "@/lib/validations/organization.schema";
import { objectIdSchema } from "@/lib/validations/auth.schema";
import { logger } from "../logger";

export type ActionResult =
  | { success: true; message?: string }
  | { success: false; error: string };

// Shape consumed by the public organizations page (matches the legacy Organization shape).
export interface PublicOrganization {
  id: string;
  name: string;
  category: string;
  description: string;
  socialLinks: {
    line?: string;
    instagram?: string;
    facebook?: string;
  };
  upcomingEvents: string[];
  membersCount: number;
}

export interface AdminOrganization extends PublicOrganization {
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

function serializePublic(doc: any): PublicOrganization {
  return {
    id: doc._id.toString(),
    name: doc.name,
    category: doc.category,
    description: doc.description,
    socialLinks: {
      line: doc.socialLinks?.line || undefined,
      instagram: doc.socialLinks?.instagram || undefined,
      facebook: doc.socialLinks?.facebook || undefined,
    },
    upcomingEvents: doc.upcomingEvents ?? [],
    membersCount: doc.membersCount ?? 0,
  };
}

function serializeAdmin(doc: any): AdminOrganization {
  return {
    ...serializePublic(doc),
    _id: doc._id.toString(),
    createdAt: toDateString(doc.createdAt),
    updatedAt: toDateString(doc.updatedAt),
  };
}

// --- Public: organizations shown on the main page ---
export async function listOrganizationsPublic(): Promise<PublicOrganization[]> {
  await dbConnect();
  const rows = await Organization.find({}).sort({ name: 1 }).lean().exec();
  return rows.map(serializePublic);
}

// --- Admin: list every organization ---
export async function listOrganizationsAdmin(): Promise<AdminOrganization[]> {
  const auth = await requireAdmin();
  if (!auth.ok) return [];

  await dbConnect();
  const rows = await Organization.find({}).sort({ name: 1 }).lean().exec();
  return rows.map(serializeAdmin);
}

// --- Admin: fetch a single organization (for the edit page) ---
export async function getOrganizationAdmin(
  id: string,
): Promise<AdminOrganization | null> {
  const auth = await requireAdmin();
  if (!auth.ok) return null;

  const parsedId = objectIdSchema.safeParse(id);
  if (!parsedId.success) return null;

  await dbConnect();
  const doc = await Organization.findById(parsedId.data).lean().exec();
  return doc ? serializeAdmin(doc) : null;
}

// --- Admin: create organization ---
export async function createOrganization(
  data: unknown,
): Promise<ActionResult> {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return { success: false, error: auth.error };

    const parsed = organizationInputSchema.safeParse(data);
    if (!parsed.success)
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid organization data.",
      };

    await dbConnect();
    await Organization.create(parsed.data);
    revalidatePath("/dashboard/organizations");
    revalidatePath("/main/orgs");
    return { success: true, message: "Organization created." };
  } catch (error) {
    logger.error(
      { action: "createOrganization", error },
      "Create organization failed",
    );
    return { success: false, error: toFriendlyError(error) };
  }
}

// --- Admin: update organization ---
export async function updateOrganization(
  id: string,
  data: unknown,
): Promise<ActionResult> {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return { success: false, error: auth.error };

    const parsedId = objectIdSchema.safeParse(id);
    if (!parsedId.success)
      return { success: false, error: "Invalid organization id." };

    const parsed = organizationInputSchema.safeParse(data);
    if (!parsed.success)
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid organization data.",
      };

    await dbConnect();
    const updated = await Organization.findByIdAndUpdate(
      parsedId.data,
      parsed.data,
      { new: true, runValidators: true },
    ).select("_id");
    if (!updated) return { success: false, error: "Organization not found." };

    revalidatePath("/dashboard/organizations");
    revalidatePath("/main/orgs");
    return { success: true, message: "Organization updated." };
  } catch (error) {
    logger.error(
      { action: "updateOrganization", error },
      "Update organization failed",
    );
    return { success: false, error: toFriendlyError(error) };
  }
}

// --- Admin: delete organization ---
export async function deleteOrganization(id: string): Promise<ActionResult> {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return { success: false, error: auth.error };

    const parsedId = objectIdSchema.safeParse(id);
    if (!parsedId.success)
      return { success: false, error: "Invalid organization id." };

    await dbConnect();
    const result = await Organization.findByIdAndDelete(parsedId.data).select(
      "_id",
    );
    if (!result) return { success: false, error: "Organization not found." };

    revalidatePath("/dashboard/organizations");
    revalidatePath("/main/orgs");
    return { success: true, message: "Organization deleted." };
  } catch (error) {
    logger.error(
      { action: "deleteOrganization", error },
      "Delete organization failed",
    );
    return { success: false, error: toFriendlyError(error) };
  }
}

const idArraySchema = z
  .array(objectIdSchema)
  .min(1, "Select at least one organization.")
  .max(500, "Too many organizations selected.");

// --- Admin: bulk delete organizations ---
export async function bulkDeleteOrganizations(
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
    const result = await Organization.deleteMany({ _id: { $in: parsed.data } });

    revalidatePath("/dashboard/organizations");
    revalidatePath("/main/orgs");
    return {
      success: true,
      message: `Deleted ${result.deletedCount} organization${result.deletedCount === 1 ? "" : "s"}.`,
      deletedCount: result.deletedCount,
    };
  } catch (error) {
    logger.error(
      { action: "bulkDeleteOrganizations", error },
      "Bulk delete organizations failed",
    );
    return { success: false, error: toFriendlyError(error) };
  }
}
