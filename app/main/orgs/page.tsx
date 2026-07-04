import { listOrganizationsPublic } from "@/lib/actions/organization.action";
import OrgsClient from "./orgs-client";

export const dynamic = "force-dynamic";

export default async function OrgsPage() {
  const organizations = await listOrganizationsPublic();
  return <OrgsClient organizations={organizations} />;
}
