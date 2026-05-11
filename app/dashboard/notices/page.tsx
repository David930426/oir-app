import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OIR_AUTH } from "@/constant";
import { verifyAuthToken } from "@/lib/jwt";
import {
  listNoticesAdmin,
  listStudentBatchIds,
} from "@/lib/actions/notice.action";
import NoticesClient from "./notices-client";

export const dynamic = "force-dynamic";

export default async function NoticesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(OIR_AUTH)?.value;
  if (!token) redirect("/login");

  const payload = await verifyAuthToken(token);
  if (!payload || payload.role !== "admin") redirect("/main");

  const [notices, students] = await Promise.all([
    listNoticesAdmin(),
    listStudentBatchIds(),
  ]);

  return <NoticesClient initialNotices={notices} students={students} />;
}
