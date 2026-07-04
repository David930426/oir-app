"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import dbConnect from "../dbConnect";
import Bulletin from "../models/Bulletin.model";
import BulletinCategory from "../models/BulletinCategory.model";
import User from "../models/User.model";
import { OIR_AUTH } from "@/constant";
import { verifyAuthToken } from "@/lib/jwt";
import {
  bulletinInputSchema,
  categoryNameSchema,
} from "@/lib/validations/bulletin.schema";
import { objectIdSchema } from "@/lib/validations/auth.schema";
import { logger } from "../logger";

export type ActionResult =
  | { success: true; message?: string }
  | { success: false; error: string };

// Shape consumed by the public main page (matches the legacy NewsItem shape).
export interface PublicBulletin {
  id: string;
  title: string;
  category: string;
  date: string;
  createdAt: string;
  description: string;
}

export interface AdminBulletin extends PublicBulletin {
  _id: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryItem {
  _id: string;
  name: string;
}

export interface CategoryWithCount extends CategoryItem {
  articleCount: number;
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
    code?: number;
    errors?: Record<string, { message?: string }>;
    message?: string;
  };
  if (err?.code === 11000) return "That category already exists.";
  if (err?.name === "ValidationError" && err.errors) {
    const first = Object.values(err.errors)[0];
    return first?.message ?? "Validation failed.";
  }
  return "An unexpected error occurred.";
}

function toDateString(value: unknown): string {
  return value instanceof Date ? value.toISOString() : String(value);
}

function serializePublic(doc: any): PublicBulletin {
  return {
    id: doc._id.toString(),
    title: doc.title,
    category: doc.category,
    date: toDateString(doc.createdAt).split("T")[0],
    createdAt: toDateString(doc.createdAt),
    description: doc.description,
  };
}

function serializeAdmin(doc: any): AdminBulletin {
  return {
    ...serializePublic(doc),
    _id: doc._id.toString(),
    published: !!doc.published,
    createdAt: toDateString(doc.createdAt),
    updatedAt: toDateString(doc.updatedAt),
  };
}

function serializeCategory(doc: any): CategoryItem {
  return { _id: doc._id.toString(), name: doc.name };
}

// --- Public: bulletins shown on the main page ---
export async function listPublishedBulletins(): Promise<PublicBulletin[]> {
  await dbConnect();
  const rows = await Bulletin.find({ published: true })
    .sort({ createdAt: -1 })
    .lean()
    .exec();
  return rows.map(serializePublic);
}

// --- Public: a single published bulletin (for /main/bulletin/[id]) ---
export async function getPublicBulletin(
  id: string,
): Promise<PublicBulletin | null> {
  const parsedId = objectIdSchema.safeParse(id);
  if (!parsedId.success) return null;

  await dbConnect();
  const doc = await Bulletin.findOne({ _id: parsedId.data, published: true })
    .lean()
    .exec();
  return doc ? serializePublic(doc) : null;
}

// --- Public: category names for the main page filter ---
export async function listPublicCategories(): Promise<string[]> {
  await dbConnect();
  const rows = await BulletinCategory.find({})
    .sort({ name: 1 })
    .lean<Array<{ name: string }>>()
    .exec();
  return rows.map((c) => c.name);
}

// --- Admin: list every bulletin (drafts included) ---
export async function listBulletinsAdmin(): Promise<AdminBulletin[]> {
  const auth = await requireAdmin();
  if (!auth.ok) return [];

  const rows = await Bulletin.find({}).sort({ createdAt: -1 }).lean().exec();
  return rows.map(serializeAdmin);
}

// --- Admin: fetch a single bulletin (for the edit page) ---
export async function getBulletinAdmin(
  id: string,
): Promise<AdminBulletin | null> {
  const auth = await requireAdmin();
  if (!auth.ok) return null;

  const parsedId = objectIdSchema.safeParse(id);
  if (!parsedId.success) return null;

  const doc = await Bulletin.findById(parsedId.data).lean().exec();
  return doc ? serializeAdmin(doc) : null;
}

