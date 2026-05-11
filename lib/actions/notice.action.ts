"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import dbConnect from "../dbConnect";
import Notice from "../models/Notice.model";
import User from "../models/User.model";
import { OIR_AUTH } from "@/constant";
import { verifyAuthToken } from "@/lib/jwt";
import {
  noticeInputSchema,
  studentIdSchema,
} from "@/lib/validations/notice.schema";
import { objectIdSchema } from "@/lib/validations/auth.schema";
import { logger } from "../logger";

export type ActionResult =
  | { success: true; message?: string }
  | { success: false; error: string };

export interface AdminNotice {
  _id: string;
  studentId: string;
  type: "Package" | "Document" | "Letter" | "ARC" | "Other";
  status: "Ready" | "Action Needed" | "Picked Up";
  location: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface FullNotice {
  _id: string;
  studentId: string;
  type: AdminNotice["type"];
  status: AdminNotice["status"];
  location: string;
  description: string;
  createdAt: string;
}

export interface PublicNotice {
  _id: string;
  studentId: string;
  type: AdminNotice["type"];
  status: AdminNotice["status"];
  createdAt: string;
}

async function getSession(): Promise<
  { userId: string; role: string; batchId: string } | null
> {
  const cookieStore = await cookies();
  const token = cookieStore.get(OIR_AUTH)?.value;
  if (!token) return null;
  const payload = await verifyAuthToken(token);
  if (!payload?.userId) return null;

  await dbConnect();
  const user = await User.findById(payload.userId)
    .select("batchId role")
    .lean<{ batchId: string; role: string }>()
    .exec();
  if (!user) return null;
  return {
    userId: payload.userId,
    role: user.role,
    batchId: user.batchId,
  };
}

async function requireAdmin(): Promise<
  | { ok: true; userId: string }
  | { ok: false; error: string }
> {
  const session = await getSession();
  if (!session) return { ok: false, error: "You must be signed in." };
  if (session.role !== "admin")
    return { ok: false, error: "Admin access required." };
  return { ok: true, userId: session.userId };
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

function serializeAdmin(doc: any): AdminNotice {
  return {
    _id: doc._id.toString(),
    studentId: doc.studentId,
    type: doc.type,
    status: doc.status,
    location: doc.location,
    description: doc.description,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : String(doc.updatedAt),
  };
}

function serializeFull(doc: any): FullNotice {
  return {
    _id: doc._id.toString(),
    studentId: doc.studentId,
    type: doc.type,
    status: doc.status,
    location: doc.location,
    description: doc.description,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
  };
}

function serializePublic(doc: any): PublicNotice {
  return {
    _id: doc._id.toString(),
    studentId: doc.studentId,
    type: doc.type,
    status: doc.status,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
  };
}

// --- Admin: list all ---
export async function listNoticesAdmin(): Promise<AdminNotice[]> {
  const auth = await requireAdmin();
  if (!auth.ok) return [];

  const rows = await Notice.find({})
    .sort({ createdAt: -1 })
    .lean()
    .exec();
  return rows.map(serializeAdmin);
}

// --- Admin: create ---
export async function createNotice(data: unknown): Promise<ActionResult> {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return { success: false, error: auth.error };

    const parsed = noticeInputSchema.safeParse(data);
    if (!parsed.success)
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid notice data.",
      };

    await dbConnect();
    await Notice.create(parsed.data);
    revalidatePath("/dashboard/notices");
    revalidatePath("/main/board");
    return { success: true, message: "Notice created." };
  } catch (error) {
    logger.error({ action: "createNotice", error }, "Create notice failed");
    return { success: false, error: toFriendlyError(error) };
  }
}

// --- Admin: list eligible students for the picker ---
export interface StudentOption {
  batchId: string;
  name: string;
}

export async function listStudentBatchIds(): Promise<StudentOption[]> {
  const auth = await requireAdmin();
  if (!auth.ok) return [];

  await dbConnect();
  const rows = await User.find({
    role: "student",
    approved: true,
    batchId: { $regex: /^S\d{8}$/ },
  })
    .select("batchId name")
    .sort({ batchId: 1 })
    .lean<Array<{ batchId: string; name: string }>>()
    .exec();
  return rows.map((u) => ({ batchId: u.batchId, name: u.name }));
}

// --- Admin: create the same notice for many students ---
const bulkCreateSchema = noticeInputSchema
  .omit({ studentId: true })
  .extend({
    studentIds: z
      .array(studentIdSchema)
      .min(1, "Select at least one student.")
      .max(500, "Too many students selected."),
  });

export async function bulkCreateNotices(
  data: unknown,
): Promise<ActionResult & { createdCount?: number }> {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return { success: false, error: auth.error };

    const parsed = bulkCreateSchema.safeParse(data);
    if (!parsed.success)
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid notice data.",
      };

    const { studentIds, ...rest } = parsed.data;
    const uniqueIds = Array.from(new Set(studentIds));

    await dbConnect();
    const docs = uniqueIds.map((studentId) => ({ ...rest, studentId }));
    const inserted = await Notice.insertMany(docs, {
      ordered: false,
      rawResult: false,
    });

    revalidatePath("/dashboard/notices");
    revalidatePath("/main/board");
    return {
      success: true,
      message: `Created ${inserted.length} notice${inserted.length === 1 ? "" : "s"}.`,
      createdCount: inserted.length,
    };
  } catch (error) {
    logger.error({ action: "bulkCreateNotices", error }, "Bulk create failed");
    return { success: false, error: toFriendlyError(error) };
  }
}

