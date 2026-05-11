import { cookies } from "next/headers";
import { OIR_AUTH } from "@/constant";
import { verifyAuthToken } from "@/lib/jwt";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User.model";
import {
  getMyNotices,
  type FullNotice,
} from "@/lib/actions/notice.action";
import { STUDENT_ID_PATTERN } from "@/lib/models/Notice.model";
import BoardClient from "./board-client";

export const dynamic = "force-dynamic";

export default async function NoticeBoardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(OIR_AUTH)?.value;

  let ownerBatchId: string | null = null;
  let ownerNotices: FullNotice[] = [];

  if (token) {
    const payload = await verifyAuthToken(token);
    if (payload?.userId) {
      await dbConnect();
      const user = await User.findById(payload.userId)
        .select("batchId role")
        .lean<{ batchId: string; role: string }>()
        .exec();
      // Only treat as "owner" if it's a student with a properly formatted S-id.
      if (
        user &&
        user.role === "student" &&
        STUDENT_ID_PATTERN.test(user.batchId)
      ) {
        ownerBatchId = user.batchId;
        ownerNotices = await getMyNotices();
      }
    }
  }

  return (
    <BoardClient ownerBatchId={ownerBatchId} ownerNotices={ownerNotices} />
  );
}
