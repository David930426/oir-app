import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OIR_AUTH } from "@/constant";
import { verifyAuthToken } from "@/lib/jwt";
import { listCategoriesAdmin } from "@/lib/actions/bulletin.action";
import BulletinForm from "../bulletin-form";

export const dynamic = "force-dynamic";

export default async function NewBulletinPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(OIR_AUTH)?.value;
  if (!token) redirect("/login");

  const payload = await verifyAuthToken(token);
  if (!payload || payload.role !== "admin") redirect("/main");

  const categories = await listCategoriesAdmin();
  if (categories.length === 0) redirect("/dashboard/bulletin");

  return <BulletinForm categories={categories} />;
}
