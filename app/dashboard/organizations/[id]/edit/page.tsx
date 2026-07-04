import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { OIR_AUTH } from "@/constant";
import { verifyAuthToken } from "@/lib/jwt";
import { getOrganizationAdmin } from "@/lib/actions/organization.action";
import OrgForm from "../../org-form";

export const dynamic = "force-dynamic";

export default async function EditOrganizationPage({
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
  const organization = await getOrganizationAdmin(id);
  if (!organization) notFound();

  return <OrgForm organization={organization} />;
}
