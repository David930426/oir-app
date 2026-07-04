import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { OIR_AUTH } from "@/constant";
import { verifyAuthToken } from "@/lib/jwt";
import { getResourceAdmin } from "@/lib/actions/resource.action";
import ResourceForm from "../../resource-form";

export const dynamic = "force-dynamic";

export default async function EditResourcePage({
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
  const resource = await getResourceAdmin(id);
  if (!resource) notFound();

  return <ResourceForm resource={resource} />;
}
