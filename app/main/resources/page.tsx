import { listResourcesPublic } from "@/lib/actions/resource.action";
import ResourcesClient from "./resources-client";

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const resources = await listResourcesPublic();
  return <ResourcesClient resources={resources} />;
}