// --- Admin: list managed categories (name only, for form pickers) ---
export async function listCategoriesAdmin(): Promise<CategoryItem[]> {
  const auth = await requireAdmin();
  if (!auth.ok) return [];

  const rows = await BulletinCategory.find({}).sort({ name: 1 }).lean().exec();
  return rows.map(serializeCategory);
}

// --- Admin: list categories with how many bulletins reference each ---
export async function listCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  const auth = await requireAdmin();
  if (!auth.ok) return [];

  await dbConnect();
  const [cats, counts] = await Promise.all([
    BulletinCategory.find({})
      .sort({ name: 1 })
      .lean<Array<{ _id: { toString(): string }; name: string }>>()
      .exec(),
    Bulletin.aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]),
  ]);

  const countByName = new Map(counts.map((c) => [c._id, c.count]));
  return cats.map((c) => ({
    _id: c._id.toString(),
    name: c.name,
    articleCount: countByName.get(c.name) ?? 0,
  }));
}

// --- Admin: create bulletin ---
export async function createBulletin(data: unknown): Promise<ActionResult> {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return { success: false, error: auth.error };

    const parsed = bulletinInputSchema.safeParse(data);
    if (!parsed.success)
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid bulletin data.",
      };

    await dbConnect();
    await Bulletin.create(parsed.data);
    revalidatePath("/dashboard/bulletin");
    revalidatePath("/main/bulletin");
    return { success: true, message: "Bulletin published." };
  } catch (error) {
    logger.error({ action: "createBulletin", error }, "Create bulletin failed");
    return { success: false, error: toFriendlyError(error) };
  }
}

// --- Admin: update bulletin ---
export async function updateBulletin(
  id: string,
  data: unknown,
): Promise<ActionResult> {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return { success: false, error: auth.error };

    const parsedId = objectIdSchema.safeParse(id);
    if (!parsedId.success)
      return { success: false, error: "Invalid bulletin id." };

    const parsed = bulletinInputSchema.safeParse(data);
    if (!parsed.success)
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid bulletin data.",
      };

    await dbConnect();
    const updated = await Bulletin.findByIdAndUpdate(parsedId.data, parsed.data, {
      new: true,
      runValidators: true,
    }).select("_id");
    if (!updated) return { success: false, error: "Bulletin not found." };

    revalidatePath("/dashboard/bulletin");
    revalidatePath("/main/bulletin");
    return { success: true, message: "Bulletin updated." };
  } catch (error) {
    logger.error({ action: "updateBulletin", error }, "Update bulletin failed");
    return { success: false, error: toFriendlyError(error) };
  }
}

// --- Admin: delete bulletin ---
export async function deleteBulletin(id: string): Promise<ActionResult> {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return { success: false, error: auth.error };

    const parsedId = objectIdSchema.safeParse(id);
    if (!parsedId.success)
      return { success: false, error: "Invalid bulletin id." };

    await dbConnect();
    const result = await Bulletin.findByIdAndDelete(parsedId.data).select("_id");
    if (!result) return { success: false, error: "Bulletin not found." };

    revalidatePath("/dashboard/bulletin");
    revalidatePath("/main/bulletin");
    return { success: true, message: "Bulletin deleted." };
  } catch (error) {
    logger.error({ action: "deleteBulletin", error }, "Delete bulletin failed");
    return { success: false, error: toFriendlyError(error) };
  }
}

