import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicBulletin } from "@/lib/actions/bulletin.action";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BulletinBody } from "@/components/bulletin-body";
import { ArrowLeft, Building2, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

const RECENT_WINDOW_MS = 48 * 60 * 60 * 1000;

const dateFormat: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

export default async function PublicBulletinPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bulletin = await getPublicBulletin(id);
  if (!bulletin) notFound();

  const createdAt = new Date(bulletin.createdAt);
  const isRecent = Date.now() - createdAt.getTime() < RECENT_WINDOW_MS;

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-10 md:py-14">
      <Link
        href="/main/bulletin"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to bulletin
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {isRecent && (
          <Badge variant="destructive" className="rounded-full">
            New
          </Badge>
        )}
        <Badge className="rounded-full border-transparent bg-primary/10 text-primary">
          {bulletin.category}
        </Badge>
      </div>

      <h1 className="mt-4 font-heading text-3xl md:text-4xl lg:text-[2.75rem] font-medium leading-tight tracking-tight">
        {bulletin.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Building2 className="h-4 w-4" />
          Office of International Relations
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          {createdAt.toLocaleDateString(undefined, dateFormat)}
        </span>
      </div>

      <Separator className="my-8" />

      <BulletinBody text={bulletin.description} className="text-base" />
    </article>
  );
}
