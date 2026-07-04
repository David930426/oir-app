import {
  listPublishedBulletins,
  listPublicCategories,
} from "@/lib/actions/bulletin.action";
import BulletinClient from "./bulletin-client";

export const dynamic = "force-dynamic";

export default async function BulletinPage() {
  const [bulletins, categories] = await Promise.all([
    listPublishedBulletins(),
    listPublicCategories(),
  ]);

  return <BulletinClient bulletins={bulletins} categories={categories} />;
}
