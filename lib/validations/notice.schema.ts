import { z } from "zod";
import {
  NOTICE_STATUSES,
  NOTICE_TYPES,
  STUDENT_ID_PATTERN,
} from "@/lib/models/Notice.model";

export const studentIdSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(
    STUDENT_ID_PATTERN,
    "Student ID must be 'S' followed by 8 digits (e.g. S12350130).",
  );

export const noticeInputSchema = z.object({
  studentId: studentIdSchema,
  type: z.enum(NOTICE_TYPES),
  status: z.enum(NOTICE_STATUSES),
  location: z
    .string()
    .trim()
    .min(1, "Pickup location is required")
    .max(200, "Location is too long"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(1000, "Description is too long"),
});

export type NoticeInput = z.infer<typeof noticeInputSchema>;
