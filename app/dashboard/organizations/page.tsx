import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OIR_AUTH } from "@/constant";
import { verifyAuthToken } from "@/lib/jwt";
import { listOrganizationsAdmin } from "@/lib/actions/organization.action";
import OrgClient from "./org-client";

export const dynamic = "force-dynamic";

export default async function AdminOrganizationsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(OIR_AUTH)?.value;
  if (!token) redirect("/login");

  const payload = await verifyAuthToken(token);
  if (!payload || payload.role !== "admin") redirect("/main");

  const organizations = await listOrganizationsAdmin();

  return <OrgClient initialOrganizations={organizations} />;
}