// --- Admin: update ---
export async function updateNotice(
  id: string,
  data: unknown,
): Promise<ActionResult> {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return { success: false, error: auth.error };

    const parsedId = objectIdSchema.safeParse(id);
    if (!parsedId.success)
      return { success: false, error: "Invalid notice id." };

    const parsed = noticeInputSchema.safeParse(data);
    if (!parsed.success)
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid notice data.",
      };

    await dbConnect();
    const updated = await Notice.findByIdAndUpdate(parsedId.data, parsed.data, {
      new: true,
      runValidators: true,
    }).select("_id");
    if (!updated) return { success: false, error: "Notice not found." };

    revalidatePath("/dashboard/notices");
    revalidatePath("/main/board");
    return { success: true, message: "Notice updated." };
  } catch (error) {
    logger.error({ action: "updateNotice", error }, "Update notice failed");
    return { success: false, error: toFriendlyError(error) };
  }
}

// --- Admin: update status only ---
export async function setNoticeStatus(
  id: string,
  status: "Ready" | "Action Needed" | "Picked Up",
): Promise<ActionResult> {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return { success: false, error: auth.error };

    const parsedId = objectIdSchema.safeParse(id);
    if (!parsedId.success)
      return { success: false, error: "Invalid notice id." };

    const parsedStatus = z
      .enum(["Ready", "Action Needed", "Picked Up"])
      .safeParse(status);
    if (!parsedStatus.success)
      return { success: false, error: "Invalid status." };

    await dbConnect();
    const updated = await Notice.findByIdAndUpdate(
      parsedId.data,
      { status: parsedStatus.data },
      { new: true },
    ).select("_id");
    if (!updated) return { success: false, error: "Notice not found." };

    revalidatePath("/dashboard/notices");
    revalidatePath("/main/board");
    return { success: true, message: `Marked as ${parsedStatus.data}.` };
  } catch (error) {
    logger.error({ action: "setNoticeStatus", error }, "Set status failed");
    return { success: false, error: toFriendlyError(error) };
  }
}

const idArraySchema = z
  .array(objectIdSchema)
  .min(1, "Select at least one notice.")
  .max(500, "Too many notices selected.");

// --- Admin: bulk delete ---
export async function bulkDeleteNotices(
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
    const result = await Notice.deleteMany({ _id: { $in: parsed.data } });

    revalidatePath("/dashboard/notices");
    revalidatePath("/main/board");
    return {
      success: true,
      message: `Deleted ${result.deletedCount} notice${result.deletedCount === 1 ? "" : "s"}.`,
      deletedCount: result.deletedCount,
    };
  } catch (error) {
    logger.error({ action: "bulkDeleteNotices", error }, "Bulk delete failed");
    return { success: false, error: toFriendlyError(error) };
  }
}

// --- Admin: delete ---
export async function deleteNotice(id: string): Promise<ActionResult> {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return { success: false, error: auth.error };

    const parsedId = objectIdSchema.safeParse(id);
    if (!parsedId.success)
      return { success: false, error: "Invalid notice id." };

    await dbConnect();
    const result = await Notice.findByIdAndDelete(parsedId.data).select("_id");
    if (!result) return { success: false, error: "Notice not found." };

    revalidatePath("/dashboard/notices");
    revalidatePath("/main/board");
    return { success: true, message: "Notice deleted." };
  } catch (error) {
    logger.error({ action: "deleteNotice", error }, "Delete notice failed");
    return { success: false, error: toFriendlyError(error) };
  }
}

// --- Student-side: load my notices in full detail ---
export async function getMyNotices(): Promise<FullNotice[]> {
  const session = await getSession();
  if (!session) return [];
  const parsed = studentIdSchema.safeParse(session.batchId);
  if (!parsed.success) return []; // Only S\d{8} students have notices

  const rows = await Notice.find({ studentId: parsed.data })
    .sort({ createdAt: -1 })
    .lean()
    .exec();
  return rows.map(serializeFull);
}

// --- Public search: returns minimal info only ---
// If the caller is logged in as the owner of the queried studentId, returns full detail instead.
export type SearchResult =
  | { ok: true; level: "full"; notices: FullNotice[] }
  | { ok: true; level: "public"; notices: PublicNotice[] }
  | { ok: false; error: string };

export async function searchNoticesByStudentId(
  studentId: string,
): Promise<SearchResult> {
  const parsed = studentIdSchema.safeParse(studentId);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid Student ID." };
  }

  const session = await getSession();
  const isOwner =
    !!session && session.batchId.toUpperCase() === parsed.data;

  await dbConnect();
  const rows = await Notice.find({ studentId: parsed.data })
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  if (isOwner) {
    return { ok: true, level: "full", notices: rows.map(serializeFull) };
  }
  return { ok: true, level: "public", notices: rows.map(serializePublic) };
}
