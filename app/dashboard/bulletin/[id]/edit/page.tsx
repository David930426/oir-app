import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { OIR_AUTH } from "@/constant";
import { verifyAuthToken } from "@/lib/jwt";
import {
  getBulletinAdmin,
  listCategoriesAdmin,
} from "@/lib/actions/bulletin.action";
import BulletinForm from "../../bulletin-form";

export const dynamic = "force-dynamic";

export default async function EditBulletinPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(OIR_AUTH)?.value;
  if (!token) redirect("/login");

  const payload = await verifyAuthToken(token);
  if (!payload || payload.role !== "admin") redirect("/main");

  const { id } = await params;
  const [bulletin, categories] = await Promise.all([
    getBulletinAdmin(id),
    listCategoriesAdmin(),
  ]);
  if (!bulletin) notFound();

  return <BulletinForm categories={categories} bulletin={bulletin} />;
}