// --- Admin: add a category ---
export async function createCategory(name: unknown): Promise<ActionResult> {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return { success: false, error: auth.error };

    const parsed = categoryNameSchema.safeParse(name);
    if (!parsed.success)
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid category name.",
      };

    await dbConnect();
    const exists = await BulletinCategory.findOne({
      name: new RegExp(`^${escapeRegex(parsed.data)}$`, "i"),
    }).select("_id");
    if (exists) return { success: false, error: "That category already exists." };

    await BulletinCategory.create({ name: parsed.data });
    revalidatePath("/dashboard/bulletin");
    revalidatePath("/main/bulletin");
    return { success: true, message: `Added "${parsed.data}".` };
  } catch (error) {
    logger.error({ action: "createCategory", error }, "Create category failed");
    return { success: false, error: toFriendlyError(error) };
  }
}

// --- Admin: rename a category (cascades to every bulletin using it) ---
export async function renameCategory(
  id: string,
  name: unknown,
): Promise<ActionResult> {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return { success: false, error: auth.error };

    const parsedId = objectIdSchema.safeParse(id);
    if (!parsedId.success)
      return { success: false, error: "Invalid category id." };

    const parsed = categoryNameSchema.safeParse(name);
    if (!parsed.success)
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid category name.",
      };

    await dbConnect();
    const category = await BulletinCategory.findById(parsedId.data)
      .select("name")
      .lean<{ name: string }>();
    if (!category) return { success: false, error: "Category not found." };

    const newName = parsed.data;
    if (newName === category.name)
      return { success: true, message: "No changes." };

    // Reject a name that collides (case-insensitive) with a different category.
    const clash = await BulletinCategory.findOne({
      _id: { $ne: parsedId.data },
      name: new RegExp(`^${escapeRegex(newName)}$`, "i"),
    }).select("_id");
    if (clash)
      return { success: false, error: "That category already exists." };

    await BulletinCategory.findByIdAndUpdate(
      parsedId.data,
      { name: newName },
      { runValidators: true },
    );
    // Bulletins store the category by name, so cascade the rename to all of them.
    await Bulletin.updateMany(
      { category: category.name },
      { category: newName },
    );

    revalidatePath("/dashboard/bulletin");
    revalidatePath("/main/bulletin");
    return { success: true, message: `Renamed to "${newName}".` };
  } catch (error) {
    logger.error({ action: "renameCategory", error }, "Rename category failed");
    return { success: false, error: toFriendlyError(error) };
  }
}

// --- Admin: delete a category ---
export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return { success: false, error: auth.error };

    const parsedId = objectIdSchema.safeParse(id);
    if (!parsedId.success)
      return { success: false, error: "Invalid category id." };

    await dbConnect();
    const category = await BulletinCategory.findById(parsedId.data)
      .select("name")
      .lean<{ name: string }>();
    if (!category) return { success: false, error: "Category not found." };

    const inUse = await Bulletin.countDocuments({ category: category.name });
    if (inUse > 0)
      return {
        success: false,
        error: `Can't delete — ${inUse} bulletin${inUse === 1 ? "" : "s"} still use this category.`,
      };

    await BulletinCategory.findByIdAndDelete(parsedId.data).select("_id");
    revalidatePath("/dashboard/bulletin");
    revalidatePath("/main/bulletin");
    return { success: true, message: "Category deleted." };
  } catch (error) {
    logger.error({ action: "deleteCategory", error }, "Delete category failed");
    return { success: false, error: toFriendlyError(error) };
  }
}

const idArraySchema = z
  .array(objectIdSchema)
  .min(1, "Select at least one bulletin.")
  .max(500, "Too many bulletins selected.");

// --- Admin: bulk delete bulletins ---
export async function bulkDeleteBulletins(
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
    const result = await Bulletin.deleteMany({ _id: { $in: parsed.data } });

    revalidatePath("/dashboard/bulletin");
    revalidatePath("/main/bulletin");
    return {
      success: true,
      message: `Deleted ${result.deletedCount} bulletin${result.deletedCount === 1 ? "" : "s"}.`,
      deletedCount: result.deletedCount,
    };
  } catch (error) {
    logger.error(
      { action: "bulkDeleteBulletins", error },
      "Bulk delete bulletins failed",
    );
    return { success: false, error: toFriendlyError(error) };
  }
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
