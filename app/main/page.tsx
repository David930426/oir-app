import { listPublishedBulletins } from "@/lib/actions/bulletin.action";
import { HeroSection } from "@/components/hero-section";
import { Highlights } from "@/components/highlights";
import { QuickActions } from "@/components/quick-actionss";

export const dynamic = "force-dynamic";

export default async function Home() {
  const bulletins = await listPublishedBulletins();

  return (
    <div className="pb-8">
      <HeroSection />

      <div className="space-y-16 md:space-y-20 mt-[-2.5rem] md:mt-[-3rem] relative z-10">
        <QuickActions />

        <Highlights bulletins={bulletins} />
      </div>
    </div>
  );
}
