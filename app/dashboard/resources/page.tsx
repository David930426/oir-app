import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OIR_AUTH } from "@/constant";
import { verifyAuthToken } from "@/lib/jwt";
import { listResourcesAdmin } from "@/lib/actions/resource.action";
import ResourceClient from "./resource-client";

export const dynamic = "force-dynamic";

export default async function AdminResourcesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(OIR_AUTH)?.value;
  if (!token) redirect("/login");

  const payload = await verifyAuthToken(token);
  if (!payload || payload.role !== "admin") redirect("/main");

  const resources = await listResourcesAdmin();

  return <ResourceClient initialResources={resources} />;
}
